import { useEffect, useState } from "react";
import { Check, EditIcon, Plus, Trash2 } from "lucide-react";
import { getCompletionStatus } from "../completion";

const CertificationsForm = ({ formData, setFormData }) => {
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const { sectionValidationStatus } = getCompletionStatus(formData);
    if (sectionValidationStatus.hasValidCertificationInfo) {
      setEditingId(null);
    } else {
      setEditingId(formData?.certifications?.[0]?.id || null);
    }
  }, []);

  const addCertification = () => {
    const id = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...(prev?.certifications ?? []),
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
  };

  const removeCertification = (id) => {
    setFormData((prev) => ({
      ...prev,
      certifications: (prev?.certifications ?? []).filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData?.certifications ?? []).map((cert, index) => (
        <div
          key={cert.id}
          className="shadow-sm border border-gray-300 rounded-lg p-2"
        >
          {/* ===== CARD MODE ===== */}
          {editingId !== cert.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              {/* Header */}
              <div className="w-full flex gap-4 justify-between items-center">
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

              {/* Content */}
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

          {/* ===== EDIT MODE ===== */}
          {editingId === cert.id && (
            <>
              <div className="px-3 py-4">
                <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                  <label>Certification Name *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={cert.name || ""}
                    placeholder="AWS Solutions Architect"
                    onChange={(e) => {
                      const updated = (formData?.certifications ?? []).map(
                        (item) =>
                          item.id === cert.id
                            ? { ...item, name: e.target.value }
                            : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        certifications: updated,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label>Issuing Organization *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={cert.issuer || ""}
                    placeholder="Amazon Web Services"
                    onChange={(e) => {
                      const updated = (formData?.certifications ?? []).map(
                        (item) =>
                          item.id === cert.id
                            ? { ...item, issuer: e.target.value }
                            : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        certifications: updated,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label>Date Obtained *</label>
                  <input
                    type="month"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={cert.date || ""}
                    onChange={(e) => {
                      const updated = (formData?.certifications ?? []).map(
                        (item) =>
                          item.id === cert.id
                            ? { ...item, date: e.target.value }
                            : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        certifications: updated,
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label>Credential Link (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={cert.link || ""}
                    placeholder="https://credential.url"
                    onChange={(e) => {
                      const updated = (formData?.certifications ?? []).map(
                        (item) =>
                          item.id === cert.id
                            ? { ...item, link: e.target.value }
                            : item,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        certifications: updated,
                      }));
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-2 px-2 pb-4">
                <button
                  className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800"
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

      <button
        className="flex items-center text-left"
        onClick={addCertification}
      >
        <Plus size={14} className="mr-1 inline" /> Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;
