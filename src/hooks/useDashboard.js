import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

/**
 * Hook to fetch dashboard stats
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getAllStats(),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

/**
 * Hook to fetch users count
 */
export const useUsersCount = () => {
  return useQuery({
    queryKey: ['usersCount'],
    queryFn: () => dashboardService.getUsersCount(),
    staleTime: 60000,
  });
};

/**
 * Hook to fetch projects count
 */
export const useProjectsCount = () => {
  return useQuery({
    queryKey: ['projectsCount'],
    queryFn: () => dashboardService.getProjectsCount(),
    staleTime: 60000,
  });
};

/**
 * Hook to fetch vulnerabilities count
 */
export const useVulnerabilitiesCount = () => {
  return useQuery({
    queryKey: ['vulnerabilitiesCount'],
    queryFn: () => dashboardService.getVulnerabilitiesCount(),
    staleTime: 60000,
  });
};

/**
 * Hook to fetch recent activities
 */
export const useRecentActivities = (limit = 8) => {
  return useQuery({
    queryKey: ['recentActivities', limit],
    queryFn: () => dashboardService.getRecentActivities(limit),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch vulnerability trend
 */
export const useVulnerabilityTrend = (days = 7) => {
  return useQuery({
    queryKey: ['vulnerabilityTrend', days],
    queryFn: () => dashboardService.getVulnerabilityTrend(days),
    staleTime: 120000, // 2 minutes
  });
};

/**
 * Hook to fetch SBOM analytics
 */
export const useSBOMAnalytics = () => {
  return useQuery({
    queryKey: ['sbomAnalytics'],
    queryFn: () => dashboardService.getSBOMAnalytics(),
    staleTime: 120000,
  });
};

/**
 * Hook to fetch risk scores
 */
export const useRiskScores = () => {
  return useQuery({
    queryKey: ['riskScores'],
    queryFn: () => dashboardService.getRiskScores(),
    staleTime: 120000,
  });
};

/**
 * Hook to fetch compliance data
 */
export const useCompliance = () => {
  return useQuery({
    queryKey: ['compliance'],
    queryFn: () => dashboardService.getCompliance(),
    staleTime: 120000,
  });
};

/**
 * Hook to fetch top vulnerabilities
 */
export const useTopVulnerabilities = (limit = 5) => {
  return useQuery({
    queryKey: ['topVulnerabilities', limit],
    queryFn: () => dashboardService.getTopVulnerabilities(limit),
    staleTime: 60000,
  });
};

/**
 * Hook to fetch component inventory
 */
export const useComponentInventory = () => {
  return useQuery({
    queryKey: ['componentInventory'],
    queryFn: () => dashboardService.getComponentInventory(),
    staleTime: 120000,
  });
};

/**
 * Hook to fetch all analytics data
 */
export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => dashboardService.getAllAnalytics(),
    staleTime: 120000,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

