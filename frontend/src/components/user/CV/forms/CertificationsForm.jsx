import { useState } from "react";
import MonthYearPicker from "../../MonthYearPicker";
import { Trash2, EditIcon, Check, Plus } from "lucide-react";

const CertificationsForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);

  // Helper to get border class for required fields
  const getBorderClass = (value) => {
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  };
  
  // Debug log to track form data
  console.log('Certifications Form - formData:', formData);

  const addCertification = () => {
    try {
      const id = crypto.randomUUID();

      setFormData((prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications ?? []),
          {
            id,
            name: "",
            issuer: "",
            date: "",
            link: "",
          },
        ],
      }));

      setEditingId(id);
    } catch (error) {
      console.error('Error adding certification:', error);
    }
  };

  const removeCertification = (id) => {
    try {
      setFormData((prev) => ({
        ...prev,
        certifications: (prev.certifications ?? []).filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error removing certification:', error);
    }
  };

  const handleChange = (id, field, value) => {
    try {
      setFormData((prev) => ({
        ...prev,
        certifications: (prev.certifications ?? []).map((c) =>
          c.id === id ? { ...c, [field]: value } : c,
        ),
      }));
    } catch (error) {
      console.error('Error updating certification:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData.certifications ?? []).map((cert, index) => (
        <div
          key={cert.id}
          className="shadow-sm border border-gray-300 rounded-lg p-2"
        >
          {/* ================= CARD MODE ================= */}
          {editingId !== cert.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              {/* Header */}
              <div className="w-full flex justify-between items-center">
                <span className="font-medium">Certification {index + 1}</span>

                <div className="flex gap-4 items-center">
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setEditingId(cert.id)}
                  >
                    <EditIcon size={18} />
                  </button>

                  <button
                    className="hover:text-red-600 transition-colors"
                    onClick={() => removeCertification(cert.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="w-full mt-2 text-left">
                <div className="text-md font-semibold break-all">
                  {cert.name || "—"}
                </div>

                {cert.issuer && (
                  <div className="text-sm font-medium">{cert.issuer}</div>
                )}

                <div className="w-full py-1 flex justify-between items-center">
                  {cert.date && (
                    <span className="text-xs text-slate-500">{cert.date}</span>
                  )}

                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600"
                    >
                      View Credential
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= EDIT MODE ================= */}
          {editingId === cert.id && (
            <>
              <div className="px-3 py-4">
                <div className="flex flex-col gap-2 mb-3">
                  <label>Certification Name *</label>
                  <input
                    type="text"
                    className={`px-2.5 py-2 border text-sm rounded focus:outline-none focus:shadow-sm ${getBorderClass(cert.name)}`}
                    placeholder="AWS Solutions Architect"
                    value={cert.name}
                    onChange={(e) =>
                      handleChange(cert.id, "name", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  <label>Issuing Organization *</label>
                  <input
                    type="text"
                    className={`px-2.5 py-2 border text-sm rounded focus:outline-none focus:shadow-sm ${getBorderClass(cert.issuer)}`}
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) =>
                      handleChange(cert.id, "issuer", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  <label>Date Obtained *</label>
                  <MonthYearPicker
                    alignRight={true}
                    className={`px-2.5 py-2 border text-sm rounded focus:outline-none focus:shadow-sm ${getBorderClass(cert.date)}`}
                    value={cert.date}
                    onChange={(e) =>
                      handleChange(cert.id, "date", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  <label>Credential Link (Optional)</label>
                  <input
                    type="text"
                    className="px-2.5 py-2 border text-sm rounded focus:border-blue-500 focus:outline-none focus:shadow-sm"
                    placeholder="https://credential.url"
                    value={cert.link}
                    onChange={(e) =>
                      handleChange(cert.id, "link", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-2 px-2 pb-4">
                <button
                  className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-700"
                  onClick={() => removeCertification(cert.id)}
                >
                  <Trash2 size={18} />
                  Delete
                </button>

                <button
                  className="text-sm font-medium bg-black py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-black/70"
                  onClick={() => setEditingId(null)}
                >
                  <Check size={18} />
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addCertification}
        className="flex items-center gap-2 text-left text-sm font-medium"
      >
        <Plus size={14} /> Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;
