import React, { useState } from 'react'
import Button from '@/components/common/Button'
import { WARDS, GENDER_OPTIONS } from '@/utils/constants'
import { validate, required, minLength, numeric, inRange } from '@/utils/validators'

const FIELDS = [
  { name:'full_name',          label:'Full Name',      type:'text',   span:2, validators:[required, minLength(2)] },
  { name:'patient_id',         label:'Patient ID / MRN', type:'text', span:1, validators:[required] },
  { name:'date_of_birth',      label:'Date of Birth',  type:'date',   span:1, validators:[required] },
  { name:'gender',             label:'Gender',         type:'select', span:1, options:GENDER_OPTIONS, validators:[required] },
  { name:'ward',               label:'Ward',           type:'select', span:1, options:WARDS.map(w=>({value:w,label:w})), validators:[required] },
  { name:'bed',                label:'Bed Number',     type:'text',   span:1, validators:[required] },
  { name:'primary_diagnosis',  label:'Primary Diagnosis', type:'text', span:2, validators:[required] },
  { name:'blood_type',         label:'Blood Type',     type:'select', span:1, options:['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(v=>({value:v,label:v})) },
  { name:'allergies',          label:'Allergies',      type:'text',   span:1 },
  { name:'emergency_contact',  label:'Emergency Contact Name', type:'text', span:1 },
  { name:'emergency_phone',    label:'Emergency Phone', type:'text',  span:1 },
  { name:'notes',              label:'Notes',          type:'textarea', span:2 },
]

export default function AddPatientForm({ onSubmit, loading = false, initialData = {} }) {
  const [form,   setForm]   = useState(initialData)
  const [errors, setErrors] = useState({})

  const handleChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    FIELDS.forEach(f => {
      if (f.validators) {
        const err = validate(form[f.name], f.validators)
        if (err) newErrors[f.name] = err
      }
    })
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {FIELDS.map(field => (
          <div key={field.name} style={{ gridColumn:`span ${field.span || 1}` }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.06em' }}>
              {field.label.toUpperCase()}{field.validators?.includes(required) ? ' *' : ''}
            </label>
            {field.type === 'select' ? (
              <select value={form[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)}>
                <option value="">Select…</option>
                {field.options?.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea rows={3} value={form[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} style={{ resize:'vertical' }} />
            ) : (
              <input type={field.type} value={form[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} />
            )}
            {errors[field.name] && (
              <div style={{ fontSize:11, color:'var(--red)', marginTop:4 }}>{errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24, paddingTop:16, borderTop:'1px solid var(--border)' }}>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData.id ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  )
}
