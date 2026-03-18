import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  PenTool,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import HeroImage from "../assets/HeroImage.png";
import id1 from "../assets/id1.webp";
import id2 from "../assets/id2.jpg";
import id3 from "../assets/id3.jpg";
import id4 from "../assets/id4.jpg";
import id5 from "../assets/id5.jpg";
import id6 from "../assets/id6.jpg";
import id7 from "../assets/id7.jpg";
import id8 from "../assets/id8.jpg";
import id9 from "../assets/id9.jpg";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const CoverLetterExamples = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Examples");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);

  const categories = ["All Examples", "Technology", "Marketing", "Creative", "Healthcare", "Education", "Business"];

  const examples = [
    { id: 1, title: "Software Engineer", category: "Technology", level: "Mid-Senior Level", image: id1 },
    { id: 2, title: "Marketing Manager", category: "Marketing", level: "Senior Level", image: id2 },
    { id: 3, title: "Graphic Designer", category: "Creative", level: "Entry-Mid Level", image: id3 },
    { id: 4, title: "Product Manager", category: "Business", level: "Senior Level", image: id4 },
    { id: 5, title: "Registered Nurse", category: "Healthcare", level: "Entry-Mid Level", image: id5 },
    { id: 6, title: "Elementary Teacher", category: "Education", level: "Entry Level", image: id6 },
    { id: 7, title: "Sales Representative", category: "Business", level: "Mid Level", image: id7 },
    { id: 8, title: "Data Analyst", category: "Technology", level: "Entry-Mid Level", image: id8 },
    { id: 9, title: "Executive Assistant", category: "Business", level: "Mid-Senior Level", image: id9 },
  ];

  const filteredExamples = examples.filter((example) => {
    const matchesCategory = activeCategory === "All Examples" || example.category === activeCategory;
    const matchesSearch = example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -352 : 352;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (el) {
        const isAtEnd = el.scrollLeft >= (el.scrollWidth - el.clientWidth - 10);
        isAtEnd ? el.scrollTo({ left: 0, behavior: "smooth" }) : scroll("right");
      }
    }, 3000);
    return () => clearInterval(scrollInterval);
  }, []);

  const handleAccountNavigation = () => {
    localStorage.getItem("token") ? navigate("/user/dashboard") : navigate("/register");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit'] selection:bg-blue-100">
      <NavBar />

      <section className="relative pt-16 pb-20 px-12 pr-16 overflow-hidden bg-white mt-12">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent rounded-bl-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-orange-50/50 to-transparent rounded-tr-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full bg-white border border-blue-100 shadow-sm transition-transform hover:scale-105 cursor-default">
                <Sparkles size={16} className="text-[#0077cc] animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-[#1a2e52] uppercase">Recruiter Approved Examples</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#1a2e52] mb-6 tracking-tight font-jakarta leading-[1.1]">
                Professional Cover Letter <br />
                <span className="bg-gradient-to-r from-[#0077cc] to-[#3b82f6] bg-clip-text text-transparent">Examples & Templates</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Don't start from scratch. Browse our library of cover letter examples tailored for every industry and career level.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex justify-center lg:justify-end sm:flex">
              <div className="relative w-full max-w-[450px] float-slow">
                <img src={HeroImage} alt="Hero" className="w-full h-auto object-contain rounded-[1.6rem]" draggable={false} />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shadow-sm animate-pulse">
                  <span className="text-orange-500 text-lg leading-none">✦</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 pt-10 pb-14">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-35 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 ring-1 ring-gray-100 focus-within:ring-blue-300">
              <Search className="ml-5 text-gray-400 w-6 h-6 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by job title (e.g., 'Software Engineer')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder-gray-400"
              />
              <button className="bg-[#1a2e52] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">Search</button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-12 bg-slate-50 relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border shadow-sm ${activeCategory === category ? "bg-[#1a2e52] text-white border-[#1a2e52] transform scale-105" : "bg-white text-gray-600 border-gray-100 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {filteredExamples.length > 0 ? (
            <div className="relative group/main">
              <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0077cc] border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 -translate-x-6 hover:bg-[#0077cc] hover:text-white">
                <ChevronLeft size={24} />
              </button>
              <div ref={scrollContainerRef} className="flex gap-8 px-4 py-10 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide" style={{ perspective: "1000px" }}>
                {filteredExamples.map((example, idx) => (
                  <motion.div key={example.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="min-w-[320px] max-w-[320px] snap-center group flex flex-col items-center flex-shrink-0" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="relative w-full bg-white shadow-2xl shadow-slate-200/50 overflow-hidden group-hover:scale-[1.1] transition-transform duration-300 ease-out cursor-pointer">
                      <div className="bg-slate-100 w-full aspect-[3/4] overflow-hidden">
                        <img src={example.image} alt={example.title} className="w-full h-full object-cover object-top hover:opacity-95 transition-opacity" />
                      </div>
                      <Link to="/cover-letter" className="absolute inset-0 z-30" />
                    </div>
                    <div className="text-center mt-4 space-y-1">
                      <h3 className="text-lg font-bold text-[#1a2e52] group-hover:text-[#0077cc] transition-colors">{example.title}</h3>
                      <p className="text-xs font-medium text-gray-400">{example.level} • {example.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0077cc] border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 translate-x-6 hover:bg-[#0077cc] hover:text-white">
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-500 mb-6 animate-bounce"><Search size={32} /></div>
              <h3 className="text-2xl font-bold text-[#1a2e52] mb-3">No examples found</h3>
              <p className="text-gray-500 max-w-md mx-auto">We couldn't find any cover letters matching "{searchQuery}".</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All Examples"); }} className="mt-8 px-8 py-3 bg-[#1a2e52] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">View All Examples</button>
            </div>
          )}
        </div>
      </section>

      <motion.section initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="px-6 pb-24 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1a2e52] rounded-[3rem] p-8 md:p-20 text-center text-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500 rounded-full opacity-20 blur-[100px] translate-x-1/2 translate-y-1/2 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <PenTool size={14} className="text-orange-400" />
                <span className="text-xs font-bold tracking-widest text-white uppercase">AI-Powered Writer</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Write your Cover Letter <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">in seconds, not hours.</span></h2>
              <p className="text-lg md:text-xl text-blue-100/80 mb-12">Our AI analyzes your resume to create a perfectly tailored cover letter.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate("/cover-letter")} className="w-full sm:w-auto px-10 py-5 bg-white text-[#1a2e52] rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl"><Sparkles size={20} className="inline mr-2 text-orange-500" />Generate For Free</button>
                <button onClick={handleAccountNavigation} className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">Create Account</button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
};

export default CoverLetterExamples;