import React, { useState, useEffect, useCallback } from "react";
import { Check, X, Eye, Download } from "lucide-react";
import axiosInstance from "../../../api/axios";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x180";

// ─── API Helpers ──────────────────────────────────────────────────────────────

const api = {
  fetchPending: () => axiosInstance.get("/api/template?status=pending"),
  approve: (id) => axiosInstance.put(`/api/template/approve/${id}`),
  reject: (id) => axiosInstance.delete(`/api/template/${id}`),
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function usePendingTemplates() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingTemplates = useCallback(async () => {
    try {
      const { data } = await api.fetchPending();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching pending templates:", err);
      setError("Failed to load pending templates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPendingTemplates(); }, [fetchPendingTemplates]);

  const removeRequest = (id) =>
    setRequests((prev) => prev.filter((t) => t._id !== id));

  return { requests, loading, error, removeRequest };
}

function useScrollLock(active) {
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [active]);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ label }) => (
  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
    {label}
  </span>
);

const IconButton = ({ onClick, title, color, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-full text-white shadow-sm transition ${color}`}
  >
    {children}
  </button>
);

const TemplateCard = React.memo(function TemplateCard({ template, onPreview, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <img
        src={template.imageUrl || PLACEHOLDER_IMG}
        alt={template.name}
        className="w-full h-48 object-cover rounded-t-2xl cursor-pointer"
        onClick={() => onPreview(template)}
      />

      <div className="p-5">
        <h2 className="text-lg font-semibold text-slate-900">{template.name}</h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-slate-500 text-sm">{template.category}</p>
        </div>
        <p className="text-slate-600 mt-2 text-sm line-clamp-2">{template.description}</p>

        <div className="mt-5 flex justify-end gap-3">
          <IconButton
            onClick={() => onApprove(template._id)}
            title="Approve"
            color="bg-green-500 hover:bg-green-600"
          >
            <Check size={18} />
          </IconButton>

          <IconButton
            onClick={() => onReject(template._id)}
            title="Reject"
            color="bg-red-500 hover:bg-red-600"
          >
            <X size={18} />
          </IconButton>

          <IconButton
            onClick={() => onPreview(template)}
            title="Preview"
            color="bg-blue-500 hover:bg-blue-600"
          >
            <Eye size={18} />
          </IconButton>
        </div>
      </div>
    </div>
  );
});

function PreviewModal({ template, onClose }) {
  useScrollLock(!!template);

  if (!template) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-11/12 max-w-3xl rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-slate-900">{template.name}</h2>
        <p className="text-slate-500 mb-4">{template.description}</p>

        <div className="mb-4">
          <StatusBadge label={template.category} />
        </div>

        <div className="mb-6 flex justify-center bg-gray-100 p-4 rounded-lg">
          <img
            src={template.imageUrl}
            alt={template.name}
            className="max-h-[60vh] object-contain shadow-lg"
          />
        </div>

        <div className="flex justify-end">
          <a
            href={template.fileUrl}
            download
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            <Download size={18} /> Download Template File (.docx)
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminAcceptUser() {
  const { requests, loading, error, removeRequest } = usePendingTemplates();
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleApprove = async (id) => {
    try {
      await api.approve(id);
      alert("Template approved successfully!");
      removeRequest(id);
    } catch (err) {
      console.error("Error approving template:", err);
      alert("Failed to approve template.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this template?")) return;
    try {
      await api.reject(id);
      alert("Template rejected and deleted.");
      removeRequest(id);
    } catch (err) {
      console.error("Error rejecting template:", err);
      alert("Failed to reject template.");
    }
  };

  if (loading) return <div className="p-6 text-slate-500">Loading pending requests...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Template Approval</h1>

      {requests.length === 0 ? (
        <p className="text-slate-500">No pending template requests</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onPreview={setPreviewTemplate}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      <PreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}