import { jwtDecode } from 'jwt-decode';

/**
 * Decode JWT token and extract user information
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    // Handle mock tokens
    if (token.startsWith('mock_')) {
      const payload = JSON.parse(atob(token.replace('mock_', '')));
      return payload;
    }
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get user role from token
 * @param {string} token - JWT token
 * @returns {string|null} User role
 */
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Store token in localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

/**
 * Get token from localStorage
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};
