import { useEffect, useState } from "react";
import MonthYearPicker from "../../MonthYearPicker";
import { Check, EditIcon, GraduationCap, Plus, Trash2 } from "lucide-react";
import { getCompletionStatus } from "../completion";
import { formatMonthYear, isFutureDate, isDateAfter } from "../../../../utils/dateUtils";

const EducationForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);

  // Helper to get border class for required fields
  const getBorderClass = (value, isError = false) => {
    if (isError) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  };

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

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev?.education ?? []).filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData?.education ?? []).map((edu, index) => {
        const errors = {};
        if (edu.startDate && isFutureDate(edu.startDate)) {
          errors.startDate = "Cannot be in the future";
        }
        if (edu.graduationDate && isFutureDate(edu.graduationDate)) {
          errors.graduationDate = "Cannot be in the future";
        }
        if (edu.startDate && edu.graduationDate && isDateAfter(edu.startDate, edu.graduationDate)) {
          errors.dateOrder = "Start date must be before graduation date";
          errors.startDate = errors.startDate || errors.dateOrder;
          errors.graduationDate = errors.graduationDate || errors.dateOrder;
        }
        const hasErrors = Object.keys(errors).length > 0;

        return (
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
                    {edu.school || "School Name"}
                  </span>
                </div>
                <span className="text-sm font-medium break-words">
                  {edu.degree || "Degree"}
                </span>
                <div className="w-full py-1 flex gap-2 justify-between items-center">
                  <div className="">
                    {edu?.gpa && (
                      <span className="text-sm text-slate-500">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                  {(edu?.startDate || edu?.graduationDate) && (
                    <span className="text-xs text-slate-500">
                      {formatMonthYear(edu?.startDate, { short: true }) || "Start Date"} -{" "}
                      {formatMonthYear(edu?.graduationDate, { short: true }) || "Graduation Date"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Education Form Fields */}

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
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(edu.degree)}`}
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
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      School <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(edu.school)}`}
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <MonthYearPicker
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(edu.startDate, !!errors.startDate)}`}
                      value={edu.startDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = (formData?.education ?? []).map((item) =>
                          item.id === edu.id ? { ...item, startDate: val } : item,
                        );
                        setFormData((prev) => ({ ...prev, education: updated }));
                      }}
                    />
                    {errors.startDate && <span className="text-xs text-red-500 mt-1">{errors.startDate}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Graduation Date <span className="text-red-500">*</span>
                    </label>
                    <MonthYearPicker
                      alignRight={true}
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(edu.graduationDate, !!errors.graduationDate)}`}
                      value={edu.graduationDate}
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
                    {errors.graduationDate && <span className="text-xs text-red-500 mt-1">{errors.graduationDate}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      GPA <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
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
                  className={`text-sm font-medium py-2 px-4 rounded-lg flex gap-2 items-center transition-all ${hasErrors ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-black text-white hover:bg-black/70'}`}
                  onClick={() => !hasErrors && setEditingId(null)}
                  disabled={hasErrors}
                >
                  <Check size={18} />
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      )})}
      <button className="flex items-center text-left" onClick={addEducation}>
        <Plus size={14} className="mr-1 inline" /> Add Education
      </button>
    </div>
  );
};

export default EducationForm;
