import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

/* ── Content sub-schema (mirrors frontend formData) ─────────────────── */
const contentSchema = new Schema(
  {
    fullName:         { type: String, default: "" },
    email:            { type: String, default: "" },
    phone:            { type: String, default: "" },
    address:          { type: String, default: "" },
    linkedin:         { type: String, default: "" },

    recipientName:    { type: String, default: "" },
    recipientTitle:   { type: String, default: "" },
    companyName:      { type: String, default: "" },
    companyAddress:   { type: String, default: "" },

    jobTitle:         { type: String, default: "" },
    jobReference:     { type: String, default: "" },
    jobSummary:       { type: String, default: "" },
    jobDescription:   { type: String, default: "" },

    openingParagraph: { type: String, default: "" },
    bodyParagraph1:   { type: String, default: "" },
    bodyParagraph2:   { type: String, default: "" },
    closingParagraph: { type: String, default: "" },

    salutation:       { type: String, default: "Sincerely" },
    customSalutation: { type: String, default: "" },
  },
  { _id: false }
);

/* ── Root Cover Letter schema ────────────────────────────────────────── */
const coverLetterSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true, // One document per user — upsert on every save
    },

    templateId: {
      type: String,
      default: "professional",
    },

    documentTitle: {
      type: String,
      default: "",
    },

    content: {
      type: contentSchema,
      default: () => ({}), // all fields default to "" — new users see blank form
    },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

const CoverLetter = model("CoverLetter", coverLetterSchema);
export default CoverLetter;
