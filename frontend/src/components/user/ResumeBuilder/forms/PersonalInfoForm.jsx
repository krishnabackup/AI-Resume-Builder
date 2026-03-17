import { useState } from "react";
import { RefreshCw, Sparkles, User } from "lucide-react";
import axiosInstance from "../../../../api/axios";

const PersonalInfoForm = ({ formData, onInputChange, onUseSummary, highlightEmpty }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Helper to get border class for required fields
  const getBorderClass = (value, hasFormatError = false) => {
    if (hasFormatError) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  };

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
      console.error("Error details:", error.response?.data || error.message);
      // alert(
      //   `Failed to generate summary: ${error.response?.data?.error || error.message}`,
      // );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    onInputChange("email", val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    const cleanVal = val.replace(/[^0-9+]/g, '');
    onInputChange("phone", cleanVal);

    if (cleanVal && cleanVal.replace(/[^0-9]/g, '').length < 10) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <User className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData?.fullName)}`}
            value={formData?.fullName || ""}
            placeholder="John Doe"
            onChange={(e) => onInputChange("fullName", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData?.email, emailError)}`}
            value={formData?.email || ""}
            placeholder="john.doe@example.com"
            onChange={handleEmailChange}
          />
          {emailError && <span className="text-xs text-red-500 font-medium">Please enter a valid email address</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData?.phone, phoneError)}`}
            value={formData?.phone || ""}
            maxLength={15}
            placeholder="1234567890"
            onChange={handlePhoneChange}
          />
          {phoneError && <span className="text-xs text-red-500 font-medium">Please enter a valid phone number</span>}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData?.location)}`}
            value={formData?.location || ""}
            placeholder="San Francisco, CA"
            onChange={(e) => onInputChange("location", e.target.value)}
          />
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            LinkedIn
          </label>
          <input
            type="text"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData?.linkedin || ""}
            placeholder="linkedin.com/in/johndoe"
            onChange={(e) => onInputChange("linkedin", e.target.value)}
          />
        </div>

        {/* Website/Portfolio */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">
            Website / Portfolio
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
      <div className="flex flex-col gap-1.5 mt-6 mb-4">
        <div className="w-full flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-slate-700">
            Professional Summary <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <button
            className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800"
            onClick={autoGenerateSummary}
          >
            {isGenerating ? (
              <RefreshCw size={15} className="ml-1 animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Enhance with AI
          </button>
        </div>
        <textarea
          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white resize-y min-h-[140px] leading-relaxed"
          value={formData?.summary || ""}
          maxLength={500}
          placeholder="Write a brief professional summary highlighting your key skills and experience..."
          onChange={(e) => onInputChange("summary", e.target.value)}
        />
        <div className="flex justify-end items-start mt-1">
          <span className="text-xs text-slate-400 font-medium">
            {formData?.summary?.length || 0} / 500
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
