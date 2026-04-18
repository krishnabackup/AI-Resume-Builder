import './TemplateFilters.css';

const TemplateFilters = ({
  professions,
  selectedProfession,
  onProfessionChange,
  jobRoles,
  selectedJobRole,
  onJobRoleChange,
  onClearFilters,
  activeFiltersCount
}) => {
  return (
    <div className="template-filters">
      <div className="filters-header">
        <h3>Filter Templates</h3>
        {activeFiltersCount > 0 && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear all
          </button>
        )}
      </div>

      <div className="filters-content">
        <div className="filter-group">
          <label className="filter-label">
            <span className="label-icon">💼</span>
            Profession
          </label>
          <div className="filter-options profession-options">
            {professions.map(profession => (
              <button
                key={profession.id}
                className={`filter-chip ${selectedProfession === profession.id ? 'active' : ''}`}
                onClick={() => onProfessionChange(profession.id)}
              >
                <span className="chip-icon">{profession.icon}</span>
                {profession.label}
              </button>
            ))}
          </div>
        </div>

        {selectedProfession !== 'all' && (
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">👤</span>
              Job Role
            </label>
            <div className="filter-options job-role-options">
              {jobRoles.map(role => (
                <button
                  key={role.id}
                  className={`filter-chip role-chip ${selectedJobRole === role.id ? 'active' : ''}`}
                  onClick={() => onJobRoleChange(role.id)}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateFilters;