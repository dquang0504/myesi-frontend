import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { AreaChartComponent, BarChartComponent } from '../../components/ChartComponent';
import './Reports.css';

export default function AnalystReports() {
  const vulnTrend = [
    { date: '2025-01-01', critical: 5, high: 8, medium: 12 },
    { date: '2025-02-01', critical: 6, high: 9, medium: 10 },
    { date: '2025-03-01', critical: 4, high: 7, medium: 11 },
    { date: '2025-04-01', critical: 7, high: 6, medium: 9 },
  ];

  const complianceSummary = [
    { name: 'Passed', value: 320 },
    { name: 'Failed', value: 45 },
  ];

  return (
    <AdminLayout>
      <div className="reports-page">
        <div className="page-header">
          <div>
            <h1>Reports & Analysis</h1>
            <p className="muted">Analyst reports: trends, compliance summaries and exportable findings</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card">
            <div className="card-header"><h2>Vulnerability Trends</h2></div>
            <div className="card-content">
              <AreaChartComponent data={vulnTrend} areas={[{ key: 'critical', name: 'Critical', color: '#ef4444' }, { key: 'high', name: 'High', color: '#f59e0b' }, { key: 'medium', name: 'Medium', color: '#10b981' }]} xKey="date" height={220} />
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Compliance Summary</h2></div>
            <div className="card-content">
              <BarChartComponent data={[{ name: 'Compliance', passed: 320, failed: 45 }]} bars={[{ key: 'passed', name: 'Passed', color: '#10b981' }, { key: 'failed', name: 'Failed', color: '#ef4444' }]} xKey="name" height={220} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Exportable Findings</h2></div>
          <div className="card-content">
            <p className="muted">Select filters and export findings as CSV/PDF for audits.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-outline">Export CSV</button>
              <button className="btn btn-outline" style={{ marginLeft: 8 }}>Export PDF</button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
