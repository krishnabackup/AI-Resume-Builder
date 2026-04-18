import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../../api/axios";
import { renderAsync } from 'docx-preview';
import html2canvas from 'html2canvas';

const ResumeEditor = ({ initialData }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const templateId = searchParams.get('id');
    const resumeRef = useRef(null);
    const containerRef = useRef(null);

    // Static State
    const [resumeData, setResumeData] = useState(initialData || { name: "YOUR NAME", role: "Software Engineer" });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isDynamic, setIsDynamic] = useState(false);

    useEffect(() => {
        if (!templateId) return;

        const loadTemplate = async () => {
            setLoading(true);
            setIsDynamic(true);
            try {
                // 1. Get Template Details (URL)
                const metadataRes = await axiosInstance.get(`/api/template/${templateId}`);
                const fileUrl = metadataRes.data.fileUrl;

                // 2. Fetch Blob
                const fileRes = await axiosInstance.get(fileUrl, {
                    responseType: 'blob',
                    baseURL: ''
                });

                const blob = fileRes.data;
                const isHtml = blob.type.includes("html") || fileUrl.endsWith(".html");

                // 3. Render
                if (containerRef.current) {
                    containerRef.current.innerHTML = ''; // Clear previous

                    if (isHtml) {
                        // Direct HTML Render
                        const text = await blob.text();
                        containerRef.current.innerHTML = text;
                    } else {
                        // DOCX Render
                        await renderAsync(blob, containerRef.current, undefined, {
                            inWrapper: false,
                            ignoreWidth: false,
                            experimental: true
                        });
                    }

                    // 4. Make Editable Wrapper
                    containerRef.current.contentEditable = "true";
                    containerRef.current.spellcheck = false;
                }

            } catch (err) {
                console.error("Failed to load template:", err);
                alert("Failed to load template content.");
            } finally {
                setLoading(false);
            }
        };

        loadTemplate();
    }, [templateId]);


    const handleBlur = (field, value) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!isDynamic || !containerRef.current) return;

        setSaving(true);
        try {
            // 1. Capture Thumbnail
            const canvas = await html2canvas(containerRef.current, { scale: 0.5, useCORS: true });
            const thumbnailBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            // 2. Capture HTML Content
            const htmlContent = containerRef.current.innerHTML;
            const htmlBlob = new Blob([htmlContent], { type: "text/html" });

            // 3. Prepare Form Data
            const formData = new FormData();
            formData.append("templateFile", htmlBlob, "resume.html"); // Force .html extension
            formData.append("thumbnail", thumbnailBlob, "thumbnail.png");

            // 4. Send Update
            await axiosInstance.put(`/api/template/${templateId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Resume Saved Successfully!");
            navigate('/admin/create-templates');

        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save resume.");
        } finally {
            setSaving(false);
        }
    };

    // Force specific styles for the dynamic container to ensure it feels like a page
    const containerStyle = {
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        padding: '0', // DOCX preview usually handles its own margins or renders full page
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        margin: '0 auto',
        overflow: 'hidden'
    };

    return (
        <div className="min-h-screen bg-gray-200 py-10 flex flex-col items-center gap-6">

            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4 w-[210mm] justify-between items-center z-10">
                <div className="text-sm font-semibold text-gray-700">
                    {isDynamic ? "Edit Resume Template" : "Standard Resume Editor"}
                </div>

                {isDynamic ? (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? "Saving..." : "Save Resume"}
                    </button>
                ) : (
                    <button onClick={() => { }} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Download JSON
                    </button>
                )}
            </div>

            {/* Editor Area */}
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                        <span className="text-xl text-blue-600 font-medium">Loading Document...</span>
                    </div>
                )}

                {isDynamic ? (
                    /* Dynamic DOCX Render Container */
                    <div
                        ref={containerRef}
                        className="docx-render-area outline-none focus:ring-2 ring-blue-500 ring-offset-4"
                        style={containerStyle}
                    />
                ) : (
                    /* Static "Classic" Mode Fallback (Simplified) */
                    <div
                        ref={resumeRef}
                        style={{ ...containerStyle, padding: '20mm' }}
                        className="bg-white"
                    >
                        <h1 contentEditable className="text-4xl font-bold mb-4" onBlur={e => handleBlur('name', e.target.innerText)}>
                            {resumeData.name}
                        </h1>
                        <p className="text-gray-500">Static Mode Only - Go to Admin Templates to use Dynamic Mode</p>
                    </div>
                )}
            </div>

            {/* Global Styles for DOCX Preview Overrides if needed */}
            <style>{`
                .docx-render-area .docx_wrapper { background: transparent !important; padding: 0 !important; }
                .docx-render-area * { cursor: text; }
                // Hide docx-preview wrapper background
            `}</style>
        </div>
    );
};

export default ResumeEditor;
