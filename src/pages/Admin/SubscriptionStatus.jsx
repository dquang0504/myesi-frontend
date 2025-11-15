import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useSubscriptionStatus } from '../../hooks/useAudit';
import './SubscriptionStatus.css';

export default function SubscriptionStatus() {
  const { data, isLoading, refetch } = useSubscriptionStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const overview = data?.data?.overview || {};
  const subscriptions = data?.data?.subscriptions || [];

  const getStatusColor = (status) => {
    const colors = {
      active: 'status-active',
      cancelled: 'status-cancelled',
      past_due: 'status-past-due',
      trialing: 'status-trialing'
    };
    return colors[status] || 'status-default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      cancelled: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      past_due: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      trialing: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[status] || icons.active;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = searchTerm === '' || 
      sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <AdminLayout>
      <div className="subscription-status">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Customer Subscriptions</h1>
            <p>Monitor and manage all customer subscriptions and billing</p>
          </div>
          <button className="btn btn-outline" onClick={handleRefresh} disabled={isLoading}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading subscription data...</p>
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="overview-stats">
              <div className="stat-card stat-total">
                <div className="stat-icon" style={{ background: '#dbeafe' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Subscriptions</p>
                  <p className="stat-value">{overview.total || 0}</p>
                  <p className="stat-sublabel">All customers</p>
                </div>
              </div>

              <div className="stat-card stat-active">
                <div className="stat-icon" style={{ background: '#d1fae5' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="#10b981">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Active</p>
                  <p className="stat-value" style={{ color: '#10b981' }}>{overview.active || 0}</p>
                  <p className="stat-sublabel">Currently subscribed</p>
                </div>
              </div>

              <div className="stat-card stat-cancelled">
                <div className="stat-icon" style={{ background: '#fee2e2' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Cancelled</p>
                  <p className="stat-value" style={{ color: '#ef4444' }}>{overview.cancelled || 0}</p>
                  <p className="stat-sublabel">No longer active</p>
                </div>
              </div>

              <div className="stat-card stat-past-due">
                <div className="stat-icon" style={{ background: '#fef3c7' }}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="#f59e0b">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Past Due</p>
                  <p className="stat-value" style={{ color: '#f59e0b' }}>{overview.past_due || 0}</p>
                  <p className="stat-sublabel">Requires attention</p>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="revenue-card">
              <div className="revenue-header">
                <div>
                  <h3>Monthly Recurring Revenue</h3>
                  <p className="revenue-amount">{formatCurrency(overview.totalRevenue || 0)}</p>
                </div>
                <div className="revenue-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="revenue-note">Total monthly revenue from all active subscriptions</p>
            </div>

            {/* Filters */}
            <div className="filters-card">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Search by user, email, or plan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="past_due">Past Due</option>
                    <option value="trialing">Trialing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="subscriptions-card">
              <div className="card-header">
                <h3>Customer Subscriptions</h3>
                <span className="badge">
                  {filteredSubscriptions.length} subscriptions
                </span>
              </div>

              {filteredSubscriptions.length === 0 ? (
                <div className="empty-state">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3>No subscriptions found</h3>
                  <p>Try adjusting your filters</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="subscriptions-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Start Date</th>
                        <th>Next Billing</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscriptions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="user-cell">
                            <div className="user-info">
                              <div className="user-avatar">
                                {sub.user.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="user-name">{sub.user}</p>
                                <p className="user-email">{sub.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="plan-badge">{sub.plan}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusColor(sub.status)}`}>
                              <span className="status-icon">{getStatusIcon(sub.status)}</span>
                              {sub.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="price-cell">
                            {formatCurrency(sub.price)}
                            <span className="billing-period">/{sub.interval}</span>
                          </td>
                          <td className="date-cell">{formatDate(sub.startDate)}</td>
                          <td className="date-cell">
                            {sub.nextBilling ? formatDate(sub.nextBilling) : '—'}
                          </td>
                          <td className="revenue-cell">
                            {formatCurrency(sub.revenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
