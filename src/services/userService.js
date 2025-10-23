import axiosInstance from '../utils/axios';
import {
  useMockUserService,
  mockGetUsers,
  mockGetUserById,
  mockCreateUser,
  mockUpdateUser,
  mockDeleteUser,
  mockToggleUserStatus,
} from './mockUserService';

/**
 * User management service for API calls
 */
export const userService = {
  /**
   * Get all users with filters
   * @param {object} params - Query parameters (page, limit, search, role, status)
   * @returns {Promise} Users list with pagination
   */
  getUsers: async (params) => {
    if (useMockUserService()) {
      return mockGetUsers(params);
    }
    const response = await axiosInstance.get('/users', { params });
    return response;
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} User data
   */
  getUserById: async (id) => {
    if (useMockUserService()) {
      return mockGetUserById(id);
    }
    const response = await axiosInstance.get(`/users/${id}`);
    return response;
  },

  /**
   * Create new user
   * @param {object} userData - User data
   * @returns {Promise} Created user data
   */
  createUser: async (userData) => {
    if (useMockUserService()) {
      return mockCreateUser(userData);
    }
    const response = await axiosInstance.post('/users', userData);
    return response;
  },

  /**
   * Update existing user
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  updateUser: async (id, userData) => {
    if (useMockUserService()) {
      return mockUpdateUser(id, userData);
    }
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response;
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise} Delete response
   */
  deleteUser: async (id) => {
    if (useMockUserService()) {
      return mockDeleteUser(id);
    }
    const response = await axiosInstance.delete(`/users/${id}`);
    return response;
  },

  /**
   * Toggle user status (active/inactive)
   * @param {string} id - User ID
   * @param {string} status - New status (active/inactive)
   * @returns {Promise} Updated user data
   */
  toggleUserStatus: async (id, status) => {
    if (useMockUserService()) {
      return mockToggleUserStatus(id, status);
    }
    const response = await axiosInstance.patch(`/users/${id}/status`, { status });
    return response;
  },
};
