import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="error-icon">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="#d32f2f" strokeWidth="4" fill="none"/>
            <path d="M30 30 L70 70 M70 30 L30 70" stroke="#d32f2f" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h1 className="error-code">403</h1>
        <h2 className="error-title">Access Denied</h2>
        <p className="error-message">
          You don't have permission to access this page.
          {user && (
            <span className="user-role"> Your current role is <strong>{user.role}</strong>.</span>
          )}
        </p>

        <div className="action-buttons">
          <button onClick={handleGoBack} className="btn btn-secondary">
            Go Back
          </button>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
