import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavBar/AdminNavBar";
import AdminSidebar from "./AdminSidebar/AdminSidebar";
import { NotificationProvider } from "../../context/NotificationContext";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <NotificationProvider>
      <AdminNavbar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <main
        className={`
          pt-16 min-h-screen bg-slate-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <Outlet />
      </main>
    </NotificationProvider>
  );
}