import { useState, useEffect, useCallback, useRef } from 'react'
import vitalsService from '@/services/vitalsService'
import labService from '@/services/labService'
import config from '@/config/config'

export function useVitals(patientId, { poll = true } = {}) {
  const [vitals,   setVitals]   = useState(null)
  const [history,  setHistory]  = useState([])
  const [labs,     setLabs]     = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const intervalRef = useRef(null)

  const fetchLatest = useCallback(async () => {
    if (!patientId) return
    try {
      const data = await vitalsService.getLatest(patientId)
      setVitals(data)
    } catch (err) {
      if (!String(err.message || '').includes('No vitals found')) {
        setError(err.message)
      }
    }
  }, [patientId])

  const fetchHistory = useCallback(async (params = {}) => {
    if (!patientId) return
    try {
      const data = await vitalsService.getHistory(patientId, { limit: 48, ...params })
      setHistory(data.items || data)
    } catch (err) {
      setError(err.message)
    }
  }, [patientId])

  const fetchLabs = useCallback(async () => {
    if (!patientId) return
    try {
      const data = await labService.getByPatient(patientId)
      const items = data.items || data
      setLabs(Array.isArray(items) ? (items[0] || null) : items)
    } catch (err) {
      setLabs(null)
    }
  }, [patientId])

  useEffect(() => {
    if (!patientId) return
    setLoading(true)
    Promise.all([fetchLatest(), fetchHistory(), fetchLabs()])
      .finally(() => setLoading(false))

    if (poll) {
      intervalRef.current = setInterval(fetchLatest, config.vitalsPollingInterval)
    }
    return () => clearInterval(intervalRef.current)
  }, [patientId, fetchLatest, fetchHistory, fetchLabs, poll])

  return { vitals, history, labs, loading, error, refetch: fetchLatest }
}
