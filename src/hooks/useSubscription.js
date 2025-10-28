/**
 * useSubscription Hook
 * Custom hook for managing subscription and billing data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import stripeService from '../services/stripeService';

/**
 * Fetch subscription plans
 */
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const response = await stripeService.getPlans();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch current subscription
 */
export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['currentSubscription'],
    queryFn: async () => {
      const response = await stripeService.getCurrentSubscription();
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

/**
 * Fetch invoice history
 */
export const useInvoices = (limit = 10) => {
  return useQuery({
    queryKey: ['invoices', limit],
    queryFn: async () => {
      const response = await stripeService.getInvoices(limit);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Fetch payment method
 */
export const usePaymentMethod = () => {
  return useQuery({
    queryKey: ['paymentMethod'],
    queryFn: async () => {
      const response = await stripeService.getPaymentMethod();
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Create checkout session mutation
 */
export const useCreateCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (planId) => stripeService.createCheckoutSession(planId),
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries(['currentSubscription']);
    },
  });
};

/**
 * Update subscription mutation
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPlanId) => stripeService.updateSubscription(newPlanId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['currentSubscription']);
      queryClient.invalidateQueries(['invoices']);
    },
  });
};

/**
 * Cancel subscription mutation
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (immediately = false) => stripeService.cancelSubscription(immediately),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentSubscription']);
    },
  });
};

/**
 * Reactivate subscription mutation
 */
export const useReactivateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => stripeService.reactivateSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentSubscription']);
    },
  });
};

/**
 * Process payment mutation
 */
export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentDetails) => stripeService.processPayment(paymentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentSubscription']);
      queryClient.invalidateQueries(['paymentMethod']);
      queryClient.invalidateQueries(['invoices']);
    },
  });
};
