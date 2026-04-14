
import React from 'react';
import './JessicaClaire4.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire4 = ({ data = {} }) => {  // ✅ Default prop
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
        <div className="jessica-claire-4">
            <div className="parentContainer">

                {/* Left Box: Name, Summary, Experience */}
                <div className="leftBox">
                    <div className="section nameSec">
                        <div className="name"><span>{fullName}</span></div>
                    </div>

                    {summary && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Professional Summary</div></div>
                            <div className="paragraph"><p>{summary}</p></div>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Work History</div></div>
                            {experience.map((job, index) => (
                                <div key={`exp-${index}`} className="paragraph">
                                    <span className="paddedline">
                                        <span className="txtBold">{job.company}</span> - <span className="txtBold">{job.title}</span>
                                    </span>
                                    <span className="paddedline txtItl"><span>{job.location}</span></span>
                                    <span className="paddedline txtItl">
                                        <span>{job.startDate} - {job.endDate || "Current"}</span>
                                    </span>
                                    <div className="mt-12"><p>{job.description}</p></div>  {/* ✅ CSS class */}
                                </div>
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Projects</div></div>
                            {projects.map((proj, index) => (
                                <div key={`proj-${index}`} className="paragraph">
                                    <span className="paddedline txtBold">{proj.name}</span>
                                    <span className="paddedline txtItl">{proj.technologies}</span>
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
                    )}
                </div>

                {/* Right Box: Contact, Skills, Education */}
                <div className="rightBox">
                    <div className="section cntcSec">
                        <div className="address">
                            {location && <div>{location}</div>}
                            {/* ✅ Clickable + accessible */}
                            {phone && <div><a href={formatTel(phone)}>{phone}</a></div>}
                            {email && <div><a href={formatMailto(email)}>{email}</a></div>}
                            
                            {/* ✅ Use helper for URL normalization */}
                            {linkedin && <div><a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">{linkedin}</a></div>}
                            {website && <div><a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">{website}</a></div>}
                            {github && <div><a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">{github}</a></div>}
                            
                            {/* ✅ Use pre-filtered visibleExtraLinks */}
                            {visibleExtraLinks.map((link, index) => (
                                <div key={`ext-${index}`}>
                                    <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                        {link.label}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {allSkills.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Skills</div></div>
                            <div className="paragraph">
                                <ul>
                                    {allSkills.map((skill, i) => <li key={`skill-${i}`}>{skill}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Education</div></div>
                            {education.map((edu, index) => {
                                // ✅ Safer graduation year extraction
                                const gradYear = edu.graduationDate?.split('/')?.pop() || edu.graduationDate;
                                return (
                                    <div key={`edu-${index}`} className="paragraph">
                                        {gradYear && <span className="paddedline txtItl">{gradYear}</span>}
                                        <span className="paddedline txtBold">{edu.school}</span>
                                        <span className="paddedline">{edu.location}</span>
                                        <span className="paddedline mt-6">  {/* ✅ CSS class */}
                                            <span className="txtBold">{edu.degree}</span>: {edu.subject}
                                        </span>
                                        {edu.gpa && <span className="paddedline">GPA: {edu.gpa}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {certifications.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Certifications</div></div>
                            {certifications.map((cert, index) => (
                                <div key={`cert-${index}`} className="paragraph">
                                    <span className="paddedline txtBold">{cert.name}</span>
                                    <span className="paddedline">{cert.issuer}</span>
                                    <span className="paddedline txtItl">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default JessicaClaire4;