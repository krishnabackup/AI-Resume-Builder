import { useState } from "react";
import MonthYearPicker from "../../MonthYearPicker";
import { Trash2, EditIcon, Check, GraduationCap, Plus } from "lucide-react";

const EducationForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);

  // Helper to get border class for required fields
  const getBorderClass = (value) => {
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  };
  
  // Debug log to track form data
  console.log('Education Form - formData:', formData);

  const addEducation = () => {
    try {
      const id = crypto.randomUUID();
      setFormData((prev) => ({
        ...prev,
        education: [
          ...(prev.education ?? []),
          {
            id,
            school: "",
            degree: "",
            location: "",
            graduationDate: "",
            gpa: "",
          },
        ],
      }));
      setEditingId(id);
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const removeEducation = (id) => {
    try {
      setFormData((prev) => ({
        ...prev,
        education: (prev.education ?? []).filter((e) => e.id !== id),
      }));
    } catch (error) {
      console.error('Error removing education:', error);
    }
  };

  const handleChange = (id, field, value) => {
    try {
      setFormData((prev) => ({
        ...prev,
        education: (prev.education ?? []).map((e) =>
          e.id === id ? { ...e, [field]: value } : e,
        ),
      }));
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData.education ?? []).map((edu, index) => (
        <div
          key={edu.id}
          className="shadow-sm border border-gray-300 rounded-md p-2"
        >
          {/* Card Mode */}
          {editingId !== edu.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              <div className="w-full flex justify-between items-center">
                <span className="font-medium">Education {index + 1}</span>
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

              <div className="w-full mt-2 text-left">
                <div className="text-md font-semibold break-all">
                  {edu.school || "—"}
                </div>
                {edu.degree && (
                  <div className="text-sm font-medium">{edu.degree}</div>
                )}
                {edu.location && (
                  <div className="text-sm text-slate-600">{edu.location}</div>
                )}
                <div className="w-full py-1 flex justify-between items-center">
                  {edu.gpa && (
                    <span className="text-xs text-slate-500">
                      GPA: {edu.gpa}
                    </span>
                  )}
                  {edu.graduationDate && (
                    <span className="text-xs text-slate-500">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {editingId === edu.id && (
            <>
              <div className="p-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <GraduationCap className="text-blue-600" size={18} />
                  <h4 className="font-semibold text-slate-800">Edit Education</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 pr-1 mb-2">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      School / University <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(edu.school)}`}
                      placeholder="University Name"
                      value={edu.school}
                      onChange={(e) =>
                        handleChange(edu.id, "school", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(edu.degree)}`}
                      placeholder="Bachelor of Science"
                      value={edu.degree}
                      onChange={(e) =>
                        handleChange(edu.id, "degree", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      placeholder="City, Country"
                      value={edu.location}
                      onChange={(e) =>
                        handleChange(edu.id, "location", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Graduation Date
                    </label>
                    <MonthYearPicker
                      alignRight={true}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      value={edu.graduationDate}
                      onChange={(e) =>
                        handleChange(edu.id, "graduationDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      GPA <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      placeholder="3.8/4.0"
                      value={edu.gpa}
                      onChange={(e) =>
                        handleChange(edu.id, "gpa", e.target.value)
                      }
                    />
                  </div>
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

      <button
        onClick={addEducation}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Plus size={14} />
        Add Education
      </button>
    </div>
  );
};

export default EducationForm;
