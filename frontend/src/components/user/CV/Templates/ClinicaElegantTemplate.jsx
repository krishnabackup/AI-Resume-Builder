import React from "react";

const ClinicaElegantTemplate = ({ formData }) => {
  const {
    fullName,
    title,
    photo,
    address,
    phone,
    email,
    summary,
    skills = [],
    experience = [],
    education = []
  } = formData;

  return (
    <div className="w-full flex justify-center bg-gray-200 py-10 print:bg-white">
      <div className="w-[900px] min-h-[1200px] bg-white shadow-lg border border-gray-300 flex font-[Georgia] text-gray-800">

        {/* SIDEBAR */}
        <aside className="w-[34%] bg-gray-50 border-r border-gray-200 p-10">

          {/* PROFILE */}
          <div className="flex items-center gap-4 mb-10">
            
            <div>
              <h1 className="text-2xl font-semibold leading-tight">
                {fullName}
              </h1>
              <p className="text-sm text-gray-500">{title}</p>
            </div>
          </div>

          {/* DETAILS */}
          <section className="mb-10">
            <h2 className="text-[15px] font-bold text-amber-700 mb-3">
              Details
            </h2>

            <div className="text-sm space-y-2 text-gray-700 leading-relaxed">
              {address && <p>{address}</p>}
              {phone && <p>{phone}</p>}
              {email && <p>{email}</p>}
            </div>
          </section>

          {/* SKILLS */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-[15px] font-bold text-amber-700 mb-3">
                Skills
              </h2>

              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <p className="text-sm mb-1">{skill.name}</p>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`w-2.5 h-2.5 rounded-full ${
                            dot <= skill.level
                              ? "bg-black"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className="w-[66%] p-12">

          {/* PROFILE SUMMARY */}
          {summary && (
            <section className="mb-12">
              <h2 className="text-lg font-bold text-amber-700 mb-4">
                Profile
              </h2>

              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg font-bold text-amber-700 mb-6">
                Employment History
              </h2>

              <div className="space-y-8">
                {experience.map((job, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">
                        {job.title}, {job.company}
                      </h3>

                      <span className="text-sm text-gray-600">
                        {job.startDate} – {job.endDate}
                      </span>
                    </div>

                    {job.location && (
                      <div className="text-sm text-gray-500 mb-2">
                        {job.location}
                      </div>
                    )}

                    {job.points?.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                        {job.points.map((point, idx) => (
                          <li key={idx}>{point}</li>
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
            <section>
              <h2 className="text-lg font-bold text-amber-700 mb-6">
                Education
              </h2>

              <div className="space-y-8">
                {education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
                        {edu.school}, {edu.degree}
                      </h3>

                      <span className="text-sm text-gray-600">
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>

                    {edu.note && (
                      <p className="text-sm text-gray-700 mt-2">
                        {edu.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
        </main>
      </div>
    </div>
  );
};

export default ClinicaElegantTemplate;
