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
  useCompliance,
  useTopVulnerabilities,
} from '../../hooks/useDashboard';
import './Dashboard.css';
import '../Admin/AnalyticsDashboard.css';

export default function AnalystDashboard() {
  const [timeRange, setTimeRange] = useState('7');
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // Fetch dashboard data
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading } = useRecentActivities(6);
  const { data: trendData, isLoading: trendLoading } = useVulnerabilityTrend(parseInt(timeRange));
  const { data: sbomData, isLoading: sbomLoading } = useSBOMAnalytics();
  const { data: riskData, isLoading: riskLoading } = useRiskScores();
  const { data: complianceData, isLoading: complianceLoading } = useCompliance();
  const { data: topVulnData, isLoading: topVulnLoading } = useTopVulnerabilities(10);

  const stats = statsData?.data || {};
  const activities = activitiesData?.data?.activities || [];
  const vulnerabilityTrend = trendData?.data?.trend || [];
  const sbomAnalytics = sbomData?.data || {};
  const riskScores = riskData?.data || {};
  const compliance = complianceData?.data || {};
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

  // Filter vulnerabilities by severity
  const filteredVulnerabilities = filterSeverity === 'all'
    ? topVulnerabilities
    : topVulnerabilities.filter(v => v.severity === filterSeverity);

  // Calculate trend percentages
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Analyst-specific stats
  const analystStats = [
    {
      title: 'Total Risk Score',
      value: riskScores.overallRisk || 6.5,
      subValue: '/10',
      change: -5,
      icon: '🎯',
      color: 'warning',
    },
    {
      title: 'High Risk Items',
      value: stats.criticalVulnerabilities || 0,
      change: -12,
      icon: '⚠️',
      color: 'danger',
    },
    {
      title: 'Compliance Score',
      value: `${compliance.overallScore || 0}%`,
      change: +8,
      icon: '✅',
      color: 'success',
    },
    {
      title: 'Analyzed Projects',
      value: stats.totalSBOMs || 0,
      change: +15,
      icon: '📊',
      color: 'primary',
    },
  ];

  // Risk assessment data
  const riskAssessment = [
    { 
      category: 'Critical Vulnerabilities',
      count: stats.criticalVulnerabilities || 0,
      trend: -12,
      status: 'improving'
    },
    { 
      category: 'High Risk Components',
      count: 28,
      trend: -5,
      status: 'improving'
    },
    { 
      category: 'Compliance Gaps',
      count: 5,
      trend: +2,
      status: 'degrading'
    },
    { 
      category: 'Security Incidents',
      count: 2,
      trend: 0,
      status: 'stable'
    },
  ];

  return (
    <AdminLayout>
      <div className="analytics-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Analyst Dashboard</h1>
            <p>Risk Analysis, Trend Reports & Compliance Metrics</p>
          </div>
          <div className="header-actions">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
              style={{ marginRight: '1rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
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
            analystStats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <div className="stat-value">
                    {stat.value}
                    {stat.subValue && <span style={{ fontSize: '1rem', color: '#888' }}>{stat.subValue}</span>}
                  </div>
                  <div className={`stat-change ${stat.change > 0 ? 'positive' : stat.change < 0 ? 'negative' : 'neutral'}`}>
                    {stat.change > 0 ? '↑' : stat.change < 0 ? '↓' : '→'} {Math.abs(stat.change)}% from last period
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* === RISK ANALYTICS === */}
        <div className="analytics-section">
          <h2 className="section-title">📈 Risk & Trend Analysis</h2>
          
          <div className="analytics-grid">
            {/* Risk Trend Over Time */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Risk Trend Analysis</h3>
                <span className="badge badge-warning">Overall Risk: {riskScores.overallRisk || 0}/10</span>
              </div>
              {trendLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <LineChartComponent
                  data={vulnerabilityTrend}
                  lines={[
                    { key: 'critical', name: 'Critical', color: '#ef4444' },
                    { key: 'high', name: 'High', color: '#f59e0b' },
                    { key: 'medium', name: 'Medium', color: '#eab308' },
                    { key: 'low', name: 'Low', color: '#10b981' },
                  ]}
                  xKey="date"
                  height={300}
                />
              )}
            </div>

            {/* Risk Distribution */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Risk Distribution</h3>
                <span className="risk-score">
                  Total Items: <strong>{Object.values(riskScores.distribution || []).reduce((a, b) => a + (b.value || 0), 0)}</strong>
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

            {/* Compliance Trend */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Compliance Score Trend</h3>
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

            {/* SBOM Analysis Coverage */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Analysis Coverage</h3>
                <span className="badge badge-primary">+{sbomAnalytics.scannedToday || 0} today</span>
              </div>
              {sbomLoading ? (
                <div className="chart-loading">
                  <div className="spinner-large"></div>
                </div>
              ) : (
                <BarChartComponent
                  data={sbomAnalytics.topLanguages || []}
                  bars={[
                    { key: 'count', name: 'Projects Analyzed', color: '#3b82f6' },
                  ]}
                  xKey="name"
                  height={280}
                />
              )}
            </div>
          </div>
        </div>

        {/* === RISK ASSESSMENT === */}
        <div className="reports-section">
          <h2 className="section-title">🎯 Risk Assessment</h2>
          
          <div className="reports-grid">
            {/* Risk Categories */}
            <div className="report-card">
              <div className="card-header">
                <h3>Risk Categories</h3>
                <span className="badge badge-info">4 categories</span>
              </div>
              <div className="risk-categories">
                {riskAssessment.map((risk, index) => (
                  <div key={index} className="risk-category-item">
                    <div className="risk-info">
                      <strong>{risk.category}</strong>
                      <div className="risk-meta">
                        <span className="risk-count">{risk.count} items</span>
                        <span className={`trend-indicator ${risk.status}`}>
                          {risk.trend > 0 ? '↑' : risk.trend < 0 ? '↓' : '→'} {Math.abs(risk.trend)}%
                        </span>
                      </div>
                    </div>
                    <div className={`status-indicator ${risk.status}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Standards */}
            <div className="report-card">
              <div className="card-header">
                <h3>Compliance Status</h3>
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

            {/* Top Vulnerabilities */}
            <div className="report-card full-width">
              <div className="card-header">
                <h3>Critical Vulnerabilities Report</h3>
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
                        <th>CVSS Score</th>
                        <th>Risk Level</th>
                        <th>Affected</th>
                        <th>Status</th>
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
                            <td>
                              <span className={`risk-level ${vuln.cvssScore >= 9 ? 'critical' : vuln.cvssScore >= 7 ? 'high' : 'medium'}`}>
                                {vuln.cvssScore >= 9 ? 'Critical' : vuln.cvssScore >= 7 ? 'High' : 'Medium'}
                              </span>
                            </td>
                            <td>{vuln.affected} projects</td>
                            <td>
                              <span className={`status-badge ${vuln.status}`}>
                                {vuln.status.replace('-', ' ')}
                              </span>
                            </td>
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

        {/* === ANALYTICS TOOLS === */}
        <div className="interactive-section">
          <h2 className="section-title">🔧 Analysis Tools</h2>
          
          <div className="tools-grid">
            {/* Risk Assessment Report */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Risk Assessment Report</h3>
              <p>Comprehensive risk analysis report</p>
              <button className="action-btn" onClick={() => alert('Generating risk assessment report...')}>
                Generate Report
              </button>
              <small>PDF with trends, metrics, recommendations</small>
            </div>

            {/* Trend Analysis */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3>Trend Analysis</h3>
              <p>Historical trends and predictions</p>
              <button className="action-btn" onClick={() => alert('Starting trend analysis...')}>
                Analyze Trends
              </button>
              <small>AI-powered insights and forecasts</small>
            </div>

            {/* Compliance Audit */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Compliance Audit</h3>
              <p>Run comprehensive compliance check</p>
              <button className="action-btn" onClick={() => alert('Running compliance audit...')}>
                Run Audit
              </button>
              <small>Check against all standards</small>
            </div>

            {/* Export Data */}
            <div className="tool-card">
              <div className="tool-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3>Export Analytics</h3>
              <p>Download data for external analysis</p>
              <button className="action-btn" onClick={() => alert('Exporting analytics data...')}>
                Export CSV/Excel
              </button>
              <small>Includes all metrics and raw data</small>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <div className="section-header">
            <h2>Recent Analysis Activity</h2>
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
                  <th>Analyst</th>
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
