import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import DeveloperDashboard from './pages/Developer/Dashboard';
import AnalystDashboard from './pages/Analyst/Dashboard';
import AuditorDashboard from './pages/Auditor/Dashboard';
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

        {/* Developer Routes */}
        <Route
          path="/developer/dashboard"
          element={
            <PrivateRoute requiredRole="developer">
              <DeveloperDashboard />
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

        {/* Auditor Routes */}
        <Route
          path="/auditor/dashboard"
          element={
            <PrivateRoute requiredRole="auditor">
              <AuditorDashboard />
            </PrivateRoute>
          }
        />

        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
