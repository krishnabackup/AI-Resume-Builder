import dotenv from "dotenv";
import { pool } from "./config/postgresdb.js";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import notificationRoutes from "./routers/notification.router.js";


// Routers
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.router.js";
import templateRouter from "./routers/template.router.js";
import resumeRouter from "./routers/resume.router.js";
import templateVisibilityRouter from "./routers/templateVisibility.router.js";
import planRouter from "./routers/plan.router.js";
import blogRouter from "./routers/blog.router.js";

import downloadsRouter from "./routers/downloads.router.js";
import coverLetterRouter from "./routers/coverletter.js";  // ✅ NEW
import dashboardRouter from "./routers/dashboard.router.js";
import analyticsRouter from "./routes/analytics.routes.js";

import chatbotRouter from "./routers/chatbot.router.js";

import adminRouter from "./routers/admin.router.js";


// Config
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";

import apiTracker from "./middlewares/apiTracker.js";


const app = express();
const port = process.env.PORT || 5000;

app.use(apiTracker);

// Path setup for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// ✅ UPDATED: Larger JSON limit for HTML content
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Allow CORS from local dev frontends
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) return callback(null, true);
      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) return callback(null, true);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/template", templateRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resume", resumeRouter);
app.use("/api/coverletter", coverLetterRouter);  // ✅ NEW
app.use("/api/template-visibility", templateVisibilityRouter);
app.use("/api/plans", planRouter);
app.use("/api/blog", blogRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/admin", adminRouter);
app.use("/api", analyticsRouter);

// Serve uploads directory (for images/resumes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/downloads", downloadsRouter);  

// Error handling middleware (add before listen)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Admin Bootstrap
const bootstrapAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not found in .env. Skipping admin bootstrap.");
      return;
    }

    const adminRes = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminRes.rowCount === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(`
        INSERT INTO users (id, username, email, password, is_admin, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, true, true, NOW(), NOW())
      `, ["Admin", adminEmail, hashedPassword]);
      console.log(`✅ Admin user created: ${adminEmail}`);
    }
  } catch (error) {
    console.error("❌ Error bootstrapping admin:", error);
  }
};

// 🚨 FIX: Connect DB BEFORE starting server, not inside listen callback
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB connection
    await bootstrapAdmin(); // Ensure admin exists
    pool.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL ready"))
  .catch(err => console.error("❌ DB Error:", err.message));
    app.listen(port, () => {
      console.log(`✅ Server Running at http://localhost:${port}`);
      console.log(`✅ Database Connected`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
