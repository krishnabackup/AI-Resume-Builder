import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FormTabs from "./FormTabs";
import UserNavBar from "../UserNavBar/UserNavBar";
import axios from "axios";
import axiosInstance from "../../../api/axios";
import { toast } from "react-hot-toast";
import { ArrowRight, X } from "lucide-react";

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
  resumeText: "",
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

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const CVBuilder = () => {
  const navigate = useNavigate();
  const formContainerRef = useRef(null);
  const headerRef = useRef(null);
  const leftColRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  const [activeTab, setActiveTab] = useState("builder");
  const [activeSection, setActiveSection] = useState("personal");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [formData, setFormData] = useState(() => createEmptyResume());

  /* ======================================================
   SAVE RECENT ACTIVITY (visited / preview / download)
====================================================== */

  const saveRecentActivity = async (html, action = "visited") => {
    try {
      const displayData = mergeWithSampleData(formData);

      const sanitize = (s) =>
        (s || "")
          .replace(/[^a-z0-9_\- ]/gi, "")
          .trim()
          .replace(/\s+/g, "_");

      const nameToUse =
        sanitize(documentTitle) || sanitize(displayData.fullName) || "Document";

      await axiosInstance.post("/api/downloads", {
        name: `CV - ${nameToUse}`,
        type: "cv",
        action,
        format: "PDF",
        html,
        template: selectedTemplate,
        size: "250 KB",
      });
    } catch (err) {
      console.error("Failed to save CV activity:", err);
    }
  };

  /* ======================================================
   SAVE ACTIVITY WHEN CV IS EDITED
====================================================== */
  useEffect(() => {
    const saveEditActivity = async () => {
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
        setTimeout(resolve, 300);
      });

      const html = container.innerHTML;

      await saveRecentActivity(html, "visited");

      document.body.removeChild(container);
    };

    const timer = setTimeout(saveEditActivity, 5000);

    return () => clearTimeout(timer);
  }, [formData, selectedTemplate]);

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
      // Use document title first, then merged data for consistent naming
      const displayData = mergeWithSampleData(formData);
      const nameToUse = documentTitle || displayData.fullName || "Document";
      await axiosInstance.post("/api/downloads", {
        name: `CV - ${nameToUse}`,
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

  useEffect(() => {
    // check if visit already saved in this session
    if (sessionStorage.getItem("cv-builder-visited")) return;

    const saveVisit = async () => {
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

      await saveRecentActivity(html, "visited");

      document.body.removeChild(container);

      // mark that visit was saved
      sessionStorage.setItem("cv-builder-visited", "true");
    };

    const timer = setTimeout(saveVisit, 2000);

    return () => clearTimeout(timer);
  }, []);

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
      await saveRecentActivity(html, "preview");
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

        const latest = res.data?.data;

        if (latest) {
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

          if (latest.templateId) {
            setSelectedTemplate(latest.templateId);
          }

          toast.success("Resume loaded");
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error loading resume:", err);
        }
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

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file format
    const isValidFormat =
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx");

    if (!isValidFormat) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    toast.loading("Processing uploaded resume...");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobTitle", "CV Builder Upload");
      formData.append("templateId", selectedTemplate || "professional");

      // Try to get user ID from token or use a default
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Parse token to get user ID if available
      let userId = null;
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]));
          userId = tokenPayload.id || tokenPayload.userId;
        } catch (e) {
          console.log("Could not parse user ID from token");
        }
      }

      // Use user ID as resumeprofileId if available, otherwise use a default
      if (userId) {
        formData.append("resumeprofileId", userId);
      } else {
        // Use a default ObjectId format - this will need to be handled by backend
        formData.append("resumeprofileId", "000000000000000000000000");
      }

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const rawText = await res.text();

      if (!res.ok) {
        console.error(`Server error [${res.status}]:`, rawText.slice(0, 500));
        toast.error("Failed to upload resume");
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("Expected JSON but got:", rawText.slice(0, 300));
        toast.error("Invalid server response");
        return;
      }

      if (data.success && data.data?.extractedData) {
        // Update form data with extracted information
        const extracted = data.data.extractedData;
        const resumeText = data.data.text || "";

        // Create a comprehensive summary from the resume text if no summary was extracted
        let summary = extracted.summary;
        if (!summary && resumeText) {
          // Take first few meaningful lines of resume as summary
          const lines = resumeText
            .split("\n")
            .filter((line) => line.trim().length > 20);
          summary = lines
            .slice(0, 3)
            .join(" ")
            .replace(/\s+/g, " ")
            .substring(0, 300);
        }

        // Enhance experience data with better formatting
        let enhancedExperience = extracted.experience || [];
        if (enhancedExperience.length === 0 && resumeText) {
          // Try to extract better experience from text
          const lines = resumeText.split("\n");
          let currentExp = null;

          for (const line of lines) {
            const trimmedLine = line.trim();

            // Look for job title patterns
            if (
              trimmedLine.length > 15 &&
              !trimmedLine.match(
                /^(summary|profile|about|objective|education|skills|contact|certifications|languages|interests|references)/i,
              )
            ) {
              // Detect job entries with various patterns
              const jobPatterns = [
                /(.+?)\s+(at|@|-.+)\s+(\d{4}|\w+\s\d{4})\s*[-–—]\s*(\d{4}|\w+\s\d{4}|present|current|now)/i,
                /(.+?)\s+(at|@|-.+)\s+(\d{4})\s*[-–—]\s*(\d{4}|present|current|now)/i,
                /(.+?)\s+(at|@|-.+)/i,
              ];

              let matched = false;
              for (const pattern of jobPatterns) {
                const match = trimmedLine.match(pattern);
                if (match) {
                  if (currentExp && currentExp.description) {
                    enhancedExperience.push(currentExp);
                  }

                  currentExp = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: match[1] ? match[1].trim() : "Professional",
                    company: match[2]
                      ? match[2].replace(/^(at|@|-)\s+/i, "").trim()
                      : "Organization",
                    location: "",
                    startDate: match[3] || "",
                    endDate: match[4] || "",
                    description: "",
                  };
                  matched = true;
                  break;
                }
              }

              if (!matched && currentExp && trimmedLine.length > 30) {
                // Add as description if it looks like a responsibility/achievement
                if (trimmedLine.match(/^•|^-|\*|^\d+\.|^[A-Z][a-z]/)) {
                  currentExp.description += trimmedLine + "\n";
                }
              }
            }
          }

          if (currentExp && currentExp.description) {
            enhancedExperience.push(currentExp);
          }
        }

        // Clean up experience descriptions with better formatting
        enhancedExperience = enhancedExperience.map((exp) => {
          let cleanDescription = "";
          if (exp.description) {
            // Split into lines and clean each one
            const lines = exp.description.split("\n");
            const cleanLines = lines
              .map((line) => line.trim())
              .filter((line) => line.length > 10)
              .map((line) => {
                // Remove bullet points and clean up
                let cleaned = line.replace(/^[-•*]\s*/, "").trim();
                // Remove numbering
                cleaned = cleaned.replace(/^\d+\.\s*/, "").trim();
                // Capitalize first letter
                if (cleaned.length > 0) {
                  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                }
                return cleaned;
              })
              .filter((line) => line.length > 5);

            // Join with proper formatting - add bullet points for clarity
            cleanDescription = cleanLines.map((line) => `• ${line}`).join("\n");
          }

          return {
            ...exp,
            title: exp.title ? exp.title.trim() : "Professional Position",
            company: exp.company ? exp.company.trim() : "Company Name",
            location: exp.location ? exp.location.trim() : "",
            startDate: exp.startDate ? exp.startDate.trim() : "",
            endDate: exp.endDate ? exp.endDate.trim() : "",
            description: cleanDescription,
          };
        });

        // Enhance education data with better formatting
        let enhancedEducation = extracted.education || [];
        if (enhancedEducation.length === 0 && resumeText) {
          // Extract education from text
          const educationLines = resumeText.split("\n");
          for (const line of educationLines) {
            const trimmedLine = line.trim();
            const eduPatterns = [
              /(.+?)\s+(bachelor|master|phd|b\.sc|m\.sc|b\.tech|m\.tech|b\.e|m\.e|b\.com|m\.com|diploma|certificate).+?(\d{4})/i,
              /(.+?)\s+(bachelor|master|phd|b\.sc|m\.sc|b\.tech|m\.tech|b\.e|m\.e|b\.com|m\.com|diploma|certificate)/i,
            ];

            for (const pattern of eduPatterns) {
              const match = trimmedLine.match(pattern);
              if (match) {
                enhancedEducation.push({
                  id: Math.random().toString(36).substr(2, 9),
                  school: match[1] ? match[1].trim() : "University",
                  degree: match[2] ? match[2].trim() : "Degree",
                  location: "",
                  graduationDate: match[3] || "",
                  gpa: "",
                });
                break;
              }
            }
          }
        }

        // Clean up education data
        enhancedEducation = enhancedEducation.map((edu) => ({
          ...edu,
          school: edu.school ? edu.school.trim() : "University Name",
          degree: edu.degree ? edu.degree.trim() : "Degree Title",
          location: edu.location ? edu.location.trim() : "",
          graduationDate: edu.graduationDate ? edu.graduationDate.trim() : "",
          gpa: edu.gpa ? edu.gpa.trim() : "",
        }));

        console.log("🔍 Enhanced Experience Data:", enhancedExperience);
        console.log("🔍 Enhanced Education Data:", enhancedEducation);
        console.log("🔍 Extracted Skills:", extracted.skills);
        console.log("Parsed resume data:", extracted);

        setFormData((prev) => ({
          ...prev,
          fullName: extracted.name || prev.fullName,
          email: extracted.email || prev.email,
          phone: extracted.phone || prev.phone,
          summary: summary || prev.summary,

          experience:
            enhancedExperience.length > 0
              ? enhancedExperience
              : prev.experience,

          education:
            enhancedEducation.length > 0 ? enhancedEducation : prev.education,

          certifications: extracted.certifications?.length
            ? extracted.certifications
            : prev.certifications,

          skills: extracted.skills || prev.skills,

          resumeText: resumeText,
        }));

        const expCount = enhancedExperience.length;
        const eduCount = enhancedEducation.length;
        const techSkills = extracted.skills?.technical?.length || 0;
        const softSkills = extracted.skills?.soft?.length || 0;

        toast.success(
          `Resume uploaded successfully! Found ${expCount} experiences, ${eduCount} education entries, ${techSkills} technical skills, and ${softSkills} soft skills.`,
        );
      } else {
        toast.error("Failed to parse resume content");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 relative z-0 flex flex-col">
      {/* ── Sticky: navbar only ── */}
      <div
        ref={headerRef}
        className="sticky top-0 z-30 bg-gradient-to-br from-slate-50 to-gray-50"
      >
        <UserNavBar />
      </div>

      {/* ── Scrollable: topbar + banner ── */}
      <CVBuilderTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSave}
        onDownload={downloadPDF}
        onDownloadWord={downloadWord}
        onUpload={handleUpload}
        isSaving={isSaving}
        isDownloading={isDownloading}
        title={documentTitle}
        onTitleChange={(_, val) => setDocumentTitle(val)}
        isAiMode={isAiMode}
        onToggleAiMode={() => setIsAiMode((v) => !v)}
      />

      <div className="px-2 py-4 sm:px-4 lg:px-4 w-screen max-w-full mx-0">
        {activeTab === "builder" && <ResumeCompletionBanner />}

        {/* ════ BUILDER TAB ════ */}
        {activeTab === "builder" && (
          <div className="flex gap-5 w-full mt-2 lg:mt-5 p-0 sm:p-2 lg:flex-row flex-col max-w-[1920px] mx-auto relative z-10">
            {/* ── LEFT: floating form panel (desktop) ── */}
            {!isPreviewMaximized && (
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
                    {/* Tabs */}
                    <div className="flex-shrink-0 border-b border-slate-100 px-4 py-3 bg-white">
                      <FormTabs
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        showPreview={showMobilePreview}
                        onTogglePreview={async () => {
                          const TemplateComponent =
                            CVTemplates[selectedTemplate];

                          if (!TemplateComponent) {
                            setShowMobilePreview((v) => !v);
                            return;
                          }

                          const container = document.createElement("div");

                          Object.assign(container.style, {
                            position: "fixed",
                            top: "0",
                            left: "-9999px",
                            width: `${PDF_PAGE_WIDTH_PX}px`,
                          });

                          document.body.appendChild(container);

                          const { createRoot } =
                            await import("react-dom/client");

                          const displayData = mergeWithSampleData(formData);

                          await new Promise((resolve) => {
                            const root = createRoot(container);
                            root.render(
                              <TemplateComponent formData={displayData} />,
                            );
                            setTimeout(resolve, 300);
                          });

                          const html = container.innerHTML;

                          await saveRecentActivity(html, "preview");

                          document.body.removeChild(container);

                          setShowMobilePreview((v) => !v);
                        }}
                      />
                    </div>

                    {/* Scrollable form content */}
                    <div
                      ref={formContainerRef}
                      className="flex-1 overflow-y-auto p-6 pb-2"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#e2e8f0 transparent",
                      }}
                    >
                      {renderFormContent()}
                    </div>

                    {/* Prev / Next */}
                    <div className="flex justify-between mt-auto p-4 border-t border-slate-100 bg-white">
                      <button
                        onClick={goPrevious}
                        disabled={currentIndex === 0}
                        className="flex gap-1 items-center px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium disabled:opacity-40 hover:bg-slate-200 transition-colors text-sm"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={goNext}
                        disabled={currentIndex === sections.length - 1}
                        className="flex gap-2 items-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <span className="hidden sm:inline">Next Step</span>
                        <ArrowRight size={16} />
                      </button>
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
                    onTogglePreview={async () => {
                      const TemplateComponent = CVTemplates[selectedTemplate];

                      if (!TemplateComponent) {
                        setShowMobilePreview((v) => !v);
                        return;
                      }

                      const container = document.createElement("div");

                      Object.assign(container.style, {
                        position: "fixed",
                        top: "0",
                        left: "-9999px",
                        width: `${PDF_PAGE_WIDTH_PX}px`,
                      });

                      document.body.appendChild(container);

                      const { createRoot } = await import("react-dom/client");

                      const displayData = mergeWithSampleData(formData);

                      await new Promise((resolve) => {
                        const root = createRoot(container);
                        root.render(
                          <TemplateComponent formData={displayData} />,
                        );
                        setTimeout(resolve, 300);
                      });

                      const html = container.innerHTML;

                      await saveRecentActivity(html, "preview");

                      document.body.removeChild(container);

                      setShowMobilePreview((v) => !v);
                    }}
                  />
                </div>
                <div className="flex-1 overflow-y-auto min-h-[400px] p-6 pb-2 bg-slate-50/50">
                  {renderFormContent()}
                </div>
                <div className="flex justify-between p-4 bg-white border-t border-slate-100">
                  <button
                    onClick={goPrevious}
                    disabled={currentIndex === 0}
                    className="flex gap-1 items-center px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium disabled:opacity-40 hover:bg-slate-200 transition-colors text-sm"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === sections.length - 1}
                    className="flex gap-1 items-center px-4 py-2 rounded-lg bg-black text-white font-medium disabled:opacity-40 hover:bg-slate-800 transition-colors text-sm"
                  >
                    Next →
                  </button>
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
          <div className="pb-16 pt-4">
            <TemplatesGallery
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
              formData={formData}
            />
          </div>
        )}
      </div>

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
      <footer className="mt-auto text-center py-4 bg-white border-t text-sm text-gray-600">
        © 2023 ResumeAI Inc. All rights reserved.
      </footer>
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
