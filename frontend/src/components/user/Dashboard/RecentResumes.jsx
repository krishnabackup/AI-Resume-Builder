import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import {
  FiFileText,
  FiFile,
  FiEdit,
  FiDownload,
  FiEye,
  FiClock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";


const RecentDocuments = () => {
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);


  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);


  useEffect(() => {
    fetchRecent();


    // Faster refresh for better responsiveness
    const interval = setInterval(() => {
      fetchRecent();
    }, 5000); // refresh every 1 sec


    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handleFocus = () => {
      fetchRecent();
    };


    // Also refresh when user becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRecent();
      }
    };


    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);


    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  /* ---------------- FETCH RECENT ---------------- */


  const fetchRecent = async () => {
    try {
     const res = await axiosInstance.get("/api/downloads/recent?limit=50&page=1");


      console.log("All downloads data:", res.data.downloads);
      console.log("Download types:", res.data.downloads.map((d) => ({ type: d.type, action: d.action, name: d.name })));


      // TEMPORARILY DISABLE FILTERING TO SEE ALL DATA
      // Filter only downloaded files (action: 'download')
      // const downloadedDocs = res.data.downloads.filter((d) =>
      //   d.action === 'download' || d.action === undefined
      // );


      // Use all data for now to debug
      const downloadedDocs = res.data.downloads;


      console.log("TEMP - All docs (no filtering):", downloadedDocs.map((d) => ({ type: d.type, action: d.action, name: d.name })));


      const docs = downloadedDocs.map((d) => ({
        id: d._id?.toString?.() || d.id,
        name: d.name,
        type: d.type,
        action: d.action || "download", // ⭐ activity
        format: (d.format || (d.type === "cover-letter" ? "DOCX" : "PDF")).toUpperCase(),
        template: d.template,
        size: d.size || "200 KB",
        downloadDate: d.downloadDate,
      }));


      console.log("Mapped docs:", docs);


    docs.sort((a, b) => new Date(b.downloadDate) - new Date(a.downloadDate));

// Always keep the newest activity per type
const latest = {};

docs.forEach((doc) => {
  if (
    !latest[doc.type] ||
    new Date(doc.downloadDate) > new Date(latest[doc.type].downloadDate)
  ) {
    latest[doc.type] = doc;
  }
});

console.log("Latest docs by type:", latest);

setRecentDocs(Object.values(latest));  
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  /* ---------------- PREVIEW ---------------- */


  const handlePreview = async (doc) => {
    try {
      setPreviewLoading(true);


      const res = await axiosInstance.get(`/api/downloads/${doc.id}`);


      setPreviewDoc({
        ...doc,
        html: res.data.html,
      });


      // Don't create preview activity records - just preview the existing document
      // This prevents cluttering the recent documents with preview actions
    } catch (err) {
      console.error("Preview failed:", err);
    } finally {
      setPreviewLoading(false);
    }
  };


  /* ---------------- DOWNLOAD ---------------- */


  const handleDownload = async (doc) => {
    try {
      const url =
        doc.format === "DOCX"
          ? `/api/downloads/${doc.id}/word`
          : `/api/downloads/${doc.id}/pdf`;


      const res = await axiosInstance.get(url, { responseType: "blob" });


      const blob = new Blob([res.data], {
        type:
          doc.format === "PDF"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });


      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${doc.name}.${doc.format.toLowerCase()}`;
      link.click();


      // Immediate refresh after download
      setTimeout(() => fetchRecent(), 500);
    } catch {
      alert("Download failed");
    }
  };


  /* ---------------- HELPERS ---------------- */


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date;


    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);


    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;


    return date.toLocaleDateString();
  };


  const getActionText = (action) => {
    if (action === "visited") return "Viewed";
    if (action === "preview") return "Previewed";
    return "Downloaded";
  };


  const getTypeIcon = (type) => {
    if (type === "resume") return <FiFileText />;
    if (type === "cover-letter") return <FiEdit />;
    if (type === "cv") return <FiFile />;
    return <FiFile />;
  };


  /* ---------------- LOADING ---------------- */


  if (loading) {
    return (
      <div className="py-10 text-center text-gray-400">
        Loading recent documents...
      </div>
    );
  }


  if (!recentDocs.length) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
        No recent documents yet
      </div>
    );
  }


  return (
    <>
      {/* ---------------- CARDS ---------------- */}


      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Documents
          </h2>


          <a
            href="/user/downloads"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            View all
          </a>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs">
                <span className="text-gray-700">{getTypeIcon(doc.type)}</span>


                <span className="uppercase font-semibold">{doc.type}</span>


                <span className="ml-auto bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">
                  {doc.format}
                </span>
              </div>


              <h3 className="font-semibold text-sm text-gray-900 truncate">
                {doc.name}
              </h3>


              {doc.template && (
                <p className="text-[11px] text-gray-400 mt-1 truncate">
                  {doc.template}
                </p>
              )}


              {/* Activity */}
              <div className="flex items-center text-[11px] text-gray-400 mt-2 gap-1">
                <FiClock size={10} />
                {getActionText(doc.action)} {formatDate(doc.downloadDate)}
              </div>


              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handlePreview(doc)}
                  className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1"
                >
                  <FiEye size={11} />
                  Preview
                </button>


                <button
                  onClick={() => handleDownload(doc)}
                  className="flex-1 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-1"
                >
                  <FiDownload size={11} />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* ---------------- PREVIEW MODAL ---------------- */}


      <AnimatePresence>
        {previewDoc && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{previewDoc.name}</h3>


                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>


              {previewLoading ? (
                <div className="text-center py-10 text-gray-400">
                  Loading preview...
                </div>
              ) : (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewDoc.html }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export default RecentDocuments;

