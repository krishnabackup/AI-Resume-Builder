import { useState } from "react";
import { Check, Eye, X } from "lucide-react";

const CoverLetterTemplates = ({ selectedTemplate, onSelectTemplate }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const templates = [
    {
      id: "professional",
      name: "Professional",
      description:
        "Clean and traditional design perfect for corporate positions",
      img: "/templates/cover-letter-professional.png",
      category: "Professional",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary layout with a fresh, creative touch",
      img: "/templates/cover-letter-modern.png",
      category: "Modern",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant with focus on content",
      img: "/templates/cover-letter-minimal.png",
      category: "Professional",
    },
    {
      id: "executive",
      name: "Executive",
      description: "Sophisticated design for senior-level positions",
      img: "/templates/cover-letter-executive.png",
      category: "Professional",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold and distinctive for creative industries",
      img: "/templates/cover-letter-creative.png",
      category: "Creative",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Timeless design that works for any industry",
      img: "/templates/cover-letter-classic.png",
      category: "Professional",
    },
  ];

  const handlePreview = (imageUrl, e) => {
    e.stopPropagation();
    setPreviewImage(imageUrl);
    setIsPreviewModalOpen(true);
  };

  const handleUseTemplate = (templateId, e) => {
    e.stopPropagation();
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Cover Letter Templates
          </h1>
          <p className="text-sm text-slate-500">
            Choose a professionally designed template that matches your style.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`bg-white border-2 rounded-xl p-3 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer ${
                selectedTemplate === tpl.id
                  ? "border-blue-600 shadow-md"
                  : "border-slate-200"
              }`}
              onClick={() =>
                handleUseTemplate(tpl.id, { stopPropagation: () => {} })
              }
            >
              {/* Preview Image */}
              <div
                className="relative w-full aspect-[210/297] bg-slate-100 rounded-lg overflow-hidden group"
                onClick={(e) => handlePreview(tpl.img, e)}
              >
                {tpl.img ? (
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                    <span className="text-6xl opacity-20">✉️</span>
                    {/* You can replace this with actual image once available */}
                    {/* <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /> */}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    No Preview
                  </div>
                )}

                {/* Selected Badge */}
                {selectedTemplate === tpl.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <Check size={14} className="text-white" />
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    Click to Preview
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1 flex-grow">
                <h3
                  className="text-sm font-semibold text-slate-800 truncate"
                  title={tpl.name}
                >
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={(e) => handlePreview(tpl.img, e)}
                  className="flex-1 py-2 flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 font-medium transition-colors"
                >
                  <Eye size={14} />
                  Preview
                </button>
                <button
                  onClick={(e) => handleUseTemplate(tpl.id, e)}
                  className={`flex-1 py-2 flex items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors shadow-sm ${
                    selectedTemplate === tpl.id
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Check size={14} />
                  {selectedTemplate === tpl.id ? "Selected" : "Use Template"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="text-base font-semibold text-blue-900 mb-4 flex items-center gap-2">
            💡 Choosing the Right Template
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
            <div>
              <strong>Corporate/Finance:</strong> Use Professional or Executive
            </div>
            <div>
              <strong>Tech/Startup:</strong> Modern or Minimal work great
            </div>
            <div>
              <strong>Design/Marketing:</strong> Try Creative for visual impact
            </div>
            <div>
              <strong>Traditional Industries:</strong> Classic or Professional
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Preview Modal */}
      {isPreviewModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="bg-white p-8 rounded-lg">
              <div className="w-full max-w-2xl aspect-[210/297] bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <span className="text-8xl opacity-30">✉️</span>
                  <p className="text-slate-500 mt-4">Cover Letter Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterTemplates;
