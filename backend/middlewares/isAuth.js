import jwt from "jsonwebtoken";
import { pool } from "../config/postgresdb.js";


const isAuth = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check cookie first
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ If not in cookie, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token Not Found" });
    }
   console.log("TOKEN RECEIVED:", token);
   console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const tokenId = verifyToken.id;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(tokenId)) {
      // It's likely a MongoDB Object ID. We mapped this in users.mongodb_id.
      // Lookup the new Postgres UUID.
      try {
        const userRes = await pool.query("SELECT id FROM users WHERE id = $1", [tokenId]);
        if (userRes.rowCount > 0) {
          req.userId = userRes.rows[0].id;
        } else {
          return res.status(401).json({ message: "Session expired or invalid format. Please log in again." });
        }
      } catch (err) {
        console.error("isAuth DB lookup error:", err);
        return res.status(401).json({ message: "Database connection error in auth" });
      }
    } else {
      req.userId = tokenId;
    }

    next();
  } catch (error) {
    console.log("isAuth error:", error);
    return res.status(401).json({ message: "Authentication Failed" });
  }
};

export default isAuth;
