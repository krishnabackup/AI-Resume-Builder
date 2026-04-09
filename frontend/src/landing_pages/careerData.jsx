import {
  Brain,
  Target,
  Code2,
  Cpu,
  Home,
  LineChart,
  GraduationCap,
  BatteryCharging,
  Focus,
} from "lucide-react";

// 🔹 FILTERS
export const filters = [
  "All Roles",
  "AI & Engineering",
  "Product",
  "Growth",
  "Support",
];

// 🔹 VALUES
export const values = [
  {
    icon: <Brain className="w-12 h-12" />,
    title: "AI with Empathy",
    description:
      "We don't just build algorithms; we build tools that understand the human struggle of job hunting.",
    color: "bg-blue-50 text-[#0077cc]",
  },
  {
    icon: <Target className="w-12 h-12" />,
    title: "ATS Mastery",
    description:
      "We stay obsessed with how Applicant Tracking Systems work to ensure our users stay ahead.",
    color: "bg-orange-50 text-[#e65100]",
  },
  {
    icon: <Code2 className="w-12 h-12" />,
    title: "Agile Innovation",
    description:
      "The AI landscape changes weekly. We move fast, experiment constantly, and ship daily.",
    color: "bg-blue-50 text-[#0077cc]",
  },
];

// 🔹 PERKS
export const perks = [
  {
    icon: Cpu,
    title: "AI Stipend",
    description:
      "Monthly budget for ChatGPT, Claude, or any AI tool that helps you work smarter.",
  },
  {
    icon: Home,
    title: "Fully Remote",
    description:
      "Our team is global because talent is everywhere. Work from wherever you are happiest.",
  },
  {
    icon: LineChart,
    title: "Growth Equity",
    description:
      "Ownership in a fast-growing AI startup. We want you to win when we win.",
  },
  {
    icon: GraduationCap,
    title: "Career Coaching",
    description:
      "Free access to professional resume reviews and career coaching for your own path.",
  },
  {
    icon: BatteryCharging,
    title: "Recharge Time",
    description:
      "Unlimited PTO with a 2-week mandatory minimum. We prevent burnout proactively.",
  },
  {
    icon: Focus,
    title: "Deep Work Hours",
    description:
      "No-meeting Wednesdays and Thursdays to allow for flow state and deep focus.",
  },
];

// 🔹 JOBS
export const jobs = [
  {
    id: 1,
    title: "Senior AI Engineer (LLMs)",
    department: "AI & Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Fine-tune models to generate recruiter-ready bullet points and optimize context retrieval.",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    department: "AI & Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build intuitive, drag-and-drop resume editors and real-time ATS scoring dashboards.",
  },
  {
    id: 3,
    title: "Product Manager (Growth)",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    description:
      "Own the conversion funnel from landing page to first resume download.",
  },
  {
    id: 4,
    title: "HRTech Content Strategist",
    department: "Growth",
    location: "Remote",
    type: "Full-time",
    description:
      "Create viral career advice and deep-dives into the AI hiring landscape.",
  },
];