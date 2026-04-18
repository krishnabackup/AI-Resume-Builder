import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import toast from "react-hot-toast";
import {
  FileText as FileTextIcon
} from "lucide-react";

import CoverLetterFormTabs from "./CoverLetterFormTabs";
import CoverLetterPreview from "./CoverLetterPreview";
import CoverLetterTemplatesGallery from "./CoverLetterTemplates";
import CoverLetterTemplatesMap from "./CoverLetterTemplatesMap";
import UserNavBar from "../UserNavBar/UserNavBar";
import CVBuilderTopBar from "../CV/Cvbuildernavbar";
import axiosInstance from "../../../api/axios";
import useCoverLetterAutosave from "./hooks/useCoverLetterAutosave";

// Sub-components
import CoverLetterFloatingForm from "./builder/CoverLetterFloatingForm";
import CompletionStatusBar from "./builder/CompletionStatusBar";
import MobilePreviewOverlay from "./builder/MobilePreviewOverlay";
import CompletionPopup from "./builder/CompletionPopup";
import FormFooter from "./builder/FormFooter";
import BuilderFormSection from "./builder/BuilderFormSection";

// Utilities
import {
  DEFAULT_FORM_DATA,
  TABS,
  getCoverLetterCompletionStatus,
  isSectionValid as validateSection,
  getRequiredFieldsMessage,
  buildPuppeteerHtml,
  saveDownloadRecord,
  saveRecentActivity
} from "./builder/builderUtils";

import "./CoverLetterBuilder.css";

const CoverLetterBuilder = () => {
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const formContainerRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(64);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [activeSection, setActiveSection] = useState("sender");
  const [isExporting, setIsExporting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");
  const [isAiMode, setIsAiMode] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [warning, setWarning] = useState(false);
  const [highlightEmpty, setHighlightEmpty] = useState(false);
  const [completion, setCompletion] = useState({ isComplete: false, missingSections: [] });
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const exportDate = useMemo(() => new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }), []);

  useEffect(() => {
    document.body.style.overflow = showMobilePreview ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showMobilePreview]);

  // ─── Load user's cover letter from DB on mount ─────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const { data } = await axiosInstance.get("/api/coverletter");
        if (!cancelled) {
          setFormData({ ...DEFAULT_FORM_DATA, ...(data.content || {}) });
          if (data.templateId) setSelectedTemplate(data.templateId);
          if (data.documentTitle) setDocumentTitle(data.documentTitle);
        }
      } catch (err) {
        console.warn("Could not load cover letter data:", err?.response?.status);
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, []);

  useCoverLetterAutosave(isLoadingData ? null : formData, selectedTemplate, documentTitle);

  const saveActivityForHtml = useCallback(async (action = "visited") => {
    const TemplateComponent = CoverLetterTemplatesMap[selectedTemplate] || CoverLetterTemplatesMap.professional;
    if (!TemplateComponent) return;

    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "-9999px",
      width: "794px",
      background: "#ffffff",
    });
    document.body.appendChild(container);

    const { createRoot } = await import("react-dom/client");
    const root = createRoot(container);
    root.render(<TemplateComponent formData={formData} exportDate={exportDate} />);

    await new Promise((resolve) => setTimeout(resolve, 400));
    const html = container.innerHTML;
    await saveRecentActivity(html, documentTitle, formData.fullName, selectedTemplate, action);
    
    root.unmount();
    if (container.parentNode) document.body.removeChild(container);
  }, [formData, selectedTemplate, exportDate, documentTitle]);

  useEffect(() => {
    const timer = setTimeout(() => saveActivityForHtml("visited"), 5000);
    return () => clearTimeout(timer);
  }, [saveActivityForHtml]);

  useEffect(() => {
    if (sessionStorage.getItem("coverletter-builder-visited")) return;
    const timer = setTimeout(() => {
      saveActivityForHtml("visited");
      sessionStorage.setItem("coverletter-builder-visited", "true");
    }, 2000);
    return () => clearTimeout(timer);
  }, [saveActivityForHtml]);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const hasData = useMemo(() => {
    return Object.keys(DEFAULT_FORM_DATA).some(key => {
      if (key === 'salutation') return formData.salutation !== "Sincerely" && formData.salutation !== "";
      return formData[key] !== DEFAULT_FORM_DATA[key];
    });
  }, [formData]);

  const handleResetCoverLetter = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data and start a fresh cover letter?")) {
      setFormData(DEFAULT_FORM_DATA);
      setDocumentTitle("");
      setActiveSection("sender");
      setActiveTab("builder");
    }
  }, []);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;
    const isValidFormat = /\.(pdf|doc|docx)$/i.test(file.name) || 
      ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type);

    if (!isValidFormat) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    const toastId = toast.loading("Processing uploaded resume...");
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("resume", file);
      formDataUpload.append("jobTitle", "Cover Letter Upload");
      formDataUpload.append("templateId", selectedTemplate || "professional");

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      let userId = "000000000000000000000000";
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id || payload.userId || userId;
        } catch { }
      }
      formDataUpload.append("resumeprofileId", userId);

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formDataUpload,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (data.success && data.data?.extractedData) {
        const extracted = data.data.extractedData;
        setFormData((prev) => ({
          ...prev,
          fullName: extracted.name || prev.fullName,
          email: extracted.email || prev.email,
          phone: extracted.phone || prev.phone,
          address: extracted.location || prev.address,
          linkedin: extracted.linkedin || prev.linkedin,
          jobTitle: extracted.title || prev.jobTitle,
        }));
        toast.success("Resume parsed! We pre-filled your personal details.", { id: toastId });
      } else {
        throw new Error("Failed to parse resume content");
      }
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.", { id: toastId });
    }
  }, [selectedTemplate]);

  const exportToPDF = useCallback(async () => {
    if (!formData.fullName || !formData.jobTitle) {
      toast.error("Please fill in your name and job title first");
      return;
    }

    setIsExporting(true);
    const sanitize = (s) => (s || "").replace(/[^a-z0-9_ -]/gi, "").trim().replace(/\s+/g, "_");
    const fileName = sanitize(documentTitle) || sanitize(formData.fullName) || "Cover-Letter";

    let container = null;
    try {
      const TemplateComponent = CoverLetterTemplatesMap[selectedTemplate] || CoverLetterTemplatesMap.professional;
      container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed", top: "0", left: "-9999px", width: "794px", background: "#ffffff", zIndex: "-1",
      });
      document.body.appendChild(container);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(container);
      root.render(<TemplateComponent formData={formData} exportDate={exportDate} />);

      await new Promise((r) => setTimeout(r, 600));
      const innerHtml = container.innerHTML;
      root.unmount();
      document.body.removeChild(container);
      container = null;

      const fullHtml = buildPuppeteerHtml(innerHtml, fileName);
      const response = await axiosInstance.post("/api/coverletter/generate-pdf", { html: fullHtml }, { responseType: "blob" });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      await saveDownloadRecord(fullHtml, documentTitle, formData.fullName, selectedTemplate, "PDF");
    } catch (err) {
      console.error("PDF Export error:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      if (container && container.parentNode) document.body.removeChild(container);
      setIsExporting(false);
    }
  }, [formData, selectedTemplate, documentTitle, exportDate]);

  useEffect(() => {
    setCompletion(getCoverLetterCompletionStatus(formData));
  }, [formData]);

  const goLeft = useCallback(() => {
    const idx = TABS.findIndex((t) => t.id === activeSection);
    if (idx > 0) setActiveSection(TABS[idx - 1].id);
  }, [activeSection]);

  const goRight = useCallback(() => {
    const idx = TABS.findIndex((t) => t.id === activeSection);
    if (idx < TABS.length - 1) {
      if (validateSection(activeSection, formData)) {
        setActiveSection(TABS[idx + 1].id);
        setWarning(false);
        setHighlightEmpty(false);
      } else {
        setWarning(true);
        setHighlightEmpty(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (idx === TABS.length - 1) {
      if (validateSection(activeSection, formData) && completion.isComplete) {
        setShowCompletionPopup(true);
      } else {
        setWarning(true);
        setHighlightEmpty(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [activeSection, formData, completion.isComplete]);

  const onTogglePreviewWithActivity = useCallback(async () => {
    await saveActivityForHtml("preview");
    setShowMobilePreview(v => !v);
  }, [saveActivityForHtml]);

  if (activeTab === "templates") {
    return (
      <CoverLetterTemplatesGallery
        selectedTemplate={selectedTemplate}
        onSelectTemplate={(tid) => {
          setSelectedTemplate(tid);
          setActiveTab("builder");
        }}
        formData={formData}
      />
    );
  }

  const currentIdx = TABS.findIndex((t) => t.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 relative z-0 md:pt-0 pt-20">
      <div ref={headerRef} className="sticky top-0 z-30 bg-gradient-to-br from-slate-50 to-gray-50">
        <UserNavBar />
      </div>

      <CVBuilderTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownload={exportToPDF}
        showDownloadWord={false}
        isDownloading={isExporting}
        title={documentTitle}
        onTitleChange={(_, val) => setDocumentTitle(val)}
        titlePlaceholder="Untitled Cover Letter"
        templatesLabel="Cover Letter Templates"
        showTabs={true}
        showAiToggle={true}
        isAiMode={isAiMode}
        onToggleAiMode={() => setIsAiMode((v) => !v)}
        showUpload={true}
        onUpload={handleUpload}
        showDesigner={false}
        showReset={hasData}
        onReset={handleResetCoverLetter}
        resetLabel="Create new Cover Letter"
      />

      <div className="px-2 py-4 sm:px-4 lg:px-4 w-screen max-w-full mx-0">
        <CompletionStatusBar isComplete={completion.isComplete} />

        <div className="flex gap-5 w-full mt-2 lg:mt-5 p-0 sm:p-2 lg:flex-row flex-col max-w-[1920px] mx-auto relative z-10">
          <div ref={leftColRef} className="flex-shrink-0 hidden lg:block self-stretch" style={{ width: 480 }}>
            <CoverLetterFloatingForm topOffset={headerHeight} containerRef={leftColRef}>
              <div className="bg-white rounded-xl h-full overflow-hidden flex flex-col border border-slate-200">
                <CoverLetterFormTabs
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onTogglePreview={onTogglePreviewWithActivity}
                />

                <div ref={formContainerRef} className="mt-3 flex-1 overflow-y-auto py-2 pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
                  {warning && (
                    <div className="text-sm text-red-700 bg-yellow-100 border border-yellow-300 px-4 py-2 mb-3 rounded-lg">
                      {getRequiredFieldsMessage(activeSection)}
                    </div>
                  )}
                  <BuilderFormSection 
                    activeSection={activeSection} 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    highlightEmpty={highlightEmpty} 
                  />
                </div>

                <FormFooter 
                  currentIdx={currentIdx} 
                  totalTabs={TABS.length} 
                  onPrev={goLeft} 
                  onNext={goRight} 
                  isLastStep={currentIdx === TABS.length - 1} 
                  isSectionValid={validateSection(activeSection, formData)} 
                  isComplete={completion.isComplete} 
                />
              </div>
            </CoverLetterFloatingForm>
          </div>

          <div className="w-full lg:hidden bg-white rounded-xl overflow-hidden flex flex-col border border-slate-200">
            <CoverLetterFormTabs activeSection={activeSection} setActiveSection={setActiveSection} onTogglePreview={onTogglePreviewWithActivity} />
            <div className="mt-3 flex-1 overflow-y-auto py-2 pr-2">
              {warning && (
                <div className="text-sm text-red-700 bg-yellow-100 border border-yellow-300 px-4 py-2 mb-3 rounded-lg">
                  {getRequiredFieldsMessage(activeSection)}
                </div>
              )}
              <BuilderFormSection activeSection={activeSection} formData={formData} handleInputChange={handleInputChange} highlightEmpty={highlightEmpty} />
            </div>
            <FormFooter currentIdx={currentIdx} totalTabs={TABS.length} onPrev={goLeft} onNext={goRight} isLastStep={currentIdx === TABS.length - 1} isSectionValid={validateSection(activeSection, formData)} isComplete={completion.isComplete} />
          </div>

          <div className="hidden lg:flex flex-col flex-1 min-w-0 bg-[#eef2f7] rounded-xl overflow-hidden border border-slate-200 relative order-1 lg:order-2 z-10">
            <CoverLetterPreview formData={formData} selectedTemplate={selectedTemplate} exportDate={exportDate} />
          </div>
        </div>
      </div>

      <MobilePreviewOverlay show={showMobilePreview} onClose={() => setShowMobilePreview(false)} formData={formData} selectedTemplate={selectedTemplate} date={exportDate} />
      <CompletionPopup show={showCompletionPopup} onClose={() => setShowCompletionPopup(false)} onFinish={() => { setShowCompletionPopup(false); setActiveTab("templates"); }} />

      <footer className="mt-auto text-center py-4 bg-white border-t text-sm text-gray-600">
        © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default memo(CoverLetterBuilder);
