const ClosingForm = ({ formData, onInputChange }) => {
  const salutationOptions = [
    { value: 'Sincerely', label: 'Sincerely' },
    { value: 'Best regards', label: 'Best regards' },
    { value: 'Kind regards', label: 'Kind regards' },
    { value: 'Respectfully', label: 'Respectfully' },
    { value: 'Thank you', label: 'Thank you' },
    { value: 'Warm regards', label: 'Warm regards' },
    { value: 'With appreciation', label: 'With appreciation' },
    { value: 'custom', label: 'Custom...' }
  ];

  return (
    <div className="form-section">
      <h3 className="form-section-title">Closing & Signature</h3>
      <p className="form-description">
        Choose how you'd like to sign off your cover letter.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label>Salutation *</label>
          <select
            value={formData.salutation}
            onChange={(e) => onInputChange('salutation', e.target.value)}
          >
            {salutationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {formData.salutation === 'custom' && (
          <div className="form-group">
            <label>Custom Salutation</label>
            <input
              type="text"
              placeholder="Your custom closing"
              value={formData.customSalutation}
              onChange={(e) => onInputChange('customSalutation', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="signature-preview">
        <h4>Signature Preview</h4>
        <div className="signature-box">
          <p className="salutation-text">
            {formData.salutation === 'custom' ? formData.customSalutation : formData.salutation},
          </p>
          <p className="signature-name">{formData.fullName || 'Your Name'}</p>
          {formData.email && <p className="signature-detail">{formData.email}</p>}
          {formData.phone && <p className="signature-detail">{formData.phone}</p>}
          {formData.linkedin && <p className="signature-detail">{formData.linkedin}</p>}
        </div>
      </div>

      <div className="closing-tips">
        <h4>📌 Tips for a Strong Closing</h4>
        <ul>
          <li><strong>Be professional:</strong> Stick to traditional closings for formal applications</li>
          <li><strong>Match the tone:</strong> Your closing should match the overall tone of your letter</li>
          <li><strong>Include contact info:</strong> Make it easy for employers to reach you</li>
          <li><strong>Proofread:</strong> Double-check spelling of your name and contact details</li>
        </ul>
      </div>

      <div className="date-settings">
        <h4>Letter Date</h4>
        <div className="form-group">
          <label>Date to display on letter</label>
          <input
            type="date"
            value={formData.letterDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => onInputChange('letterDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ClosingForm;
