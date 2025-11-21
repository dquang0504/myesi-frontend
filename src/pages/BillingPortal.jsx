import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  useCurrentSubscription,
  useInvoices,
  usePaymentMethod,
  usePlans,
  useUpdateSubscription,
  useCancelSubscription,
  useReactivateSubscription,
} from '../hooks/useSubscription';
import { toast } from 'react-toastify';
import './BillingPortal.css';

export default function BillingPortal() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { data: subscriptionData, isLoading: subLoading } = useCurrentSubscription();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices(20);
  const { data: paymentData, isLoading: paymentLoading } = usePaymentMethod();
  const { data: plansData, isLoading: plansLoading } = usePlans();
  
  const updateSubscription = useUpdateSubscription();
  const cancelSubscription = useCancelSubscription();
  const reactivateSubscription = useReactivateSubscription();

  const subscription = subscriptionData?.subscription;
  const invoices = invoicesData?.invoices || [];
  const paymentMethod = paymentData?.paymentMethod;
  const plans = plansData?.plans || [];

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'status-active',
      canceled: 'status-canceled',
      past_due: 'status-past-due',
      trialing: 'status-trialing',
      paid: 'invoice-paid',
      open: 'invoice-open',
      void: 'invoice-void',
      draft: 'invoice-draft',
    };
    return colors[status] || 'status-default';
  };

  const getInvoiceStatusIcon = (status) => {
    const icons = {
      paid: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      open: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      void: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[status] || icons.open;
  };

  const handlePlanSelect = (plan) => {
    if (!subscription || plan.id === subscription.plan?.id) return;
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      const result = await updateSubscription.mutateAsync(selectedPlan.id);
      if (result.success) {
        toast.success(result.message || 'Subscription updated successfully!');
        setShowUpgradeModal(false);
        setSelectedPlan(null);
      }
    } catch (error) {
      toast.error('Failed to update subscription. Please try again.');
      console.error(error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription.mutateAsync(cancelImmediately);
      if (result.success) {
        toast.success(result.message || 'Subscription cancelled successfully');
        setShowCancelModal(false);
      }
    } catch (error) {
      toast.error('Failed to cancel subscription. Please try again.');
      console.error(error);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const result = await reactivateSubscription.mutateAsync();
      if (result.success) {
        toast.success(result.message || 'Subscription reactivated successfully!');
      }
    } catch (error) {
      toast.error('Failed to reactivate subscription. Please try again.');
      console.error(error);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice) => {
    // In production, this would download the actual invoice PDF
    toast.info(`Downloading invoice ${invoice.number}...`);
    // Simulate download
    setTimeout(() => {
      toast.success('Invoice downloaded successfully!');
    }, 1000);
  };

  const isLoading = subLoading || invoicesLoading || paymentLoading || plansLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="billing-portal">
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading billing information...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="billing-portal">
        {/* Header */}
        <div className="portal-header">
          <div>
            <h1>Billing Portal</h1>
            <p>Manage your subscription, view invoices, and update payment methods</p>
          </div>
          {subscription && (
            <span className={`status-badge-large ${getStatusColor(subscription.status)}`}>
              <span className="status-icon">{getInvoiceStatusIcon(subscription.status)}</span>
              {subscription.status.replace('_', ' ').toUpperCase()}
            </span>
          )}
        </div>

        {/* Current Subscription Section */}
        {subscription ? (
          <div className="current-subscription-card">
            <div className="subscription-header">
              <div>
                <h2>Current Subscription</h2>
                <p className="plan-name">{subscription.plan?.name} Plan</p>
              </div>
              <div className="subscription-price">
                <span className="price">{formatCurrency(subscription.plan?.price)}</span>
                <span className="period">/month</span>
              </div>
            </div>

            <div className="subscription-details-grid">
              <div className="detail-item">
                <svg className="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="detail-label">Billing Date</p>
                  <p className="detail-value">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              </div>

              <div className="detail-item">
                <svg className="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="detail-label">Current Period</p>
                  <p className="detail-value">{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              </div>

              {paymentMethod && (
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="detail-label">Payment Method</p>
                    <p className="detail-value">
                      {paymentMethod.brand?.toUpperCase()} •••• {paymentMethod.last4}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {subscription.cancelAtPeriodEnd ? (
              <div className="cancel-warning-banner">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="warning-content">
                  <h4>Subscription Ending</h4>
                  <p>Your subscription will be canceled on {formatDate(subscription.currentPeriodEnd)}</p>
                </div>
                <button
                  className="btn btn-reactivate"
                  onClick={handleReactivateSubscription}
                  disabled={reactivateSubscription.isLoading}
                >
                  {reactivateSubscription.isLoading ? 'Processing...' : 'Reactivate Subscription'}
                </button>
              </div>
            ) : (
              <div className="subscription-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-subscription-card">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>No Active Subscription</h3>
            <p>Choose a plan below to get started</p>
          </div>
        )}

        {/* Available Plans */}
        <div className="plans-section">
          <div className="section-header">
            <h2>Available Plans</h2>
            <p>Choose the plan that best fits your needs</p>
          </div>

          <div className="plans-grid">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.plan?.id === plan.id;
              const isDowngrade = subscription && plan.price < subscription.plan?.price;
              const isUpgrade = subscription && plan.price > subscription.plan?.price;

              return (
                <div
                  key={plan.id}
                  className={`plan-card ${isCurrentPlan ? 'current-plan' : ''} ${plan.featured ? 'featured-plan' : ''}`}
                >
                  {plan.featured && <div className="featured-badge">Most Popular</div>}
                  {isCurrentPlan && <div className="current-badge">Current Plan</div>}

                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="plan-price">
                    <span className="price-amount">{formatCurrency(plan.price)}</span>
                    <span className="price-period">/month</span>
                  </div>

                  <ul className="plan-features">
                    {plan.features?.map((feature, index) => (
                      <li key={index}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`btn ${isCurrentPlan ? 'btn-disabled' : isUpgrade ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isCurrentPlan || !subscription}
                  >
                    {isCurrentPlan
                      ? 'Current Plan'
                      : isUpgrade
                      ? 'Upgrade'
                      : isDowngrade
                      ? 'Downgrade'
                      : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoices Section */}
        <div className="invoices-section">
          <div className="section-header">
            <h2>Invoice History</h2>
            <p>View and download your past invoices</p>
          </div>

          {invoices.length === 0 ? (
            <div className="no-invoices">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No invoices yet</p>
            </div>
          ) : (
            <div className="invoices-table-container">
              <table className="invoices-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="invoice-number">
                        <code>{invoice.number}</code>
                      </td>
                      <td className="invoice-date">{formatDate(invoice.created)}</td>
                      <td className="invoice-description">{invoice.description}</td>
                      <td className="invoice-amount">
                        <strong>{formatCurrency(invoice.amountDue, invoice.currency)}</strong>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                          <span className="status-icon">{getInvoiceStatusIcon(invoice.status)}</span>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="invoice-actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleViewInvoice(invoice)}
                          title="View details"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDownloadInvoice(invoice)}
                          title="Download PDF"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedPlan && (
          <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {selectedPlan.price > (subscription?.plan?.price || 0)
                    ? 'Upgrade'
                    : 'Change'} to {selectedPlan.name}
                </h2>
                <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="plan-comparison">
                  <div className="comparison-item">
                    <p className="comparison-label">Current Plan</p>
                    <p className="comparison-value">{subscription?.plan?.name}</p>
                    <p className="comparison-price">{formatCurrency(subscription?.plan?.price || 0)}/month</p>
                  </div>
                  <svg className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="comparison-item">
                    <p className="comparison-label">New Plan</p>
                    <p className="comparison-value">{selectedPlan.name}</p>
                    <p className="comparison-price">{formatCurrency(selectedPlan.price)}/month</p>
                  </div>
                </div>

                <div className="upgrade-info">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    {selectedPlan.price > (subscription?.plan?.price || 0)
                      ? 'You will be charged a prorated amount for the remainder of your billing cycle.'
                      : 'Your account will be credited for the unused portion of your current plan.'}
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={updateSubscription.isLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpgrade}
                  disabled={updateSubscription.isLoading}
                >
                  {updateSubscription.isLoading ? 'Processing...' : 'Confirm Change'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Cancel Subscription</h2>
                <button className="modal-close" onClick={() => setShowCancelModal(false)}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="cancel-warning">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>Are you sure you want to cancel your subscription?</p>
                </div>

                <div className="cancel-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      checked={!cancelImmediately}
                      onChange={() => setCancelImmediately(false)}
                    />
                    <div>
                      <strong>Cancel at period end</strong>
                      <p>Maintain access until {formatDate(subscription?.currentPeriodEnd)}</p>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      checked={cancelImmediately}
                      onChange={() => setCancelImmediately(true)}
                    />
                    <div>
                      <strong>Cancel immediately</strong>
                      <p>Lose access right away (no refund for remaining time)</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelSubscription.isLoading}
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

        {/* Invoice Detail Modal */}
        {showInvoiceModal && selectedInvoice && (
          <div className="modal-overlay" onClick={() => setShowInvoiceModal(false)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Invoice Details</h2>
                <button className="modal-close" onClick={() => setShowInvoiceModal(false)}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="invoice-detail">
                  <div className="invoice-header-detail">
                    <div>
                      <p className="invoice-number-large">Invoice #{selectedInvoice.number}</p>
                      <p className="invoice-date-large">{formatDate(selectedInvoice.created)}</p>
                    </div>
                    <span className={`status-badge-large ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status}
                    </span>
                  </div>

                  <div className="invoice-details-grid">
                    <div className="invoice-detail-item">
                      <label>Description</label>
                      <p>{selectedInvoice.description}</p>
                    </div>
                    <div className="invoice-detail-item">
                      <label>Amount Due</label>
                      <p className="amount-large">{formatCurrency(selectedInvoice.amountDue, selectedInvoice.currency)}</p>
                    </div>
                    {selectedInvoice.amountPaid > 0 && (
                      <div className="invoice-detail-item">
                        <label>Amount Paid</label>
                        <p>{formatCurrency(selectedInvoice.amountPaid, selectedInvoice.currency)}</p>
                      </div>
                    )}
                    <div className="invoice-detail-item">
                      <label>Period</label>
                      <p>{formatDate(selectedInvoice.periodStart)} - {formatDate(selectedInvoice.periodEnd)}</p>
                    </div>
                  </div>

                  {selectedInvoice.lines?.length > 0 && (
                    <div className="invoice-line-items">
                      <h3>Line Items</h3>
                      <table className="line-items-table">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.lines.map((line, index) => (
                            <tr key={index}>
                              <td>{line.description}</td>
                              <td>{line.quantity}</td>
                              <td>{formatCurrency(line.amount, selectedInvoice.currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowInvoiceModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
