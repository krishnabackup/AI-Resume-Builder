import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import User from "./Models/User.js";

dotenv.config();

// Set DNS servers to Google's DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const checkDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URI || process.env.MONGO_DB_URL;
        if (!mongoURL) {
            console.error("❌ MongoDB URL is missing in .env file");
            process.exit(1);
        }

        await mongoose.connect(mongoURL);
        console.log("Connected to DB");

        const admins = await User.find({ isAdmin: true });
        console.log(`Found ${admins.length} admin(s):`);

        admins.forEach(admin => {
            console.log(`Email: ${admin.email}, ID: ${admin._id}, PasswordHash (start): ${admin.password.substring(0, 10)}`);
        });

        const adminByEmail = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (adminByEmail) {
            console.log(`Admin by .env email (${process.env.ADMIN_EMAIL}): found, ID: ${adminByEmail._id}`);

            const envPass = process.env.ADMIN_PASSWORD;
            const match = await (await import("bcryptjs")).default.compare(envPass, adminByEmail.password);
            console.log(`Does DB hash match .env password? ${match}`);
        } else {
            console.log(`Admin by .env email (${process.env.ADMIN_EMAIL}): NOT FOUND`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDB();
