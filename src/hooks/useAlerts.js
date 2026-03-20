import { useContext } from 'react'
import { AlertContext } from '@/context/alertContextStore'

export function useAlerts() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlerts must be used inside AlertProvider')
  return ctx
}
