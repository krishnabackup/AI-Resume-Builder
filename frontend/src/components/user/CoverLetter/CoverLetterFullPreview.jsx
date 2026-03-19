import { ArrowLeft, Download, Printer, Share2 } from "lucide-react";
import CoverLetterTemplatesMap from "./CoverLetterTemplatesMap";

const CoverLetterFullPreview = ({
  formData,
  selectedTemplate,
  setActiveTab,
}) => {
  const exportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log("Downloading cover letter...");
  };

  const handlePrint = () => {
    window.print();
  };

  const TemplateComponent = CoverLetterTemplatesMap[selectedTemplate] || CoverLetterTemplatesMap.professional;

  return (
    <div className="full-preview-container">
      <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          .full-preview-toolbar { display: none; }
          .full-preview-container { padding: 0 !important; background: white !important; }
          .full-preview-wrapper { padding: 0 !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="full-preview-toolbar">
        <button
          className="toolbar-btn back"
          onClick={() => setActiveTab("builder")}
        >
          <ArrowLeft size={18} />
          Back to Editor
        </button>
        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
          <button className="toolbar-btn">
            <Share2 size={18} />
            Share
          </button>
          <button className="toolbar-btn primary" onClick={handleDownload}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="full-preview-wrapper flex justify-center py-8 bg-slate-100 min-h-screen overflow-y-auto">
        <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] h-fit my-4">
          <TemplateComponent formData={formData} exportDate={exportDate} />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterFullPreview;
