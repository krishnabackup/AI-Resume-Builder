import React,{ useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import featureImage1 from "../assets/rejection.png";
import featureImage2 from "../assets/advice2.png";
import featureImage3 from "../assets/solve.png";
import featureImage4 from "../assets/get.png";
import quick from "../assets/customize1.png";
import work2 from "../assets/analysis3.png";
import work1 from "../assets/GoodResume.png";

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
import { motion } from "framer-motion";
import {
  templates,
  resumeTemplates,
  howItWorksSteps,
  features,
} from "./HomeData";

const imageMap = {
  featureImage1,
  featureImage2,
  featureImage3,
  featureImage4,
  work1,
  work2,
  quick,
  work4,
  work5,
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
};

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

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const scrollContainerRef = useRef(null);
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
    window.scrollTo(0, 0);
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2e52] font-['Outfit']">
      <NavBar />
      <div className="" />
      {/* OVERLAY */}
      <div
        onClick={toggleMobileMenu}
        className={`w-full h-full absolute top-0 left-0 z-30 bg-black/20 ${mobileMenuOpen ? "" : "hidden"
          }`}
      ></div>

     {/* HERO SECTION */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative px-4 sm:px-6 lg:px-8 bg-white flex items-center pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24"
      >
        <div className="absolute top-0 right-0 w-1/3 h-1/4 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50"></div>

        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-6 items-center">
          <div className="flex flex-col gap-4 md:gap-6 text-center md:text-left items-center md:items-start w-full max-w-xl mx-auto md:mx-0">
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight select-none font-jakarta">
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
            </motion.h1>

            <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold text-[#0077cc]">
              AI Resume Builder
            </motion.h2>

            <motion.p variants={fadeUp} className="text-lg md:text-xl font-normal leading-relaxed text-gray-600 max-w-sm md:max-w-none mx-auto md:mx-0">
              AI-Powered Content, Professional Templates, ATS-Friendly.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mt-3 select-none justify-center md:justify-start">
              <button
                onClick={() => navigate("/login")}
                className="flex w-full sm:w-auto items-center justify-center gap-2 md:gap-3 px-4 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold text-white bg-gradient-to-r from-[#e65100] to-[#f4511e] rounded-xl whitespace-nowrap transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)]"
              >
                <i className="fas fa-graduation-cap"></i>
                Start Building for Free
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("free-templates");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-10 py-3 md:py-5 text-sm md:text-lg font-bold text-[#0077cc] bg-white border-2 border-[#0077cc] rounded-xl whitespace-nowrap transition-all duration-300 hover:-translate-y-1 hover:bg-[#0077cc] hover:text-white shadow-[0_10px_25px_rgba(0,119,204,0.15)] hover:shadow-[0_15px_35px_rgba(0,119,204,0.25)]"
              >
                <Layers size={18} />
                View Templates
              </button>
            </motion.div>
          </div>

          {/* Image carousel -  size reduced, Hidden on mobile, visible on md and up */}
          <motion.div variants={fadeUp} className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-xl lg:max-w-[90%] relative h-[260px] md:h-[420px] lg:h-[520px]">
              {templates.map((template, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center select-none ${idx === currentTemplateIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                    }`}
                >
                  <img
                    src={imageMap[template.image]}
                    alt={template.name}
                    className={`object-contain ${template.name === "Tailored Summary" ||
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
          </motion.div>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 bg-gray-50"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10 md:mb-20 text-center">
            <motion.h2 variants={fadeUp} className="mb-3 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-black">
              How <span className="text-[#e65100]">It Works</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-500">
              Your path to a professional resume in 5 simple steps.
            </motion.p>
          </div>

          <div className="space-y-8 md:space-y-16">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
              >
                {/* MOBILE BADGE - Hidden on Desktop */}
                <div className="absolute top-4 left-4 md:hidden bg-[#0077cc] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  0{index + 1}
                </div>

                {/* IMAGE BOX */}
                <img
                  src={imageMap[step.image]}
                  alt={step.heading}
                  className="w-full md:w-1/2 max-w-md md:max-w-none h-auto object-contain rounded-xl"
                />

                {/* TEXT CONTENT */}
                <div className="w-full md:w-1/2 space-y-2 md:space-y-6 text-left md:text-left">
                  {/* DESKTOP NUMBER - Hidden on Mobile */}
                  <span className="hidden md:block text-[#0077cc] font-black text-6xl opacity-10">
                    0{index + 1}
                  </span>

                  <h3 className="text-xl md:text-3xl font-bold text-[#1a2e52] leading-tight pt-2 md:pt-0">
                    {step.heading}
                  </h3>
                  <p className="text-sm md:text-lg leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>


      {/* TEMPLATE SHOWCASE */}
      <motion.section
        id="free-templates"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 overflow-hidden bg-white select-none"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8 md:mb-12 text-center">
            <motion.h2 variants={fadeUp} className="mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-black leading-tight">
              Access Free <span className="text-[#0077cc]">Templates</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-2xl px-4 text-sm md:text-base text-gray-500">
              All templates are ATS-compliant and fully customizable.
            </motion.p>
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
                <motion.div
                  key={t.name + i}
                  variants={fadeUp}
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
                      src={imageMap[t.image]}
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
                </motion.div>
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
      </motion.section>



      {/* FEATURES GRID - Reduced mobile padding and spacing */}
      <motion.section
        id="features"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 overflow-hidden bg-white select-none"
      >
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-100/50 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-50/50 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-2 md:px-4 mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
            <motion.h2 variants={fadeUp} className="mb-2 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2e52] leading-tight">
              AI-Powered <span className="text-[#0077cc]">Innovation</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="h-1 w-16 md:h-1.5 md:w-20 bg-[#e65100] rounded-full mb-4 md:mb-6"></motion.div>
            <motion.p variants={fadeUp} className="max-w-2xl px-2 text-sm md:text-lg text-gray-500 leading-relaxed">
              Advanced tools designed to bypass ATS filters and catch recruiter
              attention instantly.
            </motion.p>
          </div>

          {/* Responsive Grid: 2 columns on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                onClick={() => feature.path && navigate(feature.path)}
                className="relative p-5 md:p-8 transition-all duration-500 bg-white/60 backdrop-blur-md border border-gray-100 group rounded-[2rem]
                     hover:bg-white hover:-translate-y-3 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(0,119,204,0.1)]
                     active:scale-95 md:active:scale-100"
              >
                {/* Icon Section */}
                <div className="relative inline-flex items-center justify-center p-3 md:p-4 mb-4 md:mb-8 transition-all duration-500 rounded-2xl bg-blue-50 border border-blue-100 group-hover:scale-110 group-hover:bg-[#0077cc] group-hover:shadow-[0_10px_20px_rgba(0,119,204,0.3)] group-hover:rotate-6">
                  <div className="transition-colors duration-500 text-[#0077cc] group-hover:text-white">
                    {React.cloneElement(feature.icon, {
                      className: "size-5 md:size-7 transition-colors duration-500",

                    })}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="mb-1.5 md:mb-3 text-sm md:text-xl font-bold tracking-tight text-[#1a2e52] transition-colors duration-300 group-hover:text-[#0077cc]">
                  {feature.title}
                </h3>

                <p className="mb-4 md:mb-6 text-[11px] md:text-sm leading-snug md:leading-relaxed text-gray-600 group-hover:text-gray-700 line-clamp-3 md:line-clamp-none">
                  {feature.description}
                </p>

                {/* Action Link - Simplified for Mobile */}
                <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-bold text-[#0077cc] transition-all duration-300 group-hover:gap-3">
                  <span className="tracking-wide cursor-pointer uppercase md:normal-case">
                    Explore More
                  </span>
                  <div className="p-0.5 md:p-1 transition-all duration-300 bg-blue-100 rounded-full">
                    <ArrowRight className="size-2 md:size-3" />
                  </div>
                </div>

                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none rounded-[2rem]"
                  style={{
                    background:
                      "radial-gradient(circle at top left, rgba(0,119,204,0.05) 0%, transparent 70%)",
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

export default LandingPage;