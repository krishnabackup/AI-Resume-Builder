
import React from 'react';
import './JessicaClaire3.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire3 = ({ data }) => {
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
        certifications = []
    } = data;

    const firstName = fullName.split(' ')[0] || "J";
    const lastName = fullName.split(' ')[1] || "C";
    const firstInitial = firstName[0];
    const lastInitial = lastName[0];

    const technicalSkills = skills?.technical || [];
    const softSkills = skills?.soft || [];
    const allSkills = [...technicalSkills, ...softSkills];
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);
    // Split skills for 2 columns if needed, but this template seems to put them in one block or simple list
    // The original HTML uses two columns for skills within the right box.
    const halfSkill = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, halfSkill);
    const skillsCol2 = allSkills.slice(halfSkill);


    return (
        <div className="jessica-claire-3">
            {/* Header Section */}
            <div className="topsection">
                <div className="section nameSec">
                    <div className="monogram">
                        <div className="svgTxt">
                            <span>{firstInitial}</span>
                            <span>{lastInitial}</span>
                        </div>
                        {/* SVG Decoration */}
                        <svg width="57px" height="83px" viewBox="0 0 57 83" style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
                            <path fill="#103F84" d="M0 0h57v83H0z"></path>
                            {/* Decorative lines could be added here if critical, skipping for simplicity/cleanliness */}
                        </svg>
                    </div>
                    <div className="name">
                        <span>{fullName}</span>
                    </div>
                </div>
                <div className="section cntcSec">
                    <div className="address">
                        <ul>
                            {location && <li>{location}</li>}
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

            <div className="parentContainer">
                {/* Left Box: Summary, Education */}
                <div className="left-box">
                    {summary && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Professional Summary</div>
                            </div>
                            <div className="paragraph">
                                <div className="singlecolumn">
                                    <p>{summary}</p>
                                </div>
                            </div>
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
                                            <span className="txtBold">{edu.degree}</span>: <span>{edu.school}</span>
                                            {edu.graduationDate && <span>, {edu.graduationDate}</span>}
                                        </span>
                                        <span className="dispBlk">
                                            <span>{edu.school}</span>
                                            {edu.location && <span> - {edu.location}</span>}
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

                {/* Right Box: Skills, Work History, Projects */}
                <div className="right-box">
                    {allSkills.length > 0 && (
                        <div className="section">
                            <div className="heading">
                                <div className="sectiontitle">Skills</div>
                            </div>
                            <div className="paragraph">
                                <div className="singlecolumn maincolumn">
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
                                            <span className="txtBold">{job.title}</span>, <span>{job.startDate} to {job.endDate || "Current"}</span>
                                        </span>
                                        <span className="dispBlk">
                                            <span className="txtBold">{job.company}</span> - <span>{job.location}</span>
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
                                        <div style={{ fontSize: '10px' }}>
                                            {proj.link?.liveLink && <a href={proj.link.liveLink} style={{ marginRight: '10px' }}>Live</a>}
                                            {proj.link?.github && <a href={proj.link.github}>GitHub</a>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JessicaClaire3;
