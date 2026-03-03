import React, {
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import {
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  Circle,
  Menu,
  X,
  EyeOff,
} from "lucide-react";
import PaginatedPreview from "../CV/PaginatedPreview";

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

const CoverLetterPreview = ({
  formData = {},
  exportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}) => {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const rootWidth = useElementWidth(rootRef);

  const isNarrow = rootWidth > 0 && rootWidth < 400;
  const isCompact = rootWidth > 0 && rootWidth < 620;

  const [manualZoom, setManualZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const [isMaximized, setIsMaximized] = useState(false);

  const isUserData = useMemo(() => {
    return Object.values(formData).some((val) => val && String(val).trim());
  }, [formData]);

  const {
    fullName = "",
    email = "",
    phone = "",
    address = "",
    linkedin = "",
    recipientName = "Hiring Manager",
    recipientTitle = "",
    companyName = "",
    companyAddress = "",
    jobTitle = "",
    jobReference = "",
    jobSummary = "",
    jobDescription = "",
    openingParagraph = "",
    bodyParagraph1 = "",
    bodyParagraph2 = "",
    closingParagraph = "",
    customSalutation = "",
    salutation = "Sincerely",
  } = formData;

  const isMobile = isNarrow;

  // We bring the CoverContent directly:
  const CoverContent = () => {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          margin: "0 auto",
          padding: "32px 36px",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "12pt",
          lineHeight: "1.3",
          color: "black",
          background: "white",
          minHeight: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* CONTACT INFO */}
        <div
          style={{
            textAlign: "right",
            marginBottom: "18pt",
            fontSize: "11pt",
            padding: "6pt 0",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "12pt",
              marginBottom: "2pt",
            }}
          >
            {fullName || "Your Name"}
          </div>
          {address &&
            address
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <div key={`addr-${i}`} style={{ marginBottom: "2pt" }}>
                  {line}
                </div>
              ))}
          <div
            style={{
              fontSize: "9pt",
              lineHeight: "1.2",
              marginBottom: "4pt",
            }}
          >
            {email && <div>{email}</div>}
            {phone && <div>{phone}</div>}
            {linkedin && <div>{linkedin}</div>}
          </div>
          <div
            style={{
              fontSize: "11pt",
              marginTop: "4pt",
            }}
          >
            {exportDate}
          </div>
        </div>

        {/* JOB REFERENCE */}
        {(jobTitle || jobReference) && (
          <div
            style={{
              textAlign: "center",
              margin: "12pt 0",
              fontSize: "10pt",
            }}
          >
            {jobTitle && (
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "10pt",
                  textTransform: "uppercase",
                }}
              >
                RE: {jobTitle.toUpperCase()}
              </div>
            )}
            {jobReference && (
              <div
                style={{
                  fontSize: "9pt",
                  marginTop: "1pt",
                }}
              >
                Ref: {jobReference}
              </div>
            )}
          </div>
        )}

        {/* JOB DETAILS */}
        {(jobSummary || jobDescription) && (
          <div
            style={{
              marginBottom: "12pt",
              fontSize: "10pt",
              fontStyle: "italic",
              padding: "6pt 0",
              borderLeft: "2px solid #666",
              paddingLeft: "12pt",
            }}
          >
            {jobSummary && (
              <div>
                <strong>Job Summary:</strong> {jobSummary}
              </div>
            )}
            {jobDescription && (
              <div style={{ marginTop: "6pt" }}>
                <strong>Key Responsibilities:</strong> {jobDescription}
              </div>
            )}
          </div>
        )}

        {/* RECIPIENT INFO */}
        <div
          style={{
            marginBottom: "24pt",
            maxWidth: "4in",
            fontSize: "10pt",
            paddingLeft: "6pt",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "2pt",
            }}
          >
            {recipientName}
          </div>
          {recipientTitle && (
            <div style={{ marginBottom: "2pt" }}>{recipientTitle}</div>
          )}
          {companyName && (
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "2pt",
              }}
            >
              {companyName}
            </div>
          )}
          {companyAddress &&
            companyAddress
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <div
                  key={`caddr-${i}`}
                  style={{ marginBottom: "2pt", lineHeight: "1.2" }}
                >
                  {line}
                </div>
              ))}
        </div>

        {/* SALUTATION */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "12pt",
            margin: "6pt 0 12pt 0",
          }}
        >
          Dear {recipientName || "Hiring Manager"},
        </div>

        {/* BODY PARAGRAPHS */}
        <div
          style={{
            textIndent: "0.2in",
            marginBottom: "10pt",
            lineHeight: "1.4",
            fontSize: "12pt",
          }}
        >
          {openingParagraph || "I'm excited to apply for this position..."}
        </div>
        <div
          style={{
            textIndent: "0.2in",
            marginBottom: "10pt",
            lineHeight: "1.4",
            fontSize: "12pt",
          }}
        >
          {bodyParagraph1 || "In my previous role..."}
        </div>
        <div
          style={{
            textIndent: "0.2in",
            marginBottom: "10pt",
            lineHeight: "1.4",
            fontSize: "12pt",
          }}
        >
          {bodyParagraph2 || "My technical skills include..."}
        </div>
        <div
          style={{
            textIndent: "0.2in",
            marginBottom: "24pt",
            lineHeight: "1.4",
            fontSize: "12pt",
          }}
        >
          {closingParagraph || "I'm particularly drawn to your company..."}
        </div>

        {/* SIGNATURE */}
        <div
          style={{
            marginTop: "24pt",
            textAlign: "right",
          }}
        >
          <div
            style={{
              marginBottom: "6pt",
              fontSize: "11pt",
              fontStyle: "italic",
            }}
          >
            {customSalutation || salutation}
          </div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
            }}
          >
            {fullName || "Your Name"}
          </div>
        </div>
      </div>
    );
  };

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
  }, [isMaximized, rootWidth, isNarrow]);

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
  }, [formData]);

  /* ── keyboard ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
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
          setIsMaximized((v) => !v);
          setManualZoom(1);
        },
      };
      map[action]?.();
    });
  }, [zoomIn, zoomOut, resetZoom, goPrev, goNext]);

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
          {!isNarrow && "Cover Letter Preview"}
        </div>
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
            setIsMaximized((v) => !v);
            setManualZoom(1);
            setMoreOpen(false);
          }}
          active={isMaximized}
          title={isMaximized ? "Exit fullscreen (F)" : "Fullscreen (F)"}
        >
          {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
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
        <div>
          <PaginatedPreview
            zoom={effectiveZoom}
            currentPage={currentPage}
            onTotalPagesChange={(n) => {
              setTotalPages(n);
              setCurrentPage((p) => clamp(p, 1, n));
            }}
          >
            <CoverContent />
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

  if (isMaximized) {
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
};

export default CoverLetterPreview;
