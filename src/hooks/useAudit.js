import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditService } from '../services/auditService';
import { toast } from 'react-toastify';

/**
 * Hook to fetch audit logs with filters
 */
export const useAuditLogs = (filters) => {
  return useQuery({
    queryKey: ['auditLogs', filters],
    queryFn: () => auditService.getAuditLogs(filters),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch a single audit log by ID
 */
export const useAuditLogById = (id) => {
  return useQuery({
    queryKey: ['auditLog', id],
    queryFn: () => auditService.getAuditLogById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch subscription status overview
 */
export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: () => auditService.getSubscriptionStatus(),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to export audit logs
 */
export const useExportAuditLogs = () => {
  return useMutation({
    mutationFn: (params) => auditService.exportAuditLogs(params),
    onSuccess: (data) => {
      toast.success('Audit logs exported successfully');
      if (data?.data?.downloadUrl) {
        window.open(data.data.downloadUrl, '_blank');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to export audit logs';
      toast.error(message);
    },
  });
};
