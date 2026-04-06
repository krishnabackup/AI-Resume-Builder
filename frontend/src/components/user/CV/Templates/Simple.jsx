import React from "react";

const Simple = ({formData}) => {
  const {fullName,
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
    certifications,} = formData;
  return (
    <div className="max-w-4xl resume-root space-y-6 mx-auto bg-white p-10 shadow-xl rounded-xl text-gray-800 leading-relaxed">

      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold tracking-wide">{fullName}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2 text-gray-600">
          {phone && <span>📞 +91-{phone}</span>}
          {email && <span>✉️ {email}</span>}
          {location && <span>{location}</span>}
          {website && <span>🌐 <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a></span>}
          {github && <span>🐙 <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{github}</a></span>}
          {linkedin && <span>🔗 <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{linkedin}</a></span>}
          {formData?.extraLinks?.map((link, index) => (
            <span key={index}> 
              <a href={link.url.startsWith("http") ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </div>


      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="border-b text-lg font-semibold mb-2 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm">{summary}</p>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold border-b mb-2 pb-1">Education</h2>
          <div className="space-y-2 text-sm">
            {education.map((edu)=>(
              <div key={edu.id} className="mb-4 text-sm">

                <div  className="flex justify-between">
                  <div className="flex flex-col gap-2 ">
                    <div className="flex items-center">
                      <span className="font-semibold">{edu.school || "University Name"} </span>
                      <span className="italic"> — {edu.degree}</span>
                    </div>
                    {edu.location && <p className="font-bold">{edu.location}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    {edu.graduationDate && <span>{edu.graduationDate}</span>}
                    {edu.gpa && <p className="font-bold">GPA : {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-6 text-sm">
          <h2 className="border-b pb-1 mb-2 text-lg font-bold">
            Projects
          </h2>


          {projects.map((project) => (
            <div key={project.id} className="project-item mb-3">
              <p className="font-semibold">
                {project.name}
                {project.link && (
                  <span className="font-normal text-blue-600 ml-1">
                    ({project.link})
                  </span>
                )}
              </p>


              {project.technologies && (
                <p className="italic text-[12px] mb-1">
                  Technologies: {project.technologies}
                </p>
              )}


              {project.description && <p>{project.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-6 text-sm">
          <h2 className="border-b  pb-1 mb-2 text-lg font-bold">
            Professional Experience
          </h2>


          {experience.map((job) => (
            <div key={job.id} className="experience-item mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {job.title || "Senior Software Engineer"}
                  </p>
                  <p className="italic">
                    {job.company || "Tech Innovations Inc."}
                  </p>
                </div>


                <div className="text-right text-[10px] italic">
                  <p>{job.location}</p>
                  <p>
                    {job.startDate} – {job.endDate || "Present"}
                  </p>
                </div>
              </div>


              {job.description && (
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {job.description.split("\n").map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <section className="mb-6 text-sm">
          <h2 className="border-b pb-1 mb-2 text-lg font-bold ">
            Technical Skills
          </h2>


          {skills.technical?.length > 0 && (
            <p className="mb-1">
              <span className="font-semibold">Technical: </span>
              {skills.technical.join(", ")}
            </p>
          )}


          {skills.soft?.length > 0 && (
            <p>
              <span className="font-semibold">Soft Skills: </span>
              {skills.soft.join(", ")}
            </p>
          )}
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section className="text-sm">
          <h2 className="border-b pb-1 mb-2 font-bold text-lg">
            Certifications
          </h2>


          {certifications.map((cert) => (
            <div key={cert.id} className="certification-item mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">{cert.name}</p>
                <p className="text-sm">
                  {cert.issuer} • {cert.date}
                </p>
              </div>
              <a href={cert.link} target="_blank" className="text-sm text-blue-500">credentials</a>
            </div>
          ))}
        </section>
      )}

    </div>
  );
};

export default Simple;
