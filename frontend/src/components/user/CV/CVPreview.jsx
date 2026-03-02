import React, {
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
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
} from "lucide-react";
import CVTemplates from "./Cvtemplates";
import PaginatedPreview from "./PaginatedPreview";
import mergeWithSampleData, {
  hasAnyUserData,
} from "../../../utils/Datahelpers";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
/* ─── constants ─────────────────────────────────────────────────────────── */
const CV_WIDTH = 794;
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

/* ─── main ───────────────────────────────────────────────────────────────── */
const CVPreview = ({
  formData,
  selectedTemplate,
  isMaximized,
  onToggleMaximize,
}) => {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const rootWidth = useElementWidth(rootRef);

  // responsive breakpoints based on the component's own width
  const isNarrow = rootWidth > 0 && rootWidth < 400;
  const isCompact = rootWidth > 0 && rootWidth < 620;

  const [manualZoom, setManualZoom] = useState(1);
  const [fitZoom, setFitZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const TemplateComponent = CVTemplates[selectedTemplate];
  const displayData = useMemo(() => mergeWithSampleData(formData), [formData]);
  const isUserData = useMemo(() => hasAnyUserData(formData), [formData]);
  const previewRef = useRef(null);

  const downloadPDF = async () => {
    const TemplateComponent = CVTemplates[selectedTemplate];
    if (!TemplateComponent) return;

    try {
      // Create hidden container at full A4 width
      const container = document.createElement("div");
      Object.assign(container.style, {
        position: "fixed",
        top: "0",
        left: "-9999px",
        width: `${CV_WIDTH}px`, // full width
        background: "#ffffff",
        zIndex: "-1",
      });

      document.body.appendChild(container);

      const { createRoot } = await import("react-dom/client");

      await new Promise((resolve) => {
        const root = createRoot(container);
        root.render(<TemplateComponent formData={displayData} />);
        setTimeout(resolve, 400);
      });

      // Capture full canvas
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        logging: false,
        windowWidth: CV_WIDTH,
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

        if (!first) pdf.addPage();

        pdf.addImage(imgData, "JPEG", 0, 0, mmPageW, mmPageH);

        yPx += sliceH;
        first = false;
      }

      const clean = (str) =>
        str
          ?.replace(/[^a-z0-9_\- ]/gi, "")
          .trim()
          .replace(/\s+/g, "_");

      const name = clean(displayData?.fullName) || "Resume";
      const template = clean(selectedTemplate) || "Template";

      pdf.save(`${name}_${template}.pdf`);
      setIsDownloading(false);

      document.body.removeChild(container);
    } catch (err) {
      console.error(err);
    }
  };

  /* ── auto-fit ─────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const w = containerRef.current.clientWidth - (isNarrow ? 24 : 40);
      setFitZoom(clamp(w / CV_WIDTH, ZOOM_MIN, 1));
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
  }, [selectedTemplate, formData]);

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
          onToggleMaximize?.();
          setManualZoom(1);
        },
      };
      map[action]?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIn, zoomOut, resetZoom, goPrev, goNext, onToggleMaximize]);

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
        {!isNarrow && selectedTemplate && (
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
            {selectedTemplate}
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

            <IconBtn onClick={downloadPDF} title="Download PDF">
              <Download size={14} />
            </IconBtn>
            <Divider />
          </>
        )}

        <IconBtn
          onClick={() => {
            onToggleMaximize?.();
            setManualZoom(1);
            setMoreOpen(false);
          }}
          active={isMaximized}
          title={isMaximized ? "Exit fullscreen (F)" : "Fullscreen (F)"}
        >
          {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </IconBtn>

        {/* compact overflow menu */}
        {isCompact && (
          <div style={{ position: "relative" }}>
            <IconBtn
              onClick={() => setMoreOpen((o) => !o)}
              title="More"
              active={moreOpen}
            >
              {moreOpen ? <X size={14} /> : <Menu size={14} />}
            </IconBtn>
            {moreOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 6,
                  zIndex: 100,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 150,
                }}
              >
                {[
                  {
                    icon: <RotateCcw size={13} />,
                    label: "Reset zoom",
                    action: () => {
                      resetZoom();
                      setMoreOpen(false);
                    },
                  },
                  {
                    icon: <Printer size={13} />,
                    label: "Print",
                    action: () => {
                      window.print();
                      setMoreOpen(false);
                    },
                  },
                  {
                    icon: <Download size={13} />,
                    label: "Download PDF",
                    action: () => {
                      downloadPDF();
                      setMoreOpen(false);
                    },
                  },
                  {
                    icon: showGrid ? <X size={13} /> : <Eye size={13} />,
                    label: showGrid ? "Hide grid" : "Show grid",
                    action: () => {
                      setShowGrid((g) => !g);
                      setMoreOpen(false);
                    },
                  },
                ].map(({ icon, label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "7px 10px",
                      borderRadius: 7,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#334155",
                      fontSize: 12,
                      fontFamily: "system-ui, sans-serif",
                      fontWeight: 500,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8fafc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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

  /* ── canvas ───────────────────────────────────────────────────────────── */
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
        {TemplateComponent ? (
          <div ref={previewRef}>
            <PaginatedPreview
              zoom={effectiveZoom}
              currentPage={currentPage}
              onTotalPagesChange={(n) => {
                setTotalPages(n);
                setCurrentPage((p) => clamp(p, 1, n));
              }}
            >
              <TemplateComponent formData={displayData} />
            </PaginatedPreview>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 280,
              gap: 12,
              color: "#94a3b8",
            }}
          >
            <FileText size={36} strokeWidth={1.2} />
            <p style={{ fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
              Select a template to preview
            </p>
          </div>
        )}
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
          {isNarrow ? "A4" : "A4 · 210 × 297 mm · PDF ready"}
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
          <span style={{ width: 1, height: 10, background: "#e2e8f0" }} />
          <span
            style={{ fontSize: 10, color: "#94a3b8", fontFamily: "monospace" }}
          >
            {pct(effectiveZoom)}
          </span>
        </div>
      </div>
    </div>
  );

  /* ── render ───────────────────────────────────────────────────────────── */
  const inner = (
    <>
      <Toolbar />
      <div
        style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}
      >
        <Canvas />
        <ThumbnailStrip />
      </div>
      {!isUserData && (
        <div
          style={{
            padding: "5px 16px",
            background: "#eff6ff",
            borderTop: "1px solid #bfdbfe",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <p
            style={{ fontSize: 11, color: "#1d4ed8", fontFamily: "monospace" }}
          >
            {isNarrow
              ? "Fill the form →"
              : "Fill in the form to replace sample content with your data →"}
          </p>
        </div>
      )}
    </>
  );

  const getNavbarHeight = () => {
    const nav = document.getElementById("main-navbar");
    return nav ? nav.offsetHeight : 0;
  };

  if (isMaximized) {
    const navHeight = getNavbarHeight();

    return (
      <div
        ref={rootRef}
        style={{
          position: "fixed",
          top: navHeight,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          background: "#eef2f7",
        }}
      >
        {inner}
      </div>
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
      }}
    >
      {inner}
    </div>
  );
};

export default CVPreview;
