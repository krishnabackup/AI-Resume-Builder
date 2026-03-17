import { useState } from "react";
import { User } from "lucide-react";

const SenderInfoForm = ({ formData, onInputChange, highlightEmpty }) => {
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Helper to get border class for required fields
  const getBorderClass = (value, hasFormatError = false) => {
    if (hasFormatError) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
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
    const cleanVal = val.replace(/[^0-9+]/g, "");
    onInputChange("phone", cleanVal);

    if (cleanVal && cleanVal.replace(/[^0-9]/g, "").length < 10) {
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
            placeholder="John Doe"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData.fullName)}`}
            value={formData.fullName}
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
            placeholder="john.doe@example.com"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData.email, emailError)}`}
            value={formData.email}
            onChange={handleEmailChange}
          />
          {emailError && <span className="text-xs text-red-500 font-medium">Please enter a valid email address</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Phone
          </label>
          <input
            type="tel"
            placeholder="+1 555 1234567"
            maxLength={15}
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${phoneError ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"}`}
            value={formData.phone}
            onChange={handlePhoneChange}
          />
          {phoneError && <span className="text-xs text-red-500 font-medium">Please enter a valid phone number</span>}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Address
          </label>
          <input
            type="text"
            placeholder="123 Main St, City, State ZIP"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
          />
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            LinkedIn <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="linkedin.com/in/johndoe"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
            value={formData.linkedin}
            onChange={(e) => onInputChange("linkedin", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SenderInfoForm;
