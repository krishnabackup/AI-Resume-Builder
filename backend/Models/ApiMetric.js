import mongoose from "mongoose";

const apiMetricSchema = new mongoose.Schema(
    {
        endpoint: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            required: true,
        },
        statusCode: {
            type: Number,
            required: true,
        },
        responseTime: {
            type: Number, // in ms
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        ip: {
            type: String,
        },
    },
    { timestamps: true }
);

const ApiMetric = mongoose.model("ApiMetric", apiMetricSchema);
export default ApiMetric;
