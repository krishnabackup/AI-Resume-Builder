import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Search,
  Star,
  ChevronDown,
  Info,
  ArrowRight,
  UploadCloud,
  FileCheck, // Added missing icon
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};
const AIResumeChecker = () => {
  const navigate = useNavigate();
  const [setIsUploading] = useState(false);
  // --- ADDED MISSING STATE ---
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- ADDED MISSING HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    setSelectedFile(null);
  };

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert(`🚀 Analysis Started for ${selectedFile.name}!`);
    }, 2000);
  };
  const [showAllGuides, setShowAllGuides] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta text-[#1a2e52] select-none">
      <NavBar />
      <div className="h-12" />
      {/* --- HERO SECTION: FULL WIDTH/HEIGHT --- */}
      <section className="relative min-h-[85vh] flex items-center px-8 py-16 overflow-hidden bg-white border-b border-gray-50">
        {/* Soft Background Blurs */}
        <div className="absolute top-0 right-0 w-[40%] h-full -translate-y-1/4 translate-x-1/4 opacity-20 bg-gradient-to-bl from-blue-200 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 bg-blue-100 rounded-full w-72 h-72 -translate-x-1/3 opacity-10 blur-3xl"></div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid items-center gap-16 lg:grid-cols-2"
          >
            {/* LEFT SIDE: THE CONTENT (Text & Matter) */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-start text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-bold tracking-widest text-[#0077cc] uppercase bg-blue-50 rounded-full">
                <Zap size={14} className="fill-[#0077cc]" /> AI Analysis 2.0
              </span>

              <h1 className="mb-6 text-5xl font-black leading-[1.3] lg:text-7xl text-[#1a2e52]">
                Is your resume
                <span className="block text-transparent bg-gradient-to-r from-[#0077cc] via-[#0056b3] to-[#e65100] bg-clip-text mt-8">
                  ATS-Proof?
                </span>
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-gray-500">
                Upload your resume and let our AI scan it for keywords,
                formatting errors, and impact scores. Get hired 3x faster with a
                data-driven resume.
              </p>

              {/* Action Buttons: INCREASED MARGIN TOP (mt-14) FOR BETTER GAP */}
              <div className="flex flex-col w-full max-w-sm gap-4 mt-14">
                <button
                  type="button"
                  onClick={() => {
  if (!isLoggedIn) {
    navigate("/login", { state: { from: "/user/ats-checker" } });
  } else {
    navigate("/user/ats-checker");
  }
}}
                  className="group relative flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-br from-[#0077cc] to-[#0056b3] rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,119,204,0.3)] overflow-hidden"
                >
                  <div className="absolute inset-0 transition-transform duration-500 translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:-translate-x-full" />
                  <UploadCloud
                    size={22}
                    className="transition-transform group-hover:scale-110"
                  />
                  Scan Resume
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="group relative flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-br from-[#f59e0b] via-[#e65100] to-[#f4511e] rounded-[1.75rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(230,81,0,0.3)] overflow-hidden"
                >
                  <div className="absolute inset-0 transition-transform duration-500 translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:-translate-x-full" />
                  <i className="text-xl fas fa-graduation-cap"></i>
                  Build from Scratch
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
              </div>
            </motion.div>

            {/* RIGHT SIDE: THE PILLARS (Unchanged as requested) */}
            <motion.div
              variants={fadeUp}
              className="grid gap-6 md:grid-cols-2 lg:max-w-[850px] ml-auto"
            >
              {/* 1. Instant Analysis */}
              <div className="flex flex-col items-center text-center px-10 py-8 transition-all bg-white border-2 border-gray-100 shadow-sm rounded-[2.5rem] hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 group">
                <div className="w-16 h-16 mb-5 bg-blue-50 text-[#0077cc] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500">
                  <Zap size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a2e52] mb-2">
                    Instant Analysis
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Results in under{" "}
                    <span className="text-[#0077cc] font-bold">5 seconds</span>.
                  </p>
                </div>
              </div>

              {/* 2. Shadow Scan */}
              <div className="flex flex-col items-center text-center px-10 py-8 transition-all bg-white border-2 border-gray-100 shadow-sm rounded-[2.5rem] hover:shadow-2xl hover:border-orange-400 hover:-translate-y-2 group">
                <div className="w-16 h-16 mb-5 bg-orange-50 text-[#e65100] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-500">
                  <FileSearch size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a2e52] mb-2">
                    Shadow Scan
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Simulates{" "}
                    <span className="text-[#e65100] font-bold">
                      Fortune 500 ATS
                    </span>{" "}
                    logic.
                  </p>
                </div>
              </div>

              {/* 3. Skill Gap Map */}
              <div className="flex flex-col items-center text-center px-10 py-8 transition-all bg-white border-2 border-gray-100 shadow-sm rounded-[2.5rem] hover:shadow-2xl hover:border-green-400 hover:-translate-y-2 group">
                <div className="flex items-center justify-center w-16 h-16 mb-5 text-green-600 transition-all duration-500 bg-green-50 rounded-2xl group-hover:scale-110 group-hover:bg-green-100">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a2e52] mb-2">
                    Skill Gap Map
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Find{" "}
                    <span className="font-bold text-green-600">
                      missing keywords
                    </span>{" "}
                    instantly.
                  </p>
                </div>
              </div>

              {/* 4. Format Fixer */}
              <div className="flex flex-col items-center text-center px-10 py-8 transition-all bg-white border-2 border-gray-100 shadow-sm rounded-[2.5rem] hover:shadow-2xl hover:border-purple-400 hover:-translate-y-2 group">
                <div className="flex items-center justify-center w-16 h-16 mb-5 text-purple-600 transition-all duration-500 bg-purple-50 rounded-2xl group-hover:scale-110 group-hover:bg-purple-100">
                  <FileCheck size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a2e52] mb-2">
                    Format Fixer
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    Identifies{" "}
                    <span className="font-bold text-purple-600">
                      parsing errors
                    </span>{" "}
                    and layout issues.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS / ANALYSIS PREVIEW --- */}
      <section className="px-8 py-24 mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid items-center gap-16 lg:grid-cols-2"
        >
          <motion.div variants={fadeLeft}>
            <h2 className="mb-8 text-4xl font-bold leading-tight">
              We check your resume against{" "}
              <span className="text-[#e65100]">100+ recruitment rules</span>
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: <Search className="text-blue-500" />,
                  title: "ATS Compatibility",
                  desc: "We ensure recruiters' software can actually read your text.",
                },
                {
                  icon: <BarChart3 className="text-orange-500" />,
                  title: "Impact Scoring",
                  desc: "Our AI evaluates the strength of your action verbs and achievements.",
                },
                {
                  icon: <ShieldCheck className="text-green-500" />,
                  title: "Keyword Optimization",
                  desc: "Get a list of missing keywords for specific job titles.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-6 transition-all bg-white border border-gray-100 rounded-3xl hover:shadow-md"
                >
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="mb-1 font-bold">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative p-8 bg-slate-900 rounded-[3rem] text-white overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Analysis Report
                </span>
                <span className="px-3 py-1 text-xs font-bold text-green-400 border rounded-full border-green-400/30">
                  Passed ATS Scan
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-2xl bg-white/5 border-white/10">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-400" size={16} />{" "}
                    Contact Info
                  </span>
                  <span className="text-sm font-bold">10/10</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-2xl bg-white/5 border-white/10">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="text-orange-400" size={16} />{" "}
                    Keyword Density
                  </span>
                  <span className="text-sm font-bold text-orange-400">
                    6/10
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-2xl bg-white/5 border-white/10">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="text-green-400" size={16} />{" "}
                    Formatting
                  </span>
                  <span className="text-sm font-bold">9/10</span>
                </div>
              </div>
              <div className="pt-6 text-center">
                <div className="text-5xl font-black text-[#0077cc] mb-2">
                  82%
                </div>
                <p className="text-sm font-medium tracking-wide text-gray-400">
                  Overall Resume Score
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- BEFORE VS AFTER --- */}
      <section className="relative px-8 py-24 overflow-hidden text-white bg-slate-900">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 blur-[120px] -z-10"></div>

        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              See the <span className="text-[#0077cc]">AI Difference</span>
            </h2>
            <p className="text-gray-400">
              How we transform a basic resume into a recruiter magnet.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-2"
          >
            {/* BEFORE CARD: Red Glow & Subtle Shake */}
            <motion.div
              variants={fadeUp}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 opacity-70 transition-all duration-500 hover:opacity-100 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:-translate-y-2 group cursor-default"
            >
              <h4 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-red-400 uppercase transition-colors group-hover:text-red-500">
                <AlertCircle size={16} className="group-hover:animate-pulse" />{" "}
                Before UptoSkills
              </h4>

              <div className="space-y-3 blur-[1px] group-hover:blur-0 transition-all duration-500">
                <div className="w-3/4 h-4 rounded bg-white/10 group-hover:bg-white/20"></div>
                <div className="w-full h-4 rounded bg-white/10 group-hover:bg-white/20"></div>
                <div className="w-5/6 h-4 rounded bg-white/10 group-hover:bg-white/20"></div>
              </div>

              <p className="mt-6 text-sm text-gray-400 transition-colors group-hover:text-gray-300">
                Vague descriptions, missing keywords, and poor formatting that
                ATS bots reject instantly.
              </p>
            </motion.div>

            {/* AFTER CARD: Blue Glow & Scaling */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-8 rounded-[2rem] bg-[#0077cc]/10 border border-[#0077cc]/30 relative overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-[#0077cc] hover:shadow-[0_0_40px_rgba(0,119,204,0.3)] group cursor-default"
            >
              {/* Animated Background Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>

              <div className="absolute top-0 right-0 bg-[#0077cc] text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase shadow-lg z-10">
                Optimized
              </div>

              <h4 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-green-400 uppercase">
                <CheckCircle2
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />{" "}
                After AI Scan
              </h4>

              <div className="relative space-y-3">
                <div className="w-3/4 h-4 transition-all border rounded bg-green-400/20 border-green-400/30 group-hover:bg-green-400/30 group-hover:border-green-400/50"></div>
                <div className="w-full h-4 transition-all border rounded bg-green-400/20 border-green-400/30 group-hover:bg-green-400/30 group-hover:border-green-400/50"></div>
                <div className="w-5/6 h-4 transition-all border rounded bg-green-400/20 border-green-400/30 group-hover:bg-green-400/30 group-hover:border-green-400/50"></div>
              </div>

              <p className="mt-6 text-sm text-gray-200 transition-colors group-hover:text-white">
                High keyword density, punchy action verbs, and clear hierarchy
                that ranks you #1.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* CSS for Shimmer Animation - Add this to your global CSS or a style tag */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `,
          }}
        />
      </section>

      {/* --- EXPERT TIPS --- */}
      <section className="px-8 py-24 mx-auto max-w-7xl">
        <div className="flex flex-col items-end justify-between gap-6 mb-12 md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-4 text-4xl italic font-bold">
              Resume <span className="text-[#0077cc]">Power Tips</span>
            </h2>
            <p className="text-gray-500">
              Expert-backed advice to pair with our AI analysis.
            </p>
          </div>
          <button
            onClick={() => setShowAllGuides(!showAllGuides)}
            className="flex items-center gap-2 font-bold text-[#0077cc] hover:gap-3 transition-all"
          >
            {showAllGuides ? "Show Less" : "View All Guides"}
            <ArrowRight
              size={18}
              className={`transition-transform duration-300 ${
                showAllGuides ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {(showAllGuides
            ? [
                {
                  title: "The 6-Second Rule",
                  desc: "Recruiters spend 6 seconds on average. We help you put the most important info in the top third.",
                },
                {
                  title: "Action Verb Focus",
                  desc: "Replace 'Responsible for' with 'Spearheaded' or 'Executed' to show impact.",
                },
                {
                  title: "Quantify Success",
                  desc: "Always include numbers (e.g., 'Increased revenue by 20%') to provide concrete proof.",
                },
                {
                  title: "ATS-Friendly Formatting",
                  desc: "Avoid tables, text boxes, and graphics that ATS systems can’t parse.",
                },
                {
                  title: "Keyword Optimization",
                  desc: "Mirror job description keywords to rank higher in ATS filters.",
                },
                {
                  title: "Project-First Strategy",
                  desc: "Highlight real projects before certificates to show practical skills.",
                },
              ]
            : [
                {
                  title: "The 6-Second Rule",
                  desc: "Recruiters spend 6 seconds on average. We help you put the most important info in the top third.",
                },
                {
                  title: "Action Verb Focus",
                  desc: "Replace 'Responsible for' with 'Spearheaded' or 'Executed' to show impact.",
                },
                {
                  title: "Quantify Success",
                  desc: "Always include numbers (e.g., 'Increased revenue by 20%') to provide concrete proof.",
                },
              ]
          ).map((tip, i) => (
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              key={i}
              className="p-8 bg-white border border-gray-100 rounded-[2rem] hover:shadow-xl transition-all group"
            >
              <div className="mb-4 text-[#e65100] group-hover:scale-110 transition-transform">
                <Star size={24} />
              </div>
              <h4 className="mb-2 text-xl font-bold">{tip.title}</h4>
              <p className="text-sm leading-relaxed text-gray-500">
                {tip.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- FAQ --- */}
      <section className="px-8 py-24 bg-white">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-16 text-center">
            <div className="inline-flex p-3 bg-blue-50 text-[#0077cc] rounded-2xl mb-4">
              <Info size={24} />
            </div>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is my resume data safe?",
                a: "Absolutely. We use bank-level encryption and your data is never sold to third parties.",
                extra:
                  "Your resume is encrypted using AES-256 standards and stored securely. We only process it for analysis and never retain it longer than necessary.",
              },
              {
                q: "What is an ATS score?",
                a: "It's a measurement of how well your resume matches applicant tracking systems.",
                extra:
                  "Our ATS score evaluates keyword relevance, formatting compatibility, section hierarchy, and recruiter readability to improve shortlisting chances.",
              },
              {
                q: "How many times can I scan?",
                a: "Free users get limited scans. Pro users get unlimited access.",
                extra:
                  "Free users receive 10 scans per month. Pro users unlock unlimited scans, deep keyword insights, job-role matching, and priority processing.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                onClick={() => toggleFAQ(i)}
                className="py-6 border-b border-gray-100 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-lg transition-colors hover:text-[#0077cc]">
                    {faq.q}
                  </h5>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-450 ${
                      openFAQ === i ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Short answer (always visible) */}
                <p className="mt-2 text-sm text-gray-500">{faq.a}</p>

                {/* Expandable extra info */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === i ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-sm leading-relaxed text-gray-600">
                    {faq.extra}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AIResumeChecker;
