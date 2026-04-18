import { useRef, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";

export default function ATSUpload({ onUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onUpload && onUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onUpload && onUpload(file);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragging
            ? "border-blue-500 bg-blue-50 shadow-inner"
            : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <div className={`p-4 rounded-full mb-4 ${isDragging ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
          <Upload size={32} />
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {selectedFile ? selectedFile.name : "Upload your resume"}
        </h3>
        <p className="text-sm text-slate-500 mb-4 max-w-[200px]">
          Drag and drop your file here or click to browse
        </p>

        <div className="flex flex-wrap justify-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          <span className="px-2 py-0.5 bg-slate-100 rounded">PDF</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded">DOC</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded">DOCX</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
        <AlertCircle className="text-amber-500 shrink-0" size={18} />
        <div className="text-xs text-amber-800 leading-relaxed">
          <p className="font-semibold mb-1">Tips for best results:</p>
          <ul className="list-disc ml-4 space-y-0.5 opacity-80">
            <li>Use a text-based resume (not a scan)</li>
            <li>PDF format is recommended</li>
            <li>Max file size: 5MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
