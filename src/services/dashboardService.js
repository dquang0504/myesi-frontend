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
  mockGetSBOMAnalytics,
  mockGetRiskScores,
  mockGetCompliance,
  mockGetTopVulnerabilities,
  mockGetComponentInventory,
  mockGetAnalytics,
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

  /**
   * Get SBOM analytics
   */
  getSBOMAnalytics: async () => {
    if (useMockDashboard()) {
      return mockGetSBOMAnalytics();
    }
    const response = await axiosInstance.get('/analytics/sbom');
    return response;
  },

  /**
   * Get risk scores
   */
  getRiskScores: async () => {
    if (useMockDashboard()) {
      return mockGetRiskScores();
    }
    const response = await axiosInstance.get('/analytics/risk');
    return response;
  },

  /**
   * Get compliance data
   */
  getCompliance: async () => {
    if (useMockDashboard()) {
      return mockGetCompliance();
    }
    const response = await axiosInstance.get('/analytics/compliance');
    return response;
  },

  /**
   * Get top vulnerabilities
   */
  getTopVulnerabilities: async (limit = 5) => {
    if (useMockDashboard()) {
      return mockGetTopVulnerabilities(limit);
    }
    const response = await axiosInstance.get('/vulnerabilities/top', {
      params: { limit },
    });
    return response;
  },

  /**
   * Get component inventory
   */
  getComponentInventory: async () => {
    if (useMockDashboard()) {
      return mockGetComponentInventory();
    }
    const response = await axiosInstance.get('/components/inventory');
    return response;
  },

  /**
   * Get all analytics data
   */
  getAllAnalytics: async () => {
    if (useMockDashboard()) {
      return mockGetAnalytics();
    }
    const response = await axiosInstance.get('/analytics/all');
    return response;
  },
};
