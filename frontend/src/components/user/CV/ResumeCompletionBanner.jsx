import React from "react";
import { AlertTriangle } from "lucide-react";

const ResumeCompletionBanner = ({ missingSections = [] }) => {
  return (
    <div className="mx-4 sm:mx-6 my-4 bg-amber-50 border border-amber-200 rounded-xl px-4 sm:px-5 py-4">
      {/* Responsive Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-amber-800">Complete Your CV</p>
            <p className="text-sm text-amber-700">
              Add the following information to enable export functionality:
            </p>
          </div>
        </div>

        {/* Right Pills */}
        <div className="flex flex-wrap gap-2">
          {missingSections.map((section) => (
            <span
              key={section}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                section === "Skills"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {section}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeCompletionBanner;
