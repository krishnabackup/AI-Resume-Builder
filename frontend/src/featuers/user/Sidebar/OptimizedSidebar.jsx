import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { useUserNotifications } from '../../../context/UserNotificationContext';
import { useSidebar } from '../../../hooks/useSidebar';
import { sidebarMenuItems, sidebarConfig } from '../../../config/sidebarConfig';
import SidebarItem from './components/SidebarItem';
import SidebarToggle from './components/SidebarToggle';
import LogoutButton from './components/LogoutButton';
import './Sidebar.css';

const OptimizedSidebar = () => {
  const {
    isMobileOpen,
    isCollapsed,
    isMobile,
    hoveredItem,
    handleNavigate,
    toggleMobileSidebar,
    toggleCollapsed,
    closeMobileSidebar,
    handleLogout,
    handleItemHover,
    handleItemLeave,
    isRouteActive,
  } = useSidebar();

  const { unreadCount } = useUserNotifications();

  // Enhanced menu items with dynamic badges
  const enhancedMenuItems = useCallback(() => {
    return sidebarMenuItems.map(item => ({
      ...item,
      badge: item.id === 'notifications' && unreadCount > 0 ? unreadCount : null,
    }));
  }, [unreadCount]);

  // Calculate sidebar width based on state
  const sidebarWidth = isCollapsed ? sidebarConfig.collapsedWidth : sidebarConfig.expandedWidth;

  return (
    <>
      {/* Toggle Buttons */}
      <SidebarToggle
        isMobileOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        onToggleMobile={toggleMobileSidebar}
        onToggleCollapsed={toggleCollapsed}
      />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="sidebar-overlay visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="sidebar"
        style={{ height: '100vh' }}
        animate={{
          x: (isMobileOpen || !isMobile) ? 0 : '-100%',
          width: sidebarWidth,
        }}
        transition={{ 
          duration: sidebarConfig.animationDuration / 1000, 
          ease: 'linear' 
        }}
      >
        {/* Navigation */}
        <nav className="sidebar-nav">
          {enhancedMenuItems().map((item, index) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={isRouteActive(item.path)}
              isCollapsed={isCollapsed}
              isHovered={hoveredItem === item.id}
              onNavigate={handleNavigate}
              onHover={handleItemHover}
              onLeave={handleItemLeave}
              badgeCount={item.badge}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <LogoutButton
          isCollapsed={isCollapsed}
          isHovered={hoveredItem === 'logout'}
          onLogout={handleLogout}
          onHover={handleItemHover}
          onLeave={handleItemLeave}
        />
      </motion.aside>

      {/* Main Content */}
      <motion.div
        className={`sidebar-content ${isCollapsed ? 'collapsed' : 'expanded'}`}
        layout
        transition={{ duration: sidebarConfig.animationDuration / 1000 }}
      >
        <Outlet />
      </motion.div>
    </>
  );
};

export default OptimizedSidebar;
