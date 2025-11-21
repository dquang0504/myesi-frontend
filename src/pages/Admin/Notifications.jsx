import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  useNotifications, 
  useMarkAsRead, 
  useMarkAllAsRead, 
  useDeleteNotification,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [filter, setFilter] = useState('all'); // all, cve, payment, unread
  const [showSettings, setShowSettings] = useState(false);
  
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useNotifications({});
  const { data: preferencesData } = useNotificationPreferences();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();
  const updatePreferences = useUpdateNotificationPreferences();

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notificationsData?.data?.unreadCount || 0;
  const preferences = preferencesData?.data || {};

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'cve') return notification.type.startsWith('cve_');
    if (filter === 'payment') return !notification.type.startsWith('cve_');
    return true;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead.mutate();
    }
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification.mutate(notificationId);
  };

  const handlePreferenceChange = (key) => {
    const updatedPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    updatePreferences.mutate(updatedPreferences);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeAgo;
    if (diffMins < 1) timeAgo = 'Just now';
    else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
    else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
    else if (diffDays < 7) timeAgo = `${diffDays}d ago`;
    else timeAgo = date.toLocaleDateString();

    const fullDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return { timeAgo, fullDate };
  };

  const getSeverityIcon = (severity, type) => {
    if (type.startsWith('cve_')) {
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }

    switch (type) {
      case 'payment_failed':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'payment_success':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'subscription_expiring':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'invoice_available':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="notifications-page">
        {/* Page Header */}
        <div className="notifications-header">
          <div className="header-content">
            <h1>Notifications</h1>
            <p>Stay updated on critical CVEs and billing events</p>
          </div>
          <div className="header-actions">
            <button 
              className="settings-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button 
              className="mark-all-btn"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark All Read
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h3>Notification Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications || false}
                    onChange={() => handlePreferenceChange('emailNotifications')}
                  />
                  <span>Email Notifications</span>
                </label>
                <p>Receive notifications via email</p>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.criticalCVEs || false}
                    onChange={() => handlePreferenceChange('criticalCVEs')}
                  />
                  <span>Critical CVEs (CVSS ≥ 9.0)</span>
                </label>
                <p>Get alerts for critical vulnerabilities</p>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.highCVEs || false}
                    onChange={() => handlePreferenceChange('highCVEs')}
                  />
                  <span>High CVEs (CVSS 7.0 - 8.9)</span>
                </label>
                <p>Get alerts for high severity vulnerabilities</p>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.mediumCVEs || false}
                    onChange={() => handlePreferenceChange('mediumCVEs')}
                  />
                  <span>Medium CVEs (CVSS 4.0 - 6.9)</span>
                </label>
                <p>Get alerts for medium severity vulnerabilities</p>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.paymentFailures || false}
                    onChange={() => handlePreferenceChange('paymentFailures')}
                  />
                  <span>Payment Failures</span>
                </label>
                <p>Get alerts when payments fail</p>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.subscriptionExpiry || false}
                    onChange={() => handlePreferenceChange('subscriptionExpiry')}
                  />
                  <span>Subscription Expiry</span>
                </label>
                <p>Get reminders before subscription expires</p>
              </div>
              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.invoiceAvailable || false}
                    onChange={() => handlePreferenceChange('invoiceAvailable')}
                  />
                  <span>Invoice Available</span>
                </label>
                <p>Get notified when new invoices are ready</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button 
              className={filter === 'cve' ? 'active' : ''}
              onClick={() => setFilter('cve')}
            >
              CVE Alerts
            </button>
            <button 
              className={filter === 'payment' ? 'active' : ''}
              onClick={() => setFilter('payment')}
            >
              Payment Events
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => {
                const { timeAgo, fullDate } = formatTimestamp(notification.timestamp);
                return (
                  <div
                    key={notification.id}
                    className={`notification-card ${notification.read ? 'read' : 'unread'} severity-${notification.severity}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-card-icon">
                      {getSeverityIcon(notification.severity, notification.type)}
                    </div>
                    <div className="notification-card-content">
                      <div className="notification-card-header">
                        <h3>{notification.title}</h3>
                        {!notification.read && <span className="unread-indicator">New</span>}
                      </div>
                      <p className="notification-card-message">{notification.message}</p>
                      <div className="notification-card-meta">
                        {notification.cvssScore && (
                          <span className="cvss-score">CVSS: {notification.cvssScore.toFixed(1)}</span>
                        )}
                        {notification.cveId && (
                          <span className="cve-id">{notification.cveId}</span>
                        )}
                        <span className="timestamp" title={fullDate}>{timeAgo}</span>
                      </div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      aria-label="Delete"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
