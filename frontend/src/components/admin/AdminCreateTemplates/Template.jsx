import React from "react";
import { Filter, Plus, Eye, X, Power, PowerOff, Search, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { TEMPLATES } from "../../user/Templates/TemplateRegistry";
import { templates as CV_LIST } from "../../user/CV/Templatesgallery";
import CVTemplates from "../../user/CV/Cvtemplates";
import mergeWithSampleData from "../../../utils/Datahelpers";
import axiosInstance from "../../../api/axios";
import TemplateTypeSwitch from "./TemplateTypeSwitch";

// Placeholder for CV thumbnails since they are dynamic components
const CV_PLACEHOLDER = "https://via.placeholder.com/210x297.png?text=CV+Template";

export default function AdminTemplates() {
  const [type, setType] = React.useState("resume");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");

  const [pendingTemplates, setPendingTemplates] = React.useState([]);
  const [approvedTemplates, setApprovedTemplates] = React.useState({});
  const [statuses, setStatuses] = React.useState({});

  const isTemplateActive = (id) => statuses[id] !== false;

  const refreshData = async (currentType = type) => {
    try {
      // Fetch statuses from backend (API Logic)
      const statusRes = await axiosInstance.get('/api/template-visibility');
      setStatuses(statusRes.data || {});

      // Switch Source based on Type
      const SOURCE = currentType === "resume" ? TEMPLATES : CV_LIST;

      // Filter Logic
      const modern = SOURCE.filter((t) =>
        ["modern", "Modern", "Modern Templates", "Contemporary"].includes(t.category),
      );
      const creative = SOURCE.filter((t) =>
        ["creative", "Creative", "Creative Templates"].includes(t.category),
      );
      const professional = SOURCE.filter((t) =>
        ["professional", "Professional", "Professional Templates", "Traditional", "Academic"].includes(
          t.category,
        ),
      );

      const mapToAdminFormat = (list) =>
        list.map((tpl) => ({
          _id: tpl.id,
          name: tpl.name,
          used: 0,
          previewText: tpl.description || tpl.category,
          image: tpl.thumbnail || CV_PLACEHOLDER,
          isStatic: !!tpl.thumbnail,
          templateId: tpl.id,
        }));

      setApprovedTemplates({
        "Contemporary Templates": mapToAdminFormat(modern),
        "Creative Templates": mapToAdminFormat(creative),
        "Traditional Templates": mapToAdminFormat(professional),
      });

      setPendingTemplates([]);
    } catch (err) {
      console.error("Failed to fetch templates or statuses", err);
    }
  };

  React.useEffect(() => {
    refreshData(type);
  }, [type]);

  const handleToggleStatus = async (id) => {
    try {
      // Optimistic update
      setStatuses(prev => {
        const isActive = prev[id] !== false;
        return { ...prev, [id]: !isActive };
      });

      await axiosInstance.post('/api/template-visibility/toggle', { templateId: id });

      // Optionally refetch to be sure
      // refreshData();
    } catch (error) {
      console.error("Failed to toggle status", error);
      // Revert on error
      setStatuses(prev => ({ ...prev, [id]: prev[id] !== false })); // Revert to previous (approximate)
      toast.error("Failed to update status");
      refreshData(type);
    }
  };

  const handlePreview = (tpl) => {
    setPreviewImage(tpl);
    setIsPreviewModalOpen(true);
  };

  const handleCreateClick = () => {
    alert(
      type === "resume"
        ? "Create New Resume Template feature coming soon!"
        : "Create New CV Template feature coming soon!",
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster />
      {/* 🔽 Resume / CV Switch UNDER MAIN NAVBAR */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-slate-200 px-6 py-3 flex justify-center md:justify-start">
        <TemplateTypeSwitch value={type} onChange={setType} />
      </div>

      {/* Page Content */}
      <div className="p-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {type === "resume" ? "Resume Templates" : "CV Templates"}
            </h1>
            <p className="text-sm text-slate-500">
              Manage and organize all available {type} templates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-hover:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder={`Search ${type}s...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative inline-block w-full md:w-auto">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full md:w-auto appearance-none pl-9 pr-10 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:border-blue-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>

            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95 whitespace-nowrap w-full md:w-auto"
            >
              <Plus size={16} />
              Create New {type === "resume" ? "Template" : "CV"}
            </button>
          </div>
        </div>

        {/* Pending Reviews */}
        {pendingTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-orange-600">
              Pending Reviews ({pendingTemplates.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pendingTemplates
                .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
                .map((tpl) => (
                  <div
                    key={tpl._id}
                    className="bg-orange-50 border border-orange-200 rounded-xl p-3"
                  >
                    <div className="relative w-full aspect-[210/297] bg-white rounded-lg overflow-hidden mb-3">
                      <img
                        src={tpl.image}
                        alt={tpl.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = CV_PLACEHOLDER;
                        }}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">{tpl.category}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handlePreview(tpl.imageUrl)}
                        className="flex-1 py-1.5 flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-600 rounded text-xs hover:bg-slate-50"
                      >
                        <Eye size={14} /> Preview
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <hr className="border-slate-200" />
          </div>
        )}

        {/* Sections */}
        {Object.entries(approvedTemplates).map(([section, templates]) => {
          const filtered = templates.filter(tpl => {
            const matchesSearch = tpl.name.toLowerCase().includes(search.toLowerCase());
            const active = isTemplateActive(tpl._id);
            const matchesStatus = statusFilter === "all" ||
              (statusFilter === "active" && active) ||
              (statusFilter === "inactive" && !active);
            return matchesSearch && matchesStatus;
          });

          return filtered.length > 0 && (
            <div key={section} className="space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                    {section}
                  </h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">
                    {filtered.length} Items
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((tpl, index) => {
                  const active = isTemplateActive(tpl._id);
                  return (
                    <div
                      key={index}
                      className={`bg-white border rounded-xl p-3 transition relative ${active
                        ? "border-slate-200 hover:shadow-lg"
                        : "border-slate-100 opacity-75 grayscale-[0.5]"
                        }`}
                    >
                      {/* Status Badge */}
                      <div
                        className={`absolute top-5 right-5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${active
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </div>

                      {/* Preview Container */}
                      <div
                        className="relative w-full aspect-[210/297] bg-slate-100 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => handlePreview(tpl)}
                      >
                        {type === "resume" || tpl.isStatic ? (
                          <img
                            src={tpl.image}
                            alt={tpl.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = CV_PLACEHOLDER;
                            }}
                          />
                        ) : (
                          <div
                            className="absolute inset-0 pointer-events-none bg-white origin-top-left"
                            style={{
                              transform: "scale(0.32)", // Approx scale for the preview
                              width: 794,
                            }}
                          >
                            {CVTemplates[tpl.templateId] &&
                              React.createElement(CVTemplates[tpl.templateId], { formData: mergeWithSampleData({}) })
                            }
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Eye className="text-white drop-shadow-md" size={32} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-3 space-y-1">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">
                          {tpl.name}
                        </h3>
                        <p
                          className="text-xs text-slate-500 truncate"
                          title={tpl.previewText}
                        >
                          {tpl.previewText}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                        <button
                          onClick={() =>
                            window.open(
                              type === "resume"
                                ? `/admin/resume-editor?id=${tpl._id}`
                                : `/admin/cv-editor?id=${tpl._id}`,
                              "_blank",
                            )
                          }
                          className="flex-1 py-1.5 flex items-center justify-center gap-1 bg-slate-50 text-slate-600 rounded text-xs hover:bg-slate-100 font-medium transition"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => handleToggleStatus(tpl._id)}
                          className={`flex-1 py-1.5 flex items-center justify-center gap-1 rounded text-xs font-medium transition ${active
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                        >
                          {active ? <PowerOff size={14} /> : <Power size={14} />}
                          {active ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Preview Modal */}
        {isPreviewModalOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <div
              className={`relative bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-auto animate-scaleIn ${type === "resume" || (previewImage && previewImage.isStatic) ? "max-w-4xl" : "flex justify-center bg-slate-200/60 p-6"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition z-[60]"
              >
                <X size={20} />
              </button>

              {type === "resume" || (previewImage && previewImage.isStatic) ? (
                <img
                  src={previewImage.image || previewImage}
                  alt="Template Preview"
                  className="w-full h-auto block"
                />
              ) : (
                <div className="shadow-xl bg-white rounded-sm overflow-hidden" style={{ width: 794, minHeight: 1123, flexShrink: 0 }}>
                  {previewImage && CVTemplates[previewImage.templateId] &&
                    React.createElement(CVTemplates[previewImage.templateId], { formData: mergeWithSampleData({}) })
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
