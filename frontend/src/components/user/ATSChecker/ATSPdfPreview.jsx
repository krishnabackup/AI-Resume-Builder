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
  AlertTriangle,
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
  const [containerWidth, setContainerWidth] = useState(null);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [isLargeDocument, setIsLargeDocument] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // padding is 24px on each side (p-6 = 1.5rem = 24px) -> 48px total padding subtracted
        setContainerWidth(containerRef.current.clientWidth - 48);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  /* The conceptual zoom multiplier perfectly tied to container size */
  const scale = clamp(zoom, ZOOM_MIN, ZOOM_MAX);

  const zoomIn = () => setZoom((z) => clamp(z + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX));
  const zoomOut = () => setZoom((z) => clamp(z - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX));
  const resetZoom = () => setZoom(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLargeDocument(numPages > 3); // Documents with more than 3 pages are considered large
    setDocumentLoaded(true);
  };

  const content = (
    <>
      {/* ===== TOOLBAR ===== */}
      <div className="flex items-center justify-between px-4 border-b bg-white h-12">
        <div className="flex items-center gap-2 text-sm font-semibold">
          Resume Preview
        </div>

        <div className="flex items-center gap-4 text-sm">
          {/* Large Document Warning */}
          {isLargeDocument && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
              <AlertTriangle size={12} />
              Large Document
            </div>
          )}

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
        className="flex-1 overflow-auto bg-gray-200 p-6"
      >
        {pdfUrl ? (
          <div className="w-fit mx-auto">
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
                width={containerWidth ? containerWidth : undefined}
                renderTextLayer={!isLargeDocument} // Disable text layer for large documents
                renderAnnotationLayer={!isLargeDocument} // Disable annotations for large documents
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-500">Loading page...</span>
                  </div>
                }
              />
            </Document>
          </div>
        ) : (
          <div className="text-slate-400">Upload a resume to preview</div>
        )}
      </div>
    </>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col pdf-fullscreen">
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
