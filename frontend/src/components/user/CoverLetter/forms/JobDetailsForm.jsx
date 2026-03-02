import { useState, useEffect } from 'react';

const JobDetailsForm = ({ formData, onInputChange }) => {
  const whereFoundOptions = [
    'Company Website', 'LinkedIn', 'Indeed', 'Glassdoor', 
    'Referral', 'Job Fair', 'Recruiter', 'Other'
  ];

  const [localData, setLocalData] = useState({
    jobTitle: '', jobReference: '', whereFound: '', jobDescription: ''
  });

  useEffect(() => {
    setLocalData({
      jobTitle: formData.jobTitle || '',
      jobReference: formData.jobReference || '',
      whereFound: formData.whereFound || '',
      jobDescription: formData.jobDescription || ''
    });
  }, [formData]);

  const handleChange = (field, value) => {
    const safeValue = value || '';
    setLocalData(prev => ({ ...prev, [field]: safeValue }));
    onInputChange(field, safeValue);
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Job Details</h3>
      <p className="form-description">
        Provide details about the position you're applying for.
      </p>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            placeholder="Software Engineer"
            value={localData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Job Reference Number</label>
          <input
            type="text"
            placeholder="REF-12345"
            value={localData.jobReference}
            onChange={(e) => handleChange('jobReference', e.target.value)}
          />
          <small className="form-hint">If provided in the job listing</small>
        </div>
        <div className="form-group">
          <label>Where did you find this job?</label>
          <select
            value={localData.whereFound}
            onChange={(e) => handleChange('whereFound', e.target.value)}
          >
            <option value="">Select an option</option>
            {whereFoundOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group full-width" style={{ marginTop: '24px' }}>
        <label>Job Description (Optional)</label>
        <textarea
          placeholder="Paste job description for better AI suggestions..."
          value={localData.jobDescription}
          onChange={(e) => handleChange('jobDescription', e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default JobDetailsForm;
