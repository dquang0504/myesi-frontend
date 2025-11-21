import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './ChartComponent.css';

const DEFAULT_COLORS = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#10b981',
};

/**
 * RiskByProjectChart
 * - Expects either:
 *   data: [{ project, critical, high, medium, low }] OR
 *   projects: [{ project, score }] and distribution: [{ name, value }]
 * When only projects + distribution are provided, we approximate a per-project severity
 * breakdown by scaling the overall distribution by the project's score.
 */
const RiskByProjectChart = ({ data = null, projects = [], distribution = [], xKey = 'project', height = 300 }) => {
  // Normalize distribution to object form
  const distObj = (distribution || []).reduce((acc, cur) => {
    const key = (cur.name || '').toLowerCase();
    acc[key] = cur.value || 0;
    return acc;
  }, {});

  const distTotal = Object.values(distObj).reduce((a, b) => a + (b || 0), 0) || 1;

  // Build chart data
  const chartData = (data && data.length)
    ? data.map((d) => ({
        [xKey]: d.project || d.name,
        critical: d.critical || 0,
        high: d.high || 0,
        medium: d.medium || 0,
        low: d.low || 0,
      }))
    : projects.map((p) => {
        // approximate breakdown from overall distribution
        const score = typeof p.score === 'number' ? p.score : (p.value || 0);
        return {
          [xKey]: p.project || p.name,
          critical: (distObj.critical || 0) / distTotal * score,
          high: (distObj.high || 0) / distTotal * score,
          medium: (distObj.medium || 0) / distTotal * score,
          low: (distObj.low || 0) / distTotal * score,
        };
      });

  const TooltipFormatter = (value, name) => {
    return [Number(value).toFixed(2), name.charAt(0).toUpperCase() + name.slice(1)];
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xKey} stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip formatter={TooltipFormatter} />
        <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
        <Bar dataKey="critical" stackId="a" fill={DEFAULT_COLORS.critical} />
        <Bar dataKey="high" stackId="a" fill={DEFAULT_COLORS.high} />
        <Bar dataKey="medium" stackId="a" fill={DEFAULT_COLORS.medium} />
        <Bar dataKey="low" stackId="a" fill={DEFAULT_COLORS.low} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RiskByProjectChart;
