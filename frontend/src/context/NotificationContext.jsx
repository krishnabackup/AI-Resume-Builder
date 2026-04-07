import React, { createContext, useContext, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

const transformNotification = (notif) => {
    const parseCreatedAt = (value) => {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (typeof value !== 'string') return new Date(value);

        if (!value.includes('T') && !value.endsWith('Z')) {
            return new Date(value.replace(' ', 'T') + 'Z');
        }

        return new Date(value);
    };

    const createdAt = parseCreatedAt(notif.createdAt);
    const diffFromBackend = Number.isFinite(notif.ageSeconds)
        ? notif.ageSeconds
        : null;
    const diffSeconds = diffFromBackend !== null
        ? Math.max(0, diffFromBackend)
        : Math.max(0, Math.floor((Date.now() - (createdAt?.getTime?.() || Date.now())) / 1000));
    const diffMins = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffSeconds / 3600);
    const diffDays = Math.floor(diffSeconds / 86400);

    let timeString = 'Just now';
    if (diffMins > 0 && diffMins < 60) {
        timeString = `${diffMins}m ago`;
    } else if (diffHours > 0 && diffHours < 24) {
        timeString = `${diffHours}h ago`;
    } else if (diffDays > 0) {
        timeString = `${diffDays}d ago`;
    }

    const category = diffDays === 0 ? 'today' : 'older';

    const typeMap = {
        'ACCOUNT_STATUS': 'security_alert',
        'USER_STATUS': 'security_alert',
        'USER_DELETED': 'system_alert',
        'TEMPLATE_APPROVED': 'template_approved',
        'TEMPLATE_SUBMITTED': 'template_submitted',
        'SUBSCRIPTION_RENEWED': 'subscription_renewed',
        'SUBSCRIPTION_CANCELLED': 'subscription_cancelled',
        'PREMIUM_ACTIVATED': 'premium_activated',
        'PAYMENT_RECEIVED': 'payment_received',
        'NEW_USER': 'new_user',
        'ADMIN_REQUEST': 'admin_request',
        'ADMIN_REQUEST_USER': 'role_update',
        'ROLE_UPDATE': 'role_update',
        'ROLE_APPROVED_ADMIN': 'role_update',
        'ROLE_REJECTED_ADMIN': 'role_update',
    };

    const username = notif.user ?? notif.userId;

    return {
        id: notif.id,
        type: typeMap[notif.type] || 'system_alert',
        title: notif.type ? notif.type.replace(/_/g, ' ') : 'Notification',
        description: notif.message,
        user: username || 'System',
        time: timeString,
        category: category,
        isUnread: !notif.isRead,
        priority: (notif.type === 'ACCOUNT_STATUS' || notif.type === 'SECURITY_ALERT') ? 'high' : 'normal',
        createdAt: notif.createdAt,
    };
};

export const NotificationProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const {
        data: notifications = [],
        isLoading: loading,
        error,
        refetch: fetchNotifications
    } = useQuery({
        queryKey: ['adminNotifications'],
        queryFn: async () => {
            console.log('Fetching notifications from /api/notifications/admin');
            const response = await axiosInstance.get('/api/notifications/admin');
            if (response.data.success && response.data.data) {
                return response.data.data.map(transformNotification);
            }
            return [];
        },
        refetchInterval: 60000, // Poll every minute as per requirement
        staleTime: 30000, // Consider fresh for 30 seconds
    });

    // Mark single notification as read
    const markAsReadMutation = useMutation({
        mutationFn: (id) => axiosInstance.put(`/api/notifications/${id}/read`),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['adminNotifications'] });
            const previousNotifications = queryClient.getQueryData(['adminNotifications']);
            queryClient.setQueryData(['adminNotifications'], (old) =>
                old?.map((n) => n.id === id ? { ...n, isUnread: false } : n)
            );
            return { previousNotifications };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['adminNotifications'], context.previousNotifications);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
    });

    const markAsRead = useCallback((id) => {
        markAsReadMutation.mutate(id);
    }, [markAsReadMutation]);

    // Mark all as read
    const markAllAsReadMutation = useMutation({
        mutationFn: () => axiosInstance.post('/api/notifications/admin/mark-all-read'),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['adminNotifications'] });
            const previousNotifications = queryClient.getQueryData(['adminNotifications']);
            queryClient.setQueryData(['adminNotifications'], (old) =>
                old?.map((n) => ({ ...n, isUnread: false }))
            );
            return { previousNotifications };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['adminNotifications'], context.previousNotifications);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
    });

    const markAllAsRead = useCallback(() => {
        markAllAsReadMutation.mutate();
    }, [markAllAsReadMutation]);

    // Delete single notification
    const deleteMutation = useMutation({
        mutationFn: (id) => axiosInstance.delete(`/api/notifications/${id}`),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['adminNotifications'] });
            const previousNotifications = queryClient.getQueryData(['adminNotifications']);
            queryClient.setQueryData(['adminNotifications'], (old) =>
                old?.filter((n) => n.id !== id)
            );
            return { previousNotifications };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['adminNotifications'], context.previousNotifications);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
    });

    const deleteNotification = useCallback((id) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    // Clear all notifications
    const clearAllMutation = useMutation({
        mutationFn: async () => {
            const currentNotifs = queryClient.getQueryData(['adminNotifications']) || [];
            const ids = currentNotifs.map(n => n.id);
            return Promise.all(ids.map(id => axiosInstance.delete(`/api/notifications/${id}`)));
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['adminNotifications'] });
            const previousNotifications = queryClient.getQueryData(['adminNotifications']);
            queryClient.setQueryData(['adminNotifications'], []);
            return { previousNotifications };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['adminNotifications'], context.previousNotifications);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
        },
    });

    const clearAll = useCallback(() => {
        clearAllMutation.mutate();
    }, [clearAllMutation]);

    const unreadCount = notifications.filter(n => n.isUnread).length;

    const value = {
        notifications,
        unreadCount,
        loading,
        error: error?.message || null,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;