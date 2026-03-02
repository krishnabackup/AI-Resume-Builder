import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import featureImage1 from "../assets/rejection.png";
import featureImage2 from "../assets/advice2.png";
import featureImage3 from "../assets/solve.png";
import featureImage4 from "../assets/get.png";
import quick from "../assets/customize1.png";
import work2 from "../assets/analysis3.png";
import work1 from "../assets/goodResume.png";
import work4 from "../assets/oneClick1.png";
import work5 from "../assets/win4.png";
import template1 from "../assets/template_thumnail/JessicaClaire1.png";
import template2 from "../assets/template_thumnail/JessicaClaire2.png";
import template3 from "../assets/template_thumnail/JessicaClaire3.png";
import template4 from "../assets/template_thumnail/JessicaClaire4.png";
import template5 from "../assets/template_thumnail/JessicaClaire5.png";
import template6 from "../assets/template_thumnail/JessicaClaire6.png";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import {
  ArrowRight,
  BarChart3,
  Edit3,
  FileSearch,
  Layout,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const scrollContainerRef = useRef(null);
  const base = import.meta.env.BASE_URL || "/";
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 300 + 24;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const templates = [
    {
      name: "AI Assistant",
      desc: "Smart resume generation powered by AI",
      image: featureImage1,
      bgColor: "from-blue-500 to-cyan-500",
    },
    {
      name: "Tailored Summary",
      desc: "Customized professional summary",
      image: featureImage2,
      bgColor: "from-purple-500 to-pink-500",
    },
    {
      name: "Tailor to Job",
      desc: "Match your resume to job requirements",
      image: featureImage3,
      bgColor: "from-orange-500 to-red-500",
    },
    {
      name: "Resume Preview",
      desc: "Real-time resume preview and editing",
      image: featureImage4,
      bgColor: "from-green-500 to-teal-500",
    },
  ];

  const resumeTemplates = [
    {
      id: 1,
      name: "Atlantic Blue",
      category: "modern",
      desc: "Modern and professional design",
      image: template1,
    },
    {
      id: 2,
      name: "Classic",
      category: "traditional",
      desc: "Traditional and timeless layout",
      image: template2,
    },
    {
      id: 3,
      name: "Corporate",
      category: "traditional",
      desc: "Professional corporate style",
      image: template3,
    },
    {
      id: 4,
      name: "Modern Pro",
      category: "modern",
      desc: "Sleek and contemporary design",
      image: template4,
    },
    {
      id: 5,
      name: "Executive",
      category: "executive",
      desc: "Perfect for senior positions",
      image: template5,
    },
    {
      id: 6,
      name: "Creative Edge",
      category: "creative",
      desc: "Stand out with creative flair",
      image: template6,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemplateIndex((prev) => (prev + 1) % templates.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [templates.length]);

  const handleTemplateClick = (templateId) => {
    if (isLoggedIn) {
      navigate(`/templates/${templateId}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollContainerRef.current) {
        const cardWidth = 300 + 24;
        const maxScroll =
          scrollContainerRef.current.scrollWidth -
          scrollContainerRef.current.clientWidth;
        const currentScroll = scrollContainerRef.current.scrollLeft;

        if (currentScroll >= maxScroll) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({
            left: cardWidth,
            behavior: "smooth",
          });
        }
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, []);

  // Scroll to the free templates section when URL hash is present (e.g. /#free-templates)
  const location = useLocation();
  useEffect(() => {
    // Handle State Navigation (From Back to Home button)
    window.scrollTo(0, 0)
    if (location.state?.scrollTo === "features") {
      const el = document.getElementById("features");
      if (el) {
        el.scrollIntoView({ behavior: "auto" });
        window.history.replaceState({}, document.title);
      }
    }
    // Handle Hash Navigation (Existing logic for #free-templates)
    else if (location.hash === "#free-templates") {
      const el = document.getElementById("free-templates");
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [location]);

  const howItWorksSteps = [
    {
      image: work1,
      heading: "Easily create or import your resume",
      description:
        "Choose from professionally designed templates or upload your existing resume to improve its structure, formatting, and content for a more polished result.",
    },
    {
      image: work2,
      heading: "Check and analyze your resume score",
      description:
        "Get real-time ATS insights as you build your resume, or upload an existing one to analyze structure, keywords, and formatting.",
    },
    {
      image: quick,
      heading: "Quickly customize your resume with AI",
      description:
        "Enter your experience details, and our AI generates clear, impactful bullet points that showcase your skills and achievements professionally.",
    },
    {
      image: work4,
      heading: "Improve your resume instantly in one click",
      description:
        "Tailor your resume to any job listing in one click with instant, role-specific improvements that boost relevance and highlight key skills.",
    },
    {
      image: work5,
      heading: "Your winning resume is ready!",
      description:
        "Download your job-ready resume in your preferred format, or create multiple tailored versions for different roles to boost success.",
    },
  ];

  const features = [
    {
      icon: <FileSearch className="text-blue-600 size-6" />,
      title: "ATS Score Checker",
      description:
        "Analyze your resume against specific job descriptions to ensure you pass through Applicant Tracking Systems.",
      path: "/ats-checker",
    },
    {
      icon: <Layout className="text-green-600 size-6" />,
      title: "Categorized Templates",
      description:
        "Access a curated library of Modern, Creative, and Professional templates tailored for every industry.",
      path: "/TemplatesFeature",
    },
    {
      icon: <Zap className="text-yellow-600 size-6" />,
      title: "Guided AI Builder",
      description:
        "Create a fresh resume with a step-by-step guided experience and AI-powered content suggestions.",
      path: "/AI-builder",
    },
    {
      icon: <Edit3 className="text-orange-600 size-6" />,
      title: "AI Content Enhancement",
      description:
        "Upload existing PDF or Word docs to transform weak bullet points into high-impact, achievement-oriented text.",
      path: "/content-enhance",
    },
    {
      icon: <BarChart3 className="text-purple-600 size-6" />,
      title: "Live Quality Scoring",
      description:
        "Get a real-time AI score out of 100 as you edit, helping you reach that 90%+ 'Interview-Ready' threshold.",
      path: "/score-checker",
    },
    {
      icon: <Layers className="text-indigo-600 size-6" />,
      title: "Resume Manager",
      description:
        "Organize multiple versions of your resumes for different roles and track your total download history.",
      path: "/resume-hub",
    },
    {
      icon: <Activity className="text-cyan-500 size-6" />,
      title: "Strategic Growth Insights",
      description:
        "Monitor average ATS performance and track document engagement with actionable AI-driven career data.",
      path: "/growths",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2e52] font-['Outfit']">
      <NavBar />
      <div className="h-12" />
      {/*  OVERLAY */}
      <div
        onClick={toggleMobileMenu}
        className={`w-full h-full absolute top-0 left-0 z-30 bg-black/20 ${
          mobileMenuOpen ? "" : "hidden"
        }`}
      ></div>

      {/* HERO SECTION - padding added and mobile padding reudced */}
      <section
        className="
  relative 
  px-4 md:px-8 
  bg-white 
  ml-2 md:ml-5 
  lg:min-h-[calc(100vh-80px)]
  flex items-center lg:items-start
  pt-[100px] md:pt-[120px] lg:pt-16
  -mt-12 lg:mt-0
"
      >
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50"></div>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-8 md:gap-6 items-center">
          <div className="flex flex-col gap-4 md:gap-8">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight select-none lg:text-6xl font-jakarta">
              <span className="bg-gradient-to-r from-[#e65100] to-[#ff8f00] bg-clip-text text-transparent">
                UptoSkills AI
              </span>{" "}
              <span className="bg-gradient-to-r from-[#0077cc] to-[#0056b3] bg-clip-text text-transparent">
                Resume Builder
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-[#1a2e52] mt-2 md:mt-4 block">
                Craft Your Perfect Resume in Minutes!
              </span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold text-[#0077cc]">
              AI Resume Builder
            </h2>

            <p className="text-lg md:text-xl font-normal leading-relaxed text-gray-600">
              AI-Powered Content, Professional Templates, ATS-Friendly.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4 mt-1 md:mt-2 select-none">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-bold text-white bg-gradient-to-r from-[#e65100] to-[#f4511e] rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)]"
              >
                <i className="fas fa-graduation-cap"></i>
                Start Building for Free
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("free-templates");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-5 text-base md:text-lg font-bold text-[#0077cc] bg-white border-2 border-[#0077cc] rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#0077cc] hover:text-white shadow-[0_10px_25px_rgba(0,119,204,0.15)] hover:shadow-[0_15px_35px_rgba(0,119,204,0.25)]"
              >
                <Layers size={18} />
                View Templates
              </button>
            </div>
          </div>

          {/* Image carousel -  size reduced, Hidden on mobile, visible on md and up */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full max-w-2xl lg:max-w-[90%] relative h-[400px] md:h-[600px] lg:h-[600px]">
              {templates.map((template, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center select-none ${
                    idx === currentTemplateIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                >
                  <img
                    src={template.image}
                    alt={template.name}
                    className={`object-contain ${
                      template.name === "Tailored Summary" ||
                      template.name === "Tailor to Job"
                        ? "w-[100%] h-[70%]"
                        : "w-full h-full"
                    }`}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Reduced mobile padding and spacing */}
      <section className="px-4 md:px-8 py-12 md:py-24 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10 md:mb-20 text-center">
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-black">
              How <span className="text-[#e65100]">It Works</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500">
              Your path to a professional resume in 5 simple steps.
            </p>
          </div>

          <div className="space-y-12 md:space-y-24">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* IMAGE BOX */}
                <img
                  src={step.image}
                  alt={step.heading}
                  className="w-1/2 h-full object-contain rounded-3xl transition-transform duration-500"
                />

                {/* TEXT CONTENT */}
                <div className="w-full space-y-3 md:space-y-6 md:w-1/2">
                  <span className="text-[#0077cc] font-black text-4xl md:text-6xl opacity-10">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a2e52] leading-tight">
                    {step.heading}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATE SHOWCASE - Reduced mobile padding */}
      <section
        id="free-templates"
        className="px-4 md:px-8 py-12 md:py-24 overflow-hidden bg-white select-none"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
            <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-black leading-tight">
              Access Free <span className="text-[#0077cc]">Templates</span>
            </h2>
            <p className="max-w-2xl px-4 text-sm md:text-base text-gray-500">
              All templates are ATS-compliant and fully customizable.
            </p>
          </div>

          <div className="relative group/main">
            {/* Scroll Buttons */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0077cc] border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 -translate-x-2 hover:bg-[#0077cc] hover:text-white"
            >
              <ChevronLeft size={22} />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-8 px-2 md:px-4 py-6 md:py-10 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
              style={{ perspective: "1000px" }}
            >
              {resumeTemplates.map((t, i) => (
                <div
                  key={t.name + i}
                  onClick={() => handleTemplateClick(t.id)}
                  className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] snap-center cursor-pointer group/card"
                >
                  <div
                    className="relative bg-white h-[320px] md:h-[400px] rounded-2xl transition-all duration-500 ease-out 
                            shadow-md group-hover/card:shadow-2xl 
                            group-hover/card:scale-110 group-hover/card:z-50
                            border border-gray-100 overflow-hidden"
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="object-contain object-top w-full h-full transition-transform duration-500"
                    />

                    <div className="absolute top-4 right-4 bg-[#0077cc] backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white/90 shadow-sm z-20">
                      ATS READY
                    </div>

                    <div className="absolute inset-0 transition-colors duration-300 pointer-events-none group-hover/card:bg-transparent"></div>
                  </div>

                  <div className="p-3 md:p-4 text-center">
                    <h4 className="text-sm font-bold mb-1 text-[#1a2e52] group-hover/card:text-[#0077cc] transition-colors">
                      {t.name}
                    </h4>
                    <p className="text-xs text-gray-500">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0077cc] border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 translate-x-2 hover:bg-[#0077cc] hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES GRID - Reduced mobile padding and spacing */}
      <section
        id="features"
        className="relative px-4 md:px-8 py-12 md:py-24 overflow-hidden bg-white select-none"
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-2 md:px-4 mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8 md:mb-16 text-center">
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2e52]">
              AI-Powered <span className="text-[#0077cc]">Innovation</span>
            </h2>
            <div className="h-1.5 w-20 bg-[#e65100] rounded-full mb-4 md:mb-6"></div>
            <p className="max-w-2xl px-4 text-base md:text-lg text-gray-500">
              Advanced tools designed to bypass ATS filters and catch recruiter
              attention instantly.
            </p>
          </div>

          <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => feature.path && navigate(feature.path)}
                className="relative p-6 md:p-8 transition-all duration-500 bg-white/40 backdrop-blur-md border border-gray-100 group rounded-3xl
                     hover:bg-white hover:-translate-y-3 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(0,119,204,0.1)]"
              >
                {/* Icon Section */}
                <div className="relative inline-flex items-center justify-center p-3 md:p-4 mb-4 md:mb-8 transition-all duration-500 rounded-2xl bg-blue-50 border border-blue-100 group-hover:scale-110 group-hover:bg-[#0077cc] group-hover:shadow-[0_10px_20px_rgba(0,119,204,0.3)] group-hover:rotate-6">
                  <div className="transition-colors duration-500 text-[#0077cc] group-hover:text-white">
                    {React.cloneElement(feature.icon, {
                      className:
                        "size-6 md:size-7 transition-colors duration-500",
                    })}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-bold tracking-tight text-[#1a2e52] transition-colors duration-300 group-hover:text-[#0077cc]">
                  {feature.title}
                </h3>

                <p className="mb-4 md:mb-6 text-sm leading-relaxed text-gray-600 group-hover:text-gray-700">
                  {feature.description}
                </p>

                {/* Action Link */}
                <div className="flex items-center gap-2 text-sm font-bold text-[#0077cc] transition-all duration-300 group-hover:gap-3">
                  <span className="tracking-wide cursor-pointer">
                    Explore Feature
                  </span>
                  <div className="p-1 transition-all duration-300 bg-blue-100 rounded-full">
                    <ArrowRight className="size-3" />
                  </div>
                </div>

                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(circle at top left, rgba(0,119,204,0.05) 0%, transparent 70%)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;