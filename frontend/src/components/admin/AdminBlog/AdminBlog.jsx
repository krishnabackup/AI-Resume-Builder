import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Calendar,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axiosInstance from "../../../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    detail: "",
    category: "",
    date: "",
    image: "",
    readTime: "",
    isPublished: true,
  });

  // Fetch blogs with React Query
  const {
    data: blogs = [],
    isLoading,
    isError,
    error: apiError
  } = useQuery({
    queryKey: ['adminBlogs'],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/blog?includeUnpublished=true");
      return response.data?.data || [];
    },
    staleTime: 300000, // 5 minutes
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingId) {
        return axiosInstance.put(`/api/blog/${editingId}`, data);
      } else {
        return axiosInstance.post("/api/blog", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
      setShowForm(false);
      resetForm();
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to save blog");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosInstance.delete(`/api/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  });

  const categories = useMemo(() => [
    "All Articles",
    ...Array.from(new Set(blogs.map((post) => post.category).filter(Boolean))),
  ], [blogs]);

  const togglePost = (id) => {
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesCategory =
        activeCategory === "All Articles" || post.category === activeCategory;

      const title = post.title?.toLowerCase() || "";
      const excerpt = post.excerpt?.toLowerCase() || "";
      const search = searchQuery.toLowerCase();

      const matchesSearch = title.includes(search) || excerpt.includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      detail: "",
      category: "",
      date: "",
      image: "",
      readTime: "",
      isPublished: true,
    });
    setEditingId(null);
    setError("");
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (post) => {
    setEditingId(post._id || post.id);
    setFormData({
      title: post.title || "",
      excerpt: post.excerpt || "",
      detail: post.detail || "",
      category: post.category || "",
      date: post.date || "",
      image: post.image || "",
      readTime: post.readTime || "",
      isPublished:
        typeof post.isPublished === "boolean" ? post.isPublished : true,
    });
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#1a2e52] px-4 sm:px-6 lg:px-8 py-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <h1 className="text-2xl sm:text-3xl font-black">
          Blog Management
        </h1>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-fit"
        >
          <Plus size={16} /> Add Blog
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 text-red-600 px-4 py-3 font-semibold">
          {error}
        </div>
      )}

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-[130] bg-black/25 p-4 sm:p-6 flex items-center justify-center"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-700">
                  {editingId ? "Edit Blog" : "Add New Blog"}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-lg border px-3 py-1 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  required
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Date"
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="Read Time"
                  className="border rounded-xl px-4 py-3 text-sm"
                />

                <input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                  required
                  className="border rounded-xl px-4 py-3 text-sm md:col-span-2"
                />

                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Excerpt"
                  rows={3}
                  required
                  className="border rounded-xl px-4 py-3 text-sm md:col-span-2"
                />

                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleChange}
                  placeholder="Detail"
                  rows={5}
                  required
                  className="border rounded-xl px-4 py-3 text-sm md:col-span-2"
                />

              </div>

              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                />
                Published
              </label>

              <div className="mt-6 flex gap-3">

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#1a2e52] text-white px-5 py-2 rounded-lg text-sm"
                >
                  {isSaving ? "Saving..." : editingId ? "Update Blog" : "Create Blog"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-slate-100 px-5 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>

              </div>

            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH */}
      <div className="relative w-full sm:max-w-md mb-8">

        <Search className="absolute w-5 h-5 text-gray-400 left-4 top-3.5" />

        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-xl"
        />

      </div>

      {/* CATEGORY */}
      <div className="flex flex-wrap gap-3 mb-10">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm ${
              activeCategory === category
                ? "bg-[#1a2e52] text-white"
                : "bg-white border text-gray-500"
            }`}
          >
            {category}
          </button>
        ))}

      </div>

      {/* BLOG GRID */}

      {isLoading ? (
        <div className="text-center mt-12 text-gray-500 font-semibold">
          Loading blogs...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <div
              key={post._id || post.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 overflow-hidden flex flex-col"
            >
              <div className="relative h-48">
                <img
                  src={post.image || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
                  {post.category}
                </span>
                {!post.isPublished && (
                   <span className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
                    Draft
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Calendar size={14} />
                  <span>{post.date || 'No date'}</span>
                  <span>•</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                  <button
                    onClick={() => togglePost(post._id || post.id)}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 text-xs transition-colors"
                  >
                    {expandedPosts[post._id || post.id] ? "Show Less" : "Read Content"}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${expandedPosts[post._id || post.id] ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Post"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id || post.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedPosts[post._id || post.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-slate-50 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {post.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          No blogs created yet.
        </div>
      )}

    </div>
  );
}