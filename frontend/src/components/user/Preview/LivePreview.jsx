import React, {
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReactDOM from "react-dom";
import {
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  Layers,
  CheckCircle2,
  Circle,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import {
  getTemplateComponent,
  getTemplateCSS,
} from "../Templates/TemplateRegistry";
import PaginatedPreview from "../CV/PaginatedPreview"; // Reusing the exact CV pagination

/* ─── constants ─────────────────────────────────────────────────────────── */
const PAGE_WIDTH = 794;
const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.0;
const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pct = (z) => `${Math.round(z * 100)}%`;

const SHORTCUTS = {
  "+": "zoomIn",
  "=": "zoomIn",
  "-": "zoomOut",
  0: "resetZoom",
  ArrowLeft: "prevPage",
  ArrowRight: "nextPage",
  f: "toggleFullscreen",
  F: "toggleFullscreen",
};

/* ─── useElementWidth ────────────────────────────────────────────────────── */
function useElementWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    setW(ref.current.clientWidth);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/* ─── atom components ────────────────────────────────────────────────────── */
const Divider = () => (
  <div
    style={{
      width: 1,
      height: 18,
      background: "#e2e8f0",
      flexShrink: 0,
      margin: "0 1px",
    }}
  />
);

const IconBtn = ({
  onClick,
  disabled = false,
  active = false,
  title,
  children,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: 7,
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      background: active ? "#0f172a" : "transparent",
      color: disabled ? "#94a3b8" : active ? "#f8fafc" : "#475569",
      opacity: disabled ? 0.4 : 1,
      transition: "background 0.12s, color 0.12s",
      flexShrink: 0,
    }}
    onMouseEnter={(e) => {
      if (!disabled && !active) e.currentTarget.style.background = "#f1f5f9";
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.background = "transparent";
    }}
  >
    {children}
  </button>
);

const Badge = ({ green, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: "monospace",
      background: green ? "#dcfce7" : "#dbeafe",
      color: green ? "#15803d" : "#1d4ed8",
      flexShrink: 0,
    }}
  >
    {green ? <CheckCircle2 size={10} /> : <Circle size={10} />}
    {children}
  </span>
);

const PagePill = ({ current, total }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: "0 8px",
      height: 26,
      borderRadius: 7,
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      fontSize: 12,
      fontFamily: "monospace",
      fontWeight: 700,
      color: "#1e293b",
      flexShrink: 0,
      minWidth: 52,
      justifyContent: "center",
    }}
  >
    {current}
    <span style={{ color: "#94a3b8", fontWeight: 400, margin: "0 1px" }}>
      /
    </span>
    {total}
  </div>
);

/* ─── Default Layout Helpers ───────────────────────────────────────────────────────── */
function formatMonthYear(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(month) - 1]}-${year}`;
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b mb-2">
        {title}
      </h2>
      <div className="text-slate-600 text-xs">{children}</div>
    </section>
  );
}

/* ─── main ───────────────────────────────────────────────────────────────── */
const LivePreview = forwardRef((props, ref) => {
  const { formData, currentTemplate, isExpanded, onExpand, onCollapse } = props;

  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const rootWidth = useElementWidth(rootRef);

  // responsive breakpoints
  const isNarrow = rootWidth > 0 && rootWidth < 400;
  const isCompact = rootWidth > 0 && rootWidth < 620;

  const [manualZoom, setManualZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const resume_doc = useRef(null);

  // Expose function for downloading the document via html
  const getResumeHTML = () => {
    if (!resume_doc.current) return "";
    const resumeHTML = resume_doc.current.outerHTML;

    // Safely get template CSS
    let TemplateComponentCSSPath = "";
    try {
      const templateId = currentTemplate?.id || currentTemplate;
      TemplateComponentCSSPath = templateId ? getTemplateCSS(templateId) : "";
    } catch (e) {
      console.warn("Could not load template CSS", e);
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>resume</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            ${TemplateComponentCSSPath || ""}
          </style>
        </head>
        <body>${resumeHTML}</body>
      </html>
    `;
  };

  useImperativeHandle(ref, () => ({
    getResumeHTML,
  }));

  /* ── auto-fit ─────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const w = containerRef.current.clientWidth - (isNarrow ? 24 : 40);
      setFitZoom(clamp(w / PAGE_WIDTH, ZOOM_MIN, 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isExpanded, rootWidth, isNarrow]);

  const effectiveZoom = useMemo(
    () => clamp(manualZoom * fitZoom, ZOOM_MIN, ZOOM_MAX),
    [manualZoom, fitZoom],
  );

  /* ── zoom / nav ───────────────────────────────────────────────────────── */
  const zoomIn = useCallback(
    () =>
      setManualZoom((z) =>
        clamp(+(z + ZOOM_STEP).toFixed(2), ZOOM_MIN, ZOOM_MAX),
      ),
    [],
  );
  const zoomOut = useCallback(
    () =>
      setManualZoom((z) =>
        clamp(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN, ZOOM_MAX),
      ),
    [],
  );
  const resetZoom = useCallback(() => setManualZoom(1), []);
  const goPrev = useCallback(
    () => setCurrentPage((p) => Math.max(1, p - 1)),
    [],
  );
  const goNext = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTemplate, formData]);

  /* ── keyboard ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const action = SHORTCUTS[e.key];
      if (!action) return;
      e.preventDefault();
      const map = {
        zoomIn,
        zoomOut,
        resetZoom,
        prevPage: goPrev,
        nextPage: goNext,
        toggleFullscreen: () => {
          if (isExpanded) {
            onCollapse();
          } else {
            onExpand();
          }
          setManualZoom(1);
        },
      };
      map[action]?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    zoomIn,
    zoomOut,
    resetZoom,
    goPrev,
    goNext,
    isExpanded,
    onExpand,
    onCollapse,
  ]);

  /* ── default layout fallback ───────────────────────────────────────────────────────── */
  const {
    fullName,
    email,
    phone,
    location,
    linkedin,
    website,
    summary,
    experience = [],
    education = [],
    skills = {},
    projects = [],
    certifications = [],
  } = formData;

  const isUserData = Object.values(formData).some((v) => {
    if (Array.isArray(v)) return v.length > 0 && Object.keys(v[0]).length > 1; // Assuming array of objects
    if (typeof v === "object" && v !== null)
      return Object.values(v).some((arr) => arr?.length > 0); // For skills arrays
    return v !== "" && v !== undefined && v !== null;
  });

  const PreviewContent = () => {
    const templateId = currentTemplate?.id || currentTemplate;
    const TemplateComponent = templateId
      ? getTemplateComponent(templateId)
      : null;

    if (TemplateComponent) {
      return (
        <div ref={resume_doc}>
          <TemplateComponent data={formData} />
        </div>
      );
    }

    // Default Layout logic from before
    return (
      <div
        ref={resume_doc}
        className="w-full text-slate-800 text-sm leading-relaxed relative bg-white min-h-[1123px] p-12 overflow-hidden box-border"
      >
        <div className="pb-6 w-full">
          {fullName && (
            <h1 className="text-3xl font-semibold text-gray-900 mb-1 tracking-tight">
              {fullName}
            </h1>
          )}
          <div className="text-slate-500 flex flex-wrap gap-3 text-xs mt-2 break-all">
            {location && (
              <span className="flex gap-1 items-center">
                <MapPin size={14} /> {location}
              </span>
            )}
            {email && (
              <span className="flex gap-1 items-center break-all">
                <Mail size={14} /> {email}
              </span>
            )}
            {phone && (
              <span className="flex gap-1 items-center">
                <Phone size={14} /> {phone}
              </span>
            )}
            {linkedin && (
              <span className="flex gap-1 items-center break-all">
                <FaLinkedin /> {linkedin}
              </span>
            )}
            {website && (
              <span className="flex gap-1 items-center break-all">
                <Globe size={14} /> {website}
              </span>
            )}
          </div>

          {(fullName || email || phone || location || linkedin || website) && (
            <hr className="text-slate-200 mt-4" />
          )}
        </div>

        {summary && (
          <Section title="Professional Summary">
            <p className="break-words overflow-wrap-anywhere">{summary}</p>
          </Section>
        )}

        {education?.some(
          (edu) =>
            edu.school ||
            edu.degree ||
            edu.gpa ||
            edu.startDate ||
            edu.graduationDate ||
            edu.location,
        ) && (
          <Section title="Education">
            {education.map(
              (edu) =>
                (edu?.degree ||
                  edu?.startDate ||
                  edu?.graduationDate ||
                  edu?.school ||
                  edu?.gpa) && (
                  <div
                    key={edu?.id}
                    className="border-l-2 border-slate-200 pl-4 mb-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-medium text-slate-900">
                        {edu?.degree}
                      </h3>
                      {edu?.startDate && edu?.graduationDate && (
                        <span className="text-sm text-slate-500">
                          {formatMonthYear(edu?.startDate)} -{" "}
                          {formatMonthYear(edu?.graduationDate)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600">{edu?.school}</p>

                    {edu?.gpa && (
                      <p className="text-sm text-slate-500">
                        GPA: {edu?.gpa} / 10.0
                      </p>
                    )}
                  </div>
                ),
            )}
          </Section>
        )}

        {experience?.some(
          (exp) =>
            exp.title ||
            exp.company ||
            exp.description ||
            exp.startDate ||
            exp.endDate ||
            exp.location,
        ) && (
          <Section title="Experience">
            {experience.map(
              (exp) =>
                (exp?.title ||
                  exp?.company ||
                  exp?.startDate ||
                  exp?.endDate ||
                  exp?.description) && (
                  <div key={exp?.id}>
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {exp?.title}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {exp?.company}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {formatMonthYear(exp?.startDate)} -{" "}
                          {!/[a-zA-Z]/.test(exp?.endDate)
                            ? formatMonthYear(exp?.endDate)
                            : exp?.endDate}
                        </span>
                      </div>
                      <p className="mt-2 break-words">{exp.description}</p>
                    </div>
                  </div>
                ),
            )}
          </Section>
        )}

        {projects?.some(
          (project) =>
            project.name ||
            project.description ||
            project.technologies ||
            project?.link?.github ||
            project?.link?.liveLink ||
            project?.link?.other,
        ) && (
          <Section title="Projects">
            {projects.map(
              (prj) =>
                (prj?.name ||
                  prj?.link?.github ||
                  prj?.link?.liveLink ||
                  prj?.link?.other ||
                  prj?.technologies ||
                  prj?.description) && (
                  <div key={prj?.id} className="space-y-4">
                    {/* Project Item */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold text-slate-900">
                          {prj?.name}
                        </h3>

                        <div className="flex gap-2">
                          {prj?.link?.github && (
                            <a
                              href={prj?.link?.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-500 hover:text-slate-900 underline whitespace-nowrap"
                            >
                              GitHub
                            </a>
                          )}
                          {prj?.link?.liveLink && (
                            <a
                              href={prj?.link?.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-500 hover:text-slate-900 underline whitespace-nowrap"
                            >
                              Live
                            </a>
                          )}
                          {prj?.link?.other && (
                            <a
                              href={prj?.link?.other}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-500 hover:text-slate-900 underline whitespace-nowrap"
                            >
                              Other
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600">
                        {prj?.technologies}
                      </p>

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {prj?.description}
                      </p>
                    </div>
                  </div>
                ),
            )}
          </Section>
        )}

        {certifications?.some(
          (cert) => cert.name || cert.issuer || cert.date || cert.link,
        ) && (
          <Section title="Certifications">
            <section className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">
                      {cert.name}
                    </h3>

                    <p className="text-sm text-slate-600">{cert.issuer}</p>

                    <p className="text-sm text-slate-500">{cert.date}</p>
                  </div>

                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-500 hover:text-slate-900 underline whitespace-nowrap"
                    >
                      Credential
                    </a>
                  )}
                </div>
              ))}
            </section>
          </Section>
        )}

        {(skills?.technical?.length !== 0 || skills?.soft?.length !== 0) && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-bold text-sm">Technical Skills:</span>
              <div className="flex gap-2">
                {skills?.technical?.length !== 0 &&
                  skills?.technical?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-slate-100 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
            <div className="flex flex-nowrap gap-2 items-start mt-2">
              <span className="font-bold text-sm whitespace-nowrap">
                Soft Skills:
              </span>
              <div className="flex gap-2 flex-wrap w-[85%]">
                {skills?.soft?.length !== 0 &&
                  skills?.soft?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-slate-100 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </Section>
        )}
      </div>
    );
  };

  /* ── toolbar ──────────────────────────────────────────────────────────── */
  const Toolbar = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        padding: "0 10px",
        height: 46,
        background: "#ffffff",
        borderBottom: "1px solid #e8edf3",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          minWidth: 0,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "monospace",
            color: "#0f172a",
            whiteSpace: "nowrap",
          }}
        >
          <Eye size={14} strokeWidth={2.2} />
          {!isNarrow && "Preview"}
        </div>
        {!isNarrow && currentTemplate?.name && (
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 120,
            }}
          >
            {currentTemplate.name}
          </span>
        )}
        <Badge green={isUserData}>{isUserData ? "Your data" : "Sample"}</Badge>
        {totalPages > 1 && !isCompact && (
          <span
            style={{
              fontSize: 10,
              color: "#94a3b8",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
          >
            <Layers size={9} style={{ display: "inline", marginRight: 2 }} />
            {totalPages}p
          </span>
        )}
      </div>

      {/* right */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
      >
        {totalPages > 1 && (
          <>
            <IconBtn
              onClick={goPrev}
              disabled={currentPage === 1}
              title="Prev page (←)"
            >
              <ChevronLeft size={15} />
            </IconBtn>
            <PagePill current={currentPage} total={totalPages} />
            <IconBtn
              onClick={goNext}
              disabled={currentPage === totalPages}
              title="Next page (→)"
            >
              <ChevronRight size={15} />
            </IconBtn>
            <Divider />
          </>
        )}

        <IconBtn
          onClick={zoomOut}
          disabled={effectiveZoom <= ZOOM_MIN}
          title="Zoom out (-)"
        >
          <ZoomOut size={14} />
        </IconBtn>

        {!isNarrow && (
          <input
            type="range"
            min={ZOOM_MIN * 100}
            max={ZOOM_MAX * 100}
            step={5}
            value={Math.round(manualZoom * 100)}
            onChange={(e) => setManualZoom(Number(e.target.value) / 100)}
            style={{
              width: isCompact ? 44 : 60,
              accentColor: "#2563eb",
              cursor: "pointer",
            }}
            aria-label="Zoom level"
          />
        )}

        <IconBtn
          onClick={zoomIn}
          disabled={effectiveZoom >= ZOOM_MAX}
          title="Zoom in (+)"
        >
          <ZoomIn size={14} />
        </IconBtn>

        <button
          onClick={() => {
            const n =
              ZOOM_PRESETS.find((p) => p > manualZoom) ?? ZOOM_PRESETS[0];
            setManualZoom(n);
          }}
          title="Cycle zoom presets"
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            fontWeight: 700,
            color: "#475569",
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: "0 6px",
            height: 24,
            minWidth: 38,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {pct(effectiveZoom)}
        </button>

        {/* full controls only on wide */}
        {!isCompact && (
          <>
            <IconBtn onClick={resetZoom} title="Reset zoom (0)">
              <RotateCcw size={12} />
            </IconBtn>
            <Divider />
          </>
        )}

        <IconBtn
          onClick={() => {
            if (isExpanded) {
              onCollapse();
            } else {
              onExpand();
            }
            setManualZoom(1);
            setMoreOpen(false);
          }}
          active={isExpanded}
          title={isExpanded ? "Exit fullscreen (F)" : "Fullscreen (F)"}
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </IconBtn>
      </div>
    </div>
  );

  /* ── thumbnail strip ──────────────────────────────────────────────────── */
  const ThumbnailStrip = () => {
    if (totalPages <= 1 || isNarrow) return null;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: "10px 6px",
          background: "#f8fafc",
          borderLeft: "1px solid #e2e8f0",
          overflowY: "auto",
          width: 56,
          flexShrink: 0,
          alignItems: "center",
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => {
          const active = i + 1 === currentPage;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              title={`Page ${i + 1}`}
              style={{
                width: 38,
                height: 54,
                borderRadius: 4,
                border: "none",
                background: active ? "#1e293b" : "#ffffff",
                outline: active ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 4,
                transform: active ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.12s",
                boxShadow: active ? "0 2px 10px rgba(59,130,246,0.3)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: active ? "#93c5fd" : "#94a3b8",
                }}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const Canvas = () => (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: isNarrow ? "14px 10px" : "24px 20px",
          background: showGrid
            ? "radial-gradient(circle, #cbd5e1 1px, transparent 1px)"
            : "#eef2f7",
          backgroundSize: showGrid ? "20px 20px" : undefined,
        }}
      >
        <div ref={resume_doc}>
          <PaginatedPreview
            zoom={effectiveZoom}
            currentPage={currentPage}
            onTotalPagesChange={(n) => {
              setTotalPages(n);
              setCurrentPage((p) => clamp(p, 1, n));
            }}
          >
            <PreviewContent />
          </PaginatedPreview>
        </div>
      </div>

      {/* status bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "3px 14px",
          height: 26,
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          flexShrink: 0,
        }}
      >
        <span
          style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}
        >
          {isNarrow ? "A4" : "A4 · 210 × 297 mm"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isCompact && (
            <button
              onClick={() => setShowGrid((g) => !g)}
              style={{
                fontSize: 10,
                color: showGrid ? "#2563eb" : "#94a3b8",
                fontFamily: "monospace",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showGrid ? "hide grid" : "show grid"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const inner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        border: "1px solid #e8edf3",
        borderRadius: "inherit",
        overflow: "hidden",
        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.02)",
      }}
    >
      <Toolbar />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Canvas />
        <ThumbnailStrip />
      </div>
    </div>
  );

  const getNavbarHeight = () => {
    const nav = document.getElementById("main-navbar");
    return nav ? nav.offsetHeight : 0;
  };

  if (isExpanded) {
    const navHeight = getNavbarHeight();

    return ReactDOM.createPortal(
      <div
        ref={rootRef}
        style={{
          position: "fixed",
          top: navHeight,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          background: "#eef2f7",
        }}
      >
        {inner}
      </div>,
      document.body,
    );
  }

  return (
    <div
      ref={rootRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#f8fafc",
        borderRadius: "inherit",
      }}
    >
      {inner}
    </div>
  );
});

export default LivePreview;
