import React from 'react';
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
  useVulnerabilityTrend,
  useSBOMAnalytics,
  useRiskScores,
  useCompliance,
  useRiskHeatmap,
} from '../../hooks/useDashboard';
import './Dashboard.css';

export default function AuditorDashboard() {
  // Read-only: fetch metrics for visualization only
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: trendData, isLoading: trendLoading } = useVulnerabilityTrend(14);
  const { data: sbomData, isLoading: sbomLoading } = useSBOMAnalytics();
  const { data: riskData, isLoading: riskLoading } = useRiskScores();
  const { data: complianceData, isLoading: complianceLoading } = useCompliance();
  const { data: heatmapData, isLoading: heatmapLoading } = useRiskHeatmap('projects');

  const stats = statsData?.data || {};
  const vulnerabilityTrend = trendData?.data?.trend || [];
  const sbomAnalytics = sbomData?.data || {};
  const riskScores = riskData?.data || {};
  const compliance = complianceData?.data || {};
  const riskHeatmap = heatmapData?.data?.heatmap || [];

  const auditorStats = [
    {
      title: 'Overall Risk',
      value: `${riskScores.overallRisk ?? 0}/10`,
      color: 'warning',
    },
    {
      title: 'Compliance Score',
      value: `${compliance.overallScore ?? 0}%`,
      color: 'success',
    },
    {
      title: 'Projects Analyzed',
      value: stats.totalSBOMs || 0,
      color: 'primary',
    },
    {
      title: 'Critical Vulns',
      value: stats.criticalVulnerabilities || 0,
      color: 'danger',
    },
  ];

  return (
    <AdminLayout>
      <div className="analytics-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Auditor Dashboard</h1>
            <p>Read-only risk, compliance, and SBOM analytics</p>
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
            auditorStats.map((stat, index) => (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <div className="stat-value">{stat.value}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* === ANALYTICS SECTION === */}
        <div className="analytics-section">
          <h2 className="section-title">Risk, Compliance & SBOM</h2>

          <div className="analytics-grid">
            {/* Risk Trend */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Risk Trend (Last 14 Days)</h3>
                <span className="badge badge-warning">Overall Risk: {riskScores.overallRisk || 0}/10</span>
              </div>
              {trendLoading ? (
                <div className="chart-loading"><div className="spinner-large"></div></div>
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
              </div>
              {riskLoading ? (
                <div className="chart-loading"><div className="spinner-large"></div></div>
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
                <div className="chart-loading"><div className="spinner-large"></div></div>
              ) : (
                <RiskByProjectChart
                  projects={riskScores.riskByProject || []}
                  distribution={riskScores.distribution || []}
                  xKey="project"
                  height={280}
                />
              )}
            </div>

            {/* Compliance Trend */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>Compliance Score Trend</h3>
                <span className="compliance-score">{compliance.overallScore || 0}%</span>
              </div>
              {complianceLoading ? (
                <div className="chart-loading"><div className="spinner-large"></div></div>
              ) : (
                <AreaChartComponent
                  data={compliance.complianceTrend || []}
                  areas={[{ key: 'score', name: 'Compliance Score', color: '#10b981' }]}
                  xKey="date"
                  height={280}
                />
              )}
            </div>

            {/* SBOM Top Languages */}
            <div className="analytics-card">
              <div className="card-header">
                <h3>SBOM Analysis Coverage</h3>
                <span className="badge badge-primary">+{sbomAnalytics.scannedToday || 0} today</span>
              </div>
              {sbomLoading ? (
                <div className="chart-loading"><div className="spinner-large"></div></div>
              ) : (
                <BarChartComponent
                  data={sbomAnalytics.topLanguages || []}
                  bars={[{ key: 'count', name: 'Projects Analyzed', color: '#3b82f6' }]}
                  xKey="name"
                  height={280}
                />
              )}
            </div>

            {/* Project Risk Heatmap - Full Width */}
            <div className="analytics-card full-width">
              <div className="card-header">
                <h3>Project Risk Heatmap</h3>
                <span className="badge badge-info">Weekly Risk Scores</span>
              </div>
              {heatmapLoading ? (
                <div className="chart-loading"><div className="spinner-large"></div></div>
              ) : (
                <HeatmapComponent
                  data={riskHeatmap}
                  xKey="x"
                  yKey="y"
                  valueKey="value"
                  height={350}
                  showValues={true}
                  tooltip={true}
                />
              )}
            </div>
          </div>
        </div>

        {/* Read-only note */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Audit Mode</h2>
          </div>
          <div className="card-content">
            <p style={{ color: '#64748b' }}>This dashboard is read-only. Charts reflect current system state for independent verification and compliance review.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
