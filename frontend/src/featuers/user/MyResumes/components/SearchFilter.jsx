import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilter = React.memo(({ 
  filters, 
  onFilterChange, 
  totalResumes 
}) => {
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  
  const formats = ['all', 'PDF', 'Word', 'HTML'];
  
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };
  
  const handleFormatChange = (format) => {
    onFilterChange({ ...filters, format });
    setShowFormatDropdown(false);
  };

  return (
    <div className="filter-row">
      <div className="filter-input">
        <Search className="icon" size={20} />
        <input 
          type="text"
          placeholder="Search resumes..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="filter-controls">
        <div className="format-dropdown">
          <button 
            className="format-btn"
            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
          >
            <Filter size={16} />
            {filters.format === 'all' ? 'All Formats' : filters.format}
          </button>
          
          {showFormatDropdown && (
            <div className="dropdown-menu">
              {formats.map(format => (
                <button
                  key={format}
                  className={filters.format === format ? 'active' : ''}
                  onClick={() => handleFormatChange(format)}
                >
                  {format === 'all' ? 'All Formats' : format}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <span className="results-count">
          {totalResumes} resume{totalResumes !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
});

SearchFilter.displayName = 'SearchFilter';

export default SearchFilter;
