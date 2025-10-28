import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Compliance.css';

export default function AuditorCompliance() {
  const frameworks = [
    { name: 'ISO 27001', score: 92, status: 'Compliant', controls: 114, passed: 105, failed: 9 },
    { name: 'SOC 2', score: 88, status: 'Compliant', controls: 64, passed: 56, failed: 8 },
    { name: 'GDPR', score: 95, status: 'Compliant', controls: 43, passed: 41, failed: 2 },
    { name: 'PCI DSS', score: 78, status: 'Needs Attention', controls: 78, passed: 61, failed: 17 },
    { name: 'HIPAA', score: 85, status: 'Compliant', controls: 52, passed: 44, failed: 8 },
    { name: 'NIST CSF', score: 90, status: 'Compliant', controls: 98, passed: 88, failed: 10 },
  ];

  const complianceOverTime = [
    { month: 'Jul', iso27001: 88, soc2: 85, gdpr: 92, pciDss: 75 },
    { month: 'Aug', iso27001: 89, soc2: 86, gdpr: 93, pciDss: 76 },
    { month: 'Sep', iso27001: 90, soc2: 86, gdpr: 94, pciDss: 76 },
    { month: 'Oct', iso27001: 91, soc2: 87, gdpr: 94, pciDss: 77 },
    { month: 'Nov', iso27001: 91, soc2: 87, gdpr: 95, pciDss: 77 },
    { month: 'Dec', iso27001: 92, soc2: 88, gdpr: 95, pciDss: 78 },
    { month: 'Jan', iso27001: 92, soc2: 88, gdpr: 95, pciDss: 78 },
  ];

  const complianceDistribution = [
    { name: 'Compliant', value: 449, color: '#10b981' },
    { name: 'Non-Compliant', value: 54, color: '#ef4444' },
  ];

  const totalControls = 449 + 54;
  const compliancePercentage = Math.round((449 / totalControls) * 100);

  return (
    <AdminLayout>
      <div className="compliance-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Compliance Overview</h1>
            <p>Read-only view of compliance status across frameworks</p>
          </div>
          <button className="btn btn-outline">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Compliance Report
          </button>
        </div>

        {/* Overall Compliance Score */}
        <div className="card compliance-score-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', marginRight: '8px', color: '#3b82f6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Overall Compliance Score
            </h2>
          </div>
          <div className="card-content">
            <div className="compliance-score-container">
              <span className="compliance-score-big">{compliancePercentage}%</span>
              <div className="compliance-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${compliancePercentage}%` }}></div>
                </div>
                <p className="compliance-stats">449 controls passed • 54 controls need attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Charts */}
        <div className="charts-grid">
          {/* Compliance Distribution */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Control Status Distribution</h2>
            </div>
            <div className="card-content">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={complianceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {complianceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Compliance Trend</h2>
            </div>
            <div className="card-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="iso27001" name="ISO 27001" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="soc2" name="SOC 2" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gdpr" name="GDPR" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pciDss" name="PCI DSS" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Compliance Frameworks Grid */}
        <div className="frameworks-grid">
          {frameworks.map((framework, idx) => (
            <div key={idx} className="card framework-card">
              <div className="card-header">
                <div>
                  <h3 className="framework-title">{framework.name}</h3>
                  <p className="framework-controls">{framework.controls} controls</p>
                </div>
                <span className={`badge ${framework.status === 'Compliant' ? 'badge-success' : 'badge-warning'}`}>
                  {framework.status}
                </span>
              </div>
              <div className="card-content">
                <div className="framework-score-section">
                  <div className="framework-score-header">
                    <span className="framework-score-label">Compliance Score</span>
                    <span className="framework-score-value">{framework.score}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${framework.score}%` }}></div>
                  </div>
                </div>
                <div className="framework-metrics">
                  <div className="metric-item metric-success">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{framework.passed} passed</span>
                  </div>
                  <div className="metric-item metric-error">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{framework.failed} failed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Framework Details */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Framework Status Summary</h2>
          </div>
          <div className="card-content">
            <div className="framework-details-list">
              {frameworks.map((framework, idx) => (
                <div key={idx} className="framework-detail-item">
                  <div className="framework-detail-header">
                    <div>
                      <h3 className="framework-detail-title">{framework.name}</h3>
                      <p className="framework-detail-meta">
                        {framework.controls} total controls • Last audit: January 2025
                      </p>
                    </div>
                    <span className={`badge ${framework.status === 'Compliant' ? 'badge-success' : 'badge-warning'}`}>
                      {framework.status}
                    </span>
                  </div>
                  <div className="framework-detail-stats">
                    <div className="detail-stat">
                      <p className="detail-stat-label">Compliance Score</p>
                      <p className="detail-stat-value">{framework.score}%</p>
                    </div>
                    <div className="detail-stat">
                      <p className="detail-stat-label">Passed Controls</p>
                      <p className="detail-stat-value" style={{ color: '#10b981' }}>{framework.passed}</p>
                    </div>
                    <div className="detail-stat">
                      <p className="detail-stat-label">Failed Controls</p>
                      <p className="detail-stat-value" style={{ color: '#ef4444' }}>{framework.failed}</p>
                    </div>
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
