
import React from 'react';
import './JessicaClaire8.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire8 = ({ data }) => {
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

    const technicalSkills = skills?.technical || [];
    const softSkills = skills?.soft || [];
    const allSkills = [...technicalSkills, ...softSkills];
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    return (
        <div className="jessica-claire-8">
            <div className="topsection">
                <div className="name">
                    {fullName}
                </div>
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
                            <div className="paragraph">
                                <p>{summary}</p>
                            </div>
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
                                <div key={index} className="paragraph">
                                    <span className="dispBlk">
                                        <span className="txtBold">{job.title}</span>, <span>{job.startDate} to {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txtBold">{job.company}</span> - <span>{job.location}</span>
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
                                <div className="heading-inner">
                                    <span className="sectiontitle">Projects</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            {projects.map((proj, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk txtBold">{proj.name}</span>
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
                                <div className="heading-inner">
                                    <span className="sectiontitle">Education</span>
                                    <span className="heading-line"></span>
                                </div>
                            </div>
                            {education.map((edu, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk">
                                        <span className="txtBold">{edu.degree}</span>, {edu.subject}
                                    </span>
                                    <span className="dispBlk txtBold">{edu.school}</span>
                                    <span className="dispBlk">{edu.location}, {edu.graduationDate}</span>
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
                                <span className="txtBold">Phone:</span> <a href={formatTel(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                            </span>
                            <span className="adrsDetails">
                                <span className="txtBold">Email:</span> <a href={formatMailto(email)} target="_blank" rel="noopener noreferrer">{email}</a>
                            </span>
                            {linkedin && (
                                <span className="adrsDetails">
                                    <span className="txtBold">LinkedIn:</span> <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            )}
                            {website && (
                                <span className="adrsDetails">
                                    <span className="txtBold">Website:</span> <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            )}
                            {github && (
                                <span className="adrsDetails">
                                    <span className="txtBold">GitHub:</span> <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer">Link</a>
                                </span>
                            )}
                            {extraLinks?.map((link, index) => (
                                link.label && link.url && (
                                    <span key={index} className="adrsDetails">
                                        <span className="txtBold">{link.label}:</span> <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">Link</a>
                                    </span>
                                )
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
                                    {allSkills.map((skill, i) => <li key={i}>{skill}</li>)}
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
                                <div key={index} className="paragraph">
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
