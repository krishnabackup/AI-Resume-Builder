
import React from 'react';
import './JessicaClaire1.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire1 = ({ data = {} }) => {  // ✅ Default prop
    const {
        fullName = "Jessica Claire",
        summary = "Highly motivated Sales Associate...",
        email = "resumesample@example.com",
        phone = "(555) 432-1000",
        location = "San Francisco, CA",
        linkedin = "",
        website = "",
        github = "",
        experience = [],
        education = [],
        skills = { technical: [], soft: [] },
        projects = [],
        certifications = [],
        extraLinks = []  // ✅ Fixed: destructured
    } = data;

    // ✅ Simplified skills logic
    const allSkills = [...(skills.technical||[]), ...(skills.soft||[])];
    const mid = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, mid);
    const skillsCol2 = allSkills.slice(mid);
    
    // ✅ Now this is actually used!
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    return (
        <div className="jessica-claire-1">
            {/* Header */}
            <div className="section firstsection">
                <div className="paragraph firstparagraph">
                    <div className="name"><span>{fullName}</span></div>
                    <div className="lowerborder"></div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="section">
                <div className="paragraph firstparagraph">
                    <div className="address">
                        <ul>
                            <li className="first">{location}</li>
                            {/* ✅ Clickable + uses helpers */}
                            {phone && <li><a href={formatTel(phone)}>{phone}</a></li>}
                            {email && <li><a href={formatMailto(email)}>{email}</a></li>}
                            
                            {/* ✅ Use formatExternalUrl helper */}
                            {linkedin && <li><a href={formatExternalUrl(linkedin)} target="_blank" rel="noopener noreferrer">{linkedin}</a></li>}
                            {website && <li><a href={formatExternalUrl(website)} target="_blank" rel="noopener noreferrer">{website}</a></li>}
                            {github && <li><a href={formatExternalUrl(github)} target="_blank" rel="noopener noreferrer">{github}</a></li>}
                            
                            {/* ✅ Use pre-filtered visibleExtraLinks */}
                            {visibleExtraLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={formatExternalUrl(link.url)} target="_blank" rel="noopener noreferrer">
                                        {link.label}: {link.url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="section">
                    <div className="heading"><div className="sectiontitle">Professional Summary</div></div>
                    <div className="paragraph firstparagraph"><p>{summary}</p></div>
                </div>
            )}

            {/* Skills */}
            {allSkills.length > 0 && (
                <div className="section">
                    <div className="heading"><div className="sectiontitle">Skills</div></div>
                    <div className="paragraph firstparagraph">
                        <table className="twocol">
                            <tbody>
                                <tr>
                                    <td className="twocol_1">
                                        <ul>{skillsCol1.map((skill, index) => <li key={`c1-${index}`}>{skill}</li>)}</ul>
                                    </td>
                                    <td className="twocol_2">
                                        <ul>{skillsCol2.map((skill, index) => <li key={`c2-${index}`}>{skill}</li>)}</ul>
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
                    <div className="heading"><div className="sectiontitle">Work History</div></div>
                    {experience.map((job) => (
                        <div key={job.id} className="paragraph">
                            <div className="singlecolumn">
                                <div className="job-header">  {/* ✅ CSS class instead of inline style */}
                                    <span className="paddedline inline">
                                        <span className="jobtitle">{job.title}</span>
                                        {job.title && <span>, </span>}
                                    </span>
                                    <span className="paddedline inline">
                                        <span className="jobdates">{job.startDate} to {job.endDate || "Current"}</span>
                                    </span>
                                </div>
                                <div className="paddedline">
                                    <span className="companyname">{job.company}</span>
                                    {job.company && job.location && <span> – </span>}
                                    <span className="joblocation">{job.location}</span>
                                </div>
                                <div className="jobline mt-5"><p>{job.description}</p></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="section">
                    <div className="heading"><div className="sectiontitle">Projects</div></div>
                    {projects.map((proj) => (
                        <div key={proj.id} className="paragraph">
                            <div className="singlecolumn">
                                <span className="paddedline"><span className="jobtitle">{proj.name}</span></span>
                                <span className="paddedline project-tech">{proj.technologies}</span>  {/* ✅ CSS class */}
                                <div className="jobline mt-5"><p>{proj.description}</p></div>
                                <div className="project-links">  {/* ✅ CSS class */}
                                    {proj.link?.liveLink && (
                                        <span className="link-item">
                                            Live: <a href={formatExternalUrl(proj.link.liveLink)} target="_blank" rel="noopener noreferrer">{proj.link.liveLink}</a>
                                        </span>
                                    )}
                                    {proj.link?.github && (
                                        <span className="link-item">
                                            GitHub: <a href={formatExternalUrl(proj.link.github)} target="_blank" rel="noopener noreferrer">{proj.link.github}</a>
                                        </span>
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
                    <div className="heading"><div className="sectiontitle">Certifications</div></div>
                    {certifications.map((cert) => (
                        <div key={cert.id} className="paragraph">
                            <div className="singlecolumn">
                                <span className="paddedline"><span className="jobtitle">{cert.name}</span></span>
                                <span className="paddedline"><span>{cert.issuer}</span> - <span>{cert.date}</span></span>
                                {cert.link && (
                                    <span className="paddedline">
                                        <a href={formatExternalUrl(cert.link)} target="_blank" rel="noopener noreferrer">View Credential</a>
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
                    <div className="heading"><div className="sectiontitle">Education</div></div>
                    {education.map((edu) => (
                        <div key={edu.id} className="paragraph">
                            <div className="singlecolumn">
                                <span className="paddedline">
                                    <span className="degree">{edu.degree}</span>
                                    {edu.school && <span>: </span>}
                                    <span>{edu.school}</span>
                                    {edu.graduationDate && <span>, {edu.graduationDate}</span>}
                                </span>
                                <span className="paddedline"><span>{edu.location}</span></span>
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