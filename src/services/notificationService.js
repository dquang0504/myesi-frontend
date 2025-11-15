/**
 * Notification Service
 * Handles notifications for CVEs and payment events
 * Will integrate with backend Task 2.6 (Email/Webhook notifications)
 */

import axios from '../utils/axios';

// Mock notification data generator
const generateMockNotifications = () => {
  const now = new Date();
  const notifications = [];

  // Critical CVE notifications
  const cveNotifications = [
    {
      id: 1,
      type: 'cve_critical',
      severity: 'critical',
      title: 'Critical CVE Detected',
      message: 'CVE-2024-1234: Remote Code Execution vulnerability found in OpenSSL 3.0.1',
      cveId: 'CVE-2024-1234',
      cvssScore: 9.8,
      affectedComponent: 'OpenSSL 3.0.1',
      timestamp: new Date(now - 1000 * 60 * 15).toISOString(), // 15 mins ago
      read: false,
      actionUrl: '/admin/dashboard#vulnerabilities',
    },
    {
      id: 2,
      type: 'cve_critical',
      severity: 'critical',
      title: 'Critical Vulnerability Alert',
      message: 'CVE-2024-5678: SQL Injection vulnerability in PostgreSQL 14.2',
      cveId: 'CVE-2024-5678',
      cvssScore: 9.2,
      affectedComponent: 'PostgreSQL 14.2',
      timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      actionUrl: '/admin/dashboard#vulnerabilities',
    },
    {
      id: 3,
      type: 'cve_high',
      severity: 'high',
      title: 'High Severity CVE',
      message: 'CVE-2024-9012: Cross-Site Scripting in React 18.2.0',
      cveId: 'CVE-2024-9012',
      cvssScore: 7.5,
      affectedComponent: 'React 18.2.0',
      timestamp: new Date(now - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      read: true,
      actionUrl: '/admin/dashboard#vulnerabilities',
    },
  ];

  // Payment/Billing notifications
  const paymentNotifications = [
    {
      id: 4,
      type: 'payment_failed',
      severity: 'critical',
      title: 'Payment Failed',
      message: 'Your payment of $199.00 for Professional Plan failed. Please update your payment method.',
      amount: 19900,
      planName: 'Professional Plan',
      timestamp: new Date(now - 1000 * 60 * 30).toISOString(), // 30 mins ago
      read: false,
      actionUrl: '/admin/billing',
    },
    {
      id: 5,
      type: 'payment_success',
      severity: 'info',
      title: 'Payment Successful',
      message: 'Your payment of $99.00 for Enterprise Plan has been processed successfully.',
      amount: 9900,
      planName: 'Enterprise Plan',
      timestamp: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      actionUrl: '/admin/billing',
    },
    {
      id: 6,
      type: 'subscription_expiring',
      severity: 'warning',
      title: 'Subscription Expiring Soon',
      message: 'Your Professional Plan subscription will expire in 3 days. Renew now to avoid service interruption.',
      planName: 'Professional Plan',
      expiryDate: new Date(now + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
      timestamp: new Date(now - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      read: false,
      actionUrl: '/admin/billing',
    },
    {
      id: 7,
      type: 'invoice_available',
      severity: 'info',
      title: 'New Invoice Available',
      message: 'Your invoice for November 2025 is now available for download.',
      invoiceId: 'INV-2025-11-001',
      timestamp: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      read: true,
      actionUrl: '/admin/billing',
    },
  ];

  return [...cveNotifications, ...paymentNotifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
};

/**
 * Get all notifications for the current user
 */
export const getNotifications = async (filters = {}) => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axios.get('/api/notifications', { params: filters });
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    const allNotifications = generateMockNotifications();
    let filtered = allNotifications;

    // Apply filters
    if (filters.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }
    if (filters.type) {
      filtered = filtered.filter(n => n.type.startsWith(filters.type));
    }
    if (filters.severity) {
      filtered = filtered.filter(n => n.severity === filters.severity);
    }

    return {
      success: true,
      data: {
        notifications: filtered,
        total: filtered.length,
        unreadCount: allNotifications.filter(n => !n.read).length,
      },
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.patch(`/api/notifications/${notificationId}/read`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: 'Notification marked as read',
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.patch('/api/notifications/read-all');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: 'All notifications marked as read',
    };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.delete(`/api/notifications/${notificationId}`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: 'Notification deleted',
    };
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get('/api/notifications/preferences');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: {
        emailNotifications: true,
        criticalCVEs: true,
        highCVEs: true,
        mediumCVEs: false,
        paymentFailures: true,
        subscriptionExpiry: true,
        invoiceAvailable: false,
      },
    };
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.put('/api/notifications/preferences', preferences);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: 'Notification preferences updated',
      data: preferences,
    };
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

/**
 * Simulate real-time notification (WebSocket replacement)
 * In production, this would be handled by WebSocket or Server-Sent Events
 */
export const simulateRealtimeNotification = (callback) => {
  const interval = setInterval(() => {
    const randomChance = Math.random();
    
    // 10% chance of new notification every 30 seconds
    if (randomChance < 0.1) {
      const notificationTypes = [
        {
          type: 'cve_critical',
          severity: 'critical',
          title: 'New Critical CVE Detected',
          message: `CVE-2024-${Math.floor(Math.random() * 9999)}: Critical vulnerability detected`,
          cvssScore: 9.0 + Math.random(),
        },
        {
          type: 'payment_failed',
          severity: 'critical',
          title: 'Payment Failed',
          message: 'Payment processing failed. Please check your payment method.',
        },
      ];
      
      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      callback({
        ...randomNotification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
  }, 30000); // Check every 30 seconds

  return () => clearInterval(interval);
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  simulateRealtimeNotification,
};
