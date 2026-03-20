import React, { createContext, useState, useCallback } from 'react'
import patientService from '@/services/patientService'
import vitalsService from '@/services/vitalsService'
import { formatAge } from '@/utils/formatDate'
import config from '@/config/config'

export const PatientContext = createContext(null)

function normalizePatient(patient) {
  const fullName = patient.full_name || [patient.first_name, patient.last_name].filter(Boolean).join(' ').trim()
  return {
    ...patient,
    full_name: fullName,
    name: patient.name || fullName,
    patient_id: patient.patient_id || patient.mrn,
    medical_record_number: patient.medical_record_number || patient.mrn,
    bed: patient.bed || (patient.bed_number != null ? `Bed ${patient.bed_number}` : ''),
    age: patient.age ?? (patient.date_of_birth ? formatAge(patient.date_of_birth) : null),
    latest_vitals: patient.latest_vitals || null,
    risk_flags: patient.risk_flags || [],
  }
}

async function hydratePatientsWithVitals(items) {
  const patients = items.map(normalizePatient)
  const vitalsResults = await Promise.allSettled(
    patients.map((patient) => vitalsService.getLatest(patient.id))
  )

  return patients.map((patient, index) => {
    const result = vitalsResults[index]
    if (result.status === 'fulfilled') {
      return { ...patient, latest_vitals: result.value }
    }
    return patient
  })
}

export function PatientProvider({ children }) {
  const [patients,    setPatients]    = useState([])
  const [pagination,  setPagination]  = useState({ page: 1, total: 0, pages: 0 })
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPatients = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await patientService.getAll(params)
      const items = data.patients || data.items || (Array.isArray(data) ? data : [])
      setPatients(await hydratePatientsWithVitals(items))
      setPagination({
        page: params.page || 1,
        total: data.total || 0,
        pages: data.limit ? Math.ceil((data.total || 0) / data.limit) : 0
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchPatients = useCallback(async (q) => {
    setSearchQuery(q)
    if (!q.trim()) { fetchPatients(); return }
    setLoading(true)
    try {
      const data = await patientService.search(q)
      const items = data.items || data
      setPatients(await hydratePatientsWithVitals(items))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchPatients])

  const invalidate = useCallback(() => fetchPatients(), [fetchPatients])

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    const ws = new WebSocket(`${config.wsUrl}/alerts?token=${token}`)
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type !== 'patient_updated' || !message.patient) return
        const normalized = normalizePatient({
          ...message.patient,
          latest_vitals: message.latest_vitals || null,
        })
        setPatients((prev) => {
          const exists = prev.some((patient) => patient.id === normalized.id)
          if (!exists) return prev
          return prev.map((patient) => patient.id === normalized.id ? { ...patient, ...normalized } : patient)
        })
      } catch {
        // no-op for malformed socket payloads
      }
    }

    return () => ws.close()
  }, [])

  return (
    <PatientContext.Provider value={{
      patients, pagination, total: pagination.total, loading, error, searchQuery,
      fetchPatients, searchPatients, invalidate,
      setPatients,
    }}>
      {children}
    </PatientContext.Provider>
  )
}
