import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  FileUser,
  FilePen,
  CheckCircle,
  FileStack,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import "./UserSidebar.css";

export default function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/user/dashboard",
    },
    {
      id: "resume",
      icon: FileText,
      label: "AI Resume Builder",
      path: "/user/resume-builder",
    },
    { id: "cv", icon: FileUser, label: "CV", path: "/user/cv" },
    {
      id: "coverletter",
      icon: FilePen,
      label: "Cover Letter",
      path: "/user/cover-letter",
    },
    {
      id: "ats",
      icon: CheckCircle,
      label: "ATS Score Checker",
      path: "/user/ats-checker",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Toggle Buttons */}
      <div className="fixed top-4 left-4 z-[60] flex gap-2">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2"
        >
          {isMobileOpen ? <X /> : <Menu />}
        </button>
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex nav-item toggle"
        >
          <div className="lines">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
          {!isCollapsed && <span className="nav-label"></span>} {/* optional */}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col"
        style={{ width: isCollapsed ? 80 : 256, height: "100vh" }}
        animate={{ x: isMobileOpen || window.innerWidth >= 768 ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 220, damping: 25 }}
      >
        <nav className="p-3 space-y-2 mt-16 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active =
              item.path === "/user/dashboard"
                ? location.pathname === "/user/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <div
                key={item.id}
                className={`relative group ${index !== 0 ? "mt-[45px]" : ""}`}
              >
                <button
                  onClick={() => handleNavigate(item.path)}
                  onMouseEnter={() => isCollapsed && setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center rounded-xl transition-all
                    ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3
                    ${active ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <Icon size={22} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </button>
                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.id && (
                  <div className="tooltip">{item.label}</div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200 mt-auto relative">
          <button
            onClick={() => navigate("/login")}
            onMouseEnter={() => isCollapsed && setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center rounded-xl transition-all text-red-500 hover:bg-red-50
              ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"} py-3`}
          >
            <LogOut size={22} />
            {!isCollapsed && <span>Logout</span>}
          </button>
          {/* Tooltip for logout in collapsed state */}
          {isCollapsed && hoveredItem === "logout" && (
            <div className="tooltip">Logout</div>
          )}
        </div>
      </motion.aside>

      {/* Right Panel (Navbar + Content) */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? 80 : 256 }}
      >
        <Outlet />
      </div>
    </>
  );
}
