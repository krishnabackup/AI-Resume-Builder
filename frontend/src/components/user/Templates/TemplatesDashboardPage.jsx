import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Eye,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserNavBar from "../UserNavBar/UserNavBar";
import { TEMPLATES } from "./TemplateRegistry";
import axiosInstance from "../../../api/axios";

// ========== HELPER: Escape Key Listener ==========
const FullScreenEscape = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);
  return null;
};

const TemplateCard = ({ tpl, onPreview, onUse }) => {
  return (
    <div className="min-w-[280px] w-[280px] bg-white border border-slate-200 rounded-xl p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col flex-shrink-0 select-none overflow-hidden">
      {/* Aspect Ratio Container */}
      <div className="relative w-full aspect-[210/297] rounded-lg overflow-hidden group">
        {tpl.img ? (
          <img
            src={tpl.img}
            alt={tpl.name}
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No Preview
          </div>
        )}

        {/* Gradient Overlay for Text */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12 pb-3 px-3 flex flex-col justify-end pointer-events-none z-10">
          <h3
            className="text-base font-semibold text-white truncate drop-shadow-sm"
            title={tpl.name}
          >
            {tpl.name}
          </h3>
          <p className="text-xs text-slate-300 truncate drop-shadow-sm">
            {tpl.description || tpl.category}
          </p>
        </div>

        {/* Interactive Badges (Buttons) */}
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(tpl); // Passing the whole object instead of just img
            }}
            className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-white/10"
          >
            <Eye size={12} /> Preview
          </button>
        </div>
        <div className="absolute bottom-16 left-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUse(tpl.id);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Check size={12} /> Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplateSection = ({ title, items, onPreview, onUse }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320; // Card width + gap
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="relative group/section">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/section:opacity-100 transition-all duration-200 hover:bg-slate-50 hover:scale-110 disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-1 px-1 -mx-1 scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              onPreview={onPreview}
              onUse={onUse}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/section:opacity-100 transition-all duration-200 hover:bg-slate-50 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const TemplatesDashboardPage = ({
  onSelectTemplate,
  isEmbedded = false,
  externalSearchTerm,
}) => {
  const [search, setSearch] = useState("");
  const [fetchedTemplates, setFetchedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(120);
  const [previewViewportWidth, setPreviewViewportWidth] = useState(0);
  const A4_WIDTH_PX = 900;
  const previewViewportRef = useRef(null);

  useEffect(() => {
    if (!previewTemplate) return;
    const el = previewViewportRef.current;
    if (!el) return;

    const update = () => setPreviewViewportWidth(el.clientWidth || 0);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewTemplate]);

  const fitScale = useMemo(() => {
    if (previewViewportWidth < 520) return 1; // larger default on mobile
    const gutter = 0;
    const available = Math.max(0, previewViewportWidth - gutter);
    if (!available) return 1;
    return Math.min(1.6, available / A4_WIDTH_PX);
  }, [previewViewportWidth]);

  const effectiveScale = useMemo(() => {
    return (zoomLevel / 100) * fitScale;
  }, [zoomLevel, fitScale]);

  useEffect(() => {
    if (previewTemplate) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewTemplate]);

  useEffect(() => {
    if (!previewTemplate) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-")) {
        e.preventDefault();
        if (e.key === "+") setZoomLevel((z) => Math.min(200, z + 10));
        if (e.key === "-") setZoomLevel((z) => Math.max(50, z - 10));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        setZoomLevel(100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewTemplate]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const statusRes = await axiosInstance.get("/api/template-visibility");
      const statuses = statusRes.data || {};
      const activeTemplates = TEMPLATES.filter((t) => statuses[t.id] !== false);

      const mappedData = activeTemplates.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        img: item.thumbnail,
        description: item.description,
        isDynamic: true,
      }));

      setFetchedTemplates(mappedData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading templates:", err);
      const fallbackData = TEMPLATES.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        img: item.thumbnail,
        description: item.description,
        isDynamic: true,
      }));
      setFetchedTemplates(fallbackData);
      setLoading(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    const term = externalSearchTerm !== undefined ? externalSearchTerm : search;
    return fetchedTemplates.filter((t) =>
      t.name?.toLowerCase().includes(term.toLowerCase()),
    );
  }, [fetchedTemplates, search, externalSearchTerm]);

  const modern = filteredTemplates.filter((t) =>
    ["modern", "Modern", "Modern Templates"].includes(t.category),
  );
  const creative = filteredTemplates.filter((t) =>
    ["creative", "Creative", "Creative Templates"].includes(t.category),
  );
  const professional = filteredTemplates.filter((t) =>
    ["professional", "Professional", "Professional Templates"].includes(
      t.category,
    ),
  );

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setZoomLevel(100); // Reset zoom on new preview
  };

  const handleUseTemplate = (templateId) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      console.log("Selected template:", templateId);
    }
  };

  const closePreview = () => {
    setPreviewTemplate(null);
    setZoomLevel(100);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading templates...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className={`pb-20 ${isEmbedded ? "" : "min-h-screen bg-slate-50"}`}>
      {!isEmbedded && (
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <UserNavBar />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {!isEmbedded && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-6">
            <div className="flex flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64"
                />
              </div>
            </div>
          </div>
        )}

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No templates found matching your search.</p>
          </div>
        ) : (
          <div>
            {modern.length > 0 ||
            creative.length > 0 ||
            professional.length > 0 ? (
              <>
                <TemplateSection
                  title="Contemporary Templates"
                  items={modern}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                />
                <TemplateSection
                  title="Creative Templates"
                  items={creative}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                />
                <TemplateSection
                  title="Traditional Templates"
                  items={professional}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                />
              </>
            ) : (
              <TemplateSection
                title="All Templates"
                items={filteredTemplates}
                onPreview={handlePreview}
                onUse={handleUseTemplate}
              />
            )}
          </div>
        )}
      </div>

      {/* ========== NEW PREVIEW MODAL ========== */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-white flex items-center justify-center"
            onClick={closePreview}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 w-screen h-screen bg-white flex flex-col overflow-hidden z-[10001]"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 bg-white border-b border-gray-200">
                {/* LEFT SECTION */}
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 pl-8 md:px-20">
                  <div className="flex items-center gap-1.5">
                    <Eye size={16} className="text-gray-700" />
                    <span className="text-sm font-semibold text-gray-800">
                      Preview
                    </span>
                  </div>

                  <span className="hidden sm:inline text-sm font-medium text-gray-600 truncate max-w-[200px]">
                    {previewTemplate.name}
                  </span>

                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium border border-blue-200">
                    {previewTemplate.category}
                  </span>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ZoomOut size={16} />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-2">
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                        className="w-24 h-1 cursor-pointer"
                        style={{
                          accentColor: "#3b82f6",
                          background: "transparent",
                        }}
                      />
                    </div>

                    <button
                      onClick={() =>
                        setZoomLevel(Math.min(200, zoomLevel + 10))
                      }
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ZoomIn size={16} />
                    </button>

                    <span className="hidden sm:inline text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                      {zoomLevel}%
                    </span>

                    <button
                      onClick={() => setZoomLevel(100)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Reset Zoom"
                    >
                      <RotateCcw size={16} />
                    </button>

                    <div className="hidden sm:block h-5 w-px bg-gray-300 mx-2" />

                    <button
                      onClick={() => {
                        handleUseTemplate(previewTemplate.id);
                        closePreview();
                      }}
                      className="hidden sm:flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs px-4 py-1.5 rounded-lg font-medium transition-all shadow-sm"
                    >
                      <Check size={14} /> Use Template
                    </button>
                  </div>

                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-lg transition-colors ml-1"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* MAIN PREVIEW AREA */}
              <div className="flex-1 flex overflow-hidden bg-gray-50">
                <div
                  ref={previewViewportRef}
                  className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center"
                >
                  <div
                    className="relative transition-transform duration-200 ease-out flex items-center justify-center w-full pt-3 pb-6"
                    style={{
                      transform: `scale(${effectiveScale})`,
                      transformOrigin: "top center",
                      minHeight: "calc(100vh - 220px)",
                    }}
                  >
                    {previewTemplate.img ? (
                      <img
                        src={previewTemplate.img}
                        alt={previewTemplate.name}
                        className="w-auto h-auto max-w-none object-contain shadow-2xl rounded-sm border border-gray-200 bg-white"
                        style={{
                          maxHeight: "calc(100vh - 180px)",
                          maxWidth:
                            previewViewportWidth < 520
                              ? "calc(100vw - 24px)"
                              : "calc(100vw - 120px)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl flex items-center justify-center text-gray-400 border border-gray-200">
                        No Preview Available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM STATUS BAR */}
              <div className="px-3 sm:px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <div className="flex items-center gap-3">
                  <span>A4 Format</span>
                  <span className="text-gray-300">•</span>
                  <span>Ready for Export</span>
                </div>
                {/* Mobile Use Button */}
                <button
                  onClick={() => {
                    handleUseTemplate(previewTemplate.id);
                    closePreview();
                  }}
                  className="sm:hidden flex items-center gap-1 text-blue-600 font-semibold"
                >
                  <Check size={12} /> Use this template
                </button>
              </div>

              <FullScreenEscape onClose={closePreview} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesDashboardPage;
