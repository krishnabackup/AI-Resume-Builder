import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Loader2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../api/axios";
import NavBar from "../../components/NavBar";
import Footer from "./Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const BlogDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(location.state?.blog || null);
  const [loading, setLoading] = useState(!blog);
  const [error, setError] = useState("");
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // If blog data is passed via state, use it
    if (location.state?.blog) {
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get(`/api/blog/${id}`);
        const blogData = response.data?.data || response.data;
        setBlog(blogData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog details");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, location.state]);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!blog?.category) return;

      try {
        const response = await axiosInstance.get("/api/blog");
        const allPosts = response.data?.data || [];
        const related = allPosts
          .filter((post) => post.category === blog.category && post._id !== id)
          .slice(0, 3);
        setRelatedPosts(related);
      } catch (err) {
        console.error("Error fetching related posts:", err);
      }
    };

    fetchRelatedPosts();
  }, [blog?.category, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Outfit']">
        <NavBar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2
              size={48}
              className="animate-spin text-[#0077cc] mx-auto mb-4"
            />
            <p className="text-gray-500 text-lg font-medium">
              Loading blog details...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white font-['Outfit']">
        <NavBar />
        <div className="px-6 mx-auto max-w-7xl py-32">
          <div className="rounded-xl bg-red-50 text-red-600 px-6 py-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-black mb-2">Blog Not Found</h2>
            <p className="text-lg font-medium mb-6">
              {error || "This blog could not be found"}
            </p>
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
            >
              <ArrowLeft size={20} />
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Outfit'] text-[#1a2e52] overflow-x-hidden">
      <NavBar />

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-6 pt-8 mx-auto max-w-5xl"
      >
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 px-4 py-2 font-bold text-[#0077cc] transition-all hover:gap-3 group"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Blogs
        </button>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="px-6 py-12 mx-auto max-w-5xl"
      >
        {/* Featured Image */}
        <div className="mb-10 overflow-hidden rounded-3xl shadow-2xl">
          <img
            src={
              blog.image ||
              "https://via.placeholder.com/1200x600?text=Blog+Image"
            }
            alt={blog.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Header Info */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-[#0077cc] text-white text-sm font-black uppercase rounded-lg">
              {blog.category || "Uncategorized"}
            </span>
            <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
              <Calendar size={16} />
              <span>{blog.date || new Date().toLocaleDateString()}</span>
            </div>
            {blog.readTime && (
              <div className="text-gray-500 font-medium text-sm">
                {blog.readTime}
              </div>
            )}
          </div>

          <h1 className="mb-4 text-5xl font-black leading-tight tracking-tighter text-[#1a2e52] md:text-6xl font-jakarta">
            {blog.title}
          </h1>

          <p className="mb-6 text-xl font-medium text-gray-600 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Share Button */}
          <button
            onClick={() => {
              const text = `Check out: ${blog.title}`;
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({ title: blog.title, url });
              } else {
                navigator.clipboard.writeText(`${text}\n${url}`);
                alert("Link copied to clipboard!");
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-[#0077cc] font-bold transition-all hover:gap-3 group"
          >
            <Share2
              size={18}
              className="transition-transform group-hover:scale-110"
            />
            Share Article
          </button>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 mx-auto max-w-3xl pb-16"
      >
        <div className="prose prose-lg max-w-none">
          {blog.detail ? (
            <div className="text-lg font-medium leading-relaxed text-gray-700 whitespace-pre-wrap">
              {blog.detail}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 px-6 py-8 text-center text-gray-500">
              <p>No detailed content available for this blog.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="px-6 py-20 bg-gray-50"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-4xl font-black tracking-tighter text-[#1a2e52] font-jakarta">
              Related Articles
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <motion.article
                  key={post._id}
                  whileHover={{ y: -8 }}
                  onClick={() =>
                    navigate(`/blog/${post._id}`, { state: { blog: post } })
                  }
                  className="overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm rounded-2xl transition-all hover:shadow-xl group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        post.image ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-black text-[#0077cc] bg-blue-50 rounded-lg uppercase">
                      {post.category}
                    </span>
                    <h3 className="mb-3 text-lg font-black leading-tight text-[#1a2e52] transition-colors group-hover:text-[#0077cc] line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="px-6 py-16 mx-auto max-w-5xl"
      >
        <div className="relative p-12 text-center bg-gradient-to-br from-[#1a2e52] to-[#0077cc] rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-orange-400/5 blur-3xl"></div>

          <div className="relative z-10">
            <h3 className="mb-4 text-3xl font-black text-white font-jakarta">
              Ready to Transform Your Resume?
            </h3>
            <p className="max-w-2xl mx-auto mb-8 text-lg font-medium text-blue-100">
              Use our AI-powered resume builder to create a standout resume that
              gets results.
            </p>
            <button
              onClick={() => navigate("/builder")}
              className="px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Start Building Now
            </button>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
