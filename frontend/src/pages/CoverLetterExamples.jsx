import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ChevronRight, PenTool, ChevronLeft } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from "./Footer";
import { Link, useNavigate } from 'react-router-dom';
import HeroImage from '../assets/HeroImage.png';
import id1 from '../assets/id1.webp';
import id2 from '../assets/id2.jpg';
import id3 from '../assets/id3.jpg';
import id4 from '../assets/id4.jpg';
import id5 from '../assets/id5.jpg';
import id6 from '../assets/id6.jpg';
import id7 from '../assets/id7.jpg';
import id8 from '../assets/id8.jpg';
import id9 from '../assets/id9.jpg';

const CoverLetterExamples = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Examples');
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef(null);

    const categories = [
        'All Examples',
        'Technology',
        'Marketing',
        'Creative',
        'Healthcare',
        'Education',
        'Business'
    ];

    const examples = [
        {
            id: 1,
            title: 'Software Engineer',
            category: 'Technology',
            level: 'Mid-Senior Level',
            color: 'blue',
            image: id1
        },
        {
            id: 2,
            title: 'Marketing Manager',
            category: 'Marketing',
            level: 'Senior Level',
            color: 'orange',
            image: id2
        },
        {
            id: 3,
            title: 'Graphic Designer',
            category: 'Creative',
            level: 'Entry-Mid Level',
            color: 'purple',
            image: id3
        },
        {
            id: 4,
            title: 'Product Manager',
            category: 'Business',
            level: 'Senior Level',
            color: 'indigo',
            image: id4
        },
        {
            id: 5,
            title: 'Registered Nurse',
            category: 'Healthcare',
            level: 'Entry-Mid Level',
            color: 'teal',
            image: id5
        },
        {
            id: 6,
            title: 'Elementary Teacher',
            category: 'Education',
            level: 'Entry Level',
            color: 'yellow',
            image: id6
        },
        {
            id: 7,
            title: 'Sales Representative',
            category: 'Business',
            level: 'Mid Level',
            color: 'cyan',
            image: id7
        },
        {
            id: 8,
            title: 'Data Analyst',
            category: 'Technology',
            level: 'Entry-Mid Level',
            color: 'blue',
            image: id8
        },
        {
            id: 9,
            title: 'Executive Assistant',
            category: 'Business',
            level: 'Mid-Senior Level',
            color: 'indigo',
            image: id9
        }
    ];

    const filteredExamples = examples.filter(example => {
        const matchesCategory = activeCategory === 'All Examples' || example.category === activeCategory;
        const matchesSearch =
            example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            example.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

// Horizontal scroll function for the examples carousel
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const cardWidth = 320 + 32; // card width + gap
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (scrollContainerRef.current) {
                const cardWidth = 320 + 32;
                const maxScroll =
                    scrollContainerRef.current.scrollWidth -
                    scrollContainerRef.current.clientWidth;
                const currentScroll = scrollContainerRef.current.scrollLeft;

                if (currentScroll >= maxScroll) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainerRef.current.scrollBy({
                        left: cardWidth,
                        behavior: 'smooth',
                    });
                }
            }
        }, 3000);

        return () => clearInterval(scrollInterval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-['Outfit'] selection:bg-blue-100">
            <NavBar />

            {/* ✅ HERO SECTION (Updated to match screenshot) */}
            <section className="relative pt-20 pb-20 px-12 pr-16 overflow-hidden bg-white mt-12">
                {/* subtle background */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent rounded-bl-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-orange-50/50 to-transparent rounded-tr-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* 2-column layout */}
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* LEFT: text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-8 rounded-full bg-white border border-blue-100 shadow-sm transition-transform hover:scale-105 cursor-default">
                                <Sparkles size={16} className="text-[#0077cc] animate-pulse" />
                                <span className="text-xs font-bold tracking-widest text-[#1a2e52] uppercase">
                                    Recruiter Approved Examples
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-[#1a2e52] mb-6 tracking-tight font-jakarta leading-[1.1]">
                                Professional Cover Letter <br />
                                <span className="bg-gradient-to-r from-[#0077cc] to-[#3b82f6] bg-clip-text text-transparent">
                                    Examples & Templates
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                                Don't start from scratch. Browse our library of cover letter examples tailored for every industry and career level.
                            </p>


                        </div>

                        {/* RIGHT: image (Animated) */}
                        <div className="flex justify-center lg:justify-end hidden sm:flex">
                            <div className="relative w-full max-w-[450px] float-slow">

                                    {/* Inner Frame */}
                                        <img
                                            src={HeroImage}
                                            alt="Cover Letter Hero"
                                            className="w-full h-auto object-contain rounded-[1.6rem]"
                                            draggable={false}
                                        />

                    

                                {/* Decorative sparkle */}
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shadow-sm animate-pulse">
                                    <span className="text-orange-500 text-lg leading-none">✦</span>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </section>

            {/* Search Bar */}
            <section className="px-6 pt-10 pb-14">

                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        {/* Glow background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-35 transition-opacity duration-300"></div>

                        {/* Input container */}
                        <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 ring-1 ring-gray-100 focus-within:ring-blue-300">
                            <Search className="ml-5 text-gray-400 w-6 h-6 flex-shrink-0" />

                            <input
                                type="text"
                                placeholder="Search by job title (e.g., 'Software Engineer')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-5 py-4 bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder-gray-400"
                            />

                            <button className="bg-[#1a2e52] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            {/* Categories */}
            <section className="px-6 mb-12 bg-slate-50 relative z-20 -mt-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border shadow-sm ${activeCategory === category
                                    ? 'bg-[#1a2e52] text-white border-[#1a2e52] shadow-blue-200 transform scale-105'
                                    : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Examples Grid */}
            <section className="px-6 pb-24 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    {filteredExamples.length > 0 ? (
                        <div className="relative group/main">
                            {/* Scroll Buttons */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0077cc] border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 -translate-x-6 hover:bg-[#0077cc] hover:text-white"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div
                                ref={scrollContainerRef}
                                className="flex gap-8 px-4 py-10 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
                                style={{ perspective: '1000px' }}
                            >
                                {filteredExamples.map((example, idx) => {
                                    return (
                                        <div
                                            key={example.id}
                                            className="min-w-[320px] max-w-[320px] snap-center group flex flex-col items-center bg-transparent relative flex-shrink-0"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            {/* Image Container with Shadow & Hover Effect */}
                                            <div className="relative w-full bg-white shadow-2xl shadow-slate-200/50 overflow-hidden group-hover:scale-[1.1] transition-transform duration-300 ease-out cursor-pointer">
                                                {/* Image */}
                                                <div className="bg-slate-100 w-full aspect-[3/4] overflow-hidden">
                                                    <img
                                                        src={example.image}
                                                        alt={`${example.title} Template`}
                                                        className="w-full h-full object-cover object-top hover:opacity-95 transition-opacity"
                                                    />
                                                </div>

                                                <Link to="/cover-letter" className="absolute inset-0 z-30" />
                                            </div>

                                            {/* Text Info Below */}
                                            <div className="text-center mt-4 space-y-1">
                                                <h3 className="text-lg font-bold text-[#1a2e52] group-hover:text-[#0077cc] transition-colors">
                                                    {example.title}
                                                </h3>
                                                <p className="text-xs font-medium text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                                                    {example.level} • {example.category}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-[#0077cc] border border-gray-100 opacity-0 group-hover/main:opacity-100 transition-opacity duration-300 translate-x-6 hover:bg-[#0077cc] hover:text-white"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-500 mb-6 animate-bounce">
                                <Search size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1a2e52] mb-3">No examples found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                We couldn't find any cover letters matching "{searchQuery}". Try searching for a different job title.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('All Examples'); }}
                                className="mt-8 px-8 py-3 bg-[#1a2e52] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
                            >
                                View All Examples
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 pb-24 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-[#1a2e52] rounded-[3rem] p-8 md:p-20 text-center text-white relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full opacity-20 blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover:opacity-30 transition-opacity duration-700" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500 rounded-full opacity-20 blur-[100px] translate-x-1/2 translate-y-1/2 group-hover:opacity-30 transition-opacity duration-700" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                <PenTool size={14} className="text-orange-400" />
                                <span className="text-xs font-bold tracking-widest text-white uppercase">AI-Powered Writer</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">
                                Write your Cover Letter <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">in seconds, not hours.</span>
                            </h2>

                            <p className="text-lg md:text-xl text-blue-100/80 mb-12 leading-relaxed">
                                Our AI analyzes your resume and the job description to create a perfectly tailored cover letter that highlights your unique value proposition.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/cover-letter')}
                                    className="w-full sm:w-auto px-10 py-5 bg-white text-[#1a2e52] rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl hover:shadow-white/20 flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={20} className="text-orange-500" />
                                    Generate For Free
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all flex items-center justify-center gap-2"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CoverLetterExamples;
