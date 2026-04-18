
import React from 'react';
import './JessicaClaire7.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire7 = ({ data = {} }) => {  // ✅ Default prop
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

    const firstInitial = fullName.trim().charAt(0) || "J";

    // ✅ Simplified skills logic
    const allSkills = [...(skills.technical||[]), ...(skills.soft||[])];
    
    // ✅ Now actually used!
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    return (
        <div className="jessica-claire-7">
            <div className="main-grid">

                {/* Left Column: Skills (and decorative background) */}
                <div className="left-column">
                    <div className="svg-name">
                        <span>{firstInitial}</span>
                    </div>

                    {allSkills.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Skills</div>
                            </div>
                            <div className="paragraph">
                                <ul>
                                    {allSkills.map((skill, i) => <li key={`skill-${i}`}>{skill}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    {certifications.length > 0 && (
                        <div className="section mt-30">  {/* ✅ CSS class */}
                            <div className="heading">
                                <div className="sectiontitle">Certifications</div>
                            </div>
                            {certifications.map((cert, index) => (
                                <div key={`cert-${index}`} className="paragraph">
                                    <span className="dispBlk txt-bold">{cert.name}</span>
                                    <span className="dispBlk">{cert.issuer}</span>
                                    <span className="dispBlk">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Main Content */}
                <div className="right-column">

                    <div className="name-section">
                        <div className="name">
                            <span className="name-in">{fullName}</span>
                        </div>
                    </div>

                    <div className="contact-section">
                        <div className="contact-item">
                            {/* ✅ Remove target="_blank" from tel: links */}
                            <a href={formatTel(phone)}>{phone}</a>
                        </div>
                        <div className="contact-item">
                            {/* ✅ Remove target="_blank" from mailto: links */}
                            <a href={formatMailto(email)}>{email}</a>
                        </div>
                        <div className="contact-item">{location}</div>
                        
                        {/* ✅ Use formatExternalUrl helper */}
                        {linkedin && <div className="contact-item"><a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
                        {website && <div className="contact-item"><a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">Website</a></div>}
                        {github && <div className="contact-item"><a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
                        
                        {/* ✅ Use pre-filtered visibleExtraLinks */}
                        {visibleExtraLinks.map((link, index) => (
                            <div key={`ext-${index}`} className="contact-item">
                                <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                    {link.label}
                                </a>
                            </div>
                        ))}
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
                                    <span className="dispBlk">
                                        <span>{job.startDate} - {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txt-bold">{job.title}</span>
                                        {job.title && <span>, </span>}
                                        <span className="txt-bold">{job.company}</span>
                                        {job.company && job.location && <span>, </span>}
                                        <span>{job.location}</span>
                                    </span>
                                    <div className="mt-5"><p>{job.description}</p></div>  {/* ✅ CSS class */}
                                </div>
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Projects</div></div>
                            {projects.map((proj, index) => (
                                <div key={`proj-${index}`} className="paragraph">
                                    <span className="dispBlk txt-bold">{proj.name}</span>
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
                    )}

                    {education.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Education</div></div>
                            {education.map((edu, index) => (
                                <div key={`edu-${index}`} className="paragraph">
                                    {edu.graduationDate && <span className="dispBlk">{edu.graduationDate}</span>}
                                    <span className="dispBlk">
                                        <span className="txt-bold">{edu.degree}</span>
                                        {edu.degree && edu.subject && <span>, </span>}
                                        <span>{edu.subject}</span>
                                    </span>
                                    <span className="dispBlk txt-bold">{edu.school}</span>
                                    <span className="dispBlk">{edu.location}</span>
                                    {edu.gpa && <span className="dispBlk">GPA: {edu.gpa}</span>}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default JessicaClaire7;