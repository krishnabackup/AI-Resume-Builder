import React from "react";
import { formatExternalUrl, getVisibleExtraLinks } from "../../Templates/socialUtils";

const ModernTemplate = ({ formData }) => {
  const {
    fullName,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = formData;

  const visibleExtraLinks = getVisibleExtraLinks(formData?.extraLinks);

  return (
    <div className="w-full text-[11px] leading-relaxed text-gray-800 bg-white">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 mb-6">
        <h1 className="text-[38px] font-bold mb-2">
          {fullName || "Jessica Claire"}
        </h1>

        <div className="grid grid-cols-2 gap-2 text-[10px] mt-3">
          {email && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Email:</span>
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Phone:</span>
              <span>{phone}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Location:</span>
              <span>{location}</span>
            </div>
          )}
          {linkedin && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">LinkedIn:</span>
              <a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                {linkedin}
              </a>
            </div>
          )}
          {github && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">GitHub:</span>
              <a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                {github}
              </a>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Website:</span>
              <a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                {website}
              </a>
            </div>
          )}
          {/* Extra Links */}
          {visibleExtraLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-semibold">{link.label}:</span>
              <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">
                {link.url}
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6">
        {/* ================= SUMMARY ================= */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-emerald-700 mb-3 pb-2 border-b-2 border-emerald-200">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-justify bg-emerald-50 p-4 rounded">{summary}</p>
          </section>
        )}

        {/* ================= SKILLS ================= */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-emerald-700 mb-3 pb-2 border-b-2 border-emerald-200">
              CORE COMPETENCIES
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {skills.technical?.length > 0 && (
                <div>
                  <p className="font-semibold text-emerald-600 mb-2">
                    Technical Skills
                  </p>
                  <div className="space-y-1">
                    {skills.technical.map((skill, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        <span className="text-[10px]">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft?.length > 0 && (
                <div>
                  <p className="font-semibold text-emerald-600 mb-2">
                    Soft Skills
                  </p>
                  <div className="space-y-1">
                    {skills.soft.map((skill, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                        <span className="text-[10px]">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= EXPERIENCE (TIMELINE) ================= */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">
              PROFESSIONAL EXPERIENCE
            </h2>

            <div className="relative pl-8">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-emerald-300"></div>

              {experience.map((job, idx) => (
                <div key={job.id} className="mb-6 relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-[-32px] top-1 w-6 h-6 bg-emerald-600 rounded-full border-4 border-white"></div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">
                          {job.title || "Senior Software Engineer"}
                        </p>
                        <p className="text-emerald-600 font-semibold">
                          {job.company || "Tech Innovations Inc."}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-600">
                          {job.location}
                        </p>
                        <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                          {job.startDate} – {job.endDate || "Present"}
                        </p>
                      </div>
                    </div>

                    {job.description && (
                      <ul className="list-none space-y-1 mt-3">
                        {job.description.split("\n").map((line, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-500 mr-2 font-bold">
                              ›
                            </span>
                            <span className="flex-1 text-gray-700">{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= EDUCATION (TIMELINE) ================= */}
        {education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-emerald-700 mb-4 pb-2 border-b-2 border-emerald-200">
              EDUCATION
            </h2>

            <div className="relative pl-8">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-emerald-300"></div>

              {education.map((edu) => (
                <div key={edu.id} className="mb-4 relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-[-32px] top-1 w-6 h-6 bg-teal-600 rounded-full border-4 border-white"></div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold text-gray-900">
                          {edu.school || "University Name"}
                        </p>
                        <p className="text-emerald-600 font-semibold">
                          {edu.degree}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-600">
                          {edu.location}
                        </p>
                        <p className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded">
                          {edu.graduationDate}
                        </p>
                      </div>
                    </div>
                    {edu.gpa && (
                      <p className="text-[10px] text-gray-600 mt-2">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= PROJECTS ================= */}
        {projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-emerald-700 mb-3 pb-2 border-b-2 border-emerald-200">
              KEY PROJECTS
            </h2>

            {projects.map((project) => (
              <div key={project.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-gray-900">
                  {project.name}
                  {project.link && (
                    <span className="font-normal text-emerald-600 ml-1 text-[10px]">
                      ({project.link})
                    </span>
                  )}
                </p>
                {project.technologies && (
                  <p className="text-[10px] text-gray-600 mb-1 mt-1">
                    <span className="font-semibold">Technologies:</span>{" "}
                    {project.technologies}
                  </p>
                )}
                {project.description && (
                  <p className="text-gray-700 mt-2">{project.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {certifications?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-emerald-700 mb-3 pb-2 border-b-2 border-emerald-200">
              CERTIFICATIONS
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900">{cert.name}</p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
