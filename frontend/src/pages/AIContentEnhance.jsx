import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Layers,
  Wand2,
  ArrowLeft
} from 'lucide-react';
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import AiEnhancement from "../assets/AiEnhancement.png"

const AIEnhancementPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/?scrollTo=features");
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-orange-100 overflow-x-hidden select-none">
      <NavBar />
      
      {/* --- 1. HERO SECTION --- */}
     <section className="relative px-6 pt-16 overflow-hidden bg-white">

  {/* Soft background glow */}
  <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-blue-50 rounded-full blur-[140px] -z-10 opacity-60" />
  <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-orange-50 rounded-full blur-[140px] -z-10 opacity-60" />

  <div className="mx-auto max-w-7xl">
    

    {/* HERO GRID */}
    <div className="grid items-center min-h-[80vh] gap-4 pb-16 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[1fr_1.4fr]">

      {/* LEFT CONTENT */}
      <div className="text-center lg:text-left">
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
      </div>

{/* RIGHT IMAGE */}
<div className="flex justify-center lg:justify-end">
  <img
    src={AiEnhancement}
    alt="AI Resume Content Enhancement"
    className="hidden md:block w-full max-w-[820px] xl:max-w-[950px] drop-shadow-2xl"
  />
</div>



    </div>
  </div>
</section>


      {/* --- 2. WHAT IS AI ENHANCEMENT (THEME BOX) --- */}
      <section className="px-8 py-20 bg-white font-['Outfit']">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1a2e52] mb-12">What is AI Enhancement?</h2>
          
          <div className="mb-12 space-y-6 text-lg text-center text-gray-600 md:text-left">
            <p>
              AI Enhancement is the process of using Natural Language Processing (NLP) to analyze your existing resume bullets and upgrade them for maximum impact. It focuses on using <strong>action verbs</strong> and <strong>quantifiable results</strong> to prove your value.
            </p>
            <p>
              Hiring managers don't want to see what you were "responsible for"—they want to see what you <strong>achieved</strong>. Our engine scans your drafts and suggests high-performance alternatives tailored to your specific industry.
            </p>
          </div>

          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our AI Optimizer Scans for:</h3>
            <ul className="space-y-4">
              {[
                { title: "Strong Action Verbs", desc: "Replaces passive language with leadership-focused verbs." },
                { title: "Metric Identification", desc: "Identifies opportunities to add percentages, dollars, or timeframes." },
                { title: "Skill Density", desc: "Ensures your key competencies are naturally woven into every bullet." },
                { title: "Contextual Relevance", desc: "Checks if your achievements align with the job's senior requirements." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#0077cc] mt-1 shrink-0" />
                  <p className="text-gray-700"><span className="font-bold">{item.title}:</span> {item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --- 3. DYNAMIC FEATURE GRID ---  */}
      <section className="relative px-8 overflow-hidden py-14 bg-gray-50/50">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black text-[#1a2e52] mb-4 tracking-tight font-jakarta">
              AI Powered <span className="text-[#e65100]">Refinement</span>
            </h2>
            <p className="max-w-xl mx-auto font-medium text-gray-500">How our engine fine-tunes your professional story.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Wand2, t: "Auto-Rewrite", d: "Instantly transform one-line duties into multi-dimensional achievements." },
              { icon: Target, t: "Industry Targeting", d: "Uses vocabulary specific to your field (Tech, Finance, Healthcare, etc.)." },
              { icon: TrendingUp, t: "Quantification", d: "Forces metrics into your bullets to prove your business impact." },
              { icon: Layers, t: "Hierarchy Logic", d: "Re-orders your bullet points so your best work is seen first." },
              { icon: Zap, t: "Tone Adjustment", d: "Ensures your writing sounds confident and professional." },
              { icon: CheckCircle2, t: "Clarity Check", d: "Removes corporate jargon and fluff to make every word count." }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="flex items-center justify-center w-14 h-14 mb-8 bg-blue-50 rounded-2xl group-hover:bg-[#0077cc] transition-colors duration-300">
                  <feature.icon size={28} className="text-[#0077cc] group-hover:text-white transition-colors" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-[#1a2e52] group-hover:text-[#0077cc] transition-colors">
                  {feature.t}
                </h4>
                <p className="text-sm font-medium leading-relaxed text-gray-400 transition-colors group-hover:text-gray-600">
                  {feature.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CTA SECTION --- */}
      <section className="relative px-8 pt-12 pb-24 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Ready to Upgrade Your <span className="text-[#0077cc]">Content?</span>
          </h2>
          
          <p className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Let AI do the hard work of writing. Start landing more interviews with perfectly architected bullet points.
          </p>

          <button 
            onClick={() => navigate("/register")} 
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <Sparkles size={20} className="fill-white" />
            <span className="relative z-10">Start Enhancing Now</span>
            <ArrowRight size={22} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIEnhancementPage;