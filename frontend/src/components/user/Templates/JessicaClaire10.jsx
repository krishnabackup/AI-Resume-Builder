
import React from 'react';
import './JessicaClaire10.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire10 = ({ data = {} }) => {  // ✅ Default prop
    const {
        fullName = "Jessica Claire",
        summary = "Highly motivated Sales Associate...",
        email = "resumesample@example.com",
        phone = "(555) 432-1000",
        location = "San Francisco, CA",
        linkedin = "",
        website = "",
        github = "",
        extraLinks = [],
        experience = [],
        education = [],
        skills = { technical: [], soft: [] },
        projects = [],
        certifications = []
    } = data;

    // ✅ Simplified skills logic
    const allSkills = [...(skills.technical||[]), ...(skills.soft||[])];
    
    // ✅ Now actually used!
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    return (
        <div className="jessica-claire-10">
            <div className="header-section">
                <div className="name">{fullName}</div>
                <div className="contact-info">
                    <span>{location}</span>
                    <span>|</span>
                    {/* ✅ Remove target="_blank" from tel:/mailto: */}
                    <span><a href={formatTel(phone)}>{phone}</a></span>
                    <span>|</span>
                    <span><a href={formatMailto(email)}>{email}</a></span>
                    
                    {/* ✅ Use formatExternalUrl helper */}
                    {linkedin && (
                        <>
                            <span>|</span>
                            <a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </>
                    )}
                    {website && (
                        <>
                            <span>|</span>
                            <a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">Website</a>
                        </>
                    )}
                    {github && (
                        <>
                            <span>|</span>
                            <a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">GitHub</a>
                        </>
                    )}
                    
                    {/* ✅ Use pre-filtered visibleExtraLinks */}
                    {visibleExtraLinks.map((link, index) => (
                        <span key={`ext-${index}`}>
                            <span>|</span>
                            <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </a>
                        </span>
                    ))}
                </div>
            </div>

            <div className="content-body">

                {summary && (
                    <div className="section section-flex">
                        <div className="section-title-box"><div className="heading">Professional Summary</div></div>
                        <div className="section-content-box"><p>{summary}</p></div>
                    </div>
                )}

                {allSkills.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box"><div className="heading">Skills</div></div>
                        <div className="section-content-box">
                            <ul className="skills-grid">
                                {allSkills.map((skill, i) => <li key={`skill-${i}`}>{skill}</li>)}
                            </ul>
                        </div>
                    </div>
                )}

                {experience.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box"><div className="heading">Work History</div></div>
                        <div className="section-content-box">
                            {experience.map((job, index) => (
                                <div key={`exp-${index}`} className="paragraph">
                                    <span className="dispBlk">
                                        <span className="jobtitle">{job.title}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="jobdates">{job.startDate} to {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="companyname">{job.company}</span>
                                        {job.company && job.location && <span> - </span>}
                                        <span>{job.location}</span>
                                    </span>
                                    <div className="mt-5"><p>{job.description}</p></div>  {/* ✅ CSS class */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box"><div className="heading">Projects</div></div>
                        <div className="section-content-box">
                            {projects.map((proj, index) => (
                                <div key={`proj-${index}`} className="paragraph">
                                    <span className="dispBlk jobtitle">{proj.name}</span>
                                    <span className="dispBlk txt-italic">{proj.technologies}</span>  {/* ✅ CSS class */}
                                    <div className="mt-5"><p>{proj.description}</p></div>
                                    <div className="project-links">  {/* ✅ CSS class */}
                                        {proj.link?.liveLink && (
                                            <a href={formatExternalUrl(proj.link.liveLink)} className="link-item" target="_blank" rel="noopener noreferrer">Live</a>
                                        )}
                                        {proj.link?.github && (
                                            <a href={formatExternalUrl(proj.link.github)} className="link-item" target="_blank" rel="noopener noreferrer">GitHub</a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {education.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box"><div className="heading">Education</div></div>
                        <div className="section-content-box">
                            {education.map((edu, index) => (
                                <div key={`edu-${index}`} className="paragraph">
                                    <span className="dispBlk jobtitle">
                                        {edu.degree}
                                        {edu.degree && edu.subject && <span>: </span>}
                                        <span>{edu.subject}</span>
                                    </span>
                                    {edu.graduationDate && <span className="dispBlk jobdates">{edu.graduationDate}</span>}
                                    <span className="dispBlk companyname">{edu.school}</span>
                                    <span className="dispBlk">{edu.location}</span>
                                    {edu.gpa && <span className="dispBlk">GPA: {edu.gpa}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {certifications.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box"><div className="heading">Certifications</div></div>
                        <div className="section-content-box">
                            {certifications.map((cert, index) => (
                                <div key={`cert-${index}`} className="paragraph">
                                    <span className="dispBlk txtBold">{cert.name}</span>
                                    <span className="dispBlk">{cert.issuer}</span>
                                    <span className="dispBlk">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default JessicaClaire10;