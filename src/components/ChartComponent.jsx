import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import '../styles/chart.css';

/**
 * Reusable Chart Component with multiple chart types
 * Supports: line, bar, pie, area
 */

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Line Chart Component
export const LineChartComponent = ({ data, lines, xKey, height = 300 }) => {
  const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xKey} stroke="#64748b" style={{ fontSize: '0.875rem' }} />
        <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={line.color || colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

// Bar Chart Component
export const BarChartComponent = ({ data, bars, xKey, height = 300, stacked = false }) => {
  const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xKey} stroke="#64748b" style={{ fontSize: '0.875rem' }} />
        <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.color || colors[index % colors.length]}
            stackId={stacked ? 'stack' : undefined}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// Pie Chart Component
export const PieChartComponent = ({ data, dataKey, nameKey, height = 300, colors }) => {
  const defaultColors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];
  const chartColors = colors || defaultColors;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Area Chart Component
export const AreaChartComponent = ({ data, areas, xKey, height = 300, stacked = false }) => {
  const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          {areas.map((area, index) => {
            const color = area.color || colors[index % colors.length];
            return (
              <linearGradient key={area.key} id={`color${area.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xKey} stroke="#64748b" style={{ fontSize: '0.875rem' }} />
        <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
        {areas.map((area, index) => {
          const color = area.color || colors[index % colors.length];
          return (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              name={area.name}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${area.key})`}
              stackId={stacked ? 'stack' : undefined}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Main Chart Component with type selection
const ChartComponent = ({ type = 'line', ...props }) => {
  switch (type) {
    case 'line':
      return <LineChartComponent {...props} />;
    case 'bar':
      return <BarChartComponent {...props} />;
    case 'pie':
      return <PieChartComponent {...props} />;
    case 'area':
      return <AreaChartComponent {...props} />;
    default:
      return <LineChartComponent {...props} />;
  }
};

export default ChartComponent;
