/**
 * Lightweight global UI store using React Context + useState.
 * Keeps sidebar state, active ward filter, and global notification queue.
 */
import React, { createContext, useContext, useState, useCallback } from 'react'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [wardFilter,    setWardFilter]    = useState('ALL')
  const [riskFilter,    setRiskFilter]    = useState('ALL')
  const [notifications, setNotifications] = useState([])

  const pushNotification = useCallback((notif) => {
    const id = Date.now()
    setNotifications(prev => [{ id, ...notif }, ...prev].slice(0, 5))
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000)
  }, [])

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <StoreContext.Provider value={{
      sidebarOpen, setSidebarOpen,
      wardFilter,  setWardFilter,
      riskFilter,  setRiskFilter,
      notifications, pushNotification, dismissNotification,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
