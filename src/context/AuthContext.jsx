import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { decodeToken, isTokenExpired, setToken as saveToken, getToken, removeToken } from '../utils/tokenHelper';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = getToken();
        
        if (savedToken && !isTokenExpired(savedToken)) {
          const decoded = decodeToken(savedToken);
          setToken(savedToken);
          setUser({
            id: decoded.userId || decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
          });
          setIsAuthenticated(true);
        } else if (savedToken) {
          // Token expired, clean up
          removeToken();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user
   * @param {object} credentials - User credentials
   * @returns {Promise} Login result
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      const { access_token, user: userData } = response;
      
      // Save token
      saveToken(access_token);
      setToken(access_token);
      
      // Decode token to get additional info if needed
      const decoded = decodeToken(access_token);
      
      // Set user data
      const userInfo = {
        id: userData.id || decoded.userId || decoded.id,
        email: userData.email || decoded.email,
        name: userData.name || decoded.name,
        role: userData.role || decoded.role,
      };
      
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setIsAuthenticated(true);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API response
      removeToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      toast.info('You have been logged out');
    }
  };

  /**
   * Check if user has specific role
   * @param {string|string[]} requiredRole - Required role(s)
   * @returns {boolean} True if user has required role
   */
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
