
import React from 'react';
import './JessicaClaire5.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire5 = ({ data = {} }) => {  // ✅ Default prop
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
    const mid = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, mid);
    const skillsCol2 = allSkills.slice(mid);
    
    // ✅ Now actually used!
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    return (
        <div className="jessica-claire-5">
            <div className="topSection">
                <div className="cntcSec">
                    <div className="address">
                        <span>{location}</span>  {/* ✅ Removed empty span */}
                        
                        {phone && (
                            <span>
                                <span className="sprtr">|</span>
                                <a href={formatTel(phone)}>{phone}</a>
                            </span>
                        )}
                        {email && (
                            <span>
                                <span className="sprtr">|</span>
                                <a href={formatMailto(email)}>{email}</a>
                            </span>
                        )}
                        
                        {(linkedin || website || github || visibleExtraLinks.length > 0) && (
                            <span>
                                <span className="sprtr">|</span>
                                {/* ✅ Use formatExternalUrl helper */}
                                {linkedin && <a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                                {website && (<><span className="sprtr">|</span><a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">Website</a></>)}
                                {github && (<><span className="sprtr">|</span><a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">GitHub</a></>)}
                                
                                {/* ✅ Use pre-filtered visibleExtraLinks */}
                                {visibleExtraLinks.map((link, index) => (
                                    <span key={`ext-${index}`}>
                                        <span className="sprtr">|</span>
                                        <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                            {link.label}
                                        </a>
                                    </span>
                                ))}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="parentContainer">
                <div className="section nameSec">
                    <div className="name"><span>{fullName}</span></div>
                </div>

                {summary && (
                    <div className="section">
                        <div className="heading"><div className="sectiontitle">Professional Summary</div></div>
                        <div className="singlecolumn"><p>{summary}</p></div>
                    </div>
                )}

                {allSkills.length > 0 && (
                    <div className="section">
                        <div className="heading"><div className="sectiontitle">Skills</div></div>
                        <div className="singlecolumn">
                            <div className="skills-grid">  {/* ✅ CSS class */}
                                <div className="skills-col">
                                    <ul>{skillsCol1.map((skill, i) => <li key={`s1-${i}`}>{skill}</li>)}</ul>
                                </div>
                                <div className="skills-col">
                                    <ul>{skillsCol2.map((skill, i) => <li key={`s2-${i}`}>{skill}</li>)}</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {experience.length > 0 && (
                    <div className="section">
                        <div className="heading"><div className="sectiontitle">Work History</div></div>
                        {experience.map((job, index) => (
                            <div key={`exp-${index}`} className="paragraph">
                                <div className="singlecolumn">
                                    <span className="dispBlk">
                                        <span className="txtBold txtCaps">{job.title}</span>
                                        {job.title && <span>, </span>}
                                        <span>{job.startDate} to {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txtBold">{job.company}</span>
                                        {job.company && job.location && <span>, </span>}
                                        <span>{job.location}</span>
                                    </span>
                                    <div className="mt-5"><p>{job.description}</p></div>  {/* ✅ CSS class */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {projects.length > 0 && (
                    <div className="section">
                        <div className="heading"><div className="sectiontitle">Projects</div></div>
                        {projects.map((proj, index) => (
                            <div key={`proj-${index}`} className="paragraph">
                                <div className="singlecolumn">
                                    <span className="dispBlk txtBold">{proj.name}</span>
                                    <span className="dispBlk txtItl">{proj.technologies}</span>
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
                            </div>
                        ))}
                    </div>
                )}

                {education.length > 0 && (
                    <div className="section">
                        <div className="heading"><div className="sectiontitle">Education</div></div>
                        {education.map((edu, index) => (
                            <div key={`edu-${index}`} className="paragraph">
                                <div className="singlecolumn">
                                    <span className="dispBlk">
                                        <span className="txtBold">{edu.school}</span>
                                        {edu.school && edu.location && <span>, </span>}
                                        <span>{edu.location}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txtBold">{edu.degree}</span>
                                        {edu.degree && edu.subject && <span>, </span>}
                                        <span>{edu.subject}</span>
                                        {edu.graduationDate && <><span>, </span><span>{edu.graduationDate}</span></>}
                                    </span>
                                    {edu.gpa && <span className="dispBlk">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {certifications.length > 0 && (
                    <div className="section">
                        <div className="heading"><div className="sectiontitle">Certifications</div></div>
                        {certifications.map((cert, index) => (
                            <div key={`cert-${index}`} className="paragraph">
                                <div className="singlecolumn">
                                    <span className="dispBlk txtBold">{cert.name}</span>
                                    <span className="dispBlk">{cert.issuer}, {cert.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JessicaClaire5;