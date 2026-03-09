import { useState, useEffect } from "react";
import {
  Check,
  EditIcon,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getCompletionStatus } from "./../completion";
import axiosInstance from "../../../../api/axios";

const ExperienceForm = ({ formData, setFormData }) => {
  const [editingId, setEditingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  // initial load effect
  useEffect(() => {
    const { sectionValidationStatus } = getCompletionStatus(formData);
    if (sectionValidationStatus.hasValidExperience) {
      setEditingId(null);
    } else {
      setEditingId(formData?.experience?.[0]?.id || null);
    }
  }, []);

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
          location: "",
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
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    }));
    console.log("ddd");
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
    return `${months[Number(month) - 1]}${year}`;
  }

  const handleAIEnhance = async (id) => {
    try {
      setGeneratingId(id);
      // Convert experience and projects objects to strings
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
      console.log("Data sent:", data);

      const response = await axiosInstance.post(
        "/api/resume/enhance-work-experience",
        data,
      );
      console.log("Response received:", response);
      console.log("Description generated:", response.data.aiResume);
      console.log("Updating experience with ID:", id);
      console.log("Updating experience with data:", formData.experience);
      updateExperience(id, "description", response.data.aiResume);
    } catch (error) {
      console.error("Failed to generate description:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert(
        `Failed to generate description: ${error.response?.data?.error || error.message}`,
      );
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {(formData?.experience ?? []).map((exp, index) => (
          <div
            key={exp.id}
            className="shadow-sm border border-gray-300 rounded-lg p-2"
          >
            {editingId !== exp.id && (
              <div className="rounded-lg p-3 flex flex-col justify-between items-center">
                {/* Option Header */}
                <div className="w-full flex gap-4 justify-between items-center">
                  <div className=" text-md">
                    <span className="font-medium">Experience {index + 1}</span>
                  </div>
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
                {/* Card Content */}
                <div className="w-full mt-2 text-left">
                  <div className="flex justify-start items-center break-all md:flex-row flex-col md:gap-4">
                    <div className="flex gap-4 justify-start items-center text-left md:w-[68%] w-full">
                      <span className="text-left text-md font-semibold">
                        {exp.company}
                      </span>
                    </div>
                    <div className="text-right md:w-[32%] w-full">
                      {exp?.startDate && exp?.endDate && (
                        <span className="text-xs text-slate-500">
                          {formatMonthYear(exp?.startDate)} -{" "}
                          {!/[a-zA-Z]/.test(exp?.endDate)
                            ? formatMonthYear(exp?.endDate)
                            : exp?.endDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium">{exp.title}</span>
                  <div className="w-full py-1 flex gap-2 justify-between items-center">
                    <div className="">
                      {exp?.description && (
                        <div className="text-sm text-slate-500 text-justify break-words">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {editingId === exp.id && (
              <div className="p-2">
                <div className="pr-0.5">
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      value={exp.title || ""}
                      placeholder="Software Engineer"
                      onChange={(e) =>
                        updateExperience(exp.id, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>Company *</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      value={exp.company || ""}
                      placeholder="Tech Company Inc."
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>Start Date *</label>
                    <input
                      type="month"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      value={exp.startDate || ""}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                    <label>End Date *</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      value={exp.endDate || ""}
                      placeholder="Present or YYYY-MM"
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] mb-[10px] mt-2 full-width">
                  <div className="w-full flex items-center justify-between">
                    <label>Description *</label>
                    <button
                      className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800"
                      onClick={() => handleAIEnhance(exp.id)}
                    >
                      {generatingId === exp.id ? (
                        <RefreshCw size={15} className={`ml-1 animate-spin`} />
                      ) : (
                        <Sparkles size={14} />
                      )}
                      Enhance with AI
                    </button>
                  </div>
                  <textarea
                    placeholder="Describe your responsibilities and achievements..."
                    className="h-40 px-2.5 py-2 border text-sm resize-none rounded border-1.5 focus:border-[#007bff] focus:outline-none focus:bg-white focus:shadow-[0_2px_8px_rgba(0,123,255,0.07)]"
                    value={exp.description || ""}
                    maxLength={500}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                  />
                  <span className="ml-2 text-xs text-slate-500">
                    {exp.description?.length || 0}/500 Characters
                  </span>
                </div>
                {/* Done Button */}
                <div className="flex justify-end items-center gap-2 px-2 py-4">
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
              </div>
            )}
          </div>
        ))}
        <button className="flex items-center text-left" onClick={addExperience}>
          <Plus size={14} className="mr-1 inline" /> Add Experience
        </button>
      </div>
    </>
  );
};

export default ExperienceForm;
