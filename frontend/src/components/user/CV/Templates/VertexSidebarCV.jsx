import React from "react";

const VertexSidebarCV = ({ formData }) => {
  const {
    fullName,
    title,
    summary,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    skills = [],
  } = formData;

  const skillList =
    skills?.technical ||
    skills?.soft ||
    skills ||
    [];

  return (
    <div className="w-full flex justify-center py-10 print:py-0">

      {/* A1 PAGE */}
      <div
        className="bg-white flex font-sans text-gray-800"
      >

        {/* ================= LEFT ================= */}
        <main className="w-[65%] p-14">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">{fullName}</h1>
            {title && (
              <p className="text-gray-500 text-sm mt-1">{title}</p>
            )}
          </div>


          {/* SUMMARY */}
          {summary && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">
                Profile
              </h2>

              <p className="text-sm leading-relaxed whitespace-pre-line">
                {summary}
              </p>
            </section>
          )}


          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-4 border-b pb-1">
                Experience
              </h2>

              <div className="space-y-7">
                {experience.map((job, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">

                      <div>
                        <h3 className="font-semibold text-sm">
                          {job.title}{job.company && ", "}{job.company}
                        </h3>

                        {job.location && (
                          <div className="text-xs text-gray-500">
                            {job.location}
                          </div>
                        )}
                      </div>

                      {(job.startDate || job.endDate) && (
                        <div className="text-xs text-gray-500">
                          {job.startDate} – {job.endDate || "Present"}
                        </div>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-xs mb-1">{job.description}</p>
                    )}

                    {job.points?.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        {job.points.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* EDUCATION */}
          {education.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-4 border-b pb-1">
                Education
              </h2>

              <div className="space-y-5">
                {education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-sm">
                      {edu.degree}{edu.school && ", "}{edu.school}
                    </h3>

                    {(edu.startDate || edu.endDate) && (
                      <div className="text-xs text-gray-500">
                        {edu.startDate} – {edu.endDate}
                      </div>
                    )}

                    {edu.note && (
                      <div className="text-xs mt-1">{edu.note}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* PROJECTS */}
          {projects.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-4 border-b pb-1">
                Projects
              </h2>

              <div className="space-y-4">
                {projects.map((project, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-sm">{project.name}</h3>

                    {project.technologies && (
                      <div className="text-xs text-gray-500">
                        {project.technologies}
                      </div>
                    )}

                    {project.description && (
                      <p className="text-xs mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 border-b pb-1">
                Certifications
              </h2>

              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i}>
                    <div className="text-sm font-semibold">{cert.name}</div>
                    <div className="text-xs text-gray-500">
                      {cert.issuer} — {cert.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>



        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="w-[35%] border-l p-14">

          {/* DETAILS */}
          {(email || phone || location || website || linkedin || github) && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">
                Details
              </h2>

              <div className="space-y-1 text-xs">
                {email && <div>{email}</div>}
                {phone && <div>{phone}</div>}
                {location && <div>{location}</div>}
                {website && <div>{website}</div>}
                {linkedin && <div>{linkedin}</div>}
                {github && <div>{github}</div>}
              </div>
            </section>
          )}


          {/* SKILLS */}
          {skillList.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 border-b pb-1">
                Skills
              </h2>

              <ul className="space-y-2 text-xs">
                {skillList.map((skill, i) => (
                  <li key={i}>• {skill}</li>
                ))}
              </ul>
            </section>
          )}

        </aside>
      </div>
    </div>
  );
};

export default VertexSidebarCV;
