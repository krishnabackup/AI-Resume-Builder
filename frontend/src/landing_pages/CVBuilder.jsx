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
import CVBuilder from "../components/user/CV/CVBuilder";

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

const CVBuilderPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/?scrollTo=features");
  };

  const [heroRef, heroVisible] = useInView(0.2);
  const [whatRef, whatVisible] = useInView(0.15);
  const [whyRef, whyVisible] = useInView(0.15);
  const [whatCvRef, whatCvVisible] = useInView(0.15);
  const [howRef, howVisible] = useInView(0.15);
  const [ctaRef, ctaVisible] = useInView(0.2);
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="min-h-screen bg-white font-['Outfit'] select-none">
      <NavBar />

      {!showBuilder ? (
        <>
          {/* HERO */}
          <section
            ref={heroRef}
            className="relative px-6 pt-10 pb-20 overflow-hidden bg-white"
          >
            {/* Brand Theme Blurs */}
            <div className="absolute rounded-full -top-24 -left-24 w-72 h-72 bg-blue-50 blur-3xl opacity-60" />
            <div className="absolute rounded-full -bottom-24 -right-24 w-72 h-72 bg-orange-50 blur-3xl opacity-60" />

            <div className="grid items-center gap-12 mx-auto max-w-7xl lg:grid-cols-2">
              <div
                className={`transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
              >
                {/* ✅ Back To Home */}
                <div className="mb-10">
                  <button
                    onClick={handleBackHome}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-[#0077cc] transition-all duration-200 hover:text-[#1a2e52]"
                  >
                    <ArrowLeft
                      size={16}
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                    <span>Back to home</span>
                  </button>
                </div>

                <div className="inline-block px-4 py-2 bg-blue-50 text-[#0077cc] rounded-full text-sm font-bold mb-6">
                  Create Your CV in Minutes
                </div>

                <h1 className="mb-6 text-5xl font-black leading-tight text-[#1a2e52] md:text-6xl font-jakarta tracking-tight">
                  Build Your Professional{" "}
                  <span className="text-[#0077cc]">CV with Ease</span>
                </h1>

                <p className="mb-8 text-xl leading-relaxed text-gray-600">
                  Create a standout CV in minutes. Our intuitive builder helps you
                  highlight your experience, skills, and achievements with
                  professional formatting and live preview.
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <CheckCircle2 size={20} className="flex-shrink-0 text-green-500" />
                  <span className="text-sm font-bold text-gray-400">
                    100% free • Professional templates • Live preview
                  </span>
                </div>

                <button
                  onClick={() => setShowBuilder(true)}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
                >
                  <Zap size={20} className="fill-white" />
                  <span>Start Creating Now</span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <div
                className={`relative transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
              >
                <div className="p-8 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem]">
                  <div className="mb-6">
                    <div className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">What You Get:</div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Professional CV templates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Live preview while editing</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                        <span className="font-medium text-gray-700">Easy export to PDF</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="p-3 rounded-full bg-blue-50">
                      <Sparkles size={32} className="text-[#0077cc]" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-black text-[#0077cc] uppercase tracking-widest">
                      Stand Out:
                    </div>
                    <div className="p-4 text-[#1a2e52] border border-blue-100 rounded-xl bg-[#f0f7ff] font-bold leading-relaxed">
                      With structured sections and professional formatting, your CV will make a lasting impression on recruiters and hiring managers.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* WHAT IS CV BUILDER */}
          <section ref={whatRef} className="px-6 py-20 bg-white">
            <div
              className={`max-w-5xl mx-auto transition-all duration-700 ${whatVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <h2 className="mb-8 text-4xl font-black text-center text-[#1a2e52] font-jakarta">
                What is a CV Builder?
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-center text-gray-600 max-w-none">
                <p>
                  A CV builder is an intuitive tool that guides you through creating a
                  professional curriculum vitae. Unlike generic templates, our CV builder
                  provides structured sections for all essential information and allows you to
                  see your CV take shape in real-time with live preview.
                </p>
                <p>
                  Your CV is a comprehensive document that showcases your entire professional
                  journey. Our builder helps you organize your experience, education, skills,
                  and achievements in a format that captures attention and conveys your value.
                </p>
              </div>
            </div>
          </section>

          {/* WHY USE CV BUILDER */}
          <section ref={whyRef} className="px-6 py-20 bg-gray-50/50">
            <div
              className={`max-w-6xl mx-auto transition-all duration-700 ${whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <h2 className="mb-4 text-4xl font-black text-center text-[#1a2e52] font-jakarta">
                Why Use a <span className="text-[#e65100]">CV Builder?</span>
              </h2>
              <p className="max-w-3xl mx-auto mb-16 text-lg text-center text-gray-500">
                Create a professional CV without the hassle
              </p>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: <Zap size={32} />,
                    title: "Save Time",
                    desc: "Create a complete CV in 15 minutes instead of hours",
                  },
                  {
                    icon: <Target size={32} />,
                    title: "Organized Layout",
                    desc: "All sections properly structured for maximum impact",
                  },
                  {
                    icon: <TrendingUp size={32} />,
                    title: "Professional Appearance",
                    desc: "Impress recruiters with a polished, well-formatted document",
                  },
                  {
                    icon: <Shield size={32} />,
                    title: "ATS-Friendly",
                    desc: "Formatting optimized for applicant tracking systems",
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

          {/* WHAT CV BUILDER DOES */}
          <section ref={whatCvRef} className="px-6 py-20 bg-white">
            <div
              className={`max-w-6xl mx-auto transition-all duration-700 ${whatCvVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                }`}
            >
              <h2 className="mb-16 text-4xl font-black text-center text-[#1a2e52] font-jakarta">
                What Our CV Builder Includes
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: <Layers size={32} />, title: "Multiple Sections", desc: "Personal info, experience, education, skills, projects, and more" },
                  { icon: <CheckCircle size={32} />, title: "Easy Navigation", desc: "Step-by-step guide through each section with intuitive interface" },
                  { icon: <BarChart3 size={32} />, title: "Live Preview", desc: "See your CV update in real-time as you enter information" },
                  { icon: <Lightbulb size={32} />, title: "Format Optimization", desc: "Professional formatting automatically applied for best appearance" },
                  { icon: <SearchCheck size={32} />, title: "PDF Export", desc: "Download your CV as a PDF ready to send to employers" },
                  { icon: <Rocket size={32} />, title: "Mobile Responsive", desc: "Works seamlessly on desktop, tablet, and mobile devices" },
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
                How Our <span className="text-[#0077cc]">CV Builder</span> Works
              </h2>
              <p className="max-w-2xl mx-auto mb-16 text-lg text-center text-gray-500">
                Create your complete CV in five simple steps
              </p>

              <div className="p-10 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] md:p-14">
                <h3 className="mb-10 text-2xl font-bold text-center text-[#1a2e52]">
                  Simple 5-Step Process:
                </h3>

                <div className="space-y-8">
                  {[
                    { step: "1", title: "Enter your information", desc: "Add your personal details, contact information, and summary" },
                    { step: "2", title: "Add your experience", desc: "List all your work experience with roles, companies, and achievements" },
                    { step: "3", title: "Include education", desc: "Add your educational background and qualifications" },
                    { step: "4", title: "Highlight skills", desc: "Include technical and soft skills that showcase your capabilities" },
                    { step: "5", title: "Download your CV", desc: "Export your completed CV as a PDF and start applying" },
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
                Ready to Build Your <span className="text-[#0077cc]">Professional CV?</span>
              </h2>

              <p className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
                Join thousands of professionals who created their CVs with our easy-to-use builder and successfully landed their dream jobs.
              </p>

              <button
                onClick={() => setShowBuilder(true)}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] 
                           hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
              >
                <Zap size={20} className="fill-white" />
                <span className="relative z-10">Start Building Now</span>
                <ArrowRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </section>

          <Footer />
        </>
      ) : (
        <>
          {/* CV BUILDER WITH FORM AND PREVIEW */}
          <CVBuilder />
        </>
      )}
    </div>
  );
};

export default CVBuilderPage;
