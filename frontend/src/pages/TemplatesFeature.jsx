import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Palette, Download } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import image from "../assets/TemplateFeature2.png";

// ✅ Scroll animation helper
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

const TemplatesFeature = () => {
  const navigate = useNavigate();

  // ✅ Sections animation refs
  const [heroRef, heroVisible] = useInView(0.2);
  const [whatRef, whatVisible] = useInView(0.15);
  const [featRef, featVisible] = useInView(0.15);
  const [howRef, howVisible] = useInView(0.15);
  const [ctaRef, ctaVisible] = useInView(0.2);

  const handleBackHome = () => {
    navigate("/?scrollTo=features");
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit']">
      <NavBar />

      {/* HERO */}
      <section
  ref={heroRef}
  className="relative px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50"
>

  {/* Background blobs */}
  <div className="absolute rounded-full -top-24 -left-24 w-72 h-72 bg-blue-200/30 blur-3xl animate-pulse" />
  <div className="absolute rounded-full -bottom-24 -right-24 w-72 h-72 bg-indigo-200/30 blur-3xl animate-pulse" />

  <div className="mx-auto max-w-7xl">
    {/* HERO GRID */}
    <div className="grid items-center min-h-[85vh] gap-12 pt-36 pb-16 lg:grid-cols-2">

      {/* LEFT CONTENT */}
      <div
        className={`transition-all duration-700 ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="inline-block mt-4 px-5 py-2 mb-5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
          Professional Resume Templates
        </div>

        <h1 className="mb-5 text-4xl font-black leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          Professional Resume <span className="text-blue-600">Templates</span>
        </h1>

        <p className="max-w-xl mb-6 text-lg leading-relaxed text-gray-600 md:text-xl">
          Choose from ATS-optimized templates designed by experts. Trusted by
          100,000+ professionals worldwide.
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle size={16} className="text-green-600" />
          100% free • No credit card required • ATS-optimized
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div
        className={`relative flex justify-center lg:justify-end transition-all duration-700 ${
          heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <img
          src={image}
          alt="Resume Templates Showcase"
          className="hidden md:block w-full max-w-[620px] lg:max-w-[680px] drop-shadow-2xl"
        />
      </div>

    </div>
  </div>
</section>



      {/* WHAT ARE TEMPLATES */}
      <section ref={whatRef} className="px-6 py-12 bg-white">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${whatVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-6 text-4xl font-bold text-center text-gray-900">
            What Are Professional Resume Templates?
          </h2>

          <div className="space-y-6 prose prose-lg text-gray-700 max-w-none">
            <p>
              Professional resume templates are pre-designed layouts that help
              you create a polished, ATS-friendly resume in minutes. Each
              template is crafted by career experts and tested against applicant
              tracking systems used by Fortune 500 companies.
            </p>

            <p>
              Our templates come in various styles - from Traditional for
              corporate roles to Creative for design positions. All templates
              are fully customizable, allowing you to adjust colors, fonts, and
              sections to match your personal brand while maintaining ATS
              compatibility.
            </p>

            {/* ✅ Info Highlight Box */}
            <div className="p-6 my-8 transition-all duration-300 border-l-4 border-blue-600 bg-blue-50 rounded-xl hover:shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Why our templates are ATS-friendly:
              </h3>

              <ul className="space-y-2">
                {[
                  "Clean formatting that ATS can read",
                  "Standard section headings",
                  "Balanced design without heavy graphics",
                  "Optimized spacing and alignment",
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start gap-2 group">
                    <CheckCircle
                      size={20}
                      className="flex-shrink-0 mt-1 text-blue-600 transition-transform group-hover:rotate-12"
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
<section ref={featRef} className="px-6 py-8 bg-white">
  <div
    className={`max-w-6xl mx-auto transition-all duration-700 ${
      featVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }`}
  >
    <h2 className="mb-16 text-4xl font-bold text-center text-gray-900">
      What Our Templates Offer
    </h2>

    <div className="grid gap-8 md:grid-cols-3">
      {[
        {
          icon: <CheckCircle size={40} />,
          title: "ATS-Optimized",
          desc: "Pass applicant tracking systems with 95% success rate. Tested with major ATS platforms.",
        },
        {
          icon: <Palette size={40} />,
          title: "Fully Customizable",
          desc: "Change colors, fonts, and sections to match your style while maintaining ATS compatibility.",
        },
        {
          icon: <Download size={40} />,
          title: "Multiple Formats",
          desc: "Download as PDF or Word document instantly. Print-ready and digital-friendly.",
        },
      ].map((feature, i) => (
        <div
          key={i}
          className="p-8 text-center transition-all duration-300 border border-gray-200 group bg-gray-50 rounded-2xl hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200"
        >
          {/* ICON */}
<div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-4 transition-transform duration-500 rounded-xl group-hover:-translate-y-3 group-hover:scale-110">

  {/* BLUE GLOW (RECTANGLE) */}
  <div
    className="absolute inset-0 transition-opacity duration-500 opacity-0 rounded-xl bg-blue-500/40 blur-xl group-hover:opacity-100"
  />

  {/* ICON HOLDER */}
  <div
    className="relative z-10 flex items-center justify-center w-full h-full transition-all duration-500 ease-out bg-blue-100 border border-blue-200 shadow-sm rounded-xl group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:scale-110 group-hover:-translate-y-0 group-hover:rotate-6 group-hover:shadow-lg"
  >
    {React.cloneElement(feature.icon, {
      className:
        "text-blue-600 transition-colors duration-500 group-hover:text-white",
    })}
  </div>

</div>


          {/* TITLE */}
            <h3 className="mb-2 text-lg font-extrabold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
            {feature.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-gray-600">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* HOW IT WORKS */}
      <section ref={howRef} className="px-6 py-14 bg-gray-50">
        <div
          className={`max-w-5xl mx-auto transition-all duration-700 ${howVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
            }`}
        >
          <h2 className="mb-4 text-4xl font-bold text-center text-gray-900">
            How It Works
          </h2>

          <p className="max-w-3xl mx-auto mb-16 text-lg text-center text-gray-600">
            Create a professional resume in three simple steps
          </p>

          <div className="p-8 transition-all duration-300 bg-white shadow-xl rounded-2xl md:p-12 hover:shadow-2xl">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Choose a template",
                  desc: "Browse our collection and select the template that fits your industry and style preference",
                },
                {
                  step: "2",
                  title: "Customize your resume",
                  desc: "Add your information and let our AI help you write compelling content that stands out",
                },
                {
                  step: "3",
                  title: "Download and apply",
                  desc: "Export your resume as PDF or Word and start applying to jobs with confidence",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 p-3 transition-all duration-300 group rounded-xl hover:bg-blue-50"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold text-white transition-transform bg-blue-600 rounded-full group-hover:scale-110">
                    {item.step}
                  </div>

                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION: CREATE RESUME --- */}
<section
  ref={ctaRef}
  className="relative px-8 pt-12 pb-24 overflow-hidden bg-white select-none"
>
  {/* Branding Decorative Blurs matching your Hero/LandingPage */}
  <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
  <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />
  
  <div
    className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
      ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`}
  >
    {/* Heading using your Navy #1a2e52 and Blue #0077cc highlight */}
    <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
      Ready to Create Your <span className="text-[#0077cc]">Dream Resume?</span>
    </h2>

    <p className="max-w-2xl mx-auto mb-10 text-xl font-normal leading-relaxed text-gray-600">
      Join 100,000+ professionals who landed their dream jobs using our AI builder and professionally designed templates.
    </p>

    {/* Primary Orange Gradient Button - Exact match to your "Start Building" style */}
    <button
      onClick={() => navigate("/login")}
      className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-[#e65100] to-[#f4511e] rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] active:scale-95"
    >
      <span className="relative z-10">Get Started Free</span>
      <ArrowRight
        size={22}
        className="relative z-10 transition-transform duration-300 group-hover:translate-x-2"
      />
    </button>

    {/* Small visual trust indicator matching your project style */}
    <div className="flex items-center justify-center gap-6 mt-10 text-sm font-bold text-gray-400">
       <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>ATS-Compliant</span>
       </div>
       
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
};
export default TemplatesFeature;
