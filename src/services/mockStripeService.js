/**
 * Mock Stripe Service
 * Simulates Stripe payment and subscription functionality for testing
 */

// Simulate network delay
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock subscription plans
export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_starter',
    name: 'Starter',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 10 projects',
      '100 SBOM scans per month',
      'Basic vulnerability reports',
      'Email support',
      '7-day data retention',
    ],
    limits: {
      projects: 10,
      scans: 100,
      users: 3,
    },
    popular: false,
  },
  {
    id: 'plan_professional',
    name: 'Professional',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 50 projects',
      'Unlimited SBOM scans',
      'Advanced analytics & reports',
      'Priority email & chat support',
      '30-day data retention',
      'API access',
      'Custom integrations',
    ],
    limits: {
      projects: 50,
      scans: -1, // unlimited
      users: 10,
    },
    popular: true,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited projects',
      'Unlimited SBOM scans',
      'Advanced analytics & custom reports',
      '24/7 phone & chat support',
      '90-day data retention',
      'Full API access',
      'SSO & SAML integration',
      'Dedicated account manager',
      'Custom SLA',
    ],
    limits: {
      projects: -1, // unlimited
      scans: -1, // unlimited
      users: -1, // unlimited
    },
    popular: false,
  },
];

// Mock current subscription data
let MOCK_CURRENT_SUBSCRIPTION = {
  id: 'sub_mock_123',
  planId: 'plan_professional',
  status: 'active',
  currentPeriodStart: new Date('2025-10-01').toISOString(),
  currentPeriodEnd: new Date('2025-11-01').toISOString(),
  cancelAtPeriodEnd: false,
  usage: {
    projects: 23,
    scans: 387,
    users: 5,
  },
};

// Mock invoice history
const MOCK_INVOICES = [
  {
    id: 'inv_001',
    amount: 99.0,
    currency: 'USD',
    status: 'paid',
    date: '2025-10-01T00:00:00Z',
    description: 'Professional Plan - October 2025',
    pdfUrl: '#',
  },
  {
    id: 'inv_002',
    amount: 99.0,
    currency: 'USD',
    status: 'paid',
    date: '2025-09-01T00:00:00Z',
    description: 'Professional Plan - September 2025',
    pdfUrl: '#',
  },
  {
    id: 'inv_003',
    amount: 99.0,
    currency: 'USD',
    status: 'paid',
    date: '2025-08-01T00:00:00Z',
    description: 'Professional Plan - August 2025',
    pdfUrl: '#',
  },
  {
    id: 'inv_004',
    amount: 29.0,
    currency: 'USD',
    status: 'paid',
    date: '2025-07-01T00:00:00Z',
    description: 'Starter Plan - July 2025',
    pdfUrl: '#',
  },
];

// Mock payment methods
let MOCK_PAYMENT_METHOD = {
  id: 'pm_mock_123',
  type: 'card',
  card: {
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2026,
  },
};

/**
 * Get all subscription plans
 */
export const mockGetPlans = async () => {
  await delay(500);
  return {
    success: true,
    data: {
      plans: SUBSCRIPTION_PLANS,
    },
  };
};

/**
 * Get current subscription
 */
export const mockGetCurrentSubscription = async () => {
  await delay(600);
  
  if (!MOCK_CURRENT_SUBSCRIPTION) {
    return {
      success: true,
      data: {
        subscription: null,
      },
    };
  }

  // Find plan details
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === MOCK_CURRENT_SUBSCRIPTION.planId);
  
  return {
    success: true,
    data: {
      subscription: {
        ...MOCK_CURRENT_SUBSCRIPTION,
        plan: plan,
      },
    },
  };
};

/**
 * Get invoice history
 */
export const mockGetInvoices = async (limit = 10) => {
  await delay(500);
  
  return {
    success: true,
    data: {
      invoices: MOCK_INVOICES.slice(0, limit),
      hasMore: MOCK_INVOICES.length > limit,
    },
  };
};

/**
 * Get payment method
 */
export const mockGetPaymentMethod = async () => {
  await delay(400);
  
  return {
    success: true,
    data: {
      paymentMethod: MOCK_PAYMENT_METHOD,
    },
  };
};

/**
 * Create checkout session (simulated)
 * @param {string} planId - Plan ID to subscribe to
 */
export const mockCreateCheckoutSession = async (planId) => {
  await delay(1000);
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  
  if (!plan) {
    throw new Error('Invalid plan ID');
  }
  
  // Simulate successful checkout
  return {
    success: true,
    data: {
      sessionId: 'cs_test_' + Math.random().toString(36).substr(2, 9),
      url: `#checkout-${planId}`, // In real app, this would be Stripe checkout URL
    },
  };
};

/**
 * Update subscription (upgrade/downgrade)
 * @param {string} newPlanId - New plan ID
 */
export const mockUpdateSubscription = async (newPlanId) => {
  await delay(1000);
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === newPlanId);
  
  if (!plan) {
    throw new Error('Invalid plan ID');
  }
  
  // Update mock subscription
  MOCK_CURRENT_SUBSCRIPTION = {
    ...MOCK_CURRENT_SUBSCRIPTION,
    planId: newPlanId,
  };
  
  return {
    success: true,
    data: {
      subscription: {
        ...MOCK_CURRENT_SUBSCRIPTION,
        plan: plan,
      },
    },
    message: `Successfully ${plan.price > 99 ? 'upgraded' : 'changed'} to ${plan.name} plan`,
  };
};

/**
 * Cancel subscription
 * @param {boolean} immediately - Cancel immediately or at period end
 */
export const mockCancelSubscription = async (immediately = false) => {
  await delay(1000);
  
  if (immediately) {
    MOCK_CURRENT_SUBSCRIPTION.status = 'canceled';
  } else {
    MOCK_CURRENT_SUBSCRIPTION.cancelAtPeriodEnd = true;
  }
  
  return {
    success: true,
    data: {
      subscription: MOCK_CURRENT_SUBSCRIPTION,
    },
    message: immediately 
      ? 'Subscription canceled immediately' 
      : 'Subscription will be canceled at the end of the billing period',
  };
};

/**
 * Reactivate subscription (undo cancellation)
 */
export const mockReactivateSubscription = async () => {
  await delay(800);
  
  MOCK_CURRENT_SUBSCRIPTION.cancelAtPeriodEnd = false;
  MOCK_CURRENT_SUBSCRIPTION.status = 'active';
  
  return {
    success: true,
    data: {
      subscription: MOCK_CURRENT_SUBSCRIPTION,
    },
    message: 'Subscription reactivated successfully',
  };
};

/**
 * Process payment (simulated)
 * @param {object} paymentDetails - Payment details
 */
export const mockProcessPayment = async (paymentDetails) => {
  await delay(1500);
  
  // Simulate payment processing
  const { cardNumber, expiryMonth, expiryYear, cvc, planId } = paymentDetails;
  
  // Simple validation
  if (!cardNumber || !expiryMonth || !expiryYear || !cvc) {
    throw new Error('Invalid payment details');
  }
  
  // Update payment method
  MOCK_PAYMENT_METHOD = {
    id: 'pm_mock_' + Math.random().toString(36).substr(2, 9),
    type: 'card',
    card: {
      brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: cardNumber.slice(-4),
      expMonth: expiryMonth,
      expYear: expiryYear,
    },
  };
  
  // Create/update subscription
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  MOCK_CURRENT_SUBSCRIPTION = {
    id: 'sub_mock_' + Math.random().toString(36).substr(2, 9),
    planId: planId,
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    usage: {
      projects: 0,
      scans: 0,
      users: 1,
    },
  };
  
  return {
    success: true,
    data: {
      subscription: {
        ...MOCK_CURRENT_SUBSCRIPTION,
        plan: plan,
      },
      paymentMethod: MOCK_PAYMENT_METHOD,
    },
    message: 'Payment processed successfully',
  };
};

/**
 * Check if mock Stripe should be used
 */
export const useMockStripe = () => {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
};
