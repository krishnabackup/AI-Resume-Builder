import React from "react";
import { 
  Sparkles, 
  Cpu, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Layers,
  Wand2 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion"; // Added useInView here
import { useRef } from "react";

// Components
import Footer from "./Footer";
import NavBar from "../components/NavBar";
import AiEnhancement from "../assets/AiEnhancement.png";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const AIEnhancementPage = () => {
  const navigate = useNavigate();
  
  // Create refs for scroll-triggered animations
  const whatRef = useRef(null);
  const featureRef = useRef(null);
  const ctaRef = useRef(null);

  // useInView hooks
  const isWhatInView = useInView(whatRef, { once: true, margin: "-100px" });
  const isFeatureInView = useInView(featureRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-orange-100 overflow-x-hidden select-none">
      <NavBar />
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative px-6 pt-32 overflow-hidden bg-white">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-blue-50 rounded-full blur-[140px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-orange-50 rounded-full blur-[140px] -z-10 opacity-60" />

        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid items-center min-h-[80vh] gap-8 pb-16 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[1fr_1.4fr]"
          >
            {/* LEFT CONTENT */}
            <motion.div variants={fadeUp} className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-50">
                <Cpu size={16} className="text-[#0077cc]" />
                <span className="text-xs font-bold tracking-widest text-[#0077cc] uppercase">
                  Smart Content Optimization
                </span>
              </div>

              <h1 className="mb-5 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl leading-[1.1] font-jakarta">
                Turn Weak Points into <br />
                <span className="text-[#0077cc]">Power Phrases.</span>
              </h1>

              <p className="max-w-xl mx-auto mb-8 text-lg md:text-xl text-gray-500 lg:mx-0">
                Our AI re-writes your boring job duties into metric-driven achievements that land more interviews instantly.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
              >
                Enhance My Content
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            {/* RIGHT IMAGE */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-end">
              <img
                src={AiEnhancement}
                alt="AI Resume Content Enhancement"
                className="hidden md:block w-full max-w-[820px] xl:max-w-[950px] drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. WHAT IS AI ENHANCEMENT --- */}
      <section ref={whatRef} className="px-8 py-20 bg-white font-['Outfit']">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isWhatInView ? "show" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-bold text-center text-[#1a2e52] mb-12">
            What is AI Enhancement?
          </motion.h2>
          
          <motion.div variants={fadeUp} className="mb-12 space-y-6 text-lg text-center text-gray-600 md:text-left">
            <p>
              AI Enhancement is the process of using Natural Language Processing (NLP) to analyze your existing resume bullets and upgrade them for maximum impact. It focuses on using <strong>action verbs</strong> and <strong>quantifiable results</strong> to prove your value.
            </p>
            <p>
              Hiring managers don't want to see what you were "responsible for"—they want to see what you <strong>achieved</strong>. Our engine scans your drafts and suggests high-performance alternatives tailored to your specific industry.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our AI Optimizer Scans for:</h3>
            <ul className="space-y-4">
              {[
                { title: "Strong Action Verbs", desc: "Replaces passive language with leadership-focused verbs." },
                { title: "Metric Identification", desc: "Identifies opportunities to add percentages, dollars, or timeframes." },
                { title: "Skill Density", desc: "Ensures your key competencies are naturally woven into every bullet." },
                { title: "Contextual Relevance", desc: "Checks if your achievements align with the job's senior requirements." }
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  variants={fadeUp}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={20} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-gray-700"><span className="font-bold">{item.title}:</span> {item.desc}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 3. DYNAMIC FEATURE GRID ---  */}
      <section ref={featureRef} className="relative px-8 overflow-hidden py-8 bg-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isFeatureInView ? { opacity: 1, y: 0 } : {}}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-black text-[#1a2e52] mb-4 tracking-tight font-jakarta">
              AI Powered <span className="text-[#e65100]">Refinement</span>
            </h2>
            <p className="max-w-xl mx-auto font-medium text-gray-500">How our engine fine-tunes your professional story.</p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isFeatureInView ? "show" : "hidden"}
            className="grid grid-cols-2 gap-6 md:grid-cols-3"
          >
            {[
              { icon: Wand2, t: "Auto-Rewrite", d: "Instantly transform one-line duties into multi-dimensional achievements." },
              { icon: Target, t: "Industry Targeting", d: "Uses vocabulary specific to your field (Tech, Finance, Healthcare, etc.)." },
              { icon: TrendingUp, t: "Quantification", d: "Forces metrics into your bullets to prove your business impact." },
              { icon: Layers, t: "Hierarchy Logic", d: "Re-orders your bullet points so your best work is seen first." },
              { icon: Zap, t: "Tone Adjustment", d: "Ensures your writing sounds confident and professional." },
              { icon: CheckCircle2, t: "Clarity Check", d: "Removes corporate jargon and fluff to make every word count." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                className="p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 bg-white transition-all duration-300 group"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 mb-6 sm:mb-8 bg-blue-50 rounded-lg sm:rounded-2xl group-hover:bg-[#0077cc] transition-colors duration-300">
                  <feature.icon size={20} className="text-[#0077cc] group-hover:text-white transition-colors" />
                </div>
                <h4 className="mb-2 sm:mb-3 text-sm sm:text-xl font-bold text-[#1a2e52] group-hover:text-[#0077cc] transition-colors">
                  {feature.t}
                </h4>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-400 transition-colors group-hover:text-gray-600">
                  {feature.d}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- 4. CTA SECTION --- */}
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
            Ready to Upgrade Your <span className="text-[#0077cc]">Content?</span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Let AI do the hard work of writing. Start landing more interviews with perfectly architected bullet points.
          </motion.p>

          <motion.button
            variants={fadeUp}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/register")}
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-10 sm:py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-[0_8px_18px_rgba(230,81,0,0.22)] hover:shadow-[0_12px_28px_rgba(230,81,0,0.3)]"
          >
            <Sparkles size={16} className="fill-white" />
            <span className="relative z-10">Start Enhancing Now</span>
            <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AIEnhancementPage;