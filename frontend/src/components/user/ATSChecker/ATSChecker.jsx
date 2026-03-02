import "./ATSChecker.css";
import ATSPdfPreview from "./ATSPdfPreview";
import UserNavBar from "../UserNavBar/UserNavBar";
import {
  Upload,
  FileText,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Target,
  Shield,
  Zap,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pdfjs } from "react-pdf";
import "../../../styles/react-pdf/TextLayer.css";
import "../../../styles/react-pdf/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const SESSION_KEY = "ats_preview_pdf";

/* ─── Drag-and-Drop Upload Zone ─── */
function UploadZone({ onFileChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileChange({ target: { files: [file] } });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Header text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            AI-Powered Analysis
          </div>
          <h2
            className="text-3xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Check Your ATS Score
          </h2>
          <p className="text-slate-500 text-sm">
            Upload your resume and get an instant score with actionable feedback
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center group
            ${
              isDragging
                ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-100"
                : "border-slate-200 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md"
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
          />

          {/* Animated upload icon */}
          <motion.div
            animate={isDragging ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300
              ${isDragging ? "bg-blue-500 text-white" : "bg-white text-slate-400 group-hover:bg-blue-500 group-hover:text-white shadow-sm"}`}
          >
            <Upload size={28} />
          </motion.div>

          <p className="text-base font-semibold text-slate-700 mb-1">
            {isDragging ? "Drop it here!" : "Drag & drop your resume"}
          </p>
          <p className="text-sm text-slate-400 mb-5">
            or{" "}
            <span className="text-blue-500 font-medium">
              click to browse files
            </span>
          </p>

          <div className="flex justify-center gap-2">
            {["PDF", "DOC", "DOCX"].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white border border-slate-200 text-slate-400"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Feature pills */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            {
              icon: <Target size={14} />,
              label: "ATS Scoring",
              color: "text-blue-600 bg-blue-50",
            },
            {
              icon: <Shield size={14} />,
              label: "Spell Check",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              icon: <Zap size={14} />,
              label: "Instant Results",
              color: "text-amber-600 bg-amber-50",
            },
          ].map((f) => (
            <div
              key={f.label}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${f.color} text-xs font-semibold`}
            >
              {f.icon}
              {f.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Score Ring ─── */
function ScoreRing({ score, animated }) {
  const color =
    animated >= 70 ? "#10b981" : animated >= 50 ? "#f59e0b" : "#ef4444";
  const label =
    animated >= 70
      ? "ATS Friendly"
      : animated >= 50
        ? "Needs Work"
        : "Poor Match";
  const labelColor =
    animated >= 70
      ? "text-emerald-600 bg-emerald-50"
      : animated >= 50
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50";

  return (
    <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - animated}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1s ease, stroke 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-800">
            {score ? animated : "–"}
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
          ATS Score
        </p>
        <p className="text-3xl font-extrabold text-slate-900">
          {score ? animated : "–"}
          <span className="text-lg text-slate-300 font-normal">/100</span>
        </p>
        {score && (
          <span
            className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${labelColor}`}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Section Score Card ─── */
function SectionCard({ section }) {
  const isOk = section.status === "ok";
  const isWarn = section.status === "warn";

  return (
    <div
      className={`rounded-xl border p-3.5 mb-2 transition-all
      ${isOk ? "border-emerald-100 bg-emerald-50/60" : isWarn ? "border-amber-100 bg-amber-50/60" : "border-red-100 bg-red-50/60"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {isOk ? (
          <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
        ) : isWarn ? (
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
        ) : (
          <XCircle size={14} className="text-red-500 flex-shrink-0" />
        )}
        <span className="text-sm font-semibold text-slate-800">
          {section.sectionName}
        </span>
        <span
          className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full
          ${isOk ? "bg-emerald-100 text-emerald-700" : isWarn ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
        >
          {section.score}/20
        </span>
      </div>
      {section.suggestions?.length > 0 && (
        <ul className="mt-2 space-y-1 pl-5">
          {section.suggestions.map((s, i) => (
            <li key={i} className="text-xs text-slate-600 list-disc">
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Error Table ─── */
function ErrorTable({ errors, type, onSelect }) {
  const isSpell = type === "spell";
  return (
    <div
      className={`mt-4 rounded-xl border overflow-hidden
      ${isSpell ? "border-red-100" : "border-amber-100"}`}
    >
      <div
        className={`px-4 py-3 flex items-center gap-2 text-sm font-semibold
        ${isSpell ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
      >
        {isSpell ? <XCircle size={15} /> : <AlertTriangle size={15} />}
        {isSpell ? "Spelling Errors" : "Personal Pronouns Detected"}
        <span
          className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold
          ${isSpell ? "bg-red-100" : "bg-amber-100"}`}
        >
          {errors.length}
        </span>
      </div>
      <div className="overflow-auto max-h-48">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="py-2 px-4 text-left font-semibold text-slate-500">
                Word
              </th>
              <th className="py-2 px-3 text-left font-semibold text-slate-500">
                Page
              </th>
              <th className="py-2 px-3 text-left font-semibold text-slate-500">
                Line
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {errors.map((e, i) => (
              <tr
                key={i}
                onClick={() => onSelect(e)}
                className={`border-b border-slate-50 cursor-pointer transition-colors
                  ${isSpell ? "hover:bg-red-50" : "hover:bg-amber-50"}`}
              >
                <td
                  className={`py-2 px-4 font-semibold ${isSpell ? "text-red-600" : "text-amber-600"}`}
                >
                  {e.word}
                </td>
                <td className="py-2 px-3 text-slate-500">{e.page}</td>
                <td className="py-2 px-3 text-slate-500">{e.line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const PANEL_HEIGHT = "calc(100vh - 180px)";

const ATSChecker = ({ onSidebarToggle }) => {
  const fileInputRef = useRef(null);
  const [isMobilePreviewExpanded, setIsMobilePreviewExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [resumeText, setResumeText] = useState("");
  const [spellingErrors, setSpellingErrors] = useState([]);
  const [pronounErrors, setPronounErrors] = useState([]);
  const [activeError, setActiveError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfInstance, setPdfInstance] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /* ── Score animation ── */
  useEffect(() => {
    if (analysisResult?.overallScore >= 0) {
      let start = 0;
      const end = Number(analysisResult.overallScore);
      const step = end / (1000 / 15);
      const counter = setInterval(() => {
        start += step;
        if (start >= end) {
          start = end;
          clearInterval(counter);
        }
        setAnimatedScore(Math.floor(start));
      }, 15);
      return () => clearInterval(counter);
    }
  }, [analysisResult]);

  /* ── Revoke blob on unmount ── */
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  /* ── Mobile detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Resize ── */
  useEffect(() => {
    const h = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  /* ── Clear session on mount ── */
  useEffect(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("ats_analysis_result");
  }, []);

  /* ── Spell locator ── */
  useEffect(() => {
    const run = async () => {
      if (pdfInstance && analysisResult?.misspelledWords?.length) {
        const located = await buildErrorLocationsFromPdf(
          pdfInstance,
          analysisResult.misspelledWords,
        );
        setSpellingErrors(located);
      }
    };
    run();
  }, [pdfInstance, analysisResult]);

  /* ── Highlight active error ── */
  const applyHighlights = () => {
    const spans = document.querySelectorAll(
      ".react-pdf__Page__textContent span",
    );
    spans.forEach((span) => {
      span.style.background = "";
      span.style.borderBottom = "";
    });
    if (!activeError) return;
    const matching = Array.from(spans).filter((span) => {
      const clean = span.textContent?.toLowerCase().replace(/[^a-z]/g, "");
      const pg = span
        .closest(".react-pdf__Page")
        ?.getAttribute("data-page-number");
      return clean === activeError.word && Number(pg) === activeError.page;
    });
    const target = matching[activeError.index || 0];
    if (!target) return;
    const isPronouns = ["i", "we", "us", "our", "my"].includes(
      activeError.word,
    );
    target.style.background = isPronouns ? "#fff3cd" : "yellow";
    target.style.borderBottom = `3px solid ${isPronouns ? "#f59e0b" : "red"}`;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  useEffect(() => {
    applyHighlights();
  }, [activeError]);

  /* ── File change ── */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
    setIsAnalyzing(true);

    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      sessionStorage.setItem(SESSION_KEY, url);

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobTitle", "Placeholder title");
      formData.append("templateId", "63f1c4e2a3b4d5f678901234");
      formData.append("resumeprofileId", "63f1c4e2a3b4d5f678901235");

      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/resume/upload", {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const rawText = await res.text();

        if (!res.ok) {
          console.error(`Server error [${res.status}]:`, rawText.slice(0, 500));
          return;
        }

        let data;
        try {
          data = JSON.parse(rawText);
        } catch {
          console.error("Expected JSON but got:", rawText.slice(0, 300));
          return;
        }

        if (data.success) {
          setAnalysisResult(data.data);
          if (data.data.pronounAnalysis?.detected)
            setPronounErrors(data.data.pronounAnalysis.detected);
          setResumeText(data?.data?.text || "");
          sessionStorage.setItem(
            "ats_analysis_result",
            JSON.stringify(data.data),
          );
        } else {
          console.error("API returned success: false →", data?.message || data);
        }
      } catch (err) {
        console.error(
          "ATS fetch failed — is the backend running on port 5000?",
          err,
        );
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setPreviewUrl(null);
      sessionStorage.removeItem(SESSION_KEY);
      setAnalysisResult(null);
      sessionStorage.removeItem("ats_analysis_result");
      setIsAnalyzing(false);
    }
  };

  const buildErrorLocationsFromPdf = async (pdf, wrongWords) => {
    if (!pdf || !wrongWords?.length) return [];
    const errors = [];
    const wordCount = {};
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const text = content.items.map((i) => i.str).join(" ");
      const lines = text.split(/\s{2,}|\n/);
      lines.forEach((line, li) => {
        line.split(/\s+/).forEach((token) => {
          const clean = token.toLowerCase().replace(/[^a-z]/g, "");
          if (wrongWords.includes(clean)) {
            wordCount[clean] = (wordCount[clean] || 0) + 1;
            errors.push({
              word: clean,
              page: p,
              line: li + 1,
              index: wordCount[clean] - 1,
            });
          }
        });
      });
    }
    return errors;
  };

  return (
    <div className="ats-checker-page user-page min-h-screen bg-[#f8f9fc]">
      <UserNavBar onMenuClick={onSidebarToggle || (() => {})} />

      {/* ── Page Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-extrabold text-slate-900"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              ATS Resume Checker
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Instant AI-powered resume analysis & optimization
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Upload size={16} />
            Upload Resume
          </button>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row gap-5 items-stretch">
        {/* ── LEFT PANEL: Analysis ── */}
        <div
          className="w-full md:w-[340px] flex-shrink-0 flex flex-col gap-4 order-2 md:order-1"
          style={{ minHeight: PANEL_HEIGHT }}
        >
          <div
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
            style={{ minHeight: PANEL_HEIGHT }}
          >
            {/* Panel header */}
            <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-base">
                  Analysis Results
                </h2>
                {isAnalyzing && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
                    />
                    Analyzing…
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              {/* Score Ring */}
              {analysisResult ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <ScoreRing score={analysisResult} animated={animatedScore} />
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="rounded-2xl border-2 border-dashed border-slate-100 p-8 text-center w-full">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                      <Target size={28} className="text-slate-200" />
                    </div>
                    <p className="text-sm font-semibold text-slate-400 mb-1">
                      No resume uploaded yet
                    </p>
                    <p className="text-xs text-slate-300">
                      Upload a resume on the right to see your ATS score here
                    </p>
                  </div>
                </div>
              )}

              {/* Section Scores */}
              {analysisResult?.sectionScores?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Section Breakdown
                  </p>
                  {analysisResult.sectionScores.map((s, i) => (
                    <SectionCard key={i} section={s} />
                  ))}
                </motion.div>
              )}

              {/* Error Tables */}
              <AnimatePresence>
                {spellingErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ErrorTable
                      errors={spellingErrors}
                      type="spell"
                      onSelect={setActiveError}
                    />
                  </motion.div>
                )}
                {pronounErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ErrorTable
                      errors={pronounErrors}
                      type="pronoun"
                      onSelect={setActiveError}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Preview ── */}
        <div className="flex-1 flex flex-col gap-4 order-1 md:order-2">
          {/* Mobile toggle */}
          <button
            className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white border border-slate-100 rounded-xl shadow-sm"
            onClick={() => setIsMobilePreviewExpanded((v) => !v)}
          >
            <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
              <FileText size={18} className="text-blue-500" />
              Document Preview
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${isMobilePreviewExpanded ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {(isMobilePreviewExpanded || !isMobile) && (
              <motion.div
                initial={isMobile ? { height: 0, opacity: 0 } : false}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                style={{ minHeight: PANEL_HEIGHT }}
              >
                {previewUrl ? (
                  <div
                    className="w-full flex-1"
                    style={{ minHeight: PANEL_HEIGHT }}
                  >
                    <ATSPdfPreview
                      pdfUrl={previewUrl}
                      onLoadSuccess={(pdf) => {
                        setNumPages(pdf.numPages);
                        setPdfInstance(pdf);
                      }}
                    />
                  </div>
                ) : (
                  <UploadZone onFileChange={handleFileChange} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="footer pb-6">
        © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default ATSChecker;
