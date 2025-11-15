import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main 
        id="main-content"
        className="admin-main-content"
        role="main"
        aria-label="Main content"
        tabIndex="-1"
      >
        {children}
      </main>
    </div>
  );
}
