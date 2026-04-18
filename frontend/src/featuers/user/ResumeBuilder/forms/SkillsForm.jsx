import { Plus, X } from "lucide-react";
import { useState } from "react";

const SkillsForm = ({ formData, setFormData }) => {
  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState("technical");

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...(prev?.skills ?? { technical: [], soft: [] }),
          [skillType]: [...(prev?.skills?.[skillType] ?? []), newSkill.trim()],
        },
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...(prev?.skills ?? { technical: [], soft: [] }),
        [type]: (prev?.skills?.[type] ?? []).filter((_, i) => i !== index),
      },
    }));
  };

  const addSuggestedSkill = (skill) => {
    if (!(formData?.skills?.[skillType] ?? []).includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...(prev?.skills ?? { technical: [], soft: [] }),
          [skillType]: [...(prev?.skills?.[skillType] ?? []), skill],
        },
      }));
    }
  };

  const suggestedSkills =
    skillType === "technical"
      ? ["JavaScript", "React.js", "Node.js", "Python", "SQL", "AWS"]
      : ["Leadership", "Communication", "Teamwork", "Problem Solving"];

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-2 p-3 rounded-xl bg-slate-900 w-fit my-2 mx-auto">
        <button
          onClick={() => setSkillType("technical")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
      ${skillType === "technical"
              ? "bg-white text-slate-900 shadow-md scale-105"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
        >
          Technical Skills
        </button>

        <button
          onClick={() => setSkillType("soft")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
      ${skillType === "soft"
              ? "bg-white text-slate-900 shadow-md scale-105"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
        >
          Soft Skills
        </button>
      </div>

      <div className="flex gap-2 w-full mt-2 mb-4">
        <input
          type="text"
          className="flex-grow px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
          value={newSkill}
          placeholder={`Add a ${skillType} skill... (e.g., JavaScript, Leadership)`}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newSkill.trim()) {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <button
          className="bg-black text-white py-2.5 px-5 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors whitespace-nowrap"
          onClick={addSkill}
        >
          Add Skill
        </button>
      </div>

      <div className="w-full flex flex-wrap gap-2 mb-6 min-h-[40px]">
        {(formData?.skills?.[skillType] ?? []).map((skill, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-sm font-medium text-blue-700 border border-blue-200 rounded-md px-2.5 py-1.5"
          >
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(skillType, idx)}
              className="hover:text-red-500 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {(formData?.skills?.[skillType] ?? []).length === 0 && (
          <div className="text-sm text-slate-400 italic flex items-center h-full">
            No {skillType} skills added yet.
          </div>
        )}
      </div>

      <div className="w-full">
        <p className="text-sm font-medium text-slate-700 mb-3">
          Suggested {skillType} skills:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill, idx) => {
            const isAdded = (formData?.skills?.[skillType] ?? []).includes(skill);
            return (
              <button
                key={idx}
                disabled={isAdded}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-all ${isAdded
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                onClick={() => addSuggestedSkill(skill)}
              >
                {!isAdded && <Plus size={14} className="text-slate-400" />}
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
