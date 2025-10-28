import { useState } from 'react';
import {
  useCurrentSubscription,
  useInvoices,
  usePaymentMethod,
  useCancelSubscription,
  useReactivateSubscription,
} from '../hooks/useSubscription';
import AdminLayout from '../components/AdminLayout';
import './BillingStatus.css';

const BillingStatus = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelImmediately, setCancelImmediately] = useState(false);

  const { data: subscriptionData, isLoading: subLoading } = useCurrentSubscription();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices();
  const { data: paymentData, isLoading: paymentLoading } = usePaymentMethod();
  const cancelSubscription = useCancelSubscription();
  const reactivateSubscription = useReactivateSubscription();

  const subscription = subscriptionData?.subscription;
  const invoices = invoicesData?.invoices || [];
  const paymentMethod = paymentData?.paymentMethod;

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription.mutateAsync(cancelImmediately);
      if (result.success) {
        alert(result.message);
        setShowCancelModal(false);
      }
    } catch (error) {
      alert('Failed to cancel subscription. Please try again.');
      console.error(error);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const result = await reactivateSubscription.mutateAsync();
      if (result.success) {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to reactivate subscription. Please try again.');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getCardBrandIcon = (brand) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
    };
    return icons[brand?.toLowerCase()] || '💳';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'status-active',
      canceled: 'status-canceled',
      past_due: 'status-past-due',
      paid: 'status-paid',
      open: 'status-open',
      void: 'status-void',
    };
    return colors[status] || 'status-default';
  };

  const calculateUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  if (subLoading || invoicesLoading || paymentLoading) {
    return (
      <AdminLayout>
        <div className="billing-status">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading billing information...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!subscription) {
    return (
      <AdminLayout>
        <div className="billing-status">
          <div className="no-subscription">
            <svg className="no-sub-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2>No Active Subscription</h2>
            <p>Subscribe to a plan to access premium features.</p>
            <button className="btn btn-primary">View Plans</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="billing-status">
      <div className="billing-header">
        <h1>Billing & Subscription</h1>
        <p>Manage your subscription and billing information</p>
      </div>

      {/* Current Subscription */}
      <div className="billing-section">
        <div className="section-header">
          <h2>Current Subscription</h2>
          <span className={`status-badge ${getStatusColor(subscription.status)}`}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </span>
        </div>

        <div className="subscription-details">
          <div className="detail-card">
            <div className="detail-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="detail-content">
              <h3>{subscription.plan?.name} Plan</h3>
              <p className="detail-value">{formatAmount(subscription.plan?.price)}/month</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="detail-content">
              <h3>Next Billing Date</h3>
              <p className="detail-value">{formatDate(subscription.currentPeriodEnd)}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="detail-content">
              <h3>Billing Period</h3>
              <p className="detail-value">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="cancel-warning">
            <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4>Subscription Ending</h4>
              <p>Your subscription will be canceled on {formatDate(subscription.currentPeriodEnd)}</p>
            </div>
            <button 
              className="btn btn-reactivate"
              onClick={handleReactivateSubscription}
              disabled={reactivateSubscription.isLoading}
            >
              {reactivateSubscription.isLoading ? 'Processing...' : 'Reactivate'}
            </button>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="billing-section">
        <div className="section-header">
          <h2>Usage Statistics</h2>
        </div>

        <div className="usage-stats">
          <div className="usage-stat">
            <div className="stat-header">
              <span className="stat-label">Projects</span>
              <span className="stat-value">
                {subscription.usage?.projects} / {subscription.plan?.limits?.projects === -1 ? 'Unlimited' : subscription.plan?.limits?.projects}
              </span>
            </div>
            {subscription.plan?.limits?.projects !== -1 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateUsagePercentage(subscription.usage?.projects, subscription.plan?.limits?.projects)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="usage-stat">
            <div className="stat-header">
              <span className="stat-label">SBOM Scans</span>
              <span className="stat-value">
                {subscription.usage?.scans} / {subscription.plan?.limits?.scans === -1 ? 'Unlimited' : subscription.plan?.limits?.scans}
              </span>
            </div>
            {subscription.plan?.limits?.scans !== -1 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateUsagePercentage(subscription.usage?.scans, subscription.plan?.limits?.scans)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="usage-stat">
            <div className="stat-header">
              <span className="stat-label">Team Members</span>
              <span className="stat-value">
                {subscription.usage?.users} / {subscription.plan?.limits?.users === -1 ? 'Unlimited' : subscription.plan?.limits?.users}
              </span>
            </div>
            {subscription.plan?.limits?.users !== -1 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateUsagePercentage(subscription.usage?.users, subscription.plan?.limits?.users)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      {paymentMethod && (
        <div className="billing-section">
          <div className="section-header">
            <h2>Payment Method</h2>
            <button className="btn btn-outline-small">Update</button>
          </div>

          <div className="payment-method-card">
            <span className="card-icon">{getCardBrandIcon(paymentMethod.card?.brand)}</span>
            <div className="card-info">
              <p className="card-brand">{paymentMethod.card?.brand?.toUpperCase()}</p>
              <p className="card-number">•••• •••• •••• {paymentMethod.card?.last4}</p>
            </div>
            <div className="card-expiry">
              <p className="expiry-label">Expires</p>
              <p className="expiry-date">{paymentMethod.card?.expMonth}/{paymentMethod.card?.expYear}</p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice History */}
      <div className="billing-section">
        <div className="section-header">
          <h2>Invoice History</h2>
        </div>

        <div className="invoices-table">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-id">{invoice.id}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{invoice.description}</td>
                  <td className="invoice-amount">{formatAmount(invoice.amount, invoice.currency)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-link">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      {!subscription.cancelAtPeriodEnd && (
        <div className="billing-section">
          <div className="section-header">
            <h2>Subscription Actions</h2>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-danger"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cancel Subscription</h3>
              <button className="modal-close" onClick={() => setShowCancelModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your subscription?</p>
              
              <div className="cancel-options">
                <label className="radio-option">
                  <input 
                    type="radio"
                    checked={!cancelImmediately}
                    onChange={() => setCancelImmediately(false)}
                  />
                  <div className="option-content">
                    <strong>Cancel at period end</strong>
                    <span>Access until {formatDate(subscription.currentPeriodEnd)}</span>
                  </div>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio"
                    checked={cancelImmediately}
                    onChange={() => setCancelImmediately(true)}
                  />
                  <div className="option-content">
                    <strong>Cancel immediately</strong>
                    <span>Lose access right away (no refund)</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancelSubscription}
                disabled={cancelSubscription.isLoading}
              >
                {cancelSubscription.isLoading ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default BillingStatus;
