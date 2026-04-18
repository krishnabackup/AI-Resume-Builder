// ATSDocPreview.jsx — DOCX text preview with zoom/page controls
import { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const ATSDocPreview = ({ text }) => {
  const [formattedText, setFormattedText] = useState("");
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLargeDocument, setIsLargeDocument] = useState(false);
  const handleZoomIn = useCallback(() => setScale((prev) => Math.min(prev + 0.25, 2.5)), []);
  const handleZoomOut = useCallback(() => setScale((prev) => Math.max(prev - 0.25, 0.5)), []);
  const handleRefresh = useCallback(() => {
    setPageNumber(1);
    setScale(1.0);
  }, []);
  const handleFullscreen = useCallback(() => setIsFullscreen((prev) => !prev), []);
  const goToPreviousPage = useCallback(() => setPageNumber((prev) => Math.max(prev - 1, 1)), []);
  const goToNextPage = useCallback(() => setPageNumber((prev) => Math.min(prev + 1, numPages)), [numPages]);

  useEffect(() => {
    if (text) {
      // Detect large documents (more than 1000 words or 50 lines)
      const wordCount = text.split(/\s+/).length;
      const lineCount = text.split('\n').length;
      setIsLargeDocument(wordCount > 1000 || lineCount > 50);
      
      // Format the text to preserve line breaks and structure
      const formatted = text
        .split(/\n\s*\n/) // Split by double newlines (paragraphs)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .map(
          (paragraph) =>
            `<p class="mb-4">${paragraph.replace(/\n/g, "<br/>")}</p>`,
        )
        .join("");

      setFormattedText(formatted);
      
      // Estimate pages (rough calculation)
      const estimatedPages = Math.max(1, Math.ceil(wordCount / 250)); // ~250 words per page
      setNumPages(estimatedPages);
    }
  }, [text]);

  if (!text) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-slate-400">
          <p className="text-sm">No content to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full ${
        isFullscreen ? "fixed inset-0 z-50 bg-white doc-fullscreen" : ""
      }`}
    >
      <div className="flex items-center justify-between px-4 border-b bg-white h-12">
        <div className="flex items-center gap-2 text-sm font-semibold">
          Doc Preview
        </div>

        <div className="flex items-center gap-4  text-sm">
          {/* Large Document Warning */}
          {isLargeDocument && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">
              <AlertTriangle size={12} />
              Large Document
            </div>
          )}

          <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-slate-600">
            {pageNumber} / {numPages}
          </span>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
            <ChevronRight size={18} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm font-medium text-slate-600 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full overflow-auto bg-gray-200"
      >
        <div
          className="max-w-3xl mx-auto p-8 md:p-12 transition-all duration-200 origin-top"
          style={{ zoom: scale }}
        >
          {/* Document container that mimics PDF preview */}
          <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 min-h-[800px] border border-slate-200">
            {/* Large document performance notice */}
            {isLargeDocument && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <AlertTriangle size={16} />
                  <div>
                    <strong>Large Document Detected</strong>
                    <p className="text-xs mt-1">Performance may be affected. Consider splitting into smaller sections.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div
              className={`prose prose-slate max-w-none ${isLargeDocument ? 'text-sm' : ''}`}
              dangerouslySetInnerHTML={{ __html: formattedText }}
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: isLargeDocument ? "11pt" : "12pt",
                lineHeight: "1.6",
                color: "#1e293b",
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(ATSDocPreview);
