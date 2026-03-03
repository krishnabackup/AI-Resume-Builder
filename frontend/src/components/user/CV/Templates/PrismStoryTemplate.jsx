import React from "react";

const cardTitle =
  "text-[10px] uppercase tracking-[0.18em] font-bold text-slate-700 mb-2";

const PrismStoryTemplate = ({ formData }) => {
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
    <div className="w-full bg-gradient-to-br from-amber-50 via-white to-rose-50 text-[11px] text-slate-900 leading-relaxed font-sans px-7 py-7">
      <header className="bg-white border border-rose-100 shadow-sm rounded-2xl overflow-hidden mb-5">
        <div className="h-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400" />
        <div className="px-6 py-5">
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">
            {fullName || "Jessica Claire"}
          </h1>
          <p className="mt-2 text-[10px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
            {location && <span>{location}</span>}
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {linkedin && <span>{linkedin}</span>}
            {github && <span>{github}</span>}
            {website && <span>{website}</span>}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-5 gap-4">
        <main className="col-span-3 space-y-4">
          {summary && (
            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className={cardTitle}>Profile</h2>
              <p>{summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className={cardTitle}>Experience Highlights</h2>
              {experience.map((job) => (
                <article key={job.id} className="mb-4 last:mb-0">
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
            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className={cardTitle}>Projects</h2>
              {projects.map((project) => (
                <article key={project.id} className="mb-3 last:mb-0">
                  <p className="font-semibold">{project.name}</p>
                  {project.technologies && (
                    <p className="text-[10px] text-slate-600 italic mb-1">{project.technologies}</p>
                  )}
                  {project.description && <p>{project.description}</p>}
                  {project.link && <p className="text-[10px] text-slate-600">{project.link}</p>}
                </article>
              ))}
            </section>
          )}
        </main>

        <aside className="col-span-2 space-y-4">
          {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className={cardTitle}>Skills</h2>
              {skills.technical?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.technical.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {skills.soft?.length > 0 && (
                <p className="text-[10px] text-slate-700">{skills.soft.join(" • ")}</p>
              )}
            </section>
          )}

          {education?.length > 0 && (
            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className={cardTitle}>Education</h2>
              {education.map((edu) => (
                <article key={edu.id} className="mb-3 last:mb-0">
                  <p className="font-semibold text-[10px]">{edu.school || "University Name"}</p>
                  <p className="text-[10px] italic">{edu.degree}</p>
                  <p className="text-[10px] text-slate-600">{edu.location}</p>
                  <p className="text-[10px] text-slate-600">{edu.graduationDate}</p>
                  {edu.gpa && <p className="text-[10px] text-slate-600">GPA: {edu.gpa}</p>}
                </article>
              ))}
            </section>
          )}

          {certifications?.length > 0 && (
            <section className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className={cardTitle}>Certifications</h2>
              {certifications.map((cert) => (
                <article key={cert.id} className="mb-2 last:mb-0">
                  <p className="text-[10px] font-semibold">{cert.name}</p>
                  <p className="text-[10px] text-slate-600">{cert.issuer}</p>
                  <p className="text-[10px] text-slate-600">{cert.date}</p>
                </article>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PrismStoryTemplate;
