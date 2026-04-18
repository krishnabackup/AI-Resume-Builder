import React from 'react';
import { Menu, X } from 'lucide-react';

const SidebarToggle = React.memo(({ 
  isMobileOpen, 
  isCollapsed, 
  isMobile, 
  onToggleMobile, 
  onToggleCollapsed 
}) => {
  return (
    <div className="sidebar-toggle-container">
      {/* Mobile menu toggle */}
      <button
        onClick={onToggleMobile}
        className={`sidebar-toggle mobile ${isMobileOpen ? 'open' : ''}`}
        aria-label={isMobileOpen ? 'Close mobile menu' : 'Open mobile menu'}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Desktop collapse toggle */}
      {!isMobile && (
        <button
          onClick={onToggleCollapsed}
          className={`sidebar-toggle desktop ${isCollapsed ? 'collapsed' : ''}`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} />
        </button>
      )}
    </div>
  );
});

SidebarToggle.displayName = 'SidebarToggle';

export default SidebarToggle;
