import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  ArrowRight,
  Search,
  Compass,
  Briefcase,
  CheckCircle2,
  Cpu,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import growth from "../assets/growth1.png";

const StrategicInsightsPage = () => {<section className="py-12"></section>
  const navigate = useNavigate();<div className="mt-1 grid gap-10 lg:grid-cols-3"></div>
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleFeatureClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      localStorage.setItem("redirectPath", path);
      navigate("/login");
    }
  };

  

  return (
    <div className="min-h-[80vh] bg-white font-['Outfit'] text-[#1a2e52] selection:bg-orange-100 overflow-x-hidden select-none">
      <NavBar />

      {/* --- HERO SECTION --- */}
      <section className="relative px-8 pt-12 pb-12 overflow-hidden bg-white">
        {/* Brand Decorative Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative z-10 pt-10 mx-auto max-w-7xl">
         

<div className="grid items-center gap-2 lg:gap-1 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full shadow-sm bg-blue-50">
                <Cpu size={16} className="text-[#0077cc]" />
                <span className="text-xs font-black tracking-widest text-[#0077cc] uppercase">AI Resume Analysis</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8 text-[#1a2e52] font-jakarta">
                Know Your <br /><span className="text-[#0077cc]">Job Value.</span>
              </h1>
              
              <p className="max-w-md mx-auto mb-8 text-xl font-medium text-gray-500 lg:mx-0">
                Paste your resume and let our AI analyze your profile to find the perfect job roles where you truly belong.
              </p>

              <button 
                onClick={() => handleFeatureClick("/user/dashboard")} 
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95 mx-auto lg:mx-0"
              >
                <Search size={22} className="relative z-10 transition-transform group-hover:scale-110" />
                <span className="relative z-10">Analyze My Resume</span>
                <ArrowRight size={22} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

<div className="relative w-full flex justify-center lg:justify-end">
  
  {/* Image Wrapper (important) */}
  <div className="relative w-full max-w-[720px] lg:max-w-[850px] xl:max-w-[950px]">
    <img
      src={growth}
      alt="Resume Analysis Dashboard"
      className="hidden md:block w-full h-auto drop-shadow-2xl"
    />

    {/* Floating Badge 1 */}
    <div className="absolute hidden md:flex items-center gap-3 p-4 bg-white border border-gray-100 shadow-xl rounded-2xl top-6 left-6 animate-bounce" style={{ animationDuration: '4s' }}>
      <div className="p-2 rounded-lg bg-green-50">
        <Target size={20} className="text-green-600" />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase">Role Match</p>
        <p className="text-lg font-black text-[#1a2e52]">High Impact</p>
      </div>
    </div>

    {/* Floating Badge 2 */}
    <div className="absolute hidden md:flex items-center gap-3 bg-[#1a2e52] p-4 rounded-2xl shadow-2xl -bottom-12 -right-6 hover:scale-105 transition-transform">
      <div className="p-2 rounded-lg bg-white/10">
        <Briefcase size={20} className="text-blue-400" />
      </div>
      <div>
        <p className="text-[10px] font-black text-blue-200/50 uppercase">Top Industry</p>
        <p className="text-lg font-black text-white">Target Found</p>
      </div>
    </div>

  </div>
</div>


          </div>
        </div>
      </section>

      {/* --- WHAT IS AI RESUME MATCHING (Updated Content) --- */}
      <section className="px-8 py-20 bg-white font-['Outfit']">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1a2e52] mb-12">How AI Resume Analysis Works</h2>
          
          <div className="mb-12 space-y-6 text-lg text-gray-600">
            <p>
              Finding the right career path shouldn't be a guessing game. Our AI Resume Builder analyzes the technical skills, experiences, and hidden strengths within your resume to map out the perfect role for your profile. 
            </p>
            <p>
              By pasting your existing resume, you unlock a deep-dive analysis that shows you exactly where you "know the game." We help you stop applying blindly and start targeting roles where you are statistically most likely to succeed and get hired.
            </p>
          </div>

          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our Analysis Engine helps you:</h3>
            <ul className="space-y-4">
              {[
                { title: "Role Identification", desc: "Discover specific job titles that perfectly match your current resume content." },
                { title: "Pathfinding", desc: "Identify the right way forward based on your professional history." },
                { title: "Skill Validation", desc: "Analyze your pasted text to see if your skills meet industry demands." },
                { title: "The 'Game' Factor", desc: "Find companies and roles where your experience gives you an unfair advantage." }
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

      {/* --- THREE PILLARS: THE ANALYTICS FOCUS --- */}
      <section className="px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Resume Deep-Scan",
                desc: "Paste your resume and let AI extract your true professional value and potential.",
                icon: <Search className="text-blue-600" />,
                color: "bg-blue-50",
              },
              {
                title: "Career Navigation",
                desc: "Find the right way to transition into roles that value your unique background.",
                icon: <Compass className="text-indigo-600" />,
                color: "bg-indigo-50",
              },
              {
                title: "Role Matching",
                desc: "Get matched with jobs where you already 'know the game' and can win the interview.",
                icon: <Briefcase className="text-cyan-600" />,
                color: "bg-cyan-50",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-10 rounded-[40px] bg-white border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8`}>
                  {React.cloneElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="mb-4 text-2xl font-black">{feature.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ROADMAP SECTION --- */}
      <section className="relative px-6 overflow-hidden bg-white py-14">
        <div className="mx-auto text-center max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a2e52] tracking-tight mb-16 font-jakarta">
            Find Your <span className="text-[#0077cc]">Perfect Match.</span>
          </h2>

          <div className="relative grid gap-8 md:grid-cols-4">
            {[
              { phase: "01", title: "Analyze", desc: "Paste your resume for AI scanning." },
              { phase: "02", title: "Discover", desc: "Find roles that fit your skills." },
              { phase: "03", title: "Target", desc: "Apply where you know the game." },
              { phase: "04", title: "Succeed", desc: "Land the role you were meant for." },
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 text-sm font-black text-white bg-[#0077cc] rounded-full shadow-lg shadow-blue-100">
                  {step.phase}
                </div>
                <h4 className="text-lg font-bold text-[#1a2e52] mb-2">{step.title}</h4>
                <p className="text-xs font-medium leading-relaxed text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Action Banner */}
          <div className="mt-20 p-8 bg-gradient-to-r from-[#1a2e52] to-[#0077cc] rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-center text-white border w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl">
                <Sparkles size={28} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">Ready to find your way?</p>
                <p className="text-sm text-blue-100/60">Analyze your resume today and find the path to your dream job.</p>
              </div>
            </div>
            <button 
  onClick={() => handleFeatureClick("/user/dashboard")} 
  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
>
  <span>Start Analysis</span>
  <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
</button>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative px-8 pt-12 pb-24 overflow-hidden bg-white select-none">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Stop Searching. <span className="text-[#0077cc]">Start Being Found.</span>
          </h2>
          
          <p className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Let AI pinpoint the exact roles where your unique skills will truly shine.
          </p>

          <button 
            onClick={() => navigate("/register")} 
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] 
                       hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <Search size={22} className="relative z-10" />
            <span className="relative z-10">Analyze My Career Now</span>
            <ArrowRight size={22} className="relative z-10 transition-transform group-hover:translate-x-2" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicInsightsPage;