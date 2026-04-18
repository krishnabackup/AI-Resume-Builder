import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from "react";
import {
  Check, Eye, X,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Search, Sparkles
} from "lucide-react";
import { createPortal } from "react-dom";
import CoverLetterTemplatesMap from "./CoverLetterTemplatesMap";
import axiosInstance from "../../../api/axios";
import { COVER_LETTER_TEMPLATES } from "./CoverLetterRegistry";

/* ─── constants ─────────────────────────────────────────────────────────── */
const CATEGORIES = Object.freeze(['All Examples', 'Professional', 'Modern', 'Creative', 'Minimal', 'Elegant']);

/* ----------------------------- Card ----------------------------- */
const TemplateCard = memo(({ template, isSelected, displayData, onPreview, onUse }) => {
  const TemplateComponent = CoverLetterTemplatesMap[template.id];

  const handlePreviewClick = useCallback((e) => {
    e.stopPropagation();
    onPreview(template);
  }, [onPreview, template]);

  const handleUseClick = useCallback((e) => {
    e.stopPropagation();
    onUse(template.id);
  }, [onUse, template.id]);

  return (
    <div className="min-w-[280px] w-[280px] bg-white border border-slate-200 rounded-xl p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col flex-shrink-0 select-none overflow-hidden group">
      <div className="relative w-full aspect-[210/297] rounded-lg overflow-hidden bg-white">
        {/* Live Template Preview */}
        <div
          className="absolute inset-0 pointer-events-none origin-top-left"
          style={{ transform: "scale(0.35)", width: "794px", height: "1123px" }}
        >
          {TemplateComponent && <TemplateComponent formData={displayData} />}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>

        <div className="absolute bottom-0 left-0 right-0 pt-12 pb-3 px-3 flex flex-col justify-end pointer-events-none z-20">
          <h3 className="text-base font-semibold text-white truncate drop-shadow-md">{template.name}</h3>
          <p className="text-xs text-slate-200 truncate drop-shadow-sm">{template.category}</p>
        </div>

        {/* Preview Button (Top Right) */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={handlePreviewClick}
            className="bg-black/50 hover:bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-white/10"
          >
            <Eye size={12} /> Preview
          </button>
        </div>

        {/* Use Template Button (Bottom) */}
        <div className="absolute bottom-16 left-2 z-10">
          <button
            onClick={handleUseClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full font-medium flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          >
            <Check size={12} /> Use Template
          </button>
        </div>

        {/* Active Badge */}
        {isSelected && (
          <div className="absolute top-2 left-2 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Check size={12} /> Active
          </div>
        )}
      </div>
    </div>
  );
});
TemplateCard.displayName = "TemplateCard";

/* ------------------------ Preview Modal Component ------------------------ */
const PreviewModalComponent = memo(({ template, zoomLevel, displayData, onZoomChange, onClose, onUse }) => {
  const modalContentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const TemplateComponent = CoverLetterTemplatesMap[template.id];

  const handleZoomIn = useCallback((e) => { 
    e?.stopPropagation(); 
    onZoomChange(Math.min(200, zoomLevel + 10)); 
  }, [onZoomChange, zoomLevel]);

  const handleZoomOut = useCallback((e) => { 
    e?.stopPropagation(); 
    onZoomChange(Math.max(50, zoomLevel - 10)); 
  }, [onZoomChange, zoomLevel]);

  const handleZoomChange = useCallback((e) => {
    e?.stopPropagation();
    onZoomChange(Math.max(50, Math.min(200, Number(e.target.value))));
  }, [onZoomChange]);

  const handleBackdropClick = useCallback((e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) onClose();
  }, [onClose]);

  const toggleExpand = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleUseFromModal = useCallback((e) => {
    e.stopPropagation();
    onUse(template.id);
    onClose();
  }, [onUse, template.id, onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const resetZoom = useCallback(() => onZoomChange(100), [onZoomChange]);

  return (
    <div
      className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-sm flex flex-col"
      onClick={handleBackdropClick}
      style={{ isolation: 'isolate' }}
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0 z-10 font-jakarta">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 text-slate-700">
            <Eye size={18} />
            <span className="text-sm font-semibold text-gray-800">Template Preview</span>
          </div>
          <span className="text-gray-600 hidden sm:inline font-medium truncate max-w-[200px]">
            {template.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleExpand}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={isExpanded ? "Collapse View" : "Full View"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {!isExpanded && (
            <>
              <button onClick={handleZoomOut} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ZoomOut size={16} />
              </button>
              <div className="hidden sm:flex items-center gap-2 px-2">
                <input 
                  type="range" 
                  min="50" 
                  max="200" 
                  value={zoomLevel} 
                  onChange={handleZoomChange} 
                  className="w-24 h-1 cursor-pointer accent-blue-500" 
                />
              </div>
              <button onClick={handleZoomIn} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <ZoomIn size={16} />
              </button>
              <span className="hidden sm:inline text-sm text-slate-600 font-medium bg-gray-100 px-2 py-1 w-14 text-center rounded">{zoomLevel}%</span>
            </>
          )}

          <button
            onClick={handleUseFromModal}
            className="flex px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition items-center gap-2 shadow-sm"
          >
            <Check size={14} /> Use Template
          </button>

          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className={`flex-1 overflow-auto bg-slate-100 flex justify-center ${isExpanded ? 'p-0' : 'p-8 pb-32'}`}>
        <div
          ref={modalContentRef}
          className={`bg-white shadow-2xl transition-all duration-300 ${isExpanded ? 'w-full' : ''}`}
          style={isExpanded ? {} : {
            width: "794px",
            height: "1123px",
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {TemplateComponent && <TemplateComponent formData={displayData} />}
        </div>
      </div>

      {/* Bottom Status Bar */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-slate-200 bg-white/90 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="font-medium bg-slate-100 px-3 py-1 rounded-lg">A4 Layout</span>
            <span className="text-slate-300">•</span>
            <span>Refined Design System</span>
          </div>
          <button onClick={resetZoom} className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 hover:bg-blue-50 rounded-xl transition">Reset View</button>
        </div>
      )}
    </div>
  );
});
PreviewModalComponent.displayName = "PreviewModalComponent";

/* ─────────────────────────────────────────────────────────
   HELPERS: decode the JWT to get the current user's ID
───────────────────────────────────────────────────────── */
const getLoggedInUserId = () => {
  try {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.userId || payload._id || null;
  } catch {
    return null;
  }
};

const CoverLetterTemplates = ({ selectedTemplate, onSelectTemplate, formData: propFormData }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Examples");
  const [displayData, setDisplayData] = useState({});
  const [mounted, setMounted] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStatuses = async () => {
      try {
        const res = await axiosInstance.get('/api/template-visibility');
        if (isMounted) setStatuses(res.data || {});
      } catch (error) {
        console.error("Failed to fetch template statuses", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStatuses();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setMounted(true);
    // Use prop formData if it has keys, otherwise fallback to localStorage
    if (propFormData && Object.values(propFormData).some(val => val !== "" && val != null)) {
      setDisplayData(propFormData);
    } else {
      // Fetch data for previews based on current logged in user
      const userId = getLoggedInUserId();
      if (userId) {
        const saved = localStorage.getItem(`coverLetterFormData_${userId}`);
        if (saved) {
          try {
            setDisplayData(JSON.parse(saved));
          } catch (e) {
            console.error("Error parsing cover letter data", e);
          }
        }
      }
    }
  }, [propFormData]);

  useEffect(() => {
    document.body.style.overflow = previewTemplate ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [previewTemplate]);

  const filteredTemplates = useMemo(() => {
    return COVER_LETTER_TEMPLATES.filter(tpl => {
      // 1. Filter by visibility status from admin (default active: true)
      if (statuses[tpl.id] === false) return false;

      // 2. Filter by category
      const matchesCategory = activeCategory === 'All Examples' || tpl.category === activeCategory;
      const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, statuses]);

  const handleUseTemplate = useCallback((templateId) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    }
  }, [onSelectTemplate]);

  const handlePreview = useCallback((tpl) => {
    setPreviewTemplate(tpl);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewTemplate(null);
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] font-jakarta pb-20">
      <div className="max-w-7xl mx-auto px-6 mt-12 pb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all border shadow-sm tracking-widest uppercase ${activeCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-xl shadow-slate-200'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-4 border-l-8 border-blue-600 pl-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 leading-none">
                {activeCategory === 'All Examples' ? 'All Templates' : activeCategory}
              </h2>
              <p className="text-slate-400 text-sm mt-2 font-bold italic">Showing {filteredTemplates.length} premium designs</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Rendering Enabled</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200 shadow-sm mx-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-8 border border-slate-100 animate-pulse">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Refining your choices...</h3>
              <p className="text-slate-400 font-medium italic">Loading premium templates</p>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-12">
              {filteredTemplates.map(tpl => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  displayData={displayData}
                  isSelected={selectedTemplate === tpl.id}
                  onPreview={handlePreview}
                  onUse={handleUseTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200 shadow-sm mx-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-8 border border-slate-100">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No matching templates</h3>
              <p className="text-slate-400 font-medium">Try another category or clear your search query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {mounted && previewTemplate && createPortal(
        <PreviewModalComponent
          template={previewTemplate}
          displayData={displayData}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onClose={handleClosePreview}
          onUse={handleUseTemplate}
        />,
        document.body
      )}
    </div>
  );
};

export default memo(CoverLetterTemplates);

