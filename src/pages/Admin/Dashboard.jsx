import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  AreaChartComponent,
} from '../../components/ChartComponent';
import HeatmapComponent from '../../components/HeatmapComponent';
import RiskByProjectChart from '../../components/RiskByProjectChart';
import {
  useDashboardStats,
  useRecentActivities,
  useVulnerabilityTrend,
  useSBOMAnalytics,
  useRiskScores,
  useCompliance,
  useTopVulnerabilities,
  useComponentInventory,
} from '../../hooks/useDashboard';
import { useCurrentSubscription } from '../../hooks/useSubscription';
import './Dashboard.css';
import './AnalyticsDashboard.css';

export default function AdminDashboard() {
  const [uploadFile, setUploadFile] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // Fetch dashboard data
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading } = useRecentActivities(8);
  const { data: trendData, isLoading: trendLoading } = useVulnerabilityTrend(7);
  const { data: sbomData, isLoading: sbomLoading } = useSBOMAnalytics();
  const { data: riskData, isLoading: riskLoading } = useRiskScores();
  const { data: complianceData, isLoading: complianceLoading } = useCompliance();
  const { data: topVulnData, isLoading: topVulnLoading } = useTopVulnerabilities(5);
  const { data: componentData, isLoading: componentLoading } = useComponentInventory();
  const { data: subscriptionData, isLoading: subLoading } = useCurrentSubscription();

  const stats = statsData?.data || {};
  const activities = activitiesData?.data?.activities || [];
  const vulnerabilityTrend = trendData?.data?.trend || [];
  const sbomAnalytics = sbomData?.data || {};
  const riskScores = riskData?.data || {};
  const compliance = complianceData?.data || {};
  const topVulnerabilities = topVulnData?.data?.vulnerabilities || [];
  const components = componentData?.data || {};
  const subscription = subscriptionData?.subscription;

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      // Simulate file upload
      setTimeout(() => {
        alert(`SBOM file "${file.name}" uploaded successfully!`);
        setUploadFile(null);
        event.target.value = '';
      }, 1000);
    }
  };

  const filteredVulnerabilities = filterSeverity === 'all' 
    ? topVulnerabilities 
    : topVulnerabilities.filter(v => v.severity === filterSeverity);

  if (statsLoading) {
    return (
      <AdminLayout>
        <div className="admin-dashboard">
          <div className="loading-dashboard">
            <div className="spinner-large"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Comprehensive SBOM, Vulnerability, Risk, Compliance & Billing Management</p>
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

        {/* === ANALYTICS SECTION === */}
        <div className="analytics-section">
          <h2 className="section-title">📊 Analytics & Insights</h2>
          
          {/* Analytics Grid */}
          <div className="analytics-grid">
            {/* Vulnerability Trend Chart */}
            <div className="analytics-card full-width">
              <div className="card-header">
                <h3>Vulnerability Trends (Last 7 Days)</h3>
                <span className="badge badge-info">Real-time</span>
              </div>
              {trendLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <AreaChartComponent
                  data={vulnerabilityTrend}
                  areas={[
                    { key: 'critical', name: 'Critical', color: '#ef4444' },
                    { key: 'high', name: 'High', color: '#f59e0b' },
                    { key: 'medium', name: 'Medium', color: '#eab308' },
                    { key: 'low', name: 'Low', color: '#10b981' },
                  ]}
                  xKey="date"
                  height={300}
                  stacked={true}
                />
              )}
            </div>

            {/* Risk Score Distribution */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Risk Distribution</h3>
                <span className="risk-score">
                  Score: <strong>{riskScores.overallRisk || 0}</strong>/10
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

              {/* Risk by Project (severity breakdown) */}
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Risk by Project (Severity)</h3>
                </div>
                {riskLoading ? (
                  <div className="chart-loading">
                    <div className="spinner-large"></div>
                  </div>
                ) : (
                  <RiskByProjectChart
                    projects={riskScores.riskByProject || []}
                    distribution={riskScores.distribution || []}
                    xKey="project"
                    height={280}
                  />
                )}
              </div>

            {/* SBOM Analytics */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>SBOM Scan Activity</h3>
                <span className="badge badge-success">+{sbomAnalytics.scannedToday || 0} today</span>
              </div>
              {sbomLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <LineChartComponent
                  data={sbomAnalytics.sbomTrend || []}
                  lines={[
                    { key: 'scanned', name: 'Scanned', color: '#3b82f6' },
                    { key: 'uploaded', name: 'Uploaded', color: '#10b981' },
                  ]}
                  xKey="date"
                  height={280}
                />
              )}
            </div>

            {/* Compliance Score */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Compliance Trend</h3>
                <span className="compliance-score">
                  {compliance.overallScore || 0}%
                </span>
              </div>
              {complianceLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <AreaChartComponent
                  data={compliance.complianceTrend || []}
                  areas={[
                    { key: 'score', name: 'Compliance Score', color: '#10b981' },
                  ]}
                  xKey="date"
                  height={280}
                />
              )}
            </div>

            {/* Top Languages */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Technology Stack</h3>
                <span className="badge badge-primary">Top 5</span>
              </div>
              {sbomLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <BarChartComponent
                  data={sbomAnalytics.topLanguages || []}
                  bars={[
                    { key: 'count', name: 'Projects', color: '#3b82f6' },
                  ]}
                  xKey="name"
                  height={280}
                />
              )}
            </div>

            {/* Component Inventory Summary */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Component Inventory</h3>
                <span className="badge badge-warning">
                  {components.vulnerable || 0} vulnerable
                </span>
              </div>
              {componentLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <div className="component-stats">
                  <div className="stat-row">
                    <span>Total Components</span>
                    <strong>{components.total || 0}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Outdated</span>
                    <strong className="text-warning">{components.outdated || 0}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Vulnerable</span>
                    <strong className="text-danger">{components.vulnerable || 0}</strong>
                  </div>
                  <div className="component-chart">
                    <PieChartComponent
                      data={[
                        { name: 'Up-to-date', value: (components.total || 0) - (components.outdated || 0) - (components.vulnerable || 0) },
                        { name: 'Outdated', value: components.outdated || 0 },
                        { name: 'Vulnerable', value: components.vulnerable || 0 }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      height={180}
                      colors={['#10b981', '#f59e0b', '#ef4444']}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === VULNERABILITY REPORTS SECTION === */}
        <div className="reports-section">
          <h2 className="section-title">🔍 Top Vulnerabilities</h2>
          
          <div className="reports-grid">
            {/* Top Vulnerabilities Table */}
            <div className="report-card full-width">
              <div className="card-header">
                <h3>Critical & High Severity Vulnerabilities</h3>
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
                  <Link to="/admin/reports" className="view-all-link">
                    View Full Report →
                  </Link>
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
                        <th>CVSS Score</th>
                        <th>Affected</th>
                        <th>Status</th>
                        <th>Discovered</th>
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
                        filteredVulnerabilities.slice(0, 10).map((vuln) => (
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
                            <td>{new Date(vuln.discovered).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Compliance Standards */}
            <div className="report-card">
              <div className="card-header">
                <h3>Compliance Standards</h3>
                <span className="badge badge-success">
                  {compliance.complianceStandards?.filter(s => s.status === 'passing').length || 0}/
                  {compliance.complianceStandards?.length || 0} Passing
                </span>
              </div>
              {complianceLoading ? (
                <div className="table-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <div className="compliance-list">
                  {compliance.complianceStandards?.map((standard, index) => (
                    <div key={index} className="compliance-item">
                      <div className="compliance-info">
                        <strong>{standard.name}</strong>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${standard.status}`}
                            style={{ width: `${standard.score}%` }}
                          />
                        </div>
                        <div className="compliance-meta">
                          <span>{standard.score}% / Target: {standard.target}%</span>
                          <span className={`status-dot ${standard.status}`}></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === INTERACTIVE FEATURES === */}
        <div className="interactive-section">
          <h2 className="section-title">🔧 Quick Actions & Module Access</h2>
          
          <div className="tools-grid">
            {/* SBOM Upload */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3>Upload SBOM</h3>
              <p>Upload SBOM files for analysis</p>
              <input
                type="file"
                id="sbom-upload"
                accept=".json,.xml,.spdx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="sbom-upload" className="upload-btn">
                {uploadFile ? `Uploading ${uploadFile.name}...` : 'Choose File'}
              </label>
              <small>Supported formats: JSON, XML, SPDX</small>
            </div>

            {/* Generate Report */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3>Generate Report</h3>
              <p>Create comprehensive vulnerability report</p>
              <Link to="/admin/reports" className="action-btn">
                Go to Reports
              </Link>
              <small>Includes all analytics and findings</small>
            </div>

            {/* Billing & Subscription */}
            <Link to="/admin/billing" className="tool-card tool-card-link">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3>Billing Status</h3>
              <p>View invoices and payment history</p>
              {!subLoading && subscription && (
                <div className="subscription-badge">
                  <span className={`status-indicator ${subscription.status}`}></span>
                  {subscription.planName || 'Active'}
                </div>
              )}
              <small>Manage payment methods</small>
            </Link>

            {/* Subscription Management */}
            <Link to="/admin/subscription" className="tool-card tool-card-link">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Subscription</h3>
              <p>Manage your subscription plan</p>
              {!subLoading && subscription && (
                <div className="plan-info">
                  <strong>${(subscription.amount || 0) / 100}/mo</strong>
                </div>
              )}
              <small>Upgrade or modify plan</small>
            </Link>

            {/* User Management */}
            <Link to="/admin/users" className="tool-card tool-card-link">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>User Management</h3>
              <p>Manage users, roles, and permissions</p>
              <div className="user-count-badge">
                {stats.users?.total || 0} Users
              </div>
              <small>View and manage all users</small>
            </Link>

            {/* Data Refresh */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3>Refresh Data</h3>
              <p>Update all analytics and statistics</p>
              <button className="action-btn" onClick={() => window.location.reload()}>
                Refresh Dashboard
              </button>
              <small>Last updated: {new Date().toLocaleTimeString()}</small>
            </div>
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
      </div>
    </AdminLayout>
  );
}
