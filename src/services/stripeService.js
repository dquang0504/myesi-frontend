/**
 * Stripe Service
 * Handles Stripe payment and subscription operations
 * Falls back to mock service when VITE_USE_MOCK_AUTH is true
 */

import { loadStripe } from '@stripe/stripe-js';
import api from '../utils/axios';
import * as mockStripeService from './mockStripeService';

// Initialize Stripe
let stripePromise = null;

const getStripe = () => {
  if (!stripePromise && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Check if we should use mock service
 */
const shouldUseMock = () => {
  return mockStripeService.useMockStripe();
};

/**
 * Get all subscription plans
 */
export const getPlans = async () => {
  if (shouldUseMock()) {
    return mockStripeService.mockGetPlans();
  }
  
  try {
    const response = await api.get('/billing/plans');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    throw error;
  }
};

/**
 * Get current subscription
 */
export const getCurrentSubscription = async () => {
  if (shouldUseMock()) {
    return mockStripeService.mockGetCurrentSubscription();
  }
  
  try {
    const response = await api.get('/billing/subscription');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    throw error;
  }
};

/**
 * Get invoice history
 */
export const getInvoices = async (limit = 10) => {
  if (shouldUseMock()) {
    return mockStripeService.mockGetInvoices(limit);
  }
  
  try {
    const response = await api.get('/billing/invoices', { params: { limit } });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    throw error;
  }
};

/**
 * Get payment method
 */
export const getPaymentMethod = async () => {
  if (shouldUseMock()) {
    return mockStripeService.mockGetPaymentMethod();
  }
  
  try {
    const response = await api.get('/billing/payment-method');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch payment method:', error);
    throw error;
  }
};

/**
 * Create checkout session
 * @param {string} planId - Plan ID to subscribe to
 */
export const createCheckoutSession = async (planId) => {
  if (shouldUseMock()) {
    return mockStripeService.mockCreateCheckoutSession(planId);
  }
  
  try {
    const response = await api.post('/billing/create-checkout-session', { planId });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error;
  }
};

/**
 * Update subscription (upgrade/downgrade)
 * @param {string} newPlanId - New plan ID
 */
export const updateSubscription = async (newPlanId) => {
  if (shouldUseMock()) {
    return mockStripeService.mockUpdateSubscription(newPlanId);
  }
  
  try {
    const response = await api.put('/billing/subscription', { planId: newPlanId });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 * @param {boolean} immediately - Cancel immediately or at period end
 */
export const cancelSubscription = async (immediately = false) => {
  if (shouldUseMock()) {
    return mockStripeService.mockCancelSubscription(immediately);
  }
  
  try {
    const response = await api.delete('/billing/subscription', {
      data: { immediately },
    });
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
};

/**
 * Reactivate subscription
 */
export const reactivateSubscription = async () => {
  if (shouldUseMock()) {
    return mockStripeService.mockReactivateSubscription();
  }
  
  try {
    const response = await api.post('/billing/subscription/reactivate');
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Failed to reactivate subscription:', error);
    throw error;
  }
};

/**
 * Process payment
 * @param {object} paymentDetails - Payment details
 */
export const processPayment = async (paymentDetails) => {
  if (shouldUseMock()) {
    return mockStripeService.mockProcessPayment(paymentDetails);
  }
  
  try {
    const response = await api.post('/billing/process-payment', paymentDetails);
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Failed to process payment:', error);
    throw error;
  }
};

/**
 * Get Stripe instance for client-side Elements
 */
export const getStripeInstance = async () => {
  if (shouldUseMock()) {
    // Return null for mock mode (we'll handle UI differently)
    return null;
  }
  
  return await getStripe();
};

export default {
  getPlans,
  getCurrentSubscription,
  getInvoices,
  getPaymentMethod,
  createCheckoutSession,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  processPayment,
  getStripeInstance,
};
