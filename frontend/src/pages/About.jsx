import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { FiTrendingUp, FiCpu, FiUsers, FiUserCheck, FiBriefcase, FiGlobe } from "react-icons/fi";
import AiBuilder from "../assets/AboutUs1.png";
import Company from "../assets/AboutUs2.png";
import Success from "../assets/AboutUs3.png";

const AboutUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBuildResume = () => {
    navigate('/login');
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-['Outfit'] text-[#1a2e52] overflow-x-hidden">
      <NavBar />

      <main className="bg-[#f8fafc] text-slate-800 overflow-x-hidden">

        {/* HERO */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-2 py-12 md:py-12 grid md:grid-cols-2 gap-10 md:gap-12 items-center overflow-hidden">
  
  <motion.div 
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    className="relative z-10 text-center md:text-left"
  >
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-10 pb-4 md:pb-6 font-extrabold leading-tight text-slate-900">
  <span className="whitespace-nowrap">AI Resume Builder</span> by{" "}
  <span className="text-blue-600">UptoSkills</span>
</h1>


    <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">
      Built to help students and job seekers transform their skills into
      professional, ATS-friendly resumes that align with real industry expectations.
    </p><br></br>
    <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto md:mx-0">Our AI-powered platform enhances your resume with impact-driven content, role-specific optimization, and recruiter-friendly formatting-helping students, graduates, and professionals stand out in today's competitive job market.</p>
  </motion.div>

  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="relative z-10 w-full h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center"
  >
    <img
      src={AiBuilder}
      alt="AI Resume Builder Preview"
      className="w-full h-auto object-contain drop-shadow-xl"
    />
  </motion.div>

</section>


        {/* ABOUT COMPANY */}
        <section className="bg-white py-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
            <div className="space-y-5 md:space-y-6 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">About UptoSkills</h2>
              <h6><b>Headquarter:</b> Palam, New Delhi, India.</h6>
              <p className="text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-4">
                UptoSkills Tech Foundation is an Indian ed-tech and skill
                development organization focused on bridging the gap between
                academic education and real-world industry requirements. Since
                its early days as a learning platform, UptoSkills has worked to
                make students more employable through practical, career-oriented
                learning experiences.
              </p>
              <p className="text-slate-600 leading-relaxed">
                With training programs in Digital Marketing, Web Development,
                Data Analytics, AI, and soft skills, UptoSkills supports learners
                in building both technical expertise and professional confidence.
              </p>
              
            </div>
<motion.div 
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="relative z-10 flex items-center justify-center w-full px-6 py-10"
>

  {/* Image */}
<img
  src={Company}
  alt="UptoSkills Learning Ecosystem"
  className="relative w-full max-w-none lg:w-[110%] xl:w-[120%] h-auto object-contain drop-shadow-2xl rounded-2xl backdrop-blur-sm"
/>

</motion.div>

          </motion.div>
        </section>


        {/* WHY CHOOSE US */}
        <section className="py-12 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why Choose UptoSkills</h2>
                <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
                We combine skill development expertise with AI-powered career tools to
                help learners move from education to employment with confidence.
                </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
            >
              {[
  {
    title: "Industry-Aligned Learning",
    desc: "Our training and tools are built around real industry requirements, not just theory.",
    icon: <FiTrendingUp />
  },
  {
    title: "AI-Powered Career Tools",
    desc: "From resume building to career readiness, our AI solutions simplify your job preparation journey.",
    icon: <FiCpu />
  },
  {
    title: "Proven Impact at Scale",
    desc: "Millions of learners trained and thousands of successful placements across India.",
    icon: <FiUsers />
  },
  {
    title: "Student-Centric Approach",
    desc: "We design our platform keeping freshers and early professionals in mind.",
    icon: <FiUserCheck />
  },
  {
    title: "Career Readiness Focus",
    desc: "Beyond skills, we prepare learners with soft skills, confidence, and interview support.",
    icon: <FiBriefcase />
  },
  {
    title: "Accessible Opportunities",
    desc: "We strive to make career growth accessible for learners from diverse backgrounds.",
    icon: <FiGlobe />
  }
]
.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                  className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm transition-all duration-300 border border-transparent hover:border-blue-100"
                >
                  <div className="w-12 h-12 mb-4 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/*Vision */}
        <section className="py-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5 md:space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-slate-600 text-base sm:text-lg">
              UptoSkills aims to make learners industry-ready by combining
              multi-disciplinary skill development with career support. The AI
              Resume Builder is an extension of this mission — helping candidates
              clearly present their abilities and stand out in competitive hiring
              processes.
            </p>
          </motion.div>
        </section>

        {/* MILESTONES */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-14 md:mb-20">
              Our Milestones
            </h2>

            <div className="relative">
              <div className="absolute left-6 sm:left-10 top-0 bottom-0 border-l-2 border-dashed border-blue-200"></div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="space-y-12 md:space-y-16"
              >
                {[
                  {
                    year: "2015",
                    title: "The Idea Was Born",
                    desc: "UptoSkills started with a mission to bridge India's employability gap through practical skill development.",
                    icon: "💡",
                  },
                  {
                    year: "2016",
                    title: "Platform Launch",
                    desc: "Official launch of multi-disciplinary learning programs focused on career readiness.",
                    icon: "🚀",
                  },
                  {
                    year: "2020",
                    title: "Digital Expansion",
                    desc: "Shifted to large-scale online training, expanding reach across India.",
                    icon: "🌐",
                  },
                  {
                    year: "2023",
                    title: "National Impact",
                    desc: "Crossed major milestones in learner reach and college partnerships.",
                    icon: "🏫",
                  },
                  {
                    year: "2024",
                    title: "Official Incorporation",
                    desc: "Registered as UptoSkills Tech Foundation to scale structured impact initiatives.",
                    icon: "🏢",
                  },
                  {
                    year: "2025",
                    title: "AI Career Tools",
                    desc: "Working on AI-powered employability tools.",
                    icon: "🤖",
                  },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    className="relative flex items-start gap-5 sm:gap-8 group"
                  >
                    <div className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-blue-50 border border-blue-100 text-2xl sm:text-3xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      {item.icon}
                    </div>

                    <div className="absolute left-6 sm:left-10 top-6 sm:top-8 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-4 border-white shadow"></div>

                    <div className="flex-1 pt-1 sm:pt-2">
                      <p className="text-blue-600 font-semibold text-xs sm:text-sm">{item.year}</p>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{item.title}</h3>
                      <p className="text-slate-600 mt-2 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>


        {/* WHAT WE DO */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <motion.h2 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} 
              className="text-2xl sm:text-3xl font-bold text-slate-900"
            >
              What Our AI Resume Builder Does
            </motion.h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Designed with hiring insights and career readiness in mind, our
              AI-powered tool simplifies resume creation for students and early professionals.
            </p>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mt-10 md:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left"
            >
              {[
                {
                  title: "AI-Powered Resume Writing",
                  desc: "Generate role-specific content based on your skills and experience."
                },
                {
                  title: "ATS Optimization",
                  desc: "Ensure your resume is formatted to pass automated screening systems."
                },
                {
                  title: "Industry-Aligned Templates",
                  desc: "Use layouts designed according to recruiter expectations."
                },
                {
                  title: "Guided Step-by-Step Flow",
                  desc: "Perfect for students and freshers building resumes for the first time."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-50 p-5 sm:p-6 rounded-xl shadow-sm border-t-4 border-blue-500 hover:bg-white hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="py-8 md:py-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-12 items-center"
          >
<motion.div 
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="relative z-10 flex items-center justify-center w-full px-6 py-10"
>

  {/* Image */}
<img
  src={Success}
  alt="Studet Success"
  className="relative w-full max-w-none lg:w-[110%] xl:w-[120%] h-auto object-contain drop-shadow-2xl rounded-2xl backdrop-blur-sm"
/>

</motion.div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why This Matters</h2>
              <p className="text-slate-600 leading-relaxed mt-3 text-sm sm:text-base">
                Many talented students struggle to translate their knowledge into
                resumes that reflect their true potential. By combining career
                readiness expertise with AI technology, UptoSkills ensures that
                learners can present their strengths with clarity and confidence.
              </p>
            </div>
          </motion.div>
        </section>

        {/* VALUES */}
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Core Values</h2>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mt-10 md:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left"
            >
              {[
                { title: "Employability First", desc: "We focus on outcomes that help learners get hired." },
                { title: "Practical & Gamified Learning", desc: "Practical skills, real scenarios, and gamified experiences that make growth engaging and rewarding" },
                { title: "Accessibility", desc: "Opportunities for learners from all backgrounds." },
                { title: "Growth Mindset", desc: "Continuous learning and career development." }
              ].map((value, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  whileHover={{ backgroundColor: "#eff6ff" }}
                  className="p-5 sm:p-6 bg-slate-50 rounded-xl transition-colors duration-300 cursor-default"
                >
                  <h4 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">{value.title}</h4>
                  <p className="text-slate-600 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white overflow-hidden relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Turn Your Skills Into Opportunities
            </h2>
            <p className="mb-8 text-blue-100 max-w-xl mx-auto text-sm sm:text-base">
              Build a professional AI-powered resume and take the next step toward your career goals.
            </p>
            <motion.button 
              onClick={handleBuildResume}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-6 sm:px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-slate-100 transition shadow-2xl text-sm sm:text-base"
            >
              Build My Resume
            </motion.button>
          </motion.div>
        </section>


        <Footer />
      </main>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AboutUs;