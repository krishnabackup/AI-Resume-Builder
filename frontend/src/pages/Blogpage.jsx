import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { Loader2, Check, AlertCircle, Mail } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from "./Footer";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPosts, setExpandedPosts] = useState({});

  const togglePost = (id) => {
    setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Subscription Logic
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000); // Reset after 3s
    }, 1500);
  };

  const categories = [
    'All Articles',
    'Resume Tips',
    'Interview Prep',
    'Career Growth',
    'AI Insights',
    'Job Search'
  ];

  const blogPosts = [
    {
      id: 1,
      title: '10 Power Words That Make Your Resume Stand Out',
      excerpt: 'Transform your resume from boring to brilliant with these action-packed words that recruiters actually notice and remember.',
      detail: 'Using strong action verbs like "spearheaded," "optimized," and "orchestrated" can instantly elevate your resume. Recruiters spend an average of 7 seconds scanning a resume — make every word count by replacing generic phrases with impactful, results-driven language.',
      category: 'Resume Tips',
      date: 'Jan 2, 2026',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Mastering the Virtual Interview in 2026',
      excerpt: 'Remote interviews are here to stay. Learn the technical setup, body language, and communication strategies that impress hiring managers.',
      detail: 'Ensure your lighting is front-facing, your background is clean, and your camera is at eye level. Practice the STAR method for behavioral questions and always have a few thoughtful questions prepared for the interviewer to leave a lasting impression.',
      category: 'Interview Prep',
      date: 'Dec 28, 2025',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
      readTime: '7 min read'
    },
    {
      id: 3,
      title: 'How to Negotiate Your Salary Like a Pro',
      excerpt: 'Master the art of salary negotiation with proven strategies that help you secure the compensation you deserve without damaging relationships.',
      detail: 'Research market rates on platforms like Glassdoor and Levels.fyi before negotiations. Always negotiate the total package — including bonuses, equity, PTO, and remote flexibility — not just the base salary. Silence after stating your number is a powerful tool.',
      category: 'Career Growth',
      date: 'Dec 25, 2025',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
      readTime: '8 min read'
    },
    {
      id: 4,
      title: 'How ATS Systems Actually Read Your Resume',
      excerpt: 'Demystify applicant tracking systems and learn how to optimize your resume to pass automated screening without sacrificing readability.',
      detail: 'ATS software parses your resume into structured data fields. Use standard section headings like "Experience" and "Education," avoid tables and columns, and mirror keywords from the job description to maximize your match score.',
      category: 'AI Insights',
      date: 'Dec 20, 2025',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
      readTime: '6 min read'
    },
    {
      id: 5,
      title: 'The Hidden Job Market: Finding Unadvertised Roles',
      excerpt: 'Up to 70% of jobs are never publicly posted. Discover networking strategies and insider tactics to access these hidden opportunities.',
      detail: 'Build genuine relationships on LinkedIn by engaging with industry leaders\' content. Attend virtual meetups and reach out to hiring managers directly with a personalized message that demonstrates your value before a role is even posted.',
      category: 'Job Search',
      date: 'Dec 15, 2025',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
      readTime: '9 min read'
    },
    {
      id: 6,
      title: 'Career Transitions: Pivoting to a New Industry',
      excerpt: 'Thinking of switching careers? Learn how to position your transferable skills and craft a compelling narrative for your career change.',
      detail: 'Focus on transferable skills like leadership, communication, and problem-solving. Tailor your resume to highlight achievements that align with the target industry, and consider certifications or side projects to bridge any knowledge gaps.',
      category: 'Career Growth',
      date: 'Dec 10, 2025',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&h=400&fit=crop',
      readTime: '10 min read'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All Articles' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-enter min-h-screen select-none bg-white font-['Outfit'] text-[#1a2e52] overflow-x-hidden">
      <NavBar />

      {/* Hero Section */}
      <div className="relative px-6 pt-32 pb-20 overflow-hidden bg-white">
        {/* Brand Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="mb-6 text-6xl font-black tracking-tighter leading-tight text-[#1a2e52] md:text-7xl font-jakarta">
            Career Insights
            <span className="block text-[#0077cc]">
              & Expert Tips
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Master the art of job hunting with actionable advice from industry experts and career coaches.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-6 top-1/2" />
            <input
              type="text"
              placeholder="Search articles, guides, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-5 pr-6 text-lg transition-all bg-white border border-gray-100 shadow-2xl pl-14 rounded-2xl focus:border-[#0077cc] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 mx-auto mb-16 max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeCategory === category
                ? 'bg-[#1a2e52] text-white shadow-lg scale-105'
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:shadow-md'
                }`}

            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <div className="px-6 mx-auto mb-20 max-w-7xl">
        <div className="overflow-hidden shadow-2xl bg-gradient-to-br from-[#1a2e52] to-[#0077cc] rounded-[2.5rem]">
          <div className="grid items-center gap-8 p-10 md:grid-cols-2 md:p-16">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-xs font-black tracking-widest uppercase rounded-full bg-white/10 backdrop-blur-md">
                <Sparkles size={14} className="text-orange-400" /> Featured Article
              </div>
              <h2 className="mb-6 text-4xl font-black leading-tight tracking-tighter md:text-5xl font-jakarta">
                The Future of Resume Writing is Here
              </h2>
              <p className="mb-8 text-lg font-medium leading-relaxed text-blue-100/80">
                Discover how AI is transforming the job application process and helping candidates stand out in competitive markets.
              </p>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedPosts['featured'] ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="mb-4 text-lg font-medium leading-relaxed text-blue-100/80">
                  AI-powered resume builders are revolutionizing how job seekers create and optimize their applications. By analyzing millions of successful resumes and job postings, these tools can suggest powerful keywords, optimal formatting, and compelling content that resonates with both ATS systems and human recruiters.
                </p>
                <p className="text-lg font-medium leading-relaxed text-blue-100/80">
                  The integration of machine learning algorithms enables real-time feedback on resume strength, readability scores, and industry-specific customization. This technology democratizes access to professional resume writing expertise, giving every candidate the tools they need to compete effectively in today's digital-first hiring landscape.
                </p>
              </div>
              
              <button 
                onClick={() => togglePost('featured')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold transition-all hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1">
                {expandedPosts['featured'] ? 'Show Less' : 'Read Full Article'} 
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedPosts['featured'] ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Featured"
                className="transition-transform duration-500 transform shadow-2xl rounded-3xl hover:scale-105"
              />
              <div className="absolute px-6 py-3 font-black text-[#1a2e52] bg-white rounded-2xl shadow-xl -bottom-4 -right-4 text-sm uppercase tracking-widest">
                Must Read 🔥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="px-6 pb-20 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer rounded-[2rem] hover:shadow-2xl hover:-translate-y-2 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white text-[#0077cc] text-xs font-black uppercase tracking-widest rounded-lg shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="mb-4 text-xl font-black leading-tight text-[#1a2e52] transition-colors group-hover:text-[#0077cc] font-jakarta">
                  {post.title}
                </h3>
                
                <p className="mb-4 text-sm font-medium leading-relaxed text-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedPosts[post.id] ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed text-gray-500">
                    {post.detail}
                  </p>
                </div>
                
                <button
                  onClick={(e) => { e.stopPropagation(); togglePost(post.id); }}
                  className="inline-flex items-center gap-2 font-bold text-[#0077cc] transition-all hover:gap-3"
                >
                  {expandedPosts[post.id] ? 'Show Less' : 'Read More'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedPosts[post.id] ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-black text-[#1a2e52]">No articles found</h3>
            <p className="font-medium text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="px-6 pb-24 mx-auto max-w-7xl">
        <div className="relative pt-12 px-12 pb-20 overflow-hidden text-center bg-[#1a2e52] rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#0077cc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange-400/5 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-white font-jakarta">Stay Updated</h2>
            <p className="max-w-xl mx-auto mb-10 text-lg font-medium text-blue-100/60">
              Get the latest career tips, industry insights, and resume strategies delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto relative" noValidate>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`flex-1 flex items-center p-1.5 border rounded-xl transition-all duration-300 bg-white
                  ${status === "error" ? "border-red-200 ring-2 ring-red-500/10" : "border-gray-200 focus-within:ring-2 focus-within:ring-[#0077cc]/10 focus-within:border-[#0077cc]"}
                  ${status === "success" ? "border-green-200 bg-green-50" : ""}
                `}>
                  <div className="pl-4 text-gray-400">
                    {status === "success" ? (
                      <Check size={20} className="text-green-500" />
                    ) : status === "error" ? (
                      <AlertCircle size={20} className="text-red-500" />
                    ) : (
                      <Mail size={20} />
                    )}
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    disabled={status === "loading" || status === "success"}
                    placeholder={status === "success" ? "Subscribed!" : "Enter your email"}
                    className={`w-full px-4 py-3 bg-transparent outline-none font-medium text-sm placeholder-gray-400
                      ${status === "success" ? "text-green-700 autofill:shadow-[inset_0_0_0_1000px_#f0fdf4]" : "text-[#1a2e52] autofill:shadow-[inset_0_0_0_1000px_white]"}
                    `}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`px-8 py-4 rounded-xl font-black transition-all shadow-xl hover:shadow-2xl whitespace-nowrap flex items-center justify-center min-w-[160px]
                    ${status === "success"
                      ? "bg-green-500 text-white cursor-default scale-100"
                      : "bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white hover:scale-105 active:scale-95"}
                    ${status === "loading" ? "opacity-80 cursor-wait" : ""}
                  `}
                >
                  {status === "loading" ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : status === "success" ? (
                    <div className="flex items-center gap-2">
                      <Check size={20} />
                      <span>Subscribed!</span>
                    </div>
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="mt-2 text-red-500 font-medium animate-in fade-in slide-in-from-top-1 text-left">
                  Enter a valid email
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;