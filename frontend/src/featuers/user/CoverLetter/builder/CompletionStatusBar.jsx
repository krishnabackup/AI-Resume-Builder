import React, { memo } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

const CompletionStatusBar = memo(({ isComplete }) => {
  if (isComplete) {
    return (
      <div className="flex gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 shadow-sm px-2">
        <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
        <span className="text-sm font-medium text-emerald-800">
          Cover Letter Ready: All required information has been added. You can now export your cover letter.
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 shadow-sm px-2">
      <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
      <span className="text-sm font-medium text-amber-800">
        Complete Your Cover Letter: Add the missing information to enable export functionality.
      </span>
    </div>
  );
});

CompletionStatusBar.displayName = "CompletionStatusBar";
export default CompletionStatusBar;
