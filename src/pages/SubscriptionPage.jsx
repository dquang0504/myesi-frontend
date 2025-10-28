import { useState } from 'react';
import { 
  useSubscriptionPlans, 
  useCurrentSubscription,
  useCreateCheckout,
  useUpdateSubscription 
} from '../hooks/useSubscription';
import AdminLayout from '../components/AdminLayout';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const { data: plansData, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: subscriptionData, isLoading: subLoading } = useCurrentSubscription();
  const createCheckout = useCreateCheckout();
  const updateSubscription = useUpdateSubscription();

  const currentSubscription = subscriptionData?.subscription;
  const plans = plansData?.plans || [];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleUpgrade = async (planId) => {
    try {
      const result = await updateSubscription.mutateAsync(planId);
      if (result.success) {
        alert(result.message || 'Subscription updated successfully!');
      }
    } catch (error) {
      alert('Failed to update subscription. Please try again.');
      console.error(error);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      const result = await createCheckout.mutateAsync(planId);
      if (result.success) {
        // In a real app, redirect to Stripe checkout
        alert('Redirecting to checkout...');
        // window.location.href = result.data.url;
      }
    } catch (error) {
      alert('Failed to create checkout session. Please try again.');
      console.error(error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatLimit = (limit) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  if (plansLoading || subLoading) {
    return (
      <AdminLayout>
        <div className="subscription-page">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading subscription plans...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="subscription-page">
      <div className="subscription-header">
        <h1>Subscription Plans</h1>
        <p>Choose the perfect plan for your security needs</p>
      </div>

      {currentSubscription && (
        <div className="current-plan-banner">
          <div className="banner-content">
            <div className="banner-info">
              <span className="badge badge-success">Active</span>
              <h3>Current Plan: {currentSubscription.plan?.name}</h3>
              <p>
                {formatPrice(currentSubscription.plan?.price)}/month
                {currentSubscription.cancelAtPeriodEnd && (
                  <span className="cancel-notice"> • Cancels on {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</span>
                )}
              </p>
            </div>
            <div className="banner-usage">
              <div className="usage-item">
                <span className="usage-label">Projects</span>
                <span className="usage-value">
                  {currentSubscription.usage?.projects} / {formatLimit(currentSubscription.plan?.limits?.projects)}
                </span>
              </div>
              <div className="usage-item">
                <span className="usage-label">Scans</span>
                <span className="usage-value">
                  {currentSubscription.usage?.scans} / {formatLimit(currentSubscription.plan?.limits?.scans)}
                </span>
              </div>
              <div className="usage-item">
                <span className="usage-label">Users</span>
                <span className="usage-value">
                  {currentSubscription.usage?.users} / {formatLimit(currentSubscription.plan?.limits?.users)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.planId === plan.id;
          const canUpgrade = currentSubscription && 
            plan.price > (currentSubscription.plan?.price || 0);
          const canDowngrade = currentSubscription && 
            plan.price < (currentSubscription.plan?.price || 0);

          return (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">{formatPrice(plan.price)}</span>
                  <span className="price-period">/month</span>
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="plan-limits">
                <div className="limit-item">
                  <span className="limit-label">Projects:</span>
                  <span className="limit-value">{formatLimit(plan.limits.projects)}</span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Scans:</span>
                  <span className="limit-value">{formatLimit(plan.limits.scans)}</span>
                </div>
                <div className="limit-item">
                  <span className="limit-label">Users:</span>
                  <span className="limit-value">{formatLimit(plan.limits.users)}</span>
                </div>
              </div>

              <div className="plan-action">
                {isCurrentPlan ? (
                  <button className="btn btn-current" disabled>
                    Current Plan
                  </button>
                ) : currentSubscription ? (
                  canUpgrade ? (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={updateSubscription.isLoading}
                    >
                      {updateSubscription.isLoading ? 'Upgrading...' : 'Upgrade'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={updateSubscription.isLoading}
                    >
                      {updateSubscription.isLoading ? 'Changing...' : 'Switch Plan'}
                    </button>
                  )
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={createCheckout.isLoading}
                  >
                    {createCheckout.isLoading ? 'Processing...' : 'Subscribe'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="subscription-footer">
        <div className="footer-info">
          <h3>Need help choosing?</h3>
          <p>Contact our sales team for a personalized recommendation.</p>
          <button className="btn btn-outline">Contact Sales</button>
        </div>
        <div className="footer-features">
          <div className="footer-feature">
            <svg className="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure Payment</span>
          </div>
          <div className="footer-feature">
            <svg className="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Cancel Anytime</span>
          </div>
          <div className="footer-feature">
            <svg className="footer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default SubscriptionPage;
