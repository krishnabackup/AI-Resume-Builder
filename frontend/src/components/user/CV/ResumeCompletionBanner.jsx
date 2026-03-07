import React from "react";
import { AlertTriangle } from "lucide-react";

const ResumeCompletionBanner = ({ missingSections = [] }) => {
  return (
    <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 shadow-sm px-2">
      <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
      <span className="text-sm font-medium text-amber-800">
        Complete Your CV: Add the missing information to enable export functionality.
      </span>
    </div>
  );
};

export default ResumeCompletionBanner;
