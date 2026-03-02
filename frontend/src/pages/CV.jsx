import React from 'react';
import {
  Layout,
  Layers,
  Maximize,
  Palette,
  CheckCircle2,
  ArrowRight,
  Type,
  MousePointerSquareDashed,
  Download,
  Sparkles,
  FileSearch,
  RefreshCw,
  CheckCircle,
  MousePointer2,
  ArrowLeft
} from 'lucide-react';
import Footer from "./Footer"
import { useNavigate } from "react-router-dom";
import CV from "../assets/CV1.png";
import NavBar from "../components/NavBar";

const CVFormattingPage = () => {
  const navigate = useNavigate();

  
  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-blue-100 overflow-x-hidden">
      <NavBar />
      {/* --- 1. HERO SECTION --- */}
      <section className="relative px-6 pt-16 overflow-hidden bg-white">

        {/* Brand Decorative Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative z-10 mx-auto max-w-7xl pt-10">

          

          <div className="flex flex-col items-center gap-16 lg:flex-row lg:text-left">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50 group">
                <Layers size={16} className="text-[#0077cc]" />
                <span className="text-xs font-black tracking-widest text-[#0077cc] uppercase">Document Architecture</span>
              </div>

              <h1 className="mb-6 text-6xl font-black tracking-tighter md:text-7xl lg:leading-[1.1] font-jakarta">
                Professional CV <br />
                <span className="text-[#0077cc]">Re-Architected.</span>
              </h1>

              <p className="max-w-xl mx-auto mb-10 text-xl font-medium leading-relaxed text-gray-500 lg:mx-0">
                Design matters as much as data. We transform messy documents into clean, high-impact narratives that recruiters scan in <span className="font-bold text-[#1a2e52]">6 seconds</span>.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95 mx-auto lg:mx-0"
              >
                <span>Format My CV Now</span>
                <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

            {/* Right Side Image Frame */}
            <div className="relative flex-1 w-full max-w-[550px]">
              <div className="absolute z-20 hidden p-4 bg-white border border-gray-100 shadow-xl -top-6 -left-6 rounded-2xl md:block animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50"><CheckCircle2 className="text-[#0077cc]" size={18} /></div>
                  <span className="text-xs font-bold tracking-tight text-[#1a2e52]">Recruiter Approved</span>
                </div>
              </div>


              <img src={CV} alt="Professional CV Structure" className="hidden md:block w-full h-auto" />


            </div>
          </div>
        </div>
      </section>

      {/* --- WHAT IS PROFESSIONAL CV FORMATTING --- */}
      <section className="px-8 py-20 bg-white font-['Outfit']">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1a2e52] mb-12">What is Professional CV Formatting?</h2>

          <div className="mb-12 space-y-6 text-lg text-gray-600">
            <p>
              Professional CV formatting is the architectural process of organizing your career history into a high-impact visual narrative. It ensures that your most impressive achievements are positioned where a recruiter's eye naturally lands during a 6-second scan.
            </p>
            <p>
              Our AI-driven formatter goes beyond simple templates; it optimizes font hierarchy, white space, and section zoning to ensure your document is beautiful to humans and perfectly readable by machines. We turn messy drafts into polished, recruiter-approved masterpieces.
            </p>
          </div>

          {/* Featured Blue Box */}
          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our CV Architect focuses on:</h3>
            <ul className="space-y-4">
              {[
                { title: "Information Hierarchy", desc: "Prioritizes your most relevant achievements at the top." },
                { title: "Typography Optimization", desc: "Uses professional font pairings for maximum screen readability." },
                { title: "ATS-Safe Elements", desc: "Removes graphics or tables that could break digital scanning." },
                { title: "Visual Balance", desc: "Adjusts margins and spacing to eliminate 'wall of text' fatigue." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-bold">{item.title}:</span> {item.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- 2. BEFORE vs AFTER (VISUAL PROOF) --- */}
      <section className="px-8 py-20 bg-white overflow-hidden font-['Outfit']">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center duration-700 animate-in fade-in slide-in-from-bottom-6">
            <h2 className="text-4xl font-[1000] tracking-tight text-[#1a2e52] mb-4">Visual Impact Analysis</h2>
            <p className="max-w-xl mx-auto font-medium text-gray-500">
              See how our AI restructures messy data into high-performance professional narratives.
            </p>
          </div>

          {/* Container with group-hover logic to dim the non-hovered box */}
          <div className="grid items-stretch gap-8 md:grid-cols-2 group/container">

            {/* --- BOX 1: THE "BEFORE" --- */}
            <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-200 opacity-80 
  /* Transitions: Smooth scaling and opacity only */
  transition-all duration-500 ease-out
  /* Hover State: Lift, brighten, and sharpen text */
  hover:opacity-100 hover:bg-white hover:shadow-2xl hover:z-20 hover:scale-[1.02]
  /* Layout */
  flex flex-col justify-between active:scale-[0.98] group cursor-default"
            >
              <div>
                <span className="block mb-6 text-xs font-black tracking-[0.2em] uppercase text-slate-400 group-hover:text-red-500 transition-colors">
                  Unstructured Draft
                </span>

                <div className="mb-8 space-y-4 transition-transform duration-500 group-hover:translate-x-1">
                  <h4 className="text-lg font-bold text-slate-700">Project Manager at TechCorp</h4>
                  <div className="space-y-3">
                    <p className="text-xs font-medium leading-relaxed transition-colors text-slate-500 group-hover:text-slate-800">
                      I was responsible for managing a team of 10 people and we worked on software projects.
                      I attended daily meetings and made sure everyone was doing their tasks on time.
                      I also used Jira to track bugs and spoke to stakeholders about the progress
                      of the project every week. It was a very busy role and I learned a lot.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-black tracking-widest text-red-400 uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Recruiter Focus: Low
                </div>
                <p className="mt-2 text-[11px] font-medium text-slate-400 italic">
                  Too wordy, lacks metrics, and has poor visual scannability.
                </p>
              </div>
            </div>

            {/* --- BOX 2: THE "AFTER" --- */}
            <div className="p-10 bg-white rounded-[40px] border-2 border-blue-600 shadow-2xl shadow-blue-900/10 relative transition-all duration-700 hover:-translate-y-4 hover:shadow-blue-500/20 group flex flex-col justify-between z-10 hover:blur-none! active:scale-[0.98]">
              {/* Animated Badge */}
              <div className="absolute -top-4 right-10 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500 tracking-widest flex items-center gap-2">
                <Sparkles size={12} className="animate-spin-slow" />
                AI Optimized
              </div>

              <div>
                <span className="block mb-6 text-xs font-black tracking-[0.2em] text-blue-600 uppercase">Smart Hierarchy</span>

                <div className="mb-8 space-y-5">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xl font-black text-[#1a2e52] tracking-tight group-hover:text-blue-600 transition-colors">Project Manager</h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">TechCorp</span>
                  </div>

                  <ul className="space-y-3">
                    {[
                      { val: "15+ software releases", text: "Led a cross-functional team of 10 to deliver ", post: " 2 weeks ahead of schedule." },
                      { val: "35%", text: "Reduced bug resolution time by ", post: " through advanced Jira workflow optimization." },
                      { val: "$2M budget", text: "Managed a ", post: ", identifying cost-saving measures that saved $200k annually." }
                    ].map((item, i) => (
                      <li key={i}
                        className="flex items-start gap-3 transition-all duration-500 translate-x-0 group-hover:translate-x-2"
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                        <p className="text-xs font-semibold text-slate-700">
                          {item.text}<span className="font-bold text-blue-600 transition-all group-hover:underline decoration-blue-200 underline-offset-2">{item.val}</span>{item.post}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-blue-50">
                <div className="flex items-center gap-2 text-xs font-black tracking-widest text-green-500 uppercase">
                  <CheckCircle2 size={14} className="transition-transform duration-500 group-hover:scale-125" />
                  Recruiter Focus: High
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Data-Driven', 'Action Verbs', 'Skimmable'].map((tag, i) => (
                    <span key={i}
                      className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded transition-all duration-300 hover:bg-blue-600 hover:text-white cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- 3. CV ARCHITECTURE PROCESS (MATCHING REFERENCE UI) --- */}
      <section className="px-8 py-15 bg-white font-['Outfit']">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl md:text-5xl font-black text-[#1a2e52]">
              CV Optimization Steps
            </h2>
            <p className="max-w-xl mx-auto text-lg font-medium text-gray-500">
              We transform your experience into a high-performance document.
            </p>
          </div>

          {/* Responsive Grid matching the reference image layout */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: FileSearch,
                t: "Content Analysis",
                d: "Our AI identifies missing keywords and action verbs required for your industry.",
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              {
                icon: RefreshCw,
                t: "Smart Re-Formatting",
                d: "We automatically adjust margins and hierarchy for maximum readability.",
                color: "text-[#e65100]",
                bg: "bg-orange-50"
              },
              {
                icon: CheckCircle,
                t: "ATS Verification",
                d: "The final document is tested against 100+ recruiter algorithms for a 90+ score.",
                color: "text-green-500",
                bg: "bg-green-50"
              }
            ].map((step, i) => (
              <div
                key={i}
                className="relative p-10 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center"
              >
                {/* Step Number Badge */}
                <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-[#1a2e52] group-hover:text-white transition-colors">
                  0{i + 1}
                </div>

                {/* Icon Container matching reference image style */}
                <div className={`mb-8 p-6 rounded-3xl ${step.bg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon size={48} className={step.color} />
                </div>

                <h4 className="mb-4 text-2xl font-bold text-[#1a2e52] group-hover:text-[#0077cc] transition-colors">
                  {step.t}
                </h4>

                <p className="font-medium leading-relaxed text-gray-500">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. STYLE BENTO GRID --- */}
      <section className="px-8 mx-auto py-10 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-10 bg-slate-50 rounded-[40px] flex flex-col justify-between transition-all duration-500 hover:bg-slate-100 hover:-translate-y-2 hover:shadow-xl group cursor-default">
            <MousePointerSquareDashed className="mb-6 text-blue-600 transition-transform duration-500 group-hover:scale-125" size={32} />
            <div>
              <h4 className="mb-2 text-2xl font-black">Pixel Perfect</h4>
              <p className="text-sm font-medium text-slate-500">Every line, dot, and margin is aligned to professional design standards.</p>
            </div>
          </div>
          <div className="p-10 bg-blue-50 rounded-[40px] flex flex-col justify-between transition-all duration-500 hover:bg-blue-100 hover:-translate-y-2 hover:shadow-xl group cursor-default">
            <Download className="mb-6 text-blue-600 transition-transform duration-500 group-hover:scale-125 group-hover:animate-bounce" size={32} />
            <div>
              <h4 className="mb-2 text-2xl font-black">Export Ready</h4>
              <p className="text-sm font-medium text-slate-500">Optimized for PDF export so your layout never breaks across systems.</p>
            </div>
          </div>
          <div className="p-10 bg-[#1a2e52] text-white rounded-[40px] flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 group cursor-default">
            <CheckCircle2 className="mb-6 text-blue-400 transition-transform duration-500 group-hover:scale-125" size={32} />
            <div>
              <h4 className="mb-2 text-2xl font-black">ATS Friendly</h4>
              <p className="text-sm font-medium text-blue-200/60">Beautiful to humans, perfectly readable by application software.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative px-8 pt-12 pb-15 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Professional CV <span className="text-[#0077cc]">Re-Architected.</span>
          </h2>
          <p className="mb-10 text-xl font-medium text-gray-500">
            Design matters. Turn your career history into a clean, recruiter-approved masterpiece in seconds.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <span>Format My CV Now</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CVFormattingPage;