import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  ArrowLeft,
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
    <div className="min-h-screen bg-white font-['Outfit'] select-none">
      <NavBar />

      {/* HERO */}
      <section
        ref={heroRef}
         className="relative px-6 pt-24 overflow-hidden bg-white"


      >
        {/* Brand Theme Blurs */}
        <div className="absolute rounded-full -top-24 -left-24 w-72 h-72 bg-blue-50 blur-3xl opacity-60" />
        <div className="absolute rounded-full -bottom-24 -right-24 w-72 h-72 bg-orange-50 blur-3xl opacity-60" />

        <div className="grid items-center gap-12 mx-auto max-w-7xl lg:grid-cols-2">
          <div
            className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
          >
            

            <div className="inline-block px-4  py-2 bg-blue-50 text-[#0077cc] rounded-full text-sm font-bold mb-6">
              AI-Powered Resume Builder
            </div>

            <h1 className="mb-6 text-5xl font-black leading-tight text-[#1a2e52] md:text-6xl font-jakarta tracking-tight">
              Build Your Resume with{" "}
              <span className="text-[#0077cc]">AI Assistance</span>
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-600">
              Let our advanced AI guide you through every step of resume
              creation. Get personalized suggestions, optimized content, and
              professional formatting in minutes.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <CheckCircle2 size={20} className="flex-shrink-0 text-green-500" />
              <span className="text-sm font-bold text-gray-400">
                100% free • AI-powered • Professional results
              </span>
            </div>

            <button
              onClick={handleCTA}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
            >
              <Zap size={20} className="fill-white" />
              <span>Start Building Now</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

            <div
              className={`relative transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <img
                src={AiBuilder}
                alt="ATS Score Analysis"
                className="hidden md:block w-full h-auto object-contain drop-shadow-2xl"
              />

            </div>

        </div>
      </section>

      {/* WHAT IS AI BUILDER */}
      <section ref={whatRef} className="px-6 py-12 bg-white">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${whatVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-8 text-4xl font-black text-center text-[#1a2e52] font-jakarta">
            What is an AI Resume Builder?
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-center text-gray-600 max-w-none">
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
      <section ref={whyRef} className="px-6 py-12 bg-gray-50/50">
        <div
          className={`max-w-6xl mx-auto transition-all duration-700 ${whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-4 text-4xl font-black text-center text-[#1a2e52] font-jakarta">
            Why Use an <span className="text-[#e65100]">AI Resume Builder?</span>
          </h2>
          <p className="max-w-3xl mx-auto mb-16 text-lg text-center text-gray-500">
            Save time and create a better resume with AI-powered assistance
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                className="p-8 transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-14 h-14 mb-6 text-[#0077cc] bg-blue-50 rounded-xl">
                  {item.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-[#1a2e52]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT AI DOES */}
      <section ref={whatAiRef} className="px-6 py-12 bg-white">
        <div
          className={`max-w-6xl mx-auto transition-all duration-700 ${whatAiVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-16 text-4xl font-black text-center text-[#1a2e52] font-jakarta">
            What Our AI Resume Builder Does
          </h2>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          className="group p-8 text-center transition-all duration-300 border border-gray-100 bg-white rounded-[2rem] hover:border-[#0077cc]/30 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0077cc] transition-all duration-300 group-hover:bg-[#0077cc] group-hover:text-white">
            {item.icon}
          </div>
          <h3 className="mb-2 text-lg font-bold text-[#1a2e52]">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* HOW IT WORKS */}
      <section ref={howRef} className="px-6 py-14 bg-gray-50/50">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${howVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-4 text-4xl font-black text-center text-[#1a2e52] font-jakarta tracking-tight">
            How Our <span className="text-[#0077cc]">AI Builder</span> Works
          </h2>
          <p className="max-w-2xl mx-auto mb-16 text-lg text-center text-gray-500">
            Create a professional resume with AI assistance in three simple steps
          </p>

          <div className="p-10 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] md:p-14">
            <h3 className="mb-10 text-2xl font-bold text-center text-[#1a2e52]">
              Simple 3-Step Process:
            </h3>

            <div className="space-y-8">
              {[
                { step: "1", title: "Enter your information", desc: "Add your basic details, work experience, education, and skills" },
                { step: "2", title: "AI enhances your content", desc: "Our AI analyzes your input and suggests improvements and adds keywords" },
                { step: "3", title: "Download and apply", desc: "Review AI suggestions, make final edits, and download your resume" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 p-4 transition-colors rounded-2xl hover:bg-blue-50/50"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-black text-white bg-[#0077cc] rounded-full shadow-lg shadow-blue-100">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="mb-1 text-xl font-bold text-[#1a2e52]">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
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
        className="relative px-8 pt-12 pb-24 overflow-hidden bg-white select-none"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />
        
        <div
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
            ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Ready to Build Your <span className="text-[#0077cc]">AI-Powered Resume?</span>
          </h2>

          <p className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Join thousands of professionals who landed their dream jobs with real-time AI assistance and ATS-optimized templates.
          </p>

          <button
            onClick={handleCTA}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] 
                       hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <Zap size={20} className="fill-white" />
            <span className="relative z-10">Start Building for Free</span>
            <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIBuilderFeature;