import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./Models/User.js";

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to DB");

        const email = process.env.ADMIN_EMAIL;
        const envPassword = process.env.ADMIN_PASSWORD;

        const user = await User.findOne({ email });
        if (!user) {
            console.log("Admin user not found in DB");
            process.exit(1);
        }

        console.log(`User found: ${user.email}, isAdmin: ${user.isAdmin}`);

        const matchEnv = await bcrypt.compare(envPassword, user.password);
        console.log(`Compare with .env password (${envPassword}): ${matchEnv}`);

        // Try a few common password changes if the user didn't specify what they changed it to
        const possibleNewPasswords = ["newpassword", "admin123", "password"];
        for (const p of possibleNewPasswords) {
            const match = await bcrypt.compare(p, user.password);
            if (match) {
                console.log(`MATCH FOUND for common password: ${p}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

testLogin();
