import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, FileUser, FilePen, CheckCircle, LogOut, Menu, X } from "lucide-react";
import "./UserSidebar.css";

// ── Memoized menu items (created once at module load) ──
const MENU_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
  { id: "resume", icon: FileText, label: "AI Resume Builder", path: "/user/resume-builder" },
  { id: "cv", icon: FileUser, label: "CV", path: "/user/cv" },
  { id: "coverletter", icon: FilePen, label: "Cover Letter", path: "/user/cover-letter" },
  { id: "ats", icon: CheckCircle, label: "ATS Score Checker", path: "/user/ats-checker" },
];

const UserSidebar = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // ── Track screen size for responsive behavior ──
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Memoized handlers ──
  const handleNavigate = useCallback((path) => {
    navigate(path);
    setIsMobileOpen(false);
  }, [navigate]);

  const isActive = useCallback((path) => {
    return path === "/user/dashboard" 
      ? location.pathname === "/user/dashboard" 
      : location.pathname.startsWith(path);
  }, [location.pathname]);

  // ── Memoized derived values ──
  const sidebarWidth = useMemo(() => (isCollapsed ? 80 : 256), [isCollapsed]);
  const sidebarX = useMemo(() => {
    if (isMobileOpen) return 0;
    if (isDesktop) return 0;
    return "-100%";
  }, [isMobileOpen, isDesktop]);

  return (
    <>
      {/* Toggle Buttons */}
      <div className="fixed top-4 left-4 z-[60] flex gap-2">
        <button type="button" onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2" aria-label={isMobileOpen ? "Close menu" : "Open menu"} aria-expanded={isMobileOpen}>
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button type="button" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex nav-item toggle" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!isCollapsed}>
          <div className="lines"><span className="line"></span><span className="line"></span><span className="line"></span></div>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div role="button" tabIndex={0} onClick={() => setIsMobileOpen(false)} onKeyDown={(e) => e.key === "Enter" && setIsMobileOpen(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" aria-hidden="true" />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col"
        style={{ width: sidebarWidth, height: "100vh" }}
        animate={{ x: sidebarX }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
        role="navigation"
        aria-label="Main navigation"
      >
        <nav className="p-3 space-y-2 mt-16 flex-1">
          {MENU_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <div key={item.id} className={`relative group ${index !== 0 ? "mt-[45px]" : ""}`}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  onMouseEnter={() => isCollapsed && setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center rounded-xl transition-all ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3 ${active ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={22} aria-hidden="true" />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
                {isCollapsed && hoveredItem === item.id && <div className="tooltip">{item.label}</div>}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200 mt-auto relative">
          <button
            type="button"
            onClick={() => navigate("/login")}
            onMouseEnter={() => isCollapsed && setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center rounded-xl transition-all text-red-500 hover:bg-red-50 ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3`}
            aria-label="Logout"
          >
            <LogOut size={22} aria-hidden="true" />
            {!isCollapsed && <span>Logout</span>}
          </button>
          {isCollapsed && hoveredItem === "logout" && <div className="tooltip">Logout</div>}
        </div>
      </motion.aside>

      {/* Right Panel (Content) */}
      <div className="transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <Outlet />
      </div>
    </>
  );
});

export default UserSidebar;