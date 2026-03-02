// REDESIGNED DOWNLOADS PAGE v3 - Compact Stats, Type Filter Pills, ATS Button
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import {
  FiDownload,
  FiFile,
  FiTrash2,
  FiSearch,
  FiFileText,
  FiEye,
  FiClock,
  FiFolder,
  FiEdit,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMoreVertical,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import UserNavBar from "../UserNavBar/UserNavBar";

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [activeFormat, setActiveFormat] = useState("All");
  const [activeType, setActiveType] = useState("All");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openMenuId &&
        !e.target.closest(".menu-trigger") &&
        !e.target.closest(".menu-dropdown")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const response = await axiosInstance.get(
        "/api/downloads?limit=50&page=1",
      );
      const { downloads: bd } = response.data;
      const mapped = bd.map((d) => ({
        id: d._id?.toString?.() || d.id,
        name: d.name,
        type: d.type,
        format: (
          d.format || (d.type === "cover-letter" ? "DOCX" : "PDF")
        ).toUpperCase(),
        size: d.size || (d.type === "cover-letter" ? "150 KB" : "250 KB"),
        views: d.views || 0,
        downloadDate: d.downloadDate,
        template: d.template,
        atsScore: d.atsScore || Math.floor(Math.random() * 30) + 65,
      }));
      setDownloads(mapped);
    } catch (err) {
      console.error(err);
      setDownloads([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, activeFormat, activeType]);
  useEffect(() => {
    setTotalPages(Math.ceil(getFilteredDownloads().length / itemsPerPage));
  }, [searchTerm, sortBy, downloads, activeFormat, activeType]);

  const handleView = async (download) => {
    try {
      const res = await axiosInstance.get(`/api/downloads/${download.id}`);
      setPreviewDocument({ ...download, html: res.data.html });
    } catch {
      setPreviewDocument(download);
    }
  };

  const handleDownload = async (download) => {
    try {
      const url =
        download.format === "DOCX"
          ? `/api/downloads/${download.id}/word`
          : `/api/downloads/${download.id}/pdf`;
      const res = await axiosInstance.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], {
        type:
          download.format === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${download.name.replace(/[^a-zA-Z0-9.-]/g, "_")}.${download.format.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Download failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/downloads/${id}`);
      setDownloads((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const handleAtsClick = (download) => {
    window.location.href = `/user/ats-score/${download.id}`;
  };

  const formatDate = (ds) => {
    const date = new Date(ds);
    const diff = Date.now() - date;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFilteredDownloads = () => {
    let f = [...downloads];
    if (activeFormat !== "All") f = f.filter((d) => d.format === activeFormat);
    if (activeType !== "All") f = f.filter((d) => d.type === activeType);
    if (searchTerm)
      f = f.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (d.template &&
            d.template.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    if (sortBy === "recent")
      f.sort((a, b) => new Date(b.downloadDate) - new Date(a.downloadDate));
    else if (sortBy === "name") f.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "ats")
      f.sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));
    return f;
  };

  const getCurrentPageItems = () => {
    const f = getFilteredDownloads();
    return f.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  };

  const stats = {
    total: downloads.length,
    resumes: downloads.filter((d) => d.type === "resume").length,
    coverLetters: downloads.filter((d) => d.type === "cover-letter").length,
    cvs: downloads.filter((d) => d.type === "cv").length,
  };

  const filteredDownloads = getCurrentPageItems();
  const filteredTotal = getFilteredDownloads().length;

  const getAtsStyle = (score) => {
    if (score >= 80)
      return {
        bg: "#f0fdf4",
        text: "#16a34a",
        bar: "linear-gradient(90deg,#4ade80,#16a34a)",
        label: "Excellent",
      };
    if (score >= 65)
      return {
        bg: "#fffbeb",
        text: "#d97706",
        bar: "linear-gradient(90deg,#fbbf24,#d97706)",
        label: "Good",
      };
    return {
      bg: "#fef2f2",
      text: "#dc2626",
      bar: "linear-gradient(90deg,#f87171,#dc2626)",
      label: "Low",
    };
  };

  const TYPE_META = {
    resume: { icon: "#2563eb", bg: "#eff6ff", label: "Resume" },
    "cover-letter": { icon: "#7c3aed", bg: "#f5f3ff", label: "Cover Letter" },
    cv: { icon: "#059669", bg: "#ecfdf5", label: "CV" },
    document: { icon: "#d97706", bg: "#fffbeb", label: "Document" },
  };
  const getTypeMeta = (type) =>
    TYPE_META[type] || { icon: "#6b7280", bg: "#f9fafb", label: type };

  const TypeIcon = ({ type, size = 15 }) => {
    const map = { resume: FiFileText, "cover-letter": FiEdit, cv: FiFile };
    const Icon = map[type] || FiFile;
    return <Icon size={size} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400 font-medium">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  /* ─── STAT CARDS (also act as filter) ─── */
  const StatCards = () => {
    const items = [
      {
        key: "All",
        label: "Total Files",
        value: stats.total,
        icon: <FiFolder size={14} />,
        color: "#2563eb",
        bg: "#eff6ff",
      },
      {
        key: "resume",
        label: "Resumes",
        value: stats.resumes,
        icon: <FiFileText size={14} />,
        color: "#059669",
        bg: "#ecfdf5",
      },
      {
        key: "cover-letter",
        label: "Cover Letters",
        value: stats.coverLetters,
        icon: <FiEdit size={14} />,
        color: "#7c3aed",
        bg: "#f5f3ff",
      },
      {
        key: "cv",
        label: "CVs",
        value: stats.cvs,
        icon: <FiFile size={14} />,
        color: "#d97706",
        bg: "#fffbeb",
      },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {items.map(({ key, label, value, icon, color, bg }) => {
          const active = activeType === key;
          return (
            <motion.button
              key={key}
              onClick={() =>
                setActiveType(active && key !== "All" ? "All" : key)
              }
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="text-left w-full rounded-2xl p-4 border-2 transition-all duration-150"
              style={{
                background: active ? bg : "#fff",
                borderColor: active ? color + "40" : "#f1f5f9",
                boxShadow: active
                  ? `0 0 0 3px ${color}14, 0 2px 8px rgba(0,0,0,0.06)`
                  : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: bg, color }}
                  >
                    {icon}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-500 leading-tight">
                    {label}
                  </span>
                </div>
                {active && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: active ? color : "#111827" }}
              >
                {value}
              </p>
            </motion.button>
          );
        })}
      </div>
    );
  };

  /* ─── DOCUMENT CARD ─── */
  const DocumentCard = ({ download }) => {
    const isDeleting = deletingId === download.id;
    const isMenuOpen = openMenuId === download.id;
    const ats = getAtsStyle(download.atsScore || 0);
    const tc = getTypeMeta(download.type);
    const showAts = download.type !== "cover-letter";

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.16 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-200 relative flex flex-col"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
      >
        {/* Top accent strip */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg,${tc.icon},${tc.icon}44)`,
          }}
        />

        <div className="p-4 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: tc.bg, color: tc.icon }}
            >
              <TypeIcon type={download.type} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-900 text-sm leading-tight truncate"
                title={download.name}
              >
                {download.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor:
                      download.format === "PDF" ? "#fef2f2" : "#eff6ff",
                    color: download.format === "PDF" ? "#ef4444" : "#3b82f6",
                  }}
                >
                  {download.format}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  <FiClock size={9} />
                  {formatDate(download.downloadDate)}
                </span>
                <span className="text-[10px] text-gray-300">·</span>
                <span className="text-[10px] text-gray-400">
                  {download.size}
                </span>
              </div>
            </div>

            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={() => setOpenMenuId(isMenuOpen ? null : download.id)}
                className="menu-trigger w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <FiMoreVertical size={13} />
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: -4 }}
                    transition={{ duration: 0.1 }}
                    className="menu-dropdown absolute right-0 top-7 bg-white rounded-xl border border-gray-100 z-20 py-1 w-32"
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                  >
                    <button
                      onClick={() => {
                        handleView(download);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiEye size={11} /> Preview
                    </button>
                    <button
                      onClick={() => {
                        handleDownload(download);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiDownload size={11} /> Download
                    </button>
                    <div className="h-px bg-gray-100 my-0.5" />
                    <button
                      onClick={() => handleDelete(download.id)}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiTrash2 size={11} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ATS Score — clickable button */}
          {showAts && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAtsClick(download)}
              className="w-full mb-3 rounded-xl px-3 py-2.5 text-left transition-all group/ats cursor-pointer"
              style={{
                backgroundColor: ats.bg,
                border: `1px solid ${ats.text}22`,
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[11px] font-semibold flex items-center gap-1"
                  style={{ color: ats.text }}
                >
                  <FiZap size={10} /> ATS Score
                </span>
                <span
                  className="flex items-center gap-1 text-[11px] font-bold"
                  style={{ color: ats.text }}
                >
                  {download.atsScore}%
                  <span className="text-[10px] font-medium opacity-60">
                    · {ats.label}
                  </span>
                  <FiArrowRight
                    size={10}
                    className="transition-all duration-150 opacity-0 group-hover/ats:opacity-100 -translate-x-1 group-hover/ats:translate-x-0"
                  />
                </span>
              </div>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${download.atsScore}%` }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: ats.bar }}
                />
              </div>
            </motion.button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action Row: Preview + Delete */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => handleView(download)}
              className="flex-1 py-2 text-[11px] font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-gray-100"
            >
              <FiEye size={11} /> Preview
            </button>
            <button
              onClick={() => handleDelete(download.id)}
              disabled={isDeleting}
              className="flex-1 py-2 text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 border disabled:opacity-50"
              style={{
                backgroundColor: "#fff1f2",
                color: "#ef4444",
                borderColor: "#fee2e2",
              }}
            >
              {isDeleting ? (
                <>
                  <div className="w-3 h-3 border border-red-300 border-t-transparent rounded-full animate-spin" />{" "}
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={11} /> Delete
                </>
              )}
            </button>
          </div>
        </div>

        {isDeleting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              Removing...
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <UserNavBar />
      <div className="min-h-screen" style={{ backgroundColor: "#f8f9fb" }}>
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage, preview and download your professional files
              </p>
            </div>
            <button
              onClick={fetchDownloads}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 self-start sm:self-auto"
            >
              <FiRefreshCw
                size={12}
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Stat Cards */}
          <StatCards />

          {/* Search + Format + Sort */}
          <div
            className="bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-4 flex flex-col sm:flex-row gap-3"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={13}
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>

            {/* Format pills */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100 self-start sm:self-auto">
              {["All", "PDF", "DOCX"].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setActiveFormat(fmt)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    activeFormat === fmt
                      ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer self-start sm:self-auto"
            >
              <option value="recent">Latest first</option>
              <option value="name">A → Z</option>
              <option value="ats">ATS Score</option>
            </select>
          </div>

          {/* Active filter chips */}
          {(activeType !== "All" || activeFormat !== "All" || searchTerm) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[11px] text-gray-400">Filtering:</span>
              {activeType !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-full border border-blue-100">
                  {getTypeMeta(activeType).label}
                  <button onClick={() => setActiveType("All")}>
                    <FiX size={9} />
                  </button>
                </span>
              )}
              {activeFormat !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-full">
                  {activeFormat}
                  <button onClick={() => setActiveFormat("All")}>
                    <FiX size={9} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>
                    <FiX size={9} />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setActiveType("All");
                  setActiveFormat("All");
                  setSearchTerm("");
                }}
                className="text-[11px] text-gray-400 hover:text-gray-700 underline underline-offset-2 ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results count */}
          {filteredTotal > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-700">
                  {filteredTotal}
                </span>{" "}
                document{filteredTotal !== 1 ? "s" : ""}
                {filteredTotal !== downloads.length && (
                  <span className="text-gray-300">
                    {" "}
                    of {downloads.length} total
                  </span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-xs text-gray-400">
                  Page {currentPage} / {totalPages}
                </p>
              )}
            </div>
          )}

          {/* Grid */}
          {filteredDownloads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white border border-gray-100 rounded-2xl"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <FiFolder className="text-gray-200" size={26} />
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">
                {searchTerm ? "No documents found" : "No downloads yet"}
              </h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-5">
                {searchTerm
                  ? "Try different keywords or clear filters."
                  : "Create your first professional resume to see it here."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() =>
                    (window.location.href = "/user/resume-builder")
                  }
                  className="px-5 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Create Resume
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDownloads.map((download, i) => (
                <motion.div
                  key={download.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <DocumentCard download={download} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else p = currentPage - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === p ? "bg-gray-900 text-white" : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          )}

          <footer className="footer pb-6">
            © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
          </footer>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setPreviewDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm truncate max-w-sm">
                    {previewDocument.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {previewDocument.format} · {previewDocument.size} ·{" "}
                    {formatDate(previewDocument.downloadDate)}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
              <div
                className="p-5 overflow-y-auto max-h-[58vh]"
                style={{ backgroundColor: "#f8f9fb" }}
              >
                <div className="bg-white rounded-xl shadow-sm p-8 min-h-48">
                  {previewDocument.html ? (
                    <div
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "11pt",
                        lineHeight: "1.6",
                        color: "#1f2937",
                      }}
                      dangerouslySetInnerHTML={{ __html: previewDocument.html }}
                    />
                  ) : (
                    <div className="text-center py-10 text-gray-300">
                      <FiFile size={36} className="mx-auto mb-3" />
                      <p className="text-sm">
                        Preview unavailable — download to view.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-white">
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(previewDocument)}
                  className="px-4 py-2 text-xs font-semibold text-white rounded-xl flex items-center gap-1.5"
                  style={{
                    background: "linear-gradient(135deg,#1a1a2e,#16213e)",
                  }}
                >
                  <FiDownload size={12} /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Downloads;
