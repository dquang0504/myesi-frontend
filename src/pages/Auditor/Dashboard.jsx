import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import './Dashboard.css';

export default function AuditorDashboard() {
  const recentReports = [
    { id: 1, name: 'Q4 Security Audit', project: 'Project Alpha', date: '2024-01-15', status: 'Completed' },
    { id: 2, name: 'Compliance Review', project: 'Project Beta', date: '2024-01-10', status: 'Completed' },
    { id: 3, name: 'Vulnerability Assessment', project: 'Project Gamma', date: '2024-01-05', status: 'In Review' },
  ];

  return (
    <AdminLayout>
      <div className="auditor-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Auditor Dashboard</h1>
            <p>View reports and audit logs in read-only mode</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Reports</h3>
                <p className="stat-value">156</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: '#e9d5ff' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="#8b5cf6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Audit Logs</h3>
                <p className="stat-value">2,341</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="#10b981">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Compliance Rate</h3>
                <p className="stat-value">94%</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="#f59e0b">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-content">
                <h3>Reviewed This Month</h3>
                <p className="stat-value">28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Audit Reports</h2>
            <button className="btn btn-outline">View All Reports</button>
          </div>
          <div className="card-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Project</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id}>
                    <td style={{ fontWeight: 500 }}>{report.name}</td>
                    <td style={{ color: '#64748b' }}>{report.project}</td>
                    <td style={{ color: '#64748b' }}>{report.date}</td>
                    <td>
                      <span className={`badge ${report.status === 'Completed' ? 'badge-success' : 'badge-secondary'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm">Download PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Compliance Overview (Read-Only)</h2>
          </div>
          <div className="card-content">
            <div className="empty-state">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Compliance status charts would go here</p>
            </div>
          </div>
        </div>

        {/* System Logs Preview */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent System Logs</h2>
            <button className="btn btn-outline">View Full Logs</button>
          </div>
          <div className="card-content">
            <div className="log-container">
              <div className="log-entry">[2024-01-15 14:23:45] INFO: User audit.user@myesi.com accessed report #156</div>
              <div className="log-entry">[2024-01-15 13:15:22] INFO: Compliance scan completed for Project Alpha</div>
              <div className="log-entry">[2024-01-15 12:08:11] INFO: Report generated: Q4 Security Audit</div>
              <div className="log-entry">[2024-01-15 11:45:33] INFO: System backup completed successfully</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
