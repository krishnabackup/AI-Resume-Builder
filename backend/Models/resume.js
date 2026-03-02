import mongoose from "mongoose";

/* ================= SUB SCHEMAS ================= */

const educationSchema = new mongoose.Schema(
  {
    id: String,
    school: String,
    degree: String,
    gpa: String,
    startDate: String,
    graduationDate: String,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    company: String,
    description: String,
    startDate: String,
    endDate: String,
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    technologies: String,
    link: {
      github: String,
      liveLink: String,
      other: String,
    },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    issuer: String,
    date: String,
    link: String,
  },
  { _id: false }
);

/* ================= MAIN RESUME SCHEMA ================= */

const resumeSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    linkedin: String,
    location: String,
    phone: String,
    summary: String,
    website: String,

    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],

    skills: {
      technical: [String],
      soft: [String],
    },

    certifications: [certificationSchema],
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
