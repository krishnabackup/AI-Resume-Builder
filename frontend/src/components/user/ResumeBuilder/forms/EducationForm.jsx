import { useEffect, useState } from "react";
import { Check, EditIcon, Plus, Trash2 } from "lucide-react";
import { getCompletionStatus } from "../completion";

const EducationForm = ({ formData, setFormData }) => {
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const { sectionValidationStatus } = getCompletionStatus(formData);
    if (sectionValidationStatus.hasValidEducation) {
      setEditingId(null);
    } else {
      setEditingId(formData?.education?.[0]?.id || null);
    }
  }, []);

  const addEducation = () => {
    const id = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      education: [
        ...(prev?.education ?? []),
        {
          id,
          school: "",
          degree: "",
          gpa: "",
          startDate: "",
          graduationDate: "",
        },
      ],
    }));
    setEditingId(id);
  };

  function formatMonthYear(value) {
    if (!value) return "";
    const [year, month] = value.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[Number(month) - 1]}-${year}`;
  }

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev?.education ?? []).filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData?.education ?? []).map((edu, index) => (
        <div
          key={edu.id}
          className="shadow-sm border border-gray-300 rounded-md p-2"
        >
          {/* Card UI */}
          {editingId !== edu.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              {/* Option Header */}
              <div className="w-full flex gap-4 justify-between items-center">
                <div className=" text-md">
                  <span className="font-medium">Education {index + 1}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setEditingId(edu.id)}
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    className="hover:text-red-600 transition-colors"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {/* Card Content */}
              <div className="w-full mt-2 text-left">
                <div className="w-[90%] flex gap-4 justify-start items-center break-all">
                  <span className="text-left text-md font-semibold">
                    {edu.school}
                  </span>
                </div>
                <span className="text-sm font-medium break-words">
                  {edu.degree}
                </span>
                <div className="w-full py-1 flex gap-2 justify-between items-center">
                  <div className="">
                    {edu?.gpa && (
                      <span className="text-sm text-slate-500">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                  {edu?.startDate && edu?.graduationDate && (
                    <span className="text-xs text-slate-500">
                      {formatMonthYear(edu?.startDate)} -{" "}
                      {formatMonthYear(edu?.graduationDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Education Form Fields */}

          {editingId === edu.id && (
            <>
              <div className="px-3 py-4">
                <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                  <label>Degree *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={edu.degree || ""}
                    placeholder="Bachelor of Science in Computer Science"
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = (formData?.education ?? []).map((item) =>
                        item.id === edu.id ? { ...item, degree: val } : item,
                      );
                      setFormData((prev) => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                  <label>School *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={edu.school || ""}
                    placeholder="University Name"
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = (formData?.education ?? []).map((item) =>
                        item.id === edu.id ? { ...item, school: val } : item,
                      );
                      setFormData((prev) => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                  <label>Start Date *</label>
                  <input
                    type="month"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={edu.startDate || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = (formData?.education ?? []).map((item) =>
                        item.id === edu.id ? { ...item, startDate: val } : item,
                      );
                      setFormData((prev) => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                  <label>Graduation Date *</label>
                  <input
                    type="month"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={edu.graduationDate || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = (formData?.education ?? []).map((item) =>
                        item.id === edu.id
                          ? { ...item, graduationDate: val }
                          : item,
                      );
                      setFormData((prev) => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1.5 mb-4">
                  <label>GPA (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={edu.gpa || ""}
                    placeholder="7.8/10.0"
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = (formData?.education ?? []).map((item) =>
                        item.id === edu.id ? { ...item, gpa: val } : item,
                      );
                      setFormData((prev) => ({ ...prev, education: updated }));
                    }}
                  />
                </div>
              </div>
              {/* Done Button */}
              <div className="flex justify-end items-center gap-2 px-2 pb-4">
                <button
                  className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800"
                  onClick={() => removeEducation(edu.id)}
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
      <button className="flex items-center text-left" onClick={addEducation}>
        <Plus size={14} className="mr-1 inline" /> Add Education
      </button>
    </div>
  );
};

export default EducationForm;
