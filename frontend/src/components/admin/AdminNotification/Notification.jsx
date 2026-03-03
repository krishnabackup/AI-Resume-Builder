import React, { useState } from 'react';
import {
    Bell,
    CheckCircle2,
    Trash2,
    FileCheck,
    Repeat,
    Star,
    DollarSign,
    UserPlus,
    Shield,
    AlertTriangle,
    Download,
    Upload,
    AlertCircle,
    Clock,
    Search,
    X,
    User,
    Calendar,
    Tag
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNotifications } from '../../../context/NotificationContext';

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

const AdminNotification = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Use shared notification context
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

    const handleMarkRead = (id) => {
        markAsRead(id);
    };

    const handleDelete = (id) => {
        deleteNotification(id);
        toast.success("Notification removed");
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
        toast.success("All marked as read");
    };

    const handleClearAll = () => {
        if (notifications.length === 0) return;

        toast((t) => (
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-800 text-sm">Clear all notifications?</p>
                        <p className="text-xs text-slate-500 mt-0.5">This cannot be undone.</p>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            clearAll();
                            toast.dismiss(t.id);
                            toast.success("All notifications cleared");
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
            style: {
                padding: '16px',
                borderRadius: '12px',
            }
        });
    };

    // Filter and search
    const filteredNotifications = notifications
        .filter(n => {
            if (filter === 'unread') return n.isUnread;
            if (filter === 'important') return n.priority === 'urgent' || n.priority === 'high';
            return true;
        })
        .filter(n => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return n.title.toLowerCase().includes(query) || 
                   n.description.toLowerCase().includes(query) ||
                   (n.user && n.user.toLowerCase().includes(query));
        });

    const todayNotifications = filteredNotifications.filter(n => n.category === 'today');
    const olderNotifications = filteredNotifications.filter(n => n.category === 'older');

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm">
                                <Bell className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-800">Notifications ({unreadCount})</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    {unreadCount > 0 ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        'All caught up!'
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleMarkAllRead}
                                disabled={unreadCount === 0}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Mark all read
                            </button>
                            <button
                                onClick={handleClearAll}
                                disabled={notifications.length === 0}
                                className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear all
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, or user..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>
                        
                        {/* Filter tabs */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                            {[
                                { key: 'all', label: 'All', count: notifications.length },
                                { key: 'unread', label: 'Unread', count: unreadCount },
                                { key: 'important', label: 'Important', count: notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                        filter === tab.key
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`ml-1.5 text-xs ${filter === tab.key ? 'text-slate-500' : 'text-slate-400'}`}>({tab.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notification List */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium text-lg">No notifications</p>
                            <p className="text-sm text-slate-400 mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div>
                            {/* Today Section */}
                            {todayNotifications.length > 0 && (
                                <div>
                                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            Today
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {todayNotifications.map(notification => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                onMarkRead={handleMarkRead}
                                                onDelete={handleDelete}
                                                onClick={() => {
                                                    setSelectedNotification(notification);
                                                    if (notification.isUnread) handleMarkRead(notification.id);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Older Section */}
                            {olderNotifications.length > 0 && (
                                <div>
                                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 border-t">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            Earlier
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {olderNotifications.map(notification => (
                                            <NotificationCard
                                                key={notification.id}
                                                notification={notification}
                                                onMarkRead={handleMarkRead}
                                                onDelete={handleDelete}
                                                onClick={() => {
                                                    setSelectedNotification(notification);
                                                    if (notification.isUnread) handleMarkRead(notification.id);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notification Detail Modal */}
                {selectedNotification && (
                    <NotificationDetailModal
                        notification={selectedNotification}
                        onClose={() => setSelectedNotification(null)}
                        onDelete={(id) => {
                            handleDelete(id);
                            setSelectedNotification(null);
                        }}
                    />
                )}
            </div>
            <Toaster />
        </div>
    );
};

// Notification Card Component
const NotificationCard = ({ notification, onMarkRead, onDelete, onClick }) => {
    const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system_alert;
    const Icon = typeConfig.icon;

    return (
        <div 
            className={`group px-5 py-4 transition-all hover:bg-slate-50 cursor-pointer ${notification.isUnread ? 'bg-blue-50/30' : ''}`}
            onClick={onClick}
        >
            <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={typeConfig.color} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <h3 className={`text-sm ${notification.isUnread ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                                    {notification.title}
                                </h3>
                                {notification.isUnread && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                                {notification.priority === 'urgent' && (
                                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-600 rounded-full">
                                        Urgent
                                    </span>
                                )}
                                {notification.priority === 'high' && (
                                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-600 rounded-full">
                                        Important
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 mb-2 leading-relaxed">{notification.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {notification.isUnread && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Mark as read"
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Bottom row with label, user, and time */}
                    <div className="flex items-end justify-between mt-auto">
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.color} font-medium`}>
                                {typeConfig.label}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">{notification.user}</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ml-2">
                            <Clock size={10} className="text-slate-400" />
                            {notification.time}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Notification Detail Modal Component
const NotificationDetailModal = ({ notification, onClose, onDelete }) => {
    const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system_alert;
    const Icon = typeConfig.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className={`px-6 py-5 ${typeConfig.bg} border-b border-slate-100`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm`}>
                                <Icon size={24} className={typeConfig.color} strokeWidth={2} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-lg font-semibold text-slate-800">{notification.title}</h2>
                                    {notification.priority === 'urgent' && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-100 text-rose-600 rounded-full">
                                            Urgent
                                        </span>
                                    )}
                                    {notification.priority === 'high' && (
                                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-600 rounded-full">
                                            Important
                                        </span>
                                    )}
                                </div>
                                <span className={`text-xs font-medium ${typeConfig.color}`}>{typeConfig.label}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</h3>
                        <p className="text-slate-700 leading-relaxed">{notification.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <User size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">From</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700">{notification.user}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Time</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700">{notification.time}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Tag size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 capitalize">{notification.category}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 capitalize">{notification.priority || 'Normal'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                        onClick={() => onDelete(notification.id)}
                        className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminNotification;
