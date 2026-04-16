import React, { memo, useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

const MobilePreview = memo(({ 
  show, 
  onClose, 
  document,
  onDownload
}) => {
  if (!show) return null;

  const { type, html, template } = document || {};
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(100); // 100% default
  const MIN_ZOOM = 50;  // 50% minimum
  const MAX_ZOOM = 200; // 200% maximum
  const ZOOM_STEP = 10; // 10% step

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setContainerWidth(containerRef.current?.clientWidth || 0);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate appropriate scale based on container width and document type
  const A4_WIDTH = 900; // Standard A4 width in pixels
  
  // Document-type specific scaling adjustments
  const getBaseScale = () => {
    // Use actual container width for scaling
    const availableWidth = containerWidth > 0 ? containerWidth : 360; // Default mobile width
    
    switch (type) {
      case 'cover-letter':
        // Cover letters usually have simpler layouts
        return Math.min(1, availableWidth / A4_WIDTH);
      case 'resume':
      case 'cv':
        // CV and resume have complex layouts - scale to fit available width
        // Use a slightly smaller scale to ensure it fits within the container
        const resumeScale = (availableWidth / A4_WIDTH) * 0.98; // 98% to account for any borders/scrollbars
        return Math.min(resumeScale, 0.52); // Cap at 0.52 for mobile readability
      default:
        return Math.min(1, availableWidth / A4_WIDTH);
    }
  };
  
  const baseScale = getBaseScale();
  
  // Apply zoom level to base scale
  const scale = baseScale * (zoomLevel / 100);

  const renderPreviewContent = () => {
    // Use HTML content directly (same as desktop preview)
    // This ensures mobile preview shows the same actual data as desktop
    if (html) {
      // For CV/resume, we need larger scale which might overflow, so allow horizontal scroll
      const isResumeOrCV = type === 'resume' || type === 'cv';
      
      // Calculate the scaled width to fit container properly
      const scaledWidth = A4_WIDTH * scale;
      const containerPadding = 0; // Remove padding to use full space
      
      return (
        <div 
          ref={containerRef}
          className={`w-full h-full bg-white ${isResumeOrCV ? 'overflow-auto' : 'overflow-y-auto'}`}
          style={{
            padding: "0",
            margin: "0"
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: `${A4_WIDTH}px`,
              minHeight: "1123px",
              margin: "0" // Remove all margins
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    }

    // Fallback if no HTML is available
    return (
      <div className="flex items-center justify-center h-full text-gray-400 p-6">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-600 mb-2">
            {document.name || "Document"}
          </p>
          <p className="text-sm text-gray-400 mb-1">
            Type: {type || "Unknown"}
          </p>
          <p className="text-sm text-gray-400 mb-1">
            Template: {template || "Default"}
          </p>
          <p className="text-xs text-gray-300 mt-4">
            Preview content not available
          </p>
        </div>
      </div>
    );
  };

  const getPreviewTitle = () => {
    switch (type) {
      case "resume":
        return "Resume Preview";
      case "cv":
        return "CV Preview";
      case "cover-letter":
        return "Cover Letter Preview";
      default:
        return "Document Preview";
    }
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-up panel */}
      <div
        className="relative mt-auto bg-white rounded-t-2xl shadow-2xl flex flex-col"
        style={{
          height: "92dvh",
          animation: "downloadsPreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
          <span className="text-sm font-semibold text-slate-700">
            {getPreviewTitle()}
          </span>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={() => setZoomLevel(Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP))}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold transition-colors"
              title="Zoom Out"
            >
              −
            </button>
            
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={ZOOM_STEP}
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: '#3b82f6' }}
            />
            
            <button
              onClick={() => setZoomLevel(Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP))}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold transition-colors"
              title="Zoom In"
            >
              +
            </button>
            
            <span className="text-xs text-slate-500 w-10 text-right">
              {zoomLevel}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download button */}
            {onDownload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(document);
                }}
                className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors"
                title="Download"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {renderPreviewContent()}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes downloadsPreviewSlideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
});

MobilePreview.displayName = "MobilePreview";

export default MobilePreview;
