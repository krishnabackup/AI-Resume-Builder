import {
  FileSearch,
  Layout,
  Zap,
  Edit3,
  BarChart3,
  Layers,
  Activity,
} from "lucide-react";

// 🔹 HERO TEMPLATES
export const templates = [
  {
    name: "AI Assistant",
    desc: "Smart resume generation powered by AI",
    image: "featureImage1",
    bgColor: "from-blue-500 to-cyan-500",
  },
  {
    name: "Tailored Summary",
    desc: "Customized professional summary",
    image: "featureImage2",
    bgColor: "from-purple-500 to-pink-500",
  },
  {
    name: "Tailor to Job",
    desc: "Match your resume to job requirements",
    image: "featureImage3",
    bgColor: "from-orange-500 to-red-500",
  },
  {
    name: "Resume Preview",
    desc: "Real-time resume preview and editing",
    image: "featureImage4",
    bgColor: "from-green-500 to-teal-500",
  },
];

// 🔹 HOW IT WORKS
export const howItWorksSteps = [
  {
    image: "work1",
    heading: "Easily create or import your resume",
    description:
      "Choose from professionally designed templates or upload your existing resume.",
  },
  {
    image: "work2",
    heading: "Check and analyze your resume score",
    description:
      "Get real-time ATS insights as you build your resume.",
  },
  {
    image: "quick",
    heading: "Quickly customize your resume with AI",
    description:
      "AI generates impactful bullet points.",
  },
  {
    image: "work4",
    heading: "Improve your resume instantly in one click",
    description:
      "Tailor your resume instantly.",
  },
  {
    image: "work5",
    heading: "Your winning resume is ready!",
    description:
      "Download your job-ready resume.",
  },
];

// 🔹 RESUME TEMPLATES
export const resumeTemplates = [
  { id: 1, name: "Atlantic Blue", desc: "Modern design", image: "template1" },
  { id: 2, name: "Classic", desc: "Timeless layout", image: "template2" },
  { id: 3, name: "Corporate", desc: "Corporate style", image: "template3" },
  { id: 4, name: "Modern Pro", desc: "Contemporary design", image: "template4" },
  { id: 5, name: "Executive", desc: "Senior roles", image: "template5" },
  { id: 6, name: "Creative Edge", desc: "Creative design", image: "template6" },
];

// 🔹 FEATURES
export const features = [
  {
    icon: <FileSearch />,
    title: "ATS Score Checker",
    description: "Analyze resume against ATS.",
    path: "/ats-checker",
  },
  {
    icon: <Layout />,
    title: "Categorized Templates",
    description: "Access curated templates.",
    path: "/TemplatesFeature",
  },
  {
    icon: <Zap />,
    title: "Guided AI Builder",
    description: "Create resume with AI.",
    path: "/AI-builder",
  },
  {
    icon: <Edit3 />,
    title: "AI Content Enhancement",
    description: "Improve bullet points.",
    path: "/content-enhance",
  },
  {
    icon: <BarChart3 />,
    title: "Live Quality Scoring",
    description: "Real-time score.",
    path: "/score-checker",
  },
  {
    icon: <Layers />,
    title: "Resume Manager",
    description: "Manage resumes.",
    path: "/resume-hub",
  },
  {
    icon: <Activity />,
    title: "Strategic Growth Insights",
    description: "Track performance.",
    path: "/growths",
  },
];