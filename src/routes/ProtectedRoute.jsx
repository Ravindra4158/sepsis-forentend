import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { hasPermission, hasAnyPermission } from '@/utils/rbac'
import Loader from '@/components/common/Loader'

/**
 * ProtectedRoute — wraps any route that requires:
 *   1. Authentication
 *   2. Optionally: specific role(s)
 *   3. Optionally: specific permission(s)  (any match)
 *
 * Usage:
 *   <ProtectedRoute>                          // auth only
 *   <ProtectedRoute roles={['doctor']}>       // role-gated
 *   <ProtectedRoute permission="manage_users">// permission-gated
 */
export default function ProtectedRoute({
  children,
  roles      = [],      // allowed roles; empty = all authenticated
  permission = null,    // single permission required
  permissions = [],     // any-of permission check
}) {
  const { isAuthenticated, loading, role, homeRoute } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullscreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role check
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to={homeRoute} replace />
  }

  // Single permission check
  if (permission && !hasPermission(role, permission)) {
    return <Navigate to={homeRoute} replace />
  }

  // Any-of permissions check
  if (permissions.length > 0 && !hasAnyPermission(role, permissions)) {
    return <Navigate to={homeRoute} replace />
  }

  return children
}
