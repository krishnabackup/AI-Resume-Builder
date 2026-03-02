import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  Menu,
  X,
  Plus,
  IndianRupee,
  User,
  Drone,
  BarChart,
  LogOut,
  Bell,  // ← ADDED
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


const SIDEBAR_WIDTH = {
  expanded: 256,
  collapsed: 80,
};

export default function AdminSidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, notifications = [] }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ← ADDED unreadCount calculation
  const unreadCount = notifications.filter(n => n.unread).length;

  const menuItems = useMemo(
    () => [
      {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin",
      },
      {
        id: "create",
        icon: Plus,
        label: "Templates",
        path: "/admin/manage-templates",
      },
      {
        id: "subscription",
        icon: IndianRupee,
        label: "Subscription",
        path: "/admin/subscription",
      },
      { id: "users", icon: User, label: "Users", path: "/admin/users" },
     
      // ← ADDED Notifications item
      {
        id: "notifications",
        icon: Bell,
        label: "Notifications",
        path: "/admin/notifications",
      },
      {
        id: "analytics",
        icon: BarChart,
        label: "Analytics",
        path: "/admin/analytics",
      },
    ],
    []
  );

  // Navigate to page
  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setIsMobileOpen(false);
    },
    [navigate]
  );

  // Check if path is active
  const isActive = useCallback(
    (itemPath) => {
      if (itemPath === "/admin") {
        return location.pathname === "/admin";
      }
      return location.pathname.startsWith(itemPath);
    },
    [location.pathname]
  );

  return (
    <>
      {/* Desktop Hamburger Button - Only visible on desktop */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:block fixed top-3 left-4 z-[105] p-3 hover:bg-slate-50 rounded-lg transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white active:bg-white"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
      >
        <Menu size={24} className="text-slate-700" />
      </button>

      {/* Mobile menu toggle - Only visible on mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-3 left-4 z-[105] p-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white active:bg-white"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X size={24} className="text-slate-700" /> : <Menu size={24} className="text-slate-700" />}
      </button>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-[80] md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 z-[90] bg-white border-r border-slate-200 flex flex-col"
        style={{
          width: isMobile ? SIDEBAR_WIDTH.expanded : isCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
          height: "100vh",
        }}
        animate={{ x: isMobile && !isMobileOpen ? -SIDEBAR_WIDTH.expanded : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
      >
        {/* Menu */}
        <nav className={`p-3 space-y-2 mt-16 flex-1 ${isCollapsed && !isMobile ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center rounded-xl transition-all
                    ${isCollapsed && !isMobile ? "justify-center px-0" : "gap-3 px-4"} py-3
                    ${active
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                    ${item.id === 'notifications' && unreadCount > 0 ? 'relative' : ''}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={22} aria-hidden="true" />
                  {(!isCollapsed || isMobile) && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}

                  {/* ← ADDED Notification Badge */}
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <motion.div
                      className={`ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg absolute -top-2 -right-2 transform translate-x-1/2 -translate-y-1/2 ${isCollapsed && !isMobile ? 'right-1 top-1' : ''}`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.div>
                  )}
                </button>

                {/* Tooltip when collapsed - Desktop only */}
                <AnimatePresence>
                  {isCollapsed && !isMobile && hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: 5, y: "-50%" }}
                      animate={{ opacity: 1, x: 0, y: "-50%" }}
                      exit={{ opacity: 0, x: 5, y: "-50%" }}
                      className="absolute left-full ml-3 top-1/2 z-[100]"
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className="bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap relative flex items-center">
                        {item.label}
                        {/* Triangle arrow */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-200">
          <div
            className="relative"
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              onClick={() => navigate("/")}
              className={`w-full flex items-center rounded-xl transition-all text-red-500 hover:bg-red-50
                ${isCollapsed && !isMobile ? "justify-center px-0" : "gap-3 px-4"} py-3`}
              aria-label="Logout"
            >
              <LogOut size={22} aria-hidden="true" />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </button>

            {/* Tooltip when collapsed - Desktop only */}
            <AnimatePresence>
              {isCollapsed && !isMobile && hoveredItem === 'logout' && (
                <motion.div
                  initial={{ opacity: 0, x: 5, y: "-50%" }}
                  animate={{ opacity: 1, x: 0, y: "-50%" }}
                  exit={{ opacity: 0, x: 5, y: "-50%" }}
                  className="absolute left-full ml-3 top-1/2 z-[100]"
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap relative flex items-center">
                    Logout
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-slate-900" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}