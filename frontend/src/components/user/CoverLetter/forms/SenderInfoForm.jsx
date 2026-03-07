const SenderInfoForm = ({ formData, onInputChange }) => {
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
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                        value={formData.email}
                        onChange={(e) => onInputChange('email', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                        value={formData.phone}
                        onChange={(e) => onInputChange('phone', e.target.value)}
                    />
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
