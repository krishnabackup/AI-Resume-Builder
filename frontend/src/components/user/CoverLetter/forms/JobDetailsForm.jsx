import { useState, useEffect } from "react";
import { Briefcase, RefreshCw, Sparkles } from "lucide-react";
import axiosInstance from "./../../../../api/axios";

const JobDetailsForm = ({ formData, onInputChange, highlightEmpty }) => {
  const whereFoundOptions = [
    "Company Website",
    "LinkedIn",
    "Indeed",
    "Glassdoor",
    "Referral",
    "Job Fair",
    "Recruiter",
    "Other",
  ];

  const [localData, setLocalData] = useState({
    jobTitle: "",
    jobReference: "",
    whereFound: "",
    jobDescription: "",
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhanceJobDescription = async () => {
    if (!localData.jobDescription.trim()) {
      alert("Please enter a Job Description before enhancing with AI.");
      return;
    }
    try {
      setIsEnhancing(true);
      const response = await axiosInstance.post("/api/resume/cover-letter/generate", {
        sectionType: "jobDescription",
        jobDetails: {
          jobTitle: localData.jobTitle || "Role",
          companyName: formData.companyName || "Company",
          fullName: formData.fullName || "Candidate",
          skills: formData.skills || "",
          experience: formData.experience || "",
          jobDescription: localData.jobDescription,
        },
      });
      handleChange("jobDescription", response.data.result);
    } catch (error) {
      console.error("Error enhancing job description:", error);
      alert("Error processing request.");
    } finally {
      setIsEnhancing(false);
    }
  };

  useEffect(() => {
    setLocalData({
      jobTitle: formData.jobTitle || "",
      jobReference: formData.jobReference || "",
      whereFound: formData.whereFound || "",
      jobDescription: formData.jobDescription || "",
    });
  }, [formData]);

  const handleChange = (field, value) => {
    const safeValue = value || "";
    setLocalData((prev) => ({ ...prev, [field]: safeValue }));
    onInputChange(field, safeValue);
  };

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Briefcase className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Job Details</h3>
      </div>

      <p className="text-sm text-slate-500 mb-5">
        Provide details about the position you're applying for.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Software Engineer"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${highlightEmpty && !localData.jobTitle?.trim() ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'}`}
            value={localData.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Job Reference Number
          </label>
          <input
            type="text"
            placeholder="REF-12345"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={localData.jobReference}
            onChange={(e) => handleChange("jobReference", e.target.value)}
          />
          <small className="text-xs text-slate-400">If provided in the job listing</small>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">
            Where did you find this job?
          </label>
          <select
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={localData.whereFound}
            onChange={(e) => handleChange("whereFound", e.target.value)}
          >
            <option value="">Select an option</option>
            {whereFoundOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-6">
        <div className="w-full flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-slate-700">
            Job Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <button
            className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 whitespace-nowrap shrink-0"
            onClick={handleEnhanceJobDescription}
            disabled={isEnhancing}
          >
            {isEnhancing ? (
              <RefreshCw size={15} className="ml-1 animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Enhance with AI
          </button>
        </div>
        <textarea
          placeholder="Paste job description for better AI suggestions..."
          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white resize-y min-h-[140px] leading-relaxed"
          value={localData.jobDescription}
          onChange={(e) => handleChange("jobDescription", e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default JobDetailsForm;
