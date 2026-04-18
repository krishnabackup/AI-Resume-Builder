import React from "react";
import { formatExternalUrl, getVisibleExtraLinks } from "../../Templates/socialUtils";

const AcademicSidebarTemplate = ({ formData }) => {
  const visibleExtraLinks = getVisibleExtraLinks(formData?.extraLinks);

  return (
    <div
      className="bg-white border border-slate-300 w-full max-w-[900px] min-h-[1400px] flex resume-root overflow-hidden break-words"
      style={{ fontFamily: '"Garamond", "Times New Roman", serif' }}
    >
      {/* LEFT SIDEBAR */}
      <aside className="w-[32%] bg-slate-100 p-10 border-r border-slate-300">
        {formData.fullName && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {formData.fullName}
            </h1>
          </div>
        )}

        <div className="text-sm text-slate-700 space-y-1 mb-8">
          {formData.email && (
            <div>
              <a
                href={`mailto:${formData.email}`}
                className="text-slate-700 hover:text-blue-600 hover:underline"
              >
                {formData.email}
              </a>
            </div>
          )}
          {formData.phone && (
            <div>
              <a
                href={`tel:${formData.phone.replace(/\s+/g, "")}`}
                className="text-slate-700 hover:text-blue-600 hover:underline"
              >
                {formData.phone}
              </a>
            </div>
          )}
          {formData.location && <div>{formData.location}</div>}
          {formData.linkedin && <div>{formData.linkedin}</div>}
          {formData.website && <div>{formData.website}</div>}
        </div>

        {formData.skills?.technical?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Technical Skills
            </h2>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              {formData.skills.technical.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {formData.certifications?.some((cert) => cert.name) && (
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Certifications
            </h2>
            {formData.certifications
              .filter((cert) => cert.name)
              .map((cert, idx) => (
                <div key={idx} className="mb-3">
                  <div className="text-sm font-semibold text-slate-900">
                    {cert.name}
                  </div>
                  {cert.issuer && (
                    <div className="text-sm italic text-slate-700">
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div className="text-xs text-slate-600">{cert.date}</div>
                  )}
                </div>
              ))}
          </div>
        )}
      </aside>

      {/* RIGHT CONTENT */}
      <main className="w-[68%] p-12 space-y-10">
        {formData.summary && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Research Profile
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words">
              {formData.summary}
            </p>
          </section>
        )}

        {formData.education?.some((edu) => edu.school || edu.degree) && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Education
            </h2>
            {formData.education
              .filter((edu) => edu.school || edu.degree)
              .map((edu, idx) => (
                <div key={idx} className="mb-5">
                  <div className="flex justify-between">
                    <div className="font-bold text-slate-900 text-base">
                      {edu.degree}
                    </div>
                    {edu.graduationDate && (
                      <div className="text-sm text-slate-700">
                        {edu.graduationDate}
                      </div>
                    )}
                  </div>
                  <div className="text-sm italic text-slate-700">
                    {edu.school}
                  </div>
                  {edu.gpa && (
                    <div className="text-sm text-slate-600 mt-1">
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
          </section>
        )}

        {formData.experience?.some((exp) => exp.company || exp.title) && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Academic & Research Experience
            </h2>
            {formData.experience
              .filter((exp) => exp.company || exp.title)
              .map((exp, idx) => (
                <div key={idx} className="mb-6">
                  <div className="flex justify-between">
                    <div className="font-bold text-slate-900 text-base">
                      {exp.title}
                    </div>
                    <div className="text-sm text-slate-700">
                      {exp.startDate} – {exp.endDate}
                    </div>
                  </div>
                  <div className="text-sm italic text-slate-700 mb-2">
                    {exp.company}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
          </section>
        )}

        {formData.projects?.some((project) => project.name) && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Publications & Projects
            </h2>
            {formData.projects
              .filter((project) => project.name)
              .map((project, idx) => (
                <div key={idx} className="mb-5">
                  <div className="font-bold text-slate-900 text-base">
                    {project.name}
                  </div>
                  {project.description && (
                    <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">
                      {project.description}
                    </p>
                  )}
                  {project.link && (
                    <div className="text-sm text-blue-600 mt-1">
                      {project.link}
                    </div>
                  )}
                </div>
              ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default AcademicSidebarTemplate;
