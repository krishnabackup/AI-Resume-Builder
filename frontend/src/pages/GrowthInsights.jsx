import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  ArrowRight,
  Search,
  Compass,
  Briefcase,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import growth from "../assets/growth1.png";

/** ✅ Animation Constants */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/** ✅ Static Data */
const ANALYSIS_ENGINE = [
  { title: "Role Identification", desc: "Discover specific job titles that perfectly match your current resume content." },
  { title: "Pathfinding", desc: "Identify the right way forward based on your professional history." },
  { title: "Skill Validation", desc: "Analyze your pasted text to see if your skills meet industry demands." },
  { title: "The 'Game' Factor", desc: "Find companies where your experience gives you an unfair advantage." }
];

const PILLARS = [
  { title: "Resume Deep-Scan", desc: "Paste your resume and let AI extract your true professional value and potential.", icon: Search, color: "bg-blue-50", iconColor: "text-blue-600" },
  { title: "Career Navigation", desc: "Find the right way to transition into roles that value your unique background.", icon: Compass, color: "bg-indigo-50", iconColor: "text-indigo-600" },
  { title: "Role Matching", desc: "Get matched with jobs where you already 'know the game'.", icon: Briefcase, color: "bg-cyan-50", iconColor: "text-cyan-600" },
];

const ROADMAP_STEPS = [
  { phase: "01", title: "Analyze", desc: "Paste your resume for AI scanning." },
  { phase: "02", title: "Discover", desc: "Find roles that fit your skills." },
  { phase: "03", title: "Target", desc: "Apply where you know the game." },
  { phase: "04", title: "Succeed", desc: "Land the role you were meant for." },
];

/** ✅ Memoized Roadmap Component */
const RoadmapSection = memo(() => (
  <div className="relative grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {ROADMAP_STEPS.map((step, i) => (
      <motion.div key={i} variants={fadeUp} className="relative p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 text-xs sm:text-sm font-black text-white bg-[#0077cc] rounded-full shadow-lg">
          {step.phase}
        </div>
        <h4 className="text-sm sm:text-base lg:text-lg font-bold text-[#1a2e52] mb-2">{step.title}</h4>
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-400">{step.desc}</p>
      </motion.div>
    ))}
  </div>
));

const StrategicInsightsPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleFeatureClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      localStorage.setItem("redirectPath", path);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-orange-100 overflow-x-hidden">
      <NavBar />

      {/* --- HERO SECTION --- */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-0 pb-0 overflow-hidden bg-white">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 py-8 sm:py-12 lg:py-16">
            <motion.div variants={fadeUp} className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 mb-4 sm:mb-6 lg:mb-8 rounded-full bg-blue-50">
                <Cpu size={14} className="text-[#0077cc]" />
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#0077cc] uppercase">AI Resume Analysis</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-4 sm:mb-6 lg:mb-8 text-[#1a2e52] font-jakarta">
                Know Your <br /><span className="text-[#0077cc]">Job Value.</span>
              </h1>

              <p className="max-w-md mx-auto mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-500 lg:mx-0">
                Paste your resume and let our AI analyze your profile to find the perfect job roles where you truly belong.
              </p>

              <button
                onClick={() => handleFeatureClick("/user/ats-checker")}
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95"
              >
                <Search size={16} className="transition-transform group-hover:scale-110" />
                <span>Analyze My Resume</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="hidden lg:flex relative w-full justify-end">
              <div className="relative w-full max-w-sm xl:max-w-md">
                <img src={growth} alt="Analysis Dashboard" className="w-full h-auto drop-shadow-2xl" />

                {/* Floating Badges - Hidden on smaller screens for layout cleanliness */}
                <div className="absolute flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-gray-100 shadow-xl rounded-xl sm:rounded-2xl top-4 sm:top-6 -left-4 sm:-left-6 animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="p-1.5 sm:p-2 rounded-lg bg-green-50"><Target size={16} className="text-green-600" /></div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">Role Match</p>
                    <p className="text-sm sm:text-lg font-black text-[#1a2e52]">High Impact</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#1a2e52] mb-8 sm:mb-12">How AI Resume Analysis Works</h2>
          <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg text-gray-600">
            <p>Finding the right career path shouldn't be a guessing game. Our AI analyzes technical skills and hidden strengths to map out the perfect role for your profile.</p>
            <p>By pasting your existing resume, you unlock a deep-dive analysis that shows you exactly where you "know the game."</p>
          </div>

          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-[#1a2e52] mb-4 sm:mb-6">Our Analysis Engine helps you:</h3>
            <ul className="space-y-3 sm:space-y-4">
              {ANALYSIS_ENGINE.map((item, i) => (
                <li key={i} className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 size={16} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-sm sm:text-base text-gray-700"><span className="font-bold">{item.title}:</span> {item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* --- THREE PILLARS --- */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
            {PILLARS.map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="group p-6 sm:p-8 lg:p-10 rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] bg-white border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8`}>
                  <feature.icon size={24} className={`${feature.iconColor}`} />
                </div>
                <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-black">{feature.title}</h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- ROADMAP --- */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="mx-auto text-center max-w-7xl">
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#1a2e52] tracking-tight mb-12 sm:mb-16 font-jakarta">
            Find Your <span className="text-[#0077cc]">Perfect Match.</span>
          </motion.h2>
          <RoadmapSection />
        </motion.div>
      </section>

      {/* --- CTA --- */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#1a2e52] tracking-tighter leading-tight font-jakarta">
            Stop Searching. <br /><span className="text-[#0077cc]">Start Being Found.</span>
          </h2>
          <p className="max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg xl:text-xl font-medium text-gray-500">
            Let AI pinpoint the exact roles where your unique skills will truly shine.
          </p>

          <button
            onClick={() => handleFeatureClick("/user/dashboard")}
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <Search size={16} />
            <span>Analyze My Career Now</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicInsightsPage;