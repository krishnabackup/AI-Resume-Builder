// CoverLetterBuilder.jsx

import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

import { getCompletionStatus } from "../ResumeBuilder/completion";

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

/* ─────────────────────────────────────────────────────────
   HELPERS: decode the JWT to get the current user's ID
   (same pattern the CV Builder uses when uploading a file)
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

  // Compute user-scoped localStorage keys once on mount.
  // Using a ref so the value never changes after the first render.
  const userIdRef = useRef(getLoggedInUserId());
  const clFormKey = userIdRef.current
    ? `coverLetterFormData_${userIdRef.current}`
    : null;
  const clTemplateKey = userIdRef.current
    ? `coverLetterSelectedTemplate_${userIdRef.current}`
    : null;

  const [formData, setFormData] = useState(() => {
    if (!clFormKey) return defaultFormData;
    try {
      const saved = localStorage.getItem(clFormKey);
      return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    if (!clTemplateKey) return "professional";
    try {
      const saved = localStorage.getItem(clTemplateKey);
      return saved || "professional";
    } catch {
      return "professional";
    }
  });

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

  // Auto-save to localStorage (debounced 400 ms, same as Resume Builder)
  // Also persist selected template — both keyed by user ID
  useEffect(() => {
    if (!clFormKey) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(clFormKey, JSON.stringify(formData));
    }, 400);
    return () => clearTimeout(timeout);
  }, [formData, clFormKey]);

  useEffect(() => {
    if (!clTemplateKey) return;
    try {
      localStorage.setItem(clTemplateKey, selectedTemplate);
    } catch {}
  }, [selectedTemplate, clTemplateKey]);

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

     SAVE COVER LETTER TO DOWNLOADS COLLECTION

  ====================================================== */

  const saveCoverLetterToDownloads = async () => {
    try {
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

      await saveDownloadRecord(html, "PDF");

      document.body.removeChild(container);
    } catch (err) {
      console.error("Failed to save cover letter to downloads:", err);
    }
  };

  /* ======================================================

     PDF EXPORT

  ====================================================== */

  /* ======================================================
     PDF EXPORT  — renders the selected React template
     into a hidden off-screen container, captures it with
     html2canvas, and builds a multi-page jsPDF document.
     This mirrors CV Builder's downloadPDF exactly.
  ====================================================== */
  const exportToPDF = async () => {
    if (!formData.fullName || !formData.jobTitle) {
      alert("Please fill your name and job title first");
      return;
    }

    const TemplateComponent =
      CoverLetterTemplatesMap[selectedTemplate] ||
      CoverLetterTemplatesMap.professional;

    if (!TemplateComponent) {
      alert("No template selected");
      return;
    }

    setIsExporting(true);

    const PAGE_W = 794; // A4 @ 96 dpi
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "-9999px",
      width: `${PAGE_W}px`,
      background: "#ffffff",
      zIndex: "-1",
    });
    document.body.appendChild(container);

    try {
      const { createRoot } = await import("react-dom/client");

      await new Promise((resolve) => {
        const root = createRoot(container);
        root.render(
          <TemplateComponent formData={formData} exportDate={date} />
        );
        setTimeout(resolve, 500); // allow fonts / Tailwind to paint
      });

      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        logging: false,
        windowWidth: PAGE_W,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const mmPageW = 210;
      const mmPageH = 297;
      const pxPerMm = canvas.width / mmPageW;
      const pxSliceH = Math.round(mmPageH * pxPerMm);

      let yPx = 0;
      let first = true;

      while (yPx < canvas.height) {
        const sliceH = Math.min(pxSliceH, canvas.height - yPx);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pxSliceH;
        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, yPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const imgData = pageCanvas.toDataURL("image/jpeg", 0.96);
        if (!first) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, mmPageW, mmPageH);
        yPx += sliceH;
        first = false;
      }

      const sanitize = (s) =>
        (s || "").replace(/[^a-z0-9_ \-]/gi, "").trim().replace(/\s+/g, "_");
      const fileName =
        sanitize(documentTitle) || sanitize(formData.fullName) || "Cover-Letter";

      pdf.save(`${fileName}.pdf`);

      const html = container.innerHTML;
      await saveDownloadRecord(html, "PDF");
    } catch (err) {
      console.error("Cover letter PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      if (container.parentNode) document.body.removeChild(container);
      setIsExporting(false);
    }
  };

  /* ======================================================
     WORD EXPORT — renders the selected React template,
     captures its innerHTML, and wraps it in a minimal
     Word-compatible HTML envelope for .doc download.
  ====================================================== */
  const exportToWord = async () => {
    if (!formData.fullName || !formData.jobTitle) {
      alert("Please fill your name and job title first");
      return;
    }

    const TemplateComponent =
      CoverLetterTemplatesMap[selectedTemplate] ||
      CoverLetterTemplatesMap.professional;

    if (!TemplateComponent) {
      alert("No template selected");
      return;
    }

    setIsExporting(true);

    const PAGE_W = 794;
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "-9999px",
      width: `${PAGE_W}px`,
      background: "#ffffff",
      zIndex: "-1",
    });
    document.body.appendChild(container);

    try {
      const { createRoot } = await import("react-dom/client");

      await new Promise((resolve) => {
        const root = createRoot(container);
        root.render(
          <TemplateComponent formData={formData} exportDate={date} />
        );
        setTimeout(resolve, 500);
      });

      const bodyHtml = container.innerHTML;

      // Collect all inline <style> blocks from the rendered template
      const styleTags = Array.from(container.querySelectorAll("style"))
        .map((s) => s.outerHTML)
        .join("\n");

      const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Cover Letter</title>
${styleTags}
<style>
  @page { size: A4 portrait; margin: 0; }
  body { margin: 0; padding: 0; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;

      const sanitize = (s) =>
        (s || "").replace(/[^a-zA-Z0-9_ \-]/g, "").trim().replace(/\s+/g, "_");
      const fileName =
        sanitize(documentTitle) || sanitize(formData.fullName) || "Cover-Letter";

      const blob = new Blob(["\ufeff", wordHtml], {
        type: "application/msword;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await saveDownloadRecord(bodyHtml, "DOCX");
    } catch (err) {
      console.error("Cover letter Word export failed:", err);
      alert("Failed to export Word document. Please try again.");
    } finally {
      if (container.parentNode) document.body.removeChild(container);
      setTimeout(() => setIsExporting(false), 800);
    }
  };

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
        onDownloadWord={exportToWord}
        isDownloading={isExporting}
        title={documentTitle}
        onTitleChange={(_, val) => setDocumentTitle(val)}
        titlePlaceholder="Untitled Cover Letter"
        templatesLabel="Cover Letter Templates"
        showTabs={true}
        showAiToggle={true}
        isAiMode={isAiMode}
        onToggleAiMode={() => setIsAiMode((v) => !v)}
        showUpload={false}
        showDesigner={false}
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
