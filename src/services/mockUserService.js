/**
 * Mock User Service for Demo/Testing
 * Simulates backend API responses for user management
 */

// Mock users database
let MOCK_USERS_DB = [
  {
    id: 'user_001',
    name: 'Admin User',
    email: 'admin@myesi.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    lastLogin: '2025-10-19T08:30:00Z',
  },
  {
    id: 'user_002',
    name: 'John Developer',
    email: 'developer@myesi.com',
    role: 'Developer',
    status: 'active',
    createdAt: '2025-02-20T14:00:00Z',
    lastLogin: '2025-10-18T16:45:00Z',
  },
  {
    id: 'user_003',
    name: 'Sarah Analyst',
    email: 'analyst@myesi.com',
    role: 'Analyst',
    status: 'active',
    createdAt: '2025-03-10T09:00:00Z',
    lastLogin: '2025-10-19T07:15:00Z',
  },
  {
    id: 'user_004',
    name: 'Mike Auditor',
    email: 'auditor@myesi.com',
    role: 'Auditor',
    status: 'active',
    createdAt: '2025-03-25T11:00:00Z',
    lastLogin: '2025-10-17T13:20:00Z',
  },
  {
    id: 'user_005',
    name: 'Emily Chen',
    email: 'emily.chen@myesi.com',
    role: 'Developer',
    status: 'active',
    createdAt: '2025-04-05T10:30:00Z',
    lastLogin: '2025-10-19T09:00:00Z',
  },
  {
    id: 'user_006',
    name: 'Robert Johnson',
    email: 'robert.j@myesi.com',
    role: 'Analyst',
    status: 'inactive',
    createdAt: '2025-05-12T15:00:00Z',
    lastLogin: '2025-09-30T10:00:00Z',
  },
  {
    id: 'user_007',
    name: 'Lisa Martinez',
    email: 'lisa.m@myesi.com',
    role: 'Developer',
    status: 'active',
    createdAt: '2025-06-01T08:00:00Z',
    lastLogin: '2025-10-18T14:30:00Z',
  },
  {
    id: 'user_008',
    name: 'David Wilson',
    email: 'david.w@myesi.com',
    role: 'Auditor',
    status: 'inactive',
    createdAt: '2025-06-15T12:00:00Z',
    lastLogin: '2025-10-10T11:00:00Z',
  },
  {
    id: 'user_009',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@myesi.com',
    role: 'Analyst',
    status: 'active',
    createdAt: '2025-07-20T09:30:00Z',
    lastLogin: '2025-10-19T06:45:00Z',
  },
  {
    id: 'user_010',
    name: 'Michael Brown',
    email: 'michael.b@myesi.com',
    role: 'Developer',
    status: 'active',
    createdAt: '2025-08-10T13:00:00Z',
    lastLogin: '2025-10-18T17:00:00Z',
  },
];

/**
 * Simulate network delay
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `user_${timestamp}_${random}`;
};

/**
 * Get users with filters and pagination
 */
export const mockGetUsers = async (params = {}) => {
  await delay(600);

  const { page = 1, limit = 10, search = '', role = '', status = '' } = params;

  // Filter users
  let filteredUsers = [...MOCK_USERS_DB];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  if (role) {
    filteredUsers = filteredUsers.filter((user) => user.role === role);
  }

  if (status) {
    filteredUsers = filteredUsers.filter((user) => user.status === status);
  }

  // Sort by creation date (newest first)
  filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    data: {
      users: paginatedUsers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  };
};

/**
 * Get user by ID
 */
export const mockGetUserById = async (id) => {
  await delay(300);

  const user = MOCK_USERS_DB.find((u) => u.id === id);

  if (!user) {
    throw {
      response: {
        status: 404,
        data: { message: 'User not found' },
      },
    };
  }

  return { data: user };
};

/**
 * Create new user
 */
export const mockCreateUser = async (userData) => {
  await delay(700);

  // Validate email uniqueness
  const emailExists = MOCK_USERS_DB.find((u) => u.email === userData.email);
  if (emailExists) {
    throw {
      response: {
        status: 400,
        data: { message: 'Email already exists' },
      },
    };
  }

  const newUser = {
    id: generateId(),
    ...userData,
    status: userData.status || 'active',
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  MOCK_USERS_DB.unshift(newUser);

  return { data: newUser };
};

/**
 * Update existing user
 */
export const mockUpdateUser = async (id, userData) => {
  await delay(700);

  const userIndex = MOCK_USERS_DB.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    throw {
      response: {
        status: 404,
        data: { message: 'User not found' },
      },
    };
  }

  // Validate email uniqueness (if email is being changed)
  if (userData.email && userData.email !== MOCK_USERS_DB[userIndex].email) {
    const emailExists = MOCK_USERS_DB.find((u) => u.email === userData.email);
    if (emailExists) {
      throw {
        response: {
          status: 400,
          data: { message: 'Email already exists' },
        },
      };
    }
  }

  const updatedUser = {
    ...MOCK_USERS_DB[userIndex],
    ...userData,
  };

  MOCK_USERS_DB[userIndex] = updatedUser;

  return { data: updatedUser };
};

/**
 * Delete user
 */
export const mockDeleteUser = async (id) => {
  await delay(500);

  const userIndex = MOCK_USERS_DB.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    throw {
      response: {
        status: 404,
        data: { message: 'User not found' },
      },
    };
  }

  const deletedUser = MOCK_USERS_DB[userIndex];
  MOCK_USERS_DB.splice(userIndex, 1);

  return { data: { message: 'User deleted successfully', user: deletedUser } };
};

/**
 * Toggle user status
 */
export const mockToggleUserStatus = async (id, status) => {
  await delay(400);

  const userIndex = MOCK_USERS_DB.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    throw {
      response: {
        status: 404,
        data: { message: 'User not found' },
      },
    };
  }

  MOCK_USERS_DB[userIndex].status = status;

  return { data: MOCK_USERS_DB[userIndex] };
};

/**
 * Check if mock user service should be used
 */
export const useMockUserService = () => {
  return import.meta.env.VITE_USE_MOCK_AUTH === 'true';
};
