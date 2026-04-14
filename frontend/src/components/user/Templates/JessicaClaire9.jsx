
import React from 'react';
import './JessicaClaire9.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire9 = ({ data = {} }) => {  // ✅ Default prop
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
        <div className="jessica-claire-9">
            <div className="main-grid">

                {/* Left Box */}
                <div className="left-box">
                    <div className="name">{fullName}</div>

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
                                        <span className="jobtitle">{job.title}</span>
                                        {job.title && <span>, </span>}
                                        <span>{job.startDate} - {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="companyname">{job.company}</span>
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
                    )}

                    {education.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Education</div></div>
                            {education.map((edu, index) => (
                                <div key={`edu-${index}`} className="paragraph">
                                    <span className="dispBlk jobtitle">{edu.degree}</span>
                                    {edu.subject && <span className="dispBlk">{edu.subject}</span>}
                                    <span className="dispBlk companyname">{edu.school}</span>
                                    <span className="dispBlk">
                                        {edu.location}
                                        {edu.location && edu.graduationDate && <span>, </span>}
                                        {edu.graduationDate && <span>{edu.graduationDate}</span>}
                                    </span>
                                    {edu.gpa && <span className="dispBlk">GPA: {edu.gpa}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Box containing Contact Info and Skills */}
                <div className="right-box">
                    <div className="section">
                        <div className="heading"></div>
                        <div className="paragraph">
                            <div className="contact-item">
                                <span className="contact-label">Address</span>
                                <span>{location}</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Phone</span>
                                {/* ✅ Remove target="_blank" from tel: */}
                                <span><a href={formatTel(phone)}>{phone}</a></span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Email</span>
                                {/* ✅ Remove target="_blank" from mailto: */}
                                <span><a href={formatMailto(email)}>{email}</a></span>
                            </div>
                            
                            {/* ✅ Use formatExternalUrl helper */}
                            {linkedin && (
                                <div className="contact-item">
                                    <span className="contact-label">LinkedIn</span>
                                    <a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">Profile</a>
                                </div>
                            )}
                            {website && (
                                <div className="contact-item">
                                    <span className="contact-label">Website</span>
                                    <a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">Portfolio</a>
                                </div>
                            )}
                            {github && (
                                <div className="contact-item">
                                    <span className="contact-label">GitHub</span>
                                    <a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">Profile</a>
                                </div>
                            )}
                            
                            {/* ✅ Use pre-filtered visibleExtraLinks */}
                            {visibleExtraLinks.map((link, index) => (
                                <div key={`ext-${index}`} className="contact-item">
                                    <span className="contact-label">{link.label}</span>
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

                    {certifications.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Certifications</div></div>
                            {certifications.map((cert, index) => (
                                <div key={`cert-${index}`} className="paragraph">
                                    <span className="dispBlk txtBold">{cert.name}</span>
                                    <span className="dispBlk">{cert.issuer}</span>
                                    <span className="dispBlk">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default JessicaClaire9;