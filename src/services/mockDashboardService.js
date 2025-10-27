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
 * Mock SBOM Analytics Data
 */
const MOCK_SBOM_ANALYTICS = {
  totalSBOMs: 89,
  scannedToday: 12,
  avgComponentsPerSBOM: 245,
  topLanguages: [
    { name: 'JavaScript', count: 34, percentage: 38.2 },
    { name: 'Python', count: 28, percentage: 31.5 },
    { name: 'Java', count: 15, percentage: 16.9 },
    { name: 'Go', count: 8, percentage: 9.0 },
    { name: 'Other', count: 4, percentage: 4.4 },
  ],
  sbomTrend: [
    { date: '2025-10-14', scanned: 8, uploaded: 10 },
    { date: '2025-10-15', scanned: 11, uploaded: 12 },
    { date: '2025-10-16', scanned: 9, uploaded: 11 },
    { date: '2025-10-17', scanned: 13, uploaded: 14 },
    { date: '2025-10-18', scanned: 10, uploaded: 9 },
    { date: '2025-10-19', scanned: 14, uploaded: 15 },
    { date: '2025-10-20', scanned: 12, uploaded: 13 },
  ],
};

/**
 * Mock Risk Score Data
 */
const MOCK_RISK_SCORES = {
  overallRisk: 6.8,
  riskTrend: 'down',
  riskChange: -1.2,
  distribution: [
    { name: 'Critical', value: 7, color: '#ef4444' },
    { name: 'High', value: 15, color: '#f59e0b' },
    { name: 'Medium', value: 23, color: '#eab308' },
    { name: 'Low', value: 42, color: '#10b981' },
  ],
  riskByProject: [
    { project: 'Web App v2.0', score: 8.5, status: 'critical' },
    { project: 'Mobile App', score: 7.2, status: 'high' },
    { project: 'API Gateway', score: 5.4, status: 'medium' },
    { project: 'Admin Portal', score: 3.8, status: 'low' },
    { project: 'Analytics Dashboard', score: 6.1, status: 'medium' },
  ],
};

/**
 * Mock Compliance Data
 */
const MOCK_COMPLIANCE = {
  overallScore: 87.5,
  complianceStandards: [
    { name: 'NIST', score: 92, target: 90, status: 'passing' },
    { name: 'OWASP', score: 88, target: 85, status: 'passing' },
    { name: 'CIS', score: 85, target: 90, status: 'warning' },
    { name: 'PCI-DSS', score: 82, target: 85, status: 'warning' },
    { name: 'HIPAA', score: 90, target: 90, status: 'passing' },
  ],
  complianceTrend: [
    { date: '2025-10-14', score: 84.2 },
    { date: '2025-10-15', score: 85.1 },
    { date: '2025-10-16', score: 86.0 },
    { date: '2025-10-17', score: 86.5 },
    { date: '2025-10-18', score: 86.8 },
    { date: '2025-10-19', score: 87.2 },
    { date: '2025-10-20', score: 87.5 },
  ],
};

/**
 * Mock Top Vulnerabilities
 */
const MOCK_TOP_VULNERABILITIES = [
  {
    id: 'CVE-2024-1234',
    title: 'SQL Injection in Auth Module',
    severity: 'critical',
    cvssScore: 9.8,
    affected: 3,
    status: 'open',
    discovered: '2025-10-18',
  },
  {
    id: 'CVE-2024-5678',
    title: 'Cross-Site Scripting (XSS)',
    severity: 'high',
    cvssScore: 7.5,
    affected: 5,
    status: 'in-progress',
    discovered: '2025-10-17',
  },
  {
    id: 'CVE-2024-9012',
    title: 'Remote Code Execution',
    severity: 'critical',
    cvssScore: 9.1,
    affected: 2,
    status: 'open',
    discovered: '2025-10-16',
  },
  {
    id: 'CVE-2024-3456',
    title: 'Path Traversal Vulnerability',
    severity: 'high',
    cvssScore: 7.8,
    affected: 4,
    status: 'resolved',
    discovered: '2025-10-15',
  },
  {
    id: 'CVE-2024-7890',
    title: 'Insecure Deserialization',
    severity: 'high',
    cvssScore: 8.1,
    affected: 1,
    status: 'in-progress',
    discovered: '2025-10-14',
  },
];

/**
 * Mock Component Inventory
 */
const MOCK_COMPONENT_INVENTORY = {
  total: 2145,
  outdated: 234,
  vulnerable: 87,
  topComponents: [
    { name: 'React', version: '18.2.0', usageCount: 45, hasVulnerability: false },
    { name: 'Express', version: '4.18.2', usageCount: 32, hasVulnerability: false },
    { name: 'Lodash', version: '4.17.19', usageCount: 28, hasVulnerability: true },
    { name: 'Axios', version: '1.3.4', usageCount: 38, hasVulnerability: false },
    { name: 'Moment.js', version: '2.29.1', usageCount: 15, hasVulnerability: true },
  ],
};

/**
 * Get SBOM Analytics
 */
export const mockGetSBOMAnalytics = async () => {
  await delay(600);
  return {
    data: MOCK_SBOM_ANALYTICS,
  };
};

/**
 * Get Risk Scores
 */
export const mockGetRiskScores = async () => {
  await delay(550);
  return {
    data: MOCK_RISK_SCORES,
  };
};

/**
 * Get Compliance Data
 */
export const mockGetCompliance = async () => {
  await delay(650);
  return {
    data: MOCK_COMPLIANCE,
  };
};

/**
 * Get Top Vulnerabilities
 */
export const mockGetTopVulnerabilities = async (limit = 5) => {
  await delay(500);
  return {
    data: {
      vulnerabilities: MOCK_TOP_VULNERABILITIES.slice(0, limit),
      total: MOCK_TOP_VULNERABILITIES.length,
    },
  };
};

/**
 * Get Component Inventory
 */
export const mockGetComponentInventory = async () => {
  await delay(700);
  return {
    data: MOCK_COMPONENT_INVENTORY,
  };
};

/**
 * Get all analytics data in one call
 */
export const mockGetAnalytics = async () => {
  await delay(900);
  
  const [sbomData, riskData, complianceData, vulnerabilitiesData, componentsData] = await Promise.all([
    mockGetSBOMAnalytics(),
    mockGetRiskScores(),
    mockGetCompliance(),
    mockGetTopVulnerabilities(),
    mockGetComponentInventory(),
  ]);

  return {
    data: {
      sbom: sbomData.data,
      risk: riskData.data,
      compliance: complianceData.data,
      topVulnerabilities: vulnerabilitiesData.data.vulnerabilities,
      components: componentsData.data,
    },
  };
};

/**
 * Check if mock service should be used
 */
export const useMockDashboard = () => {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true';
};
