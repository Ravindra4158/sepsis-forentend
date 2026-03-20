/**
 * RBAC — Role-Based Access Control
 *
 * Roles:  doctor | nurse | admin
 *
 * Permission Matrix:
 * ┌─────────────────────────┬────────┬───────┬───────┐
 * │ Feature                 │ Doctor │ Nurse │ Admin │
 * ├─────────────────────────┼────────┼───────┼───────┤
 * │ view_patients           │  ✅    │  ✅   │  ✅   │
 * │ view_risk_score         │  ✅    │  ✅   │  ❌   │
 * │ view_vitals             │  ✅    │  ✅   │  ❌   │
 * │ view_alerts             │  ✅    │  ✅   │  ❌   │
 * │ acknowledge_alert       │  ✅    │  ✅   │  ❌   │
 * │ add_patient             │  ✅    │  ❌   │  ❌   │
 * │ update_patient          │  ✅    │  ❌   │  ❌   │
 * │ delete_patient          │  ❌    │  ❌   │  ✅   │
 * │ update_vitals           │  ❌    │  ✅   │  ❌   │
 * │ manage_users            │  ❌    │  ❌   │  ✅   │
 * │ configure_system        │  ❌    │  ❌   │  ✅   │
 * │ view_analytics          │  ✅    │  ❌   │  ✅   │
 * │ export_data             │  ✅    │  ❌   │  ✅   │
 * └─────────────────────────┴────────┴───────┴───────┘
 */

export const ROLES = {
  DOCTOR: 'doctor',
  NURSE:  'nurse',
  ADMIN:  'admin',
}

export const PERMISSIONS = {
  VIEW_PATIENTS:       'view_patients',
  VIEW_RISK_SCORE:     'view_risk_score',
  VIEW_VITALS:         'view_vitals',
  VIEW_ALERTS:         'view_alerts',
  ACKNOWLEDGE_ALERT:   'acknowledge_alert',
  ADD_PATIENT:         'add_patient',
  UPDATE_PATIENT:      'update_patient',
  DELETE_PATIENT:      'delete_patient',
  UPDATE_VITALS:       'update_vitals',
  MANAGE_USERS:        'manage_users',
  CONFIGURE_SYSTEM:    'configure_system',
  VIEW_ANALYTICS:      'view_analytics',
  EXPORT_DATA:         'export_data',
}

const ROLE_PERMISSIONS = {
  [ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.VIEW_RISK_SCORE,
    PERMISSIONS.VIEW_VITALS,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.ACKNOWLEDGE_ALERT,
    PERMISSIONS.ADD_PATIENT,
    PERMISSIONS.UPDATE_PATIENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
  ],
  [ROLES.NURSE]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.VIEW_RISK_SCORE,
    PERMISSIONS.VIEW_VITALS,
    PERMISSIONS.VIEW_ALERTS,
    PERMISSIONS.ACKNOWLEDGE_ALERT,
    PERMISSIONS.UPDATE_VITALS,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.DELETE_PATIENT,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CONFIGURE_SYSTEM,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
  ],
}

/**
 * Check if a role has a specific permission.
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false
  return (ROLE_PERMISSIONS[role] || []).includes(permission)
}

/**
 * Check if a role has ALL of the listed permissions.
 */
export function hasAllPermissions(role, permissions = []) {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Check if a role has ANY of the listed permissions.
 */
export function hasAnyPermission(role, permissions = []) {
  return permissions.some((p) => hasPermission(role, p))
}

/**
 * Returns the home route for a given role.
 */
export function getRoleHome(role) {
  switch (role) {
    case ROLES.DOCTOR: return '/dashboard/doctor'
    case ROLES.NURSE:  return '/dashboard/nurse'
    case ROLES.ADMIN:  return '/admin'
    default:           return '/login'
  }
}

/**
 * Human-readable role label and theme color.
 */
export const ROLE_META = {
  [ROLES.DOCTOR]: { label: 'Doctor',    color: '#22d3ee', icon: '🩺' },
  [ROLES.NURSE]:  { label: 'Nurse',     color: '#10b981', icon: '💉' },
  [ROLES.ADMIN]:  { label: 'Admin',     color: '#a78bfa', icon: '⚙' },
}
