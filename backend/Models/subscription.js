import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["pro", "lifetime"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date
    },
  },
  { timestamps: true } // ⭐ used for monthly comparison
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
