import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

const LogoutButton = React.memo(({ 
  isCollapsed, 
  isHovered, 
  onLogout, 
  onHover, 
  onLeave 
}) => {
  const handleMouseEnter = () => {
    if (isCollapsed) {
      onHover('logout');
    }
  };

  const handleMouseLeave = () => {
    onLeave();
  };

  return (
    <div className="sidebar-logout-wrapper">
      <button
        onClick={onLogout}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`sidebar-logout ${isCollapsed ? 'collapsed' : ''}`}
        aria-label="Logout"
      >
        <div className="sidebar-logout-icon">
          <LogOut size={22} />
        </div>
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              className="sidebar-logout-label"
              initial={{ opacity: 0, filter: 'blur(10px)', width: 0 }}
              animate={{ opacity: 1, filter: 'blur(0px)', width: 'auto' }}
              exit={{ opacity: 0, filter: 'blur(10px)', width: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              layout
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && isHovered && (
        <div className="sidebar-tooltip special-tooltip">
          Logout
        </div>
      )}
    </div>
  );
});

LogoutButton.displayName = 'LogoutButton';

export default LogoutButton;
