import React from 'react';
import { 
  Sparkles, 
  FileCheck, 
  Zap, 
  History, 
  ArrowRight, 
  CheckCircle2,
  MousePointerClick,
  UploadCloud, 
  Link2, 
  FileDown, 
  MousePointer2,
  ArrowLeft
} from 'lucide-react';
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import cover from "../assets/cover1.png";

const SimpleCoverLetterPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/?scrollTo=features");
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] selection:bg-blue-100 overflow-x-hidden">
      <NavBar />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative px-8 pt-4 pb-12 overflow-hidden bg-white">
        {/* Brand Decorative Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Back To Home Button */}
          <div className="pt-2 pb-6">
            <button
              onClick={handleBackHome}
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#0077cc] transition-all duration-200"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to home</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-16 lg:flex-row lg:text-left pt-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-50">
                <Sparkles size={16} className="text-[#0077cc]" />
                <span className="text-xs font-black tracking-widest text-[#0077cc] uppercase">
                  AI Writing Assistant
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-black tracking-tighter md:text-7xl lg:leading-[1.1] font-jakarta">
                Write your Cover Letter <br />
                <span className="text-[#0077cc]">in 10 Seconds.</span>
              </h1>

              <p className="max-w-xl mx-auto mb-10 text-xl font-medium text-gray-500 lg:mx-0">
                Stop staring at a blank page. Our AI reads your resume and job description to write a
                perfect letter that gets you hired.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95 mx-auto lg:mx-0"
              >
                <span>Generate Now — It's Free</span>
                <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

            <div className="relative flex-1 w-full max-w-[550px]">
              <img
                src={cover}
                alt="AI Cover Letter Preview"
                className="hidden md:block w-full h-auto rounded-[2rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- WHAT IS A COVER LETTER --- */}
      <section className="px-8 py-20 bg-white font-['Outfit']">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#1a2e52] mb-12">
            What is a Cover Letter?
          </h2>

          <div className="mb-12 space-y-6 text-lg text-gray-600">
            <p>
              A cover letter is a professional document that accompanies your resume to provide a
              detailed introduction of your skills, experiences, and interest in a specific job role.
              It acts as a bridge between your technical qualifications and the unique value you bring
              to a potential employer.
            </p>
            <p>
              Our AI Cover Letter builder analyzes the job description and your resume to create a
              narrative that highlights your most relevant achievements. A well-crafted letter
              increases your chances of getting noticed by recruiters by showing that you've done your
              research and are genuinely interested in the position.
            </p>
          </div>

          {/* Featured Blue Box */}
          <div className="bg-[#f0f7ff] border-l-4 border-[#0077cc] rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1a2e52] mb-6">Our AI Cover Letter Scans for:</h3>
            <ul className="space-y-4">
              {[
                { title: "Personalized Narrative", desc: "Tailors your story to match the company culture." },
                { title: "Role-Specific Keywords", desc: "Identifies and includes crucial industry terms." },
                { title: "Professional Formatting", desc: "Ensures the layout is clean and recruiter-ready." },
                { title: "Direct Value Alignment", desc: "Connects your past results to future job requirements." }
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

      {/* --- 2. THE DIFFERENCE --- */}
      <section className="px-8 py-24 group/section">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-4xl font-black tracking-tight text-center">
            The AI Difference
          </h2>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 opacity-60 transition-all duration-500 hover:opacity-100 hover:bg-white hover:shadow-xl group/old">
              <span className="block mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
                The Old Way
              </span>
              <h3 className="mb-6 text-2xl font-bold">Manual Writing</h3>
              <ul className="space-y-4">
                {["Generic Greetings", "Hours of editing", "Zero Keyword Optimization"].map(
                  (text, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-medium text-gray-500"
                    >
                      <span className="w-2 h-2 transition-colors bg-gray-300 rounded-full group-hover/old:bg-red-400" />{" "}
                      {text}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="p-10 bg-white rounded-[40px] border-2 border-blue-600 shadow-2xl relative transition-all duration-500 hover:-translate-y-3 group/new">
              <div className="absolute -top-4 right-10 bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase shadow-lg group-hover/new:scale-110 transition-transform">
                Recommended
              </div>
              <span className="block mb-4 text-xs font-black tracking-widest text-blue-600 uppercase">
                The Smart Way
              </span>
              <h3 className="mb-6 text-2xl font-bold">AI Builder</h3>
              <ul className="space-y-4">
                {[
                  "Tailored to specific Job Role",
                  "Finished in under 10 seconds",
                  "Guaranteed ATS compatibility"
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-base font-bold text-[#1a2e52] group-hover/new:translate-x-2 transition-transform"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <CheckCircle2 size={22} className="text-green-500" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. SIMPLE 3-STEP PROCESS (ICON-ONLY DARK BUTTONS) --- */}
      <section className="px-8 py-24 bg-white font-['Outfit']">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl md:text-5xl font-black text-[#1a2e52]">
              Simple 3-Step Process
            </h2>
            <p className="max-w-xl mx-auto text-lg font-medium text-gray-500">
              Fast, efficient, and built for results.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: UploadCloud,
                t: "Upload Resume",
                d: "Our AI immediately scans your pasted text to extract your professional value.",
              },
              {
                icon: Link2,
                t: "Analyze & Optimize",
                d: "We use AI to re-architect your content and target high-impact industry keywords.",
              },
              {
                icon: FileDown,
                t: "Export PDF",
                d: "Instantly download a polished, recruiter-ready document that lands interviews.",
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

                {/* ICON-ONLY BUTTON: dark background + white icon */}
                <div className="mb-8 p-6 rounded-3xl bg-[#1a2e52] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg hover:shadow-xl border-2 border-white/20 flex items-center justify-center">
                  <step.icon size={48} className="text-white drop-shadow-lg" />
                </div>

                <h4 className="mb-4 text-2xl font-bold text-[#1a2e52] group-hover:text-blue-600 transition-colors">
                  {step.t}
                </h4>

                <p className="font-medium leading-relaxed text-gray-500">
                  {step.d}
                </p>

                <div className="flex items-center gap-2 mt-8 text-sm font-bold text-blue-600 transition-opacity opacity-0 group-hover:opacity-100">
                  Learn More <MousePointer2 size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. BENTO FEATURES --- */}
      <section className="px-8 pt-4 mx-auto pb-14 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: Zap, color: "blue", title: "Instant Generation", desc: "Drafts ready in seconds, not hours." },
            { icon: History, color: "indigo", title: "Infinite Edits", desc: "One click to rewrite any section." },
            { icon: FileCheck, color: "cyan", title: "Recruiter Approved", desc: "Designed to pass every ATS screen." }
          ].map((feature, i) => (
            <div
              key={i}
              className={`p-10 bg-${feature.color}-50 rounded-[48px] transition-all duration-500 hover:bg-white hover:shadow-2xl hover:-translate-y-2 group cursor-default`}
            >
              <feature.icon
                className={`mb-8 text-${feature.color}-600 transition-transform group-hover:scale-125 group-hover:rotate-12`}
                size={40}
              />
              <h4 className="mb-4 text-2xl font-black">{feature.title}</h4>
              <p className="text-sm font-semibold leading-relaxed text-gray-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 5. FINAL CTA --- */}
      <section className="relative px-8 pt-4 pb-24 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="mb-6 text-4xl font-black md:text-6xl text-[#1a2e52] tracking-tighter font-jakarta leading-tight">
            Write your Cover Letter <br />
            <span className="text-[#0077cc]">in 10 Seconds.</span>
          </h2>
          <p className="mb-10 text-xl font-medium text-gray-500">
            Our AI reads your resume and job description to write a perfect letter that gets you
            hired.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
          >
            <span>Generate Now — It's Free</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SimpleCoverLetterPage;
