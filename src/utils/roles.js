/**
 * User Roles and Constants
 */

export const ROLES = {
  ADMIN: 'Admin',
  DEVELOPER: 'Developer',
  ANALYST: 'Analyst',
  AUDITOR: 'Auditor',
};

export const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Analyst', label: 'Analyst' },
  { value: 'Auditor', label: 'Auditor' },
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const ROLE_PERMISSIONS = {
  Admin: ['users.view', 'users.create', 'users.edit', 'users.delete', 'all'],
  Developer: ['sbom.view', 'sbom.create', 'sbom.edit'],
  Analyst: ['sbom.view', 'reports.view'],
  Auditor: ['sbom.view', 'audit.view', 'audit.create'],
};
