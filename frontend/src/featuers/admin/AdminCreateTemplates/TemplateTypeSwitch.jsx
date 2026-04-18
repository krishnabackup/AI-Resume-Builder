import React from "react";
import { FileText, ScrollText } from "lucide-react";

export default function TemplateTypeSwitch({ value, onChange }) {
  return (
    <div className="inline-flex bg-slate-100 p-1 rounded-lg shadow-sm border border-slate-200">
      <button
        onClick={() => onChange("resume")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${
          value === "resume"
            ? "bg-white shadow text-blue-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
      >
        <FileText size={14} />
        Resume
      </button>

      <button
        onClick={() => onChange("cv")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${
          value === "cv"
            ? "bg-white shadow text-blue-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
      >
        <ScrollText size={14} />
        CV
      </button>

      <button
        onClick={() => onChange("cover-letter")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition ${
          value === "cover-letter"
            ? "bg-white shadow text-blue-600"
            : "text-slate-600 hover:text-slate-800"
        }`}
      >
        <FileText size={14} />
        Cover Letter
      </button>
    </div>
  );
}
