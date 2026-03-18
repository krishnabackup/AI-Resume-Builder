import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const ResumeCompletionBanner = ({ missingSections = [] }) => {
  const isComplete = missingSections.length === 0;

  if (isComplete) {
    return (
      <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-xl mb-4 shadow-sm px-2">
        <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
        <span className="text-sm font-medium text-green-800">
          CV Complete! You have filled all required fields. You can now download your CV.
        </span>
      </div>
    );
  }

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
