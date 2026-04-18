import { Plus, X } from "lucide-react";
import { useState, useCallback } from "react";

// ── Helper: Safe skills update (avoids repetition) ──
const updateSkills = (prev, type, updater) => {
  const skills = prev?.skills ?? { technical: [], soft: [] };
  return {
    ...prev,
    skills: {
      ...skills,
      [type]: updater(skills[type] ?? []),
    },
  };
};

const SkillsForm = ({ formData, setFormData }) => {
  const [newSkill, setNewSkill] = useState("");
  const [skillType, setSkillType] = useState("technical");

  // ✅ Memoized handlers (prevents re-creation)
  const addSkill = useCallback(() => {
    if (!newSkill.trim()) return;
    setFormData(prev => updateSkills(prev, skillType, 
      list => [...list, newSkill.trim()]
    ));
    setNewSkill("");
  }, [newSkill, skillType, setFormData]);

  const removeSkill = useCallback((type, skillValue) => { // ✅ Use value instead of index
    setFormData(prev => updateSkills(prev, type, 
      list => list.filter(s => s !== skillValue)
    ));
  }, [setFormData]);

  const addSuggestedSkill = useCallback((skill) => {
    setFormData(prev => {
      const current = prev?.skills?.[skillType] ?? [];
      if (current.includes(skill)) return prev; // Avoid duplicates
      return updateSkills(prev, skillType, list => [...list, skill]);
    });
  }, [skillType, setFormData]);

  const suggestedSkills = skillType === "technical"
    ? ["JavaScript", "React",  "Node.js", "Python", "SQL", "AWS"]
    : ["Leadership", "Communication", "Problem Solving", "Teamwork"];

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle Buttons */}
      <div className="flex gap-2 p-3 rounded-xl bg-slate-900 w-fit mx-auto" role="tablist">
        <button
          type="button" // ✅ Prevent form submission
          role="tab"
          aria-selected={skillType === "technical"}
          onClick={() => setSkillType("technical")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${skillType === "technical" ? "bg-white text-slate-900 shadow-md scale-105" : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"}`}
        >
          Technical Skills
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={skillType === "soft"}
          onClick={() => setSkillType("soft")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${skillType === "soft" ? "bg-white text-slate-900 shadow-md scale-105" : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"}`}
        >
          Soft Skills
        </button>
      </div>

      {/* Add Skill Input */}
      <div className="flex gap-2 px-2">
        <label htmlFor="skill-input" className="sr-only">Add skill</label>
        <input
          id="skill-input" // ✅ Accessibility
          type="text"
          value={newSkill}
          placeholder={`Add a ${skillType} skill...`}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          className="border w-full p-2 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={addSkill}
          aria-label="Add skill"
          className="bg-black text-white px-4 rounded-lg hover:bg-black/80 transition"
        >
          Add
        </button>
      </div>

      {/* Skills List - ✅ Fixed: use skill value as key */}
      <div className="flex flex-wrap gap-2 px-2">
        {(formData?.skills?.[skillType] ?? []).map((skill) => (
          <span
            key={`${skillType}-${skill}`} // ✅ Stable key
            className="inline-flex items-center gap-2 bg-blue-200 text-blue-700 text-sm px-3 py-1 rounded-xl"
          >
            {skill}
            <button 
              type="button"
              onClick={() => removeSkill(skillType, skill)} // ✅ Pass skill value
              aria-label={`Remove ${skill}`}
            >
              <X size={14} className="hover:text-red-500 transition" />
            </button>
          </span>
        ))}
      </div>

      {/* Suggested Skills */}
      <div className="px-2">
        <p className="text-sm font-medium text-slate-600 mb-2">Suggested skills:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedSkills.map((skill) => (
            <button
              key={skill} // ✅ Use skill name as key (unique)
              type="button"
              onClick={() => addSuggestedSkill(skill)}
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 text-sm rounded-lg hover:bg-black/80 transition"
            >
              <Plus size={14} />
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;