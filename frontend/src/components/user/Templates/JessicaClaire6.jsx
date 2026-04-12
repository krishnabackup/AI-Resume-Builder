
import React from 'react';
import './JessicaClaire6.css';
import { formatExternalUrl, formatMailto, formatTel, getVisibleExtraLinks } from './socialUtils';

const JessicaClaire6 = ({ data }) => {
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

    const firstName = fullName.split(' ')[0] || "Jessica";
    const lastName = fullName.split(' ').slice(1).join(' ') || "Claire";

    const technicalSkills = skills?.technical || [];
    const softSkills = skills?.soft || [];
    const allSkills = [...technicalSkills, ...softSkills];
    const visibleExtraLinks = getVisibleExtraLinks(extraLinks);

    // 2 or 3 columns? HTML shows 3 columns structure (.padding-right 15px, width 50%?? Wait HTML skill has 2 sets of paddedline with width 50%, then a 3rd with width 30%? No. HTML shows 3 <ul> blocks in the example.)
    // Let's do 2 columns safe or 3 if space allows. The CSS says 50% width.
    const halfSkill = Math.ceil(allSkills.length / 2);
    const skillsCol1 = allSkills.slice(0, halfSkill);
    const skillsCol2 = allSkills.slice(halfSkill);

    return (
        <div className="jessica-claire-6">
            <div className="topSection">
                <div className="section name-sec">
                    <div className="name txt-bold">
                        <span>{firstName}</span> <span className="last-name">{lastName}</span>
                    </div>
                </div>

                <div className="cntc-sec">
                    <div className="address">
                        <div className="phone-box">
                            <span className="dispInBlk"><a href={formatTel(phone)} target="_blank" rel="noopener noreferrer">{phone}</a></span>
                        </div>
                        <div className="address-box">
                            <span>{location}</span>
                        </div>
                        <div className="email-box">
                            <span>{email}</span>
                            {linkedin && <div style={{ marginTop: '2px' }}><a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
                            {website && <div style={{ marginTop: '2px' }}><a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">Website</a></div>}
                            {github && <div style={{ marginTop: '2px' }}><a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
                            {extraLinks?.map((link, index) => (
                                link.label && link.url && <div key={index} style={{ marginTop: '2px' }}><a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noopener noreferrer">{link.label}</a></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="parent-container">
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
                                <div style={{ width: '50%', paddingRight: '15px' }}>
                                    <ul>{skillsCol1.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <ul>{skillsCol2.map((s, i) => <li key={i}>{s}</li>)}</ul>
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
                                        <span className="txt-bold txt-caps">{job.title}</span>, <span>{job.startDate} - {job.endDate || "Current"}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txt-bold">{job.company}</span>, <span>{job.location}</span>
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
                            </div>
                        ))}
                    </div>
                )}

                {education && education.length > 0 && (
                    <div className="section">
                        <div className="heading">
                            <div className="sectiontitle">Education</div>
                        </div>
                        {education.map((edu, index) => (
                            <div key={index} className="paragraph">
                                <div className="singlecolumn">
                                    <span className="dispBlk">
                                        <span className="txt-bold">{edu.degree}</span>: <span>{edu.subject}</span>
                                    </span>
                                    <span className="dispBlk">
                                        <span className="txt-bold">{edu.school}</span> - <span>{edu.location}</span>
                                    </span>
                                    <span className="dispBlk">{edu.graduationDate}</span>
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
                                    <span className="dispBlk txt-bold">{cert.name}</span>
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

export default JessicaClaire6;
