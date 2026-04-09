import React, { memo } from "react";
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  MousePointerSquareDashed,
  Download,
  Sparkles,
  FileSearch,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CV from "../assets/CV1.png";
import NavBar from "../components/NavBar";
import Footer from "./Footer";

/** ✅ Constants moved outside to prevent re-renders */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const ARCHITECT_ITEMS = [
  { title: "Information Hierarchy", desc: "Prioritizes your most relevant achievements at the top." },
  { title: "Typography Optimization", desc: "Uses professional font pairings for maximum screen readability." },
  { title: "ATS-Safe Elements", desc: "Removes graphics or tables that could break digital scanning." },
  { title: "Visual Balance", desc: "Adjusts margins and spacing to eliminate 'wall of text' fatigue." },
];

const OPTIMIZATION_STEPS = [
  { icon: FileSearch, t: "Content Analysis", d: "Our AI identifies missing keywords and action verbs required for your industry.", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: RefreshCw, t: "Smart Re-Formatting", d: "We automatically adjust margins and hierarchy for maximum readability.", color: "text-[#e65100]", bg: "bg-orange-50" },
  { icon: CheckCircle, t: "ATS Verification", d: "The final document is tested against 100+ recruiter algorithms for a 90+ score.", color: "text-green-500", bg: "bg-green-50" },
];

const BENTO_ITEMS = [
  { icon: MousePointerSquareDashed, title: "Pixel Perfect", desc: "Every line, dot, and margin is aligned to professional design standards.", bg: "bg-slate-50", text: "text-[#1a2e52]" },
  { icon: Download, title: "Export Ready", desc: "Optimized for PDF export so your layout never breaks across systems.", bg: "bg-blue-50", text: "text-[#1a2e52]" },
  { icon: CheckCircle2, title: "ATS Friendly", desc: "Beautiful to humans, perfectly readable by application software.", bg: "bg-[#1a2e52]", text: "text-white" },
];

/** ✅ Memoized Visual Analysis Section */
const VisualImpactAnalysis = memo(() => (
  <div className="grid items-stretch gap-8 grid-cols-1 md:grid-cols-2 group/container">
    {/* --- BOX 1: THE "BEFORE" --- */}
    <div className="p-8 sm:p-10 bg-slate-50 rounded-[40px] border border-slate-200 opacity-90 md:opacity-80 transition-all duration-500 ease-out hover:opacity-100 hover:bg-white hover:shadow-2xl flex flex-col justify-between group cursor-default">
      <div>
        <span className="block mb-6 text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 group-hover:text-red-500 transition-colors">Unstructured Draft</span>
        <div className="mb-8 space-y-4">
          <h4 className="text-lg font-bold text-slate-700">Project Manager at TechCorp</h4>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-500 group-hover:text-slate-800">
            I was responsible for managing a team of 10 people and we worked on software projects. I attended daily meetings and
            made sure everyone was doing their tasks on time. I also used Jira to track bugs...
          </p>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-red-400 uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Recruiter Focus: Low
        </div>
        <p className="mt-2 text-[11px] font-medium text-slate-400 italic">Too wordy, lacks metrics, and has poor scannability.</p>
      </div>
    </div>

    {/* --- BOX 2: THE "AFTER" --- */}
    <div className="p-8 sm:p-10 bg-white rounded-[40px] border-2 border-blue-600 shadow-2xl relative transition-all duration-700 hover:-translate-y-2 group flex flex-col justify-between z-10">
      <div className="absolute -top-4 right-6 sm:right-10 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg flex items-center gap-2">
        <Sparkles size={12} /> AI Optimized
      </div>
      <div>
        <span className="block mb-6 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">Smart Hierarchy</span>
        <div className="mb-8 space-y-5">
          <div className="flex items-start justify-between">
            <h4 className="text-lg sm:text-xl font-black text-[#1a2e52] tracking-tight">Project Manager</h4>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">TechCorp</span>
          </div>
          <ul className="space-y-3">
            {[
              { val: "15+ software releases", text: "Led a team of 10 to deliver ", post: " ahead of schedule." },
              { val: "35%", text: "Reduced bug resolution time by ", post: " via workflow optimization." },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                <p className="text-xs font-semibold text-slate-700">
                  {item.text}<span className="font-bold text-blue-600">{item.val}</span>{item.post}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pt-6 border-t border-blue-50">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-green-500 uppercase">
          <CheckCircle2 size={14} /> Recruiter Focus: High
        </div>
      </div>
    </div>
  </div>
));

const CVFormattingPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!(localStorage.getItem("token") || sessionStorage.getItem("token"));

  const handleCTA = () => {
    isLoggedIn ? navigate("/user/cv") : navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-blue-100 overflow-x-hidden">
      <NavBar />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative px-6 sm:px-8 pt-20 overflow-hidden bg-white">
        <div className="relative z-10 mx-auto max-w-7xl pt-10">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col items-center gap-12 lg:flex-row lg:text-left">
            <motion.div variants={fadeUp} className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50">
                <Layers size={16} className="text-[#0077cc]" />
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#0077cc] uppercase">Document Architecture</span>
              </div>
              <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter lg:leading-[1.1] font-jakarta">
                Professional CV<br /><span className="text-[#0077cc]">Built by AI.</span>
              </h1>
              <p className="max-w-xl mx-auto mb-10 text-lg sm:text-xl font-medium leading-relaxed text-gray-500 lg:mx-0">
                Design matters as much as data. We transform messy documents into clean, high-impact narratives that recruiters scan in <span className="font-bold text-[#1a2e52]">6 seconds</span>.
              </p>
              <button onClick={handleCTA} className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95">
                <span>Format My CV Now</span>
                <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </motion.div>

            {/* Hidden on tablet/mobile where layout becomes vertical */}
            <motion.div variants={fadeUp} className="hidden lg:block relative flex-1 w-full max-w-[550px]">
              <div className="absolute z-20 p-4 bg-white border border-gray-100 shadow-xl -top-6 -left-6 rounded-2xl animate-bounce" style={{ animationDuration: "4s" }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50"><CheckCircle2 className="text-[#0077cc]" size={18} /></div>
                  <span className="text-xs font-bold tracking-tight text-[#1a2e52]">Recruiter Approved</span>
                </div>
              </div>
              <img src={CV} alt="Professional CV Structure" className="w-full h-auto drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- WHAT IS CV FORMATTING --- */}
      <section className="px-6 sm:px-8 py-16 bg-white">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a2e52] mb-8">What is Professional CV Formatting?</h2>
          <div className="mb-12 space-y-6 text-base sm:text-lg text-gray-600">
            <p>Professional CV formatting is the architectural process of organizing your career history into a high-impact visual narrative.</p>
            <p>Our AI-driven formatter optimizes font hierarchy, white space, and section zoning to ensure your document is perfectly readable by humans and machines alike.</p>
          </div>
          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our CV Architect focuses on:</h3>
            <ul className="space-y-4">
              {ARCHITECT_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-bold">{item.title}:</span> {item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* --- 2. BEFORE vs AFTER --- */}
      <section className="px-6 sm:px-8 pb-16 bg-white">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-[1000] tracking-tight text-[#1a2e52] mb-4">Visual Impact Analysis</h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base font-medium text-gray-500">See how our AI restructures messy data into high-performance professional narratives.</p>
          </div>
          <VisualImpactAnalysis />
        </motion.div>
      </section>

      {/* --- 3. CV ARCHITECTURE PROCESS --- */}
      <section className="px-6 sm:px-8 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl sm:text-5xl font-black text-[#1a2e52]">CV Optimization Steps</h2>
            <p className="max-w-xl mx-auto text-base sm:text-lg font-medium text-gray-500">We transform your experience into a high-performance document.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {OPTIMIZATION_STEPS.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative p-8 sm:p-10 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center">
                <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-[#1a2e52] group-hover:text-white transition-colors">0{i + 1}</div>
                <div className={`mb-8 p-6 rounded-3xl ${step.bg} transition-transform duration-500 group-hover:scale-105`}><step.icon size={40} className={step.color} /></div>
                <h4 className="mb-4 text-2xl font-bold text-[#1a2e52] group-hover:text-[#0077cc] transition-colors">{step.t}</h4>
                <p className="text-sm sm:text-base font-medium leading-relaxed text-gray-500">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. STYLE BENTO GRID --- */}
      <section className="px-6 sm:px-8 mx-auto pb-16 max-w-7xl">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BENTO_ITEMS.map((item, i) => (
            <motion.div variants={fadeUp} key={i} className={`${item.bg} ${item.text} p-8 sm:p-10 rounded-[40px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group cursor-default`}>
              <item.icon className="mb-6 text-blue-600 transition-transform duration-500 group-hover:scale-110" size={32} />
              <div>
                <h4 className="mb-2 text-2xl font-black">{item.title}</h4>
                <p className={`text-sm font-medium ${item.bg === 'bg-[#1a2e52]' ? 'text-blue-200/60' : 'text-slate-500'}`}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative px-6 sm:px-8 py-20 overflow-hidden bg-white">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-black text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Professional CV <span className="text-[#0077cc]">Re-Architected.</span>
          </h2>
          <p className="mb-10 text-lg sm:text-xl font-medium text-gray-500">Design matters. Turn your career history into a clean, recruiter-approved masterpiece in seconds.</p>
          <button onClick={handleCTA} className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95">
            <span>Format My CV Now</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default memo(CVFormattingPage);