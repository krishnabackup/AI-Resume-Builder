import React from "react";
import LivePreview from "../../Preview/LivePreview";

const MobilePreview = ({
  show,
  onClose,
  previewRef,
  formData,
  currentTemplate,
}) => {
  if (!show) return null;

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
          animation:
            "resumePreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-sm font-semibold text-slate-700">
            Resume Preview
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <LivePreview
            ref={previewRef}
            formData={formData}
            currentTemplate={currentTemplate}
            isExpanded={false}
            onExpand={() => {}}
            onCollapse={() => {}}
            onMinimize={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;