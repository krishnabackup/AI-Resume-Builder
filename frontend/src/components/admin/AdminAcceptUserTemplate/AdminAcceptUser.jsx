import React, { useState, useEffect } from "react";
import { Check, X, Eye, Download } from "lucide-react";
import axios from "axios";

export default function AdminAcceptUser() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const fetchPendingTemplates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/template?status=pending");
      // Transform API data to match UI expectations if needed, or just use as is
      // The controller returns fields: _id, name, category, fileUrl, imageUrl, description, etc.
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pending templates:", err);
      setError("Failed to load pending templates.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTemplates();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "approved") {
        await axios.put(`http://localhost:5000/api/template/approve/${id}`);
        alert("Template approved successfully!");
      } else if (action === "rejected") {
        if (window.confirm("Are you sure you want to reject and delete this template?")) {
          await axios.delete(`http://localhost:5000/api/template/${id}`);
          alert("Template rejected and deleted.");
        } else {
          return; // Cancel action
        }
      }

      // Remove from local list
      setRequests((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(`Error ${action} template:`, err);
      alert(`Failed to ${action} template.`);
    }
  };

  if (loading) return <div className="p-6">Loading pending requests...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">
        Template Approval
      </h1>

      {requests.length === 0 ? (
        <p className="text-slate-500">No pending template requests</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              {/* Cover */}
              <img
                src={template.imageUrl || "https://via.placeholder.com/300x180"}
                alt={template.name}
                className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
                onClick={() => setPreviewTemplate(template)}
              />

              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  {template.name}
                </h2>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-slate-500 text-sm">{template.category}</p>
                  {/* <p className="text-slate-400 text-xs">By {template.createdBy || "Unknown"}</p> */}
                </div>
                <p className="text-slate-600 mt-2 text-sm line-clamp-2">{template.description}</p>


                {/* Actions */}
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => handleAction(template._id, "approved")}
                    className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-sm"
                    title="Approve"
                  >
                    <Check size={18} />
                  </button>

                  <button
                    onClick={() => handleAction(template._id, "rejected")}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-sm"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>

                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-3xl rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2 text-slate-900">
              {previewTemplate.name}
            </h2>
            <p className="text-slate-500 mb-4">{previewTemplate.description}</p>
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                {previewTemplate.category}
              </span>
            </div>

            <div className="mb-6 flex justify-center bg-gray-100 p-4 rounded-lg">
              <img
                src={previewTemplate.imageUrl}
                alt={previewTemplate.name}
                className="max-h-[60vh] object-contain shadow-lg"
              />
            </div>

            <div className="flex justify-end">
              <a
                href={previewTemplate.fileUrl}
                download
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                <Download size={18} /> Download Template File (.docx)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
