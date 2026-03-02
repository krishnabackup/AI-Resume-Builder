import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import bcrypt from "bcryptjs";
import User from "./Models/User.js";

dotenv.config();

// Set DNS servers to Google's DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const resetAdmin = async () => {
    try {
        const mongoURL = process.env.MONGO_URI || process.env.MONGO_DB_URL;
        if (!mongoURL) {
            console.error("❌ MongoDB URL is missing");
            process.exit(1);
        }

        await mongoose.connect(mongoURL);
        console.log("✅ Connected to DB");

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const user = await User.findOne({ email: adminEmail });
        if (!user) {
            console.log("❌ Admin user not found. Creating new one...");
            const hashed = await bcrypt.hash(adminPassword, 10);
            const newAdmin = new User({
                username: "Admin",
                email: adminEmail,
                password: hashed,
                isAdmin: true,
                isActive: true,
            });
            await newAdmin.save();
            console.log(`✅ Admin created with password from .env: ${adminPassword}`);
        } else {
            console.log(`ℹ️ Admin found. Resetting password to ${adminPassword}...`);
            const hashed = await bcrypt.hash(adminPassword, 10);
            user.password = hashed;
            user.isAdmin = true; // Ensure they are admin
            await user.save();
            console.log("✅ Password successfully reset to the one in your .env file.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

resetAdmin();
