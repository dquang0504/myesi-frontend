import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './SystemLogs.css';

export default function SystemLogs() {
  const [searchQuery, setSearchQuery] = useState('');

  const logs = [
    { timestamp: '2025-01-15 14:23:45', level: 'INFO', user: 'admin@myesi.com', action: 'User login successful', ip: '192.168.1.100', module: 'Authentication' },
    { timestamp: '2025-01-15 14:22:31', level: 'INFO', user: 'developer@myesi.com', action: 'SBOM uploaded: e-commerce-sbom.json', ip: '192.168.1.105', module: 'SBOM Management' },
    { timestamp: '2025-01-15 14:20:18', level: 'WARNING', user: 'system', action: 'High vulnerability detected in OpenSSL', ip: 'system', module: 'Vulnerability Scanner' },
    { timestamp: '2025-01-15 14:18:52', level: 'INFO', user: 'analyst@myesi.com', action: 'Generated compliance report: ISO-27001', ip: '192.168.1.110', module: 'Reporting' },
    { timestamp: '2025-01-15 14:15:33', level: 'ERROR', user: 'developer@myesi.com', action: 'Failed to upload SBOM: Invalid format', ip: '192.168.1.105', module: 'SBOM Management' },
    { timestamp: '2025-01-15 14:12:07', level: 'INFO', user: 'auditor@myesi.com', action: 'Accessed audit report: AUD-2025-001', ip: '192.168.1.115', module: 'Audit System' },
    { timestamp: '2025-01-15 14:10:45', level: 'WARNING', user: 'system', action: 'Critical vulnerability found in lodash@4.17.19', ip: 'system', module: 'Vulnerability Scanner' },
    { timestamp: '2025-01-15 14:08:22', level: 'INFO', user: 'admin@myesi.com', action: 'Updated user permissions for developer@myesi.com', ip: '192.168.1.100', module: 'User Management' },
    { timestamp: '2025-01-15 14:05:11', level: 'INFO', user: 'developer@myesi.com', action: 'Created new project: Customer Portal', ip: '192.168.1.105', module: 'Project Management' },
    { timestamp: '2025-01-15 14:02:58', level: 'ERROR', user: 'system', action: 'Database connection timeout', ip: 'system', module: 'Database' },
    { timestamp: '2025-01-15 14:00:33', level: 'INFO', user: 'analyst@myesi.com', action: 'Exported risk analysis report', ip: '192.168.1.110', module: 'Reporting' },
    { timestamp: '2025-01-15 13:58:19', level: 'INFO', user: 'admin@myesi.com', action: 'Updated system settings', ip: '192.168.1.100', module: 'System Configuration' },
    { timestamp: '2025-01-15 13:55:44', level: 'WARNING', user: 'system', action: 'Password expired for user: test@myesi.com', ip: 'system', module: 'Authentication' },
    { timestamp: '2025-01-15 13:52:27', level: 'INFO', user: 'developer@myesi.com', action: 'Scanned project: E-Commerce Platform', ip: '192.168.1.105', module: 'Vulnerability Scanner' },
    { timestamp: '2025-01-15 13:50:05', level: 'INFO', user: 'auditor@myesi.com', action: 'Downloaded compliance report', ip: '192.168.1.115', module: 'Reporting' },
  ];

  const moduleStats = [
    { module: 'Authentication', events: 342, percentage: 27 },
    { module: 'Vulnerability Scanner', events: 289, percentage: 23 },
    { module: 'SBOM Management', events: 215, percentage: 17 },
    { module: 'Reporting', events: 178, percentage: 14 },
    { module: 'User Management', events: 134, percentage: 11 },
    { module: 'System Configuration', events: 89, percentage: 8 },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'level-error';
      case 'WARNING':
        return 'level-warning';
      case 'INFO':
        return 'level-info';
      default:
        return 'level-default';
    }
  };

  return (
    <AdminLayout>
      <div className="system-logs">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>System Logs</h1>
            <p>Monitor system activities and events</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button className="btn btn-outline">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Logs
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="summary-card">
            <h3>Total Events</h3>
            <p className="summary-value">1,247</p>
            <p className="summary-label">Last 24 hours</p>
          </div>
          <div className="summary-card">
            <h3>Errors</h3>
            <p className="summary-value" style={{ color: '#ef4444' }}>12</p>
            <p className="summary-label">Requires attention</p>
          </div>
          <div className="summary-card">
            <h3>Warnings</h3>
            <p className="summary-value" style={{ color: '#f59e0b' }}>34</p>
            <p className="summary-label">Should be reviewed</p>
          </div>
          <div className="summary-card">
            <h3>Active Users</h3>
            <p className="summary-value" style={{ color: '#10b981' }}>8</p>
            <p className="summary-label">Currently logged in</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card-content">
            <div className="search-filters">
              <div className="search-box">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn btn-outline">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Level
              </button>
              <button className="btn btn-outline">Module</button>
              <button className="btn btn-outline">User</button>
              <button className="btn btn-outline">Time Range</button>
            </div>
          </div>
        </div>

        {/* Logs Display */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">System Event Logs</h2>
          </div>
          <div className="card-content">
            <div className="logs-scroll-container">
              <div className="logs-list">
                {logs.map((log, idx) => (
                  <div key={idx} className={`log-item ${getLevelColor(log.level)}`}>
                    <div className="log-content">
                      <div className="log-header">
                        <span className={`badge badge-level ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="log-timestamp">{log.timestamp}</span>
                        <span className="badge badge-secondary">{log.module}</span>
                      </div>
                      <p className="log-action">{log.action}</p>
                      <div className="log-meta">
                        <span>User: {log.user}</span>
                        <span>•</span>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Log Statistics */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Activity by Module</h2>
          </div>
          <div className="card-content">
            <div className="module-stats">
              {moduleStats.map((stat, idx) => (
                <div key={idx} className="module-stat-item">
                  <div className="module-stat-header">
                    <span className="module-stat-name">{stat.module}</span>
                    <span className="module-stat-count">{stat.events} events</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
