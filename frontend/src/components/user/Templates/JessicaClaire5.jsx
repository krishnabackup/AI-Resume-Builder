
import React from 'react';
import './JessicaClaire5.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire5 = ({ data }) => {
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
    // 2 columns implementation
    const halfSkill = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, halfSkill);
    const skillsCol2 = allSkills.slice(halfSkill);

    return (
        <div className="jessica-claire-5">
            <div className="topSection">
                <div className="cntcSec">
                    <div className="address">
                        <span>
                            {location} {location && <span>{/*Zip handled in loc*/}</span>}
                        </span>
                        {phone && (
                            <span>
                                <span className="sprtr">|</span>
                                <a href={formatTel(phone)} target="_blank" rel="noopener noreferrer">{phone}</a>
                            </span>
                        )}
                        {email && (
                            <span>
                                <span className="sprtr">|</span>
                                <a href={formatMailto(email)} target="_blank" rel="noopener noreferrer">{email}</a>
                            </span>
                        )}
                        {(linkedin || website || github || extraLinks?.length > 0) && (
                            <span>
                                <span className="sprtr">|</span>
                                {linkedin && <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                                {website && (<><span className="sprtr">|</span><a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">Website</a></>)}
                                {github && (<><span className="sprtr">|</span><a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer">GitHub</a></>)}
                                {extraLinks?.map((link, index) => (
                                    link.label && link.url && <span key={index}><span className="sprtr">|</span><a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">{link.label}</a></span>
                                ))}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="parentContainer">
                <div className="section nameSec">
                    <div className="name">
                        <span>{fullName}</span>
                    </div>
                </div>

                {summary && (
                    <div className="section">
                        <div className="heading">
                            <div className="sectiontitle">Professional Summary</div>
                        </div>
                        <div className="singlecolumn">
                            <p>{summary}</p>
                        </div>
                    </div>
                )}

                {allSkills.length > 0 && (
                    <div className="section">
                        <div className="heading">
                            <div className="sectiontitle">Skills</div>
                        </div>
                        <div className="singlecolumn">
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '50%' }}>
                                    <ul>
                                        {skillsCol1.map((skill, i) => <li key={i}>{skill}</li>)}
                                    </ul>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <ul>
                                        {skillsCol2.map((skill, i) => <li key={i}>{skill}</li>)}
                                    </ul>
                                </div>
                            </div>
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
                                <div className="singlecolumn">
                                    <span className="dispBlk">
                                        <span className="txtBold txtCaps">{job.title}</span>, <span>{job.startDate} to {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txtBold">{job.company}</span>, <span>{job.location}</span>
                                    </span>
                                    <div style={{ marginTop: '5px' }}>
                                        <p>{job.description}</p>
                                    </div>
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
                                <div className="singlecolumn">
                                    <span className="dispBlk txtBold">{proj.name}</span>
                                    <span className="dispBlk txtItl">{proj.technologies}</span>
                                    <div style={{ marginTop: '5px' }}>
                                        <p>{proj.description}</p>
                                    </div>
                                    <div style={{ marginTop: '5px', fontSize: '10px' }}>
                                        {proj.link?.liveLink && <a href={proj.link.liveLink} style={{ marginRight: '10px' }}>Live</a>}
                                        {proj.link?.github && <a href={proj.link.github}>GitHub</a>}
                                    </div>
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
                                <div className="singlecolumn">
                                    <span className="dispBlk">
                                        <span className="txtBold">{edu.school}</span>, <span>{edu.location}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txtBold">{edu.degree}</span>{edu.subject && <span>, {edu.subject}</span>}, <span>{edu.graduationDate}</span>
                                    </span>
                                    {edu.gpa && <span className="dispBlk">GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {certifications.length > 0 && (
                    <div className="section">
                        <div className="heading">
                            <div className="sectiontitle">Certifications</div>
                        </div>
                        {certifications.map((cert, index) => (
                            <div key={index} className="paragraph">
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
