import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pct = (z) => `${Math.round(z * 100)}%`;

const ATSPdfPreview = ({ pdfUrl, onLoadSuccess }) => {
  const containerRef = useRef(null);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitScale, setFitScale] = useState(1);

  /* ===== AUTO FIT WIDTH ===== */
  useEffect(() => {
    const updateFit = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth - 48;
      setFitScale(width / 794);
    };

    updateFit();
    window.addEventListener("resize", updateFit);
    return () => window.removeEventListener("resize", updateFit);
  }, []);

  const scale = clamp(fitScale * zoom, ZOOM_MIN, ZOOM_MAX);

  const zoomIn = () => setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX));
  const zoomOut = () => setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX));
  const resetZoom = () => setZoom(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const content = (
    <>
      {/* ===== TOOLBAR ===== */}
      <div className="flex items-center justify-between px-4 border-b bg-white h-12">
        <div className="flex items-center gap-2 text-sm font-semibold">
          Resume Preview
        </div>

        <div className="flex items-center gap-4 text-sm">
          {/* Pagination */}
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </button>

          <span>
            {pageNumber} / {numPages || "-"}
          </span>

          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </button>

          {/* Zoom */}
          <button onClick={zoomOut}>
            <ZoomOut size={16} />
          </button>

          <span className="w-12 text-center">{pct(scale)}</span>

          <button onClick={zoomIn}>
            <ZoomIn size={16} />
          </button>

          <button onClick={resetZoom}>
            <RotateCcw size={14} />
          </button>

          <button onClick={() => setIsFullscreen((v) => !v)}>
            {isFullscreen ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* ===== PDF VIEWER ===== */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-200 flex justify-center p-6"
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={(pdf) => {
              onDocumentLoadSuccess(pdf);
              if (onLoadSuccess) onLoadSuccess(pdf);
            }}
          >

            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          <div className="text-slate-400">Upload a resume to preview</div>
        )}
      </div>
    </>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {content}
      </div>
    );
  }

  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {content}
    </div>
  );
};

export default ATSPdfPreview;
