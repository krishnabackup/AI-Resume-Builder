
import React from 'react';
import './JessicaClaire3.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire3 = ({ data = {} }) => {  // ✅ Default prop
    const {
        fullName = "Jessica Claire",
        summary = "Highly motivated Sales Associate...",
        email = "resumesample@example.com",
        phone = "(555) 432-1000",
        location = "San Francisco, CA",
        linkedin = "",
        website = "",
        github = "",  // ✅ Now used consistently (was data?.github)
        experience = [],
        education = [],
        skills = { technical: [], soft: [] },
        projects = [],
        certifications = [],
        extraLinks = [],
    } = data;

    // ✅ Simplified initials logic
    const [firstInitial, lastInitial] = fullName.trim().split(/\s+/).map(n => n[0]).filter(Boolean);
    
    // ✅ Simplified skills logic
    const allSkills = [...(skills.technical||[]), ...(skills.soft||[])];
    const mid = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, mid);
    const skillsCol2 = allSkills.slice(mid);
    
    // ✅ Now actually used!
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    return (
        <div className="jessica-claire-3">
            {/* Header Section */}
            <div className="topsection">
                <div className="section nameSec">
                    <div className="monogram">
                        <div className="svgTxt">
                            <span>{firstInitial || "J"}</span>
                            <span>{lastInitial || "C"}</span>
                        </div>
                        <svg className="monogram-bg" width="57" height="83" viewBox="0 0 57 83">
                            <path fill="#103F84" d="M0 0h57v83H0z"/>
                        </svg>
                    </div>
                    <div className="name"><span>{fullName}</span></div>
                </div>
                
                <div className="section cntcSec">
                    <div className="address">
                        <ul>
                            {location && <li>{location}</li>}
                            {/* ✅ Clickable + accessible */}
                            {phone && <li><a href={formatTel(phone)}>{phone}</a></li>}
                            {email && <li><a href={formatMailto(email)}>{email}</a></li>}
                            
                            {/* ✅ Use helper for URL normalization */}
                            {linkedin && <li><a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">{linkedin}</a></li>}
                            {website && <li><a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">{website}</a></li>}
                            {github && <li><a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">{github}</a></li>}
                            
                            {/* ✅ Use pre-filtered visibleExtraLinks */}
                            {visibleExtraLinks.map((link, index) => (
                                <li key={`ext-${index}`}>
                                    <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                        {link.label}: {link.url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="parentContainer">
                {/* Left Box: Summary, Education */}
                <div className="left-box">
                    {summary && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Professional Summary</div></div>
                            <div className="paragraph"><div className="singlecolumn"><p>{summary}</p></div></div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Education</div></div>
                            {education.map((edu, index) => (
                                <div key={`edu-${index}`} className="paragraph">
                                    <div className="singlecolumn">
                                        {/* ✅ Fixed: no duplicate school */}
                                        <span className="dispBlk">
                                            <span className="txtBold">{edu.degree}</span>
                                            {edu.school && <><span>: </span><span>{edu.school}</span></>}
                                            {edu.graduationDate && <><span>, </span><span>{edu.graduationDate}</span></>}
                                        </span>
                                        {edu.location && <span className="dispBlk">{edu.location}</span>}
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

                {/* Right Box: Skills, Work History, Projects */}
                <div className="right-box">
                    {allSkills.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Skills</div></div>
                            <div className="paragraph">
                                <div className="singlecolumn maincolumn">
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
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Work History</div></div>
                            {experience.map((job, index) => (
                                <div key={`exp-${index}`} className="paragraph">
                                    <div className="singlecolumn">
                                        <span className="dispBlk">
                                            <span className="txtBold">{job.title}</span>
                                            {job.title && <span>, </span>}
                                            <span>{job.startDate} to {job.endDate || "Current"}</span>
                                        </span>
                                        <span className="dispBlk">
                                            <span className="txtBold">{job.company}</span>
                                            {job.company && job.location && <span> - </span>}
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
                </div>
            </div>
        </div>
    );
};

export default JessicaClaire3;