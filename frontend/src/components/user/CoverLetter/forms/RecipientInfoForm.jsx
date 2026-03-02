const RecipientInfoForm = ({ formData, onInputChange }) => {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Your Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="123 Main St, City, State ZIP"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn (optional)</label>
          <input
            type="text"
            placeholder="linkedin.com/in/johndoe"
            value={formData.linkedin}
            onChange={(e) => onInputChange('linkedin', e.target.value)}
          />
        </div>
      </div>

      <h3 className="form-section-title" style={{ marginTop: '32px' }}>Recipient Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Hiring Manager's Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={formData.recipientName}
            onChange={(e) => onInputChange('recipientName', e.target.value)}
          />
          <small className="form-hint">Leave blank to use "Hiring Manager"</small>
        </div>
        <div className="form-group">
          <label>Hiring Manager's Title</label>
          <input
            type="text"
            placeholder="HR Director"
            value={formData.recipientTitle}
            onChange={(e) => onInputChange('recipientTitle', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Company Name *</label>
          <input
            type="text"
            placeholder="Acme Corporation"
            value={formData.companyName}
            onChange={(e) => onInputChange('companyName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Company Address</label>
          <input
            type="text"
            placeholder="456 Business Ave, City, State ZIP"
            value={formData.companyAddress}
            onChange={(e) => onInputChange('companyAddress', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipientInfoForm;
