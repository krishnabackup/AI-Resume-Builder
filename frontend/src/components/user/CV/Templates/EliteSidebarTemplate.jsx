import React from "react";

const EliteSidebarResume = ({ formData }) => {
  const {
  fullName,
  title,
  summary,
  email,
  phone,
  location,
  experience = [],
  education = []
} = formData;

const skills =
  formData.skills?.technical ||
  formData.skills ||
  [];


  return (
    <div className="flex justify-center bg-gray-200 py-10 print:bg-white">
      <div className="w-[900px] bg-white border-[12px] border-teal-800 shadow-sm font-sans text-gray-800">

        <div className="flex">

          {/* LEFT COLUMN */}
          <main className="w-[65%] p-10">

            {/* NAME BADGE */}
            <div className="mb-8">
              <div className="inline-block bg-yellow-300 rounded-full px-6 py-4">
                <h1 className="text-2xl font-bold leading-tight">
                  {fullName || "Your Name"}
                </h1>
               
              </div>
            </div>

            {/* SUMMARY */}
            {summary && (
              <section className="mb-8">
                <h2 className="font-semibold text-teal-800 mb-2">Summary</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {summary}
                </p>
              </section>
            )}

            {/* EXPERIENCE */}
            {experience.length > 0 && (
              <section className="mb-8">
                <h2 className="font-semibold text-teal-800 mb-4">Experience</h2>

                <div className="space-y-6">
                  {experience.map((job, i) => (
                    <div key={i} className="flex gap-4">

                      {/* DATE COLUMN */}
                      <div className="w-24 text-sm text-gray-600">
                        {job.startDate}
                        <br />
                        {job.endDate || "Current"}
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {job.title}
                        </h3>

                        <div className="text-sm text-gray-600 mb-2">
                          {job.company}
                          {job.location && `, ${job.location}`}
                        </div>

                        {job.points?.length > 0 && (
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {job.points.map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EDUCATION */}
            {education.length > 0 && (
              <section>
                <h2 className="font-semibold text-teal-800 mb-4">Education</h2>

                {education.map((edu, i) => (
                  <div key={i} className="flex gap-4">

                    <div className="w-24 text-sm text-gray-600">
                      {edu.startDate}–{edu.endDate}
                    </div>

                    <div>
                      <div className="font-semibold">{edu.degree}</div>
                      <div className="text-sm text-gray-600">{edu.school}</div>
                    </div>

                  </div>
                ))}
              </section>
            )}

          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="w-[35%] border-l border-dashed border-gray-400 p-10">

            {/* DETAILS */}
            {(email || phone || location) && (
              <section className="mb-10">
                <h2 className="font-semibold text-teal-800 mb-3">Details</h2>

                <div className="space-y-3 text-sm">

                  {email && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                      {email}
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                      {location}
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                      {phone}
                    </div>
                  )}

                </div>
              </section>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <section>
                <h2 className="font-semibold text-teal-800 mb-3">Skills</h2>

                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-teal-700 text-white text-xs px-4 py-2 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

          </aside>

        </div>
      </div>
    </div>
  );
};

export default EliteSidebarResume;
