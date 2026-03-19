import React, { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import WriteCover from "../assets/WriteCover.png";
import StepsLady from "../assets/StepsLady.png"
import RightGuy from "../assets/RightGuy.png"
import DoNot from "../assets/Screenshot_2026-01-24_201207-removebg-preview.png"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


// --- Custom React SVG Icons (Replacing Lucide) ---
const IconFile = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const IconCopy = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const IconZap = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const App = () => {
  const [activeExample, setActiveExample] = useState("intern");
  const [exampleCopied, setExampleCopied] = useState(false);

  const handleCopyExample = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setExampleCopied(true);
      setTimeout(() => setExampleCopied(false), 1500);
    } catch (err) {
      console.log("Copy failed", err);
    }
  };

  const examples = {
    intern: {
      title: "Fresher / Intern",
      content: `[Your Name]
[Phone] | [Email] | [LinkedIn] | [Portfolio/GitHub]
[City, Country]

[Date]
        
Dear Hiring Manager,

I’m applying for the Web Development Intern position at [Company Name]. I’m excited about your work in building user-friendly products, and I’d love to contribute my frontend development skills while learning from your team.

I recently built projects including a responsive portfolio website and a quiz app using React and Tailwind CSS. Through these projects, I improved my understanding of reusable components, state management, UI responsiveness, and debugging. I also focused on clean code and consistent UI patterns.

What interests me about [Company Name] is [specific reason: product/mission]. I’d love the opportunity to contribute to real features while improving my skills under experienced developers.

Thank you for your time. I’d be happy to connect for an interview.

Sincerely,
[Your Name]`
    },
    experienced: {
      title: "Experienced",
      content: `[Your Name]
[Phone] | [Email] | [LinkedIn] | [Portfolio/GitHub]
[City, Country]

[Date]

Dear [Hiring Manager Name/ Hiring Team],

I’m applying for the [Role] position at [Company Name]. With experience building production-ready web applications, I’m confident I can contribute to your product development and delivery quality.

At [Previous Company], I developed and optimized [feature/module], improving [metric] by [number]. I worked with [tech stack] and collaborated with cross-functional teams to deliver scalable solutions.

I’m excited about [Company Name] because [reason]. I’d welcome the opportunity to discuss how my experience can support your roadmap.

Sincerely,
[Your Name]`
    },
    switch: {
      title: "Career Switch",
      content: `[Your Name]
[Phone] | [Email] | [LinkedIn] | [Portfolio/GitHub]
[City, Country]

[Date]
      
Dear Hiring Team,

After working in [previous field] for [years], I’m transitioning into [target role] to build a long-term career in [domain]. I’m applying to [Company Name] because I admire your work in [area], and I’d love to contribute with strong dedication and rapid learning.

To prepare, I completed [course] and built projects like [project], where I learned [skills/tools]. Along with technical learning, my experience improved my communication, teamwork, and structured problem-solving — skills that help me perform well in professional environments.

I’d love the opportunity to discuss how my unique background can support your team.

Warm regards,
[Your Name]`
    }
  };

  const navigate = useNavigate();
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 pb-20 overflow-x-hidden">
      <NavBar />

      {/* Hero Section */}
      <section className="w-full bg-white mt-20">
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <IconZap />
                Cover Letter
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                Write a Cover Letter that <span className="text-blue-600">actually</span> gets read.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-xl leading-relaxed mb-8">
                While your resume shows <span className="italic">what</span> you can do, your cover letter shows{" "}
                <span className="italic">why</span> you should be the one to do it. Learn the ideal structure to land your dream role.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (!isLoggedIn) navigate("/login");
                    else navigate("/user/cover-letter");
                  }}
                  className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >Create Your Cover letter
                </button>

                <button
                  onClick={() => navigate("/cover-letter-examples")}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Examples
                </button>

              </motion.div>
            </motion.div>

            {/* RIGHT: Image (Hidden on medium/tablet screens where text becomes full width or misaligned) */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="relative hidden lg:flex justify-center lg:justify-end"
            >
              <div className="absolute -inset-6 bg-blue-100/60 blur-3xl rounded-full" />

              <img
                src={WriteCover}
                alt="Cover letter illustration"
                className="relative w-full h-full object-cover rounded-3xl max-w-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What & Why */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid md:grid-cols-2 gap-8">
          <motion.div
            variants={fadeUp}
            className="bg-slate-50 p-10 rounded-3xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60 hover:border-blue-200"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <IconFile />
              </span>
              What is a Cover Letter?
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              It is a one-page narrative that gives recruiters context that a resume cannot fully provide. Think of it as your professional introduction before the interview.
            </p>
            <ul className="space-y-4">
              {[
                "Why you're applying for this specific role",
                "Why you're a strong match based on experience",
                "Why you want this specific company mission",
                "How your story connects to the job needs"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <span className="mt-0.5 text-green-500 shrink-0">
                    <IconCheck />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-slate-900 p-10 rounded-3xl text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="p-2 bg-white/10 rounded-lg text-blue-400">
                <IconTarget />
              </span>
              Why It Matters
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Even when optional, a letter sets you apart from candidates who only submit a resume. Recruiters use it to judge:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Communication", desc: "Clarity of thought" },
                { label: "Motivation", desc: "Seriousness & interest" },
                { label: "Culture Fit", desc: "Personality & values" },
                { label: "Storytelling", desc: "Confidence & impact" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="text-blue-400 font-bold text-xs md:text-sm mb-0 md:mb-1">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Step-by-Step Structure */}
      <section className="relative bg-slate-50 py-12 overflow-hidden">
        {/* Left Side Character - Hidden on tablet/mobile to avoid overlapping text */}
        <motion.img
          src={StepsLady}
          alt="Guide illustration"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="hidden xl:block absolute left-1 top-10 h-[680px] w-[450px] pointer-events-none select-none"
        />

        {/* Bottom Right Background Character - Hidden on tablet/mobile */}
        <motion.img
          src={RightGuy}
          alt=""
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="hidden xl:block absolute -right-24 bottom-0 h-[560px] w-[440px] pointer-events-none select-none"
        />



        <div className="relative max-w-4xl mx-auto px-6 z-10">

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-3xl md:text-4xl font-black mb-12 text-center tracking-tight"
          >
            The 7-Step Perfect Structure
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                step: "01",
                title: "Professional Header",
                desc: "Include Full Name, Phone, Email, LinkedIn, and Location. Keep it clean and aligned to your resume header style.",
                code: "Nensi Thummar | +91 XXXX | nensi@email.com | Ahmedabad, India"
              },
              {
                step: "02",
                title: "Personalized Greeting",
                desc: "Always aim for a specific name. If not known, use 'Dear Hiring Team' or 'Dear [Company] Recruitment Team'.",
                bad: "❌ Avoid: 'To whom it may concern'"
              },
              {
                step: "03",
                title: "The Opening Hook",
                desc: "The first 2–3 lines decide if they keep reading. Mention the role, the company, and one high-impact proof line.",
                example: "✅ 'I’m excited to apply for the Frontend position at [Company]. I recently built a quiz app using React...'"
              },
              {
                step: "04",
                title: "Proof of Match",
                desc: "The main body. Answer 'Why should we hire you?'. Use metrics if possible (speed improved, bugs fixed).",
                tip: "Avoid claiming adjectives like 'I am hardworking'. Instead, show it via projects."
              },
              {
                step: "05",
                title: "Company Alignment",
                desc: "Why this company specifically? Mention their product, mission, tech stack, or unique domain values."
              },
              {
                step: "06",
                title: "Closing & CTA",
                desc: "Show enthusiasm, offer a discussion, and keep it short. Use 'Sincerely' followed by your name."
              },
              {
                step: "07",
                title: "Format & Length",
                desc: "Keep it to 250–400 words (3–4 short paragraphs). Use professional fonts and readable spacing."
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 group hover:border-blue-400 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                  <div className="text-3xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-500 mb-4 leading-relaxed">{item.desc}</p>

                    {item.code && (
                      <div className="bg-slate-50 p-3 rounded-xl font-mono text-xs border border-slate-100 group-hover:border-blue-200 transition break-all">
                        {item.code}
                      </div>
                    )}
                    {item.bad && <div className="text-sm font-bold text-red-500">{item.bad}</div>}
                    {item.example && <div className="text-sm font-bold text-green-600">{item.example}</div>}
                    {item.tip && <div className="text-sm font-bold text-amber-600">{item.tip}</div>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Real-World Examples */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-black mb-8 text-center lg:text-left">
          Real-World Examples
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6 w-full sm:w-fit">
          {Object.keys(examples).map((key) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              className={`flex-1 sm:flex-none py-3 px-5 rounded-xl text-sm font-bold transition-all duration-300 ${activeExample === key
                ? "bg-white shadow-sm text-blue-600"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
            >
              {examples[key].title}
            </button>
          ))}
        </div>

        {/* Example Card */}
        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[32px] shadow-sm relative group hover:shadow-xl hover:shadow-slate-200/60 transition-all min-h-[520px]">

          <button
            onClick={() => handleCopyExample(examples[activeExample].content)}
            className={`absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-lg border transition-colors ${exampleCopied
              ? "bg-green-50 border-green-200 text-green-600"
              : "bg-slate-50 border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
            title="Copy example"
          >
            {exampleCopied ? <IconCheck /> : <IconCopy />}
          </button>

          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-serif italic text-base md:text-lg">
            {examples[activeExample].content}
          </div>
        </div>
      </section>


      {/* Mistakes */}
      <section className="max-w-6xl mx-auto px-6 mb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest mb-5"
          >
            <IconAlert />
            Mistakes to Avoid
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-3"
          >
            Common Cover Letter Mistakes (and How to Fix Them)
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Most cover letters fail because they feel generic, too long, or lack proof.
            Use these fixes to make your letter clear, confident, and recruiter-friendly.
          </motion.p>
        </motion.div>

        {/* Mistake Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              title: "Too long / boring to scan",
              mistake:
                "Writing long paragraphs with too much detail makes recruiters skip your letter.",
              fix:
                "Keep it 250–400 words. Use 3–4 short paragraphs and focus on only your best 1–2 proofs."
            },
            {
              title: "Repeating your resume",
              mistake:
                "Copy-pasting resume bullet points line-by-line adds no extra value.",
              fix:
                "Explain the story behind your strongest achievement and why it matters for this job."
            },
            {
              title: "Generic letter for every company",
              mistake:
                "If your cover letter can be sent to any company, it feels low-effort.",
              fix:
                "Add 1–2 specific company facts (product, mission, domain, values) and connect your interest to them."
            },
            {
              title: "No proof (only adjectives)",
              mistake:
                "Phrases like “hardworking” or “passionate” don’t convince recruiters without evidence.",
              fix:
                "Add results: metrics, impact, outcomes, or measurable improvements from projects or internships."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group bg-white border border-slate-200 rounded-3xl p-6 md:p-7 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center transition-all duration-300 ease-out group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 shrink-0">
                  <IconAlert />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 transition-all duration-300 group-hover:border-blue-100">
                  <div className="text-[11px] uppercase tracking-widest font-black text-slate-500 mb-2">
                    Mistake
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {item.mistake}
                  </p>
                </div>

                <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4 transition-all duration-300 group-hover:bg-blue-50 group-hover:border-blue-200">
                  <div className="text-[11px] uppercase tracking-widest font-black text-blue-600 mb-2">
                    Fix
                  </div>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                    {item.fix}
                  </p>
                </div>
              </div>
            </motion.div>

          ))}
        </motion.div>

        {/* AI phrases improvement section */}
        <section className="mt-20">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* LEFT: Content */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group bg-slate-50 border border-slate-200 rounded-[32px] p-8 md:p-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 hover:border-slate-300"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-5">
                ⚠ Writing Tip
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Avoid generic, AI-sounding phrases
              </h3>

              <p className="text-slate-600 leading-relaxed mb-6">
                Recruiters skim fast. Instead of emotional filler, show real proof —
                projects you built, results you achieved, and why you fit this company.
              </p>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  "I am thrilled...",
                  "I am passionate...",
                  "Perfect fit...",
                  "Delighted to share...",
                  "Excited to apply..."
                ].map((word, i) => (
                  <span
                    key={i}
                    className="bg-white border border-slate-200 text-slate-400 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold line-through"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Illustration (Hidden on mobile/tablet to prioritize text clarity) */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="hidden lg:flex justify-center md:justify-end"
            >
              <img
                src={DoNot}
                alt="Avoid generic phrases"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </motion.div>
          </div>
        </section>
      </section>

      {/*CTA Section */}
      <section className="relative py-16 md:py-20 bg-blue-600 text-white overflow-hidden">

        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
            Ready to write a cover letter that actually gets interviews?
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
            Stop guessing what recruiters want. Build a professional, tailored cover letter in minutes and apply with confidence.
          </p>

          <button
            onClick={() => {
              if (!isLoggedIn) navigate("/login");
              else navigate("/user/cover-letter");
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <span>Create Now</span>
            <HiArrowRight className="text-2xl transition-transform duration-300 group-hover:translate-x-1" />
          </button>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App;