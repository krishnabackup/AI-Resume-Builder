
import React from 'react';
import './JessicaClaire7.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire7 = ({ data }) => {
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

    const firstInitial = fullName.charAt(0) || "J";

    const technicalSkills = skills?.technical || [];
    const softSkills = skills?.soft || [];
    const allSkills = [...technicalSkills, ...softSkills];
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
                                    {allSkills.map((skill, i) => <li key={i}>{skill}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                    {/* Certifications could go here too if small */}
                    {certifications.length > 0 && (
                        <div className="section" style={{ marginTop: '30px' }}>
                            <div className="heading">
                                <div className="sectiontitle">Certifications</div>
                            </div>
                            {certifications.map((cert, index) => (
                                <div key={index} className="paragraph">
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
                            <span className="name-in">
                                {fullName}
                            </span>
                        </div>
                    </div>

                    <div className="contact-section">
                        <div className="contact-item">
                            <a href={formatTel(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                        </div>
                        <div className="contact-item">
                            <a href={formatMailto(email)} target="_blank" rel="noopener noreferrer">{email}</a>
                        </div>
                        <div className="contact-item">
                            {location}
                        </div>
                        {linkedin && <div className="contact-item"><a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
                        {website && <div className="contact-item"><a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">Website</a></div>}
                        {github && <div className="contact-item"><a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
                        {extraLinks?.map((link, index) => (
                            link.label && link.url && <div key={index} className="contact-item"><a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">{link.label}</a></div>
                        ))}
                    </div>

                    {summary && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Professional Summary</div>
                            </div>
                            <div className="paragraph">
                                <p>{summary}</p>
                            </div>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Work History</div>
                            </div>
                            {experience.map((job, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk">
                                        <span>{job.startDate} - {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txt-bold">{job.title}</span>, <span className="txt-bold">{job.company}</span>, <span>{job.location}</span>
                                    </span>
                                    <div style={{ marginTop: '5px' }}>
                                        <p>{job.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Projects</div>
                            </div>
                            {projects.map((proj, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk txt-bold">{proj.name}</span>
                                    <span className="dispBlk" style={{ fontStyle: 'italic' }}>{proj.technologies}</span>
                                    <div style={{ marginTop: '5px' }}>
                                        <p>{proj.description}</p>
                                    </div>
                                    <div style={{ marginTop: '5px', fontSize: '10px' }}>
                                        {proj.link?.liveLink && <a href={proj.link.liveLink} style={{ marginRight: '10px' }}>Live</a>}
                                        {proj.link?.github && <a href={proj.link.github}>GitHub</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Education</div>
                            </div>
                            {education.map((edu, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk">{edu.graduationDate}</span>
                                    <span className="dispBlk">
                                        <span className="txt-bold">{edu.degree}</span>, {edu.subject}
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
