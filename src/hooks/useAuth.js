import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/rbac'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')

  return {
    ...ctx,
    can:    (permission)    => hasPermission(ctx.role, permission),
    canAny: (permissions)   => hasAnyPermission(ctx.role, permissions),
    canAll: (permissions)   => hasAllPermissions(ctx.role, permissions),
  }
}
