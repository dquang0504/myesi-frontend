import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '../../components/AdminLayout';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus,
  useDebounce,
} from '../../hooks/useUsers';
import { ROLE_OPTIONS, STATUS_OPTIONS } from '../../utils/roles';
import './UserManagement.css';

// Validation schema for user form
const userSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  role: Yup.string()
    .oneOf(['Admin', 'Developer', 'Analyst', 'Auditor'], 'Invalid role')
    .required('Role is required'),
  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
});

export default function UserManagement() {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch users with filters
  const { data, isLoading, isError, error } = useUsers({
    page: currentPage,
    limit: pageLimit,
    search: debouncedSearch,
    role: roleFilter,
    status: statusFilter,
  });

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};

  // Handle create user
  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await toggleStatusMutation.mutateAsync({ id: userId, status: newStatus });
  };

  // Handle form submit
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (modalMode === 'create') {
        await createUserMutation.mutateAsync(values);
      } else {
        await updateUserMutation.mutateAsync({ id: selectedUser.id, data: values });
      }
      setIsModalOpen(false);
      resetForm();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="user-management">
        {/* Header */}
        <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage users, roles, and access permissions</p>
        </div>
        <button className="btn-primary" onClick={handleCreateUser}>
          <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {(searchTerm || roleFilter || statusFilter) && (
          <button className="btn-reset" onClick={handleResetFilters}>
            Reset Filters
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="table-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading users...</p>
          </div>
        ) : isError ? (
          <div className="error-state">
            <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Error loading users: {error?.message}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No users found</p>
            <p className="empty-subtitle">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={user.status === 'active'}
                          onChange={() => handleToggleStatus(user.id, user.status)}
                          disabled={toggleStatusMutation.isLoading}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className={`status-text status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Never'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEditUser(user)}
                          title="Edit user"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteClick(user)}
                          title="Delete user"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </button>
                <div className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} users)
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Add New User' : 'Edit User'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={{
                name: selectedUser?.name || '',
                email: selectedUser?.email || '',
                role: selectedUser?.role || 'Developer',
                status: selectedUser?.status || 'active',
              }}
              validationSchema={userSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="user-form">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                      placeholder="Enter full name"
                    />
                    {errors.name && touched.name && (
                      <span className="form-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                      placeholder="Enter email address"
                    />
                    {errors.email && touched.email && (
                      <span className="form-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="role">Role *</label>
                    <Field
                      as="select"
                      id="role"
                      name="role"
                      className={`form-select ${errors.role && touched.role ? 'error' : ''}`}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </Field>
                    {errors.role && touched.role && (
                      <span className="form-error">{errors.role}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status *</label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className={`form-select ${errors.status && touched.status ? 'error' : ''}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </Field>
                    {errors.status && touched.status && (
                      <span className="form-error">{errors.status}</span>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                      ) : (
                        <>{modalMode === 'create' ? 'Create User' : 'Update User'}</>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="delete-warning">
                <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteUserMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleteUserMutation.isLoading}
              >
                {deleteUserMutation.isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
