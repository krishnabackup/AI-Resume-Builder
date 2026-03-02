import React from "react";

const HarborTemplate = ({ formData }) => {
  if (!formData) return null;

  const {
    fullName,
    title,
    photo,
    summary,
    address,
    phone,
    email,
    skills = [],
    experience = [],
    education = [],
    references
  } = formData;

  return (
    <div className=" flex justify-center">
      <div className="bg-[#f7f7f7] w-[900px] shadow-xl rounded-md flex overflow-hidden font-sans">

        {/* LEFT CONTENT */}
        <div className="w-[70%] p-10">

          {/* HEADER */}
          <div className="flex items-center gap-5 mb-6">
            {photo && (
              <img
                src={photo}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {fullName}
              </h1>
              {title && (
                <p className="uppercase text-xs tracking-widest text-gray-500">
                  {title}
                </p>
              )}
            </div>
          </div>

          {/* PROFILE */}
          {summary && (
            <Section title="Profile">
              <p className="leading-relaxed">{summary}</p>
            </Section>
          )}

          {/* EMPLOYMENT */}
          {experience.length > 0 && (
            <Section title="Employment History">
              {experience.map((job, i) => (
                <div key={job.id || i} className="mb-6">

                  <p className="font-semibold">
                    {job.title}, {job.company} {job.location && `· ${job.location}`}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    {job.startDate} — {job.endDate}
                  </p>

                  <ul className="list-disc ml-5 space-y-1">
                    {job.description
                      ?.split("\n")
                      .filter(Boolean)
                      .map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu, i) => (
                <div key={edu.id || i} className="mb-4">

                  <p className="font-semibold">
                    {edu.school}
                  </p>

                  <p className="text-sm">
                    {edu.degree}
                  </p>

                  <p className="text-xs text-gray-500">
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* REFERENCES */}
          {references && (
            <Section title="References">
              <p>{references}</p>
            </Section>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[30%] bg-[#0f2f4a] text-white p-8">

          {/* DETAILS */}
          <SideTitle title="Details" />

          <div className="space-y-3 text-sm mb-8">
            {address && <p>{address}</p>}
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
          </div>

          {/* SKILLS */}
          {skills.length > 0 && (
            <>
              <SideTitle title="Skills" />

              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <p className="text-sm mb-1">{skill.name}</p>

                    <div className="w-full h-[4px] bg-white/30">
                      <div
                        className="h-[4px] bg-white"
                        style={{
                          width: `${(skill.level || 3) * 20}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HarborTemplate;

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="font-bold text-gray-800 mb-2">{title}</h2>
    <div className="border-b border-gray-300 mb-4"></div>
    {children}
  </div>
);

const SideTitle = ({ title }) => (
  <h2 className="font-semibold uppercase text-sm mb-4 tracking-wide">
    {title}
  </h2>
);
