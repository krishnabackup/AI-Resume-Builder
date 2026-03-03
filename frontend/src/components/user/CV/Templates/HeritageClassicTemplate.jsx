import React from "react";

const sectionTitle =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 border-b border-slate-300 pb-1 mb-2";

const HeritageClassicTemplate = ({ formData }) => {
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
    <div className="w-full bg-white text-[11px] text-slate-900 leading-relaxed font-serif px-8 py-8">
      <header className="text-center mb-6 pb-4 border-b-2 border-slate-700">
        <h1 className="text-[30px] uppercase tracking-[0.18em] font-bold">
          {fullName || "Jessica Claire"}
        </h1>
        <p className="mt-2 text-[10px] text-slate-700 flex flex-wrap justify-center gap-x-2">
          {location && <span>{location}</span>}
          {email && <span>• {email}</span>}
          {phone && <span>• {phone}</span>}
          {linkedin && <span>• {linkedin}</span>}
          {github && <span>• {github}</span>}
          {website && <span>• {website}</span>}
        </p>
      </header>

      {summary && (
        <section className="mb-5">
          <h2 className={sectionTitle}>Professional Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <section className="mb-5">
          <h2 className={sectionTitle}>Core Competencies</h2>
          {skills.technical?.length > 0 && (
            <p className="mb-1">
              <span className="font-semibold">Technical:</span> {skills.technical.join(", ")}
            </p>
          )}
          {skills.soft?.length > 0 && (
            <p>
              <span className="font-semibold">Interpersonal:</span> {skills.soft.join(", ")}
            </p>
          )}
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-5">
          <h2 className={sectionTitle}>Professional Experience</h2>
          {experience.map((job) => (
            <article key={job.id} className="mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{job.title || "Senior Software Engineer"}</p>
                  <p className="italic text-slate-700">{job.company || "Tech Innovations Inc."}</p>
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

      {education?.length > 0 && (
        <section className="mb-5">
          <h2 className={sectionTitle}>Education</h2>
          {education.map((edu) => (
            <article key={edu.id} className="mb-3 flex justify-between gap-4">
              <div>
                <p className="font-bold">{edu.school || "University Name"}</p>
                <p className="italic">{edu.degree}</p>
                {edu.gpa && <p className="text-[10px]">GPA: {edu.gpa}</p>}
              </div>
              <div className="text-right text-[10px] text-slate-600">
                <p>{edu.location}</p>
                <p>{edu.graduationDate}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      {projects?.length > 0 && (
        <section className="mb-5">
          <h2 className={sectionTitle}>Selected Projects</h2>
          {projects.map((project) => (
            <article key={project.id} className="mb-3">
              <p className="font-bold">{project.name}</p>
              {project.technologies && (
                <p className="text-[10px] italic text-slate-600 mb-1">
                  Tech: {project.technologies}
                </p>
              )}
              {project.description && <p>{project.description}</p>}
              {project.link && <p className="text-[10px] text-slate-600">{project.link}</p>}
            </article>
          ))}
        </section>
      )}

      {certifications?.length > 0 && (
        <section>
          <h2 className={sectionTitle}>Certifications</h2>
          {certifications.map((cert) => (
            <article key={cert.id} className="mb-2">
              <p className="font-semibold">{cert.name}</p>
              <p className="text-[10px] text-slate-600">
                {cert.issuer} • {cert.date}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default HeritageClassicTemplate;
