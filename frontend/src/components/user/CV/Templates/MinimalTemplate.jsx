import React from "react";
import { formatExternalUrl, getVisibleExtraLinks } from "../../Templates/socialUtils";

const MinimalTemplate = ({ formData }) => {
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
    <div className="w-full text-[11px] leading-relaxed bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ================= HEADER ================= */}
      <div className="bg-white shadow-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[32px] font-bold">
            {(fullName || "Jessica Claire").charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-[36px] font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {fullName || "Jessica Claire"}
            </h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-600">
              {email && (
                <span className="flex items-center gap-1">✉ {email}</span>
              )}
              {phone && (
                <span className="flex items-center gap-1">📱 {phone}</span>
              )}
              {location && (
                <span className="flex items-center gap-1">📍 {location}</span>
              )}
              {linkedin && (
                <span className="flex items-center gap-1">💼 <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{linkedin}</a></span>
              )}
              {github && (
                <span className="flex items-center gap-1">💻 <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{github}</a></span>
              )}
              {website && (
                <span className="flex items-center gap-1">🌐 <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a></span>
              )}
              {/* Extra Links */}
              {visibleExtraLinks.map((link, index) => (
                <span key={index} className="flex items-center gap-1">
                  <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8">
        {/* ================= SUMMARY ================= */}
        {summary && (
          <section className="mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-[16px] font-bold text-purple-600 mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                About Me
              </h2>
              <p className="text-justify text-gray-700">{summary}</p>
            </div>
          </section>
        )}

        {/* ================= SKILLS ================= */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <section className="mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-[16px] font-bold text-purple-600 mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                Skills & Expertise
              </h2>

              {skills.technical?.length > 0 && (
                <div className="mb-3">
                  <p className="font-semibold text-pink-600 mb-2">
                    Technical Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-full text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft?.length > 0 && (
                <div>
                  <p className="font-semibold text-pink-600 mb-2">
                    Soft Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= EXPERIENCE ================= */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-[16px] font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                Work Experience
              </h2>

              {experience.map((job, idx) => (
                <div
                  key={job.id}
                  className={`${
                    idx !== experience.length - 1
                      ? "mb-4 pb-4 border-b border-gray-200"
                      : ""
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="font-bold text-[13px] text-gray-800">
                        {job.title || "Senior Software Engineer"}
                      </p>
                      <p className="text-purple-600 font-semibold">
                        {job.company || "Tech Innovations Inc."}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-600">
                        {job.location}
                      </p>
                      <p className="text-[10px] font-semibold text-pink-600">
                        {job.startDate} – {job.endDate || "Present"}
                      </p>
                    </div>
                  </div>

                  {job.description && (
                    <ul className="list-none ml-0 mt-2 space-y-1 text-gray-700">
                      {job.description.split("\n").map((line, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-500 mr-2">▸</span>
                          <span className="flex-1">{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= EDUCATION ================= */}
        {education?.length > 0 && (
          <section className="mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-[16px] font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                Education
              </h2>

              {education.map((edu, idx) => (
                <div
                  key={edu.id}
                  className={`${
                    idx !== education.length - 1
                      ? "mb-3 pb-3 border-b border-gray-200"
                      : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-gray-800">
                        {edu.school || "University Name"}
                      </p>
                      <p className="text-purple-600">{edu.degree}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-600">
                        {edu.location}
                      </p>
                      <p className="text-[10px] font-semibold text-pink-600">
                        {edu.graduationDate}
                      </p>
                    </div>
                  </div>
                  {edu.gpa && (
                    <p className="text-[10px] text-gray-600 mt-1">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= PROJECTS ================= */}
        {projects?.length > 0 && (
          <section className="mb-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-[16px] font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                Projects
              </h2>

              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`${
                    idx !== projects.length - 1
                      ? "mb-3 pb-3 border-b border-gray-200"
                      : ""
                  }`}
                >
                  <p className="font-bold text-gray-800">
                    {project.name}
                    {project.link && (
                      <span className="font-normal text-purple-600 ml-1 text-[10px]">
                        ({project.link})
                      </span>
                    )}
                  </p>
                  {project.technologies && (
                    <p className="text-[10px] text-gray-600 mb-1">
                      Tech Stack: {project.technologies}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-gray-700">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {certifications?.length > 0 && (
          <section className="mb-8">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-[16px] font-bold text-purple-600 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                Certifications
              </h2>

              {certifications.map((cert, idx) => (
                <div
                  key={cert.id}
                  className={`${
                    idx !== certifications.length - 1
                      ? "mb-2 pb-2 border-b border-gray-200"
                      : ""
                  }`}
                >
                  <p className="font-semibold text-gray-800">{cert.name}</p>
                  <p className="text-[10px] text-gray-600">
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

export default MinimalTemplate;
