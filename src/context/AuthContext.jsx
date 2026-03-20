import React, { createContext, useState, useEffect, useCallback } from 'react'
import authService from '@/services/authService'
import { getRoleHome } from '@/utils/rbac'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const token  = localStorage.getItem('auth_token')
    const stored = localStorage.getItem('auth_user')
    if (token && stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('auth_user') }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    setError(null)
    try {
      const data = await authService.login(credentials)
      localStorage.setItem('auth_token', data.access_token)
      localStorage.setItem('auth_user',  JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch { }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(updated)
    localStorage.setItem('auth_user', JSON.stringify(updated))
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading, error, login, logout, updateUser,
      isAuthenticated: !!user,
      role: user?.role || null,
      homeRoute: user ? getRoleHome(user.role) : '/login',
    }}>
      {children}
    </AuthContext.Provider>
  )
}
