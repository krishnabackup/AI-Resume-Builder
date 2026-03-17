import { useState } from "react";
import MonthYearPicker from "../../MonthYearPicker";
import {
  Briefcase,
  Trash2,
  EditIcon,
  Plus,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import axiosInstance from "./../../../../api/axios";

const ExperienceForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  // Helper to get border class for required fields
  const getBorderClass = (value) => {
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  };
  const addExperience = () => {
    const id = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...(prev?.experience ?? []),
        {
          id,
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
    setEditingId(id);
  };

  const removeExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: (prev?.experience ?? []).filter((e) => e.id !== id),
    }));
  };

  const updateExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: (prev?.experience ?? []).map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));
  };

  const formatMonthYear = (value) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[Number(month) - 1]} ${year}`;
  };

  const handleAIEnhance = async (id) => {
    try {
      setGeneratingId(id);
      const experienceStr = formData.experience.find((e) => e.id === id);
      const data = {
        id,
        title: experienceStr?.title || "",
        company: experienceStr?.company || "",
        startDate: experienceStr?.startDate || "",
        endDate: experienceStr?.endDate || "",
        description: experienceStr?.description ?? "",
      };

      if (!data.title || !data.company || !data.startDate || !data.endDate) {
        alert(
          "Please fill in the Job Title, Company, Start Date, and End Date fields before enhancing with AI.",
        );
        setGeneratingId(null);
        return;
      }

      const response = await axiosInstance.post(
        "/api/resume/enhance-work-experience",
        data,
      );
      updateExperience(id, "description", response.data.aiResume);
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert(
        `Failed to generate description: ${error.response?.data?.error || error.message}`,
      );
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData?.experience ?? []).map((exp, index) => (
        <div
          key={exp.id}
          className="shadow-sm border border-gray-300 rounded-md p-2"
        >
          {/* Card UI */}
          {editingId !== exp.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              <div className="w-full flex justify-between items-center">
                <span className="font-medium">Experience {index + 1}</span>
                <div className="flex gap-4 items-center">
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setEditingId(exp.id)}
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    className="hover:text-red-600 transition-colors"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="w-full mt-2 text-left">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <div className="text-md font-semibold break-all">
                    {exp.company || "—"}
                  </div>
                  {exp.startDate && exp.endDate && (
                    <span className="text-xs text-slate-500">
                      {formatMonthYear(exp.startDate)} –{" "}
                      {formatMonthYear(exp.endDate)}
                    </span>
                  )}
                </div>
                {exp.title && (
                  <div className="text-sm font-medium mt-1">{exp.title}</div>
                )}
                {exp.location && (
                  <div className="text-sm text-slate-600">{exp.location}</div>
                )}
                {exp.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {editingId === exp.id && (
            <>
              <div className="p-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <Briefcase className="text-blue-600" size={18} />
                  <h4 className="font-semibold text-slate-800">Edit Experience</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 pr-1 mb-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(exp.title)}`}
                      placeholder="Software Engineer"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(exp.id, "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(exp.company)}`}
                      placeholder="Tech Company Inc."
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      placeholder="City, Country"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(exp.id, "location", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <MonthYearPicker
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(exp.startDate)}`}
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-sm text-slate-600">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                          checked={exp.endDate === "Present"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateExperience(exp.id, "endDate", "Present");
                            } else {
                              updateExperience(exp.id, "endDate", "");
                            }
                          }}
                        />
                        Present
                      </label>
                    </div>
                    <MonthYearPicker
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all ${exp.endDate === "Present" ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white"} ${getBorderClass(exp.endDate)}`}
                      value={exp.endDate === "Present" ? "" : exp.endDate}
                      disabled={exp.endDate === "Present"}
                      alignRight={true}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <div className="w-full flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <button
                        className="flex gap-2 items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        onClick={() => handleAIEnhance(exp.id)}
                      >
                        {generatingId === exp.id ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        Enhance with AI
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Describe your responsibilities and achievements..."
                      className={`w-full px-4 py-3 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white resize-y min-h-[100px] leading-relaxed ${getBorderClass(exp.description)}`}
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Done Button */}
              <div className="flex justify-end items-center gap-2 px-2 pb-4">
                <button
                  className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800"
                  onClick={() => removeExperience(exp.id)}
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
        onClick={addExperience}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Plus size={14} />
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;
