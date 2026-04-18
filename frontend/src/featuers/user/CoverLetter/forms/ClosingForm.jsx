import { useCallback, memo, useMemo } from "react";
import { Send } from "lucide-react";
import { formatExternalUrl, formatMailto, formatTel } from "../../Templates/socialUtils";

const SALUTATION_OPTIONS = Object.freeze([
  { value: "Sincerely", label: "Sincerely" },
  { value: "Best regards", label: "Best regards" },
  { value: "Kind regards", label: "Kind regards" },
  { value: "Respectfully", label: "Respectfully" },
  { value: "Thank you", label: "Thank you" },
  { value: "Warm regards", label: "Warm regards" },
  { value: "With appreciation", label: "With appreciation" },
  { value: "custom", label: "Custom..." },
]);

const ClosingForm = memo(({ formData, onInputChange, highlightEmpty }) => {
  // Style constants
  const ERROR_CLASSES = 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
  const DEFAULT_CLASSES = 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';

  const handleSalutationChange = useCallback((e) => onInputChange("salutation", e.target.value), [onInputChange]);
  const handleCustomSalutationChange = useCallback((e) => onInputChange("customSalutation", e.target.value), [onInputChange]);
  const handleLetterDateChange = useCallback((e) => onInputChange("letterDate", e.target.value), [onInputChange]);

  const displaySalutation = useMemo(() => {
    return formData.salutation === "custom" ? formData.customSalutation : formData.salutation;
  }, [formData.salutation, formData.customSalutation]);

  const defaultDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Send className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Closing & Signature</h3>
      </div>

      <p className="text-sm text-slate-500 mb-5">
        Choose how you'd like to sign off your cover letter.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Salutation <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${highlightEmpty && !formData.salutation?.trim() ? ERROR_CLASSES : DEFAULT_CLASSES}`}
            value={formData.salutation}
            onChange={handleSalutationChange}
          >
            {SALUTATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {formData.salutation === "custom" && (
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Custom Salutation
            </label>
            <input
              type="text"
              placeholder="Your custom closing"
              className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${DEFAULT_CLASSES}`}
              value={formData.customSalutation}
              onChange={handleCustomSalutationChange}
            />
          </div>
        )}
      </div>

      {/* Signature Preview */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Signature Preview</h4>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-800 italic mb-1">
            {displaySalutation},
          </p>
          <p className="text-sm font-semibold text-slate-900">{formData.fullName || "Your Name"}</p>
          {formData.email && (
            <p className="text-xs text-slate-500"><a href={formatMailto(formData.email)} className="hover:underline">{formData.email}</a></p>
          )}
          {formData.phone && (
            <p className="text-xs text-slate-500"><a href={formatTel(formData.phone)} className="hover:underline">{formData.phone}</a></p>
          )}
          {formData.linkedin && (
            <p className="text-xs text-slate-500"><a href={formatExternalUrl(formData.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">{formData.linkedin}</a></p>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">📌 Tips for a Strong Closing</h4>
        <ul className="space-y-2">
          <li className="text-sm text-blue-700">
            <strong>Be professional:</strong> Stick to traditional closings for formal applications
          </li>
          <li className="text-sm text-blue-700">
            <strong>Match the tone:</strong> Your closing should match the overall tone of your letter
          </li>
          <li className="text-sm text-blue-700">
            <strong>Include contact info:</strong> Make it easy for employers to reach you
          </li>
          <li className="text-sm text-blue-700">
            <strong>Proofread:</strong> Double-check spelling of your name and contact details
          </li>
        </ul>
      </div>

      {/* Letter Date */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-sm font-semibold text-slate-700">
          Letter Date
        </label>
        <input
          type="date"
          className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${DEFAULT_CLASSES}`}
          value={formData.letterDate || defaultDate}
          onChange={handleLetterDateChange}
        />
      </div>
    </div>
  );
});

ClosingForm.displayName = "ClosingForm";

export default ClosingForm;

