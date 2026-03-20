import React, { useState, useCallback, useEffect, useRef } from 'react'
import alertService from '@/services/alertService'
import { useAuth } from '@/hooks/useAuth'
import { ROLES } from '@/utils/rbac'
import config from '@/config/config'
import { AlertContext } from './alertContextStore'

export function AlertProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [alerts,      setAlerts]      = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading,     setLoading]     = useState(false)
  const [eventTick,   setEventTick]   = useState(0)
  const wsRef = useRef(null)

  const canReceiveAlerts = isAuthenticated

  const fetchAlerts = useCallback(async () => {
    if (!canReceiveAlerts) return
    setLoading(true)
    try {
      const data = await alertService.getAll({ status: 'active', limit: 50 })
      setAlerts(data.items || data)
      setUnreadCount((data.items || data).filter(a => !a.acknowledged_at).length)
    } catch { /* handled in service */ }
    finally { setLoading(false) }
  }, [canReceiveAlerts])

  // Connect to WebSocket for real-time alerts
  useEffect(() => {
    if (!canReceiveAlerts) return
    fetchAlerts()

    const token = localStorage.getItem('auth_token')
    if (!token) return

    const ws = new WebSocket(`${config.wsUrl}/alerts?token=${token}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'new_alert') {
          setAlerts(prev => [msg.alert, ...prev])
          setUnreadCount(c => c + 1)
          setEventTick(t => t + 1)
        }
        if (msg.type === 'alert_updated') {
          setAlerts(prev => prev.map(a => a.id === msg.alert.id ? msg.alert : a).filter(a => a.status !== 'resolved'))
          setUnreadCount(prev => Math.max(0, msg.alert?.acknowledged_at || msg.alert?.status === 'resolved' ? prev - 1 : prev))
          setEventTick(t => t + 1)
        }
        if (msg.type === 'patient_updated') {
          setEventTick(t => t + 1)
        }
      } catch { }
    }

    ws.onerror = () => { /* reconnect logic could go here */ }

    return () => { ws.close() }
  }, [canReceiveAlerts, fetchAlerts])

  const acknowledgeAlert = useCallback(async (id) => {
    await alertService.acknowledge(id)
    await fetchAlerts()
    setEventTick(t => t + 1)
  }, [fetchAlerts])

  const resolveAlert = useCallback(async (id, note) => {
    await alertService.resolve(id, note)
    await fetchAlerts()
    setEventTick(t => t + 1)
  }, [fetchAlerts])

  return (
    <AlertContext.Provider value={{
      alerts, unreadCount, loading, criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL'),
      fetchAlerts, acknowledgeAlert, resolveAlert, eventTick,
    }}>
      {children}
    </AlertContext.Provider>
  )
}
