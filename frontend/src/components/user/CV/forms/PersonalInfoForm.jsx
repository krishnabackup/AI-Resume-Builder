import { useEffect, useRef, useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import { getCompletionStatus } from "./../completion";
import axiosInstance from "../../../../api/axios";

const PersonalInfoForm = ({ formData, onInputChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const isInitialRender = useRef(true);
  const debounceTimer = useRef(null);

  // Auto-generate summary when experience, projects, or skills change
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const { sectionValidationStatus } = getCompletionStatus(formData);
    const hasContent = Object.values(sectionValidationStatus).some(Boolean);

    if (hasContent) {
      debounceTimer.current = setTimeout(() => {
        autoGenerateSummary();
      }, 2000);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    formData.experience,
    formData.projects,
    formData.skills?.technical,
    formData.skills?.soft,
  ]);

  const autoGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      const data = {
        fullName: formData.fullName,
        skills: formData.skills,
        education: formData.education,
        experience: formData.experience,
        certifications: formData.certifications,
        projects: formData.projects,
        summary: formData.summary,
      };

      const response = await axiosInstance.post(
        "/api/resume/generate-summary",
        data,
      );

      onInputChange("summary", response.data.aiResume);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert(
        `Failed to generate summary: ${
          error.response?.data?.error || error.message
        }`,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-1">
      <h3 className="mb-3 text-sm font-semibold">Personal Information</h3>

      <div className="pl-0.5">
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.fullName || ""}
            placeholder="John Doe"
            onChange={(e) => onInputChange("fullName", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email *
          </label>
          <input
            type="email"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.email || ""}
            placeholder="john.doe@example.com"
            onChange={(e) => onInputChange("email", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Phone *
          </label>
          <input
            type="tel"
            maxLength={10}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.phone || ""}
            placeholder="1234567890"
            onChange={(e) => onInputChange("phone", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Location *
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.location || ""}
            placeholder="San Francisco, CA"
            onChange={(e) => onInputChange("location", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            LinkedIn *
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.linkedin || ""}
            placeholder="linkedin.com/in/johndoe"
            onChange={(e) => onInputChange("linkedin", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            GitHub *
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.github || ""}
            placeholder="github.com/username"
            onChange={(e) => onInputChange("github", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Website / Portfolio *
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.website || ""}
            placeholder="johndoe.com"
            onChange={(e) => onInputChange("website", e.target.value)}
          />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="flex flex-col gap-1.5 mb-4 full-width">
        <label className="flex gap-2 text-sm font-semibold text-slate-700 mb-1.5">
          Professional Summary (Optional)
          <RefreshCw
            size={15}
            className={`ml-1 ${isGenerating ? "animate-spin" : "hidden"}`}
          />
        </label>

        <textarea
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white resize-y min-h-[120px] scrollbar-hide"
          value={formData?.summary || ""}
          maxLength={500}
          placeholder="Brief professional summary highlighting your key skills and experience..."
          onChange={(e) => onInputChange("summary", e.target.value)}
        />

        <span className="ml-2 text-xs text-slate-500">
          {formData?.summary?.length || 0}/500 Characters
        </span>

        <span className="flex gap-2 ml-2 text-xs text-slate-500">
          <Sparkles size={17} />
          Any summary you type here will be analyzed by AI to generate a
          stronger resume summary.
        </span>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
