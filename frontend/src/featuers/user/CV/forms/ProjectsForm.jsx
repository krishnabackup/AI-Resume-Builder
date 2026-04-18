import { useEffect, useState, useCallback, memo } from "react";
import { Check, EditIcon, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { getCompletionStatus } from "../completion";
import axiosInstance from "../../../../api/axios";

// ── Helper: Get GitHub link (handles string or object) ──
const getGithubLink = (link) => typeof link === 'string' ? link : link?.github || "";

// ── Memoized child component ──
const ProjectItem = memo(({ 
  project, index, isEditing, onEdit, onDelete, onUpdate, onUpdateGithub, onAIEnhance, onSave, generatingId, highlightEmpty 
}) => { // ✅ FIX: Added `onSave` to destructured props
  const borderClass = (val) => (highlightEmpty && !val?.trim() ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10');
  const githubLink = getGithubLink(project.link);

  if (!isEditing) return (
    <div className="rounded-lg p-3 flex flex-col justify-between items-center">
      <div className="w-full flex gap-4 justify-between items-center">
        <span className="font-medium">Project {index + 1}</span>
        <div className="flex gap-4 items-center">
          <button type="button" className="hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); onEdit(); }} aria-label="Edit project"><EditIcon size={18} /></button>
          <button type="button" className="hover:text-red-600 transition-colors" onClick={(e) => { e.preventDefault(); onDelete(); }} aria-label="Delete project"><Trash2 size={18} /></button>
        </div>
      </div>
      <div className="w-full mt-2 text-left">
        <div className="text-md font-semibold break-all">{project.name || "—"}</div>
        {project.technologies && <div className="text-sm text-slate-600">{project.technologies}</div>}
        {project.description && <div className="text-xs text-slate-500 mt-1">{project.description}</div>}
        {githubLink && <a href={githubLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 mt-1 inline-block hover:underline">GitHub</a>}
      </div>
    </div>
  );

  return (
    <>
      <div className="px-3 py-4">
        <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
          <label className="text-sm font-semibold text-slate-700">Project Name *</label>
          <input type="text" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(project.name)}`} value={project.name || ""} placeholder="E-commerce Platform" onChange={(e) => onUpdate("name", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-semibold text-slate-700">Technologies Used *</label>
          <input type="text" className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${borderClass(project.technologies)}`} value={project.technologies || ""} placeholder="React, Node.js, MongoDB" onChange={(e) => onUpdate("technologies", e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="w-full flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Description *</label>
            <button type="button" className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 disabled:opacity-50" onClick={(e) => { e.preventDefault(); onAIEnhance(); }} disabled={generatingId === project.id}>
              {generatingId === project.id ? <RefreshCw size={15} className="ml-1 animate-spin" /> : <Sparkles size={14} />} Enhance with AI
            </button>
          </div>
          <textarea className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white resize-y min-h-[120px] scrollbar-hide ${borderClass(project.description)}`} value={project.description || ""} maxLength={1000} onChange={(e) => onUpdate("description", e.target.value)} />
          <span className="ml-2 text-xs text-slate-500">{project.description?.length || 0}/1000 Characters</span>
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-semibold text-slate-700">GitHub Link *</label>
          <input type="text" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white" value={githubLink} placeholder="github.com/username/project" onChange={(e) => onUpdateGithub(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 px-2 pb-4">
        <button type="button" className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800" onClick={(e) => { e.preventDefault(); onDelete(); }}><Trash2 size={18} /> Delete</button>
        <button type="button" className="text-sm font-medium bg-black py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-black/70" onClick={(e) => { e.preventDefault(); onSave(); }}><Check size={18} /> Done</button> {/* ✅ Uses onSave now */}
      </div>
    </>
  );
});

// ── Main Component ──
const ProjectsForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const projects = formData?.projects ?? [];

  useEffect(() => {
    if (editingId === null) {
      const { sectionValidationStatus } = getCompletionStatus(formData);
      if (!sectionValidationStatus.hasValidProject && projects.length > 0) {
        setEditingId(projects[0].id);
      }
    }
  }, [projects.length]);

  // ✅ FIX: Use functional updates with `prev` to avoid stale closures
  const addProject = useCallback(() => {
    const id = crypto.randomUUID?.() || `proj-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setFormData(prev => {
      const prevProjects = prev?.projects ?? [];
      return { ...prev, projects: [...prevProjects, { id, name: '', description: '', technologies: '', link: { github: '' } }] };
    });
    setEditingId(id);
  }, [setFormData]);

  const removeProject = useCallback((id) => {
    setFormData(prev => {
      const prevProjects = prev?.projects ?? [];
      const filtered = prevProjects.filter(p => p.id !== id);
      return { ...prev, projects: filtered };
    });
    if (editingId === id) setEditingId(null);
  }, [editingId, setFormData]);

  const updateProject = useCallback((id, field, value) => {
    setFormData(prev => {
      const prevProjects = prev?.projects ?? [];
      return { 
        ...prev, 
        projects: prevProjects.map(p => p.id === id ? { ...p, [field]: value } : p) 
      };
    });
  }, [setFormData]);

  const updateGithub = useCallback((id, value) => {
    setFormData(prev => {
      const prevProjects = prev?.projects ?? [];
      return {
        ...prev,
        projects: prevProjects.map(p => {
          if (p.id !== id) return p;
          const currentLink = typeof p.link === 'string' ? { github: p.link } : (p.link || {});
          return { ...p, link: { ...currentLink, github: value } };
        })
      };
    });
  }, [setFormData]);

  const generateProjectDetails = useCallback(async (projectId) => {
    try {
      setGeneratingId(projectId);
      const project = projects.find((p) => p.id === projectId);
      const data = { id: projectId, name: project?.name || "", technologies: project?.technologies || "", description: project?.description ?? "" };
      if (!data.name || !data.description) { alert("Please fill in the Project Name and Description fields before enhancing with AI."); return; }
      const response = await axiosInstance.post("/api/resume/enhance-project-description", data);
      updateProject(projectId, "description", response.data.projectDescription);
    } catch (error) { console.error("Failed to generate description:", error); alert(`Failed to generate description: ${error.response?.data?.error || error.message}`); }
    finally { setGeneratingId(null); }
  }, [projects, updateProject]);

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project, index) => (
        <div key={project.id} className="shadow-sm border border-gray-300 rounded-lg p-2">
          <ProjectItem 
            project={project} index={index} isEditing={editingId === project.id} 
            onEdit={() => setEditingId(project.id)} 
            onDelete={() => removeProject(project.id)} 
            onUpdate={(f, v) => updateProject(project.id, f, v)} 
            onUpdateGithub={(v) => updateGithub(project.id, v)} 
            onAIEnhance={() => generateProjectDetails(project.id)} 
            onSave={() => setEditingId(null)}  // ✅ Passed correctly now
            generatingId={generatingId} highlightEmpty={highlightEmpty} 
          />
        </div>
      ))}
      <button type="button" onClick={(e) => { e.preventDefault(); addProject(); }} className="flex items-center text-left text-blue-600 hover:text-blue-700 transition-colors"><Plus size={14} className="mr-1 inline" /> Add Project</button>
    </div>
  );
};

export default ProjectsForm;