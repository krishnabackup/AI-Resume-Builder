import { useEffect, useState } from "react";
import {
  Check,
  EditIcon,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { getCompletionStatus } from "../completion";
import axiosInstance from "../../../../api/axios";

const ProjectsForm = ({ formData, setFormData }) => {
  const [editingId, setEditingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  useEffect(() => {
    const { sectionValidationStatus } = getCompletionStatus(formData);
    if (sectionValidationStatus.hasValidProject) {
      setEditingId(null);
    } else {
      setEditingId(formData?.projects?.[0]?.id || null);
    }
  }, []);

  const addProject = () => {
    const id = crypto.randomUUID();
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...(prev?.projects ?? []),
        {
          id,
          name: "",
          description: "",
          technologies: "",
          link: { github: "" },
        },
      ],
    }));
    setEditingId(id);
  };

  const removeProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev?.projects ?? []).filter((p) => p.id !== id),
    }));
  };

  const updateProject = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const updateGithub = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, link: { ...(p.link || {}), github: value } } : p,
      ),
    }));
  };

  const generateProjectDetails = async (projectId) => {
    try {
      setGeneratingId(projectId);
      const project = formData.projects.find((p) => p.id === projectId);
      const data = {
        id: projectId,
        name: project?.name || "",
        technologies: project?.technologies || "",
        description: project?.description ?? "",
      };

      if (!data.name || !data.description) {
        alert(
          "Please fill in the Project Name and Description fields before enhancing with AI.",
        );
        setGeneratingId(null);
        return;
      }

      const response = await axiosInstance.post(
        "/api/resume/enhance-project-description",
        data,
      );

      updateProject(projectId, "description", response.data.projectDescription);
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert(
        `Failed to generate description: ${error.response?.data?.error || error.message
        }`,
      );
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {(formData?.projects ?? []).map((project, index) => (
        <div
          key={project.id}
          className="shadow-sm border border-gray-300 rounded-lg p-2"
        >
          {/* ===== COLLAPSED VIEW ===== */}
          {editingId !== project.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              <div className="w-full flex gap-4 justify-between items-center">
                <span className="font-medium">Project {index + 1}</span>
                <div className="flex gap-4 items-center">
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setEditingId(project.id)}
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    className="hover:text-red-600 transition-colors"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="w-full mt-2 text-left">
                <div className="text-md font-semibold break-all">
                  {project.name || "—"}
                </div>

                {project.technologies && (
                  <div className="text-sm text-slate-600">
                    {project.technologies}
                  </div>
                )}

                {project.description && (
                  <div className="text-xs text-slate-500 mt-1">
                    {project.description}
                  </div>
                )}

                {project?.link?.github && (
                  <a
                    href={project.link.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 mt-1 inline-block"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ===== EDIT MODE ===== */}
          {editingId === project.id && (
            <>
              <div className="px-3 py-4">
                <div className="flex flex-col gap-[6px] mb-[10px] mt-2">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={project.name || ""}
                    placeholder="E-commerce Platform"
                    onChange={(e) =>
                      updateProject(project.id, "name", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label>Technologies Used *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={project.technologies || ""}
                    placeholder="React, Node.js, MongoDB"
                    onChange={(e) =>
                      updateProject(project.id, "technologies", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <div className="w-full flex items-center justify-between">
                    <label>Description *</label>
                    <button
                      className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800"
                      onClick={() => generateProjectDetails(project.id)}
                    >
                      {generatingId === project.id ? (
                        <RefreshCw size={15} className="ml-1 animate-spin" />
                      ) : (
                        <Sparkles size={14} />
                      )}
                      Enhance with AI
                    </button>
                  </div>

                  <textarea
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white resize-y min-h-[120px] scrollbar-hide"
                    value={project.description || ""}
                    maxLength={500}
                    onChange={(e) =>
                      updateProject(project.id, "description", e.target.value)
                    }
                  />

                  <span className="ml-2 text-xs text-slate-500">
                    {project.description?.length || 0}/500 Characters
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label>GitHub Link *</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                    value={project?.link?.github || ""}
                    placeholder="github.com/username/project"
                    onChange={(e) => updateGithub(project.id, e.target.value)}
                  />
                </div>
              </div>

              {/* ===== ACTION BUTTONS ===== */}
              <div className="flex justify-end items-center gap-2 px-2 pb-4">
                <button
                  className="text-sm font-medium bg-red-500 py-2 px-4 rounded-lg text-white flex gap-2 items-center hover:bg-red-800"
                  onClick={() => removeProject(project.id)}
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

      <button className="flex items-center text-left" onClick={addProject}>
        <Plus size={14} className="mr-1 inline" /> Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
