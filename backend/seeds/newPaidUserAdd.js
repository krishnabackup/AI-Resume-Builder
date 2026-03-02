import Payment from "../Models/payment.js";
import Subscription from "../Models/subscription.js";
import User from "../Models/User.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
import bcrypt from "bcryptjs";

dotenv.config({path : "../.env"});

const addNewPaidUser = async() => {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("MongoDB connected");
  const session = await mongoose.startSession();
  session.startTransaction();
  const username = "krishnadek";
  const email = "krishna@gmail.com";
  const password = "Password@123";
  const hashedPass = await bcrypt.hash(password,10);

  try {

    const newUser = new User({
    username,
    email,
    password: hashedPass,
    isAdmin: false,
    isActive: true,
    plan: "Pro",
     });

    await newUser.save({ session });

    const userId = newUser._id;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const newSubscription = await Subscription.create(
      [
        {
          user: userId,
          plan: "pro",
          status: "active",
          startDate,
          endDate,
        },
      ],
      { session }
    );

    const subscriptionId = newSubscription[0]._id;

    await Payment.create(
      [
        {
          user: userId,
          subscription: subscriptionId,
          amount: 499,
          currency: "INR",
          status: "success",
          paymentMethod: "razorpay",
          transactionId: "TXN_" + Date.now(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    console.log("Paid user created");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error:", error.message);
  }
};


addNewPaidUser();