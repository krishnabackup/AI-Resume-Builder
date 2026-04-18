import { useState, useCallback, memo } from "react";
import MonthYearPicker from "../../MonthYearPicker";
import { Trash2, EditIcon, Check, Plus } from "lucide-react";

const CertificationItem = memo(({ cert, index, isEditing, onEdit, onDelete, onChange, onSave, highlightEmpty }) => {
  const borderClass = (val, req = false) => (req && highlightEmpty && !val?.trim() ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10');

  if (!isEditing) return (
    <div className="rounded-lg p-3 flex flex-col justify-between items-center">
      <div className="w-full flex justify-between items-center">
        <span className="font-medium">Certification {index + 1}</span>
        <div className="flex gap-4 items-center">
          <button type="button" className="hover:text-blue-600 transition-colors" onClick={onEdit} aria-label="Edit"><EditIcon size={18} /></button>
          <button type="button" className="hover:text-red-600 transition-colors" onClick={onDelete} aria-label="Delete"><Trash2 size={18} /></button>
        </div>
      </div>
      <div className="w-full mt-2 text-left">
        <div className="text-md font-semibold break-all">{cert.name || "—"}</div>
        {cert.issuer && <div className="text-sm font-medium">{cert.issuer}</div>}
        <div className="w-full py-1 flex justify-between items-center">
          {cert.date && <span className="text-xs text-slate-500">{cert.date}</span>}
          {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View Credential</a>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="px-3 py-4 space-y-3">
        {['name', 'issuer'].map((f, i) => (
          <div key={i} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">{f === 'name' ? 'Certification Name *' : 'Issuing Organization *'}</label>
            <input type="text" className={`px-2.5 py-2 border text-sm rounded focus:outline-none focus:shadow-sm ${borderClass(cert[f], true)}`} placeholder={f === 'name' ? 'AWS Solutions Architect' : 'Amazon Web Services'} value={cert[f]} onChange={(e) => onChange(f, e.target.value)} />
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Date Obtained</label>
          <MonthYearPicker alignRight className={`px-2.5 py-2 border text-sm rounded focus:outline-none focus:shadow-sm ${borderClass(cert.date)}`} value={cert.date} onChange={(e) => onChange('date', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Credential Link (Optional)</label>
          <input type="url" className={`px-2.5 py-2 border text-sm rounded focus:outline-none focus:shadow-sm ${borderClass(cert.link)}`} placeholder="https://credential.url" value={cert.link} onChange={(e) => onChange('link', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2 px-2 pb-4">
        <button type="button" className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-700" onClick={onDelete}><Trash2 size={18} /> Delete</button>
        <button type="button" className="text-sm font-medium bg-black py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-black/70" onClick={onSave}><Check size={18} /> Done</button>
      </div>
    </>
  );
});

const CertificationsForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);
  const certs = formData.certifications ?? [];

  const addCertification = useCallback(() => {
    const id = crypto.randomUUID?.() || `cert-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFormData(prev => ({ ...prev, certifications: [...certs, { id, name: '', issuer: '', date: '', link: '' }] }));
    setEditingId(id);
  }, [certs, setFormData]);

  const removeCertification = useCallback((id) => {
    setFormData(prev => ({ ...prev, certifications: certs.filter(c => c.id !== id) }));
    if (editingId === id) setEditingId(null);
  }, [certs, editingId, setFormData]);

  const handleChange = useCallback((id, field, value) => {
    setFormData(prev => ({ ...prev, certifications: certs.map(c => c.id === id ? { ...c, [field]: value } : c) }));
  }, [certs, setFormData]);

  return (
    <div className="flex flex-col gap-4">
      {certs.map((cert, index) => (
        <div key={cert.id} className="shadow-sm border border-gray-300 rounded-lg p-2">
          <CertificationItem cert={cert} index={index} isEditing={editingId === cert.id} onEdit={() => setEditingId(cert.id)} onDelete={() => removeCertification(cert.id)} onChange={(f, v) => handleChange(cert.id, f, v)} onSave={() => setEditingId(null)} highlightEmpty={highlightEmpty} />
        </div>
      ))}
      <button type="button" onClick={addCertification} className="flex items-center gap-2 text-left text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"><Plus size={14} /> Add Certification</button>
    </div>
  );
};

export default CertificationsForm;