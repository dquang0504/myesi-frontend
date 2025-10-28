import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AuditReports.css';

export default function AuditReports() {
  const [searchQuery, setSearchQuery] = useState('');

  const auditReports = [
    {
      id: 'AUD-2025-001',
      title: 'Q1 2025 Security Audit',
      project: 'E-Commerce Platform',
      date: '2025-01-15',
      auditor: 'Jane Smith',
      status: 'Completed',
      findings: 12,
      critical: 2,
      score: 85,
    },
    {
      id: 'AUD-2025-002',
      title: 'ISO 27001 Assessment',
      project: 'All Projects',
      date: '2025-01-10',
      auditor: 'John Doe',
      status: 'Completed',
      findings: 8,
      critical: 0,
      score: 92,
    },
    {
      id: 'AUD-2024-012',
      title: 'Mobile App Security Review',
      project: 'Mobile Banking App',
      date: '2024-12-28',
      auditor: 'Sarah Johnson',
      status: 'Completed',
      findings: 15,
      critical: 1,
      score: 88,
    },
    {
      id: 'AUD-2024-011',
      title: 'API Gateway Audit',
      project: 'API Gateway Service',
      date: '2024-12-20',
      auditor: 'Michael Brown',
      status: 'In Progress',
      findings: 0,
      critical: 0,
      score: 0,
    },
    {
      id: 'AUD-2024-010',
      title: 'Customer Portal Assessment',
      project: 'Customer Portal',
      date: '2024-12-15',
      auditor: 'Jane Smith',
      status: 'Completed',
      findings: 18,
      critical: 3,
      score: 76,
    },
    {
      id: 'AUD-2024-009',
      title: 'Compliance Review - GDPR',
      project: 'All Projects',
      date: '2024-12-10',
      auditor: 'John Doe',
      status: 'Completed',
      findings: 5,
      critical: 0,
      score: 95,
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 75) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
  };

  const recentActivities = [
    { action: 'Completed security audit', project: 'E-Commerce Platform', time: '2 hours ago', auditor: 'Jane Smith' },
    { action: 'Started compliance review', project: 'API Gateway Service', time: '5 hours ago', auditor: 'Michael Brown' },
    { action: 'Generated audit report', project: 'Mobile Banking App', time: '1 day ago', auditor: 'Sarah Johnson' },
    { action: 'Completed ISO 27001 assessment', project: 'All Projects', time: '2 days ago', auditor: 'John Doe' },
  ];

  return (
    <AdminLayout>
      <div className="audit-reports">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Audit Reports</h1>
            <p>Review security audit reports and findings</p>
          </div>
          <button className="btn btn-outline">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export All Reports
          </button>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="summary-card">
            <h3>Total Audits</h3>
            <p className="summary-value">45</p>
            <p className="summary-label">All time</p>
          </div>
          <div className="summary-card">
            <h3>Completed</h3>
            <p className="summary-value" style={{ color: '#10b981' }}>42</p>
            <p className="summary-label">93% completion rate</p>
          </div>
          <div className="summary-card">
            <h3>Total Findings</h3>
            <p className="summary-value" style={{ color: '#f59e0b' }}>58</p>
            <p className="summary-label">From recent audits</p>
          </div>
          <div className="summary-card">
            <h3>Avg Audit Score</h3>
            <p className="summary-value" style={{ color: '#3b82f6' }}>87%</p>
            <p className="summary-label">Across all projects</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="card-content">
            <div className="search-filters">
              <div className="search-box">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search audit reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn btn-outline">Status</button>
              <button className="btn btn-outline">Project</button>
              <button className="btn btn-outline">Auditor</button>
            </div>
          </div>
        </div>

        {/* Audit Reports Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Audit Reports</h2>
          </div>
          <div className="card-content">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Audit ID</th>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Auditor</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Findings</th>
                    <th>Score</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditReports.map((report) => (
                    <tr key={report.id}>
                      <td><code>{report.id}</code></td>
                      <td style={{ fontWeight: 500 }}>{report.title}</td>
                      <td style={{ color: '#64748b' }}>{report.project}</td>
                      <td style={{ color: '#64748b' }}>{report.auditor}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: '#64748b' }}>
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '14px', height: '14px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {report.date}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${report.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                          {report.status === 'Completed' && (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '12px', height: '12px', marginRight: '4px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 500 }}>{report.findings}</span>
                          {report.critical > 0 && (
                            <span className="badge-critical">{report.critical} Critical</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {report.score > 0 ? (
                          <span className={`score ${getScoreColor(report.score)}`}>
                            {report.score}%
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                          <button className="btn-icon" title="View">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="btn-icon" title="Download">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Audit Activity</h2>
          </div>
          <div className="card-content">
            <div className="activity-list">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-meta">{activity.project} • {activity.auditor}</p>
                  </div>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
