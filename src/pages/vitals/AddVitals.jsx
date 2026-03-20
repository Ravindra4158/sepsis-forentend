import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import patientService from '@/services/patientService'
import AddVitalsForm  from '@/components/forms/AddVitalsForm'
import StatusBadge    from '@/components/common/StatusBadge'
import Button         from '@/components/common/Button'
import Loader         from '@/components/common/Loader'
import { getRiskColor } from '@/utils/riskColor'

export default function AddVitals() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientService.getById(patientId)
      .then(setPatient)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [patientId])

  if (loading) return <Loader text="Loading patient…" />

  const name  = patient ? (patient.name || `${patient.first_name} ${patient.last_name}`) : '—'
  const risk  = patient?.risk_level || patient?.riskLevel || 'LOW'
  const color = getRiskColor(risk)

  return (
    <div className="anim-fade" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← Back</Button>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 2 }}>Record Vitals</h1>
          {patient && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>for</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
              <StatusBadge status={risk} size="xs" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                {patient.ward} {patient.bed}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: `1px solid ${color}25`, borderRadius: 'var(--radius-lg)', padding: '28px 32px' }}>
        <AddVitalsForm
          patientId={patientId}
          onSuccess={() => navigate(`/patients/${patientId}`)}
        />
      </div>
    </div>
  )
}
