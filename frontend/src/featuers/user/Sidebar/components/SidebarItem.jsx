import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = React.memo(({ 
  item, 
  isActive, 
  isCollapsed, 
  isHovered, 
  onNavigate, 
  onHover, 
  onLeave,
  badgeCount = null 
}) => {
  const Icon = item.icon;
  
  const handleClick = () => {
    onNavigate(item.path);
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      onHover(item.id);
    }
  };

  const handleMouseLeave = () => {
    onLeave();
  };

  return (
    <div className="sidebar-item-wrapper">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        aria-label={item.label}
        title={isCollapsed ? item.label : ''}
      >
        <div className="sidebar-item-icon">
          <Icon size={22} />
        </div>
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              className="sidebar-item-label"
              initial={{ opacity: 0, filter: 'blur(10px)', width: 0 }}
              animate={{ opacity: 1, filter: 'blur(0px)', width: 'auto' }}
              exit={{ opacity: 0, filter: 'blur(10px)', width: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              layout
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {badgeCount && badgeCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`sidebar-badge ${isCollapsed ? 'collapsed' : ''} ${isActive ? 'active' : ''}`}
          >
            {badgeCount > 99 ? '99+' : badgeCount}
          </motion.span>
        )}
      </button>
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && isHovered && (
        <div className="sidebar-tooltip">
          {item.label}
        </div>
      )}
    </div>
  );
});

SidebarItem.displayName = 'SidebarItem';

export default SidebarItem;
