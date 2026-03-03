import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';

const UserNotificationContext = createContext();

export const useUserNotifications = () => {
    const context = useContext(UserNotificationContext);
    if (!context) {
        throw new Error('useUserNotifications must be used within UserNotificationProvider');
    }
    return context;
};

export const UserNotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching user notifications from /api/notifications/user');
            const response = await axiosInstance.get('/api/notifications/user');
            
            console.log('User notification response:', response.data);
            
            if (response.data.success && response.data.data) {
                // Transform backend data to UI format
                const transformedNotifications = response.data.data.map((notif) => {
                    const createdAt = new Date(notif.createdAt);
                    const now = new Date();
                    const diffMs = now - createdAt;
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);

                    let timeString = 'Just now';
                    if (diffMins > 0 && diffMins < 60) {
                        timeString = `${diffMins}m ago`;
                    } else if (diffHours > 0 && diffHours < 24) {
                        timeString = `${diffHours}h ago`;
                    } else if (diffDays > 0) {
                        timeString = `${diffDays}d ago`;
                    }

                    // Determine category
                    const category = diffDays === 0 ? 'today' : 'older';

                    // Map notification type
                    const typeMap = {
                        'ACCOUNT_STATUS': 'info',
                        'PAYMENT_RECEIVED': 'success',
                        'SUBSCRIPTION_RENEWED': 'success',
                        'SECURITY_ALERT': 'warning',
                        'SYSTEM_ALERT': 'warning',
                        'TEMPLATE_APPROVED': 'success',
                    };

                    // Get username
                    const username = typeof notif.userId === 'object' 
                        ? notif.userId?.username 
                        : 'System';

                    return {
                        id: notif._id,
                        type: typeMap[notif.type] || 'info',
                        title: notif.type ? notif.type.replace(/_/g, ' ') : 'Notification',
                        description: notif.message,
                        user: username,
                        time: timeString,
                        category: category,
                        isUnread: !notif.isRead,
                        priority: notif.type === 'SECURITY_ALERT' ? 'high' : 'normal',
                        createdAt: notif.createdAt,
                    };
                });

                console.log('Transformed user notifications:', transformedNotifications);
                setNotifications(transformedNotifications);
            } else {
                console.warn('No data in response or success is false');
                setNotifications([]);
            }
        } catch (err) {
            console.error('Failed to fetch user notifications:', err);
            setError(err.message);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Mark single notification as read
    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, isUnread: false } : n
            )
        );

        // API call (optional - for persistence)
        axiosInstance.put(`/api/notifications/${id}/read`).catch(err => {
            console.error('Failed to mark as read:', err);
        });
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, isUnread: false }))
        );

        // API call (optional - for persistence)
        axiosInstance.put('/api/notifications/user/read-all').catch(err => {
            console.error('Failed to mark all as read:', err);
        });
    }, []);

    // Delete single notification
    const deleteNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));

        // API call (optional - for persistence)
        axiosInstance.delete(`/api/notifications/${id}`).catch(err => {
            console.error('Failed to delete notification:', err);
        });
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        const notificationIds = notifications.map(n => n.id);
        setNotifications([]);

        // API call (optional - for persistence)
        notificationIds.forEach(id => {
            axiosInstance.delete(`/api/notifications/${id}`).catch(err => {
                console.error('Failed to delete notification:', err);
            });
        });
    }, [notifications]);

    // Fetch on mount
    useEffect(() => {
        fetchNotifications();

        // Polling - refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => n.isUnread).length;

    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    };

    return (
        <UserNotificationContext.Provider value={value}>
            {children}
        </UserNotificationContext.Provider>
    );
};

export default UserNotificationContext;
