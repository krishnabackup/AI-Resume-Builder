import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  TrendingUp,
  Shield,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  SearchCheck,
  Layers,
  FileEdit,
  Rocket,
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import AiBuilder from "../assets/AiBuilder.png";

// ✅ Scroll animation hook
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

const AIBuilderFeature = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleBackHome = () => {
    navigate("/?scrollTo=features");
  };

  const handleCTA = () => {
    navigate(isLoggedIn ? "/user/resume-builder" : "/login");
  };

  const [heroRef, heroVisible] = useInView(0.2);
  const [whatRef, whatVisible] = useInView(0.15);
  const [whyRef, whyVisible] = useInView(0.15);
  const [whatAiRef, whatAiVisible] = useInView(0.15);
  const [howRef, howVisible] = useInView(0.15);
  const [ctaRef, ctaVisible] = useInView(0.2);

  return (
    <div className="min-h-screen bg-white font-['Outfit'] select-none overflow-x-hidden">
      <NavBar />

      {/* HERO */}
      <section
        ref={heroRef}
         className="relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 overflow-hidden bg-white"
      >
        {/* Brand Theme Blurs */}
        <div className="absolute rounded-full -top-24 -left-24 w-72 h-72 bg-blue-50 blur-3xl opacity-60" />
        <div className="absolute rounded-full -bottom-24 -right-24 w-72 h-72 bg-orange-50 blur-3xl opacity-60" />

        <div className="grid items-center gap-8 sm:gap-10 lg:gap-12 mx-auto max-w-7xl lg:grid-cols-2">
          <div
            className={`min-w-0 transition-all duration-700 text-center lg:text-left ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            
            <div className="inline-block px-3 sm:px-4 py-2 bg-blue-50 text-[#0077cc] rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6">
              AI-Powered Resume Builder
            </div>

            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-[#1a2e52] font-jakarta tracking-tight break-words">
              Build Your Resume with{" "}
              <span className="text-[#0077cc]">AI Assistance</span>
            </h1>

            <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed text-gray-600 max-w-full lg:max-w-2xl break-words">
              Let our advanced AI guide you through every step of resume
              creation. Get personalized suggestions, optimized content, and
              professional formatting in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:items-start gap-3 sm:gap-4 mb-6 sm:mb-8 min-w-0">
              <CheckCircle2 size={20} className="flex-shrink-0 text-green-500" />
              <span className="text-xs sm:text-sm font-bold text-gray-400 leading-relaxed break-words text-center sm:text-left">
                100% free • AI-powered • Professional results
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleCTA}
                className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
              >
                <Zap size={18} className="fill-white" />
                <span>Start Building Now</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

            <div
              className={`relative min-w-0 transition-all duration-700 hidden lg:block ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <img
                src={AiBuilder}
                alt="ATS Score Analysis"
                className="block w-full h-auto mt-8 sm:mt-10 lg:mt-0 max-w-[340px] sm:max-w-md md:max-w-xl mx-auto object-contain drop-shadow-2xl"
              />
            </div>
        </div>
      </section>

      {/* WHAT IS AI BUILDER */}
      <section ref={whatRef} className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${whatVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-center text-[#1a2e52] font-jakarta">
            What is an AI Resume Builder?
          </h2>
          <div className="space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed text-center text-gray-600 max-w-none">
            <p>
              An AI resume builder uses artificial intelligence to help you
              create a professional, ATS-optimized resume. Unlike traditional
              resume builders, our AI analyzes your experience and suggests
              improvements, writes compelling bullet points, and ensures your
              resume stands out to both ATS systems and hiring managers.
            </p>
            <p>
              Our AI is trained on thousands of successful resumes across
              industries. It understands what recruiters look for and helps you
              present your experience in the most impactful way possible.
            </p>
          </div>
        </div>
      </section>

      {/* WHY USE AI BUILDER */}
      <section ref={whyRef} className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50/50">
        <div
          className={`max-w-6xl mx-auto transition-all duration-700 ${whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-4 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-center text-[#1a2e52] font-jakarta">
            Why Use an <span className="text-[#e65100]">AI Resume Builder?</span>
          </h2>
          <p className="max-w-full sm:max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-16 text-sm sm:text-base md:text-lg text-center text-gray-500">
            Save time and create a better resume with AI-powered assistance
          </p>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                icon: <Zap size={32} />,
                title: "Save hours of work",
                desc: "Create a professional resume in 15 minutes instead of hours",
              },
              {
                icon: <Target size={32} />,
                title: "Tailored content",
                desc: "AI customizes your resume for each job application automatically",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Better results",
                desc: "AI-optimized resumes get 3x more interviews than traditional ones",
              },
              {
                icon: <Shield size={32} />,
                title: "ATS-optimized",
                desc: "Ensure your resume passes applicant tracking systems every time",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 lg:p-8 transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 text-lg sm:text-xl font-black text-white bg-[#0077cc] rounded-full shadow-lg shadow-blue-100 mx-auto sm:mx-0">
                  {item.step}
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-bold text-[#1a2e52] text-center">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-500 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT AI DOES */}
      <section ref={whatAiRef} className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-white">
        <div
          className={`max-w-6xl mx-auto transition-all duration-700 ${whatAiVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
              <h2 className="mb-8 sm:mb-10 lg:mb-16 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-center text-[#1a2e52] font-jakarta">
            What Our AI Resume Builder Does
          </h2>

            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
      {[
        { icon: <Sparkles size={32} />, title: "Content Enhancement", desc: "Transforms basic descriptions into achievement-focused bullet points" },
        { icon: <Target size={32} />, title: "Keyword Optimization", desc: "Identifies and adds relevant keywords to pass ATS filters" },
        { icon: <BarChart3 size={32} />, title: "Achievement Quantification", desc: "Helps you add metrics and numbers to demonstrate impact" },
        { icon: <Lightbulb size={32} />, title: "Smart Suggestions", desc: "Provides real-time suggestions based on your industry" },
        { icon: <SearchCheck size={32} />, title: "Grammar & Clarity", desc: "Ensures your resume is error-free and easy to read" },
        { icon: <Layers size={32} />, title: "Format Optimization", desc: "Applies professional formatting for AI readability" },
        { icon: <FileEdit size={32} />, title: "Section Guidance", desc: "Recommends which sections to include based on experience" },
        { icon: <Zap size={32} />, title: "Action Verb Selection", desc: "Suggests powerful verbs to make experience stand out" },
        { icon: <Rocket size={32} />, title: "Impact Maximization", desc: "Helps you highlight impressive achievements first" },
      ].map((item, i) => (
        <div
          key={i}
          className="group p-4 sm:p-5 lg:p-8 text-center transition-all duration-300 border border-gray-100 bg-white rounded-[2rem] hover:border-[#0077cc]/30 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="mx-auto mb-4 sm:mb-6 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0077cc] transition-all duration-300 group-hover:bg-[#0077cc] group-hover:text-white">
            {React.cloneElement(item.icon, { size: 20 })}
          </div>
          <h3 className="mb-2 text-base sm:text-lg font-bold text-[#1a2e52] text-center">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-500 text-center">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* HOW IT WORKS */}
      <section ref={howRef} className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50/50">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${howVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-4 text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-center text-[#1a2e52] font-jakarta tracking-tight">
            How Our <span className="text-[#0077cc]">AI Builder</span> Works
          </h2>
          <p className="max-w-full sm:max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-16 text-sm sm:text-base md:text-lg text-center text-gray-500">
            Create a professional resume with AI assistance in three simple steps
          </p>

          <div className="p-4 sm:p-6 lg:p-8 bg-white border border-gray-100 shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] md:p-14">
            <h3 className="mb-6 sm:mb-8 lg:mb-10 text-lg sm:text-xl lg:text-2xl font-bold text-center text-[#1a2e52]">
              Simple 3-Step Process:
            </h3>

            <div className="space-y-6 sm:space-y-8">
              {[
                { step: "1", title: "Enter your information", desc: "Add your basic details, work experience, education, and skills" },
                { step: "2", title: "AI enhances your content", desc: "Our AI analyzes your input and suggests improvements and adds keywords" },
                { step: "3", title: "Download and apply", desc: "Review AI suggestions, make final edits, and download your resume" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 transition-colors rounded-2xl hover:bg-blue-50/50 text-center sm:text-left"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl font-black text-white bg-[#0077cc] rounded-full shadow-lg shadow-blue-100 mx-auto sm:mx-0">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 text-base sm:text-lg lg:text-xl font-bold text-[#1a2e52]">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION ---  */}
      <section
        ref={ctaRef}
        className="relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-32 overflow-hidden bg-white select-none"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        
        <div
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Ready to Build Your <span className="text-[#0077cc]">AI-Powered Resume?</span>
          </h2>

          <p className="max-w-full sm:max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-500">
            Join thousands of professionals who landed their dream jobs with real-time AI assistance and ATS-optimized templates.
          </p>

          <button
            onClick={handleCTA}
            className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] 
                       hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <Zap size={16} className="fill-white" />
            <span className="relative z-10">Start Building for Free</span>
            <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AIBuilderFeature;