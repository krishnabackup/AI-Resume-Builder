import React, { useState, useEffect, useRef } from "react";
import FormTabs from "./FormTabs";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "axios";
import axiosInstance from "../../../api/axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

// Forms
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import ProjectsForm from "./forms/ProjectsForm";
import CertificationsForm from "./forms/CertificationsForm";
import SkillsForm from "./forms/skillsForm";

// Preview + Templates
import CVPreview from "./CVPreview";
import TemplatesGallery from "./Templatesgallery";
import CVTemplates from "./Cvtemplates";
import mergeWithSampleData from "../../../utils/Datahelpers";

import CVBuilderTopBar from "./Cvbuildernavbar";
import ResumeCompletionBanner from "./ResumeCompletionBanner";
import "./CVBuilder.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ================= CONSTANTS ================= */
const sections = [
  "personal",
  "work",
  "education",
  "skills",
  "projects",
  "certifications",
];

const generateId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/* ================= DEFAULT CV ================= */
const createEmptyResume = () => ({
  fullName: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  summary: "",
  experience: [
    {
      id: generateId(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      id: generateId(),
      school: "",
      degree: "",
      location: "",
      graduationDate: "",
      gpa: "",
    },
  ],
  skills: { technical: [], soft: [] },
  projects: [
    { id: generateId(), name: "", description: "", technologies: "", link: "" },
  ],
  certifications: [
    { id: generateId(), name: "", issuer: "", date: "", link: "" },
  ],
});

const PDF_PAGE_WIDTH_PX = 794;

/* ─────────────────────────────────────────────────────────
   FLOATING FORM PANEL
   Anchors to its container's DOM position so the panel
   stays correctly pinned below the sticky navbar regardless
   of how tall the scrollable topbar/banner are.
───────────────────────────────────────────────────────── */
const FloatingFormPanel = ({ children, topOffset, containerRef }) => {
  const panelRef = useRef(null);
  const rafRef = useRef(null);
  const currentY = useRef(0);
  const targetY = useRef(0);

  /* spring animation loop */
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

  /* update target on scroll — anchor to container's top in the DOM */
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

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const CVBuilder = () => {
  const formContainerRef = useRef(null);
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const [activeTab, setActiveTab] = useState("builder");
  const [activeSection, setActiveSection] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [formData, setFormData] = useState(() => createEmptyResume());

  const [resumeId, setResumeId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");

  /* Measure sticky navbar height for float offset */
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, [activeTab]);

  /* Lock body scroll when mobile preview is open */
  useEffect(() => {
    document.body.style.overflow = showMobilePreview ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobilePreview]);

  /* Auto-scroll form to top on section change */
  useEffect(() => {
    formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  /* ======================================================
     SAVE CV DOWNLOAD RECORD
  ====================================================== */
  const saveDownloadRecord = async (html, format = "PDF") => {
    try {
      await axiosInstance.post("/api/downloads", {
        name: `CV - ${formData.fullName || "Document"}`,
        type: "cv",
        format,
        html,
        template: selectedTemplate,
        size: format === "PDF" ? "250 KB" : "200 KB",
      });
    } catch (err) {
      console.error("Failed to save CV download:", err);
    }
  };

  /* ======================================================
     SAVE CV TO DOWNLOADS COLLECTION (for preview)
  ====================================================== */
  const saveCVToDownloads = async () => {
    try {
      const TemplateComponent = CVTemplates[selectedTemplate];
      if (!TemplateComponent) return;

      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        top: "0",
        left: "-9999px",
        width: `${PDF_PAGE_WIDTH_PX}px`,
        background: "#ffffff",
      });
      document.body.appendChild(container);

      const { createRoot } = await import("react-dom/client");
      const displayData = mergeWithSampleData(formData);

      await new Promise((resolve) => {
        const root = createRoot(container);
        root.render(<TemplateComponent formData={displayData} />);
        setTimeout(resolve, 400);
      });

      const html = container.innerHTML;
      await saveDownloadRecord(html, "PDF");
      document.body.removeChild(container);
    } catch (err) {
      console.error("Failed to save CV to downloads:", err);
    }
  };

  /* ================= DOWNLOAD WORD ================= */
  const downloadWord = async () => {
    const TemplateComponent = CVTemplates[selectedTemplate];
    if (!TemplateComponent) {
      toast.error("No template selected");
      return;
    }

    setIsDownloading(true);
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "-9999px",
      width: `${PDF_PAGE_WIDTH_PX}px`,
      background: "#ffffff",
    });
    document.body.appendChild(container);

    try {
      const { createRoot } = await import("react-dom/client");
      const displayData = mergeWithSampleData(formData);
      await new Promise((resolve) => {
        const root = createRoot(container);
        root.render(<TemplateComponent formData={displayData} />);
        setTimeout(resolve, 400);
      });

      const bodyHtml = container.innerHTML;
      const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>CV</title></head><body>${bodyHtml}</body></html>`;
      const blob = new Blob(["\uFEFF", wordHtml], {
        type: "application/msword",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const clean = (s) =>
        (s || "")
          .replace(/[^a-z0-9_\- ]/gi, "")
          .trim()
          .replace(/\s+/g, "_");
      a.download = `${clean(documentTitle) || clean(formData.fullName) || "CV"}.doc`;
      a.click();
      URL.revokeObjectURL(url);
      await saveDownloadRecord(bodyHtml, "DOCX");
      toast.success("CV downloaded as Word!");
    } catch (err) {
      console.error("Word download error:", err);
      toast.error("Failed to download Word.");
    } finally {
      document.body.removeChild(container);
      setIsDownloading(false);
    }
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = async () => {
    const TemplateComponent = CVTemplates[selectedTemplate];
    if (!TemplateComponent) {
      toast.error("No template selected");
      return;
    }

    setIsDownloading(true);

    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "-9999px",
      width: `${PDF_PAGE_WIDTH_PX}px`,
      background: "#ffffff",
    });
    document.body.appendChild(container);

    const { createRoot } = await import("react-dom/client");
    const displayData = mergeWithSampleData(formData);

    await new Promise((resolve) => {
      const root = createRoot(container);
      root.render(<TemplateComponent formData={displayData} />);
      setTimeout(resolve, 400);
    });

    try {
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        windowWidth: PDF_PAGE_WIDTH_PX,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const mmPageW = 210;
      const mmPageH = 297;
      const marginMm = 30;
      const contentW = mmPageW - 2 * marginMm;
      const contentH = mmPageH - marginMm;
      const pxPerMm = canvas.width / mmPageW;
      const pxContentH = Math.round(contentH * pxPerMm);

      let yPx = 0;
      let firstPage = true;

      while (yPx < canvas.height) {
        const sliceH = Math.min(pxContentH, canvas.height - yPx);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pxContentH;
        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          yPx,
          canvas.width,
          sliceH,
          0,
          0,
          canvas.width,
          sliceH,
        );
        const imgData = pageCanvas.toDataURL("image/jpeg", 0.96);
        if (!firstPage) pdf.addPage();
        pdf.addImage(imgData, "JPEG", marginMm, marginMm, contentW, contentH);
        yPx += sliceH;
        firstPage = false;
      }

      const clean = (str) =>
        str
          ?.replace(/[^a-z0-9_\- ]/gi, "")
          .trim()
          .replace(/\s+/g, "_");
      const name = clean(documentTitle) || clean(displayData?.fullName) || "CV";
      pdf.save(`${name}.pdf`);

      const html = container.innerHTML;
      await saveDownloadRecord(html, "PDF");
      toast.success("CV downloaded!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Failed to download PDF.");
    } finally {
      document.body.removeChild(container);
      setIsDownloading(false);
    }
  };

  /* ================= LOAD RESUME ================= */
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resume", {
          withCredentials: true,
          signal: controller.signal,
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          const latest = res.data[0];
          setResumeId(latest._id);
          if (latest.data) {
            setFormData((prev) => ({
              ...prev,
              ...latest.data,
              skills: {
                technical: latest.data?.skills?.technical ?? [],
                soft: latest.data?.skills?.soft ?? [],
              },
            }));
          }
          if (latest.templateId) setSelectedTemplate(latest.templateId);
          toast.success("Resume loaded");
        }
      } catch (err) {
        if (err.name !== "CanceledError")
          console.error("Error loading resume:", err);
      }
    })();
    return () => controller.abort();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        title: formData.fullName
          ? `${formData.fullName}'s Resume`
          : "My Resume",
        templateId: selectedTemplate,
        data: formData,
      };
      if (resumeId) {
        await axios.put(
          `http://localhost:5000/api/resume/${resumeId}`,
          payload,
          { withCredentials: true },
        );
      } else {
        const res = await axios.post(
          `http://localhost:5000/api/resume`,
          payload,
          { withCredentials: true },
        );
        setResumeId(res.data?._id);
      }
      await saveCVToDownloads();
      toast.success("Resume saved!");
    } catch (err) {
      console.error("Error saving resume:", err);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setActiveTab("builder");
    toast.success("Template applied!");
  };

  /* ================= SECTION NAV ================= */
  const currentIndex = Math.max(0, sections.indexOf(activeSection));
  const goNext = () => {
    if (currentIndex < sections.length - 1)
      setActiveSection(sections[currentIndex + 1]);
  };
  const goPrevious = () => {
    if (currentIndex > 0) setActiveSection(sections[currentIndex - 1]);
  };

  /* ================= FORM RENDER ================= */
  const renderFormContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoForm
            formData={formData}
            onInputChange={handleInputChange}
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
      case "certifications":
        return (
          <CertificationsForm formData={formData} setFormData={setFormData} />
        );
      default:
        return null;
    }
  };

  const previewProps = { formData, selectedTemplate };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      {/* ── Sticky: navbar only ── */}
      <div ref={headerRef} className="sticky top-0 z-30 bg-[#f1f3f6]">
        <UserNavBar />
      </div>

      {/* ── Scrollable: topbar + banner ── */}
      <div className="bg-[#f1f3f6]">
        <CVBuilderTopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSave={handleSave}
          onDownload={downloadPDF}
          onDownloadWord={downloadWord}
          onUpload={(file) => console.log("CV upload:", file?.name)}
          isSaving={isSaving}
          isDownloading={isDownloading}
          title={documentTitle}
          onTitleChange={(_, val) => setDocumentTitle(val)}
          isAiMode={isAiMode}
          onToggleAiMode={() => setIsAiMode((v) => !v)}
        />
        {activeTab === "builder" && (
          <div className="px-4">
            <ResumeCompletionBanner />
          </div>
        )}
      </div>

      {/* ════ BUILDER TAB ════ */}
      {activeTab === "builder" && (
        <div className="flex gap-5 px-4 pb-20 pt-4 items-start">
          {/* ── LEFT: floating form panel (desktop) ── */}
          {!isPreviewMaximized && (
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
                  {/* Tabs */}
                  <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 bg-white rounded-t-2xl">
                    <FormTabs
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                      showPreview={showMobilePreview}
                      onTogglePreview={() => setShowMobilePreview((v) => !v)}
                    />
                  </div>

                  {/* Scrollable form content */}
                  <div
                    ref={formContainerRef}
                    className="flex-1 overflow-y-auto p-6"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#e2e8f0 transparent",
                    }}
                  >
                    {renderFormContent()}

                    {/* Prev / Next */}
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={goPrevious}
                        disabled={currentIndex === 0}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium disabled:opacity-30 hover:bg-slate-200 transition-colors text-sm"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={goNext}
                        disabled={currentIndex === sections.length - 1}
                        className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium disabled:opacity-30 hover:bg-slate-700 transition-colors text-sm"
                      >
                        Next →
                      </button>
                    </div>
                    <div style={{ height: 48 }} />
                  </div>
                </div>
              </FloatingFormPanel>
            </div>
          )}

          {/* ── LEFT: mobile form ── */}
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
              <div className="p-6">
                {renderFormContent()}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={goPrevious}
                    disabled={currentIndex === 0}
                    className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium disabled:opacity-30 hover:bg-slate-200 transition-colors text-sm"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === sections.length - 1}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium disabled:opacity-30 hover:bg-slate-700 transition-colors text-sm"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: preview ── */}
          <div className="hidden lg:flex flex-1 flex-col min-w-0">
            <div
              className="rounded-2xl overflow-hidden border border-slate-100"
              style={{
                minHeight: "calc(100vh - 80px)",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <CVPreview
                {...previewProps}
                isMaximized={isPreviewMaximized}
                onToggleMaximize={() => setIsPreviewMaximized((v) => !v)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ════ TEMPLATES TAB ════ */}
      {activeTab === "templates" && (
        <div className="px-4 pb-16 pt-4">
          <TemplatesGallery
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
            formData={formData}
          />
        </div>
      )}

      {/* ── Mobile preview overlay ── */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobilePreview(false)}
          />
          <div
            className="relative mt-auto bg-white rounded-t-2xl shadow-2xl flex flex-col"
            style={{
              height: "92dvh",
              animation: "cvPreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
              <span className="text-sm font-semibold text-slate-700">
                CV Preview
              </span>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <CVPreview
                {...previewProps}
                isMaximized={false}
                onToggleMaximize={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cvPreviewSlideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
};

export default CVBuilder;
