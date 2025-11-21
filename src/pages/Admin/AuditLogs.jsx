import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuditLogs, useExportAuditLogs } from '../../hooks/useAudit';
import { useDebounce } from '../../hooks/useUsers';
import './AuditLogs.css';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(20);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, refetch } = useAuditLogs({
    page: currentPage,
    limit: pageLimit,
    search: debouncedSearch,
    level: levelFilter,
    user: userFilter,
    module: moduleFilter
  });

  const exportMutation = useExportAuditLogs();

  const logs = data?.data?.logs || [];
  const pagination = data?.data?.pagination || {};
  const stats = data?.data?.stats || {};

  const getLevelColor = (level) => {
    const colors = {
      INFO: 'level-info',
      WARNING: 'level-warning',
      ERROR: 'level-error',
      DEBUG: 'level-debug'
    };
    return colors[level] || 'level-default';
  };

  const getLevelIcon = (level) => {
    const icons = {
      INFO: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      WARNING: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      ERROR: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      DEBUG: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    };
    return icons[level] || icons.INFO;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    exportMutation.mutate({
      search: debouncedSearch,
      level: levelFilter,
      user: userFilter,
      module: moduleFilter
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLevelFilter('');
    setUserFilter('');
    setModuleFilter('');
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="audit-logs">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Audit Logs</h1>
            <p>Monitor and track all system activities and user actions</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleRefresh} disabled={isLoading}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleExport}
              disabled={exportMutation.isLoading}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {exportMutation.isLoading ? 'Exporting...' : 'Export Logs'}
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="summary-card">
            <div className="summary-icon" style={{ background: '#dbeafe' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="summary-content">
              <h3>Total Events</h3>
              <p className="summary-value">{stats.total || 0}</p>
              <p className="summary-label">All audit logs</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: '#fee2e2' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="summary-content">
              <h3>Errors</h3>
              <p className="summary-value" style={{ color: '#ef4444' }}>{stats.error || 0}</p>
              <p className="summary-label">Requires attention</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: '#fef3c7' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#f59e0b">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="summary-content">
              <h3>Warnings</h3>
              <p className="summary-value" style={{ color: '#f59e0b' }}>{stats.warning || 0}</p>
              <p className="summary-label">Should be reviewed</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon" style={{ background: '#d1fae5' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="#10b981">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="summary-content">
              <h3>Info</h3>
              <p className="summary-value" style={{ color: '#10b981' }}>{stats.info || 0}</p>
              <p className="summary-label">Normal operations</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-card">
          <div className="filters-header">
            <h3>Filters</h3>
            {(searchTerm || levelFilter || userFilter || moduleFilter) && (
              <button className="btn-text" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Levels</option>
                <option value="INFO">Info</option>
                <option value="WARNING">Warning</option>
                <option value="ERROR">Error</option>
                <option value="DEBUG">Debug</option>
              </select>
            </div>

            <div className="filter-group">
              <label>User</label>
              <input
                type="text"
                placeholder="Filter by user..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Module</label>
              <input
                type="text"
                placeholder="Filter by module..."
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="logs-card">
          <div className="card-header">
            <h3>Audit Trail</h3>
            <span className="badge">
              {pagination.totalItems || 0} logs
            </span>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p>Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3>No logs found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Module</th>
                      <th>Action</th>
                      <th>IP Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span className={`level-badge ${getLevelColor(log.level)}`}>
                            <span className="level-icon">{getLevelIcon(log.level)}</span>
                            {log.level}
                          </span>
                        </td>
                        <td className="timestamp-cell">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="user-cell">
                          <div className="user-avatar-small">
                            {log.user.charAt(0).toUpperCase()}
                          </div>
                          {log.user}
                        </td>
                        <td>
                          <span className="module-badge">{log.module}</span>
                        </td>
                        <td className="action-cell">{log.action}</td>
                        <td className="ip-cell">{log.ip}</td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={() => handleViewDetails(log)}
                            title="View details"
                          >
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Modal */}
        {isDetailModalOpen && selectedLog && (
          <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Audit Log Details</h2>
                <button
                  className="modal-close"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Log ID</label>
                    <p><code>{selectedLog.id}</code></p>
                  </div>
                  <div className="detail-item">
                    <label>Level</label>
                    <p>
                      <span className={`level-badge ${getLevelColor(selectedLog.level)}`}>
                        {selectedLog.level}
                      </span>
                    </p>
                  </div>
                  <div className="detail-item">
                    <label>Timestamp</label>
                    <p>{formatTimestamp(selectedLog.timestamp)}</p>
                  </div>
                  <div className="detail-item">
                    <label>User</label>
                    <p>{selectedLog.user}</p>
                  </div>
                  <div className="detail-item">
                    <label>Module</label>
                    <p><span className="module-badge">{selectedLog.module}</span></p>
                  </div>
                  <div className="detail-item">
                    <label>IP Address</label>
                    <p><code>{selectedLog.ip}</code></p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Action</label>
                    <p>{selectedLog.action}</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Details</label>
                    <p>{selectedLog.details}</p>
                  </div>
                  {selectedLog.metadata && (
                    <div className="detail-item full-width">
                      <label>Metadata</label>
                      <pre className="metadata-pre">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
