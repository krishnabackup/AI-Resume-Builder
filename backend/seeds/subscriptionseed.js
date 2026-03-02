import mongoose from "mongoose";
import Subscription from "../Models/subscription.js";
import dotenv from "dotenv";
dotenv.config({path : "../.env"});

import dns from "dns";

dns.setServers(['8.8.8.8', '8.8.4.4']);

const sampleSubscriptions = [
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000001"),
    plan: "pro",
    status: "active",
    startDate: new Date("2025-01-10"),
    endDate: new Date("2026-01-10"), // 1 year
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000002"),
    plan: "pro",
    status: "expired",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2025-02-15"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000003"),
    plan: "pro",
    status: "cancelled",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2026-06-01"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000004"),
    plan: "lifetime",
    status: "active",
    startDate: new Date("2023-03-20"),
    endDate: null, // lifetime → no end date
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000005"),
    plan: "lifetime",
    status: "active",
    startDate: new Date("2022-11-05"),
    endDate: null,
  },
   {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000006"),
    plan: "pro",
    status: "active",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2026-03-01"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000007"),
    plan: "pro",
    status: "expired",
    startDate: new Date("2023-12-10"),
    endDate: new Date("2024-12-10"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000008"),
    plan: "pro",
    status: "active",
    startDate: new Date("2025-07-15"),
    endDate: new Date("2026-07-15"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000009"),
    plan: "pro",
    status: "cancelled",
    startDate: new Date("2025-01-20"),
    endDate: new Date("2026-01-20"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000010"),
    plan: "pro",
    status: "expired",
    startDate: new Date("2024-04-05"),
    endDate: new Date("2025-04-05"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000011"),
    plan: "lifetime",
    status: "active",
    startDate: new Date("2021-09-18"),
    endDate: null,
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000012"),
    plan: "lifetime",
    status: "active",
    startDate: new Date("2022-05-30"),
    endDate: null,
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000013"),
    plan: "pro",
    status: "active",
    startDate: new Date("2025-09-10"),
    endDate: new Date("2026-09-10"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000014"),
    plan: "pro",
    status: "expired",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2024-08-01"),
  },
  {
    user: new mongoose.Types.ObjectId("65f1a1b2c3d4e5f601000015"),
    plan: "lifetime",
    status: "active",
    startDate: new Date("2020-01-01"),
    endDate: null,
  },
];

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);
  await Subscription.insertMany(sampleSubscriptions);
  console.log("Sample subscriptions inserted");
  mongoose.disconnect();
};

seedData();