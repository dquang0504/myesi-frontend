import axiosInstance from '../utils/axios';
import { mockLogin, mockLogout, mockGetProfile, useMockAuth } from './mockAuthService';

/**
 * Authentication service for API calls
 */
export const authService = {
  /**
   * Login user with email and password
   * @param {object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} Login response with token and user data
   */
  login: async (credentials) => {
    // Use mock auth if API is not available
    if (useMockAuth()) {
      return await mockLogin(credentials);
    }
    const response = await axiosInstance.post('/auth/login', credentials);
    return response;
  },

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  logout: async () => {
    try {
      // Use mock auth if API is not available
      if (useMockAuth()) {
        return await mockLogout();
      }
      const response = await axiosInstance.post('/auth/logout');
      return response;
    } catch (error) {
      // Even if API fails, we should logout locally
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    // Use mock auth if API is not available
    if (useMockAuth()) {
      return await mockGetProfile();
    }
    const response = await axiosInstance.get('/auth/profile');
    return response;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} New access token
   */
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response;
  },
};
