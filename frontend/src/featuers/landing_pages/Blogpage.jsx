import { useEffect, useState } from 'react';
import { Search, ChevronDown, Calendar, Sparkles, Loader2, Check, AlertCircle, Mail } from 'lucide-react';
import NavBar from '../../components/NavBar';
import Footer from "./Footer";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};
const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [blogsError, setBlogsError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoadingBlogs(true);
        setBlogsError("");
        const response = await axiosInstance.get("/api/blog");
        setBlogPosts(response.data?.data || []);
      } catch (error) {
        setBlogsError(error.response?.data?.message || "Failed to load blogs");
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  const togglePost = (id) => {
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
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
    "All Articles",
    ...Array.from(new Set(blogPosts.map((post) => post.category).filter(Boolean))),
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All Articles" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-enter min-h-screen select-none bg-white font-['Outfit'] text-[#1a2e52] overflow-x-hidden">
      <NavBar />

      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative px-6 pt-24 sm:pt-28 md:pt-32 pb-20 overflow-hidden bg-white"
      >
        {/* Brand Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="mb-6 text-6xl font-black tracking-tighter leading-tight text-[#1a2e52] md:text-7xl font-jakarta">
            Career Insights
            <span className="block text-[#0077cc]">& Expert Tips</span>
          </h1>
          <p className="max-w-2xl mx-auto mb-10 text-xl font-medium text-gray-500">
            Master the art of job hunting with actionable advice from industry
            experts and career coaches.
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
      </motion.div>

      {/* Category Pills */}
      <div className="px-6 mx-auto mb-16 max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#1a2e52] text-white shadow-lg scale-105"
                  : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 mx-auto mb-20 max-w-7xl"
      >
        <div className="overflow-hidden shadow-2xl bg-gradient-to-br from-[#1a2e52] to-[#0077cc] rounded-[2.5rem]">
          <div className="grid items-center gap-8 p-10 md:grid-cols-2 md:p-16">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 text-xs font-black tracking-widest uppercase rounded-full bg-white/10 backdrop-blur-md">
                <Sparkles size={14} className="text-orange-400" /> Featured
                Article
              </div>
              <h2 className="mb-6 text-4xl font-black leading-tight tracking-tighter md:text-5xl font-jakarta">
                The Future of Resume Writing is Here
              </h2>
              <p className="mb-8 text-lg font-medium leading-relaxed text-blue-100/80">
                Discover how AI is transforming the job application process and
                helping candidates stand out in competitive markets.
              </p>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedPosts["featured"]
                    ? "max-h-96 opacity-100 mb-8"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="mb-4 text-lg font-medium leading-relaxed text-blue-100/80">
                  AI-powered resume builders are revolutionizing how job seekers
                  create and optimize their applications. By analyzing millions
                  of successful resumes and job postings, these tools can
                  suggest powerful keywords, optimal formatting, and compelling
                  content that resonates with both ATS systems and human
                  recruiters.
                </p>
                <p className="text-lg font-medium leading-relaxed text-blue-100/80">
                  The integration of machine learning algorithms enables
                  real-time feedback on resume strength, readability scores, and
                  industry-specific customization. This technology democratizes
                  access to professional resume writing expertise, giving every
                  candidate the tools they need to compete effectively in
                  today's digital-first hiring landscape.
                </p>
              </div>

              <button
                onClick={() => togglePost("featured")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold transition-all hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1"
              >
                {expandedPosts["featured"] ? "Show Less" : "Read Full Article"}
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${expandedPosts["featured"] ? "rotate-180" : ""}`}
                />
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
      </motion.div>

      {/* Blog Grid */}
      <div className="px-6 pb-20 mx-auto max-w-7xl">
        {blogsError && (
          <div className="mb-8 rounded-xl bg-red-50 text-red-600 px-4 py-3 font-semibold text-center">
            {blogsError}
          </div>
        )}

        {isLoadingBlogs ? (
          <div className="py-20 text-center font-semibold text-gray-500">Loading blogs...</div>
        ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id || post._id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer rounded-[2rem] hover:shadow-2xl hover:-translate-y-2 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image || "https://via.placeholder.com/600x400?text=No+Image"}
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
                    expandedPosts[post.id]
                      ? "max-h-40 opacity-100 mb-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed text-gray-500">
                    {post.detail}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePost(post.id || post._id);
                  }}
                  className="inline-flex items-center gap-2 font-bold text-[#0077cc] transition-all hover:gap-3"
                >
                  {expandedPosts[post.id || post._id] ? "Show Less" : "Read More"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${expandedPosts[post.id || post._id] ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
        )}

        {!isLoadingBlogs && filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-2xl font-black text-[#1a2e52]">
              No articles found
            </h3>
            <p className="font-medium text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 pb-24 mx-auto max-w-7xl"
      >
        <div className="relative pt-12 px-12 pb-20 overflow-hidden text-center bg-[#1a2e52] rounded-[2.5rem]">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#0077cc]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange-400/5 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-white font-jakarta">
              Stay Updated
            </h2>
            <p className="max-w-xl mx-auto mb-10 text-lg font-medium text-blue-100/60">
              Get the latest career tips, industry insights, and resume
              strategies delivered to your inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="max-w-lg mx-auto relative"
              noValidate
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={`flex-1 flex items-center p-1.5 border rounded-xl transition-all duration-300 bg-white
                  ${status === "error" ? "border-red-200 ring-2 ring-red-500/10" : "border-gray-200 focus-within:ring-2 focus-within:ring-[#0077cc]/10 focus-within:border-[#0077cc]"}
                  ${status === "success" ? "border-green-200 bg-green-50" : ""}
                `}
                >
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
                    placeholder={
                      status === "success" ? "Subscribed!" : "Enter your email"
                    }
                    className={`w-full px-4 py-3 bg-transparent outline-none font-medium text-sm placeholder-gray-400
                      ${status === "success" ? "text-green-700 autofill:shadow-[inset_0_0_0_1000px_#f0fdf4]" : "text-[#1a2e52] autofill:shadow-[inset_0_0_0_1000px_white]"}
                    `}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={`px-8 py-4 rounded-xl font-black transition-all shadow-xl hover:shadow-2xl whitespace-nowrap flex items-center justify-center min-w-[160px]
                    ${
                      status === "success"
                        ? "bg-green-500 text-white cursor-default scale-100"
                        : "bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white hover:scale-105 active:scale-95"
                    }
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
      </motion.div>
      <Footer />
    </div>
  );
};

export default BlogPage;


