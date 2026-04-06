
import React from 'react';
import './JessicaClaire9.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire9 = ({ data }) => {
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
        <div className="jessica-claire-9">
            <div className="main-grid">

                {/* Left Box */}
                <div className="left-box">
                    <div className="name">
                        {fullName}
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
                                        <span className="jobtitle">{job.title}</span>, <span>{job.startDate} - {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="companyname">{job.company}</span>, <span>{job.location}</span>
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
                                    <span className="dispBlk jobtitle">{proj.name}</span>
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
                                    <span className="dispBlk jobtitle">{edu.degree}</span>
                                    <span className="dispBlk">{edu.subject}</span>
                                    <span className="dispBlk companyname">{edu.school}</span>
                                    <span className="dispBlk">{edu.location}, {edu.graduationDate}</span>
                                    {edu.gpa && <span className="dispBlk">GPA: {edu.gpa}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Box containing Contact Info and Skills */}
                <div className="right-box">
                    <div className="section">
                        <div className="heading">
                            {/* Optional: Add Contact Header if needed, though template often just lists it. HTML has no header for contact in right box usually? 
                        Wait, HTML has no specific header for contact section in right box, just the fields.
                        Actually, it labels them "Address:", "Phone:", "Email:".
                    */}
                        </div>
                        <div className="paragraph">
                            <div className="contact-item">
                                <span className="contact-label">Address</span>
                                <span>{location}</span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Phone</span>
                                <span><a href={formatTel(phone)} target="_blank" rel="noopener noreferrer">{phone}</a></span>
                            </div>
                            <div className="contact-item">
                                <span className="contact-label">Email</span>
                                <span><a href={formatMailto(email)} target="_blank" rel="noopener noreferrer">{email}</a></span>
                            </div>
                            {linkedin && (
                                <div className="contact-item">
                                    <span className="contact-label">LinkedIn</span>
                                    <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">Profile</a>
                                </div>
                            )}
                            {website && (
                                <div className="contact-item">
                                    <span className="contact-label">Website</span>
                                    <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">Portfolio</a>
                                </div>
                            )}
                            {github && (
                                <div className="contact-item">
                                    <span className="contact-label">GitHub</span>
                                    <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer">Profile</a>
                                </div>
                            )}
                            {extraLinks?.map((link, index) => (
                                link.label && link.url && (
                                    <div key={index} className="contact-item">
                                        <span className="contact-label">{link.label}</span>
                                        <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">{link.label}</a>
                                    </div>
                                )
                            ))}
                        </div>
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

                    {certifications.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Certifications</div>
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

export default JessicaClaire9;
