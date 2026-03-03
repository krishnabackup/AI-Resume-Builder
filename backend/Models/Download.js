import mongoose from "mongoose";

const DownloadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, required: true },
    type: { type: String, enum: ["resume", "cover-letter", "cv"], required: true },
    format: { type: String, enum: ["PDF", "DOCX", "DOC"], default: "PDF" },
    html: { type: String, required: true },
    template: String,
    size: String,
    views: { type: Number, default: 0 },
    downloadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Download", DownloadSchema);