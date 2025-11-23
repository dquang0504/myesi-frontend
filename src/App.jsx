import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import AdminReports from './pages/Admin/Reports';
import AuditLogs from './pages/Admin/AuditLogs';
import SubscriptionStatus from './pages/Admin/SubscriptionStatus';
import Notifications from './pages/Admin/Notifications';
import DeveloperDashboard from './pages/Developer/Dashboard';
import DeveloperReports from './pages/Developer/Reports';
import AnalystDashboard from './pages/Analyst/Dashboard';
import AnalystReports from './pages/Analyst/Reports';
import AuditorDashboard from './pages/Auditor/Dashboard';
import AuditReports from './pages/Auditor/AuditReports';
import AuditorCompliance from './pages/Auditor/Compliance';
import SystemLogs from './pages/Auditor/SystemLogs';
import BillingPortal from './pages/BillingPortal';
import './App.css';

export const apiURL = "https://localhost:8000/api"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute requiredRole="admin">
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <PrivateRoute requiredRole="admin">
              <AuditLogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/subscription-status"
          element={
            <PrivateRoute requiredRole="admin">
              <SubscriptionStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <PrivateRoute requiredRole="admin">
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/billing"
          element={
            <PrivateRoute requiredRole="admin">
              <BillingPortal />
            </PrivateRoute>
          }
        />

        {/* Developer Routes */}
        <Route
          path="/developer/dashboard"
          element={
            <PrivateRoute requiredRole="developer">
              <DeveloperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/developer/reports"
          element={
            <PrivateRoute requiredRole="developer">
              <DeveloperReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/developer/billing"
          element={
            <PrivateRoute requiredRole="developer">
              <BillingPortal />
            </PrivateRoute>
          }
        />

        {/* Analyst Routes */}
        <Route
          path="/analyst/dashboard"
          element={
            <PrivateRoute requiredRole="analyst">
              <AnalystDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/analyst/reports"
          element={
            <PrivateRoute requiredRole="analyst">
              <AnalystReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/analyst/billing"
          element={
            <PrivateRoute requiredRole="analyst">
              <BillingPortal />
            </PrivateRoute>
          }
        />

        {/* Auditor Routes */}
        <Route
          path="/auditor/dashboard"
          element={
            <PrivateRoute requiredRole="auditor">
              <AuditorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditor/reports"
          element={
            <PrivateRoute requiredRole="auditor">
              <AuditReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditor/compliance"
          element={
            <PrivateRoute requiredRole="auditor">
              <AuditorCompliance />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditor/logs"
          element={
            <PrivateRoute requiredRole="auditor">
              <SystemLogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditor/billing"
          element={
            <PrivateRoute requiredRole="auditor">
              <BillingPortal />
            </PrivateRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
