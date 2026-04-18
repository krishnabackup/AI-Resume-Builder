import React from "react";
import { formatExternalUrl, getVisibleExtraLinks } from "../../Templates/socialUtils";


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
    experience,
    education,
    skills,
    projects,
    certifications,
  } = formData;

  const visibleExtraLinks = getVisibleExtraLinks(formData?.extraLinks);


  return (
    <div className="w-full text-[11px] leading-relaxed text-gray-900 font-serif">
      <style>{`
        @page {
          size: A4;
          margin: 10mm;
        }
       
        /* Ensure content flows to next page instead of being cut */
        section {
          page-break-inside: avoid;
          break-inside: avoid;
        }
       
        /* Allow specific elements to break between pages */
        .experience-item,
        .education-item,
        .project-item,
        .certification-item {
          page-break-inside: avoid;
          break-inside: avoid;
        }
       
        /* If content is too long, allow it to break */
        .experience-item,
        .education-item,
        .project-item,
        .certification-item {
          page-break-inside: auto;
          break-inside: auto;
        }
       
        /* Prevent small elements from being orphaned */
        h2, h3 {
          page-break-after: avoid;
          break-after: avoid;
        }
       
        /* Ensure lists don't break awkwardly */
        ul, ol {
          page-break-inside: avoid;
        }
       
        li {
          page-break-inside: avoid;
        }
      `}</style>
      {/* ================= HEADER ================= */}
      <div className="text-center mb-6">
        <h1 className="text-[28px] font-bold tracking-wide uppercase">
          {fullName || "Jessica Claire"}
        </h1>


        <p className="mt-2 text-[10px] flex flex-wrap justify-center gap-x-2">
          {location && <span>{location}</span>}
          {email && <span>• {email}</span>}
          {phone && <span>• {phone}</span>}
          {linkedin && <span>• <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{linkedin}</a></span>}
          {github && <span>• <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{github}</a></span>}
          {website && <span>• <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{website}</a></span>}
          {/* Extra Links */}
          {formData?.extraLinks?.map((link, index) => (
            link.label && link.url && <span key={index}>• 
              <a href={link.url.startsWith("http") ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {link.label}
              </a>
            </span>
          ))}
        </p>
      </div>


      {/* ================= SUMMARY ================= */}
      {summary && (
        <section className="mb-6">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[11px] font-bold tracking-widest uppercase">
            Professional Summary
          </h2>
          <p>{summary}</p>
        </section>
      )}


      {/* ================= SKILLS ================= */}
      {(skills?.technical?.length > 0 || skills?.soft?.length > 0) && (
        <section className="mb-6">
          <h2 className="border-b border-gray-400 pb-1 mb-2 text-[11px] font-bold tracking-widest uppercase">
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


      {/* ================= EXPERIENCE ================= */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="border-b border-gray-400 pb-1 mb-3 text-[11px] font-bold tracking-widest uppercase">
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


      {/* ================= EDUCATION ================= */}
      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="border-b border-gray-400 pb-1 mb-3 text-[11px] font-bold tracking-widest uppercase">
            Education
          </h2>


          {education.map((edu) => (
            <div key={edu.id} className="education-item mb-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {edu.school || "University Name"}
                  </p>
                  <p className="italic">{edu.degree}</p>
                </div>


                <div className="text-right text-[10px] italic">
                  <p>{edu.location}</p>
                  <p>{edu.graduationDate}</p>
                </div>
              </div>


              {edu.gpa && <p>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}


      {/* ================= PROJECTS ================= */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="border-b border-gray-400 pb-1 mb-3 text-[11px] font-bold tracking-widest uppercase">
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
                <p className="italic text-[10px] mb-1">
                  Technologies: {project.technologies}
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
          <h2 className="border-b border-gray-400 pb-1 mb-3 text-[11px] font-bold tracking-widest uppercase">
            Certifications
          </h2>


          {certifications.map((cert) => (
            <div key={cert.id} className="certification-item mb-2">
              <p className="font-semibold">{cert.name}</p>
              <p className="italic text-[10px]">
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



