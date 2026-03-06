import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  ArrowRight,
  Sparkles,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  LayoutTemplate,
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import example from "../assets/resumeExample.png";
import JessicaClaire from "../assets/template_thumnail/JessicaClaire.png";
import JessicaClaire1 from "../assets/template_thumnail/JessicaClaire1.png";
import JessicaClaire2 from "../assets/template_thumnail/JessicaClaire2.png";
import JessicaClaire3 from "../assets/template_thumnail/JessicaClaire3.png";
import JessicaClaire4 from "../assets/template_thumnail/JessicaClaire4.png";
import JessicaClaire5 from "../assets/template_thumnail/JessicaClaire5.png";
import JessicaClaire6 from "../assets/template_thumnail/JessicaClaire6.png";
import JessicaClaire7 from "../assets/template_thumnail/JessicaClaire7.png";
import JessicaClaire8 from "../assets/template_thumnail/JessicaClaire8.png";
import JessicaClaire9 from "../assets/template_thumnail/JessicaClaire9.png";
import JessicaClaire10 from "../assets/template_thumnail/JessicaClaire10.png";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};
const ResumeExamplesPage = () => {
  const base = import.meta.env.BASE_URL || "/";
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const sections = [
    {
      title: "Technology & Software",
      icon: <Briefcase className="text-blue-500" />,
      items: [
        {
          id: 1,
          title: "Senior Software Engineer",
          tags: ["Cloud", "System Design"],
          image: JessicaClaire,
        },
        {
          id: 2,
          title: "Full Stack Developer",
          tags: ["React", "Node.js"],
          image: JessicaClaire1,
        },
        {
          id: 3,
          title: "Data Scientist",
          tags: ["AI/ML", "Python"],
          image: JessicaClaire2,
        },
        {
          id: 4,
          title: "DevOps Engineer",
          tags: ["AWS", "Docker"],
          image: JessicaClaire3,
        },
        {
          id: 5,
          title: "Cybersecurity Analyst",
          tags: ["Security", "Network"],
          image: JessicaClaire4,
        },
        {
          id: 6,
          title: "Mobile Developer",
          tags: ["Swift", "Flutter"],
          image: JessicaClaire5,
        },
        {
          id: 7,
          title: "QA Automation",
          tags: ["Selenium", "Testing"],
          image: JessicaClaire6,
        },
        {
          id: 8,
          title: "Cloud Architect",
          tags: ["Azure", "GCP"],
          image: JessicaClaire7,
        },
      ],
    },
    {
      title: "Business & Management",
      icon: <TrendingUp className="text-emerald-500" />,
      items: [
        {
          id: 9,
          title: "Product Manager",
          tags: ["Agile", "Roadmap"],
          image: JessicaClaire8,
        },
        {
          id: 10,
          title: "Operations Lead",
          tags: ["P&L", "Strategy"],
          image: JessicaClaire9,
        },
        {
          id: 11,
          title: "Marketing Manager",
          tags: ["SEO", "Content"],
          image: JessicaClaire10,
        },
        {
          id: 12,
          title: "Financial Analyst",
          tags: ["Excel", "Modeling"],
          image: JessicaClaire,
        },
        {
          id: 13,
          title: "HR Director",
          tags: ["Talent", "People"],
          image: JessicaClaire1,
        },
        {
          id: 14,
          title: "Sales Executive",
          tags: ["B2B", "Revenue"],
          image: JessicaClaire2,
        },
        {
          id: 15,
          title: "Accountant",
          tags: ["Tax", "Audit"],
          image: JessicaClaire3,
        },
        {
          id: 16,
          title: "Project Manager",
          tags: ["Scrum", "Risk"],
          image: JessicaClaire4,
        },
      ],
    },
  ];

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-['Outfit'] text-[#1a2e52]">
      <NavBar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 bg-white border-b lg:pt-32 border-gray-50">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-12 px-8 mx-auto max-w-7xl lg:flex-row"
        >
          {/* Left Side: Content */}
          <motion.div variants={fadeUp} className="flex-1 text-left">
            <h1 className="text-5xl lg:text-7xl font-[1000] tracking-tight font-jakarta mb-6 leading-[1.1]">
              The <span className="text-[#0077cc]">Blueprints</span> of <br />
              Great Careers.
            </h1>

            <p className="max-w-lg mb-10 text-xl leading-relaxed text-gray-600">
              Stop staring at a blank page. Access a library of 500+
              battle-tested resume templates designed by industry experts to get
              you past the ATS and into the interview.
            </p>

            <div className="relative max-w-xl">
              <div className="relative flex items-center p-1 overflow-hidden transition-all border border-gray-200 shadow-sm bg-gray-50 rounded-2xl focus-within:bg-white focus-within:ring-4 ring-blue-50 focus-within:border-blue-400">
                <Search className="ml-5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search 500+ templates (e.g. Sales, React)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-4 pr-6 text-lg font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                />
                <button
                  className="
  hidden md:block 
  px-6 py-3 mr-1 
  font-black text-lg text-white 
  bg-gradient-to-r from-[#e65100] to-[#f4511e] 
  rounded-xl shadow-[0_4px_14px_0_rgba(230,81,0,0.39)]
  transition-all duration-300 ease-in-out
  hover:shadow-[0_6px_20px_rgba(230,81,0,0.45)]
  hover:-translate-y-0.5
  active:scale-95
  mx-auto lg:mx-0
"
                >
                  Search
                </button>
              </div>
              <div className="flex gap-4 mt-4 ml-2">
                <span className="text-sm font-semibold text-gray-400">
                  Popular:
                </span>
                <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-blue-600">
                  Marketing
                </span>
                <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-blue-600">
                  Engineering
                </span>
                <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-blue-600">
                  Product
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Image/Illustration */}
          <motion.div variants={fadeUp} className="flex-1 w-full lg:block">
            <div className="relative">
              {/* Subtle decorative background element */}
              <div className="absolute top-0 right-0 rounded-full w-72 h-72 bg-blue-50 blur-3xl -z-10 opacity-60"></div>
              <img
                src={example}
                alt="Resume Hero Illustration"
                className="w-full h-auto rounded-lg drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- RESUME EXPLORER --- */}
      <section className="px-16 lg:px-24 py-10 mx-auto max-w-[1700px]">
        {/* Increased max-width to 1700px to allow more horizontal expansion for the images */}
        {filteredSections.map((section, sIdx) => (
          <motion.div
            key={sIdx}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-20"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 pb-4 mb-10 border-b border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-white border shadow-md border-gray-50 rounded-xl">
                {section.icon}
              </div>
              <h2 className="text-3xl font-black font-jakarta text-[#1a2e52]">
                {section.title}
              </h2>
            </div>

            {/* Grid - Reduced gap from 12 to 8 to maximize the width of each individual card */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((resume) => (
                <div
                  key={resume.id}
                  className="relative cursor-pointer group/card"
                  onDoubleClick={() => navigate("/login")}
                >
                  {/* Card Container 
                - aspect-[1/1.41] matches A4/Letter dimensions exactly to prevent content cutoff
                - Original hover transitions and scaling are preserved 
            */}
                  <div
                    className="
                relative bg-white aspect-[1/1.41]
                border border-gray-100
                shadow-md
                transition-all duration-500 ease-out
                group-hover/card:scale-105
                group-hover/card:shadow-2xl
                group-hover/card:z-20
                overflow-hidden
                will-change-transform
              "
                  >
                    {/* Image - object-contain ensures the full document is visible within the frame */}
                    <img
                      src={resume.image}
                      alt={resume.title}
                      className="object-contain w-full h-full bg-white"
                    />
                  </div>

                  {/* Text UI */}
                  <div className="px-4 mt-8 text-center transition-all duration-500 lg:text-left">
                    <h3 className="text-xl font-black text-[#1a2e52] group-hover/card:text-[#0077cc] transition-colors mb-1">
                      {resume.title}
                    </h3>

                    <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                      {resume.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-black uppercase text-gray-400 tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- ACADEMY SECTION --- */}
      <section className="py-14 border-t border-gray-100 bg-[#f8fafc]">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col items-center max-w-6xl gap-16 px-8 mx-auto lg:flex-row"
        >
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg text-[#ff6b35] text-[10px] font-black uppercase mb-6">
              Expert Insights
            </div>
            <h2 className="text-5xl font-[1000] tracking-tight font-jakarta mb-6 leading-tight">
              Built for the <br />
              <span className="text-[#ff6b35]">6-Second Scan.</span>
            </h2>
            <p className="mb-8 text-lg font-medium text-gray-500">
              Our field-tested templates are engineered to ensure your key value
              is seen first by recruiters.
            </p>
            <button className="flex items-center gap-2 font-black text-[#1a2e52] group">
              Explore Resume Guide{" "}
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-2"
              />
            </button>
          </div>
          <div className="grid flex-1 w-full gap-4">
            {[
              {
                title: "ATS Mastery",
                desc: "Strategically placed keywords to clear AI screening filters.",
                icon: <ShieldCheck className="text-blue-500" />,
              },
              {
                title: "Impact Focus",
                desc: "Layouts that emphasize results and metrics, not just tasks.",
                icon: <BarChart3 className="text-[#ff6b35]" />,
              },
              {
                title: "Visual Flow",
                desc: "Proven typography and white space for maximum readability.",
                icon: <LayoutTemplate className="text-green-500" />,
              },
            ].map((tip, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-start gap-5 hover:shadow-xl transition-all"
              >
                <div className="p-4 bg-gray-50 rounded-2xl">{tip.icon}</div>
                <div>
                  <h4 className="mb-1 text-lg font-black">{tip.title}</h4>
                  <p className="text-sm font-medium text-gray-400">
                    {tip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ResumeExamplesPage;
