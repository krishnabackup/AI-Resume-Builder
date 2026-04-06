// CoverLetterBuilder.jsx

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Briefcase,
  FileText,
  User,
  AlertTriangle,
  CheckCircle,
  FileText as FileTextIcon,
  X,
} from "lucide-react";

import CoverLetterFormTabs from "./CoverLetterFormTabs";

import SenderInfoForm from "./forms/SenderInfoForm";

import RecipientInfoForm from "./forms/RecipientInfoForm";

import JobDetailsForm from "./forms/JobDetailsForm";

import BodyContentForm from "./forms/BodyContentForm";

import ClosingForm from "./forms/ClosingForm";

import CoverLetterPreview from "./CoverLetterPreview";
import CoverLetterTemplatesGallery from "./CoverLetterTemplates";
import CoverLetterTemplatesMap from "./CoverLetterTemplatesMap";

import UserNavBar from "../UserNavBar/UserNavBar";

import CVBuilderTopBar from "../CV/Cvbuildernavbar";

import axiosInstance from "../../../api/axios";

import useCoverLetterAutosave from "./hooks/useCoverLetterAutosave";

import "./CoverLetterBuilder.css";

/* ─────────────────────────────────────────────────────────

   FLOATING FORM PANEL (mirrors CV & Resume behavior)

   Anchors to its container's DOM position so the panel

   stays pinned beneath the sticky navbar while scrolling.

───────────────────────────────────────────────────────── */

const FloatingFormPanel = ({ children, topOffset, containerRef }) => {
  const panelRef = useRef(null);

  const rafRef = useRef(null);

  const currentY = useRef(0);

  const targetY = useRef(0);

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

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef?.current || !panelRef?.current) {
        targetY.current = Math.max(0, window.scrollY - topOffset);

        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top + window.scrollY;
      const containerHeight = containerRect.height;
      const panelHeight = panelRef.current.offsetHeight;

      const desired = window.scrollY + topOffset - containerTop;
      const maxDesired = Math.max(0, containerHeight - panelHeight);

      targetY.current = Math.max(0, Math.min(desired, maxDesired));
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

const tabs = [
  { id: "sender", label: "Personal", icon: User },

  { id: "recipient", label: "Recipient", icon: Building2 },

  { id: "job", label: "Job Details", icon: Briefcase },

  { id: "body", label: "Content", icon: FileText },

  { id: "closing", label: "Closing", icon: User },
];

const CoverLetterBuilder = () => {
  const headerRef = useRef(null);

  const leftColRef = useRef(null);

  const formContainerRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(64);

  const defaultFormData = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    recipientName: "",
    recipientTitle: "",
    companyName: "",
    companyAddress: "",
    jobTitle: "",
    jobReference: "",
    jobSummary: "",
    jobDescription: "",
    openingParagraph: "",
    bodyParagraph1: "",
    bodyParagraph2: "",
    closingParagraph: "",
    salutation: "Sincerely",
    customSalutation: "",
  };

  // Always initialize to empty — real data loads from DB on mount
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Check if form has data to show the reset (Create New) button
  const hasData = Boolean(
    formData.fullName ||
    formData.email ||
    formData.phone ||
    formData.address ||
    formData.linkedin ||
    formData.recipientName ||
    formData.recipientTitle ||
    formData.companyName ||
    formData.companyAddress ||
    formData.jobTitle ||
    formData.jobReference ||
    formData.jobSummary ||
    formData.jobDescription ||
    formData.openingParagraph ||
    formData.bodyParagraph1 ||
    formData.bodyParagraph2 ||
    formData.closingParagraph ||
    (formData.salutation !== "Sincerely" && formData.salutation !== "") ||
    formData.customSalutation
  );

  const handleResetCoverLetter = () => {
    if (window.confirm("Are you sure you want to clear all data and start a fresh cover letter?")) {
      setFormData(defaultFormData);
      setDocumentTitle("");
      setActiveSection("sender");
      setActiveTab("builder");
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState("professional");

  const [activeSection, setActiveSection] = useState("sender");

  const [isExporting, setIsExporting] = useState(false);

  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  const [isAiMode, setIsAiMode] = useState(false);

  const [documentTitle, setDocumentTitle] = useState("");

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",

    month: "long",

    day: "numeric",
  });

  useEffect(() => {
    document.body.style.overflow = showMobilePreview ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobilePreview]);

  // ─── Load user's cover letter from DB on mount ─────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const { data } = await axiosInstance.get("/api/coverletter");
        if (!cancelled) {
          setFormData({ ...defaultFormData, ...(data.content || {}) });
          if (data.templateId) setSelectedTemplate(data.templateId);
          if (data.documentTitle) setDocumentTitle(data.documentTitle);
        }
      } catch (err) {
        // Network error or unauthenticated — keep empty defaults
        console.warn("Could not load cover letter data:", err?.response?.status);
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── DB-backed autosave (debounced 1 s via hook) ───────────────────────────
  // Skip autosave while initial data is still loading to avoid overwriting
  useCoverLetterAutosave(
    isLoadingData ? null : formData,
    selectedTemplate,
    documentTitle
  );

  useEffect(() => {
    const saveEditActivity = async () => {
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

      await new Promise((resolve) => {
        const root = createRoot(container);

        root.render(
          <TemplateComponent formData={formData} exportDate={date} />,
        );

        setTimeout(resolve, 300);
      });

      const html = container.innerHTML;

      await saveRecentActivity(html, "visited");

      document.body.removeChild(container);
    };

    const timer = setTimeout(saveEditActivity, 5000);

    return () => clearTimeout(timer);
  }, [formData, selectedTemplate]);

  // Measure sticky navbar height for floating offset

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };

    measure();

    const ro = new ResizeObserver(measure);

    if (headerRef.current) ro.observe(headerRef.current);

    return () => ro.disconnect();
  }, []);

  // Scroll current step form back to top when section changes

  useEffect(() => {
    formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ======================================================

     SAVE DOWNLOAD RECORD

  ====================================================== */

  const saveDownloadRecord = async (html, format = "PDF") => {
    try {
      await axiosInstance.post("/api/downloads", {
        name: `Cover Letter - ${documentTitle || formData.fullName || "Document"}`,

        type: "cover-letter",

        format,

        html,

        template: selectedTemplate,

        size: format === "PDF" ? "150 KB" : "200 KB",
      });
    } catch (err) {
      console.error("Failed to save cover letter download:", err);
    }
  };

  /* ======================================================

   SAVE RECENT ACTIVITY (visited / preview / download)

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
        name: `Cover Letter - ${nameToUse}`,

        type: "cover-letter",

        action,

        format: "PDF",

        html,

        template: selectedTemplate,

        size: "150 KB",
      });
    } catch (err) {
      console.error("Failed to save cover letter activity:", err);
    }
  };

  /* ======================================================

     SAVE ACTIVITY WHEN BUILDER OPENS

  ====================================================== */

  useEffect(() => {
    // prevent duplicate visit records in same session

    if (sessionStorage.getItem("coverletter-builder-visited")) return;

    const saveVisit = async () => {
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

      await new Promise((resolve) => {
        const root = createRoot(container);

        root.render(
          <TemplateComponent formData={formData} exportDate={date} />,
        );

        setTimeout(resolve, 400);
      });

      const html = container.innerHTML;

      await saveRecentActivity(html, "visited");

      document.body.removeChild(container);

      // mark as visited in this session

      sessionStorage.setItem("coverletter-builder-visited", "true");
    };

    const timer = setTimeout(saveVisit, 2000);

    return () => clearTimeout(timer);
  }, []);

  /* ======================================================

  /* ======================================================

     RESUME UPLOAD (Pre-fill logic)

  ====================================================== */

  const handleUpload = async (file) => {
    if (!file) return;

    const isValidFormat =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx");

    if (!isValidFormat) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    toast.loading("Processing uploaded resume...");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("resume", file);
      formDataUpload.append("jobTitle", "Cover Letter Upload");
      formDataUpload.append("templateId", selectedTemplate || "professional");

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      let userId = null;
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          userId = tokenPayload.id || tokenPayload.userId;
        } catch {
          console.log("Could not parse user ID from token");
        }
      }

      if (userId) {
        formDataUpload.append("resumeprofileId", userId);
      } else {
        formDataUpload.append("resumeprofileId", "000000000000000000000000");
      }

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formDataUpload,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const rawText = await res.text();
      toast.dismiss();

      if (!res.ok) {
        toast.error("Failed to upload resume");
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        toast.error("Invalid server response");
        return;
      }

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

        toast.success("Resume parsed! We pre-filled your personal details.");
      } else {
        toast.error("Failed to parse resume content");
      }
    } catch (err) {
      toast.dismiss();
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
    }
  };

  /* ======================================================

     PDF EXPORT

  ====================================================== */

  /* ──────────────────────────────────────────────────────────────────────────
     HELPER: Build the full HTML envelope that Puppeteer will render.
     Includes Tailwind CDN and Google Fonts so all template styles resolve.
  ────────────────────────────────────────────────────────────────────────── */
  const buildPuppeteerHtml = (innerHtml, fileName = "Cover-Letter") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fileName}</title>
  <!-- Tailwind CSS (CDN) — gives all template utility classes their styles -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts used across templates -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }
    /* Ensure @page has no margins — template components control their own padding */
    @page { margin: 0; size: A4; }
  </style>
</head>
<body style="width:794px;">
  ${innerHtml}
</body>
</html>
`;

  /* ──────────────────────────────────────────────────────────────────────────
     exportToPDF — renders the currently selected React template component
     into a hidden off-screen container at A4 width (794 px), captures the
     innerHTML, wraps it in a full HTML document with Tailwind CDN + Fonts,
     and sends that to the Puppeteer backend endpoint.

     Result: PDF is pixel-identical to what the user sees in the preview panel
     because both use exactly the same React component + Tailwind classes.
  ────────────────────────────────────────────────────────────────────────── */
  const exportToPDF = async () => {
    if (!formData.fullName || !formData.jobTitle) {
      alert("Please fill in your name and job title first");
      return;
    }

    setIsExporting(true);

    const sanitize = (s) =>
      (s || "").replace(/[^a-z0-9_ -]/gi, "").trim().replace(/\s+/g, "_");

    const fileName =
      sanitize(documentTitle) || sanitize(formData.fullName) || "Cover-Letter";

    let container = null;

    try {
      // 1. Pick the template component (same map used by the preview)
      const TemplateComponent =
        CoverLetterTemplatesMap[selectedTemplate] ||
        CoverLetterTemplatesMap.professional;

      // 2. Mount template into a hidden off-screen div at A4 width
      container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        top: "0",
        left: "-9999px",
        width: "794px",
        background: "#ffffff",
        zIndex: "-1",
      });
      document.body.appendChild(container);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(container);
      root.render(<TemplateComponent formData={formData} exportDate={date} />);

      // 3. Wait for React to paint (font glyphs + layout)
      await new Promise((r) => setTimeout(r, 600));

      // 4. Grab the rendered HTML and unmount to free memory
      const innerHtml = container.innerHTML;
      root.unmount();
      document.body.removeChild(container);
      container = null;

      // 5. Build full Puppeteer-safe HTML envelope (Tailwind CDN + Fonts)
      const fullHtml = buildPuppeteerHtml(innerHtml, fileName);

      // 6. Send to backend Puppeteer endpoint
      const response = await axiosInstance.post(
        "/api/coverletter/generate-pdf",
        { html: fullHtml },
        { responseType: "blob" }
      );

      // 7. Trigger browser download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      // 8. Record the download in the activity log
      await saveDownloadRecord(fullHtml, "PDF");
    } catch (err) {
      console.error("Cover letter PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Ensure container is always cleaned up even on error
      if (container && container.parentNode) {
        document.body.removeChild(container);
      }
      setIsExporting(false);
    }
  };

  /* ======================================================

     WORD EXPORT (unchanged)

  ====================================================== */

  const currentIdx = tabs.findIndex((t) => t.id === activeSection);

  /* ------------Input Validation ------------- */
  const [warning, setWarning] = useState(false);
  const [highlightEmpty, setHighlightEmpty] = useState(false);
  const [completion, setcompletion] = useState({});
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  // Cover Letter-specific completion logic
  const getCoverLetterCompletionStatus = (formData) => {
    const missing = [];

    /* ---------- SENDER INFO ---------- */
    const hasSenderInfo = formData?.fullName?.trim() && formData?.email?.trim();

    if (!hasSenderInfo) missing.push("Sender");

    /* ---------- RECIPIENT INFO ---------- */
    const hasRecipientInfo = formData?.companyName?.trim();

    if (!hasRecipientInfo) missing.push("Recipient");

    /* ---------- JOB DETAILS ---------- */
    const hasJobDetails =
      formData?.jobTitle?.trim() && formData?.companyName?.trim();

    if (!hasJobDetails) missing.push("Job");

    /* ---------- BODY CONTENT ---------- */
    const hasBodyContent =
      formData?.openingParagraph?.trim() && formData?.bodyParagraph1?.trim() && formData?.closingParagraph?.trim();

    if (!hasBodyContent) missing.push("Body");

    /* ---------- CLOSING ---------- */
    const hasClosing =
      formData?.salutation?.trim() &&
      (formData.salutation !== "custom" || formData?.customSalutation?.trim());

    if (!hasClosing) missing.push("Closing");

    return {
      isComplete: missing.length === 0,
      missingSections: missing,
    };
  };

  useEffect(() => {
    const statusInfo = getCoverLetterCompletionStatus(formData);
    console.log("Cover Letter Completion Status:", statusInfo); // Debug log
    setcompletion(statusInfo);
  }, [formData]);

  // Enhanced validation for section navigation
  const isSectionValid = () => {
    switch (activeSection) {
      case "sender":
        return formData?.fullName?.trim() && formData?.email?.trim();
      case "recipient":
        return formData?.companyName?.trim();
      case "job":
        return formData?.jobTitle?.trim() && formData?.companyName?.trim();
      case "body":
        return (
          formData?.openingParagraph?.trim() && formData?.bodyParagraph1?.trim() && formData?.closingParagraph?.trim()
        );
      case "closing":
        return formData?.salutation?.trim() &&
          (formData.salutation !== "custom" || formData?.customSalutation?.trim());
      default:
        return true;
    }
  };

  const getRequiredFieldsMessage = () => {
    switch (activeSection) {
      case "sender":
        return "Your Name and Email are required";
      case "recipient":
        return "Company Name is required";
      case "job":
        return "Job Title is required";
      case "body":
        return "Opening Paragraph, Body Paragraph 1 and Closing Paragraph are required";
      case "closing":
        return "Salutation is required";
      default:
        return "";
    }
  };

  // Clear warning when switching tabs (via tab click or navigation)
  useEffect(() => {
    setWarning(false);
    setHighlightEmpty(false);
  }, [activeSection]);

  const goLeft = () => {
    if (currentIdx > 0) {
      setActiveSection(tabs[currentIdx - 1].id);
    }
  };

  const goRight = () => {
    if (currentIdx < tabs.length - 1 && isSectionValid()) {
      setActiveSection(tabs[currentIdx + 1].id);
      setWarning(false);
      setHighlightEmpty(false);
    } else {
      setWarning(true);
      setHighlightEmpty(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderFormContent = () => {
    switch (activeSection) {
      case "sender":
        return (
          <SenderInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            highlightEmpty={highlightEmpty}
          />
        );

      case "recipient":
        return (
          <RecipientInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            highlightEmpty={highlightEmpty}
          />
        );

      case "job":
        return (
          <JobDetailsForm
            formData={formData}
            onInputChange={handleInputChange}
            highlightEmpty={highlightEmpty}
          />
        );

      case "body":
        return (
          <BodyContentForm
            formData={formData}
            onInputChange={handleInputChange}
            highlightEmpty={highlightEmpty}
          />
        );

      case "closing":
        return (
          <ClosingForm
            formData={formData}
            onInputChange={handleInputChange}
            highlightEmpty={highlightEmpty}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 relative z-0 md:pt-0 pt-20">
      {/* Sticky navbar, same behavior as CV/Resume */}

      <div
        ref={headerRef}
        className="sticky top-0 z-30 bg-gradient-to-br from-slate-50 to-gray-50"
      >
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

      {activeTab === "templates" ? (
        <CoverLetterTemplatesGallery
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(tid) => {
            setSelectedTemplate(tid);
            setActiveTab("builder");
          }}
          formData={formData}
        />
      ) : (
        <div className="px-2 py-4 sm:px-4 lg:px-4 w-screen max-w-full mx-0">
        {/* Dynamic status bar — mirrors Resume Builder */}
        {completion?.isComplete ? (
          <div className="flex gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 shadow-sm px-2">
            <CheckCircle
              className="text-emerald-500 flex-shrink-0 mt-0.5"
              size={18}
            />
            <span className="text-sm font-medium text-emerald-800">
              Cover Letter Ready: All required information has been added. You can now export your cover letter.
            </span>
          </div>
        ) : (
          <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 shadow-sm px-2">
            <AlertTriangle
              className="text-amber-500 flex-shrink-0 mt-0.5"
              size={18}
            />
            <span className="text-sm font-medium text-amber-800">
              Complete Your Cover Letter: Add the missing information to enable export functionality.
            </span>
          </div>
        )}

        {/* Main Layout – desktop floating form + preview (matches CV/Resume) */}

        <div className="flex gap-5 w-full mt-2 lg:mt-5 p-0 sm:p-2 lg:flex-row flex-col max-w-[1920px] mx-auto relative z-10">
          {/* Desktop floating form panel */}

          <div
            ref={leftColRef}
            className="flex-shrink-0 hidden lg:block self-stretch"
            style={{ width: 480 }}
          >
            <FloatingFormPanel
              topOffset={headerHeight}
              containerRef={leftColRef}
            >
              <div className="bg-white rounded-xl h-full overflow-hidden flex flex-col border border-slate-200">
                <CoverLetterFormTabs
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  onTogglePreview={async () => {
                    const TemplateComponent =
                      CoverLetterTemplatesMap[selectedTemplate] || CoverLetterTemplatesMap.professional;

                    if (!TemplateComponent) {
                      setShowMobilePreview((v) => !v);

                      return;
                    }

                    const container = document.createElement("div");

                    Object.assign(container.style, {
                      position: "fixed",

                      top: "0",

                      left: "-9999px",

                      width: "794px",
                    });

                    document.body.appendChild(container);

                    const { createRoot } = await import("react-dom/client");

                    await new Promise((resolve) => {
                      const root = createRoot(container);

                      root.render(
                        <TemplateComponent
                          formData={formData}
                          exportDate={date}
                        />,
                      );

                      setTimeout(resolve, 300);
                    });

                    const html = container.innerHTML;

                    await saveRecentActivity(html, "preview");

                    document.body.removeChild(container);

                    setShowMobilePreview((v) => !v);
                  }}
                />

                <div
                  ref={formContainerRef}
                  className="mt-3 flex-1 overflow-y-auto py-2 pr-2"
                  style={{
                    scrollbarWidth: "thin",

                    scrollbarColor: "#e2e8f0 transparent",
                  }}
                >
                  {/* Validation warning */}
                  {warning && (
                    <div className="text-sm text-red-700 bg-yellow-100 border border-yellow-300 px-4 py-2 mb-3 rounded-lg">
                      {getRequiredFieldsMessage()}
                    </div>
                  )}

                  {renderFormContent()}
                </div>

                <div className="flex justify-between items-center mt-auto p-4 border-t border-slate-100 bg-white">
                  <button
                    onClick={goLeft}
                    disabled={currentIdx === 0}
                    className="flex gap-1 items-center text-sm bg-slate-100 px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ArrowLeft size={18} /> Previous
                  </button>

                  <div className="flex-1 text-center text-xs text-gray-500 font-medium">
                    Step {currentIdx + 1} of {tabs.length}
                  </div>

                  <button
                    onClick={() => {
                      if (currentIdx === tabs.length - 1) {
                        if (isSectionValid() && completion?.isComplete) {
                          setShowCompletionPopup(true);
                        } else {
                          setWarning(true);
                          setHighlightEmpty(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      } else {
                        goRight();
                      }
                    }}
                    disabled={false}
                    className="flex gap-2 items-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <span className="hidden sm:inline">
                      {currentIdx === tabs.length - 1 ? "Finish" : "Next Step"}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </FloatingFormPanel>
          </div>

          {/* Mobile form card (full-width, scrollable, with bottom controls) */}

          <div className="w-full lg:hidden bg-white rounded-xl overflow-hidden flex flex-col border border-slate-200">
            <CoverLetterFormTabs
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onTogglePreview={async () => {
                const TemplateComponent =
                  CoverLetterTemplatesMap[selectedTemplate] || CoverLetterTemplatesMap.professional;

                if (!TemplateComponent) {
                  setShowMobilePreview((v) => !v);

                  return;
                }

                const container = document.createElement("div");

                Object.assign(container.style, {
                  position: "fixed",

                  top: "0",

                  left: "-9999px",

                  width: "794px",
                });

                document.body.appendChild(container);

                const { createRoot } = await import("react-dom/client");

                await new Promise((resolve) => {
                  const root = createRoot(container);

                  root.render(
                    <TemplateComponent formData={formData} exportDate={date} />,
                  );

                  setTimeout(resolve, 300);
                });

                const html = container.innerHTML;

                await saveRecentActivity(html, "preview");

                document.body.removeChild(container);

                setShowMobilePreview((v) => !v);
              }}
            />

            <div className="mt-3 flex-1 overflow-y-auto py-2 pr-2">
              {/* Validation warning */}
              {warning && (
                <div className="text-sm text-red-700 bg-yellow-100 border border-yellow-300 px-4 py-2 mb-3 rounded-lg">
                  {getRequiredFieldsMessage()}
                </div>
              )}

              {renderFormContent()}
            </div>

            <div className="flex justify-between items-center mt-auto p-4 border-t border-slate-100 bg-white">
              <button
                onClick={goLeft}
                disabled={currentIdx === 0}
                className="flex gap-1 items-center text-sm bg-slate-100 px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft size={18} /> Previous
              </button>

              <div className="flex-1 text-center text-xs text-gray-500 font-medium">
                Step {currentIdx + 1} of {tabs.length}
              </div>

              <button
                onClick={() => {
                  if (currentIdx === tabs.length - 1) {
                    if (isSectionValid() && completion?.isComplete) {
                      setShowCompletionPopup(true);
                    } else {
                      setWarning(true);
                      setHighlightEmpty(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  } else {
                    goRight();
                  }
                }}
                disabled={false}
                className="flex gap-1 items-center text-sm bg-black text-white px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {currentIdx === tabs.length - 1 ? "Finish" : "Next"}

                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* PREVIEW PANEL */}

          <div className="hidden lg:flex flex-col flex-1 min-w-0 bg-[#eef2f7] rounded-xl overflow-hidden border border-slate-200 relative order-1 lg:order-2 z-10">
            <CoverLetterPreview formData={formData} selectedTemplate={selectedTemplate} exportDate={date} />
          </div>
        </div>
      </div>
      )}

      {/* Mobile Preview Overlay (already CV-like) */}

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

              animation: "clPreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
              <span className="text-sm font-semibold text-slate-700">
                Cover Letter Preview
              </span>

              <button
                onClick={() => setShowMobilePreview(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <CoverLetterPreview formData={formData} selectedTemplate={selectedTemplate} exportDate={date} />
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto text-center py-4 bg-white border-t text-sm text-gray-600">
        © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
      </footer>

      <style>{`

        @keyframes clPreviewSlideUp {

          from { transform: translateY(100%); opacity: 0.5; }

          to   { transform: translateY(0);    opacity: 1;   }

        }

      `}</style>

      {/* Completion Popup */}
      {showCompletionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cover Letter Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Your cover letter has been successfully completed with all
                required information. You can now download or preview your cover
                letter.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCompletionPopup(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Continue Editing
                </button>
                <button
                  onClick={() => {
                    setShowCompletionPopup(false);
                    // Navigate to templates or download
                    setActiveTab("templates");
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterBuilder;
