import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Upload, Download, PenTool, Zap, ChevronDown, Plus } from "lucide-react";

const CVBuilderTopBar = ({
  activeTab, setActiveTab, onSave, onDownload, onDownloadWord, onUpload,
  isSaving, isDownloading, title, onTitleChange, isAiMode, onToggleAiMode,
  titlePlaceholder = "Untitled CV", templatesLabel = "CV Templates",
  showTabs = true, showAiToggle = true, showUpload = true, showDesigner = true,
  downloadDisabled = false, showDownloadWord = true, extraButtons = null,
  showReset = false, onReset, resetLabel = "Create New Resume", parsingConfidence = null,
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [localTitle, setLocalTitle] = useState(title ?? "");
  const uploadInputRef = useRef(null);
  const downloadDropdownMobileRef = useRef(null);
  const downloadDropdownDesktopRef = useRef(null);

  // ── Memoized: Title width calculation ──
  const titleInputWidth = useMemo(() => {
    const currentTitle = title !== undefined ? title : localTitle;
    const display = currentTitle || titlePlaceholder;
    return `${Math.max(display.length + 1, 1)}ch`;
  }, [title, localTitle, titlePlaceholder]);

  // ── Memoized: Click outside handler ──
  const handleClickOutside = useCallback((e) => {
    const inMobile = downloadDropdownMobileRef.current?.contains(e.target);
    const inDesktop = downloadDropdownDesktopRef.current?.contains(e.target);
    if (!inMobile && !inDesktop) setShowDownloadMenu(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // ── Sync title prop to local state ──
  useEffect(() => { if (title !== undefined) setLocalTitle(title ?? ""); }, [title]);

  // ── Memoized handlers (prevents re-creation) ──
  const handleUploadClick = useCallback(() => { uploadInputRef.current?.click(); }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload?.(file);
    e.target.value = "";
  }, [onUpload]);

  const handleTitleChange = useCallback((e) => {
    const nextValue = e.target.value;
    setLocalTitle(nextValue);
    onTitleChange?.("title", nextValue);
  }, [onTitleChange]);

  const toggleDownloadMenu = useCallback(() => {
    if (showDownloadWord) setShowDownloadMenu(v => !v);
    else onDownload?.();
  }, [showDownloadWord, onDownload]);

  const handleDownloadPdf = useCallback(() => { setShowDownloadMenu(false); onDownload?.(); }, [onDownload]);
  const handleDownloadWord = useCallback(() => { setShowDownloadMenu(false); onDownloadWord?.(); }, [onDownloadWord]);

  const currentTitle = title !== undefined ? title : localTitle;

  return (
    <div className="w-full px-3 sm:px-4 py-3 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
      <input ref={uploadInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />

      {/* ── Left section ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 w-full md:w-auto">
        <div className="relative flex sm:flex-row flex-col items-center sm:pb-0 pb-4">
          {activeTab === "builder" ? (
            <>
              <div className="flex items-center gap-2 group">
                <input type="text" value={currentTitle} onChange={handleTitleChange}
                  className="text-xl sm:text-2xl leading-tight font-['Outfit'] font-bold bg-transparent border-b-2 border-dashed border-slate-200 hover:border-slate-400 focus:border-blue-500 focus:border-solid focus:outline-none transition-colors w-auto"
                  style={{ width: titleInputWidth }} placeholder={titlePlaceholder} aria-label="Document title" />
                <PenTool size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" aria-hidden="true" />
              </div>
              <span className="mt-1 text-[11px] text-slate-400 select-none sm:pb-20 md:absolute md:top-full md:left-0 md:mt-0.5 md:whitespace-nowrap">
                Click to rename your document
              </span>
            </>
          ) : (
            <h1 className="text-xl sm:text-2xl font-['Outfit'] select-none whitespace-nowrap">{templatesLabel}</h1>
          )}
        </div>

        <div className="flex items-center justify-between w-full">

  {/* Tabs */}
  {showTabs && (
    <div className="bg-gray-100 rounded-xl p-1 flex w-fit" role="tablist">
      <button
        type="button"
        onClick={() => setActiveTab("builder")}
        className={`rounded-xl px-3 py-1.5 text-sm ${
          activeTab === "builder"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600"
        }`}
      >
        Builder
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("templates")}
        className={`rounded-xl px-3 py-1.5 text-sm ${
          activeTab === "templates"
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600"
        }`}
      >
        Templates
      </button>
    </div>
  )}

  {/* Actions (Mobile aligned right) */}
  <div className="md:hidden relative" ref={downloadDropdownMobileRef}>
    <button
      onClick={() => setShowDownloadMenu((v) => !v)}
      className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg text-sm"
    >
      Actions <ChevronDown size={14} />
    </button>
{showDownloadMenu && (
  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

    {showReset && (
      <button
        onClick={() => {
          setShowDownloadMenu(false);
          onReset?.();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
      >
        <Plus size={16} className="text-emerald-600" />
        <span className="text-slate-700">{resetLabel}</span>
      </button>
    )}

    {showUpload && (
      <button
        onClick={() => {
          setShowDownloadMenu(false);
          handleUploadClick();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
      >
        <Upload size={16} className="text-black" />
        <span className="text-slate-700">Upload Resume</span>
      </button>
    )}

    <div className="border-t border-gray-100" />

    <button
      onClick={() => {
        setShowDownloadMenu(false);
        onDownload?.();
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
    >
      <Download size={16} className="text-red-500" />
      <span className="text-slate-700">Download PDF</span>
    </button>

    {showDownloadWord && (
      <button
        onClick={() => {
          setShowDownloadMenu(false);
          onDownloadWord?.();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
      >
        <Download size={16} className="text-blue-500" />
        <span className="text-slate-700">Download Word</span>
      </button>
    )}
  </div>
)}
  </div>

</div>

        {parsingConfidence && (
          <div title={parsingConfidence.includes('AI') ? 'AI assisted in parsing this resume' : `Parsing quality: ${parsingConfidence}`}
            className={`px-3 py-1.5 flex items-center gap-1.5 rounded-xl text-xs font-medium whitespace-nowrap shadow-sm border ${
              parsingConfidence.includes('High') ? 'bg-green-50 text-green-700 border-green-200' :
              parsingConfidence === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-red-50 text-red-700 border-red-200'}`}>
            <Zap size={14} className={parsingConfidence.includes('High') ? 'text-green-600' : parsingConfidence === 'Medium' ? 'text-yellow-600' : 'text-red-600'} aria-hidden="true" />
            {parsingConfidence.includes('AI') ? 'AI Assisted Extraction' : `${parsingConfidence} Match`}
          </div>
        )}
      </div>

      {/* ── Right section ── */}
      <div className="hidden md:flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full md:w-auto">
        {extraButtons}
        {showReset && (
          <button type="button" onClick={onReset} className="flex items-center gap-2 text-white bg-emerald-600 rounded-lg text-sm transition-all duration-200 hover:bg-emerald-700 py-2 px-3 sm:px-5 whitespace-nowrap">
            <Plus size={18} aria-hidden="true" />
            <span className="hidden sm:inline">{resetLabel}</span>
          </button>
        )}
        {showUpload && (
          <button type="button" onClick={handleUploadClick} className="flex items-center gap-2 text-white bg-black rounded-lg text-sm transition-all duration-200 hover:bg-black/80 py-2 px-3 sm:px-5 whitespace-nowrap">
            <Upload size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        )}

        <div className="relative" ref={downloadDropdownDesktopRef}>
          <button type="button" onClick={toggleDownloadMenu} disabled={isDownloading || downloadDisabled}
            className="flex items-center gap-2 text-white bg-indigo-600 rounded-lg text-sm transition-all duration-200 hover:bg-indigo-700 py-2 px-3 sm:px-5 disabled:bg-indigo-400 disabled:cursor-not-allowed whitespace-nowrap"
            aria-haspopup="menu" aria-expanded={showDownloadMenu && showDownloadWord}>
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <Download size={18} aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{isDownloading ? "Downloading…" : "Download"}</span>
            {showDownloadWord && <ChevronDown size={14} className={`transition-transform duration-200 ${showDownloadMenu ? "rotate-180" : ""}`} aria-hidden="true" />}
          </button>

          {showDownloadMenu && showDownloadWord && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <button type="button" onClick={handleDownloadPdf} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Download size={15} className="text-red-500" aria-hidden="true" /> Download PDF
              </button>
              <div className="border-t border-gray-100" />
              <button type="button" onClick={handleDownloadWord} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Download size={15} className="text-blue-500" aria-hidden="true" /> Download Word
              </button>
            </div>
          )}
        </div>
      </div>
    {/* ── Mobile Actions (Working Dropdown) ── */}
{/* <div className="md:hidden w-full relative" ref={downloadDropdownMobileRef}>
  <button
    onClick={() => setShowDownloadMenu((v) => !v)}
    className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm"
  >
    Actions <ChevronDown size={16} />
  </button>

  {showDownloadMenu && (
    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      
      {showReset && (
        <button
          onClick={() => {
            setShowDownloadMenu(false);
            onReset?.();
          }}
          className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <Plus size={16} /> {resetLabel}
        </button>
      )}

      {showUpload && (
        <button
          onClick={() => {
            setShowDownloadMenu(false);
            handleUploadClick();
          }}
          className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <Upload size={16} /> Upload
        </button>
      )}

      <button
        onClick={() => {
          setShowDownloadMenu(false);
          onDownload?.();
        }}
        className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
      >
        <Download size={16} /> Download PDF
      </button>

      {showDownloadWord && (
        <button
          onClick={() => {
            setShowDownloadMenu(false);
            onDownloadWord?.();
          }}
          className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <Download size={16} /> Download Word
        </button>
      )}
    </div>
  )}
</div> */}
    </div>
  );
};

export default CVBuilderTopBar;