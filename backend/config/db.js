import mongoose from "mongoose";

import dns from "dns";

// Set DNS servers to Google's DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    // Support both environment variable names
    const mongoURL =
      process.env.MONGO_URI || process.env.MONGO_DB_URL;

    if (!mongoURL) {
      console.error("❌ MongoDB URL is missing in .env file");
      return;
    }

    await mongoose.connect(mongoURL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);

    // Comment / uncomment based on your need
    // process.exit(1); // stop server if DB fails (production)

    console.log("⚠️ Server will continue without database connection");
  }
};

export default connectDB;
