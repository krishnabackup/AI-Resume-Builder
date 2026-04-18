import React, { memo } from "react";
import { X } from "lucide-react";
import CoverLetterPreview from "../CoverLetterPreview";

const MobilePreviewOverlay = memo(({ 
  show, 
  onClose, 
  formData, 
  selectedTemplate, 
  date 
}) => {
  if (!show) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative mt-auto bg-white rounded-t-2xl shadow-2xl flex flex-col"
        style={{
          height: "92dvh",
          animation: "clPreviewSlideUp 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0">
          <span className="text-sm font-semibold text-slate-700">
            Cover Letter Preview
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <CoverLetterPreview 
            formData={formData} 
            selectedTemplate={selectedTemplate} 
            exportDate={date} 
          />
        </div>
      </div>
      <style>{`
        @keyframes clPreviewSlideUp {
          from { transform: translateY(100%); opacity: 0.5; }
          to   { transform: translateY(0);    opacity: 1;   }
        }
      `}</style>
    </div>
  );
});

MobilePreviewOverlay.displayName = "MobilePreviewOverlay";
export default MobilePreviewOverlay;
