
import React from 'react';
import './JessicaClaire8.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire8 = ({ data = {} }) => {  // ✅ Default prop
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
        <div className="jessica-claire-8">
            <div className="topsection">
                <div className="name">{fullName}</div>
            </div>

            <div className="parentContainer">
                {/* Left Box: Summary, Work History, Education */}
                <div className="left-box">
                    {summary && (
                        <div className="section">
                            <div className="heading">
                                <div className="heading-inner">
                                    <span className="sectiontitle">Professional Summary</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            <div className="paragraph"><p>{summary}</p></div>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="heading-inner">
                                    <span className="sectiontitle">Work History</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            {experience.map((job, index) => (
                                <div key={`exp-${index}`} className="paragraph">
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
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="heading-inner">
                                    <span className="sectiontitle">Projects</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            {projects.map((proj, index) => (
                                <div key={`proj-${index}`} className="paragraph">
                                    <span className="dispBlk txtBold">{proj.name}</span>
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
                            <div className="heading">
                                <div className="heading-inner">
                                    <span className="sectiontitle">Education</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            {education.map((edu, index) => (
                                <div key={`edu-${index}`} className="paragraph">
                                    <span className="dispBlk">
                                        <span className="txtBold">{edu.degree}</span>
                                        {edu.degree && edu.subject && <span>, </span>}
                                        <span>{edu.subject}</span>
                                    </span>
                                    <span className="dispBlk txtBold">{edu.school}</span>
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

                {/* Right Box: Contact, Skills */}
                <div className="right-box">
                    <div className="section">
                        <div className="heading">
                            <div className="heading-inner">
                                <span className="sectiontitle">Contact</span>
                                <span className="heading-line"></span>
                            </div>
                        </div>
                        <div className="address">
                            <span className="adrsDetails">
                                <span className="txtBold">Address:</span> {location}
                            </span>
                            <span className="adrsDetails">
                                <span className="txtBold">Phone:</span>{' '}
                                {/* ✅ Remove target="_blank" from tel: */}
                                <a href={formatTel(phone)}>{phone}</a>
                            </span>
                            <span className="adrsDetails">
                                <span className="txtBold">Email:</span>{' '}
                                {/* ✅ Remove target="_blank" from mailto: */}
                                <a href={formatMailto(email)}>{email}</a>
                            </span>
                            
                            {/* ✅ Use formatExternalUrl helper */}
                            {linkedin && (
                                <span className="adrsDetails">
                                    <span className="txtBold">LinkedIn:</span>{' '}
                                    <a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            )}
                            {website && (
                                <span className="adrsDetails">
                                    <span className="txtBold">Website:</span>{' '}
                                    <a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            )}
                            {github && (
                                <span className="adrsDetails">
                                    <span className="txtBold">GitHub:</span>{' '}
                                    <a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            )}
                            
                            {/* ✅ Use pre-filtered visibleExtraLinks */}
                            {visibleExtraLinks.map((link, index) => (
                                <span key={`ext-${index}`} className="adrsDetails">
                                    <span className="txtBold">{link.label}:</span>{' '}
                                    <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            ))}
                        </div>
                    </div>

                    {allSkills.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="heading-inner">
                                    <span className="sectiontitle">Skills</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            <div className="paragraph">
                                <ul>
                                    {allSkills.map((skill, i) => <li key={`skill-${i}`}>{skill}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    {certifications.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="heading-inner">
                                    <span className="sectiontitle">Certifications</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
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

export default JessicaClaire8;