
import React from 'react';
import './JessicaClaire1.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire1 = ({ data }) => {
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
    const halfSkill = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, halfSkill);
    const skillsCol2 = allSkills.slice(halfSkill);

    return (
        <div className="jessica-claire-1">
            {/* Header */}
            <div className="section firstsection">
                <div className="paragraph firstparagraph">
                    <div className="name">
                        <span>{fullName}</span>
                    </div>
                    <div className="lowerborder"></div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="section">
                <div className="paragraph firstparagraph">
                    <div className="address">
                        <ul>
                            <li className="first">
                                {location}
                            </li>
                            {phone && <li>{phone}</li>}
                            {email && <li>{email}</li>}
                            {linkedin && <li><a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">{linkedin}</a></li>}
                            {website && <li><a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">{website}</a></li>}
                            {data?.github && <li><a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer">{data.github}</a></li>}
                            {data?.extraLinks?.map((link, index) => (
                                link.label && link.url && <li key={index}><a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">{link.label}: {link.url}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="section">
                    <div className="heading">
                        <div className="sectiontitle">Professional Summary</div>
                    </div>
                    <div className="paragraph firstparagraph">
                        <p>{summary}</p>
                    </div>
                </div>
            )}

            {/* Skills */}
            {allSkills.length > 0 && (
                <div className="section">
                    <div className="heading">
                        <div className="sectiontitle">Skills</div>
                    </div>
                    <div className="paragraph firstparagraph">
                        <table className="twocol">
                            <tbody>
                                <tr>
                                    <td className="twocol_1">
                                        <ul>
                                            {skillsCol1.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="twocol_2">
                                        <ul>
                                            {skillsCol2.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <div className="section">
                    <div className="heading">
                        <div className="sectiontitle">Work History</div>
                    </div>
                    {experience.map((job) => (
                        <div key={job.id} className="paragraph">
                            <div className="singlecolumn">
                                <div style={{ display: 'inline-block', width: '100%' }}>
                                    <span className="paddedline" style={{ display: 'inline' }}>
                                        <span className="jobtitle">{job.title}</span>
                                        {job.title && <span>, </span>}
                                    </span>
                                    <span className="paddedline" style={{ display: 'inline' }}>
                                        <span className="jobdates">
                                            {job.startDate} to {job.endDate || "Current"}
                                        </span>
                                    </span>
                                </div>
                                <div className="paddedline">
                                    <span className="companyname">{job.company}</span>
                                    {job.company && job.location && <span> – </span>}
                                    <span className="joblocation">{job.location}</span>
                                </div>
                                <div className="jobline" style={{ marginTop: '5px' }}>
                                    <p>{job.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="section">
                    <div className="heading">
                        <div className="sectiontitle">Projects</div>
                    </div>
                    {projects.map((proj) => (
                        <div key={proj.id} className="paragraph">
                            <div className="singlecolumn">
                                <span className="paddedline">
                                    <span className="jobtitle">{proj.name}</span>
                                </span>
                                <span className="paddedline" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                    {proj.technologies}
                                </span>
                                <div className="jobline" style={{ marginTop: '5px' }}>
                                    <p>{proj.description}</p>
                                </div>
                                {/* Links */}
                                <div style={{ marginTop: '4px', fontSize: '11px' }}>
                                    {proj.link?.liveLink && (
                                        <span style={{ marginRight: '10px' }}>Live: <a href={proj.link.liveLink} target="_blank" rel="noopener noreferrer">{proj.link.liveLink}</a></span>
                                    )}
                                    {proj.link?.github && (
                                        <span>GitHub: <a href={proj.link.github} target="_blank" rel="noopener noreferrer">{proj.link.github}</a></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* Certifications */}
            {certifications.length > 0 && (
                <div className="section">
                    <div className="heading">
                        <div className="sectiontitle">Certifications</div>
                    </div>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="paragraph">
                            <div className="singlecolumn">
                                <span className="paddedline">
                                    <span className="jobtitle">{cert.name}</span>
                                </span>
                                <span className="paddedline">
                                    <span>{cert.issuer}</span> - <span>{cert.date}</span>
                                </span>
                                {cert.link && (
                                    <span className="paddedline">
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer">View Credential</a>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="section">
                    <div className="heading">
                        <div className="sectiontitle">Education</div>
                    </div>
                    {education.map((edu) => (
                        <div key={edu.id} className="paragraph">
                            <div className="singlecolumn">
                                <span className="paddedline">
                                    <span className="degree">{edu.degree}</span>
                                    {edu.school && <span>: </span>}
                                    <span>{edu.school}</span>
                                    {edu.graduationDate && <span>, {edu.graduationDate}</span>}
                                </span>
                                <span className="paddedline">
                                    <span>{edu.location}</span>
                                </span>
                                {edu.gpa && <span className="paddedline">GPA: {edu.gpa}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default JessicaClaire1;
