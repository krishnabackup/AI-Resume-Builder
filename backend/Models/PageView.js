import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    trim: true,
  },
  route: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PageView = mongoose.models.PageView || mongoose.model("PageView", pageViewSchema);

export default PageView;
