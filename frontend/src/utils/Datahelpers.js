// Smart data merger - combines user data with sample data
// Only replaces parts that the user has actually filled in

const getSampleData = () => ({
  fullName: "Jessica Claire",
  email: "jessica.claire@example.com",
  phone: "(555) 432-1000",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/jessicaclaire",
  github: "github.com/jessicaclaire",
  website: "jessicaclaire.com",
  summary:
    "Results-driven software engineer with 8+ years of experience in full-stack development. Specialized in building scalable web applications using modern technologies. Proven track record of leading cross-functional teams and delivering high-impact projects.",

  experience: [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      description:
        "• Led development of microservices architecture serving 2M+ users\n• Reduced API response time by 40% through optimization\n• Mentored team of 5 junior developers",
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "Digital Solutions Corp",
      location: "San Jose, CA",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      description:
        "• Built responsive web applications using React and Node.js\n• Implemented CI/CD pipelines reducing deployment time by 60%",
    },
  ],

  education: [
    {
      id: 1,
      school: "University of California, Berkeley",
      degree: "Bachelor of Science in Computer Science",
      location: "Berkeley, CA",
      graduationDate: "May 2018",
      gpa: "3.8",
    },
  ],

  skills: {
    technical: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "MongoDB",
      "PostgreSQL",
    ],
    soft: [
      "Team Leadership",
      "Problem Solving",
      "Communication",
      "Agile Methodology",
    ],
  },

  projects: [
    {
      id: 1,
      name: "E-Commerce Platform",
      description:
        "Built a full-stack e-commerce platform with real-time inventory management and payment processing.",
      technologies: "React, Node.js, MongoDB, Stripe API, AWS",
      link: "github.com/jessicaclaire/ecommerce",
    },
    {
      id: 2,
      name: "Task Management App",
      description:
        "Developed a collaborative task management application with real-time updates using WebSockets.",
      technologies: "React, Firebase, Socket.io",
      link: "github.com/jessicaclaire/taskapp",
    },
  ],

  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "Mar 2023",
      link: "",
    },
    {
      id: 2,
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "Sep 2022",
      link: "",
    },
  ],
});



/* ================= HELPERS ================= */

const hasContent = (value) =>
  value && typeof value === "string" && value.trim().length > 0;

const hasArrayItemData = (item) => {
  if (!item || typeof item !== "object") return false;

  const keys = Object.keys(item).filter((k) => k !== "id");

  return keys.some((key) => {
    const value = item[key];
    return typeof value === "string" && value.trim().length > 0;
  });
};



/* ================= FIXED ARRAY MERGER ================= */

const mergeArrayData = (userData = [], sampleData = []) => {

  const userHasRealData =
    Array.isArray(userData) && userData.some(hasArrayItemData);

  // If user filled anything → use only user data
  if (userHasRealData) {
    return userData;
  }

  // Otherwise show template sample data
  return sampleData;
};



/* ================= MAIN MERGE FUNCTION ================= */

export const mergeWithSampleData = (userData) => {
  const sample = getSampleData();

  if (!userData) return sample;

  return {

    fullName: hasContent(userData.fullName)
      ? userData.fullName
      : sample.fullName,

    email: hasContent(userData.email)
      ? userData.email
      : sample.email,

    phone: hasContent(userData.phone)
      ? userData.phone
      : sample.phone,

    location: hasContent(userData.location)
      ? userData.location
      : sample.location,

    linkedin: hasContent(userData.linkedin)
      ? userData.linkedin
      : sample.linkedin,

    github: hasContent(userData.github)
      ? userData.github
      : sample.github,

    website: hasContent(userData.website)
      ? userData.website
      : sample.website,

    summary: hasContent(userData.summary)
      ? userData.summary
      : sample.summary,

    experience: mergeArrayData(userData.experience, sample.experience),

    education: mergeArrayData(userData.education, sample.education),

    projects: mergeArrayData(userData.projects, sample.projects),

    certifications: mergeArrayData(
      userData.certifications,
      sample.certifications
    ),

    skills: {
      technical:
        userData.skills?.technical?.length > 0
          ? userData.skills.technical
          : sample.skills.technical,

      soft:
        userData.skills?.soft?.length > 0
          ? userData.skills.soft
          : sample.skills.soft,
    },
  };
};



/* ================= USER DATA CHECK ================= */

export const hasAnyUserData = (formData) => {

  if (!formData) return false;

  if (hasContent(formData.fullName)) return true;
  if (hasContent(formData.email)) return true;
  if (hasContent(formData.phone)) return true;
  if (hasContent(formData.summary)) return true;

  if (formData.experience?.some(hasArrayItemData)) return true;
  if (formData.education?.some(hasArrayItemData)) return true;
  if (formData.projects?.some(hasArrayItemData)) return true;
  if (formData.certifications?.some(hasArrayItemData)) return true;

  if (formData.skills?.technical?.length > 0) return true;
  if (formData.skills?.soft?.length > 0) return true;

  return false;
};


export default mergeWithSampleData;