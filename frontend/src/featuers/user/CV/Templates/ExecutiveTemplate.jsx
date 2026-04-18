import React from "react";
import { formatExternalUrl, getVisibleExtraLinks } from "../../Templates/socialUtils";

const ExecutiveTemplate = ({ formData }) => {
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
    <div className="w-full flex text-[11px] leading-relaxed">
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-1/3 bg-gray-800 text-white p-6">
        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-[14px] font-bold mb-3 pb-2 border-b border-gray-600">
            CONTACT
          </h2>
          <div className="space-y-2 text-[10px]">
            {email && (
              <div>
                <p className="font-semibold text-gray-400">Email</p>
                <p className="break-words">{email}</p>
              </div>
            )}
            {phone && (
              <div>
                <p className="font-semibold text-gray-400">Phone</p>
                <p>{phone}</p>
              </div>
            )}
            {location && (
              <div>
                <p className="font-semibold text-gray-400">Location</p>
                <p>{location}</p>
              </div>
            )}
            {linkedin && (
              <div>
                <p className="font-semibold text-gray-400">LinkedIn</p>
                <p className="break-words"><a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{linkedin}</a></p>
              </div>
            )}
            {github && (
              <div>
                <p className="font-semibold text-gray-400">GitHub</p>
                <p className="break-words"><a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{github}</a></p>
              </div>
            )}
            {website && (
              <div>
                <p className="font-semibold text-gray-400">Website</p>
                <p className="break-words"><a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a></p>
              </div>
            )}
            {/* Extra Links */}
            {visibleExtraLinks.map((link, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-400">{link.label}</p>
                <p className="break-words">
                  <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    {link.url}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-[14px] font-bold mb-3 pb-2 border-b border-gray-600">
              SKILLS
            </h2>

            {skills.technical?.length > 0 && (
              <div className="mb-3">
                <p className="font-semibold text-gray-400 text-[10px] mb-2">
                  Technical
                </p>
                <div className="space-y-1">
                  {skills.technical.map((skill, idx) => (
                    <div key={idx} className="text-[10px]">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.soft?.length > 0 && (
              <div>
                <p className="font-semibold text-gray-400 text-[10px] mb-2">
                  Soft Skills
                </p>
                <div className="space-y-1">
                  {skills.soft.map((skill, idx) => (
                    <div key={idx} className="text-[10px]">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[14px] font-bold mb-3 pb-2 border-b border-gray-600">
              EDUCATION
            </h2>

            {education.map((edu) => (
              <div key={edu.id} className="mb-3 text-[10px]">
                <p className="font-bold">{edu.degree}</p>
                <p className="text-gray-400">
                  {edu.school || "University Name"}
                </p>
                <p className="text-gray-400">{edu.graduationDate}</p>
                {edu.gpa && <p className="text-gray-400">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h2 className="text-[14px] font-bold mb-3 pb-2 border-b border-gray-600">
              CERTIFICATIONS
            </h2>

            {certifications.map((cert) => (
              <div key={cert.id} className="mb-3 text-[10px]">
                <p className="font-semibold">{cert.name}</p>
                <p className="text-gray-400">{cert.issuer}</p>
                <p className="text-gray-400">{cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RIGHT MAIN CONTENT ================= */}
      <div className="w-2/3 p-6 bg-white">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[36px] font-bold text-gray-800 mb-1">
            {fullName || "Jessica Claire"}
          </h1>
          <div className="h-1 w-20 bg-gray-800 mb-3"></div>
        </div>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-gray-800 mb-3 uppercase">
              Professional Summary
            </h2>
            <p className="text-justify text-gray-700">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[16px] font-bold text-gray-800 mb-3 uppercase">
              Professional Experience
            </h2>

            {experience.map((job) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between mb-1">
                  <div>
                    <p className="font-bold text-[13px] text-gray-800">
                      {job.title || "Senior Software Engineer"}
                    </p>
                    <p className="font-semibold text-gray-600">
                      {job.company || "Tech Innovations Inc."}
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-gray-600">
                    <p>{job.location}</p>
                    <p className="font-semibold">
                      {job.startDate} – {job.endDate || "Present"}
                    </p>
                  </div>
                </div>

                {job.description && (
                  <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-700">
                    {job.description.split("\n").map((line, index) => (
                      <li key={index}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section>
            <h2 className="text-[16px] font-bold text-gray-800 mb-3 uppercase">
              Projects
            </h2>

            {projects.map((project) => (
              <div key={project.id} className="mb-3">
                <p className="font-bold text-gray-800">
                  {project.name}
                  {project.link && (
                    <span className="font-normal text-blue-600 ml-1 text-[10px]">
                      ({project.link})
                    </span>
                  )}
                </p>
                {project.technologies && (
                  <p className="text-[10px] text-gray-600 mb-1">
                    Technologies: {project.technologies}
                  </p>
                )}
                {project.description && (
                  <p className="text-gray-700">{project.description}</p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
