import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { AreaChartComponent, BarChartComponent, PieChartComponent } from '../../components/ChartComponent';
import './Reports.css';

export default function DeveloperReports() {
  const topVulnerabilities = [
    { id: 'VULN-001', cve: 'CVE-2025-0001', severity: 'Critical', occurrences: 12, component: 'openssl' },
    { id: 'VULN-002', cve: 'CVE-2025-0002', severity: 'High', occurrences: 34, component: 'lodash' },
    { id: 'VULN-003', cve: 'CVE-2025-0003', severity: 'Medium', occurrences: 58, component: 'express' },
  ];

  const complianceTrend = [
    { date: '2025-01-01', score: 82 },
    { date: '2025-02-01', score: 84 },
    { date: '2025-03-01', score: 87 },
    { date: '2025-04-01', score: 88 },
    { date: '2025-05-01', score: 90 },
  ];

  const distribution = [
    { name: 'Critical', value: 12 },
    { name: 'High', value: 34 },
    { name: 'Medium', value: 58 },
    { name: 'Low', value: 120 },
  ];

  return (
    <AdminLayout>
      <div className="reports-page">
        <div className="page-header">
          <div>
            <h1>Reports & Analysis</h1>
            <p className="muted">Developer-focused reports: vulnerabilities, component inventory and compliance trend</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="card small-card">
            <div className="card-content">
              <p className="card-label">Open Vulnerabilities</p>
              <p className="card-value">204</p>
            </div>
          </div>
          <div className="card small-card">
            <div className="card-content">
              <p className="card-label">Critical</p>
              <p className="card-value">12</p>
            </div>
          </div>
          <div className="card small-card">
            <div className="card-content">
              <p className="card-label">High</p>
              <p className="card-value">34</p>
            </div>
          </div>
          <div className="card small-card">
            <div className="card-content">
              <p className="card-label">Components</p>
              <p className="card-value">1,242</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card">
            <div className="card-header">
              <h2>Vulnerability Distribution</h2>
            </div>
            <div className="card-content">
              <PieChartComponent data={distribution} height={220} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Compliance Trend</h2>
            </div>
            <div className="card-content">
              <AreaChartComponent data={complianceTrend} areas={[{ key: 'score', name: 'Compliance Score', color: '#10b981' }]} xKey="date" height={220} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Top Vulnerabilities</h2>
          </div>
          <div className="card-content">
            <table className="data-table">
              <thead>
                <tr>
                  <th>CVE</th>
                  <th>Component</th>
                  <th>Severity</th>
                  <th>Occurrences</th>
                </tr>
              </thead>
              <tbody>
                {topVulnerabilities.map((v) => (
                  <tr key={v.id}>
                    <td>{v.cve}</td>
                    <td>{v.component}</td>
                    <td>{v.severity}</td>
                    <td>{v.occurrences}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
