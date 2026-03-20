import { useAuth } from './useAuth'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/rbac'

export function usePermission() {
  const { user } = useAuth()
  const role = user?.role

  return {
    can:    (permission)  => hasPermission(role, permission),
    canAny: (permissions) => hasAnyPermission(role, permissions),
    canAll: (permissions) => hasAllPermissions(role, permissions),
    role,
  }
}
