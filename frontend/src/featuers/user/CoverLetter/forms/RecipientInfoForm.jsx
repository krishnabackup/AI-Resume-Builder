import { useCallback, memo } from "react";
import { Building2 } from "lucide-react";

const RecipientInfoForm = memo(({ formData, onInputChange, highlightEmpty }) => {
  // Constants for styles
  const ERROR_CLASSES = 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
  const DEFAULT_CLASSES = 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';

  // Helper to get border class for required fields
  const getBorderClass = useCallback((value) => {
    return (highlightEmpty && !value?.trim()) ? ERROR_CLASSES : DEFAULT_CLASSES;
  }, [highlightEmpty]);

  const handleRecipientNameChange = useCallback((e) => onInputChange("recipientName", e.target.value), [onInputChange]);
  const handleRecipientTitleChange = useCallback((e) => onInputChange("recipientTitle", e.target.value), [onInputChange]);
  const handleCompanyNameChange = useCallback((e) => onInputChange("companyName", e.target.value), [onInputChange]);
  const handleCompanyAddressChange = useCallback((e) => onInputChange("companyAddress", e.target.value), [onInputChange]);

  return (
    <div className="p-2 animate-in fade-in duration-300">
      {/* Recipient Information */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Building2 className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Recipient Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        {/* Hiring Manager's Name */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Hiring Manager's Name
          </label>
          <input
            type="text"
            placeholder="Jane Smith"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${DEFAULT_CLASSES}`}
            value={formData.recipientName}
            onChange={handleRecipientNameChange}
          />
          <small className="text-xs text-slate-400">Leave blank to use "Hiring Manager"</small>
        </div>

        {/* Hiring Manager's Title */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Hiring Manager's Title
          </label>
          <input
            type="text"
            placeholder="HR Director"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${DEFAULT_CLASSES}`}
            value={formData.recipientTitle}
            onChange={handleRecipientTitleChange}
          />
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Acme Corporation"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(formData.companyName)}`}
            value={formData.companyName}
            onChange={handleCompanyNameChange}
          />
        </div>

        {/* Company Address */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Company Address
          </label>
          <input
            type="text"
            placeholder="456 Business Ave, City, State ZIP"
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${DEFAULT_CLASSES}`}
            value={formData.companyAddress}
            onChange={handleCompanyAddressChange}
          />
        </div>
      </div>
    </div>
  );
});

RecipientInfoForm.displayName = "RecipientInfoForm";

export default RecipientInfoForm;

