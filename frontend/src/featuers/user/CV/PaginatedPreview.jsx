import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";

/* ─── A4 geometry ────────────────────────────────────────────────────────── */
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;
export const PAGE_PADDING = 52;
export const FOOTER_HEIGHT = 32;
export const USABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2 - FOOTER_HEIGHT - 10;
export const MIN_REMAINING = 150;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ─── extracted styles (created once at module load) ─────────────────────── */
const S = {
  mirror: { position: "fixed", top: 0, left: "-9999px", visibility: "hidden", pointerEvents: "none", width: PAGE_WIDTH - PAGE_PADDING * 2, zIndex: -1 },
  pageShell: (w, h) => ({ width: w, height: h, flexShrink: 0, position: "relative", borderRadius: 2, boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.1)", overflow: "hidden", background: "#ffffff" }),
  pageInner: (zoom) => ({ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform: `scale(${zoom})`, transformOrigin: "top left", position: "relative", overflow: "hidden", background: "#ffffff" }),
  watermark: { position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" },
  watermarkText: { fontSize: 120, fontWeight: 900, color: "rgba(0,0,0,0.025)", transform: "rotate(-35deg)", userSelect: "none", letterSpacing: "-4px", fontFamily: "Georgia, serif" },
  clipWindow: { position: "absolute", top: PAGE_PADDING, left: PAGE_PADDING, right: PAGE_PADDING, height: USABLE_HEIGHT, overflow: "hidden" },
  clipContent: (offset) => ({ position: "relative", top: -offset, width: PAGE_WIDTH - PAGE_PADDING * 2, transition: "top 0.22s cubic-bezier(0.4, 0, 0.2, 1)" }),
  footer: { position: "absolute", bottom: 10, left: 0, right: 0, height: FOOTER_HEIGHT - 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  footerLine: (ml, mr) => ({ flex: 1, maxWidth: 56, height: 1, background: "#e2e8f0", marginLeft: ml, marginRight: mr }),
  footerText: { fontSize: 9, color: "#94a3b8", fontFamily: "'Courier New', monospace", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" },
  pageFold: { position: "absolute", top: 0, right: 0, width: 18, height: 18, background: "linear-gradient(225deg, #dde3ec 50%, transparent 50%)", pointerEvents: "none" },
};

/* ─── memoized watermark (pure presentational) ──────────────────────────── */
const Watermark = memo(() => (
  <div aria-hidden="true" style={S.watermark}>
    <span style={S.watermarkText}>DRAFT</span>
  </div>
));

/* ─── main component ────────────────────────────────────────────────────── */
const PaginatedPreview = memo(({ children, zoom = 1, currentPage = 1, onTotalPagesChange, showWatermark = false }) => {
  const mirrorRef = useRef(null);
  const [pageBreaks, setPageBreaks] = useState([0]);

  /* ── smart page-break calculation ──────────────────────────────────────── */
  const recalc = useCallback(() => {
    const el = mirrorRef.current; if (!el) return;
    const totalH = el.scrollHeight; if (totalH === 0) return;
    const sections = Array.from(el.children);

    if (sections.length === 0) {
      const n = Math.max(1, Math.ceil(totalH / USABLE_HEIGHT));
      const b = Array.from({ length: n }, (_, i) => i * USABLE_HEIGHT);
      setPageBreaks(b); onTotalPagesChange?.(n); return;
    }

    const breaks = [0]; let curBreak = 0;
    for (const sec of sections) {
      const top = sec.offsetTop, height = sec.offsetHeight, bottom = top + height, relEnd = bottom - curBreak;
      if (relEnd > USABLE_HEIGHT) {
        const spaceLeft = USABLE_HEIGHT - (top - curBreak);
        if (top - curBreak < USABLE_HEIGHT && (spaceLeft < MIN_REMAINING || height < USABLE_HEIGHT)) { breaks.push(top); curBreak = top; }
        else { curBreak += USABLE_HEIGHT; breaks.push(curBreak); }
      }
    }
    while (curBreak + USABLE_HEIGHT < totalH) { curBreak += USABLE_HEIGHT; breaks.push(curBreak); }
    const unique = [...new Set(breaks)].sort((a, b) => a - b);
    setPageBreaks(unique); onTotalPagesChange?.(unique.length);
  }, [onTotalPagesChange]);

  /* ── debounced recalc on content change ───────────────────────────────── */
  useEffect(() => { const t = setTimeout(recalc, 120); return () => clearTimeout(t); }, [children, recalc]);

  /* ── ResizeObserver for dynamic sizing ────────────────────────────────── */
  useEffect(() => {
    if (!mirrorRef.current) return;
    const ro = new ResizeObserver(recalc); ro.observe(mirrorRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  /* ── memoized derived values ──────────────────────────────────────────── */
  const totalPages = useMemo(() => pageBreaks.length, [pageBreaks]);
  const pageIndex = useMemo(() => clamp(currentPage - 1, 0, totalPages - 1), [currentPage, totalPages]);
  const offset = useMemo(() => pageBreaks[pageIndex] ?? 0, [pageBreaks, pageIndex]);
  const scaledW = useMemo(() => PAGE_WIDTH * zoom, [zoom]);
  const scaledH = useMemo(() => PAGE_HEIGHT * zoom, [zoom]);

  /* ── memoized content clip (avoids re-creating div on every render) ───── */
  const clipContent = useMemo(() => (
    <div style={S.clipContent(offset)}>{children}</div>
  ), [children, offset]);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {/* ── hidden measurement mirror ──────────────────────────────────── */}
      <div ref={mirrorRef} aria-hidden="true" style={S.mirror}>{children}</div>

      {/* ── page shell ────────────────────────────────────────────────── */}
      <div style={S.pageShell(scaledW, scaledH)}>
        <div style={S.pageInner(zoom)}>
          {showWatermark && <Watermark />}
          <div style={S.clipWindow}>{clipContent}</div>
          {/* footer */}
          <div style={S.footer}>
            <div style={S.footerLine(PAGE_PADDING, 0)} />
            <span style={S.footerText} dangerouslySetInnerHTML={{ __html: `${currentPage}&thinsp;/&thinsp;${totalPages}` }} />
            <div style={S.footerLine(0, PAGE_PADDING)} />
          </div>
          {/* page-fold corner */}
          <div aria-hidden="true" style={S.pageFold} />
        </div>
      </div>
    </div>
  );
});

export default PaginatedPreview;