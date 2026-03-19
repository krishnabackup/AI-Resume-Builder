import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lady from "../assets/StepsLady.png";
import {
  ArrowRight,
  CheckCircle,
  FileSearch,
  Target,
  Shield,
  Activity,
  UploadCloud,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import NavBar from "../components/NavBar";
import Footer from "./Footer";

/** ✅ helper: scroll animations */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

/** ✅ ATS donut chart data */
const atsBreakdown = [
  { name: "Keyword Match", value: 52 },
  { name: "Formatting", value: 28 },
  { name: "Sections", value: 20 },
];

const ATS_COLORS = ["#0077cc", "#e65100", "#1a2e52"];

/** ✅ FAQ Data */
const faqData = [
  {
    q: "How does the ATS Checker work?",
    a: "Our checker parses your resume file (PDF/Word) using algorithms similar to real corporate ATS software. It evaluates keyword density, section headers, and formatting to generate a compatibility score.",
  },
  {
    q: "What is a good ATS score?",
    a: "An ATS score above 80 is considered strong. A score between 60-79 is average and might need optimization. Anything below 60 implies your resume might be filtered out automatically.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, you can upload and scan your resume to get a preliminary score for free. Detailed fix recommendations may require an account.",
  },
  {
    q: "Can I upload both PDF and Word files?",
    a: "Yes! We support both .pdf and .docx formats. PDF is generally recommended for consistent formatting, but we test parseability for both.",
  },
];

function ATSDonutCard({ score = 78 }) {
  return (
    <div className="relative w-full rounded-[2.2rem] bg-white border border-gray-100 shadow-[0_25px_60px_rgba(26,46,82,0.14)] overflow-hidden">
      <div className="px-4 sm:px-6 md:px-7 pt-5 sm:pt-6 md:pt-7 pb-4 sm:pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-widest uppercase text-gray-400">
              ATS Score Overview
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black text-[#1a2e52]">
              {score}/100
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Breakdown of ATS scanning factors
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0077cc] text-[11px] font-bold">
            Instant
          </span>
        </div>

        <div className="relative mt-5 sm:mt-6 h-[190px] sm:h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={atsBreakdown}
                dataKey="value"
                innerRadius={58}
                outerRadius={80}
                paddingAngle={3}
                stroke="transparent"
              >
                {atsBreakdown.map((_, i) => (
                  <Cell key={i} fill={ATS_COLORS[i % ATS_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#1a2e52] tabular-nums">
              {score}%
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Match
            </div>
          </div>
        </div>

        <div className="mt-1 space-y-2">
          {atsBreakdown.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: ATS_COLORS[i] }}
                />
                <span className="font-semibold text-gray-600">{item.name}</span>
              </div>
              <span className="font-black text-[#1a2e52]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 sm:px-6 md:px-7 pb-5 sm:pb-7">
        <div className="rounded-xl bg-slate-50 border border-gray-100 p-3 text-center">
          <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">
            Keywords
          </p>
          <p className="mt-1 text-sm font-black text-[#1a2e52]">Strong</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-gray-100 p-3 text-center">
          <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">
            Format
          </p>
          <p className="mt-1 text-sm font-black text-[#1a2e52]">Good</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-gray-100 p-3 text-center">
          <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">
            Sections
          </p>
          <p className="mt-1 text-sm font-black text-[#1a2e52]">Ok</p>
        </div>
      </div>
    </div>
  );
}

const ATSCheckerFeature = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [heroRef, heroVisible] = useInView(0.2);
  const [procRef, procVisible] = useInView(0.15);
  const [uploadRef, uploadVisible] = useInView(0.15);
  const [fixesRef, fixesVisible] = useInView(0.15);
  const [faqRef, faqVisible] = useInView(0.15);
  const [openFaq, setOpenFaq] = useState(-1);

  const handleCTA = () => {
    if (!isLoggedIn) navigate("/login");
    else navigate("/user/ats-checker");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-['Outfit'] select-none overflow-x-hidden">
      <NavBar />

      {/* 1) HERO SECTION */}
      <section ref={heroRef} className="relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-24 pb-14 sm:pb-16 lg:pb-20 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-3xl -z-10 opacity-60" />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 md:gap-12 lg:gap-16 lg:grid-cols-2">
            <div className={`min-w-0 flex flex-col items-center text-center lg:items-start lg:text-left transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 mb-6 sm:mb-8 border rounded-full bg-slate-50 border-slate-100">
                <Shield size={14} className="text-[#0077cc]" />
                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Recruiter Screening
                </span>
              </div>

              <h1 className="mb-5 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-[#1a2e52] tracking-tight break-words">
                Get Past the Bots. <br />
                <span className="text-transparent bg-gradient-to-r from-[#0077cc] to-[#00a3ff] bg-clip-text">
                  Land the Interview.
                </span>
              </h1>

              <p className="mb-8 sm:mb-10 text-base sm:text-lg md:text-xl leading-relaxed text-gray-500 max-w-xl break-words">
                Our free ATS Checker simulates corporate screening algorithms to
                ensure your resume is robust, parseable, and keyword-optimized.
              </p>

              <button
                onClick={handleCTA}
                className="group relative inline-flex items-center gap-3 px-8 py-4  bg-gradient-to-br from-[#f59e0b] via-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:bg-[#0077cc] hover:-translate-y-1"
              >
                <span>Run Free Scan</span>
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8 text-sm font-medium text-gray-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
                    />
                  ))}
                </div>
                <p>Trusted by 10k+ job seekers</p>
              </div>
            </div>

            <div
              className={`relative transition-all duration-700 delay-100 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <div className="relative max-w-md mx-auto lg:mr-0">
                <img
                  src={Lady}
                  alt="Character pointing to ATS score"
                  className="hidden lg:block absolute left-[-13rem] bottom-0 h-auto w-full min-[1024px]:max-[1200px]:left-[-8rem] min-[1024px]:max-[1200px]:w-72 object-cover"
                />
                <ATSDonutCard score={82} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) PROCESS ROW */}
      <section
        ref={procRef}
        className="py-10 sm:py-12 bg-white border-y border-gray-50"
      >
        <div
          className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ${procVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 hidden md:block" />
            {[
              { step: "01", title: "Upload Resume", desc: "PDF or Word Doc" },
              { step: "02", title: "Smart Scan", desc: "AI Checks Keywords" },
              {
                step: "03",
                title: "Improve Score",
                desc: "Get Actionable Fixes",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white px-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#f0f7ff] text-[#0077cc] flex items-center justify-center font-black text-lg mb-3 shadow-sm border border-blue-100">
                  {s.step}
                </div>
                <h4 className="text-base font-bold text-[#1a2e52]">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3) SPLIT SECTION: UPLOAD & CHECKLIST */}
      <section
        ref={uploadRef}
        className="px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-24 bg-[#FAFAFA]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div
              className={`lg:col-span-5 transition-all duration-700 ${uploadVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
            >
              <div
                className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-6 sm:p-8 md:p-10 text-center cursor-pointer hover:border-[#0077cc] hover:bg-blue-50/30 transition-all group"
                onClick={handleCTA}
              >
                <div className="w-20 h-20 rounded-full bg-blue-50 text-[#0077cc] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1a2e52] mb-3">
                  Check your resume
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
                  Drag and drop your file here, or click to browse. <br />
                  Supports PDF and Word.
                </p>
                <button className="px-6 py-3 bg-[#0077cc] text-white font-bold rounded-lg shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all">
                  Upload your resume
                </button>
              </div>
            </div>

            <div
              className={`lg:col-span-7 transition-all duration-700 delay-100 ${uploadVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            >
              <h2 className="text-2xl sm:text-3xl font-black text-[#1a2e52] mb-6 sm:mb-8">
                Comprehensive <span className="text-[#0077cc]">Checklist</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    t: "Keyword Matching",
                    d: "Compares your skills vs. job description",
                  },
                  {
                    t: "Formatting Check",
                    d: "Ensures fonts & margins are ATS-safe",
                  },
                  {
                    t: "Contact Info",
                    d: "Validates email & phone parseability",
                  },
                  {
                    t: "Section Headers",
                    d: "Checks for standard, readable headings",
                  },
                  {
                    t: "Date Formats",
                    d: "Verifies work history timeline clarity",
                  },
                  { t: "File Integrity", d: "Tests PDF/Docx structure code" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mt-1 text-green-500">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a2e52]">{item.t}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) TOP ATS FIXES */}
      <section
        ref={fixesRef}
        className="px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 bg-white"
      >
        <div
          className={`max-w-6xl mx-auto transition-all duration-700 ${fixesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2e52]">
              Top ATS Fixes
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-500">
              Most common reasons resumes get rejected.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileSearch,
                title: "Missing Keywords",
                desc: "Recruiters search for specific skills. If you don't list them, you don't appear.",
              },
              {
                icon: AlertCircle,
                title: "Graphics & Tables",
                desc: "Complex layouts confuse parsers. Keep it clean and linear.",
              },
              {
                icon: Target,
                title: "Generic Titles",
                desc: "Use standard job titles (e.g. 'Sales Manager' vs 'Revenue Ninja').",
              },
              {
                icon: Activity,
                title: "Dateless Experience",
                desc: "ATS needs standardized dates to calculate years of experience.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 bg-slate-50 rounded-[2rem] hover:bg-[#f0f7ff] transition-colors group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1a2e52] shadow-sm mb-6 group-hover:text-[#0077cc] group-hover:scale-110 transition-all">
                  <card.icon size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a2e52] mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5) FAQ */}
      <section ref={faqRef} className="px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 bg-[#f8f9fc]">
        <div className={`max-w-3xl mx-auto transition-all duration-700 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-2xl sm:text-3xl font-black text-center text-[#1a2e52] mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
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
                  className={`px-4 sm:px-6 text-sm sm:text-base text-gray-500 leading-relaxed overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-64 pb-5 sm:pb-6 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ATSCheckerFeature;