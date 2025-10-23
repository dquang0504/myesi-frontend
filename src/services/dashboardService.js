import axiosInstance from '../utils/axios';
import {
  useMockDashboard,
  mockGetUsersCount,
  mockGetProjectsCount,
  mockGetVulnerabilitiesCount,
  mockGetSBOMCount,
  mockGetRecentActivities,
  mockGetVulnerabilityTrend,
  mockGetDashboardStats,
} from './mockDashboardService';

/**
 * Dashboard Stats Service
 */
export const dashboardService = {
  /**
   * Get total users count
   */
  getUsersCount: async () => {
    if (useMockDashboard()) {
      return mockGetUsersCount();
    }
    const response = await axiosInstance.get('/stats/users/count');
    return response;
  },

  /**
   * Get projects count
   */
  getProjectsCount: async () => {
    if (useMockDashboard()) {
      return mockGetProjectsCount();
    }
    const response = await axiosInstance.get('/stats/projects/count');
    return response;
  },

  /**
   * Get vulnerabilities count
   */
  getVulnerabilitiesCount: async () => {
    if (useMockDashboard()) {
      return mockGetVulnerabilitiesCount();
    }
    const response = await axiosInstance.get('/stats/vulnerabilities/count');
    return response;
  },

  /**
   * Get SBOM count
   */
  getSBOMCount: async () => {
    if (useMockDashboard()) {
      return mockGetSBOMCount();
    }
    const response = await axiosInstance.get('/stats/sbom/count');
    return response;
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit = 8) => {
    if (useMockDashboard()) {
      return mockGetRecentActivities(limit);
    }
    const response = await axiosInstance.get('/activities/recent', {
      params: { limit },
    });
    return response;
  },

  /**
   * Get vulnerability trend
   */
  getVulnerabilityTrend: async (days = 7) => {
    if (useMockDashboard()) {
      return mockGetVulnerabilityTrend(days);
    }
    const response = await axiosInstance.get('/stats/vulnerabilities/trend', {
      params: { days },
    });
    return response;
  },

  /**
   * Get all dashboard stats
   */
  getAllStats: async () => {
    if (useMockDashboard()) {
      return mockGetDashboardStats();
    }
    const response = await axiosInstance.get('/stats/dashboard');
    return response;
  },
};
