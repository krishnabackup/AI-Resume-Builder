
import React from 'react';
import './JessicaClaire10.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire10 = ({ data }) => {
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
        <div className="jessica-claire-10">
            <div className="header-section">
                <div className="name">{fullName}</div>
                <div className="contact-info">
                    <span>{location}</span>
                    <span>|</span>
                    <span><a href={formatTel(phone)} target="_blank" rel="noopener noreferrer">{phone}</a></span>
                    <span>|</span>
                    <span><a href={formatMailto(email)} target="_blank" rel="noopener noreferrer">{email}</a></span>
                    {linkedin && (
                        <>
                            <span>|</span>
                            <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </>
                    )}
                    {website && (
                        <>
                            <span>|</span>
                            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">Website</a>
                        </>
                    )}
                    {github && (
                        <>
                            <span>|</span>
                            <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer">GitHub</a>
                        </>
                    )}
                    {extraLinks?.map((link, index) => (
                        link.label && link.url && (
                            <span key={index}>
                                <span>|</span>
                                <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">{link.label}</a>
                            </span>
                        )
                    ))}
                </div>
            </div>

            <div className="content-body">

                {summary && (
                    <div className="section section-flex">
                        <div className="section-title-box">
                            <div className="heading">Professional Summary</div>
                        </div>
                        <div className="section-content-box">
                            <p>{summary}</p>
                        </div>
                    </div>
                )}

                {allSkills.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box">
                            <div className="heading">Skills</div>
                        </div>
                        <div className="section-content-box">
                            <ul className="skills-grid">
                                {allSkills.map((skill, i) => <li key={i}>{skill}</li>)}
                            </ul>
                        </div>
                    </div>
                )}

                {experience.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box">
                            <div className="heading">Work History</div>
                        </div>
                        <div className="section-content-box">
                            {experience.map((job, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk">
                                        <span className="jobtitle">{job.title}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="jobdates">{job.startDate} to {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="companyname">{job.company}</span> - <span>{job.location}</span>
                                    </span>
                                    <div style={{ marginTop: '5px' }}>
                                        <p>{job.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box">
                            <div className="heading">Projects</div>
                        </div>
                        <div className="section-content-box">
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
                    </div>
                )}

                {education.length > 0 && (
                    <div className="section section-flex">
                        <div className="section-title-box">
                            <div className="heading">Education</div>
                        </div>
                        <div className="section-content-box">
                            {education.map((edu, index) => (
                                <div key={index} className="paragraph">
                                    <span className="dispBlk jobtitle">{edu.degree}: {edu.subject}</span>
                                    <span className="dispBlk jobdates">{edu.graduationDate}</span>
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
                        <div className="section-title-box">
                            <div className="heading">Certifications</div>
                        </div>
                        <div className="section-content-box">
                            {certifications.map((cert, index) => (
                                <div key={index} className="paragraph">
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
