import React from "react";

const ProfessionalTemplate = ({ formData }) => {
  const {
    fullName,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
    summary,
    experience = [],
    education = [],
    skills = {},
    projects = [],
    certifications = [],
  } = formData;

  return (
    <div className="w-[794px] h-[1123px] mx-auto bg-white p-8 overflow-hidden text-[10px] leading-relaxed text-gray-900 font-serif">

      {/* ================= HEADER ================= */}
      <div className="text-center mb-4">
        <h1 className="text-[24px] font-bold tracking-wide uppercase break-words">
          {fullName || "Jessica Claire"}
        </h1>

        <p className="mt-1 text-[9px] flex flex-wrap justify-center gap-x-2 break-words">
          {location && <span>{location}</span>}
          {email && <span>• {email}</span>}
          {phone && <span>• {phone}</span>}
          {linkedin && <span>• {linkedin}</span>}
          {github && <span>• {github}</span>}
          {website && <span>• {website}</span>}
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="mb-4">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Professional Summary
          </h2>

          <p className="break-words">{summary}</p>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <section className="mb-4">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Technical Skills
          </h2>

          {skills.technical?.length > 0 && (
            <p className="mb-1 break-words">
              <span className="font-semibold">Technical: </span>
              {skills.technical.join(", ")}
            </p>
          )}

          {skills.soft?.length > 0 && (
            <p className="break-words">
              <span className="font-semibold">Soft Skills: </span>
              {skills.soft.join(", ")}
            </p>
          )}
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Professional Experience
          </h2>

          {experience.map((job) => (
            <div key={job.id} className="mb-3">
              <div className="flex justify-between gap-2">
                <div className="max-w-[70%]">
                  <p className="font-semibold break-words">
                    {job.title || "Senior Software Engineer"}
                  </p>

                  <p className="italic break-words">
                    {job.company || "Tech Innovations Inc."}
                  </p>
                </div>

                <div className="text-right text-[9px] italic">
                  <p className="break-words">{job.location}</p>
                  <p>
                    {job.startDate} – {job.endDate || "Present"}
                  </p>
                </div>
              </div>

              {job.description && (
                <ul className="list-disc ml-5 mt-1 space-y-0.5">
                  {job.description
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => (
                      <li key={index} className="break-words">
                        {line}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= EDUCATION ================= */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Education
          </h2>

          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between gap-2">
                <div className="max-w-[70%]">
                  <p className="font-semibold break-words">
                    {edu.school || "University Name"}
                  </p>

                  <p className="italic break-words">{edu.degree}</p>
                </div>

                <div className="text-right text-[9px] italic">
                  <p className="break-words">{edu.location}</p>
                  <p>{edu.graduationDate}</p>
                </div>
              </div>

              {edu.gpa && <p className="text-[9px]">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Projects
          </h2>

          {projects.map((project) => (
            <div key={project.id} className="mb-2">
              <p className="font-semibold break-words">
                {project.name}

                {project.link && (
                  <span className="font-normal text-blue-600 ml-1 break-all">
                    ({project.link})
                  </span>
                )}
              </p>

              {project.technologies && (
                <p className="italic text-[9px] mb-1 break-words">
                  Technologies: {project.technologies}
                </p>
              )}

              {project.description && (
                <p className="break-words">{project.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {certifications.length > 0 && (
        <section>
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[10px] font-bold tracking-widest uppercase">
            Certifications
          </h2>

          {certifications.map((cert) => (
            <div key={cert.id} className="mb-1">
              <p className="font-semibold break-words">{cert.name}</p>

              <p className="italic text-[9px] break-words">
                {cert.issuer} • {cert.date}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;