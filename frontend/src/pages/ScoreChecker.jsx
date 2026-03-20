import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle2,
  ArrowRight,
  Zap,
  PenTool,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  User,
  TrendingUp,
  ChevronDown,
  Target,
  FileSearch,
  Eye
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip
} from "recharts";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import write from "../assets/Live.png";
import { motion } from "framer-motion";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const ScoreChecker = () => {
  const navigate = useNavigate();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleFeatureClick = (path) => {
    if (isLoggedIn) navigate(path);
    else {
      localStorage.setItem("redirectPath", path);
      navigate("/login");
    }
  };

  const [text, setText] = useState(
    "Senior Software Engineer\n\n- Spearheaded a team of 5 developers to build a scalable React application.\n- Improved page load speed by 40% using code splitting and lazy loading.\n- Integrated RESTful APIs and optimized database queries for better performance."
  );

  const [openFaq, setOpenFaq] = useState(-1);

  const [breakRef, breakVisible] = useInView(0.15);
  const [calcRef, calcVisible] = useInView(0.15);
  const [faqRef, faqVisible] = useInView(0.15);
  const [ctaRef, ctaVisible] = useInView(0.2);

  const scoreValue = useMemo(() => {
    const len = text.trim().length;
    const bullets = (text.match(/- /g) || []).length;
    const hasNumbers = /\d+%|\d+x|\$\d+/.test(text);

    let s = 65;
    if (len > 150) s += 10;
    if (bullets >= 2) s += 10;
    if (hasNumbers) s += 10;

    return Math.min(100, s);
  }, [text]);

  const feedback = useMemo(() => {
    const items = [];
    if (!/\d+%|\d+x|\$\d+/.test(text)) {
      items.push({
        type: "warning",
        text: "Add quantifiable results (e.g., 'Increased revenue by 20%')",
      });
    }
    if ((text.match(/- /g) || []).length < 3) {
      items.push({
        type: "tip",
        text: "Aim for at least 3 bullet points per role.",
      });
    }
    if (text.length < 200) {
      items.push({
        type: "tip",
        text: "Expand on your specific technical contributions.",
      });
    }
    if (items.length === 0) {
      items.push({
        type: "success",
        text: "Excellent! Strong use of action verbs and metrics.",
      });
    }
    return items;
  }, [text]);

  const trendData = useMemo(() => {
    const base = Math.max(50, scoreValue - 20);
    return Array.from({ length: 8 }).map((_, i) => ({
      edit: `v${i + 1}`,
      score: Math.min(100, base + Math.floor(Math.random() * 5) + i * 2.5),
    }));
  }, [scoreValue]);

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-['Outfit'] text-[#1a2e52] selection:bg-orange-100 overflow-x-hidden">
      <NavBar />

      {/* 1) HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 xl:pt-24 pb-8 sm:pb-12 lg:pb-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            {/* LEFT: TEXT */}
            <motion.div
              variants={fadeUp}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-orange-50 border border-orange-100 rounded-full">
                <Activity size={14} className="text-[#e65100]" />
                <span className="text-xs font-bold tracking-widest text-[#e65100] uppercase">
                  Live Quality Scoring
                </span>
              </div>

            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#1a2e52]">
                Write Better. <br />
                <span className="text-[#0077cc]">
                  Rank Higher.
                </span>
              </h1>

              <p className="max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base md:text-lg font-light leading-relaxed text-gray-500 lg:mx-0">
                See your resume score update in real-time as you type. Our AI
                highlights vague wording and suggests impactful improvements
                instantly.
              </p>
            </motion.div>

            {/* RIGHT: IMAGE */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="relative flex justify-center lg:justify-end"
            >
              <img
                src={write}
                alt="Resume scoring illustration"
                className="hidden lg:block w-full max-w-sm xl:max-w-md object-contain"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2) MAIN LIVE DEMO */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          {/* LEFT: Live Editor Mock */}
          <motion.div
            variants={fadeLeft}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="lg:col-span-7 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[500px] sm:h-[600px] ring-1 ring-slate-900/5"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-5 border-b border-gray-100 bg-white flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-[#0077cc] flex items-center justify-center">
                  <PenTool size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1a2e52]">
                    Experience Editor
                  </h3>
                  <p className="text-xs text-gray-400">Untitled Resume.pdf</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Editor Toolbar (Visual Mock) */}
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50 border-b border-gray-100 flex items-center gap-2 sm:gap-4 text-gray-500 overflow-x-auto">
              <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-serif font-bold">
                  B
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-serif italic">
                  I
                </button>
                <button className="p-1.5 hover:bg-gray-200 rounded text-gray-700 underline underline-offset-2">
                  U
                </button>
              </div>
              <div className="flex items-center gap-2 pr-4 border-r border-gray-200 text-xs font-semibold">
                <span className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">
                  Normal Text
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="p-1.5 hover:bg-gray-200 rounded cursor-pointer">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </div>
                <div className="p-1.5 hover:bg-gray-200 rounded cursor-pointer">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="21" y1="10" x2="3" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="21" y1="18" x2="3" y2="18"></line>
                  </svg>
                </div>
              </div>
              <div className="ml-auto">
                <button className="text-[10px] sm:text-xs font-bold text-[#0077cc] bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 hover:bg-blue-100 transition-colors">
                  <Sparkles size={10} /> AI Rewrite
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-full p-4 sm:p-6 lg:p-8 text-sm sm:text-base leading-[1.6] sm:leading-[1.8] text-slate-700 outline-none resize-none font-medium placeholder-gray-300 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                spellCheck="false"
                placeholder="Describe your role..."
              />
              <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-6 px-2 sm:px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] sm:text-[10px] font-bold text-slate-400 pointer-events-none tabular-nums shadow-sm">
                {text.length} chars
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Feedback Stream + Meter */}
          <div className="lg:col-span-5 space-y-6">
            {/* Score Card */}
            <motion.div
              variants={fadeRight}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-[#1a2e52] rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-200">
                    Overall Quality
                  </p>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                    {scoreValue}
                  </h3>
                </div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={
                        scoreValue >= 80
                          ? "#22c55e"
                          : scoreValue >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={
                        2 * Math.PI * 40 -
                        (scoreValue / 100) * (2 * Math.PI * 40)
                      }
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-lg sm:text-xl lg:text-2xl font-black text-white">
                    {scoreValue}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {feedback.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl backdrop-blur-sm ${item.type === "success" ? "bg-[#00ff9d]/10 border border-[#00ff9d]/20" : "bg-white/5 border border-white/10"}`}
                  >
                    {item.type === "success" ? (
                      <CheckCircle2
                        size={14} className="text-[#00ff9d] mt-0.5"
                      />
                    ) : (
                      <Zap size={14} className="text-[#ffb700] mt-0.5" />
                    )}
                    <p className="text-[10px] sm:text-xs font-medium leading-relaxed opacity-90">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trend Chart (Mini) */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="font-bold text-sm sm:text-base text-[#1a2e52] flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#0077cc]" />
                  Score Trend
                </h4>
                <span className="text-[9px] sm:text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">
                  +12% vs last edit
                </span>
              </div>

              <div className="h-[120px] sm:h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0077cc"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0077cc"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#0077cc"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3) SECTION SCORE TILES */}
      <section
        ref={breakRef}
        className={`px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white transition-all duration-700 ${breakVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1a2e52] mb-6 sm:mb-8 text-center md:text-left">
            Detailed Breakdown
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {[
              {
                label: "Summary",
                score: 92,
                icon: BookOpen,
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                label: "Experience",
                score: 65,
                icon: Briefcase,
                color: "text-orange-500",
                bg: "bg-orange-50",
              },
              {
                label: "Skills",
                score: 88,
                icon: Zap,
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                label: "Education",
                score: 100,
                icon: Award,
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 bg-white hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={20} />
                </div>
                <h3 className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                  {item.label}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#1a2e52]">
                    {item.score}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400">/100</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4) HOW WE CALCULATE */}
      <section
        ref={calcRef}
        className={`px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gray-50/50 transition-all duration-700 ${calcVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a2e52]">
              How We Calculate Your Score
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
              Our engine analyzes 25+ data points across three core pillars to
              determine your interview readiness.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                title: "Impact & Metrics",
                desc: "We scan for numbers, percentages, and dollar amounts that prove your value.",
                items: [
                  "Quantifiable results",
                  "Action verb strength",
                  "Role scope",
                ],
                icon: Target,
                color: "text-red-500",
                bg: "bg-red-50",
              },
              {
                title: "Relevance & Keywords",
                desc: "We check if your skills match the job description and industry standards.",
                items: [
                  "Hard skill density",
                  "Job title alignment",
                  "Tech stack match",
                ],
                icon: FileSearch,
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                title: "Clarity & Brevity",
                desc: "We ensure your writing is concise, error-free, and easy to skim.",
                items: [
                  "Bullet point length",
                  "Active voice usage",
                  "Readability score",
                ],
                icon: Eye,
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
            ].map((col, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${col.bg} ${col.color} flex items-center justify-center mb-4 sm:mb-6 font-bold text-xl group-hover:scale-110 transition-transform`}
                >
                  <col.icon size={24} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a2e52] mb-2 sm:mb-3">
                  {col.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                  {col.desc}
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {col.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                    >
                      <CheckCircle2
                        size={14} className="text-green-500 shrink-0"
                      />
                      <span className="text-xs sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5) WHY IT MATTERS */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center"
        >
          <motion.div variants={fadeLeft}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl lg:text-5xl font-black text-[#1a2e52] leading-tight mb-6 sm:mb-8">
              Why aim for a <br />
              <span className="text-[#e65100]">90+ Score?</span>
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-50 text-[#e65100] flex items-center justify-center shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#1a2e52]">
                    3x More Interviews
                  </h4>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed mt-1 sm:mt-2">
                    Candidates with optimized scores get significantly more
                    callbacks than those with generic resumes.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-[#0077cc] flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#1a2e52]">
                    Pass the HUMAN Test
                  </h4>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed mt-1 sm:mt-2">
                    High scores mean better readability. Recruiters spend only 6
                    seconds scanning; make them count.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-blue-50 rounded-[3rem] transform rotate-3" />
            <div className="relative bg-[#1a2e52] p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-white/10 pb-6 sm:pb-8">
                <div>
                  <p className="text-blue-200 text-xs sm:text-sm font-bold uppercase tracking-widest">
                    Average Callback Rate
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-1 sm:mt-2">2.5%</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Generic Resume</p>
                </div>
                <div className="text-right">
                  <p className="text-[#e65100] text-xs sm:text-sm font-bold uppercase tracking-widest">
                    Optimized Rate
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-1 sm:mt-2 text-[#ffb700]">18%</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Score 90+</p>
                </div>
              </div>
              <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed opacity-90">
                "I used the live scoring to tweak my bullet points. I went from
                0 interviews in a month to 5 calls in one week."
              </p>
              <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20" />
                <div>
                  <p className="font-bold text-sm sm:text-base">Alex Chen</p>
                  <p className="text-xs text-blue-200">
                    Software Engineer at TechCorp
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 6) FAQ */}
      <section
        ref={faqRef}
        className={`px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[#F8F9FC] transition-all duration-700 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-center text-[#1a2e52] mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                q: "How is this different from the ATS Checker?",
                a: "The ATS Checker focuses on formatting and parseability (can a bot read it?). The Quality Score focuses on content impact (will a human be impressed?). You need both.",
              },
              {
                q: "Does a 100 score guarantee a job?",
                a: "No tool can guarantee a job, but a perfect score ensures your resume has no red flags, maximizing your chances of passing the initial screening.",
              },
              {
                q: "What if my score is stuck at 70?",
                a: "Try adding more numbers! 'Managed a team' is okay, but 'Managed a team of 12 and increased output by 40%' is much stronger.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="p-4 sm:p-6 flex items-center justify-between">
                  <h3
                    className={`font-bold text-base sm:text-lg ${openFaq === i ? "text-[#0077cc]" : "text-[#1a2e52]"}`}
                  >
                    {item.q}
                  </h3>
                  <ChevronDown
                    className={`transition-transform duration-300 text-gray-400 ${openFaq === i ? "rotate-180 text-[#0077cc]" : ""}`}
                  />
                </div>
                <div
                  className={`px-4 sm:px-6 text-sm sm:text-base text-gray-500 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-4 sm:pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {item.a}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        ref={ctaRef}
        className={`relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden bg-white text-center transition-all duration-700 ${ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#1a2e52] tracking-tight">
            Ready to <span className="text-[#0077cc]">optimize</span> your
            entire resume?
          </h2>
          <p className="mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base lg:text-lg text-gray-500">
            Join thousands of job seekers using our real-time scoring to land
            interviews 3x faster.
          </p>

          <button
            onClick={() => handleFeatureClick("/user/ats-checker")}
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-[#1a2e52] text-white rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all shadow-xl hover:bg-[#0077cc] hover:-translate-y-1"
          >
            Start Editing Now <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ScoreChecker;
