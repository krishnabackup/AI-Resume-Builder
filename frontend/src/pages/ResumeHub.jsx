import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Download,
  History,
  Copy,
  CheckCircle2,
  BarChart3,
  Clock,
  LayoutDashboard,
  Eye,
  MoreHorizontal,
  FileText,
  Zap,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// Components
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import hub from "../assets/resume-hub1.png";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const ResumeHubPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  // Section Refs for Scroll Animations
  const whatRef = useRef(null);
  const tableRef = useRef(null);
  const bentoRef = useRef(null);
  const ctaRef = useRef(null);

  // useInView hooks
  const isWhatInView = useInView(whatRef, { once: true, margin: "-100px" });
  const isTableInView = useInView(tableRef, { once: true, margin: "-100px" });
  const isBentoInView = useInView(bentoRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const handleFeatureClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      localStorage.setItem("redirectPath", path);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-orange-100 overflow-x-hidden select-none">
      <NavBar />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pb-8 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative mt-16 z-10 px-8 mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-4 pt-16 lg:flex-row lg:text-left -mt-12"
          >
            <motion.div variants={fadeUp} className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full shadow-sm bg-blue-50">
                <LayoutDashboard size={14} className="text-[#0077cc]" />
                <span className="text-xs font-black tracking-widest text-[#0077cc] uppercase">
                  Master Portfolio
                </span>
              </div>
              <h1 className="mb-6 text-6xl md:text-7xl font-black leading-[0.95] tracking-tighter font-jakarta">
                Your Career. <br />
                <span className="text-[#0077cc]">Organized.</span>
              </h1>
              <p className="max-w-xl mx-auto mb-12 text-xl font-medium text-gray-500 lg:mx-0">
                Manage every version and land interviews faster with your centralized career command center.
              </p>

              <button
                onClick={() => handleFeatureClick("/user/my-resumes")}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10">Access My Hub</span>
                <Layers size={22} className="relative z-10 transition-transform group-hover:rotate-12" />
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="relative flex-1 flex justify-center lg:justify-end w-full">
              <img
                src={hub}
                alt="Hub"
                className="hidden md:block w-full max-w-[720px] lg:max-w-[850px] xl:max-w-[950px] h-auto drop-shadow-2xl"
              />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute hidden md:flex items-center gap-3 p-4 bg-white border border-gray-100 shadow-xl rounded-2xl bottom-10 right-10"
              >
                <div className="p-2 rounded-lg bg-green-50">
                  <BarChart3 className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Avg. AI Score</p>
                  <p className="text-lg font-black text-[#1a2e52]">92%</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. WHAT IS RESUME HUB --- */}
      <section ref={whatRef} className="px-8 py-20 bg-white font-['Outfit']">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isWhatInView ? "show" : "hidden"}
          className="relative mx-auto w-full max-w-5xl px-4 sm:px-6"
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-bold text-center text-[#1a2e52] mb-12">
            What is Resume Hub?
          </motion.h2>

          <motion.div variants={fadeUp} className="mb-12 space-y-6 text-lg text-gray-600">
            <p>
              Resume Hub is your centralized command center for managing every version of your professional identity.
            </p>
            <p>
              By leveraging our intelligent version control, you can quickly duplicate and tailor documents while maintaining a master record of achievements.
            </p>
          </motion.div>

          {/* Featured Blue Box */}
          <motion.div 
            variants={fadeUp}
            whileHover={{ y: -5 }}
            className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-5 shadow-xl sm:p-8"
          >
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Resume Hub Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Cloud Storage", desc: "Access documents from any device." },
                { title: "Version Control", desc: "Track versions for different job roles." },
                { title: "One-Click Duplication", desc: "Easily clone your best resume." },
                { title: "Organized Workspace", desc: "Tag and filter by industry status." },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">{item.title}:</span> {item.desc}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 3. TABLE SHOWCASE --- */}
      <section ref={tableRef} className="px-8 py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isTableInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <span className="pl-4 text-xs font-black tracking-widest text-gray-400 uppercase border-l border-gray-200 font-jakarta">
                  Resume Command Center
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-24 h-2 overflow-hidden bg-gray-100 rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={isTableInView ? { width: "75%" } : {}}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#0077cc]" 
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400">75% STORAGE</span>
              </div>
            </div>

            <div className="p-4 overflow-x-auto md:p-8">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <th className="px-6 pb-2">Resume Title</th>
                    <th className="px-6 pb-2 text-center">AI Score</th>
                    <th className="px-6 pb-2 text-center">Downloads</th>
                    <th className="px-6 pb-2">Last Modified</th>
                    <th className="px-6 pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <motion.tbody 
                  variants={staggerContainer} 
                  initial="hidden" 
                  animate={isTableInView ? "show" : "hidden"}
                >
                  {[
                    { title: "Product Manager - Tech", score: 94, dl: 18, date: "14 hours ago", color: "text-green-500" },
                    { title: "Senior Software Engineer", score: 88, dl: 12, date: "2 days ago", color: "text-[#0077cc]" },
                    { title: "Marketing Specialist", score: 76, dl: 5, date: "Jan 12, 2026", color: "text-orange-500" },
                  ].map((row, i) => (
                    <motion.tr
                      key={i}
                      variants={fadeUp}
                      className="transition-colors bg-white group/row hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-5 border-l border-gray-100 rounded-l-2xl border-y">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-12 text-[#0077cc] transition-transform bg-white border border-gray-100 rounded-lg shadow-sm group-hover/row:scale-110">
                            <FileText size={20} />
                          </div>
                          <span className="font-bold text-[#1a2e52]">{row.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center border-gray-100 border-y">
                        <div className={`inline-flex items-center gap-1 font-black ${row.color}`}>
                          <Zap size={14} fill="currentColor" /> {row.score}/100
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center border-gray-100 border-y">
                        <span className="text-sm font-bold text-gray-500">{row.dl} DLs</span>
                      </td>
                      <td className="px-6 py-5 border-gray-100 border-y">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock size={14} /> {row.date}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right border-r border-gray-100 rounded-r-2xl border-y">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#0077cc]"><Eye size={18} /></button>
                          <button className="p-2 text-gray-400 hover:text-[#0077cc]"><Download size={18} /></button>
                          <button className="p-2 text-gray-400 hover:text-[#0077cc]"><MoreHorizontal size={18} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 4. BENTO GRID --- */}
      <section ref={bentoRef} className="px-8 bg-white py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-xs font-black tracking-[0.3em] text-[#0077cc] uppercase">The Command Center</h2>
            <h3 className="text-4xl font-black text-[#1a2e52] font-jakarta tracking-tight">Everything you need, in one view.</h3>
          </div>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isBentoInView ? "show" : "hidden"}
            className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: <Copy />, title: "Instant Cloning", desc: "Duplicate any master resume in one click." },
              { icon: <BarChart3 />, title: "Score Tracking", desc: "Monitor 'Hire-ability' scores in real-time." },
              { icon: <History />, title: "Export History", desc: "Track every time your resume was shared." },
              { icon: <Clock />, title: "Version Control", desc: "Access and restore any previous edit." },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="p-4 sm:p-6 md:p-10 bg-white rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300 group"
              >
                <div className="flex items-center justify-center mb-6 sm:mb-8 text-[#0077cc] transition-all w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-blue-50 group-hover:bg-[#0077cc] group-hover:text-white group-hover:rotate-6">
                  {React.cloneElement(item.icon, { size: 20 })}
                </div>
                <h3 className="mb-3 text-sm sm:text-xl font-bold text-[#1a2e52]">{item.title}</h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 5. CTA SECTION --- */}
      <section ref={ctaRef} className="relative px-8 pt-12 pb-24 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isCtaInView ? "show" : "hidden"}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUp} className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Your Career. <span className="text-[#0077cc]">Organized.</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Manage every version, track real-time performance, and keep your job search organized in one location.
          </motion.p>

          <motion.button
            variants={fadeUp}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleFeatureClick("/user/my-resumes")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)]"
          >
            <span className="relative z-10">Access My Hub Now</span>
            <Layers size={22} className="relative z-10 transition-transform group-hover:rotate-12" />
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ResumeHubPage;
