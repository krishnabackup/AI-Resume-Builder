import React from "react";
import { Upload, Download, PenTool, Zap } from "lucide-react";

const CVBuilderTopBar = ({
  activeTab,
  setActiveTab,
  onSave,
  isSaving,
  title,
  onTitleChange,
  isAiMode,
  onToggleAiMode
}) => {
  return (
    <div className="w-full px-4 py-3 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      {/* Left Side: Title + Tabs + AI Toggle */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">

        {/* Title Section - Editable */}
        <div className="flex flex-col">
          {activeTab === "builder" ? (
            <>
              <div className="flex items-center gap-2 group">
                <input
                  type="text"
                  value={title || "Untitled CV"}
                  onChange={(e) => onTitleChange("title", e.target.value)}
                  className="text-2xl font-['Outfit'] font-bold bg-transparent border-b-2 border-dashed border-slate-200 hover:border-slate-400 focus:border-blue-500 focus:border-solid focus:outline-none transition-colors w-full md:w-auto min-w-[200px]"
                  placeholder="CV Title"
                />
                <PenTool size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 select-none">Click to rename your document</span>
            </>
          ) : (
            <h1 className="text-2xl font-['Outfit'] select-none">CV Templates</h1>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1.5 w-fit shrink-0">
          <button
            onClick={() => setActiveTab("builder")}
            className={`py-1 px-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "builder"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
              } select-none`}
          >
            Builder
          </button>

          {/* Upload */}
          <button className="flex items-center gap-2 text-white bg-black rounded-lg text-sm transition-all duration-200 hover:bg-black/80 py-2 px-3 sm:px-5 whitespace-nowrap">
            <Upload size={18} />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Download */}
          <button
            onClick={() => setActiveTab("templates")}
            className={`py-1 px-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "templates"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
              } select-none`}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Downloading…</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span className="hidden sm:inline">Download</span>
              </>
            )}
          </button>
        </div>

        {/* AI Mode Toggle */}
        {activeTab === "builder" && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleAiMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isAiMode
                ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <Zap size={16} className={`transition-colors ${isAiMode ? "fill-purple-700 text-purple-700" : "text-slate-400"}`} />
              <span>AI Mode</span>
              <div
                className={`relative w-8 h-4 rounded-full transition-colors ml-1 ${isAiMode ? "bg-purple-600" : "bg-slate-300"
                  }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${isAiMode ? "left-[18px]" : "left-0.5"
                    }`}
                />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Right Side: Actions */}
      <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 w-full md:w-auto">
        <button className="items-center gap-2 px-4 py-2 rounded-lg hidden md:flex border border-gray-300 bg-white text-gray-800 font-medium shadow-sm hover:bg-black hover:text-white transition-all duration-200 select-none">
          <PenTool size={18} />
          CV Designer
        </button>

        <button className="flex gap-2 text-white cursor-pointer bg-black border-0 rounded-lg text-sm transition-all duration-200 select-none md:hover:bg-black/70 py-2 px-5 md:py-2.5 md:px-5">
          <Upload size={18} />
          <span className="hidden md:inline">Upload</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex gap-2 text-white cursor-pointer bg-indigo-600 border-0 rounded-lg select-none text-sm transition-all duration-200 hover:bg-indigo-700 py-2 px-5 md:py-2.5 md:px-5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full w-4 h-4 border-2 border-white border-t-transparent" />
          ) : (
            <Download size={18} />
          )}
          <span className="hidden md:inline">{isSaving ? "Saving..." : "Download"}</span>
        </button>
      </div>
    </div>
  );
};

export default CVBuilderTopBar;
