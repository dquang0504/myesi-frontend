/**
 * Mock Authentication Service
 * This simulates API calls for demo/development purposes
 */

// Mock user database
const MOCK_USERS = [
  {
    id: 'admin_001',
    name: 'Admin User',
    email: 'admin@myesi.com',
    password: 'demo123',
    role: 'Admin',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'dev_001',
    name: 'Developer User',
    email: 'developer@myesi.com',
    password: 'demo123',
    role: 'Developer',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'analyst_001',
    name: 'Analyst User',
    email: 'analyst@myesi.com',
    password: 'demo123',
    role: 'Analyst',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'auditor_001',
    name: 'Auditor User',
    email: 'auditor@myesi.com',
    password: 'demo123',
    role: 'Auditor',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
  },
];

/**
 * Generate a mock JWT token
 * @param {object} user - User object
 * @returns {string} Mock JWT token
 */
const generateMockToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };
  
  // In real app, this would be a proper JWT
  // For demo, we'll just base64 encode the payload
  return 'mock_' + btoa(JSON.stringify(payload));
};

/**
 * Simulate API delay
 * @param {number} ms - Milliseconds to delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock login function
 * @param {object} credentials - User credentials
 * @returns {Promise} Login response
 */
export const mockLogin = async (credentials) => {
  // Simulate network delay
  await delay(800);

  const { email, password } = credentials;

  // Find user by email
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw {
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Invalid email or password',
        },
      },
    };
  }

  // Check password
  if (user.password !== password) {
    throw {
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Invalid email or password',
        },
      },
    };
  }

  // Check if user is active
  if (user.status !== 'active') {
    throw {
      response: {
        status: 403,
        data: {
          success: false,
          message: 'Your account has been deactivated',
        },
      },
    };
  }

  // Generate token
  const accessToken = generateMockToken(user);

  // Return success response
  return {
    success: true,
    data: {
      accessToken,
      refreshToken: 'mock_refresh_token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

/**
 * Mock logout function
 * @returns {Promise} Logout response
 */
export const mockLogout = async () => {
  await delay(300);
  return {
    success: true,
    message: 'Logged out successfully',
  };
};

/**
 * Mock get profile function
 * @returns {Promise} User profile
 */
export const mockGetProfile = async () => {
  await delay(500);
  
  // Get token from localStorage
  const token = localStorage.getItem('accessToken');
  
  if (!token || !token.startsWith('mock_')) {
    throw {
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Unauthorized',
        },
      },
    };
  }

  try {
    // Decode mock token
    const payload = JSON.parse(atob(token.replace('mock_', '')));
    
    // Find user
    const user = MOCK_USERS.find(u => u.id === payload.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  } catch (error) {
    throw {
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Invalid token',
        },
      },
    };
  }
};

/**
 * Check if we should use mock auth
 * @returns {boolean}
 */
export const useMockAuth = () => {
  // Use mock auth if API is not configured or in development
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  return !apiUrl || apiUrl.includes('localhost:5000') || import.meta.env.VITE_USE_MOCK_AUTH === 'true';
};
