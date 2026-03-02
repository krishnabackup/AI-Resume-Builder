import mongoose from "mongoose";


import User from "./User.js";
import Template from "./template.js";
import ResumeProfile from "./resumeProfile.js";

const atsScansSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    resumeprofileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeProfile",
      required: true,
    },
   
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  
    overallScore: {
      type: Number,
      required: true,
    },
    sectionScores: [
      {
        sectionName: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
      },
    ],
    matchedKeywords: [
      {
        keyword: {
          type: String,
          required: true,
        },
      },
    ],
    missingKeywords: [
      {
        keyword: {
          type: String,
          required: true,
        },
      },
    ],
  },
 
  { timestamps: true }
);

const AtsScans = mongoose.model("AtsScans", atsScansSchema);
export default AtsScans;
