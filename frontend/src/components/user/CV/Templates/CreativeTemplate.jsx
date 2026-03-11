import React from "react";

const CreativeTemplate = ({ formData }) => {
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
    <div className="w-full text-[11px] leading-relaxed text-gray-800 bg-white">
      
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 mb-6">
        <h1 className="text-[32px] font-bold mb-2">
          {fullName || "Jessica Claire"}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
          {email && <span>✉ {email}</span>}
          {phone && <span>📱 {phone}</span>}
          {location && <span>📍 {location}</span>}
          {linkedin && <span>💼 {linkedin}</span>}
          {github && <span>💻 {github}</span>}
          {website && <span>🌐 {website}</span>}
        </div>
      </div>

      <div className="px-6 pb-6">
        
        {/* ================= SUMMARY ================= */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-[14px] font-bold text-blue-700 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-700 mr-2"></span>
              PROFESSIONAL SUMMARY
            </h2>

            <p className="text-justify">{summary}</p>
          </section>
        )}

        {/* ================= SKILLS ================= */}
        {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
          <section className="mb-6">
            <h2 className="text-[14px] font-bold text-blue-700 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-700 mr-2"></span>
              SKILLS
            </h2>

            {skills?.technical?.length > 0 && (
              <div className="mb-3">
                <span className="font-semibold text-blue-600">Technical:</span>

                <div className="flex flex-wrap gap-2 mt-1">
                  {skills.technical.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skills?.soft?.length > 0 && (
              <div>
                <span className="font-semibold text-blue-600">Soft Skills:</span>

                <div className="flex flex-wrap gap-2 mt-1">
                  {skills.soft.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================= EXPERIENCE ================= */}
        {experience?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[14px] font-bold text-blue-700 mb-4 flex items-center">
              <span className="w-1 h-5 bg-blue-700 mr-2"></span>
              PROFESSIONAL EXPERIENCE
            </h2>

            <div className="space-y-4">
              {experience.map((job) => (
                <div
                  key={job.id}
                  className="pl-4 border-l-2 border-blue-200"
                >
                  <div className="flex justify-between mb-1">
                    <div>
                      <p className="font-bold text-[12px]">
                        {job.title || "Senior Software Engineer"}
                      </p>

                      <p className="text-blue-600 font-semibold">
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
                    <ul className="list-disc ml-4 mt-2 space-y-1">
                      {job.description.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= EDUCATION ================= */}
        {education?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[14px] font-bold text-blue-700 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-700 mr-2"></span>
              EDUCATION
            </h2>

            {education.map((edu) => (
              <div
                key={edu.id}
                className="mb-3 pl-4 border-l-2 border-blue-200"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">
                      {edu.school || "University Name"}
                    </p>

                    <p className="text-blue-600">{edu.degree}</p>
                  </div>

                  <div className="text-right text-[10px] text-gray-600">
                    <p>{edu.location}</p>

                    <p className="font-semibold">
                      {edu.graduationDate}
                    </p>
                  </div>
                </div>

                {edu.gpa && (
                  <p className="text-[10px] mt-1">
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ================= PROJECTS ================= */}
        {projects?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[14px] font-bold text-blue-700 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-700 mr-2"></span>
              PROJECTS
            </h2>

            {projects.map((project) => (
              <div
                key={project.id}
                className="mb-3 pl-4 border-l-2 border-blue-200"
              >
                <p className="font-bold">
                  {project.name}

                  {project.link && (
                    <span className="text-blue-600 text-[10px] ml-1">
                      ({project.link})
                    </span>
                  )}
                </p>

                {project.technologies && (
                  <p className="text-[10px] text-gray-600 mb-1">
                    Tech Stack: {project.technologies}
                  </p>
                )}

                {project.description && <p>{project.description}</p>}
              </div>
            ))}
          </section>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {certifications?.length > 0 && (
          <section>
            <h2 className="text-[14px] font-bold text-blue-700 mb-3 flex items-center">
              <span className="w-1 h-5 bg-blue-700 mr-2"></span>
              CERTIFICATIONS
            </h2>

            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="mb-2 pl-4 border-l-2 border-blue-200"
              >
                <p className="font-semibold">{cert.name}</p>

                <p className="text-[10px] text-gray-600">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
            ))}
          </section>
        )}

      </div>
    </div>
  );
};

export default CreativeTemplate;