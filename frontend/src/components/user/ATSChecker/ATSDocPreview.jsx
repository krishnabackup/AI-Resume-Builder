// Create a new file: ATSDocPreview.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ATSDocPreview = ({ text }) => {
  const [formattedText, setFormattedText] = useState("");
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRefresh = () => {
    setPageNumber(1);
    setScale(1.0);
  };
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));

  useEffect(() => {
    if (text) {
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
      className={`flex flex-col h-full ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
    >
      <div className="flex items-center justify-between px-4 border-b bg-white h-12">
        <div className="flex items-center gap-2 text-sm font-semibold">
          Doc Preview
        </div>

        <div className="flex items-center gap-4  text-sm">
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
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: formattedText }}
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: "12pt",
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

export default ATSDocPreview;
