import React from "react";

const NovaGridTemplate = ({ formData }) => {
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

  return (
    <div className="w-full bg-white text-[11px] text-slate-900 leading-relaxed font-sans">
      <header className="bg-slate-900 text-white px-8 py-6">
        <h1 className="text-[28px] font-bold tracking-wide">{fullName || "Jessica Claire"}</h1>
        <div className="mt-2 text-[10px] flex flex-wrap gap-x-3 gap-y-1 text-slate-200">
          {location && <span>{location}</span>}
          {email && <span>{email}</span>}
          {phone && <span>{phone}</span>}
          {linkedin && <span>{linkedin}</span>}
          {github && <span>{github}</span>}
          {website && <span>{website}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 min-h-[980px]">
        <aside className="col-span-1 bg-slate-100 px-6 py-6 border-r border-slate-200">
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <section className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 mb-2">Skills</h2>
              {skills.technical?.length > 0 && (
                <ul className="space-y-1 text-[10px] text-slate-800 list-disc ml-4">
                  {skills.technical.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              )}
              {skills.soft?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-slate-700 mb-1">Soft Skills</p>
                  <p className="text-[10px] text-slate-700">{skills.soft.join(" • ")}</p>
                </div>
              )}
            </section>
          )}

          {education?.length > 0 && (
            <section className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 mb-2">Education</h2>
              {education.map((edu) => (
                <article key={edu.id} className="mb-3">
                  <p className="font-semibold text-[10px]">{edu.school || "University Name"}</p>
                  <p className="text-[10px] italic">{edu.degree}</p>
                  <p className="text-[10px] text-slate-600">{edu.graduationDate}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-600">GPA: {edu.gpa}</p>}
                </article>
              ))}
            </section>
          )}

          {certifications?.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 mb-2">Certifications</h2>
              {certifications.map((cert) => (
                <article key={cert.id} className="mb-2">
                  <p className="text-[10px] font-semibold">{cert.name}</p>
                  <p className="text-[10px] text-slate-600">{cert.issuer}</p>
                  <p className="text-[10px] text-slate-600">{cert.date}</p>
                </article>
              ))}
            </section>
          )}
        </aside>

        <main className="col-span-2 px-7 py-6">
          {summary && (
            <section className="mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Professional Summary
              </h2>
              <p>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Experience
              </h2>
              {experience.map((job) => (
                <article key={job.id} className="mb-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-bold">{job.title || "Senior Software Engineer"}</p>
                      <p className="text-slate-700">{job.company || "Tech Innovations Inc."}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-600">
                      <p>{job.location}</p>
                      <p>
                        {job.startDate} - {job.endDate || "Present"}
                      </p>
                    </div>
                  </div>
                  {job.description && (
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      {job.description
                        .split("\n")
                        .filter(Boolean)
                        .map((line, index) => (
                          <li key={index}>{line.replace(/^•\s*/, "")}</li>
                        ))}
                    </ul>
                  )}
                </article>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Projects
              </h2>
              {projects.map((project) => (
                <article key={project.id} className="mb-3">
                  <p className="font-semibold">{project.name}</p>
                  {project.technologies && (
                    <p className="text-[10px] text-slate-600 italic">{project.technologies}</p>
                  )}
                  {project.description && <p>{project.description}</p>}
                  {project.link && <p className="text-[10px] text-slate-600">{project.link}</p>}
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default NovaGridTemplate;
