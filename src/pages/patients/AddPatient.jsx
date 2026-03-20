import React from 'react'
import { useNavigate } from 'react-router-dom'
import AddPatientForm from '@/components/patient/AddPatientForm'
import Button from '@/components/common/Button'
import patientService from '@/services/patientService'
import { notify } from '@/components/common/NotificationToast'

export default function AddPatient() {
  const navigate = useNavigate()
  const [creating, setCreating] = React.useState(false)

  const handleCreate = async (form) => {
    const [firstName = '', ...rest] = String(form.full_name || '').trim().split(/\s+/)
    const lastName = rest.join(' ') || 'Patient'

    setCreating(true)
    try {
      const result = await patientService.create({
        mrn: form.patient_id,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        ward: form.ward,
        bed_number: Number(form.bed),
        primary_diagnosis: form.primary_diagnosis || null,
        comorbidities: form.allergies
          ? form.allergies.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
        physician_name: null,
      })
      const patient = result.patient || result
      notify.success('Patient created successfully')
      navigate(`/patients/${patient.id}`, { replace: true })
    } catch (err) {
      notify.error(err.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="anim-fade" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← Back</Button>
        <div>
          <h1 style={{ fontSize: 22, marginBottom: 2 }}>Add New Patient</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Register a new patient for ICU monitoring</p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 32px' }}>
        <AddPatientForm onSubmit={handleCreate} loading={creating} />
      </div>
    </div>
  )
}
