import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Bell,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserNotifications } from "../../../context/UserNotificationContext";

const Notification = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markAsRead,
    deleteNotification,
    clearAll,
    markAllAsRead,
  } = useUserNotifications();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by status
    if (filter === "unread") {
      filtered = filtered.filter((n) => n.isUnread);
    } else if (filter === "important") {
      filtered = filtered.filter((n) => n.priority === "high");
    }

    // Filter by search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchLower) ||
          n.description?.toLowerCase().includes(searchLower),
      );
    }

    return filtered;
  }, [notifications, filter, searchTerm]);

  // Group by category (Today/Older)
  const groupedNotifications = useMemo(() => {
    const today = [];
    const older = [];

    filteredNotifications.forEach((notif) => {
      if (notif.category === "today") {
        today.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, older };
  }, [filteredNotifications]);

  const getTypeIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-emerald-500`} />;
      case "warning":
        return <AlertCircle className={`${iconClass} text-amber-500`} />;
      case "info":
        return <Info className={`${iconClass} text-blue-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getAvatarColor = (user) => {
    const colors = {
      System: "from-slate-500 to-gray-500",
      "AI Assistant": "from-violet-500 to-indigo-500",
      Billing: "from-amber-400 to-orange-500",
    };
    return `bg-gradient-to-r ${colors[user] || "from-gray-400 to-gray-500"}`;
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (notification.isUnread) {
      markAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate("/user/dashboard")}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 bg-clip-text text-transparent">
                My Notifications
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mark all as read
              </motion.button>
              <motion.button
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="px-4 py-2 text-sm font-semibold text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all
              </motion.button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-xs relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
              />
            </div>

            <div className="flex gap-2">
              {["all", "unread", "important"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize ${
                    filter === tab
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100/60 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-6"
            >
              <Bell className="w-16 h-16 text-gray-300" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 max-w-sm">
              {filter === "unread"
                ? "All your notifications are read!"
                : filter === "important"
                  ? "No important notifications at the moment"
                  : "We'll notify you when something important happens"}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Today Section */}
            {groupedNotifications.today.length > 0 && (
              <div className="mb-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Today
                </motion.h2>
                <div className="space-y-3">
                  {groupedNotifications.today.map((notif, index) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      index={index}
                      onDelete={() => deleteNotification(notif.id)}
                      onClick={() => handleNotificationClick(notif)}
                      getTypeIcon={getTypeIcon}
                      getAvatarColor={getAvatarColor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older Section */}
            {groupedNotifications.older.length > 0 && (
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                >
                  Earlier
                </motion.h2>
                <div className="space-y-3">
                  {groupedNotifications.older.map((notif, index) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      index={index}
                      onDelete={() => deleteNotification(notif.id)}
                      onClick={() => handleNotificationClick(notif)}
                      getTypeIcon={getTypeIcon}
                      getAvatarColor={getAvatarColor}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showModal && selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100/50 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100">
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedNotification.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedNotification.time}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedNotification.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100/50">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      Type
                    </p>
                    <p className="text-sm text-gray-700 capitalize">
                      {selectedNotification.type}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100/50">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                      From
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 ${getAvatarColor(selectedNotification.user)} rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md`}
                      >
                        {selectedNotification.user?.charAt(0)}
                      </div>
                      <p className="text-sm text-gray-700">
                        {selectedNotification.user}
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100/50">
                    <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-1">
                      Priority
                    </p>
                    <p className="text-sm text-gray-700 capitalize">
                      {selectedNotification.priority}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100/50">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <p className="text-sm text-gray-700 capitalize">
                      {selectedNotification.isUnread ? "Unread" : "Read"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100/50 flex gap-3 justify-end">
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
                <motion.button
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium text-amber-600 hover:bg-amber-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="mt-auto text-center py-4 bg-white border-t text-sm text-gray-600">
        © {new Date().getFullYear()} ResumeAI Inc. All rights reserved.
      </footer>
    </div>
  );
};

// Notification Card Component
const NotificationCard = ({
  notif,
  index,
  onDelete,
  onClick,
  getTypeIcon,
  getAvatarColor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`group p-5 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.01] ${
        notif.isUnread
          ? "bg-gradient-to-r from-yellow-50/60 to-amber-50/30 border-yellow-200/50 hover:border-yellow-300/70"
          : "bg-white border-gray-200/50 hover:border-gray-300/70"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div
          className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
            notif.isUnread
              ? "bg-white shadow-md ring-2 ring-yellow-200/50"
              : "bg-gray-100/50"
          }`}
          whileHover={{ scale: 1.08, rotate: 5 }}
        >
          {getTypeIcon(notif.type)}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3
                className={`font-bold text-sm mb-1 line-clamp-2 transition-colors ${
                  notif.isUnread ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notif.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {notif.description}
              </p>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/30">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              <span>{notif.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 ${getAvatarColor(notif.user)} rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md`}
              >
                {notif.user?.charAt(0)}
              </div>
              <span className="text-xs font-medium text-gray-600">
                {notif.user}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;
