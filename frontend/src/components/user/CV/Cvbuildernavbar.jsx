import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, PenTool, Zap, ChevronDown } from "lucide-react";

const CVBuilderTopBar = ({
  activeTab,
  setActiveTab,
  onSave,
  onDownload,
  onDownloadWord,
  onUpload,
  isSaving,
  isDownloading,
  title,
  onTitleChange,
  isAiMode,
  onToggleAiMode,
  // Customisation props
  titlePlaceholder = "Untitled CV",
  templatesLabel = "CV Templates",
  showTabs = true,
  showAiToggle = true,
  showUpload = true,
  showDesigner = true,
  downloadDisabled = false,
  extraButtons = null,
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [localTitle, setLocalTitle] = useState(title ?? "");
  const uploadInputRef = useRef(null);
  const downloadDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(e.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (title !== undefined) {
      setLocalTitle(title ?? "");
    }
  }, [title]);

  const handleUploadClick = () => uploadInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload?.(file);
    e.target.value = '';
  };

  const currentTitle = title !== undefined ? title : localTitle;
  const displayForWidth = currentTitle || titlePlaceholder;
  const titleInputWidth = `${Math.max(displayForWidth.length + 1, 1)}ch`;

  return (
    <div className="w-full px-3 sm:px-4 py-3 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
      {/* ── Left section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 w-full md:w-auto">

        {/* Title Section - Editable */}
        <div className="relative flex items-center">
          {activeTab === "builder" ? (
            <>
              <div className="flex items-center gap-2 group">
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setLocalTitle(nextValue);
                    onTitleChange?.("title", nextValue);
                  }}
                  className="text-xl sm:text-2xl leading-tight font-['Outfit'] font-bold bg-transparent border-b-2 border-dashed border-slate-200 hover:border-slate-400 focus:border-blue-500 focus:border-solid focus:outline-none transition-colors w-auto"
                  style={{ width: titleInputWidth }}
                  placeholder={titlePlaceholder}
                />
                <PenTool size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
              </div>
              <span className="absolute top-full left-0 mt-0.5 text-[11px] text-slate-400 select-none whitespace-nowrap">Click to rename your document</span>
            </>
          ) : (
            <h1 className="text-xl sm:text-2xl font-['Outfit'] select-none whitespace-nowrap">{templatesLabel}</h1>
          )}
        </div>

        {/* Tabs */}
        {showTabs && <div className="bg-gray-100 rounded-xl p-1 flex w-fit">
          <button
            onClick={() => setActiveTab("builder")}
            className={`rounded-xl px-3 py-1.5 text-sm transition whitespace-nowrap ${activeTab === "builder"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
              }`}
          >
            Builder
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`rounded-xl px-3 py-1.5 text-sm transition whitespace-nowrap ${activeTab === "templates"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
              }`}
          >
            Templates
          </button>
        </div>}

        {/* AI Mode Toggle */}
        {showAiToggle && activeTab === "builder" && (
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

      {/* ── Right section ── */}
      <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full md:w-auto">
        {/* Extra Buttons */}
        {extraButtons}

        {/* Designer */}
        {showDesigner && <button className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium shadow-sm hover:bg-black hover:text-white transition-all duration-200 whitespace-nowrap">
          <PenTool size={18} />
          CV Designer
        </button>}

        {/* Upload */}
        {showUpload && <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 text-white bg-black rounded-lg text-sm transition-all duration-200 hover:bg-black/80 py-2 px-3 sm:px-5 whitespace-nowrap"
        >
          <Upload size={18} />
          <span className="hidden sm:inline">Upload</span>
        </button>}
        <input
          ref={uploadInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Download dropdown */}
        <div className="relative" ref={downloadDropdownRef}>
          <button
            onClick={() => setShowDownloadMenu((v) => !v)}
            disabled={isDownloading || downloadDisabled}
            className="flex items-center gap-2 text-white bg-indigo-600 rounded-lg text-sm transition-all duration-200 hover:bg-indigo-700 py-2 px-3 sm:px-5 disabled:bg-indigo-400 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            <span className="hidden sm:inline">{isDownloading ? 'Downloading…' : 'Download'}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
          </button>

          {showDownloadMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => { setShowDownloadMenu(false); onDownload?.(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download size={15} className="text-red-500" />
                Download PDF
              </button>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => { setShowDownloadMenu(false); onDownloadWord?.(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download size={15} className="text-blue-500" />
                Download Word
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVBuilderTopBar;
