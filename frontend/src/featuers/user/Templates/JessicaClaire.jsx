import React from 'react';
import './JessicaClaire.css';
import SocialLinks from "../CV/components/SocialLinks";
import { formatMailto, formatTel } from './socialUtils';

// Reusable URL normalizer (saves ~6 repeats)
const normalizeUrl = (url) => url && !url.startsWith('http') ? `https://${url}` : url;

const JessicaClaire = ({ data = {} }) => {
    const {
        fullName = "Jessica Claire",
        summary = "Highly motivated Sales Associate...",
        email = "resumesample@example.com",
        phone = "(555) 432-1000",
        location = "San Francisco, CA",
        linkedin = "", website = "", github = "",
        experience = [], education = [],
        skills = { technical: [], soft: [] },
        projects = [], certifications = [],
        extraLinks = []
    } = data;

    // Simple split - no useMemo to keep it minimal
    const allSkills = [...(skills.technical||[]), ...(skills.soft||[])];
    const mid = Math.ceil(allSkills.length / 2);

    return (
        <div className="jessica-claire-template">
            <div className="firstsection">
                <div className="monogram">
                    <div className="monogram-initials">
                        {fullName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                    </div>
                </div>
                <div className="name">{fullName}</div>
            </div>

            <div className='parentContainer'>
                <div className='left-box'>
                    {summary && (
                        <div className="mb-8 firstsection-left">
                            <div className="heading"><div className="sectiontitle">Professional Summary</div></div>
                            <div className="paragraph"><p>{summary}</p></div>
                        </div>
                    )}

                    {experience.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Work History</div></div>
                            {experience.map(job => (
                                <div key={job.id} className="paragraph">
                                    <div className="singlecolumn">
                                        <div style={{display:'inline-block',width:'100%'}}>
                                            <span className="paddedline txtBold">
                                                <span className="jobtitle">{job.title}</span>
                                                {job.title && <span>, </span>}
                                            </span>
                                            <span className="paddedline txtItl">
                                                <span className="jobdates">{job.startDate} to {job.endDate || "Current"}</span>
                                            </span>
                                        </div>
                                        <div className="paddedline">
                                            <span className="companyname txtBold">{job.company}</span>
                                            {job.company && job.location && <span> – </span>}
                                            <span className="joblocation txtItl">{job.location}</span>
                                        </div>
                                        <div className="jobline" style={{marginTop:'5px'}}><p>{job.description}</p></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Projects</div></div>
                            {projects.map(proj => (
                                <div key={proj.id} className="paragraph">
                                    <div className="singlecolumn">
                                        <span className="paddedline txtBold"><span className="jobtitle">{proj.name}</span></span>
                                        <span className="paddedline" style={{fontSize:'11px',fontStyle:'italic'}}>{proj.technologies}</span>
                                        <div className="jobline" style={{marginTop:'5px'}}><p>{proj.description}</p></div>
                                        <div style={{marginTop:'4px',fontSize:'11px'}}>
                                            {proj.link?.liveLink && <span style={{marginRight:'10px'}}>Live: <a href={normalizeUrl(proj.link.liveLink)} target="_blank" rel="noopener noreferrer">{proj.link.liveLink}</a></span>}
                                            {proj.link?.github && <span>GitHub: <a href={normalizeUrl(proj.link.github)} target="_blank" rel="noopener noreferrer">{proj.link.github}</a></span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {certifications.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Certifications</div></div>
                            {certifications.map(cert => (
                                <div key={cert.id} className="paragraph">
                                    <div className="singlecolumn">
                                        <span className="paddedline"><span className="jobtitle">{cert.name}</span></span>
                                        <span className="paddedline"><span>{cert.issuer}</span> - <span>{cert.date}</span></span>
                                        {cert.link && <span className="paddedline"><a href={normalizeUrl(cert.link)} target="_blank" rel="noopener noreferrer">View Credential</a></span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='right-box'>
                    <div className="mb-8">
                        <div className="paragraph">
                            <div className="address">
                                <ul>
                                    <li className="first">{location}</li>
                                    {phone && <li>{phone}</li>}
                                    {email && <li>{email}</li>}
                                    {[linkedin, website, github].filter(Boolean).map((link,i) => (
                                        <li key={i}><a href={normalizeUrl(link)} target="_blank" rel="noopener noreferrer">{link}</a></li>
                                    ))}
                                    {extraLinks.map((link, index) => (
                                        link.label && link.url && <li key={index}><a href={normalizeUrl(link.url)} target="_blank" rel="noopener noreferrer">{link.label}: {link.url}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {allSkills.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Skills</div></div>
                            <div className="paragraph firstparagraph">
                                <table className="twocol">
                                    <tbody>
                                        <tr>
                                            <td className="twocol_1"><ul>{allSkills.slice(0,mid).map((s,i)=><li key={i}>{s}</li>)}</ul></td>
                                            <td className="twocol_2"><ul>{allSkills.slice(mid).map((s,i)=><li key={i}>{s}</li>)}</ul></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div className="section">
                            <div className="heading"><div className="sectiontitle">Education</div></div>
                            {education.map(edu => (
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
            </div>
        </div>
    );
};

export default JessicaClaire;