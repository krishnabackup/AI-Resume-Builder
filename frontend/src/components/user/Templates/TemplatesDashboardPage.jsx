import { useMemo, useState, useEffect, useRef } from 'react';
import { Search, Filter, Eye, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import UserNavBar from '../UserNavBar/UserNavBar';
import { TEMPLATES } from './TemplateRegistry';
import axiosInstance from "../../../api/axios";

const TemplateCard = ({ tpl, onPreview, onUse }) => {
  // ... (unchanged)
  return (
    <div
      className="min-w-[280px] w-[280px] bg-white border border-slate-200 rounded-xl p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col flex-shrink-0 select-none overflow-hidden"
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full aspect-[210/297] rounded-lg overflow-hidden group">
        {tpl.img ? (
          <img src={tpl.img} alt={tpl.name} className="w-full h-full object-contain pointer-events-none" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">No Preview</div>
        )}

        {/* Gradient Overlay for Text */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12 pb-3 px-3 flex flex-col justify-end pointer-events-none z-10">
          <h3 className="text-base font-semibold text-white truncate drop-shadow-sm" title={tpl.name}>
            {tpl.name}
          </h3>
          <p className="text-xs text-slate-300 truncate drop-shadow-sm">{tpl.description || tpl.category}</p>
        </div>

        {/* Interactive Badges (Buttons) */}
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(tpl.img);
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
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>

      <div className="relative group/section">
        {/* Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/section:opacity-100 transition-all duration-200 hover:bg-slate-50 hover:scale-110 disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-1 px-1 -mx-1 scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} onPreview={onPreview} onUse={onUse} />
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/section:opacity-100 transition-all duration-200 hover:bg-slate-50 hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const TemplatesDashboardPage = ({ onSelectTemplate, isEmbedded = false, externalSearchTerm }) => {
  const [search, setSearch] = useState('');
  const [fetchedTemplates, setFetchedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isPreviewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewModalOpen]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // Fetch statuses from backend
      const statusRes = await axiosInstance.get('/api/template-visibility');
      const statuses = statusRes.data || {};

      // Filter out inactive templates
      const activeTemplates = TEMPLATES.filter(t => statuses[t.id] !== false);

      // Map registry templates to dashboard format
      const mappedData = activeTemplates.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        img: item.thumbnail,
        description: item.description,
        isDynamic: true
      }));

      setFetchedTemplates(mappedData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading templates:", err);
      // Fallback to showing everything or empty, showing empty is safer if network fails or show cached
      // For now, let's show all if visibility check fails
      const fallbackData = TEMPLATES.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        img: item.thumbnail,
        description: item.description,
        isDynamic: true
      }));
      setFetchedTemplates(fallbackData);
      setLoading(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    const term = externalSearchTerm !== undefined ? externalSearchTerm : search;
    return fetchedTemplates.filter(t =>
      t.name?.toLowerCase().includes(term.toLowerCase())
    );
  }, [fetchedTemplates, search, externalSearchTerm]);

  // Grouping
  const modern = filteredTemplates.filter(t => ['modern', 'Modern', 'Modern Templates'].includes(t.category));
  const creative = filteredTemplates.filter(t => ['creative', 'Creative', 'Creative Templates'].includes(t.category));
  const professional = filteredTemplates.filter(t => ['professional', 'Professional', 'Professional Templates'].includes(t.category));

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsPreviewModalOpen(true);
  };

  const handleUseTemplate = (templateId) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      console.log("Selected template:", templateId);
      // Fallback navigation could go here
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading templates...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className={`pb-20 ${isEmbedded ? "" : "min-h-screen bg-slate-50"}`}>
      {/* Navbar Placeholder */}
      {!isEmbedded && (
        <div className='sticky top-0 z-40 bg-white shadow-sm'>
          <UserNavBar />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">

        {/* Header Section */}
        {!isEmbedded && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-6">
            <div className="flex flex-row items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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

        {/* Content */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>No templates found matching your search.</p>
          </div>
        ) : (
          <div>
            {(modern.length > 0 || creative.length > 0 || professional.length > 0) ? (
              <>
                <TemplateSection title="Contemporary Templates" items={modern} onPreview={handlePreview} onUse={handleUseTemplate} />
                <TemplateSection title="Creative Templates" items={creative} onPreview={handlePreview} onUse={handleUseTemplate} />
                <TemplateSection title="Traditional Templates" items={professional} onPreview={handlePreview} onUse={handleUseTemplate} />
              </>
            ) : (
              <TemplateSection title="All Templates" items={filteredTemplates} onPreview={handlePreview} onUse={handleUseTemplate} />
            )}
          </div>
        )}
      </div>

      {/* Full Image Preview Modal */}
      {isPreviewModalOpen && (
        <div key="preview-modal" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setIsPreviewModalOpen(false)}>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl animate-scaleIn">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesDashboardPage;
