import React, { useState, useEffect, useRef } from "react";
import {
  Bell, X, Menu, FileCheck, Repeat, Star, DollarSign,
  UserPlus, Shield, AlertTriangle, Download, Upload, AlertCircle, Clock,
  User, Key, LogOut, ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UptoSkillsLogo from "../../../assets/UptoSkills.webp";
import { useNotifications } from "../../../context/NotificationContext";
import axiosInstance from "../../../api/axios";

// Notification type configurations - simple, soft colors
const NOTIFICATION_TYPES = {
  template_approved: { icon: FileCheck, color: "text-blue-600", bg: "bg-blue-50", label: "Template" },
  template_submitted: { icon: Upload, color: "text-violet-600", bg: "bg-violet-50", label: "Template" },
  subscription_renewed: { icon: Repeat, color: "text-emerald-600", bg: "bg-emerald-50", label: "Subscription" },
  subscription_cancelled: { icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-100", label: "Subscription" },
  premium_activated: { icon: Star, color: "text-amber-600", bg: "bg-amber-50", label: "Premium" },
  payment_received: { icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50", label: "Payment" },
  new_user: { icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50", label: "User" },
  security_alert: { icon: Shield, color: "text-rose-600", bg: "bg-rose-50", label: "Security" },
  system_alert: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", label: "System" },
  resume_downloaded: { icon: Download, color: "text-cyan-600", bg: "bg-cyan-50", label: "Download" }
};

export default function AdminNavbar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState({
    name: "Admin User",
    role: "Admin",
    email: "",
    initials: "AU"
  });
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/user/profile");
        const user = response.data.user;

        const name = user.fullName || user.username || "Admin User";
        const initials = name
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);

        setUserData({
          name: name,
          role: user.username === "Super Admin" ? "Super Admin" : "Admin",
          email: user.email,
          initials: initials
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Use shared notification context
  const { notifications, unreadCount, markAsRead } = useNotifications();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleMarkRead = (id) => {
    markAsRead(id);
  };

  // Limit notifications to prevent scrolling (show top 5)
  const displayedNotifications = notifications.slice(0, 5);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 transition-all duration-300 left-0 pl-14 md:pl-0 ${isCollapsed ? "md:left-20" : "md:left-64"} ${showNotifications ? 'z-[110]' : 'z-[100]'}`}>
      <div className="h-full flex items-center justify-between px-4">

        {/* LEFT SECTION - Toggle + Logo */}
        <div className="flex items-center gap-4">
          {/* Toggle button removed as it is now in Sidebar */}

          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={UptoSkillsLogo}
              alt="UptoSkills"
              className="w-44 h-11 object-contain transition-all duration-300"
            />
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 md:gap-6 relative z-50">
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications((p) => !p)}
              className="relative p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:rotate-3 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white flex-shrink-0 ring-2 ring-yellow-200"
                  animate={{ scale: [1, 1.08, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/10 z-[60] backdrop-blur-[2px]"
                    onClick={() => setShowNotifications(false)}
                  />

                  {/* Sidebar */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl z-[120] flex flex-col overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex-shrink-0 px-8 py-6 bg-white flex items-center justify-between border-b border-gray-50">
                      <h2 className="text-2xl font-bold text-gray-900">Notifications ({unreadCount})</h2>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-8 py-6 overflow-y-auto">

                      {displayedNotifications.length === 0 ? (
                        <div className="text-center py-12">
                          <Bell size={32} className="text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        <>
                          {/* TODAY SECTION */}
                          {displayedNotifications.some(n => n.category === 'today') && (
                            <div className="mb-0">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Today</h3>
                              <div className="space-y-8">
                                {displayedNotifications.filter(n => n.category === 'today').map(notification => (
                                  <NotificationItem
                                    key={notification.id}
                                    data={notification}
                                    onMarkRead={handleMarkRead}
                                    onClick={() => {
                                      if (notification.isUnread) handleMarkRead(notification.id);
                                      setShowNotifications(false);
                                      navigate('/admin/notifications');
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* OLDER SECTION */}
                          {displayedNotifications.some(n => n.category === 'older') && (
                            <div className="mt-8">
                              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Older</h3>
                              <div className="space-y-8">
                                {displayedNotifications.filter(n => n.category === 'older').map(notification => (
                                  <NotificationItem
                                    key={notification.id}
                                    data={notification}
                                    onMarkRead={handleMarkRead}
                                    onClick={() => {
                                      if (notification.isUnread) handleMarkRead(notification.id);
                                      setShowNotifications(false);
                                      navigate('/admin/notifications');
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/admin/notifications');
                        }}
                        className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline py-2 transition-all"
                      >
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="group flex items-center gap-2 p-1.5 md:p-2 rounded-2xl hover:bg-slate-50 transition-all duration-300 focus:outline-none"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all font-bold">
                {userData.initials}
              </div>
              <div className="hidden md:flex flex-col items-start" style={{ minWidth: 'max-content' }}>
                <span className="text-sm font-bold text-slate-800 leading-none whitespace-nowrap" style={{ display: 'inline-block', width: 'max-content' }}>{userData.name}</span>
                <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap" style={{ display: 'inline-block', width: 'max-content' }}>{userData.role}</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`}
              />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-[280px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[120]"
                >
                  {/* Header */}
                  <div className="px-4 py-3 flex gap-3 items-center border-b">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                      {userData.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 whitespace-nowrap" style={{ display: 'inline-block', width: 'max-content' }}>{userData.name}</p>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap border border-indigo-100" style={{ display: 'inline-block', width: 'max-content' }}>
                          {userData.role}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate">{userData.email}</p>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="px-2 pb-2 space-y-0.5">
                    <DropdownItem icon={User} label="Edit Profile" onClick={() => { setShowProfile(false); navigate('/admin/profile'); }} />
                    <DropdownItem icon={Key} label="Change Password" onClick={() => { setShowProfile(false); navigate('/admin/change-password'); }} />

                    <div className="bg-slate-50 rounded-xl mt-1">
                      <DropdownItem icon={Repeat} label="Switch to User Dashboard" onClick={() => { setShowProfile(false); navigate('/user/dashboard'); }} />
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border-t px-2 py-2">
                    <DropdownItem icon={LogOut} label="Logout" variant="danger" onClick={() => { setShowProfile(false); handleLogout(); }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

// Separate component for Dropdown Items to keep main component clean
function DropdownItem({ icon: Icon, label, onClick, variant = "default" }) {
  const styles = {
    default: "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
    danger: "text-rose-500 hover:text-rose-600 hover:bg-rose-50"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${styles[variant]} group`}
    >
      <Icon size={18} className={`${variant === 'danger' ? 'text-rose-500' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`} />
      <span>{label}</span>
    </button>
  );
}

// Separate component for cleaner render
function NotificationItem({ data, onMarkRead, onClick }) {
  const typeConfig = NOTIFICATION_TYPES[data.type] || NOTIFICATION_TYPES.system_alert;
  const Icon = typeConfig.icon;

  return (
    <div
      className="flex gap-4 group p-2 -m-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={onClick}
    >
      {/* Icon Column */}
      <div className="flex-shrink-0 relative">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeConfig.bg}`}>
          <Icon size={18} className={typeConfig.color} strokeWidth={2} />
        </div>
        {data.isUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-semibold text-slate-800 leading-tight">{data.title}</h4>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-2 flex-1">
          {data.description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            {data.isUnread && (
              <button
                onClick={(e) => { e.stopPropagation(); onMarkRead(data.id); }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-all cursor-pointer"
              >
                Mark as read
              </button>
            )}
          </div>
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ml-2">
            <Clock size={10} className="text-slate-400" />
            {data.time}
          </span>
        </div>
      </div>
    </div>
  );
}