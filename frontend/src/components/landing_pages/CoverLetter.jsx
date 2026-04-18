import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  FileCheck,
  Zap,
  History,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Link2,
  FileDown,
  MousePointer2,
} from "lucide-react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import cover from "../assets/cover1.png";

/** ✅ Animation Variants */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/** ✅ Static Content */
const SCAN_FEATURES = [
  { title: "Personalized Narrative", desc: "Tailors your story to match the company culture." },
  { title: "Role-Specific Keywords", desc: "Identifies and includes crucial industry terms." },
  { title: "Professional Formatting", desc: "Ensures the layout is clean and recruiter-ready." },
  { title: "Direct Value Alignment", desc: "Connects your past results to future job requirements." },
];

const PROCESS_STEPS = [
  { icon: UploadCloud, t: "Upload Resume", d: "Our AI immediately scans your pasted text to extract your professional value." },
  { icon: Link2, t: "Analyze & Optimize", d: "We use AI to re-architect your content and target high-impact industry keywords." },
  { icon: FileDown, t: "Export PDF", d: "Instantly download a polished, recruiter-ready document that lands interviews." },
];

const BENTO_FEATURES = [
  { icon: Zap, color: "blue", title: "Instant Generation", desc: "Drafts ready in seconds, not hours." },
  { icon: History, color: "indigo", title: "Infinite Edits", desc: "One click to rewrite any section." },
  { icon: FileCheck, color: "cyan", title: "Recruiter Approved", desc: "Designed to pass every ATS screen." },
];

const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

const SimpleCoverLetterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-blue-100 overflow-x-hidden">
      <NavBar />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative px-6 sm:px-8 pt-20 pb-12 overflow-hidden bg-white">
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="flex flex-col items-center gap-12 lg:flex-row lg:text-left pt-10"
          >
            <motion.div variants={fadeUp} className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-50">
                <Sparkles size={16} className="text-[#0077cc]" />
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#0077cc] uppercase">
                  AI Writing Assistant
                </span>
              </div>

              <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter lg:leading-[1.1] font-jakarta">
                Write your Cover Letter <br />
                <span className="text-[#0077cc]">in 10 Seconds.</span>
              </h1>

              <p className="max-w-xl mx-auto mb-10 text-lg sm:text-xl font-medium text-gray-500 lg:mx-0">
                Stop staring at a blank page. Our AI reads your resume and job
                description to write a perfect letter that gets you hired.
              </p>

              <button
                            onClick={() => {
                    if (!isLoggedIn) navigate("/login");
                    else navigate("/user/cover-letter");
                  }}
                className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
              >
                <span>Generate Now — It's Free</span>
                <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </motion.div>

            {/* Hidden on mobile/tablet if it breaks alignment, shown only on large screens */}
            <motion.div variants={fadeUp} className="hidden lg:block relative flex-1 w-full max-w-[550px]">
              <img src={cover} alt="AI Cover Letter Preview" className="w-full h-auto rounded-[2rem] drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- WHAT IS A COVER LETTER --- */}
      <section className="px-6 sm:px-8 py-16 bg-white">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a2e52] mb-12">What is a Cover Letter?</h2>
          <div className="mb-12 space-y-6 text-base sm:text-lg text-gray-600">
            <p>A cover letter is a professional document that accompanies your resume to provide a detailed introduction of your skills, experiences, and interest in a specific job role.</p>
            <p>Our AI Cover Letter builder analyzes the job description and your resume to create a narrative that highlights your most relevant achievements.</p>
          </div>

          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our AI Cover Letter Scans for:</h3>
            <ul className="space-y-4">
              {SCAN_FEATURES.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-bold">{item.title}:</span> {item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* --- 2. THE DIFFERENCE --- */}
      <section className="px-6 sm:px-8 pb-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-3xl sm:text-4xl font-black tracking-tight text-center">The AI Difference</h2>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="p-8 sm:p-10 bg-gray-50 rounded-[40px] border border-gray-100 opacity-80 lg:opacity-60 transition-all duration-500 hover:opacity-100 hover:bg-white hover:shadow-xl group/old">
              <span className="block mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">The Old Way</span>
              <h3 className="mb-6 text-2xl font-bold">Manual Writing</h3>
              <ul className="space-y-4">
                {["Generic Greetings", "Hours of editing", "Zero Keyword Optimization"].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-500">
                    <span className="w-2 h-2 bg-gray-300 rounded-full group-hover/old:bg-red-400" /> {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 sm:p-10 bg-white rounded-[40px] border-2 border-blue-600 shadow-2xl relative transition-all duration-500 hover:-translate-y-2 group/new">
              <div className="absolute -top-4 right-10 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg">Recommended</div>
              <span className="block mb-4 text-xs font-black tracking-widest text-blue-600 uppercase">The Smart Way</span>
              <h3 className="mb-6 text-2xl font-bold">AI Builder</h3>
              <ul className="space-y-4">
                {["Tailored to specific Job Role", "Finished in under 10 seconds", "Guaranteed ATS compatibility"].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm sm:text-base font-bold text-[#1a2e52] group-hover/new:translate-x-1 transition-transform">
                    <CheckCircle2 size={22} className="text-green-500 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- 3. SIMPLE 3-STEP PROCESS --- */}
      <section className="px-6 sm:px-8 pb-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl sm:text-5xl font-black text-[#1a2e52]">Simple 3-Step Process</h2>
            <p className="max-w-xl mx-auto text-base sm:text-lg font-medium text-gray-500">Fast, efficient, and built for results.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative p-8 sm:p-10 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center"
              >
                <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-[#1a2e52] group-hover:text-white transition-colors">0{i + 1}</div>
                <div className="mb-8 p-6 rounded-3xl bg-[#1a2e52] transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 shadow-lg border-2 border-white/20 flex items-center justify-center">
                  <step.icon size={40} className="text-white" />
                </div>
                <h4 className="mb-4 text-2xl font-bold text-[#1a2e52] group-hover:text-blue-600 transition-colors">{step.t}</h4>
                <p className="text-sm sm:text-base font-medium leading-relaxed text-gray-500">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. BENTO FEATURES --- */}
      <section className="px-6 sm:px-8 pb-16 mx-auto max-w-7xl">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {BENTO_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`p-8 sm:p-10 bg-${feature.color}-50 rounded-[40px] transition-all duration-500 hover:bg-white hover:shadow-2xl group cursor-default`}
            >
              <feature.icon className={`mb-8 text-${feature.color}-600 transition-transform group-hover:scale-110`} size={40} />
              <h4 className="mb-4 text-2xl font-black">{feature.title}</h4>
              <p className="text-sm font-semibold leading-relaxed text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- 5. FINAL CTA --- */}
      <section className="relative px-6 sm:px-8 py-20 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-black text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Write your Cover Letter <br /> <span className="text-[#0077cc]">in 10 Seconds.</span>
          </h2>
          <p className="mb-10 text-lg sm:text-xl font-medium text-gray-500">Our AI reads your resume and job description to write a perfect letter that gets you hired.</p>
          <button
            onClick={() => {
                    if (!isLoggedIn) navigate("/login");
                    else navigate("/user/cover-letter");
                  }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <span>Generate Now — It's Free</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default memo(SimpleCoverLetterPage);