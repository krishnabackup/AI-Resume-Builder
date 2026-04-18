import { useState, useCallback, memo } from "react";
import { RefreshCw, Sparkles, User, PenTool, Plus, X } from "lucide-react";
import axiosInstance from "../../../../api/axios";

// ── Helper: Validate URL format ──
const validateUrl = (url) => {
  if (!url?.trim()) return false;
  try { new URL(url); return true; } catch {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      try { new URL(`https://${url}`); return true; } catch { return false; }
    }
    return false;
  }
};

// ── Helper: Validate platform name ──
const validatePlatformName = (name) => name?.trim() && name.trim() !== "Enter Platform";

// ── Memoized sub-component for extra links (prevents re-rendering all links) ──
const ExtraLinkItem = memo(({ link, index, onRemove, onUpdate, urlError, platformError }) => (
  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="block text-xs font-medium text-slate-600">Platform Name <span className="text-red-500">*</span></label>
        <input type="text" placeholder="e.g., LinkedIn, Instagram, GitHub" value={link.label === "Enter Platform" ? "" : link.label}
          onChange={(e) => onUpdate(index, "label", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all bg-white ${platformError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/10'}`} />
        {platformError && <span className="text-xs text-red-500 font-medium">Platform name is required</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="block text-xs font-medium text-slate-600">Profile URL <span className="text-red-500">*</span></label>
        <input type="text" placeholder="e.g., https://linkedin.com/in/username" value={link.url}
          onChange={(e) => onUpdate(index, "url", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-4 transition-all bg-white ${urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/10'}`} />
        {urlError && <span className="text-xs text-red-500 font-medium">Please enter a valid URL</span>}
      </div>
    </div>
    <div className="flex gap-2 pt-2 border-t border-slate-100">
      <button type="button" onClick={onRemove} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors" aria-label="Remove link"><X size={12} /> Remove</button>
    </div>
  </div>
));

// ── Main Component ──
const PersonalInfoForm = ({ formData, onInputChange, highlightEmpty }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [urlErrors, setUrlErrors] = useState({});
  const [platformErrors, setPlatformErrors] = useState({});
  
  const extraLinks = formData?.extraLinks || [];

  const borderClass = useCallback((value, hasFormatError = false) => {
    if (hasFormatError) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  }, [highlightEmpty]);

  const autoGenerateSummary = useCallback(async () => {
    try {
      setIsGenerating(true);
      const data = { fullName: formData.fullName, skills: formData.skills, education: formData.education, experience: formData.experience, certifications: formData.certifications, projects: formData.projects, summary: formData.summary };
      const response = await axiosInstance.post("/api/resume/generate-summary", data);
      onInputChange("summary", response.data.aiResume);
    } catch (error) { console.error("Failed to generate summary:", error); }
    finally { setIsGenerating(false); }
  }, [formData, onInputChange]);

  const handleEmailChange = useCallback((e) => {
    const val = e.target.value;
    onInputChange("email", val);
    setEmailError(val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
  }, [onInputChange]);

  const handlePhoneChange = useCallback((e) => {
    const cleanVal = e.target.value.replace(/[^0-9+]/g, '');
    onInputChange("phone", cleanVal);
    setPhoneError(cleanVal && cleanVal.replace(/[^0-9]/g, '').length < 10);
  }, [onInputChange]);

  const addLink = useCallback(() => {
    onInputChange("extraLinks", [...extraLinks, { label: "Enter Platform", url: "" }]);
  }, [extraLinks, onInputChange]);

  const updateExtraLink = useCallback((index, field, value) => {
    const updated = [...extraLinks];
    updated[index][field] = value;
    onInputChange("extraLinks", updated);
    if (field === 'url') setUrlErrors(prev => ({ ...prev, [index]: !validateUrl(value) }));
    if (field === 'label') setPlatformErrors(prev => ({ ...prev, [index]: !validatePlatformName(value) }));
  }, [extraLinks, onInputChange]);

  const removeLink = useCallback((index) => {
    const updated = extraLinks.filter((_, i) => i !== index);
    onInputChange("extraLinks", updated);
    setUrlErrors(prev => { const n = { ...prev }; delete n[index]; return n; });
    setPlatformErrors(prev => { const n = { ...prev }; delete n[index]; return n; });
  }, [extraLinks, onInputChange]);

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <User className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
          <input type="text" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(formData?.fullName)}`} value={formData?.fullName || ""} placeholder="John Doe" onChange={(e) => onInputChange("fullName", e.target.value)} />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
          <input type="email" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(formData?.email, emailError)}`} value={formData?.email || ""} placeholder="john.doe@example.com" onChange={handleEmailChange} />
          {emailError && <span className="text-xs text-red-500 font-medium">Please enter a valid email address</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">Phone <span className="text-red-500">*</span></label>
          <input type="tel" maxLength={15} className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(formData?.phone, phoneError)}`} value={formData?.phone || ""} placeholder="1234567890" onChange={handlePhoneChange} />
          {phoneError && <span className="text-xs text-red-500 font-medium">Please enter a valid phone number</span>}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">Address <span className="text-red-500">*</span></label>
          <input type="text" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(formData?.location)}`} value={formData?.location || ""} placeholder="123 Main St, City, State, ZIP" onChange={(e) => onInputChange("location", e.target.value)} />
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">LinkedIn</label>
          <input type="text" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" value={formData?.linkedin || ""} placeholder="linkedin.com/in/johndoe" onChange={(e) => onInputChange("linkedin", e.target.value)} />
        </div>

        {/* GitHub */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">GitHub</label>
          <input type="text" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" value={formData?.github || ""} placeholder="github.com/username" onChange={(e) => onInputChange("github", e.target.value)} />
        </div>

        {/* Website */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Website / Portfolio</label>
          <input type="text" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" value={formData?.website || ""} placeholder="johndoe.com" onChange={(e) => onInputChange("website", e.target.value)} />
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">Social Media Links</label>
          {extraLinks.map((link, index) => (
            <ExtraLinkItem key={index} link={link} index={index} onUpdate={updateExtraLink} onRemove={() => removeLink(index)} urlError={urlErrors[index]} platformError={platformErrors[index]} />
          ))}
          {extraLinks.length === 0 && (
            <button type="button" onClick={addLink} className="flex items-center gap-2 px-4 py-3 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors w-full justify-center border-2 border-dashed border-slate-300 hover:border-slate-900">
              <Plus size={16} /> Add Social Media Link
            </button>
          )}
          {extraLinks.length > 0 && (
            <button type="button" onClick={addLink} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors w-fit">
              <Plus size={12} /> Add More
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-1.5 mt-6 mb-4">
        <div className="w-full flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-slate-700">Professional Summary <span className="text-slate-400 font-normal">(Optional)</span></label>
          <button type="button" className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800" onClick={autoGenerateSummary} aria-label="Generate summary with AI">
            {isGenerating ? <RefreshCw size={15} className="ml-1 animate-spin" /> : <Sparkles size={14} />} Enhance with AI
          </button>
        </div>
        <textarea className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white resize-y min-h-[140px] leading-relaxed" value={formData?.summary || ""} maxLength={1000} placeholder="Write a brief professional summary highlighting your key skills and experience..." onChange={(e) => onInputChange("summary", e.target.value)} />
        <div className="flex justify-end items-start mt-1"><span className="text-xs text-slate-400 font-medium">{formData?.summary?.length || 0} / 1000</span></div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;