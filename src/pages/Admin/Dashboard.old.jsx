import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  useDashboardStats,
  useRecentActivities,
  useVulnerabilityTrend,
} from '../../hooks/useDashboard';
import './Dashboard.css';

export default function AdminDashboard() {
  // Fetch dashboard data
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading } = useRecentActivities(8);
  const { data: trendData } = useVulnerabilityTrend(7);

  const stats = statsData?.data || {};
  const activities = activitiesData?.data?.activities || [];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (statsLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-dashboard">
          <div className="spinner-large"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        {/* Total Users Card */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{stats.users?.total || 0}</p>
            {stats.users?.change && (
              <p className={`stat-change ${stats.users.trend === 'up' ? 'positive' : 'negative'}`}>
                {stats.users.trend === 'up' ? '↑' : '↓'} {Math.abs(stats.users.change)}% from last month
              </p>
            )}
          </div>
        </div>

        {/* Projects Card */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#10b981">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Projects</p>
            <p className="stat-value">{stats.projects?.active || 0}</p>
            {stats.projects?.change && (
              <p className={`stat-change ${stats.projects.trend === 'up' ? 'positive' : 'negative'}`}>
                {stats.projects.trend === 'up' ? '↑' : '↓'} {Math.abs(stats.projects.change)}% growth
              </p>
            )}
          </div>
        </div>

        {/* Vulnerabilities Card */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#ef4444">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Vulnerabilities</p>
            <p className="stat-value">{stats.vulnerabilities?.total || 0}</p>
            {stats.vulnerabilities?.change && (
              <p className={`stat-change ${stats.vulnerabilities.trend === 'down' ? 'positive' : 'negative'}`}>
                {stats.vulnerabilities.trend === 'down' ? '↓' : '↑'} {Math.abs(stats.vulnerabilities.change)}% {stats.vulnerabilities.trend === 'down' ? 'resolved' : 'detected'}
              </p>
            )}
          </div>
        </div>

        {/* SBOM Card */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e9d5ff' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#8b5cf6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">SBOM Scanned</p>
            <p className="stat-value">{stats.sboms?.scanned || 0}</p>
            {stats.sboms?.change && (
              <p className={`stat-change positive`}>
                ↑ {stats.sboms.change}% this week
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/users" className="action-card">
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3>User Management</h3>
            <p>Manage users, roles, and permissions</p>
          </Link>

          <button className="action-card action-card-disabled">
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>System Reports</h3>
            <p>Generate and view system reports</p>
          </button>

          <button className="action-card action-card-disabled">
            <div className="action-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3>Analytics</h3>
            <p>Coming soon...</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>

        {activitiesLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner-large" style={{ margin: '0 auto' }}></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="empty-activity">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No recent activity</p>
          </div>
        ) : (
          <table className="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {activity.user.charAt(0).toUpperCase()}
                      </div>
                      <span>{activity.user}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`activity-badge ${activity.action}`}>
                      {activity.action}
                    </span>
                  </td>
                  <td>{activity.target}</td>
                  <td>{formatTimeAgo(activity.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vulnerability Trend Chart */}
      <div className="chart-section">
        <div className="section-header">
          <h2>Vulnerability Trends (Last 7 Days)</h2>
        </div>
        <div className="chart-container">
          <div className="chart-placeholder">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>Chart visualization coming soon...</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {trendData?.data?.summary && (
                <>
                  Critical: {trendData.data.summary.totalCritical} | 
                  High: {trendData.data.summary.totalHigh} | 
                  Medium: {trendData.data.summary.totalMedium} | 
                  Low: {trendData.data.summary.totalLow}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
