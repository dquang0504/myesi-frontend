import axiosInstance from '../utils/axios';

/**
 * Check if we should use mock data
 */
const useMockAuditService = () => {
  return !process.env.REACT_APP_USE_REAL_API || process.env.REACT_APP_USE_REAL_API === 'false';
};

/**
 * Mock data generator for audit logs
 */
const generateMockAuditLogs = (filters = {}) => {
  const { page = 1, limit = 20, search = '', level = '', user = '', module = '', startDate = '', endDate = '' } = filters;

  const users = [
    'admin@myesi.com',
    'developer@myesi.com',
    'analyst@myesi.com',
    'auditor@myesi.com',
    'user@myesi.com',
    'system'
  ];

  const modules = [
    'Authentication',
    'User Management',
    'SBOM Management',
    'Vulnerability Scanner',
    'Reporting',
    'Billing',
    'Subscription',
    'System Configuration',
    'Audit System',
    'Project Management',
    'Database'
  ];

  const actions = {
    Authentication: [
      'User login successful',
      'User logout',
      'Failed login attempt',
      'Password changed',
      'Password reset requested',
      'Two-factor authentication enabled',
      'Session expired'
    ],
    'User Management': [
      'User created',
      'User updated',
      'User deleted',
      'User role changed',
      'User permissions updated',
      'User status changed to active',
      'User status changed to inactive'
    ],
    'SBOM Management': [
      'SBOM uploaded',
      'SBOM deleted',
      'SBOM scan completed',
      'SBOM download',
      'Invalid SBOM format detected'
    ],
    'Vulnerability Scanner': [
      'Critical vulnerability detected',
      'High vulnerability found',
      'Vulnerability scan completed',
      'Vulnerability fixed',
      'Vulnerability ignored'
    ],
    Reporting: [
      'Report generated',
      'Report exported',
      'Report scheduled',
      'Compliance report created',
      'Risk analysis exported'
    ],
    Billing: [
      'Payment processed',
      'Payment failed',
      'Invoice created',
      'Subscription updated',
      'Refund processed'
    ],
    Subscription: [
      'Subscription created',
      'Subscription cancelled',
      'Subscription renewed',
      'Plan upgraded',
      'Plan downgraded'
    ],
    'System Configuration': [
      'Settings updated',
      'Configuration changed',
      'Integration enabled',
      'Integration disabled'
    ]
  };

  const levels = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];

  // Generate mock logs
  const allLogs = [];
  for (let i = 0; i < 200; i++) {
    const module = modules[Math.floor(Math.random() * modules.length)];
    const moduleActions = actions[module] || ['Action performed'];
    const action = moduleActions[Math.floor(Math.random() * moduleActions.length)];
    const selectedUser = users[Math.floor(Math.random() * users.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    allLogs.push({
      id: `LOG-${String(i + 1).padStart(6, '0')}`,
      timestamp: timestamp.toISOString(),
      level,
      user: selectedUser,
      action,
      module,
      ip: selectedUser === 'system' ? 'system' : `192.168.1.${Math.floor(Math.random() * 200) + 1}`,
      details: `${action} - Details about this action`,
      metadata: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        duration: Math.floor(Math.random() * 5000),
        status: Math.random() > 0.9 ? 'failed' : 'success'
      }
    });
  }

  // Apply filters
  let filteredLogs = allLogs;

  if (search) {
    filteredLogs = filteredLogs.filter(log =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }

  if (user) {
    filteredLogs = filteredLogs.filter(log => log.user === user);
  }

  if (module) {
    filteredLogs = filteredLogs.filter(log => log.module === module);
  }

  // Sort by timestamp descending
  filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      logs: paginatedLogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredLogs.length / limit),
        totalItems: filteredLogs.length,
        itemsPerPage: limit
      },
      stats: {
        total: allLogs.length,
        info: allLogs.filter(l => l.level === 'INFO').length,
        warning: allLogs.filter(l => l.level === 'WARNING').length,
        error: allLogs.filter(l => l.level === 'ERROR').length,
        debug: allLogs.filter(l => l.level === 'DEBUG').length
      }
    }
  };
};

/**
 * Mock subscription status data
 */
const generateMockSubscriptionStatus = () => {
  return {
    success: true,
    data: {
      totalSubscriptions: 24,
      activeSubscriptions: 18,
      cancelledSubscriptions: 4,
      pastDueSubscriptions: 2,
      totalRevenue: 47800,
      monthlyRevenue: 3600,
      subscriptions: [
        {
          id: 'sub_1',
          userId: 'user_1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          plan: 'Professional',
          status: 'active',
          amount: 2900,
          currency: 'USD',
          interval: 'month',
          currentPeriodStart: '2025-01-01',
          currentPeriodEnd: '2025-02-01',
          createdAt: '2024-06-15',
          cancelAt: null
        },
        {
          id: 'sub_2',
          userId: 'user_2',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          plan: 'Enterprise',
          status: 'active',
          amount: 9900,
          currency: 'USD',
          interval: 'month',
          currentPeriodStart: '2025-01-05',
          currentPeriodEnd: '2025-02-05',
          createdAt: '2024-08-20',
          cancelAt: null
        },
        {
          id: 'sub_3',
          userId: 'user_3',
          userName: 'Bob Johnson',
          userEmail: 'bob@example.com',
          plan: 'Basic',
          status: 'past_due',
          amount: 990,
          currency: 'USD',
          interval: 'month',
          currentPeriodStart: '2025-01-10',
          currentPeriodEnd: '2025-02-10',
          createdAt: '2024-11-12',
          cancelAt: null
        },
        {
          id: 'sub_4',
          userId: 'user_4',
          userName: 'Alice Williams',
          userEmail: 'alice@example.com',
          plan: 'Professional',
          status: 'cancelled',
          amount: 2900,
          currency: 'USD',
          interval: 'month',
          currentPeriodStart: '2025-01-03',
          currentPeriodEnd: '2025-02-03',
          createdAt: '2024-07-30',
          cancelAt: '2025-01-20'
        }
      ]
    }
  };
};

/**
 * Audit service for API calls
 */
export const auditService = {
  /**
   * Get audit logs with filters
   */
  getAuditLogs: async (params) => {
    if (useMockAuditService()) {
      return new Promise(resolve => {
        setTimeout(() => resolve(generateMockAuditLogs(params)), 500);
      });
    }
    const response = await axiosInstance.get('/admin/audit', { params });
    return response;
  },

  /**
   * Get audit log by ID
   */
  getAuditLogById: async (id) => {
    if (useMockAuditService()) {
      const logs = generateMockAuditLogs();
      const log = logs.data.logs.find(l => l.id === id);
      return { success: true, data: log };
    }
    const response = await axiosInstance.get(`/admin/audit/${id}`);
    return response;
  },

  /**
   * Get subscription status overview
   */
  getSubscriptionStatus: async () => {
    if (useMockAuditService()) {
      return new Promise(resolve => {
        setTimeout(() => resolve(generateMockSubscriptionStatus()), 300);
      });
    }
    const response = await axiosInstance.get('/admin/subscriptions/status');
    return response;
  },

  /**
   * Export audit logs
   */
  exportAuditLogs: async (params) => {
    if (useMockAuditService()) {
      return { success: true, data: { downloadUrl: '/mock/audit-export.csv' } };
    }
    const response = await axiosInstance.get('/admin/audit/export', { params });
    return response;
  }
};
