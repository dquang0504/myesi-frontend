/**
 * Mock Dashboard Stats Service
 * Simulates backend API responses for admin dashboard
 */

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock recent activities
 */
const MOCK_ACTIVITIES = [
  {
    id: 'act_001',
    user: 'John Developer',
    action: 'created',
    target: 'SBOM Project: Web App v2.0',
    timestamp: '2025-10-20T10:30:00Z',
  },
  {
    id: 'act_002',
    user: 'Sarah Analyst',
    action: 'updated',
    target: 'Vulnerability Report #145',
    timestamp: '2025-10-20T09:15:00Z',
  },
  {
    id: 'act_003',
    user: 'Mike Auditor',
    action: 'login',
    target: 'System Access',
    timestamp: '2025-10-20T08:45:00Z',
  },
  {
    id: 'act_004',
    user: 'Emily Chen',
    action: 'created',
    target: 'Component: React v18.2.0',
    timestamp: '2025-10-19T16:20:00Z',
  },
  {
    id: 'act_005',
    user: 'Admin User',
    action: 'deleted',
    target: 'User: inactive_user@myesi.com',
    timestamp: '2025-10-19T14:10:00Z',
  },
  {
    id: 'act_006',
    user: 'Lisa Martinez',
    action: 'updated',
    target: 'SBOM Project: Mobile App',
    timestamp: '2025-10-19T11:30:00Z',
  },
  {
    id: 'act_007',
    user: 'Robert Johnson',
    action: 'login',
    target: 'System Access',
    timestamp: '2025-10-19T09:00:00Z',
  },
  {
    id: 'act_008',
    user: 'Jennifer Lee',
    action: 'created',
    target: 'Analysis Report #234',
    timestamp: '2025-10-18T15:45:00Z',
  },
];

/**
 * Mock vulnerability trend data (last 7 days)
 */
const MOCK_VULNERABILITY_TREND = [
  { date: '2025-10-14', critical: 5, high: 12, medium: 23, low: 45 },
  { date: '2025-10-15', critical: 4, high: 11, medium: 25, low: 43 },
  { date: '2025-10-16', critical: 6, high: 13, medium: 22, low: 48 },
  { date: '2025-10-17', critical: 3, high: 10, medium: 24, low: 46 },
  { date: '2025-10-18', critical: 5, high: 14, medium: 21, low: 44 },
  { date: '2025-10-19', critical: 4, high: 12, medium: 26, low: 47 },
  { date: '2025-10-20', critical: 7, high: 15, medium: 23, low: 42 },
];

/**
 * Get total users count
 */
export const mockGetUsersCount = async () => {
  await delay(400);
  return {
    data: {
      total: 120,
      active: 98,
      inactive: 22,
      change: 5.2, // percentage change from last period
      trend: 'up',
    },
  };
};

/**
 * Get projects count
 */
export const mockGetProjectsCount = async () => {
  await delay(450);
  return {
    data: {
      total: 45,
      active: 32,
      completed: 13,
      change: 12.5,
      trend: 'up',
    },
  };
};

/**
 * Get vulnerabilities count
 */
export const mockGetVulnerabilitiesCount = async () => {
  await delay(500);
  return {
    data: {
      total: 237,
      critical: 7,
      high: 15,
      medium: 23,
      low: 42,
      resolved: 150,
      change: -8.3, // negative means reduction (good)
      trend: 'down',
    },
  };
};

/**
 * Get SBOM count (bonus stat)
 */
export const mockGetSBOMCount = async () => {
  await delay(420);
  return {
    data: {
      total: 89,
      scanned: 76,
      pending: 13,
      change: 15.8,
      trend: 'up',
    },
  };
};

/**
 * Get recent activities
 */
export const mockGetRecentActivities = async (limit = 8) => {
  await delay(600);
  return {
    data: {
      activities: MOCK_ACTIVITIES.slice(0, limit),
      total: MOCK_ACTIVITIES.length,
    },
  };
};

/**
 * Get vulnerability trend data
 */
export const mockGetVulnerabilityTrend = async (days = 7) => {
  await delay(700);
  return {
    data: {
      trend: MOCK_VULNERABILITY_TREND.slice(-days),
      summary: {
        totalCritical: MOCK_VULNERABILITY_TREND.reduce((sum, day) => sum + day.critical, 0),
        totalHigh: MOCK_VULNERABILITY_TREND.reduce((sum, day) => sum + day.high, 0),
        totalMedium: MOCK_VULNERABILITY_TREND.reduce((sum, day) => sum + day.medium, 0),
        totalLow: MOCK_VULNERABILITY_TREND.reduce((sum, day) => sum + day.low, 0),
      },
    },
  };
};

/**
 * Get all dashboard stats in one call
 */
export const mockGetDashboardStats = async () => {
  await delay(800);
  
  const [users, projects, vulnerabilities, sboms] = await Promise.all([
    mockGetUsersCount(),
    mockGetProjectsCount(),
    mockGetVulnerabilitiesCount(),
    mockGetSBOMCount(),
  ]);

  return {
    data: {
      users: users.data,
      projects: projects.data,
      vulnerabilities: vulnerabilities.data,
      sboms: sboms.data,
    },
  };
};

/**
 * Check if mock service should be used
 */
export const useMockDashboard = () => {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true';
};
