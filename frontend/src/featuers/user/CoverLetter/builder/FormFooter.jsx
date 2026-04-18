import React, { memo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FormFooter = memo(({ 
  currentIdx, 
  totalTabs, 
  onPrev, 
  onNext, 
  isLastStep, 
  isSectionValid, 
  isComplete 
}) => {
  return (
    <div className="flex justify-between items-center mt-auto p-4 border-t border-slate-100 bg-white">
      <button
        onClick={onPrev}
        disabled={currentIdx === 0}
        className="flex gap-1 items-center text-sm bg-slate-100 px-4 py-2 rounded-lg select-none disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ArrowLeft size={18} /> Previous
      </button>

      <div className="flex-1 text-center text-xs text-gray-500 font-medium">
        Step {currentIdx + 1} of {totalTabs}
      </div>

      <button
        onClick={onNext}
        className={`flex gap-2 items-center text-sm font-medium px-6 py-2.5 rounded-lg select-none transition-all shadow-sm ${
          isLastStep 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-blue-600 hover:bg-blue-700 text-white lg:bg-blue-600 lg:text-white bg-black"
        }`}
      >
        <span className="hidden sm:inline">
          {isLastStep ? "Finish" : "Next Step"}
        </span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
});

FormFooter.displayName = "FormFooter";
export default FormFooter;
