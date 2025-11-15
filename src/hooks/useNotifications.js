/**
 * Custom hook for notifications
 * Manages notification state and real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../services/notificationService';
import { toast } from 'react-toastify';

/**
 * Fetch all notifications with optional filters
 */
export const useNotifications = (filters = {}) => {
  return useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => getNotifications(filters),
    refetchInterval: 60000, // Refetch every 60 seconds for near real-time updates
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

/**
 * Get unread notification count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', { unreadOnly: true }],
    queryFn: () => getNotifications({ unreadOnly: true }),
    select: (data) => data?.data?.unreadCount || 0,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000,
  });
};

/**
 * Mark notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
      console.error('Mark as read error:', error);
    },
  });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark all as read');
      console.error('Mark all as read error:', error);
    },
  });
};

/**
 * Delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete notification');
      console.error('Delete notification error:', error);
    },
  });
};

/**
 * Get notification preferences
 */
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: getNotificationPreferences,
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Update notification preferences
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      toast.success('Notification preferences updated');
    },
    onError: (error) => {
      toast.error('Failed to update preferences');
      console.error('Update preferences error:', error);
    },
  });
};
