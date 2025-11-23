import React from 'react';
import '../styles/heatmap.css';

/**
 * HeatmapComponent - A flexible heatmap visualization component
 * @param {Array} data - Array of objects with x, y, and value properties
 * @param {string} xKey - Key for x-axis labels (default: 'x')
 * @param {string} yKey - Key for y-axis labels (default: 'y')
 * @param {string} valueKey - Key for cell values (default: 'value')
 * @param {number} height - Height of the heatmap (default: 400)
 * @param {Function} colorScale - Function to map values to colors
 * @param {string} title - Optional title for the heatmap
 */
const HeatmapComponent = ({ 
  data = [], 
  xKey = 'x', 
  yKey = 'y', 
  valueKey = 'value',
  height = 400,
  colorScale = null,
  title = '',
  showValues = true,
  tooltip = true,
}) => {
  // Extract unique x and y values
  const xValues = [...new Set(data.map(item => item[xKey]))];
  const yValues = [...new Set(data.map(item => item[yKey]))];

  // Find min and max values for color scaling
  const values = data.map(item => item[valueKey]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Default color scale function (green to red gradient based on risk)
  const defaultColorScale = (value) => {
    if (value === null || value === undefined) return '#f1f5f9';
    
    const normalized = (value - minValue) / (maxValue - minValue || 1);
    
    // Risk-based color scale
    if (normalized >= 0.8) return '#dc2626'; // Critical - Red
    if (normalized >= 0.6) return '#ea580c'; // High - Orange
    if (normalized >= 0.4) return '#f59e0b'; // Medium-High - Amber
    if (normalized >= 0.2) return '#fbbf24'; // Medium - Yellow
    return '#10b981'; // Low - Green
  };

  const getColor = colorScale || defaultColorScale;

  // Get cell data for specific x, y coordinates
  const getCellData = (x, y) => {
    return data.find(item => item[xKey] === x && item[yKey] === y);
  };

  // Format value for display
  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') return value.toFixed(1);
    return value;
  };

  // Get risk level label
  const getRiskLevel = (value) => {
    if (value === null || value === undefined) return 'No Data';
    const normalized = (value - minValue) / (maxValue - minValue || 1);
    if (normalized >= 0.8) return 'Critical';
    if (normalized >= 0.6) return 'High';
    if (normalized >= 0.4) return 'Medium';
    if (normalized >= 0.2) return 'Low';
    return 'Very Low';
  };

  return (
    <div className="heatmap-container" style={{ height: `${height}px` }}>
      {title && <h3 className="heatmap-title">{title}</h3>}
      
      <div className="heatmap-wrapper">
        <div className="heatmap-grid">
          {/* Y-axis labels */}
          <div className="heatmap-y-axis">
            <div className="heatmap-corner"></div>
            {yValues.map((yVal, idx) => (
              <div key={idx} className="heatmap-y-label">
                {yVal}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="heatmap-cells">
            {/* X-axis labels */}
            <div className="heatmap-x-axis">
              {xValues.map((xVal, idx) => (
                <div key={idx} className="heatmap-x-label">
                  {xVal}
                </div>
              ))}
            </div>

            {/* Data cells */}
            <div className="heatmap-rows">
              {yValues.map((yVal, yIdx) => (
                <div key={yIdx} className="heatmap-row">
                  {xValues.map((xVal, xIdx) => {
                    const cellData = getCellData(xVal, yVal);
                    const value = cellData ? cellData[valueKey] : null;
                    const color = getColor(value);
                    const riskLevel = getRiskLevel(value);

                    return (
                      <div
                        key={`${xIdx}-${yIdx}`}
                        className="heatmap-cell"
                        style={{ backgroundColor: color }}
                        title={tooltip ? `${xVal} - ${yVal}: ${formatValue(value)} (${riskLevel})` : ''}
                      >
                        {showValues && (
                          <span className="heatmap-cell-value">
                            {formatValue(value)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="heatmap-legend">
          <div className="legend-title">Risk Level</div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span>Low (0-2)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
              <span>Medium (2-4)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Medium-High (4-6)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ea580c' }}></div>
              <span>High (6-8)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
              <span>Critical (8-10)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapComponent;
