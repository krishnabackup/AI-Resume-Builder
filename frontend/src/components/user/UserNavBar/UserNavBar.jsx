import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  UserCog,
  Shield,
  LogOut,
  Repeat,
  HelpCircle,
  CreditCard,
  Info,
  User,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UptoSkillsLogo from "../../../assets/UptoSkills.webp";
import { useUserNotifications } from "../../../context/UserNotificationContext";
import axiosInstance from "../../../api/axios";

const API = "/api";

export default function UserNavbar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const notificationPanelRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Use UserNotificationContext
  const { notifications, unreadCount, markAllAsRead } = useUserNotifications();

  // =================== USER STATE ===================
  const [user, setUser] = useState({
    name: "User",
    email: "",
    isAdmin: false,
  });

  // =================== FETCH LOGGED-IN USER ===================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/user/profile");
        if (res.data?.user) {
          setUser({
            name: res.data.user.username || "User",
            email: res.data.user.email || "",
            isAdmin: res.data.user.isAdmin || false,
          });
        }
      } catch (err) {
        console.error("User not logged in or error:", err);
      }
    };
    fetchProfile();
  }, []);

  // =================== ICON HELPERS ===================
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-4.5 h-4.5 text-amber-500" />;
      case 'info': return <Info className="w-4.5 h-4.5 text-blue-500" />;
      default: return <Info className="w-4.5 h-4.5 text-gray-500" />;
    }
  };

  const getAvatarColor = (user) => {
    const colors = {
      'System': 'from-slate-500 to-gray-500',
      'AI Assistant': 'from-violet-500 to-indigo-500',
      'Billing': 'from-amber-400 to-orange-500'
    };
    return `bg-gradient-to-r ${colors[user] || 'from-gray-400 to-gray-500'}`;
  };

  // =================== MARK ALL READ ===================
  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleToggleNotifications = () => {
    // small debug log so user can verify this code runs after reload
    // remove/log later when confirmed
    // eslint-disable-next-line no-console
    console.log('UserNavBar: notification bell clicked (slide panel handler)');
    setShowNotifications((prev) => !prev);
  };

  // =================== TIME FORMAT HELPER ===================
  const formatTimeAgo = (time) => {
    const diff = Date.now() - new Date(time).getTime();
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);

    if (min < 1) return "Just now";
    if (min < 60) return `${min}m ago`;
    if (hr < 24) return `${hr}h ago`;
    return `${day}d ago`;
  };

  // =================== CLOSE DROPDOWN ON OUTSIDE CLICK ===================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(e.target)) {
        // Only close if we're not clicking inside the panel itself
        if (notificationPanelRef.current && !notificationPanelRef.current.contains(e.target)) {
          setShowNotifications(false);
        } else if (!notificationPanelRef.current) {
          setShowNotifications(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =================== LOGOUT ===================
  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } finally {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 h-16 bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[999]">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <motion.div
            className="cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/user/dashboard")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={UptoSkillsLogo}
              alt="UptoSkills"
              className="w-44 h-11 object-contain transition-all duration-300"
            />
          </motion.div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6 relative">
          {/* Notifications Toggle Button */}
          <div className="relative" ref={notificationDropdownRef}>
            <motion.button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2.5 text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:rotate-3 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white flex-shrink-0 ring-2 ring-yellow-200"
                  animate={{ scale: [1, 1.08, 1], rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1 rounded-full hover:bg-gray-100 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-md">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50"
                >
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownItem
                    icon={<UserCog size={16} />}
                    label="Edit Profile"
                    onClick={() => { setShowUserMenu(false); navigate("/user/edit-profile"); }}
                  />
                  <DropdownItem
                    icon={<Shield size={16} />}
                    label="Password Changer"
                    onClick={() => { setShowUserMenu(false); navigate("/user/security"); }}
                  />
                  <DropdownItem
                    icon={<CreditCard size={16} />}
                    label="Plans & Billing"
                    onClick={() => { setShowUserMenu(false); navigate("/pricing"); }}
                  />
                  <DropdownItem
                    icon={<Info size={16} />}
                    label="About Us"
                    onClick={() => { setShowUserMenu(false); navigate("/about"); }}
                  />
                  <DropdownItem
                    icon={<HelpCircle size={16} />}
                    label="Help Center"
                    onClick={() => { setShowUserMenu(false); navigate("/help-center"); }}
                  />
                  {user.isAdmin && (
                    <DropdownItem
                      icon={<Repeat size={16} />}
                      label="Switch to Admin Dashboard"
                      onClick={() => { setShowUserMenu(false); navigate("/admin"); }}
                    />
                  )}
                  <div className="border-t my-1" />
                  <DropdownItem
                    icon={<LogOut size={16} />}
                    label="Logout"
                    danger
                    onClick={logout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Notifications UI - Moved outside header to avoid stacking context/clipping issues */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/10 z-[9998] backdrop-blur-[2px]"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              ref={notificationPanelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[420px] bg-white shadow-2xl z-[9999] flex flex-col overflow-hidden"
            >
              <div className="flex-shrink-0 px-6 py-5 bg-white flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-sm border border-yellow-100/40">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Notifications ({unreadCount})</h2>
                    <p className="text-xs text-gray-500">{unreadCount} unread • {notifications.length} total</p>
                  </div>
                </div>
                <button onClick={() => setShowNotifications(false)} className="p-2 text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 px-6 py-6 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="text-gray-300 mx-auto mb-3" size={32} />
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {notifications.filter(n => n.category === 'today').length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Today</h3>
                        <div className="space-y-4">
                          {notifications.filter(n => n.category === 'today').map((n, i) => (
                            <NotificationItemDropdown key={n.id} notif={n} index={i} getTypeIcon={getTypeIcon} getAvatarColor={getAvatarColor} />
                          ))}
                        </div>
                      </div>
                    )}
                    {notifications.filter(n => n.category === 'older').length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Earlier</h3>
                        <div className="space-y-4">
                          {notifications.filter(n => n.category === 'older').map((n, i) => (
                            <NotificationItemDropdown key={n.id} notif={n} index={i} getTypeIcon={getTypeIcon} getAvatarColor={getAvatarColor} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => { handleMarkAllRead(); }}
                  className="w-full text-left text-sm font-semibold text-gray-800 mb-2 py-2 px-3 rounded-lg hover:bg-white/80 transition-colors"
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => { setShowNotifications(false); navigate('/user/notifications'); }}
                  className="w-full text-left text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg"
                >
                  View all
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= NOTIFICATION ITEM DROPDOWN COMPONENT ================= */
const NotificationItemDropdown = ({ notif, index, getTypeIcon, getAvatarColor }) => (
  <motion.div
    initial={{ opacity: 0, x: 25 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className={`px-6 py-5 hover:bg-gradient-to-r hover:from-yellow-50/70 hover:to-amber-50/40 transition-all duration-300 group cursor-pointer border-b border-transparent hover:border-yellow-200/40 ${notif.isUnread ? 'bg-gradient-to-r from-yellow-50/40 to-transparent shadow-sm ring-1 ring-yellow-200/30' : ''
      }`}
    onClick={() => console.log('Notification clicked:', notif.id)}
  >
    <div className="flex items-start gap-4">
      <motion.div
        className={`flex-shrink-0 p-2.5 rounded-xl shadow-md border border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 group-hover:shadow-xl ${notif.isUnread
          ? 'bg-white shadow-yellow-100/50 ring-2 ring-yellow-200/60'
          : 'bg-white/90'
          }`}
      >
        {getTypeIcon(notif.type)}
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm leading-relaxed mb-2.5 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none ${notif.isUnread
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-900 bg-clip-text text-transparent'
          : 'text-gray-700'
          }`}>
          {notif.title}
        </p>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{notif.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Clock className="w-3.5 h-3.5 opacity-80" />
            <span>{notif.time}</span>
          </div>
          <div className={`w-6 h-6 ${getAvatarColor(notif.user)} rounded-full flex items-center justify-center text-xs font-bold shadow-lg ring-1 ring-white flex-shrink-0`}>
            {notif.user?.charAt(0) || '?'}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ================= DROPDOWN ITEM COMPONENT ================= */
const DropdownItem = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-all
      ${danger
        ? "text-amber-600 hover:bg-amber-50"
        : "text-gray-700 hover:bg-gray-100"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);