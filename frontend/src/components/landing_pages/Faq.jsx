import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { ChevronDown } from "lucide-react";

/* Small scroll animation helper (same pattern you use) */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

const faqs = [
  {
    q: "What is AI Resume Builder?",
    a: "AI Resume Builder helps you create, analyze, and optimize resumes using AI so they pass ATS systems and impress recruiters.",
  },
  {
    q: "Is the AI Resume Builder free?",
    a: "Yes. You can use basic features completely free. Premium features unlock advanced optimization and templates.",
  },
  {
    q: "How does ATS (Applicant Tracking System) work and why does it matter?",
    a: "ATS software scans and parses your resume before any human sees it. Over 75% of resumes are rejected by ATS due to poor formatting, missing keywords, or incompatible file types. Our AI ensures your resume is ATS-friendly by using standard headings, readable fonts, and keyword optimization aligned with job descriptions.",
  },
  {
    q: "How can I ace ATS and get my resume seen by recruiters?",
    a: "To beat ATS: use simple formatting without tables or columns, include relevant keywords from the job posting, stick to standard section headings like 'Experience' and 'Education', save as PDF or DOCX, and avoid graphics or images. Our Pro and Premium plans include ATS Score Optimization that automatically analyzes and improves your resume's ATS compatibility.",
  },
  {
    q: "Can I download my resume?",
    a: "Absolutely. You can download your resume in PDF format once it's generated or optimized.",
  },
  {
    q: "Will my resume pass ATS systems?",
    a: "Our platform is built around ATS standards used by Fortune 500 companies, increasing your chances significantly.",
  },
  {
    q: "What's the difference between Free, Pro, and Premium plans?",
    a: "Free gives you basic AI resume building and section suggestions. Pro (₹299/month) adds premium templates, ATS score optimization, AI content enhancement, and unlimited downloads—perfect for active job seekers. Premium (₹999/year) includes everything in Pro plus priority support and all future updates, saving you money with annual billing.",
  },
  {
    q: "What benefits do Pro and Premium users get that Free users don't?",
    a: "Pro and Premium users unlock all premium templates, ATS Score Optimization to beat applicant tracking systems, AI Content Enhancement for stronger bullet points, and unlimited resume downloads. Premium users also get priority support and guaranteed access to all future features. These tools significantly boost your chances of landing interviews.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your data is encrypted and never shared with third parties.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [heroRef, heroVisible] = useInView(0.2);
  const [faqRef, faqVisible] = useInView(0.15);
  const toggleFaq = (index) => setOpenIndex((current) => (current === index ? null : index));

  return (
    <div className="min-h-screen bg-white font-['Outfit']">
      <NavBar />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative px-6 pt-24 pb-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50"
      >
        {/* Glow blobs */}
        <div className="absolute rounded-full -top-24 -left-24 w-72 h-72 bg-blue-200/30 blur-3xl animate-pulse" />
        <div className="absolute rounded-full -bottom-24 -right-24 w-72 h-72 bg-indigo-200/30 blur-3xl animate-pulse" />

        <div
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
            Help Center
          </span>

          <h1 className="mb-6 text-4xl font-black text-gray-900 md:text-6xl">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Everything you need to know about AI Resume Builder, ATS scoring,
            downloads, privacy, and more.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section ref={faqRef} className="px-6 py-12 bg-white">
        <div
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-6">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-2xl hover:shadow-xl"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full px-6 py-5 text-left"
                  >
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.q}
                    </h3>
                    <ChevronDown
                      size={22}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </button>

                  <div
                    className={`px-6 transition-all duration-300 ${
                      isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <p className="leading-relaxed text-gray-600">{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION (MATCHES YOUR STYLE) */}
      <section className="relative px-6 py-12 lg:py-24 bg-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-6xl lg:mb-6">
            Still Have Questions?
          </h2>

          <p className="mb-8 text-lg lg:text-xl text-slate-400 lg:mb-10">
            Try our AI Resume Builder and see the difference instantly.
          </p>

          <a
            href="/resume-checker"
            className="inline-flex items-center gap-3 px-8 py-4 text-base font-black transition-all duration-500 bg-blue-600 lg:px-10 lg:py-5 lg:text-lg rounded-2xl hover:bg-blue-500 hover:scale-105"
          >
            Check My Resume
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
