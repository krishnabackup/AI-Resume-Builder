import React from "react";
import { formatExternalUrl, getVisibleExtraLinks } from "../../Templates/socialUtils";

const TwoColumnATS = ({ formData }) => {
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
    <div className="w-full text-[11px] leading-relaxed text-gray-900 p-8 bg-white">
      {/* ================= HEADER ================= */}
      <div className="mb-8 pb-6 border-b-2 border-black">
        <h1 className="text-[42px] font-light tracking-tight mb-3">
          {fullName || "Jessica Claire"}
        </h1>

        <div className="flex flex-wrap gap-x-4 text-[10px] text-gray-600">
          {email && <span>{email}</span>}
          {linkedin && <span>|</span>}
          {linkedin && <span>| <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{linkedin}</a></span>}
          {github && <span>|</span>}
          {github && <span>| <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{github}</a></span>}
          {website && <span>|</span>}
          {website && <span>| <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a></span>}
          {/* Extra Links */}
          {visibleExtraLinks.map((link, index) => (
            <span key={index}>|
              <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-[14px] font-semibold tracking-wide mb-3">
            SUMMARY
          </h2>
          <p className="text-justify leading-relaxed">{summary}</p>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[14px] font-semibold tracking-wide mb-4">
            EXPERIENCE
          </h2>

          {experience.map((job, idx) => (
            <div
              key={job.id}
              className={`${idx !== experience.length - 1 ? "mb-5" : ""}`}
            >
              <div className="flex justify-between mb-1">
                <div className="flex-1">
                  <p className="font-semibold text-[12px]">
                    {job.title || "Senior Software Engineer"}
                  </p>
                  <p className="text-gray-700">
                    {job.company || "Tech Innovations Inc."} • {job.location}
                  </p>
                </div>
                <div className="text-right text-[10px] text-gray-600 ml-4">
                  <p>
                    {job.startDate} – {job.endDate || "Present"}
                  </p>
                </div>
              </div>

              {job.description && (
                <ul className="mt-2 space-y-1 text-gray-700">
                  {job.description.split("\n").map((line, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">–</span>
                      <span className="flex-1">{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= EDUCATION ================= */}
      {education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[14px] font-semibold tracking-wide mb-4">
            EDUCATION
          </h2>

          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{edu.degree}</p>
                  <p className="text-gray-700">
                    {edu.school || "University Name"} • {edu.location}
                  </p>
                </div>
                <div className="text-right text-[10px] text-gray-600">
                  <p>{edu.graduationDate}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <section className="mb-8">
          <h2 className="text-[14px] font-semibold tracking-wide mb-3">
            SKILLS
          </h2>

          {skills.technical?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Technical: </span>
              <span>{skills.technical.join(" • ")}</span>
            </div>
          )}

          {skills.soft?.length > 0 && (
            <div>
              <span className="font-semibold">Soft Skills: </span>
              <span>{skills.soft.join(" • ")}</span>
            </div>
          )}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {projects?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[14px] font-semibold tracking-wide mb-4">
            PROJECTS
          </h2>

          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <p className="font-semibold">
                {project.name}
                {project.link && (
                  <span className="font-normal text-gray-600 ml-1 text-[10px]">
                    ({project.link})
                  </span>
                )}
              </p>

              {project.technologies && (
                <p className="text-[10px] text-gray-600 mb-1">
                  {project.technologies}
                </p>
              )}

              {project.description && (
                <p className="text-gray-700">{project.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {certifications?.length > 0 && (
        <section>
          <h2 className="text-[14px] font-semibold tracking-wide mb-3">
            CERTIFICATIONS
          </h2>

          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <p className="font-semibold">{cert.name}</p>
              <p className="text-[10px] text-gray-600">
                {cert.issuer} • {cert.date}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TwoColumnATS;
