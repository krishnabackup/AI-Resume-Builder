import { useState, useCallback, memo } from "react";
import MonthYearPicker from "../../MonthYearPicker";
import { Trash2, EditIcon, Check, GraduationCap, Plus } from "lucide-react";

// ── Memoized child component (prevents re-rendering all items) ──
const EducationItem = memo(({ edu, index, isEditing, onEdit, onDelete, onChange, onSave, highlightEmpty }) => {
  const borderClass = (val, req = false) => 
    (req && highlightEmpty && !val?.trim() ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10');

  // ── CARD MODE (Preview) ──
  if (!isEditing) return (
    <div className="rounded-lg p-3 flex flex-col justify-between items-center">
      <div className="w-full flex justify-between items-center">
        <span className="font-medium">Education {index + 1}</span>
        <div className="flex gap-4 items-center">
          <button type="button" className="hover:text-blue-600 transition-colors" onClick={onEdit} aria-label="Edit education"><EditIcon size={18} /></button>
          <button type="button" className="hover:text-red-600 transition-colors" onClick={onDelete} aria-label="Delete education"><Trash2 size={18} /></button>
        </div>
      </div>
      <div className="w-full mt-2 text-left">
        <div className="text-md font-semibold break-all">{edu.school || "—"}</div>
        {edu.degree && <div className="text-sm font-medium">{edu.degree}</div>}
        {edu.location && <div className="text-sm text-slate-600">{edu.location}</div>}
        <div className="w-full py-1 flex justify-between items-center">
          {edu.gpa && <span className="text-xs text-slate-500">GPA: {edu.gpa}</span>}
          {edu.graduationDate && <span className="text-xs text-slate-500">{edu.graduationDate}</span>}
        </div>
      </div>
    </div>
  );

  // ── EDIT MODE (Form) ──
  return (
    <>
      <div className="p-3 animate-in fade-in duration-300">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
          <GraduationCap className="text-blue-600" size={18} />
          <h4 className="font-semibold text-slate-800">Edit Education</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 pr-1 mb-2">
          {['school', 'degree'].map((f, i) => (
            <div key={i} className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                {f === 'school' ? 'School / University' : 'Degree'} <span className="text-red-500">*</span>
              </label>
              <input type="text" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(edu[f], true)}`} 
                placeholder={f === 'school' ? 'University Name' : 'Bachelor of Science'} 
                value={edu[f]} onChange={(e) => onChange(f, e.target.value)} />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <input type="text" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" 
              placeholder="City, Country" value={edu.location} onChange={(e) => onChange('location', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Graduation Date</label>
            <MonthYearPicker alignRight className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" 
              value={edu.graduationDate} onChange={(e) => onChange('graduationDate', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">GPA <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" 
              placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => onChange('gpa', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 px-2 pb-4">
        <button type="button" className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800" onClick={onDelete}><Trash2 size={18} /> Delete</button>
        <button type="button" className="text-sm font-medium bg-black py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-black/70" onClick={onSave}><Check size={18} /> Done</button>
      </div>
    </>
  );
});

// ── Main Component ──
const EducationForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);
  const educations = formData.education ?? [];

  const addEducation = useCallback(() => {
    const id = crypto.randomUUID?.() || `edu-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFormData(prev => ({ ...prev, education: [...educations, { id, school: '', degree: '', location: '', graduationDate: '', gpa: '' }] }));
    setEditingId(id);
  }, [educations, setFormData]);

  const removeEducation = useCallback((id) => {
    setFormData(prev => ({ ...prev, education: educations.filter(e => e.id !== id) }));
    if (editingId === id) setEditingId(null);
  }, [educations, editingId, setFormData]);

  const handleChange = useCallback((id, field, value) => {
    setFormData(prev => ({ ...prev, education: educations.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  }, [educations, setFormData]);

  return (
    <div className="flex flex-col gap-4">
      {educations.map((edu, index) => (
        <div key={edu.id} className="shadow-sm border border-gray-300 rounded-md p-2">
          <EducationItem edu={edu} index={index} isEditing={editingId === edu.id} 
            onEdit={() => setEditingId(edu.id)} onDelete={() => removeEducation(edu.id)} 
            onChange={(f, v) => handleChange(edu.id, f, v)} onSave={() => setEditingId(null)} 
            highlightEmpty={highlightEmpty} />
        </div>
      ))}
      <button type="button" onClick={addEducation} className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
        <Plus size={14} /> Add Education
      </button>
    </div>
  );
};

export default EducationForm;