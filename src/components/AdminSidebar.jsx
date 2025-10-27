import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminSidebar.css';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get role from user or infer from path
  const userRole = user?.role?.toLowerCase() || 
    (location.pathname.startsWith('/admin') ? 'admin' :
    location.pathname.startsWith('/developer') ? 'developer' :
    location.pathname.startsWith('/analyst') ? 'analyst' :
    location.pathname.startsWith('/auditor') ? 'auditor' : 'admin');

  const getRoleBasePath = () => {
    return `/${userRole}`;
  };

  const getRoleTitle = () => {
    return userRole.charAt(0).toUpperCase() + userRole.slice(1) + ' Portal';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-overlay show"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <Link to={`${getRoleBasePath()}/dashboard`} className="sidebar-logo">
            <div className="logo-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="logo-text">
              <h2>MyESI</h2>
              <p>{getRoleTitle()}</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar-sidebar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="user-details">
              <h3>{user?.name || 'User'}</h3>
              <p>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-section-title">Main</h4>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link
                  to={`${getRoleBasePath()}/dashboard`}
                  className={`nav-link ${isActive(`${getRoleBasePath()}/dashboard`) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="nav-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>

              {userRole === 'admin' && (
                <li className="nav-item">
                  <Link
                    to="/admin/users"
                    className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <svg
                      className="nav-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="nav-text">User Management</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">Billing</h4>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link
                  to={`${getRoleBasePath()}/subscription`}
                  className={`nav-link ${isActive(`${getRoleBasePath()}/subscription`) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="nav-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="nav-text">Subscription</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={`${getRoleBasePath()}/billing`}
                  className={`nav-link ${isActive(`${getRoleBasePath()}/billing`) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="nav-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="nav-text">Billing</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <h4 className="nav-section-title">System</h4>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link
                  to={`${getRoleBasePath()}/reports`}
                  className={`nav-link ${isActive(`${getRoleBasePath()}/reports`) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="nav-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="nav-text">Reports</span>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={`${getRoleBasePath()}/settings`}
                  className={`nav-link ${isActive(`${getRoleBasePath()}/settings`) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg
                    className="nav-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="nav-text">Settings</span>
                  <span className="nav-badge">Soon</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-link">
            <svg
              className="logout-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
