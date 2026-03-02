import React from "react";

const Eclipse = ({ formData }) => {
  if (!formData) return null;

  const {
    fullName,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education,
  } = formData;

  return (
    <div className="bg-[#e9e9e9] p-10 flex justify-center">
      <div className="bg-white w-[900px] shadow-lg relative font-serif">

        {/* Header Box */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-100 border border-gray-600 px-12 py-4 text-center">
          <h1 className="text-xl tracking-wide font-bold uppercase">
            {fullName}
          </h1>
          {formData.title && (
            <p className="text-sm tracking-widest mt-1">{formData.title}</p>
          )}
        </div>

        <div className="grid grid-cols-3 pt-16">

          {/* LEFT SIDEBAR */}
          <div className="bg-gray-100 p-6 text-sm">

            {/* DETAILS */}
            <SectionTitle title="DETAILS" />
            {location && (
              <InfoBlock label="ADDRESS" value={location} />
            )}
            {phone && (
              <InfoBlock label="PHONE" value={phone} />
            )}
            {email && (
              <InfoBlock label="EMAIL" value={email} />
            )}

            {/* SKILLS */}
            {skills && (
              <>
                <SectionTitle title="SKILLS" />
                <ul className="space-y-1">
                  {[
                    ...(skills.technical || []),
                    ...(skills.soft || [])
                  ].map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="col-span-2 p-8 text-sm">

            {/* SUMMARY */}
            {summary && (
              <>
                <SectionTitle title="SUMMARY" />
                <p className="leading-relaxed">{summary}</p>
              </>
            )}

            {/* EXPERIENCE */}
            {experience?.length > 0 && (
              <>
                <SectionTitle title="EXPERIENCE" />

                {experience.map((job, i) => (
                  <div key={job.id || i} className="mb-6">

                    <div className="flex justify-between font-semibold">
                      <span>
                        {job.title}, {job.company}
                      </span>
                      <span className="font-normal">
                        {job.location}
                      </span>
                    </div>

                    <p className="italic text-xs mb-2">
                      {job.startDate} – {job.endDate}
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
              </>
            )}

            {/* EDUCATION */}
            {education?.length > 0 && (
              <>
                <SectionTitle title="EDUCATION" />

                {education.map((edu, i) => (
                  <div key={edu.id || i} className="flex justify-between">

                    <div>
                      <p className="font-semibold">
                        {edu.school}, {edu.degree}
                      </p>
                      <p className="text-xs">
                        {edu.graduationDate}
                      </p>
                    </div>

                    <span>{edu.location}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eclipse;

/* ---------- SMALL COMPONENTS ---------- */

const SectionTitle = ({ title }) => (
  <div className="mt-6 mb-3">
    <h2 className="font-bold tracking-wide">{title}</h2>
    <div className="border-b border-gray-400 mt-1"></div>
  </div>
);

const InfoBlock = ({ label, value }) => (
  <div className="mb-3">
    <p className="font-semibold">{label}</p>
    <p>{value}</p>
  </div>
);
