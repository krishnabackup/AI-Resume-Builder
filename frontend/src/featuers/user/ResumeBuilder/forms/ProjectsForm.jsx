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

const ProjectsForm = ({ formData, setFormData, highlightEmpty }) => {
  const [editingId, setEditingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  // Helper to get border class for required fields
  const getBorderClass = (value) => {
    if (highlightEmpty && !value?.trim()) return 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    return 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';
  };
  // Removed intrusive useEffect that switched components mid-typing based on validation status.
  // The user should manually click "Done" to collapse the form.

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
          link: {},
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
    const updated = (formData?.projects ?? []).map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    setFormData((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  const generateProjectDetails = async (projectId) => {
    try {
      setGeneratingId(projectId);
      // Convert experience and projects objects to strings
      const projectStr = formData.projects.find((e) => e.id === projectId);
      const data = {
        id: projectId,
        name: projectStr?.name || "",
        technologies: projectStr?.technologies || "",
        description: projectStr?.description ?? "",
      };

      if (!data.name || !data.description) {
        alert(
          "Please fill in the Project Name and Description fields before enhancing with AI.",
        );
        setGeneratingId(null);
        return;
      }
      console.log("Data sent:", data);

      const response = await axiosInstance.post(
        "/api/resume/enhance-project-description",
        data,
      );
      console.log("Response received:", response);
      console.log("Description generated:", response.data.projectDescription);
      console.log("Updating project with ID:", projectId);
      console.log("Updating project with data:", formData.projects);
      updateProject(projectId, "description", response.data.projectDescription);
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
    <div className="flex flex-col gap-4">
      {(formData?.projects ?? []).map((project, index) => (
        <div
          key={project.id}
          className="shadow-sm border border-gray-300 rounded-lg p-2"
        >
          {/* ===== COLLAPSED CARD ===== */}
          {editingId !== project.id && (
            <div className="rounded-lg p-3 flex flex-col justify-between items-center">
              {/* Header */}
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

              {/* Content */}
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
              <div className="p-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <Sparkles className="text-blue-600" size={18} />
                  <h4 className="font-semibold text-slate-800">Edit Project</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 pr-1 mb-2">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(project.name)}`}
                      value={project.name || ""}
                      placeholder="E-commerce Platform"
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Technologies Used <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3.5 py-2.5 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white ${getBorderClass(project.technologies)}`}
                      value={project.technologies || ""}
                      placeholder="React, Node.js, MongoDB"
                      onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <div className="w-full flex items-center justify-between mb-1">
                      <label className="text-sm font-semibold text-slate-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <button
                        className="flex gap-2 ml-2 p-2 rounded-lg text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800"
                        onClick={() => generateProjectDetails(project.id)}
                      >
                        {generatingId === project.id ? (
                          <RefreshCw size={15} className={`ml-1 animate-spin`} />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        Enhance with AI
                      </button>
                    </div>
                    <textarea
                      className={`w-full px-4 py-3 border rounded-lg text-sm text-slate-900 focus:outline-none transition-all bg-white resize-y min-h-[140px] leading-relaxed ${getBorderClass(project.description)}`}
                      value={project.description || ""}
                      maxLength={500}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      placeholder="Describe your project's features and your contributions..."
                    />
                    <span className="ml-1 mt-1 text-xs text-slate-400 font-medium self-end">
                      {project.description?.length || 0} / 500 Characters
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
                    <label className="text-sm font-semibold text-slate-700">
                      GitHub Link <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all bg-white"
                      value={project?.link?.github || ""}
                      placeholder="https://github.com/yourusername/project"
                      onChange={(e) => {
                        const updated = (formData?.projects ?? []).map((item) =>
                          item.id === project.id
                            ? {
                                ...item,
                                link: {
                                  ...item.link,
                                  github: e.target.value,
                                },
                              }
                            : item,
                        );
                        setFormData((prev) => ({
                          ...prev,
                          projects: updated,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
