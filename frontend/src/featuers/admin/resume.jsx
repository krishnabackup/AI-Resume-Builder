import { useEffect, useState } from "react";
import TemplateCard from "./AdminCreateTemplates/Template";
import React from "react";
export default function Resume() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("resumeTemplates")) || [];
    setTemplates(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem("resumeTemplates", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Resume Templates</h2>
        <span className="text-sm text-blue-400">
          {templates.length} Templates
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="border border-dashed border-gray-700 rounded-xl p-16 text-center text-slate-400">
          No templates uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
