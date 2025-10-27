import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import AdminReports from './pages/Admin/Reports';
import DeveloperDashboard from './pages/Developer/Dashboard';
import AnalystDashboard from './pages/Analyst/Dashboard';
import AuditorDashboard from './pages/Auditor/Dashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import BillingStatus from './pages/BillingStatus';
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
          path="/admin/reports"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/subscription"
          element={
            <PrivateRoute requiredRole="admin">
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/billing"
          element={
            <PrivateRoute requiredRole="admin">
              <BillingStatus />
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
          path="/developer/subscription"
          element={
            <PrivateRoute requiredRole="developer">
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/developer/billing"
          element={
            <PrivateRoute requiredRole="developer">
              <BillingStatus />
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
          path="/analyst/subscription"
          element={
            <PrivateRoute requiredRole="analyst">
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/analyst/billing"
          element={
            <PrivateRoute requiredRole="analyst">
              <BillingStatus />
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
          path="/auditor/subscription"
          element={
            <PrivateRoute requiredRole="auditor">
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/auditor/billing"
          element={
            <PrivateRoute requiredRole="auditor">
              <BillingStatus />
            </PrivateRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
