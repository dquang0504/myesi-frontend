import React from 'react';
import AdminSidebar from './AdminSidebar';
import '../styles/admin-layout.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
}
