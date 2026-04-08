import React from "react";
import {
  FiFileText,
  FiFile,
  FiEdit,
  FiDownload,
  FiEye,
  FiClock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentDocuments } from "../../../hooks/useRecentDocuments";
import { formatDate, getActionText } from "../../../utils/dashboardUtils";


const RecentDocuments = () => {
  const {
    recentDocs,
    loading,
    previewDoc,
    previewLoading,
    handlePreview,
    handleDownload,
    setPreviewDoc,
    refetch
  } = useRecentDocuments();




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

