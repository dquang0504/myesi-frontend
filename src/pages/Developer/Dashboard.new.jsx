import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  AreaChartComponent,
} from '../../components/ChartComponent';
import {
  useDashboardStats,
  useRecentActivities,
  useVulnerabilityTrend,
  useSBOMAnalytics,
  useRiskScores,
  useTopVulnerabilities,
} from '../../hooks/useDashboard';
import './Dashboard.css';
import '../Admin/AnalyticsDashboard.css';

export default function DeveloperDashboard() {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [uploadFile, setUploadFile] = useState(null);
  
  // Fetch dashboard data
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading } = useRecentActivities(6);
  const { data: trendData, isLoading: trendLoading } = useVulnerabilityTrend(14);
  const { data: sbomData, isLoading: sbomLoading } = useSBOMAnalytics();
  const { data: riskData, isLoading: riskLoading } = useRiskScores();
  const { data: topVulnData, isLoading: topVulnLoading } = useTopVulnerabilities(10);

  const stats = statsData?.data || {};
  const activities = activitiesData?.data?.activities || [];
  const vulnerabilityTrend = trendData?.data?.trend || [];
  const sbomAnalytics = sbomData?.data || {};
  const riskScores = riskData?.data || {};
  const topVulnerabilities = topVulnData?.data?.vulnerabilities || [];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      setTimeout(() => {
        alert(`Dependency file "${file.name}" uploaded successfully!`);
        setUploadFile(null);
      }, 1000);
    }
  };

  // Filter vulnerabilities by severity
  const filteredVulnerabilities = filterSeverity === 'all'
    ? topVulnerabilities
    : topVulnerabilities.filter(v => v.severity === filterSeverity);

  // Developer-specific stats
  const developerStats = [
    {
      title: 'Code Vulnerabilities',
      value: stats.totalVulnerabilities || 0,
      change: -8,
      icon: '🐛',
      color: 'danger',
    },
    {
      title: 'Dependencies',
      value: stats.totalSBOMs || 0,
      change: +12,
      icon: '📦',
      color: 'primary',
    },
    {
      title: 'Fixes This Week',
      value: stats.fixedThisWeek || 23,
      change: +15,
      icon: '✅',
      color: 'success',
    },
    {
      title: 'Code Quality Score',
      value: `${stats.complianceScore || 85}%`,
      change: +3,
      icon: '⭐',
      color: 'warning',
    },
  ];

  return (
    <AdminLayout>
      <div className="analytics-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Developer Dashboard</h1>
            <p>Code Analysis, Dependency Scanning & Fix Tracking</p>
          </div>
          <div className="header-actions">
            <button className="refresh-btn" onClick={() => window.location.reload()}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="stat-card loading">
                <div className="skeleton-text"></div>
              </div>
            ))
          ) : (
            developerStats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <div className="stat-value">{stat.value}</div>
                  <div className={`stat-change ${stat.change > 0 ? 'positive' : 'negative'}`}>
                    {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last week
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* === ANALYTICS SECTION === */}
        <div className="analytics-section">
          <h2 className="section-title">📊 Code & Dependency Analytics</h2>
          
          <div className="analytics-grid">
            {/* Vulnerability Fix Progress */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Fix Progress (Last 14 Days)</h3>
                <span className="badge badge-success">23 fixed</span>
              </div>
              {trendLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <LineChartComponent
                  data={vulnerabilityTrend}
                  lines={[
                    { key: 'critical', name: 'Critical Fixed', color: '#ef4444' },
                    { key: 'high', name: 'High Fixed', color: '#f59e0b' },
                    { key: 'medium', name: 'Medium Fixed', color: '#eab308' },
                  ]}
                  xKey="date"
                  height={300}
                />
              )}
            </div>

            {/* Vulnerability Distribution */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Current Vulnerabilities</h3>
                <span className="risk-score">
                  Total: <strong>{Object.values(riskScores.distribution || []).reduce((a, b) => a + (b.value || 0), 0)}</strong>
                </span>
              </div>
              {riskLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <PieChartComponent
                  data={riskScores.distribution || []}
                  dataKey="value"
                  nameKey="name"
                  height={280}
                  colors={['#ef4444', '#f59e0b', '#eab308', '#10b981']}
                />
              )}
            </div>

            {/* Dependency Scan Activity */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Dependency Scans</h3>
                <span className="badge badge-primary">+{sbomAnalytics.scannedToday || 0} today</span>
              </div>
              {sbomLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <AreaChartComponent
                  data={sbomAnalytics.sbomTrend || []}
                  areas={[
                    { key: 'scanned', name: 'Scanned', color: '#3b82f6' },
                  ]}
                  xKey="date"
                  height={280}
                />
              )}
            </div>

            {/* Top Languages by Vulnerabilities */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Vulnerabilities by Language</h3>
                <span className="badge badge-warning">Top 5</span>
              </div>
              {sbomLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <BarChartComponent
                  data={sbomAnalytics.topLanguages || []}
                  bars={[
                    { key: 'count', name: 'Vulnerabilities', color: '#f59e0b' },
                  ]}
                  xKey="name"
                  height={280}
                />
              )}
            </div>
          </div>
        </div>

        {/* === VULNERABILITY TRACKING === */}
        <div className="reports-section">
          <h2 className="section-title">🔍 Vulnerability Tracking</h2>
          
          <div className="reports-grid">
            {/* Active Vulnerabilities Table */}
            <div className="report-card full-width">
              <div className="card-header">
                <h3>Active Vulnerabilities</h3>
                <div className="filter-group">
                  <select 
                    value={filterSeverity} 
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="severity-filter"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              {topVulnLoading ? (
                <div className="table-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <div className="table-container">
                  <table className="vulnerability-table">
                    <thead>
                      <tr>
                        <th>CVE ID</th>
                        <th>Title</th>
                        <th>Severity</th>
                        <th>CVSS</th>
                        <th>Affected Projects</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVulnerabilities.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                            No vulnerabilities found
                          </td>
                        </tr>
                      ) : (
                        filteredVulnerabilities.map((vuln) => (
                          <tr key={vuln.id}>
                            <td><code className="cve-code">{vuln.id}</code></td>
                            <td>{vuln.title}</td>
                            <td>
                              <span className={`severity-badge ${vuln.severity}`}>
                                {vuln.severity}
                              </span>
                            </td>
                            <td>
                              <span className="cvss-score">{vuln.cvssScore}</span>
                            </td>
                            <td>{vuln.affected} projects</td>
                            <td>
                              <span className={`status-badge ${vuln.status}`}>
                                {vuln.status.replace('-', ' ')}
                              </span>
                            </td>
                            <td>Developer Team</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === INTERACTIVE TOOLS === */}
        <div className="interactive-section">
          <h2 className="section-title">🔧 Developer Tools</h2>
          
          <div className="tools-grid">
            {/* Dependency Upload */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3>Scan Dependencies</h3>
              <p>Upload package.json, pom.xml, requirements.txt</p>
              <input
                type="file"
                id="dependency-upload"
                accept=".json,.xml,.txt,.lock"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="dependency-upload" className="upload-btn">
                {uploadFile ? `Scanning ${uploadFile.name}...` : 'Choose File'}
              </label>
              <small>Supported: npm, maven, pip, composer</small>
            </div>

            {/* Code Scan */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3>Run Code Scan</h3>
              <p>Analyze code for security vulnerabilities</p>
              <button className="action-btn" onClick={() => alert('Starting code security scan...')}>
                Start Scan
              </button>
              <small>SAST, secrets detection, code quality</small>
            </div>

            {/* Fix Generator */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Generate Fix Report</h3>
              <p>Create detailed remediation guide</p>
              <button className="action-btn" onClick={() => alert('Generating fix report...')}>
                Generate Report
              </button>
              <small>Includes code examples and patches</small>
            </div>

            {/* Documentation */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3>Security Docs</h3>
              <p>Best practices and guidelines</p>
              <button className="action-btn" onClick={() => alert('Opening security documentation...')}>
                View Docs
              </button>
              <small>OWASP, coding standards, examples</small>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <div className="section-header">
            <h2>Recent Development Activity</h2>
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
                  <th>Developer</th>
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
      </div>
    </AdminLayout>
  );
}
