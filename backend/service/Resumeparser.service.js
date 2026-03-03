// import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";

//added pdf-parse using require since it doesn't support ES modules
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Parse PDF file and extract text
 */
export const parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      success: true,
      text: data.text,
      numPages: data.numpages,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return {
      success: false,
      error: error.message,
    }; 
  }
};


/**
 * Parse DOCX file and extract text
 */
export const parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return {
      success: true,
      text: result.value,
      messages: result.messages,
    };
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Parse resume file based on file object
 */
export const parseResume = async (file) => {
  const filePath = file.path;
  const fileType = file.mimetype;
  
  if (fileType === "application/pdf") {
    return await parsePDF(filePath);
  } else if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  ) {
    return await parseDOCX(filePath);
  } else {
    return {
      success: false,
      error: "Unsupported file type",
    };
  }
};

/**
 * Extract structured data from resume text
 */
export const extractResumeData = (text) => {
  const data = {
    email: null,
    phone: null,
    name: null,
    skills: [],
    experience: [],
    education: [],
  };

  // Extract email
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    data.email = emailMatch[0];
  }

  // Extract phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  // Extract name (first line or before email)
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > 0) {
    data.name = lines[0].trim();
  }

  // Extract skills keywords
  const skillKeywords = [
    "JavaScript", "Python", "Java", "React", "Node.js", "HTML", "CSS", 
    "SQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "Agile", 
    "Scrum", "Leadership", "Communication", "Problem Solving", 
    "Teamwork", "Project Management"
  ];

  skillKeywords.forEach((skill) => {
    const regex = new RegExp(`\\b${skill}\\b`, "gi");
    if (regex.test(text)) {
      data.skills.push(skill);
    }
  });

  return data;
};