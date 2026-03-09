import { useState } from "react";

const SenderInfoForm = ({ formData, onInputChange }) => {
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const handleEmailChange = (e) => {
        const val = e.target.value;
        onInputChange('email', val);
        // Simple regex to check for @ and domain pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val && !emailRegex.test(val)) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        // Strip out any non-digit characters to only allow numbers, we might still want the user to type "+" for country code though, let's allow basic numeric/space/plus/dash or just strict numbers. Let's do strict numbers and plus sign as they might type +1
        const cleanVal = val.replace(/[^0-9+]/g, '');
        onInputChange('phone', cleanVal);

        // Validation: just check length if we want, or if it has invalid chars, but since we restrict input, it's mostly safe.
        // Let's also set an error if it's less than 10 digits and they started typing.
        if (cleanVal && cleanVal.replace(/[^0-9]/g, '').length < 10) {
            setPhoneError(true);
        } else {
            setPhoneError(false);
        }
    };

    return (
        <div className="p-1">
            <h3 className="mb-3 text-sm font-semibold">Personal Information</h3>
            <div className="pl-0.5">
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                        value={formData.fullName}
                        onChange={(e) => onInputChange('fullName', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input
                        type="email"
                        placeholder="john.doe@example.com"
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'}`}
                        value={formData.email}
                        onChange={handleEmailChange}
                    />
                    {emailError && <span className="text-xs text-red-500">Please enter a valid email address</span>}
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input
                        type="tel"
                        placeholder="+1 555 1234567"
                        maxLength={15}
                        className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'}`}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                    />
                    {phoneError && <span className="text-xs text-red-500">Please enter a valid phone number (at least 10 digits)</span>}
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                    <input
                        type="text"
                        placeholder="123 Main St, City, State ZIP"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                        value={formData.address}
                        onChange={(e) => onInputChange('address', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">LinkedIn</label>
                    <input
                        type="text"
                        placeholder="linkedin.com/in/johndoe"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                        value={formData.linkedin}
                        onChange={(e) => onInputChange('linkedin', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default SenderInfoForm;
