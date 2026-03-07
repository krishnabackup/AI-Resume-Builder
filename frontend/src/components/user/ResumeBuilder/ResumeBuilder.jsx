import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  FolderKanban,
  GraduationCap,
  User,
  Zap,
  Search,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";

import FormTabs from "./FormTabs";

import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ProjectsForm from "./forms/ProjectsForm";
import CertificationsForm from "./forms/CertificationsForm";

import LivePreview from "../Preview/LivePreview";
import TemplatesPage from "../Templates/TemplatesDashboardPage";
import { TEMPLATES } from "../Templates/TemplateRegistry";

import { getCompletionStatus } from "./completion";
import { dummyData } from "./dummyData";

import UserNavbar from "../UserNavBar/UserNavBar";
import CVBuilderTopBar from "../CV/Cvbuildernavbar";

/* ─────────────────────────────────────────────────────────
   FLOATING FORM PANEL (mirrors CVBuilder behavior)
   Anchors to its container's DOM position so the panel
   stays pinned beneath the sticky navbar while scrolling.
───────────────────────────────────────────────────────── */
const FloatingFormPanel = ({ children, topOffset, containerRef }) => {
  const panelRef = useRef(null);
  const rafRef = useRef(null);
  const currentY = useRef(0);
  const targetY = useRef(0);

  // spring animation loop
  useEffect(() => {
    const STIFFNESS = 0.12;
    const tick = () => {
      currentY.current += (targetY.current - currentY.current) * STIFFNESS;
      if (panelRef.current) {
        panelRef.current.style.transform = `translateY(${currentY.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // update target on scroll — anchor to container's top in the DOM
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef?.current) {
        targetY.current = Math.max(0, window.scrollY - topOffset);
        return;
      }
      const containerTop =
        containerRef.current.getBoundingClientRect().top + window.scrollY;
      const desired = window.scrollY + topOffset - containerTop;
      targetY.current = Math.max(0, desired);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [topOffset, containerRef]);

  return (
    <div
      ref={panelRef}
      style={{
        willChange: "transform",
        height: `calc(100vh - ${topOffset}px)`,
      }}
      className="flex flex-col"
    >
      {children}
    </div>
  );
};

const ResumeBuilder = ({ setActivePage = () => {} }) => {
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const formContainerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(64);
  /* -------------------- CORE STATE -------------------- */
  // const [formData, setFormData] = useState(dummyData);
  const [formData, setFormData] = useState(() => {
    try {
      const data = localStorage.getItem("resumeFormData");
      return data ? JSON.parse(data) : dummyData;
    } catch {
      return dummyData;
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("resumeFormData", JSON.stringify(formData));
    }, 400);
    return () => clearTimeout(timeout);
  }, [formData]);

  const navigate = useNavigate();
  const [templates, setTemplates] = useState(TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const storedTemplate = localStorage.getItem("currentTemplate");
    return storedTemplate
      ? JSON.parse(storedTemplate)
      : TEMPLATES[0]?.id || "jessica-claire";
  });
  useEffect(() => {
    localStorage.setItem("currentTemplate", JSON.stringify(selectedTemplate));
  }, [selectedTemplate]);
  const [templateSearch, setTemplateSearch] = useState("");

  const [activeTab, setActiveTab] = useState("builder");
  const [activeSection, setActiveSection] = useState("personal");
  const [isAiMode, setIsAiMode] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  /*-----------To make the upload input functional-------------*/

  const input_file = useRef(null);
  const handleButtonClick = () => {
    input_file.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    console.log(file);
  };

  /* -------------------- PREVIEW STATE -------------------- */
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isPreviewHidden, setIsPreviewHidden] = useState(false);

  /* -------------------- HELPERS -------------------- */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUseSummary = (text) => {
    setFormData((prev) => ({ ...prev, summary: text }));
  };

  const handleSelectTemplate = (id) => {
    setSelectedTemplate(id);
    setActiveTab("builder");
  };

  const currentTemplate = templates?.find((t) => t.id === selectedTemplate);

  // ============== Completed Status ===========
  const [completion, setcompletion] = useState({});
  useEffect(() => {
    const statusInfo = getCompletionStatus(formData);
    setcompletion(statusInfo);
  }, [formData]);

  /* ------------Input Validation ------------- */
  const [warning, setWarning] = useState(false);
  const isInputValid = (label) => {
    return completion?.missingSections?.includes(label);
  };

  /*------------------- PREVIOUS & NEXT BUTTON ------------*/
  // PDF Generation
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  /* ======================================================
   SAVE ACTIVITY WHEN BUILDER OPENS
====================================================== */
useEffect(() => {
  const saveVisit = async () => {
    const html = await previewRef.current?.getResumeHTML();
    if (!html) return;

    await saveRecentActivity(html, "visited");
  };

  const timer = setTimeout(saveVisit, 2000);
  return () => clearTimeout(timer);
}, []);

/* ======================================================
   SAVE ACTIVITY WHEN USER EDITS RESUME
====================================================== */
useEffect(() => {
  const saveEditActivity = async () => {
    const html = await previewRef.current?.getResumeHTML();
    if (!html) return;

    await saveRecentActivity(html, "preview");
  };

  const timer = setTimeout(saveEditActivity, 1500);

  return () => clearTimeout(timer);
}, [formData]);

  /* Measure sticky navbar height for float offset (same as CV) */
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [activeTab]);

  /* Lock body scroll when mobile preview sheet is open (mobile only) */
  useEffect(() => {
    document.body.style.overflow = showMobilePreview ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobilePreview]);

  const GenerateResumePDF = async (resumeHtml) => {
    try {
      setLoading(true);
      console.log("Resume html:", resumeHtml);

      const response = await axiosInstance.post(
        "/api/resume/generate-pdf",
        { html: resumeHtml },
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      console.log(url);

      const link = document.createElement("a");
      link.href = url;
      const sanitize = (s) =>
        (s || "")
          .replace(/[^a-z0-9_\- ]/gi, "")
          .trim()
          .replace(/\s+/g, "_");
      const fileName =
        sanitize(documentTitle) || sanitize(formData.fullName) || "Resume";
      link.download = `${fileName}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate resume PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e) => {
    if (exporting) return;
    const html = await previewRef.current?.getResumeHTML();
    if (!html) return;
    try {
      setExporting(true);
      await GenerateResumePDF(html);
      // Save to downloads page
      await saveDownloadRecord(html, "PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadWord = async () => {
    const html = await previewRef.current?.getResumeHTML();
    if (!html) return;
    const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Resume</title></head><body>${html}</body></html>`;
    const blob = new Blob(["\uFEFF", wordHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const sanitize = (s) =>
      (s || "")
        .replace(/[^a-z0-9_\- ]/gi, "")
        .trim()
        .replace(/\s+/g, "_");
    const fileName =
      sanitize(documentTitle) || sanitize(formData.fullName) || "Resume";
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Save to downloads page
    await saveDownloadRecord(html, "DOCX");
  };

  /* ======================================================
     SAVE RESUME DOWNLOAD RECORD
  ====================================================== */
  const saveDownloadRecord = async (html, format = "PDF") => {
    try {
      const sanitize = (s) =>
        (s || "")
          .replace(/[^a-z0-9_\- ]/gi, "")
          .trim()
          .replace(/\s+/g, "_");
      const nameToUse = sanitize(documentTitle) || sanitize(formData.fullName) || "Document";
      
      await axiosInstance.post("/api/downloads", {
        name: `Resume - ${nameToUse}`,
        type: "resume",
        format,
        html,
        template: selectedTemplate,
        size: format === "PDF" ? "250 KB" : "200 KB",
      });
    } catch (err) {
      console.error("Failed to save resume download:", err);
    }
  };

  /* ======================================================
   SAVE RECENT ACTIVITY (VISITED / PREVIEW / DOWNLOAD)
====================================================== */
const saveRecentActivity = async (html, action = "visited") => {
  try {
    const sanitize = (s) =>
      (s || "")
        .replace(/[^a-z0-9_\- ]/gi, "")
        .trim()
        .replace(/\s+/g, "_");

    const nameToUse =
      sanitize(documentTitle) || sanitize(formData.fullName) || "Document";

    await axiosInstance.post("/api/downloads", {
      name: `Resume - ${nameToUse}`,
      type: "resume",
      action, // visited | preview | download
      format: "PDF",
      html,
      template: selectedTemplate,
      size: "250 KB",
    });
  } catch (err) {
    console.error("Failed to save activity:", err);
  }
};
  

  /*------------------- PREVIOUS & NEXT BUTTON ------------*/
  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "certs", label: "Certifications", icon: Award },
    { id: "skills", label: "Skills", icon: Zap },
  ];
  const currentIdx = tabs.findIndex((tab) => tab.id === activeSection);

  /* Auto-scroll form container to top on section change (like CV) */
  useEffect(() => {
    formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const goLeft = () => {
    if (currentIdx > 0) {
      setActiveSection(tabs[currentIdx - 1].id);
      setWarning(false);
    }
  };

  const goRight = () => {
    if (currentIdx < tabs.length - 1) {
      setActiveSection(tabs[currentIdx + 1].id);
    }
  };

  /* -------------------- FORM RENDER -------------------- */
  const renderFormContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            onUseSummary={handleUseSummary}
          />
        );
      case "work":
        return <ExperienceForm formData={formData} setFormData={setFormData} />;
      case "education":
        return <EducationForm formData={formData} setFormData={setFormData} />;
      case "skills":
        return <SkillsForm formData={formData} setFormData={setFormData} />;
      case "projects":
        return <ProjectsForm formData={formData} setFormData={setFormData} />;
      case "certs":
        return (
          <CertificationsForm formData={formData} setFormData={setFormData} />
        );
      default:
        return null;
    }
  };

  /* -------------------- MAIN CONTENT -------------------- */
  const renderMainContent = () => {
    if (activeTab === "templates") {
      return (
        <TemplatesPage
          onSelectTemplate={handleSelectTemplate}
          isEmbedded={true}
          externalSearchTerm={templateSearch}
        />
      );
    }

    // BUILDER TAB – mirror CV layout with floating form + desktop preview
    return (
      <>
        <div className="flex gap-5 px-4 pb-20 pt-4 items-start">
          {/* Desktop floating form panel */}
          {!isPreviewExpanded && (
            <div
              ref={leftColRef}
              className="flex-shrink-0 hidden lg:block"
              style={{ width: 480 }}
            >
              <FloatingFormPanel
                topOffset={headerHeight}
                containerRef={leftColRef}
              >
                <div
                  className="bg-white rounded-2xl flex flex-col overflow-hidden"
                  style={{
                    height: "100%",
                    boxShadow:
                      "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Tabs + step info */}
                  <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 bg-white rounded-t-2xl">
                    <FormTabs
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                      showPreview={showMobilePreview}
                      onTogglePreview={() =>
                        setShowMobilePreview((v) => !v)
                      }
                    />
                  </div>

                  {/* Scrollable form content */}
                  <div
                    ref={formContainerRef}
                    className="flex-1 overflow-y-auto p-4"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#e2e8f0 transparent",
                    }}
                  >
                    {/* Alert Banner */}
                    <div
                      className={`flex items-center w-full gap-3 p-4 border rounded-lg mb-4 ${completion?.isComplete ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"} md:text-base text-sm md:flex-row flex-col select-none`}
                    >
                      {!completion.isComplete && (
                        <>
                          <AlertTriangle
                            className="text-amber-800 md:block hidden"
                            size={30}
                          />
                          <div className="flex flex-col md:w-auto w-full">
                            <div className="block font-medium text-amber-800 mb-0.5 md:text-sm text-xs">
                              Complete Your Resume
                            </div>
                            <p className="text-yellow-700 m-0 md:text-md text-xs">
                              Add the following information to enable export
                              functionality:
                            </p>
                          </div>
                          <div className="w-full flex flex-wrap gap-2 justify-start md:justify-end">
                            {!completion?.isComplete &&
                              completion?.missingSections?.map(
                                (missing, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-md font-medium bg-amber-100 text-amber-800 text-xs"
                                  >
                                    {missing}
                                  </span>
                                ),
                              )}
                          </div>
                        </>
                      )}
                      {completion.isComplete && (
                        <>
                          <CheckCircle
                            className="text-emerald-500 md:block hidden"
                            size={20}
                          />
                          <div className="flex flex-col md:w-auto w-full">
                            <strong className="block text-left mb-0.5 text-emerald-500 md:text-xs text-sm">
                              Resume Ready
                            </strong>
                            <p className="text-emerald-500 m-0 md:text-md text-xs">
                              Your resume is ready to export.
                            </p>
                          </div>
                          <div className="flex gap-2 ml-auto flex-wrap">
                            <span className="px-2.5 py-1 rounded-md font-medium bg-emerald-100 text-emerald-800 md:text-md text-xs">
                              Resume is Ready
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Validation warning */}
                    {warning && (
                      <div className="text-sm text-red-700 bg-yellow-100 border border-yellow-300 px-4 py-2 mb-3 rounded-lg">
                        Please fill in all required fields to continue.
                      </div>
                    )}

                    {renderFormContent()}

                    {/* Previous & Next */}
                    <div className="w-full flex items-center justify-between mt-8">
                      <button
                        onClick={goLeft}
                        disabled={currentIdx === 0}
                        className="flex gap-1 items-center text-sm bg-slate-100 px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <ArrowLeft size={18} />
                        <span>Previous</span>
                      </button>
                      <button
                        onClick={() => {
                          if (isInputValid(tabs[currentIdx]?.label)) {
                            setWarning(true);
                            formContainerRef.current?.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                            return;
                          }
                          setWarning(false);
                          goRight();
                        }}
                        disabled={currentIdx === tabs.length - 1}
                        className="flex gap-1 items-center text-sm bg-black text-white px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        <span>Next</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                    <div style={{ height: 48 }} />
                  </div>
                </div>
              </FloatingFormPanel>
            </div>
          )}

          {/* Mobile form card (no desktop preview here) */}
          <div className="w-full lg:hidden flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden mb-4">
              <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3">
                <FormTabs
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  showPreview={showMobilePreview}
                  onTogglePreview={() => setShowMobilePreview((v) => !v)}
                />
              </div>
              <div className="p-4">
                <div
                  className={`flex items-center w-full gap-3 p-3 border rounded-lg mb-4 ${completion?.isComplete ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"} text-sm flex-col select-none`}
                >
                  {!completion.isComplete && (
                    <>
                      <div className="flex flex-col w-full">
                        <div className="block font-medium text-amber-800 mb-0.5 text-xs">
                          Complete Your Resume
                        </div>
                        <p className="text-yellow-700 m-0 text-xs">
                          Add the following information to enable export
                          functionality:
                        </p>
                      </div>
                      <div className="w-full flex flex-wrap gap-2 justify-start">
                        {!completion?.isComplete &&
                          completion?.missingSections?.map((missing, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md font-medium bg-amber-100 text-amber-800 text-xs"
                            >
                              {missing}
                            </span>
                          ))}
                      </div>
                    </>
                  )}
                  {completion.isComplete && (
                    <>
                      <div className="flex flex-col w-full">
                        <strong className="block text-left mb-0.5 text-emerald-500 text-xs">
                          Resume Ready
                        </strong>
                        <p className="text-emerald-500 m-0 text-xs">
                          Your resume is ready to export.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {warning && (
                  <div className="text-sm text-red-700 bg-yellow-100 border border-yellow-300 px-4 py-2 mb-3 rounded-lg">
                    Please fill in all required fields to continue.
                  </div>
                )}

                {renderFormContent()}

                <div className="w-full flex items-center justify-between mt-6">
                  <button
                    onClick={goLeft}
                    disabled={currentIdx === 0}
                    className="flex gap-1 items-center text-sm bg-slate-100 px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ArrowLeft size={18} />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isInputValid(tabs[currentIdx]?.label)) {
                        setWarning(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        return;
                      }
                      setWarning(false);
                      goRight();
                    }}
                    disabled={currentIdx === tabs.length - 1}
                    className="flex gap-1 items-center text-sm bg-black text-white px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Next</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop preview panel */}
          {!isPreviewHidden && !isPreviewExpanded && (
            <div className="hidden lg:flex flex-1 flex-col min-w-0">
              <div
                className="rounded-2xl overflow-hidden border border-slate-100 bg-white"
                style={{
                  minHeight: "calc(100vh - 80px)",
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <LivePreview
                  ref={previewRef}
                  formData={formData}
                  currentTemplate={currentTemplate}
                  isExpanded={false}
                  onExpand={() => setIsPreviewExpanded(true)}
                  onCollapse={() => setIsPreviewExpanded(false)}
                  onMinimize={() => setIsPreviewHidden(true)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-4" />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans tracking-[0.01em]">
      {/* Sticky navbar like CV */}
      {!isPreviewExpanded && (
        <div ref={headerRef} className="sticky top-0 z-30 bg-[#f1f3f6]">
          <UserNavbar />
        </div>
      )}

      {/* Full-screen preview overlay (existing behavior) */}
      {isPreviewExpanded && (
        <div className="fixed inset-0 z-[99999] bg-white overflow-auto">
          <LivePreview
            ref={previewRef}
            formData={formData}
            currentTemplate={currentTemplate}
            isExpanded={true}
            onExpand={() => {}}
            onCollapse={() => setIsPreviewExpanded(false)}
            onMinimize={() => setIsPreviewHidden(true)}
          />
        </div>
      )}

      {/* Top builder bar */}
      <CVBuilderTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownload={handleDownload}
        onDownloadWord={handleDownloadWord}
        onUpload={(file) => console.log("Resume upload:", file?.name)}
        isDownloading={loading}
        downloadDisabled={!completion.isComplete}
        title={documentTitle}
        onTitleChange={(_, val) => setDocumentTitle(val)}
        titlePlaceholder="Untitled Resume"
        templatesLabel="Resume Templates"
        showDesigner={false}
        showAiToggle={true}
        isAiMode={isAiMode}
        onToggleAiMode={() => setIsAiMode((v) => !v)}
        extraButtons={
          <button
            onClick={() => navigate("/user/cover-letter")}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium shadow-sm hover:bg-black hover:text-white transition-all duration-200 whitespace-nowrap select-none"
          >
            <FileText size={18} />
            Create Cover Letter
          </button>
        }
      />

      <div className="p-2.5 overflow-hidden">
        {activeTab !== "builder" && (
          <div className="relative w-full md:w-80 mb-4 px-3">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full shadow-sm"
            />
          </div>
        )}

        {renderMainContent()}

        {/* Mobile slide-up preview overlay (mirrors CV & Cover Letter) */}
        {showMobilePreview && !isPreviewExpanded && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobilePreview(false)}
            />
            <div
              className="relative mt-auto bg-white rounded-t-2xl shadow-2xl flex flex-col"
              style={{
                height: "92dvh",
                animation:
                  "resumePreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-300" />
              </div>
              <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
                <span className="text-sm font-semibold text-slate-700">
                  Resume Preview
                </span>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <span className="text-base leading-none">×</span>
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <LivePreview
                  ref={previewRef}
                  formData={formData}
                  currentTemplate={currentTemplate}
                  isExpanded={false}
                  onExpand={() => {}}
                  onCollapse={() => {}}
                  onMinimize={() => setShowMobilePreview(false)}
                />
              </div>
            </div>
          </div>
        )}

        <footer className="mt-auto text-center py-4 bg-white border-t text-sm text-gray-600">
          © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
        </footer>
      </div>

      <style>{`
        @keyframes resumePreviewSlideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;