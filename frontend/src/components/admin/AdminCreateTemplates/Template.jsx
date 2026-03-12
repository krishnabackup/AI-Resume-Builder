import React from "react";
import { Filter, Plus, Eye, X, Power, PowerOff, Search, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { TEMPLATES } from "../../user/Templates/TemplateRegistry";
import { templates as CV_LIST } from "../../user/CV/Templatesgallery";
import CVTemplates from "../../user/CV/Cvtemplates";
import mergeWithSampleData from "../../../utils/Datahelpers";
import axiosInstance from "../../../api/axios";
import TemplateTypeSwitch from "./TemplateTypeSwitch";

const CV_PLACEHOLDER = "https://via.placeholder.com/210x297.png?text=CV+Template";
const CV_CANVAS_WIDTH = 794;

export default function AdminTemplates() {

  const [type, setType] = React.useState("resume");
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [cvPreviewViewportWidth, setCvPreviewViewportWidth] = React.useState(0);
  const cvPreviewViewportRef = React.useRef(null);

  React.useEffect(() => {
    if (isPreviewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewModalOpen]);

  React.useEffect(() => {
    if (!isPreviewModalOpen || type !== "cv") return;

    const viewportEl = cvPreviewViewportRef.current;
    if (!viewportEl) return;

    const updateViewportWidth = () => {
      setCvPreviewViewportWidth(viewportEl.clientWidth || 0);
    };

    updateViewportWidth();

    const resizeObserver = new ResizeObserver(updateViewportWidth);
    resizeObserver.observe(viewportEl);

    return () => resizeObserver.disconnect();
  }, [isPreviewModalOpen, type]);

  const [pendingTemplates, setPendingTemplates] = React.useState([]);
  const [approvedTemplates, setApprovedTemplates] = React.useState({});
  const [statuses, setStatuses] = React.useState({});

  const isTemplateActive = (id) => statuses[id] !== false;

  const refreshData = async (currentType = type) => {
    try {

      const statusRes = await axiosInstance.get('/api/template-visibility');
      setStatuses(statusRes.data || {});

      const SOURCE = currentType === "resume" ? TEMPLATES : CV_LIST;

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

      setStatuses(prev => {
        const isActive = prev[id] !== false;
        return { ...prev, [id]: !isActive };
      });

      await axiosInstance.post('/api/template-visibility/toggle', { templateId: id });

    } catch (error) {

      console.error("Failed to toggle status", error);

      setStatuses(prev => ({ ...prev, [id]: prev[id] !== false }));
      toast.error("Failed to update status");

      refreshData(type);
    }
  };

  const handlePreview = (tpl) => {
    setPreviewImage(tpl);
    setIsPreviewModalOpen(true);
  };

  const PreviewComponent =
    type === "cv" && previewImage?.templateId
      ? CVTemplates?.[previewImage.templateId]
      : null;

  const cvPreviewScale = React.useMemo(() => {
    if (type !== "cv" || !cvPreviewViewportWidth) return 1;

    const availableWidth = Math.max(0, cvPreviewViewportWidth - 16);
    if (!availableWidth) return 1;

    return Math.min(1, availableWidth / CV_CANVAS_WIDTH);
  }, [type, cvPreviewViewportWidth]);

  const handleCreateClick = () => {
    alert(
      type === "resume"
        ? "Create New Resume Template feature coming soon!"
        : "Create New CV Template feature coming soon!"
    );
  };

  return (

    <div className="bg-slate-50 min-h-screen">

      <Toaster />

      <div className="sticky top-[64px] z-40 bg-white border-b border-slate-200 px-6 py-3 flex justify-center md:justify-start">
        <TemplateTypeSwitch value={type} onChange={setType} />
      </div>

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

            {/* Search */}
            <div className="relative group w-full md:w-64">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

              <input
                type="text"
                placeholder={`Search ${type}s...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative inline-block w-full md:w-auto">

              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="pl-9 pr-10 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              
            </div>

            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} />
              Create New {type === "resume" ? "Template" : "CV"}
            </button>

          </div>
        </div>


        {/* Template Sections */}
        {Object.entries(approvedTemplates).map(([section, templates]) => {

          const filtered = templates.filter(tpl => {

            const term = search.toLowerCase();

const matchesSearch =
  tpl.name?.toLowerCase().includes(term) ||
  tpl.previewText?.toLowerCase().includes(term) ||
  section.toLowerCase().includes(term);
            const active = isTemplateActive(tpl._id);

            const matchesStatus =
              statusFilter === "all" ||
              (statusFilter === "active" && active) ||
              (statusFilter === "inactive" && !active);

            return matchesSearch && matchesStatus;
          });

          return filtered.length > 0 && (

            <div key={section} className="space-y-4">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-bold text-slate-800">
                  {section}
                </h2>

                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {filtered.length}
                </span>

              </div>


              <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 hide-scrollbar">

                {filtered.map((tpl, index) => {

                  const active = isTemplateActive(tpl._id);

                  return (

                    <div
                      key={index}
                      className={`min-w-[280px] w-[280px] md:w-auto md:min-w-0 flex-shrink-0 bg-white border border-slate-200 rounded-xl p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative ${!active ? "opacity-70 grayscale" : ""}`}
                    >

                      <div
                        className="relative w-full aspect-[210/297] rounded-lg overflow-hidden group cursor-pointer"
                        onClick={() => handlePreview(tpl)}
                      >

                        {type === "resume" ? (

                          <img
                            src={tpl.image}
                            alt={tpl.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = CV_PLACEHOLDER;
                            }}
                          />

                        ) : (

                          <div
                            className="absolute inset-0 pointer-events-none bg-white origin-top-left"
                            style={{ transform: "scale(0.32)", width: 794 }}
                          >

                            {CVTemplates?.[tpl.templateId] &&
                              React.createElement(CVTemplates[tpl.templateId], {
                                formData: mergeWithSampleData({})
                              })}

                          </div>

                        )}

                      </div>


                      <div className="mt-2 text-sm font-semibold text-slate-800 truncate">
                        {tpl.name}
                      </div>

                      <div className="text-xs text-slate-500 truncate">
                        {tpl.previewText}
                      </div>


                      <div className="flex gap-2 mt-3 pt-2 border-t">

                        <button
                          onClick={() => handlePreview(tpl)}
                          className="flex-1 py-1 text-xs bg-slate-50 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleToggleStatus(tpl._id)}
                          className="flex-1 py-1 text-xs bg-slate-100 rounded"
                        >
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
            className="fixed inset-0 z-[220] bg-black/80 p-4 sm:p-6"
            onClick={() => setIsPreviewModalOpen(false)}
          >

            <div
              className="relative mx-auto flex h-full max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 pr-14 sm:px-6">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {previewImage?.name || "Template Preview"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {type === "resume" ? "Resume" : "CV"} template preview
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="absolute right-3 top-3 z-20 rounded-full bg-black/50 p-2 text-white"
              >
                <X size={20} />
              </button>

              <div className="flex-1 overflow-auto bg-slate-100 p-4 sm:p-6">
                {type === "resume" ? (
                  <div className="mx-auto flex w-full max-w-4xl justify-center">
                    <img
                      src={previewImage.image || previewImage}
                      alt={previewImage?.name || "Template Preview"}
                      className="h-auto max-w-full rounded-md bg-white shadow-lg"
                    />
                  </div>
                ) : PreviewComponent ? (
                  <div ref={cvPreviewViewportRef} className="mx-auto w-full overflow-auto">
                    <div
                      className="mx-auto origin-top bg-white shadow-lg"
                      style={{ width: CV_CANVAS_WIDTH, zoom: cvPreviewScale }}
                    >
                      <PreviewComponent formData={mergeWithSampleData({})} />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-slate-500">
                    Preview is not available for this template.
                  </div>
                )}
              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}