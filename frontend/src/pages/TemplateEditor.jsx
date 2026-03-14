import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TemplateEditor({ template }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ school: '', degree: '', field: '', year: '' }],
    projects: [{ title: '', description: '', link: '', technologies: '' }],
    certifications: [{ name: '', issuer: '', date: '' }],
    skills: ''
  })

  const [currentTab, setCurrentTab] = useState('personal')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience]
    newExperience[index][field] = value
    setFormData(prev => ({ ...prev, experience: newExperience }))
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education]
    newEducation[index][field] = value
    setFormData(prev => ({ ...prev, education: newEducation }))
  }

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { school: '', degree: '', field: '', year: '' }]
    }))
  }

  const handleDownload = () => {
    alert(`Resume created with ${template.name} template!\nThis is a demo. In production, this would generate a PDF.`)
  }

  return (
    <div className="min-h-screen bg-white text-[#1a2e52]">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-extrabold tracking-wide font-['Space_Grotesk'] hover:opacity-80 transition-opacity"
            >
              UPTO<span className="text-[#00d9ff]">SKILLS</span>
            </button>
            <div className="hidden md:block h-8 w-px bg-white/20"></div>
            <span className="hidden md:inline text-gray-400">Editing: <span className="text-[#00d9ff] font-semibold">{template?.name || 'Custom'}</span> Template</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white rounded-lg font-semibold transition-all duration-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"
          >
            <i className="fas fa-times"></i>
            Exit
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* LEFT PANEL - FORM */}
        <div className="w-full px-8 py-8 overflow-y-auto bg-white border-r border-gray-100 lg:w-1/2">
          <div className="max-w-2xl">
            {/* TAB NAVIGATION */}
            <div className="flex gap-4 pb-4 mb-8 overflow-x-auto border-b border-gray-100">
              {['personal', 'experience', 'education', 'skills'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 font-semibold whitespace-nowrap transition-all duration-300 ${
                    currentTab === tab
                      ? 'text-[#0077cc] border-b-2 border-[#0077cc]'
                      : 'text-gray-400 hover:text-[#1a2e52]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* PERSONAL INFO TAB */}
            {currentTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 text-[#1a2e52]">Personal Information</h3>
                
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-600">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-600">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-600">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-600">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-600">Professional Summary</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Brief overview of your professional background..."
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:bg-white focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {currentTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#1a2e52]">Work Experience</h3>
                  <button
                    onClick={addExperience}
                    className="px-4 py-2 bg-[#0077cc]/5 text-[#0077cc] rounded-lg border border-[#0077cc]/20 hover:bg-[#0077cc]/10 transition-all font-medium"
                  >
                    + Add Experience
                  </button>
                </div>

                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="p-6 space-y-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-600">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                        placeholder="Company name"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-600">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(idx, 'position', e.target.value)}
                          placeholder="Job title"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-600">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                          placeholder="2020 - 2024"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-600">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                        placeholder="Describe your responsibilities..."
                        rows="3"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION TAB */}
            {currentTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#1a2e52]">Education</h3>
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-[#0077cc]/5 text-[#0077cc] rounded-lg border border-[#0077cc]/20 hover:bg-[#0077cc]/10 transition-all font-medium"
                  >
                    + Add Education
                  </button>
                </div>

                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-6 space-y-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-600">School/University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                        placeholder="School name"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-600">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                          placeholder="Bachelor's"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-600">Year</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                          placeholder="2024"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-600">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(idx, 'field', e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS TAB */}
            {currentTab === 'skills' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 text-[#1a2e52]">Skills</h3>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-600">Skills (comma separated)</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="JavaScript, React, Node.js, Python, SQL..."
                    rows="8"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a2e52] placeholder-gray-400 focus:border-[#0077cc] focus:bg-white focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - PREVIEW */}
        <div className="flex-col items-center justify-start hidden px-8 pt-12 overflow-y-auto bg-gray-100 border-l border-gray-200 lg:flex lg:w-1/2">
          <div className="w-full max-w-2xl p-12 text-gray-900 bg-white rounded-lg shadow-xl">
            {/* PREVIEW HEADER */}
            <div className="pb-6 mb-6 border-b-2 border-gray-300">
              <h1 className="text-4xl font-bold text-[#1a2e52]">{formData.fullName || 'Your Name'}</h1>
              <div className="flex gap-6 mt-2 text-sm text-gray-600">
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <span>{formData.phone}</span>}
                {formData.location && <span>{formData.location}</span>}
              </div>
            </div>

            {/* PREVIEW SUMMARY */}
            {formData.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-[#1a2e52]">Professional Summary</h2>
                <p className="text-sm text-gray-700">{formData.summary}</p>
              </div>
            )}

            {/* PREVIEW EXPERIENCE */}
           {formData.experience.some(e => 
  e.company?.trim() || e.position?.trim() || e.description?.trim()
) && (
  <div className="mb-6">
    <h2 className="text-lg font-bold mb-3 text-[#1a2e52]">Experience</h2>
    {formData.experience
      .filter(exp => exp.company?.trim() || exp.position?.trim() || exp.description?.trim())
      .map((exp, idx) => (
        <div key={idx} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-semibold text-gray-800">{exp.position}</h3>
            <span className="text-sm text-gray-500">{exp.duration}</span>
          </div>
          <p className="text-sm text-[#0077cc] font-medium">{exp.company}</p>
          {exp.description && <p className="mt-1 text-sm text-gray-700">{exp.description}</p>}
        </div>
      ))}
  </div>
)}

            {/* PREVIEW EDUCATION */}
           {formData.education.some(e => 
  e.school?.trim() || e.degree?.trim() || e.field?.trim() || e.year?.trim()
) && (
  <div className="mb-6">
    <h2 className="text-lg font-bold mb-3 text-[#1a2e52]">Education</h2>
    {formData.education
      .filter(edu => edu.school?.trim() || edu.degree?.trim() || edu.field?.trim() || edu.year?.trim())
      .map((edu, idx) => (
        <div key={idx} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-semibold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
            <span className="text-sm text-gray-500">{edu.year}</span>
          </div>
          <p className="text-sm text-gray-600">{edu.school}</p>
        </div>
      ))}
  </div>
)}

{/* PREVIEW PROJECTS - Hide if no meaningful data */}
{formData.projects?.some(p => 
  p.title?.trim() || p.description?.trim() || p.link?.trim() || p.technologies?.trim()
) && (
  <div className="mb-6">
    <h2 className="text-lg font-bold mb-3 text-[#1a2e52]">Projects</h2>
    {formData.projects
      .filter(proj => proj.title?.trim() || proj.description?.trim() || proj.link?.trim())
      .map((proj, idx) => (
        <div key={idx} className="mb-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800">{proj.title}</h3>
            {proj.link && (
              <a href={proj.link} target="_blank" rel="noopener" className="text-xs text-[#0077cc] hover:underline">
                View →
              </a>
            )}
          </div>
          {proj.technologies && (
            <p className="text-xs text-gray-500 mt-1">{proj.technologies}</p>
          )}
          {proj.description && (
            <p className="mt-2 text-sm text-gray-700">{proj.description}</p>
          )}
        </div>
      ))}
  </div>
)}
{/* PREVIEW CERTIFICATIONS - Hide if no meaningful data */}
{formData.certifications?.some(c => 
  c.name?.trim() || c.issuer?.trim() || c.date?.trim()
) && (
  <div className="mb-6">
    <h2 className="text-lg font-bold mb-3 text-[#1a2e52]">Certifications</h2>
    <div className="flex flex-wrap gap-2">
      {formData.certifications
        .filter(cert => cert.name?.trim() || cert.issuer?.trim())
        .map((cert, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded border border-gray-200">
            {cert.name} {cert.issuer && `• ${cert.issuer}`} {cert.date && `• ${cert.date}`}
          </span>
        ))}
    </div>
  </div>
)}

            {/* PREVIEW SKILLS */}
            {formData.skills && (
              <div>
                <h2 className="text-lg font-bold mb-3 text-[#1a2e52]">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-[#0077cc] text-xs px-3 py-1 rounded border border-blue-100 font-medium">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-8 py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-white/10 text-white rounded-lg font-semibold hover:border-white/20 transition-all"
          >
            Save as Draft
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-lg font-bold hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <i className="fas fa-download"></i>
            Download Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default TemplateEditor