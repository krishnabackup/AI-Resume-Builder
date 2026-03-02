import mongoose from "mongoose";
import Payment from "../Models/payment.js";
import dotenv from "dotenv"

dotenv.config({path : "../.env"});
const samplePayments = [
  // ===== PRO USERS (₹499) =====
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000001"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 499,
    currency: "INR",
    status: "success",
    paymentMethod: "razorpay",
    transactionId: "TXN_PRO_001",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000003"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 499,
    currency: "INR",
    status: "success",
    paymentMethod: "stripe",
    transactionId: "TXN_PRO_002",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000006"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 499,
    currency: "INR",
    status: "success",
    paymentMethod: "razorpay",
    transactionId: "TXN_PRO_003",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000008"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 499,
    currency: "INR",
    status: "success",
    paymentMethod: "paypal",
    transactionId: "TXN_PRO_004",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000009"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 499,
    currency: "INR",
    status: "failed",
    paymentMethod: "stripe",
    transactionId: "TXN_PRO_005",
  },

  // ===== LIFETIME USERS (₹3215) =====
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000004"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 3215,
    currency: "INR",
    status: "success",
    paymentMethod: "razorpay",
    transactionId: "TXN_LIFE_001",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000005"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 3215,
    currency: "INR",
    status: "success",
    paymentMethod: "stripe",
    transactionId: "TXN_LIFE_002",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000011"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 3215,
    currency: "INR",
    status: "success",
    paymentMethod: "paypal",
    transactionId: "TXN_LIFE_003",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000012"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 3215,
    currency: "INR",
    status: "pending",
    paymentMethod: "razorpay",
    transactionId: "TXN_LIFE_004",
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000015"),
    subscription: new mongoose.Types.ObjectId(),
    amount: 3215,
    currency: "INR",
    status: "success",
    paymentMethod: "stripe",
    transactionId: "TXN_LIFE_005",
  },
];

const seedPayments = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);

  await Payment.insertMany(samplePayments);

  console.log("✅ Sample payments inserted");

  await mongoose.disconnect();
};

seedPayments();

