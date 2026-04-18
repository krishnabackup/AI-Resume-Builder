import { useState, useCallback, useMemo, memo } from "react";
import { Sparkles, RefreshCw, Copy, Check, FileText } from "lucide-react";
import axiosInstance from "./../../../../api/axios";

// Constants for styles
const ERROR_CLASSES = 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
const DEFAULT_CLASSES = 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';

const TextAreaField = memo(({ field, label, placeholder, rows, value, generating, copied, onGenerate, onCopy, onInputChange, highlightEmpty }) => (
  <div className="flex flex-col gap-2 mb-5">
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex gap-2">
        <button
          className="flex gap-1.5 items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          onClick={() => onGenerate(field)}
          disabled={generating}
        >
          {generating ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Enhance with AI
            </>
          )}
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
          onClick={() => onCopy(field)}
          disabled={!value}
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onInputChange(field, e.target.value)}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white resize-y min-h-[100px] leading-relaxed ${highlightEmpty && label.includes('*') && !value?.trim() ? ERROR_CLASSES : DEFAULT_CLASSES}`}
    />
  </div>
));

TextAreaField.displayName = "TextAreaField";

const BodyContentForm = memo(({ formData, onInputChange, onAIGenerate, highlightEmpty }) => {
  const [generating, setGenerating] = useState({});
  const [copied, setCopied] = useState({});

  const handleGenerate = useCallback(async (field) => {
    setGenerating((prev) => ({ ...prev, [field]: true }));

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "/api/resume/cover-letter/generate",
        {
          sectionType: field,
          jobDetails: {
            jobTitle: formData.jobTitle || "Role",
            companyName: formData.companyName || "Company",
            fullName: formData.fullName || "Candidate",
            skills: formData.skills || "",
            experience: formData.experience || "",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onInputChange(field, response.data.result);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Error processing request.");
    } finally {
      setGenerating((prev) => ({ ...prev, [field]: false }));
    }
  }, [formData.jobTitle, formData.companyName, formData.fullName, formData.skills, formData.experience, onInputChange]);

  const handleCopy = useCallback((field) => {
    navigator.clipboard.writeText(formData[field] || "");
    setCopied((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
        setCopied((prev) => ({ ...prev, [field]: false }));
    }, 2000);
  }, [formData]);

  const wordCount = useMemo(() => {
    return [
      formData.openingParagraph,
      formData.bodyParagraph1,
      formData.bodyParagraph2,
      formData.closingParagraph,
    ]
      .filter(Boolean)
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length;
  }, [formData.openingParagraph, formData.bodyParagraph1, formData.bodyParagraph2, formData.closingParagraph]);

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <FileText className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-slate-800">Letter Content</h3>
      </div>

      <p className="text-sm text-slate-500 mb-4">
        Write your cover letter content below or use AI to generate compelling paragraphs.
      </p>

      <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6 text-sm">
        <span className="text-lg leading-none">💡</span>
        <div className="text-slate-700">
          <strong>Pro Tip:</strong> A great cover letter has 3-4 paragraphs: an
          engaging opening, 1-2 body paragraphs highlighting your relevant
          experience, and a strong closing.
        </div>
      </div>

      <TextAreaField
        field="openingParagraph"
        label="Opening Paragraph *"
        placeholder="Start with a strong hook that mentions the specific position and company. Express your enthusiasm and briefly mention why you're a great fit..."
        rows={4}
        value={formData.openingParagraph}
        generating={generating.openingParagraph}
        copied={copied.openingParagraph}
        onGenerate={handleGenerate}
        onCopy={handleCopy}
        onInputChange={onInputChange}
        highlightEmpty={highlightEmpty}
      />

      <TextAreaField
        field="bodyParagraph1"
        label="Body Paragraph 1 - Key Qualifications *"
        placeholder="Highlight your most relevant experience and achievements. Use specific examples and quantifiable results when possible..."
        rows={5}
        value={formData.bodyParagraph1}
        generating={generating.bodyParagraph1}
        copied={copied.bodyParagraph1}
        onGenerate={handleGenerate}
        onCopy={handleCopy}
        onInputChange={onInputChange}
        highlightEmpty={highlightEmpty}
      />

      <TextAreaField
        field="bodyParagraph2"
        label="Body Paragraph 2 - Additional Value (Optional)"
        placeholder="Add more relevant skills, experiences, or explain why you're passionate about the company/industry..."
        rows={5}
        value={formData.bodyParagraph2}
        generating={generating.bodyParagraph2}
        copied={copied.bodyParagraph2}
        onGenerate={handleGenerate}
        onCopy={handleCopy}
        onInputChange={onInputChange}
        highlightEmpty={highlightEmpty}
      />

      <TextAreaField
        field="closingParagraph"
        label="Closing Paragraph *"
        placeholder="Summarize your interest, express enthusiasm for an interview, and thank them for their consideration..."
        rows={4}
        value={formData.closingParagraph}
        generating={generating.closingParagraph}
        copied={copied.closingParagraph}
        onGenerate={handleGenerate}
        onCopy={handleCopy}
        onInputChange={onInputChange}
        highlightEmpty={highlightEmpty}
      />

      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-500 border border-slate-100">
        <span>
          📊 Total Words: {wordCount}
        </span>
        <span className="text-blue-600 font-medium">Ideal: 250-400 words</span>
      </div>
    </div>
  );
});

BodyContentForm.displayName = "BodyContentForm";

export default BodyContentForm;

