import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilLine,
  Layout,
  UserCircle,
  Briefcase,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  XCircle,
  ShieldAlert,
  Search,
  Zap,
  ArrowLeft,
  Target,
  FileText,
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import TemplateFeature from "../assets/LiveQuality.png";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
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
const ResumeGuide = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleBackHome = () => {
    navigate("/");
  };

  const guideSteps = [
    {
      title: "Choose the Right Format",
      icon: <Layout size={24} />,
      content:
        "Select a layout that fits your career stage. Use 'Chronological' for consistent growth, 'Functional' to highlight skills, or 'Combination' for career changers.",
      details: [
        "Reverse-Chronological (Most Popular)",
        "Skills-Based",
        "Hybrid Layouts",
      ],
    },
    {
      title: "Contact Information",
      icon: <UserCircle size={24} />,
      content:
        "Ensure recruiters can reach you. Include your full name, a professional email, phone number, and location (City, State).",
      details: [
        "Professional Email Only",
        "LinkedIn Profile Link",
        "Job Title Headline",
      ],
    },
    {
      title: "Professional Summary",
      icon: <Sparkles size={24} />,
      content:
        "A 3-5 sentence 'elevator pitch' that highlights your biggest wins and what you bring to the table.",
      details: [
        "Focus on achievements",
        "Use strong action verbs",
        "Keep it under 5 sentences",
      ],
    },
    {
      title: "Work Experience",
      icon: <Briefcase size={24} />,
      content:
        "List roles in reverse order. Don't just list tasks—focus on measurable results and impact.",
      details: [
        "Quantify achievements (%)",
        "Use Action Verbs",
        "Limit to last 10-15 years",
      ],
    },
    {
      title: "Skills & Education",
      icon: <GraduationCap size={24} />,
      content:
        "Balance technical (Hard) skills with interpersonal (Soft) skills. List degrees and relevant certifications.",
      details: [
        "6-8 Core Skills",
        "Relevant Certifications",
        "Degree & Institution",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-['Outfit'] select-none">
      <NavBar />

      {/* --- 1. HERO SECTION (REDUCED SPACING) --- */}
      <section className="relative px-8 pt-4 pb-20 overflow-hidden bg-white">
        {" "}
        {/* Changed pt-24 to pt-8 */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-4">
            <button
              onClick={handleBackHome}
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#0077cc] transition-all duration-200"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Back to home</span>
            </button>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-16 lg:flex-row lg:text-left"
          >
            <motion.div
              variants={fadeUp}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50">
                <PencilLine size={16} className="text-[#0077cc]" />
                <span className="text-xs font-black tracking-widest text-[#0077cc] uppercase">
                  Masterclass 2026
                </span>
              </div>

              <h1 className="mb-6 text-6xl font-black tracking-tighter md:text-7xl lg:leading-[1.1] font-jakarta text-[#1a2e52]">
                High-Impact <br />
                <span className="text-[#0077cc]">Resume Writing.</span>
              </h1>

              <p className="max-w-xl mx-auto mb-10 text-xl font-medium leading-relaxed text-gray-500 lg:mx-0">
                A winning resume is a professional blueprint. We show you how to
                structure your career narrative to land interviews in{" "}
                <span className="font-bold text-[#1a2e52]">record time</span>.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95 mx-auto lg:mx-0"
              >
                <span>Start Building Now</span>
                <ArrowRight
                  size={22}
                  className="transition-transform duration-300 group-hover:translate-x-2"
                />
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative flex-1 w-full max-w-[550px]"
            >
              <img
                src={TemplateFeature}
                alt="Resume Mastery"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. THE BLUEPRINT (STEP-BY-STEP WHITE THEME) --- */}
      <section className="px-8 py-24 bg-white font-['Outfit']">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-7xl"
        >
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-[#1a2e52] tracking-tight mb-4 font-jakarta">
              The Step-by-Step Blueprint
            </h2>
            <p className="max-w-xl mx-auto text-lg font-medium text-gray-500">
              Everything you need to go from a blank page to a landed interview
              with architectural precision.
            </p>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* LEFT COLUMN: NAVIGATION CARDS */}
            <div className="space-y-4">
              {guideSteps.map((step, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer ${
                    activeStep === idx
                      ? "border-[#0077cc] bg-blue-50/30 shadow-xl shadow-blue-900/5 translate-x-4"
                      : "border-gray-50 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`h-16 w-16 flex items-center justify-center rounded-[1.5rem] transition-all duration-500 ${
                        activeStep === idx
                          ? "bg-[#0077cc] text-white shadow-lg shadow-blue-500/30"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${activeStep === idx ? "text-[#0077cc]" : "text-gray-400"}`}
                        >
                          Phase 0{idx + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1a2e52] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed text-gray-500">
                        {step.content}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      className={`transition-all duration-500 ${activeStep === idx ? "text-[#0077cc] opacity-100 translate-x-0" : "opacity-0 -translate-x-4 text-gray-300"}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: STICKY REFINEMENT CHECKLIST (WHITE THEME) */}
            <div className="sticky top-24 h-fit p-10 bg-white rounded-[3rem] text-[#1a2e52] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden group">
              {/* Subtle Brand Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 transition-all duration-700 rounded-full bg-blue-50 blur-2xl group-hover:bg-blue-100/50" />

              <div className="relative z-10 mb-8">
                <span className="text-xs font-black tracking-[0.2em] text-[#0077cc] uppercase">
                  Pro Tips: {guideSteps[activeStep].title}
                </span>
                <h4 className="mt-2 text-3xl font-black tracking-tight font-jakarta">
                  Refinement Checklist
                </h4>
              </div>

              <ul className="relative z-10 space-y-6">
                {guideSteps[activeStep].details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-lg font-bold group/item"
                  >
                    <div className="p-1 transition-colors rounded-full bg-blue-50 group-hover/item:bg-blue-100">
                      <CheckCircle2 size={24} className="text-[#0077cc]" />
                    </div>
                    <span className="text-gray-600 transition-transform group-hover/item:translate-x-1 group-hover/item:text-[#1a2e52]">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Expert Advice Box - Light Variant */}
              <div className="p-6 mt-12 bg-slate-50 border border-slate-100 rounded-[2rem] relative z-10 group-hover:bg-white group-hover:border-blue-100 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <Lightbulb className="text-orange-500" size={18} />
                  </div>
                  <span className="text-xs font-black tracking-widest text-orange-600 uppercase">
                    Expert Advice
                  </span>
                </div>
                <p className="text-sm italic font-medium leading-relaxed text-gray-500">
                  "Recruiters spend less than{" "}
                  <span className="text-[#1a2e52] font-bold">6 seconds</span> on
                  an initial scan. Make your most important impact visible
                  immediately."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- CONTENT TRANSFORMATION (BEFORE & AFTER) --- */}
      <section className="px-8 py-19 bg-gray-50/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#1a2e52] mb-4">
            From Tasks to Achievements
          </h2>
          <p className="mb-16 text-gray-500">
            Don't just list what you did—show how well you did it.
          </p>

          <div className="grid items-stretch gap-8 md:grid-cols-2">
            <div className="p-8 bg-white border border-red-100 rounded-[2rem] text-left hover:shadow-lg hover:shadow-red-50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-6 text-xs font-bold tracking-widest text-red-500 uppercase">
                <XCircle
                  size={16}
                  className="transition-transform group-hover:rotate-12"
                />{" "}
                Basic Duty (Weak)
              </div>
              <p className="italic font-medium leading-relaxed text-gray-400">
                "Responsible for managing the sales team and looking after
                monthly reports."
              </p>
            </div>
            <div className="p-8 bg-white border border-emerald-100 rounded-[2rem] text-left shadow-xl shadow-emerald-50 relative hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="absolute p-2 text-white transition-all rounded-full -top-4 -right-4 bg-emerald-500 group-hover:scale-110 group-hover:rotate-12">
                <Sparkles size={16} />
              </div>
              <div className="flex items-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase text-emerald-600">
                <CheckCircle2
                  size={16}
                  className="transition-transform group-hover:scale-110"
                />{" "}
                Result-Driven (Strong)
              </div>
              <p className="text-[#1a2e52] font-bold leading-relaxed">
                "Spearheaded a 12-person sales team, delivering a 22% increase
                in quarterly revenue through targeted lead optimization."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- RESUME FORMATS: THE BLUEPRINT SELECTION --- */}
      <section className="px-8 py-20 bg-slate-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black text-[#1a2e52] tracking-tighter">
              Choose Your Architecture.
            </h2>
            <p className="mt-4 font-medium text-gray-500">
              Select the structural layout that best represents your career
              journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Reverse-Chronological",
                use: "Best for: Continuous growth",
                desc: "The gold standard. Lists experience from most recent to oldest. Highly preferred by 99% of recruiters.",
                tag: "Most Popular",
              },
              {
                title: "Functional / Skills-Based",
                use: "Best for: Career changers",
                desc: "Focuses on professional strengths and competencies rather than a timeline of job titles.",
                tag: "Specialized",
              },
              {
                title: "Combination (Hybrid)",
                use: "Best for: Senior professionals",
                desc: "Balances a strong skills summary with a detailed chronological history of achievements.",
                tag: "Expert Level",
              },
            ].map((format, i) => (
              <div
                key={i}
                className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-xl transition-all group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0077cc] bg-blue-50 px-3 py-1 rounded-full">
                  {format.tag}
                </span>
                <h4 className="mt-6 mb-2 text-xl font-bold text-[#1a2e52]">
                  {format.title}
                </h4>
                <p className="text-sm font-bold text-[#0077cc] mb-4">
                  {format.use}
                </p>
                <p className="text-sm leading-relaxed text-gray-500">
                  {format.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HEADER COMPLIANCE: THE MODERN STANDARD --- */}
      <section className="px-8 py-19 bg-white">
        <div className="mx-auto max-w-5xl bg-[#1a2e52] rounded-[4rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-12 p-12 md:p-16 lg:flex-row">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">
                The "Clean Header" Protocol
              </h2>
              <p className="mb-8 leading-relaxed text-blue-100/70">
                Modern recruiting focuses on merit. Including unnecessary
                personal data can trigger unconscious bias or ATS errors.
              </p>

              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <div className="px-6 py-4 border bg-white/5 border-white/10 rounded-2xl">
                  <span className="block mb-1 text-xs font-black tracking-widest text-red-400 uppercase">
                    Remove These:
                  </span>
                  <p className="text-sm font-medium text-white/80">
                    DOB, Photos, Marital Status
                  </p>
                </div>
                <div className="px-6 py-4 border bg-white/5 border-white/10 rounded-2xl">
                  <span className="block mb-1 text-xs font-black tracking-widest uppercase text-emerald-400">
                    Keep These:
                  </span>
                  <p className="text-sm font-medium text-white/80">
                    Email, Phone, LinkedIn, Location
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 p-8 bg-white/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
              <ShieldAlert className="mb-4 text-orange-400" size={32} />
              <p className="text-sm italic font-medium leading-relaxed text-blue-50">
                "In many regions, including a photo is grounds for immediate
                resume deletion to comply with anti-discrimination laws."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILL ZONING: BENTO GRID --- */}
      <section className="px-8 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-end justify-between gap-6 mb-16 lg:flex-row">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-[#1a2e52] tracking-tighter">
                Strategic Skill Zoning.
              </h2>
              <p className="mt-4 font-medium text-gray-500">
                Don't just list skills; categorize them to show your full
                professional spectrum.
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border border-gray-200 rounded-xl hover:bg-gray-50">
              See Full Skill List <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 hover:bg-blue-50 transition-colors">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0077cc] shadow-sm mb-6">
                <Target size={24} />
              </div>
              <h4 className="text-xl font-black text-[#1a2e52] mb-3">
                Hard Skills
              </h4>
              <p className="text-sm leading-relaxed text-gray-500">
                Technical proficiencies, software, and industry-specific tools
                (e.g., Python, AWS, SQL).
              </p>
            </div>

            <div className="p-8 bg-orange-50/50 rounded-[2.5rem] border border-orange-100 hover:bg-orange-50 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 mb-6 text-orange-600 bg-white shadow-sm rounded-2xl">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-black text-[#1a2e52] mb-3">
                Soft Skills
              </h4>
              <p className="text-sm leading-relaxed text-gray-500">
                Interpersonal abilities like leadership, communication, and
                strategic problem-solving.
              </p>
            </div>

            <div className="p-8 bg-purple-50/50 rounded-[2.5rem] border border-purple-100 hover:bg-purple-50 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 mb-6 text-purple-600 bg-white shadow-sm rounded-2xl">
                <GraduationCap size={24} />
              </div>
              <h4 className="text-xl font-black text-[#1a2e52] mb-3">
                Certifications
              </h4>
              <p className="text-sm leading-relaxed text-gray-500">
                Proof of ongoing education and verified expertise from
                recognized institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. FINAL CTA --- */}
      <section className="relative px-8 pt-12 pb-24 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter leading-tight">
            Ready to <span className="text-[#0077cc]">Execute?</span>
          </h2>
          <p className="mb-10 text-xl font-medium text-gray-500">
            Put these expert strategies into practice. Turn your history into a
            clean, recruiter-approved masterpiece.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <span>Start My Resume</span>
            <ArrowRight
              size={22}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResumeGuide