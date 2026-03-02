import React from "react";

const EclipseTemplate = ({ formData }) => {
  const {
    fullName,
    title,
    location,
    email,
    phone,
    summary,
    experience = [],
    education = [],
    skills = []
  } = formData;

  return (
    <div className="w-full flex justify-center bg-gray-200 py-12 print:bg-white">
      <div
        className="w-[820px] bg-white shadow-lg border border-gray-300 px-14 py-12 text-gray-900"
        style={{ fontFamily: "Georgia, Times, serif" }}
      >

        {/* HEADER */}
        <header className="text-center border-b border-gray-300 pb-6 mb-8">
          {title && (
            <div className="text-[13px] tracking-[2px] uppercase text-gray-600 mb-2">
              {title}
            </div>
          )}

          <h1 className="text-[38px] tracking-wide font-semibold">
            {fullName}
          </h1>

          <div className="mt-3 text-[13px] text-gray-700 space-x-6">
            {location && <span>{location}</span>}
            {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
          </div>
        </header>

        {/* SUMMARY */}
        {summary && (
          <section className="mb-9">
            <h2 className="section-title">Summary</h2>
            <p className="body-text">{summary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="mb-10">
            <h2 className="section-title">Experience</h2>

            <div className="space-y-7">
              {experience.map((job, i) => (
                <div key={i}>
                  
                  {/* JOB HEADER */}
                  <div className="flex justify-between">
                    <h3 className="job-title">
                      {job.title}
                      {job.title && job.company && " | "}
                      {job.company}
                    </h3>

                    <span className="date">
                      {job.startDate} — {job.endDate || "Current"}
                    </span>
                  </div>

                  {/* LOCATION */}
                  {job.location && (
                    <div className="location">
                      {job.location}
                    </div>
                  )}

                  {/* BULLETS */}
                  {job.points?.length > 0 && (
                    <ul className="bullet-list">
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
            <h2 className="section-title">Education</h2>

            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <h3 className="job-title">
                      {edu.school}
                      {edu.school && edu.degree && " | "}
                      {edu.degree}
                    </h3>

                    <span className="date">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>

                  {edu.field && (
                    <div className="location">{edu.field}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section>
            <h2 className="section-title">Skills</h2>

            <div className="grid grid-cols-2 gap-x-20 gap-y-1 text-[14px]">
              {skills.map((skill, i) => {
                const name =
                  typeof skill === "string" ? skill : skill.name;

                return (
                  <div key={i} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* STYLES */}
      <style jsx>{`
        .section-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .body-text {
          font-size: 14px;
          line-height: 1.7;
        }

        .job-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .date {
          font-size: 13px;
          color: #555;
        }

        .location {
          font-size: 13px;
          color: #666;
          margin-bottom: 6px;
        }

        .bullet-list {
          padding-left: 18px;
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default EclipseTemplate;
