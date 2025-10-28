import { useState, useMemo } from 'react';
import { useTopVulnerabilities, useCompliance, useComponentInventory } from '../../hooks/useDashboard';
import AdminLayout from '../../components/AdminLayout';
import './Reports.css';

const Reports = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [reportType, setReportType] = useState('vulnerabilities'); // vulnerabilities, compliance, components, all

  // Fetch data
  const { data: topVulnData, isLoading: topVulnLoading } = useTopVulnerabilities();
  const { data: complianceData, isLoading: complianceLoading } = useCompliance();
  const { data: componentData, isLoading: componentLoading } = useComponentInventory();

  const vulnerabilities = topVulnData?.data?.vulnerabilities || [];
  const compliance = complianceData?.data || {};
  const components = componentData?.data || {};

  // Filter vulnerabilities by severity
  const filteredVulnerabilities = useMemo(() => {
    if (filterSeverity === 'all') return vulnerabilities;
    return vulnerabilities.filter(vuln => vuln.severity === filterSeverity);
  }, [vulnerabilities, filterSeverity]);

  // Export functionality
  const handleExportReport = (format) => {
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
    // In production, this would generate and download the report
  };

  return (
    <AdminLayout>
      <div className="reports-page">
        {/* Page Header */}
        <div className="reports-header">
          <div className="header-content">
            <h1>Reports & Analysis</h1>
            <p>Comprehensive security reports, compliance tracking, and component analysis</p>
          </div>
          <div className="header-actions">
            <div className="report-type-selector">
              <label>Report Type:</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="all">All Reports</option>
                <option value="vulnerabilities">Vulnerabilities</option>
                <option value="compliance">Compliance</option>
                <option value="components">Components</option>
              </select>
            </div>
            <div className="export-buttons">
              <button className="export-btn" onClick={() => handleExportReport('pdf')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
              <button className="export-btn" onClick={() => handleExportReport('csv')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Statistics Overview */}
        <div className="report-stats-overview">
          <div className="stat-card">
            <div className="stat-icon critical">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Total Vulnerabilities</h3>
              <p className="stat-value">{vulnerabilities.length}</p>
              <small className="stat-meta">
                {vulnerabilities.filter(v => v.severity === 'critical').length} Critical
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Compliance Score</h3>
              <p className="stat-value">
                {compliance.complianceStandards?.filter(s => s.status === 'passing').length || 0}/
                {compliance.complianceStandards?.length || 0}
              </p>
              <small className="stat-meta">Standards Passing</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Components</h3>
              <p className="stat-value">{components.total || 0}</p>
              <small className="stat-meta">{components.vulnerable || 0} Vulnerable</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon info">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-details">
              <h3>Last Updated</h3>
              <p className="stat-value">{new Date().toLocaleDateString()}</p>
              <small className="stat-meta">{new Date().toLocaleTimeString()}</small>
            </div>
          </div>
        </div>

        {/* Vulnerabilities Report */}
        {(reportType === 'all' || reportType === 'vulnerabilities') && (
          <div className="report-section">
            <div className="section-header">
              <h2>Vulnerability Report</h2>
              <div className="filter-group">
                <label>Filter by Severity:</label>
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
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading vulnerabilities...</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>CVE ID</th>
                      <th>Title</th>
                      <th>Severity</th>
                      <th>CVSS Score</th>
                      <th>Affected Projects</th>
                      <th>Status</th>
                      <th>Discovered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVulnerabilities.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="empty-state">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>No vulnerabilities found for the selected filter</p>
                        </td>
                      </tr>
                    ) : (
                      filteredVulnerabilities.map((vuln) => (
                        <tr key={vuln.id}>
                          <td><code className="cve-code">{vuln.id}</code></td>
                          <td className="vuln-title">{vuln.title}</td>
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
                          <td>
                            <button className="action-btn-small" title="View Details">
                              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Compliance Report */}
        {(reportType === 'all' || reportType === 'compliance') && (
          <div className="report-section">
            <div className="section-header">
              <h2>Compliance Report</h2>
              <span className="badge badge-success">
                {compliance.complianceStandards?.filter(s => s.status === 'passing').length || 0}/
                {compliance.complianceStandards?.length || 0} Standards Passing
              </span>
            </div>

            {complianceLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading compliance data...</p>
              </div>
            ) : (
              <div className="compliance-grid">
                {compliance.complianceStandards?.map((standard, index) => (
                  <div key={index} className="compliance-card">
                    <div className="compliance-header">
                      <h3>{standard.name}</h3>
                      <span className={`status-badge ${standard.status}`}>
                        {standard.status}
                      </span>
                    </div>
                    <div className="compliance-body">
                      <div className="score-display">
                        <div className="score-circle">
                          <svg className="score-ring" viewBox="0 0 120 120">
                            <circle 
                              cx="60" 
                              cy="60" 
                              r="50" 
                              fill="none" 
                              stroke="#e2e8f0" 
                              strokeWidth="10"
                            />
                            <circle 
                              cx="60" 
                              cy="60" 
                              r="50" 
                              fill="none" 
                              stroke={standard.status === 'passing' ? '#10b981' : '#f59e0b'} 
                              strokeWidth="10"
                              strokeDasharray={`${standard.score * 3.14} 314`}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                            />
                          </svg>
                          <div className="score-text">
                            <span className="score-value">{standard.score}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="compliance-details">
                        <div className="detail-row">
                          <span>Target Score:</span>
                          <strong>{standard.target}%</strong>
                        </div>
                        <div className="detail-row">
                          <span>Gap:</span>
                          <strong className={standard.score >= standard.target ? 'text-success' : 'text-warning'}>
                            {standard.target - standard.score}%
                          </strong>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${standard.status}`}
                            style={{ width: `${standard.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Component Inventory Report */}
        {(reportType === 'all' || reportType === 'components') && (
          <div className="report-section">
            <div className="section-header">
              <h2>Component Inventory Report</h2>
              <span className="badge badge-warning">
                {components.vulnerable || 0} Vulnerable Components
              </span>
            </div>

            {componentLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading component data...</p>
              </div>
            ) : (
              <div className="component-report">
                <div className="component-summary">
                  <div className="summary-card">
                    <h4>Total Components</h4>
                    <p className="summary-value">{components.total || 0}</p>
                  </div>
                  <div className="summary-card warning">
                    <h4>Outdated</h4>
                    <p className="summary-value">{components.outdated || 0}</p>
                  </div>
                  <div className="summary-card danger">
                    <h4>Vulnerable</h4>
                    <p className="summary-value">{components.vulnerable || 0}</p>
                  </div>
                </div>

                <div className="component-list-detailed">
                  <h3>Component Details</h3>
                  <div className="components-table">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Component Name</th>
                          <th>Version</th>
                          <th>Usage Count</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {components.topComponents?.map((comp, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{comp.name}</strong>
                            </td>
                            <td>
                              <code className="version-badge">v{comp.version}</code>
                            </td>
                            <td>{comp.usageCount} uses</td>
                            <td>
                              {comp.hasVulnerability ? (
                                <span className="status-badge critical">
                                  Vulnerable
                                </span>
                              ) : (
                                <span className="status-badge success">
                                  Secure
                                </span>
                              )}
                            </td>
                            <td>{new Date().toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Footer Actions */}
        <div className="report-footer">
          <div className="footer-info">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Reports are generated in real-time based on the latest scan data. Schedule automated reports from Settings.</p>
          </div>
          <div className="footer-actions">
            <button className="btn-secondary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Report
            </button>
            <button className="btn-secondary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download All
            </button>
            <button className="btn-primary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
