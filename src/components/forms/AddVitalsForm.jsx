import React, { useState } from 'react'
import Button from '@/components/common/Button'
import { NORMAL_RANGES } from '@/utils/constants'
import { isAbnormal } from '@/utils/riskColor'
import { validate, required, numeric, inRange } from '@/utils/validators'

const VITAL_FIELDS = [
  { name:'heart_rate',       label:'Heart Rate',       unit:'bpm',   type:'number', rangeKey:'heartRate',       step:'1',   min:20,   max:250  },
  { name:'systolic_bp',      label:'Systolic BP',      unit:'mmHg',  type:'number', rangeKey:'systolicBP',      step:'1',   min:50,   max:250  },
  { name:'diastolic_bp',     label:'Diastolic BP',     unit:'mmHg',  type:'number', rangeKey:'diastolicBP',     step:'1',   min:20,   max:150  },
  { name:'temperature',      label:'Temperature',      unit:'°C',    type:'number', rangeKey:'temperature',     step:'0.1', min:30,   max:45   },
  { name:'respiratory_rate', label:'Respiratory Rate', unit:'/min',  type:'number', rangeKey:'respiratoryRate', step:'1',   min:4,    max:60   },
  { name:'spo2',             label:'SpO₂',             unit:'%',     type:'number', rangeKey:'spo2',            step:'1',   min:50,   max:100  },
]

const LAB_FIELDS = [
  { name:'wbc',        label:'WBC',        unit:'×10³/µL', rangeKey:'wbc',        step:'0.1', min:0, max:100 },
  { name:'lactate',    label:'Lactate',    unit:'mmol/L',  rangeKey:'lactate',    step:'0.1', min:0, max:30  },
  { name:'creatinine', label:'Creatinine', unit:'mg/dL',   rangeKey:'creatinine', step:'0.1', min:0, max:30  },
]

function FieldInput({ field, value, error, onChange }) {
  const num = parseFloat(value)
  const abnormal = !isNaN(num) && isAbnormal(field.rangeKey, num)
  const range = NORMAL_RANGES[field.rangeKey] || {}

  return (
    <div>
      <label style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.06em' }}>
        <span>{field.label.toUpperCase()}</span>
        <span style={{ color:'var(--text-muted)', fontWeight:400 }}>{field.unit}</span>
      </label>
      <div style={{ position:'relative' }}>
        <input
          type="number" step={field.step} min={field.min} max={field.max}
          value={value || ''} onChange={e => onChange(field.name, e.target.value)}
          style={{ borderColor: error ? 'var(--red)' : abnormal ? 'var(--amber-border)' : undefined }}
        />
        {abnormal && !error && (
          <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:11, color:'var(--amber)' }}>⚠</span>
        )}
      </div>
      {error && <div style={{ fontSize:11, color:'var(--red)', marginTop:3 }}>{error}</div>}
      {!error && range.min && (
        <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:3 }}>
          Normal: {range.min}–{range.max} {field.unit}
          {abnormal && <span style={{ color:'var(--amber)', marginLeft:6 }}>⚠ Out of range</span>}
        </div>
      )}
    </div>
  )
}

export default function AddVitalsForm({ onSubmit, loading = false }) {
  const [form,   setForm]   = useState({})
  const [errors, setErrors] = useState({})

  const handleChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    VITAL_FIELDS.forEach(f => {
      if (!form[f.name]) return
      const err = validate(form[f.name], [numeric, inRange(f.min, f.max)])
      if (err) newErrors[f.name] = err
    })
    // At least heart rate required
    if (!form.heart_rate) newErrors.heart_rate = 'Heart rate is required'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    onSubmit({ vitals: form, recorded_at: new Date().toISOString() })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:14 }}>VITAL SIGNS</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {VITAL_FIELDS.map(f => (
            <FieldInput key={f.name} field={f} value={form[f.name]} error={errors[f.name]} onChange={handleChange} />
          ))}
        </div>
      </div>

      <div style={{ borderTop:'1px solid var(--border)', paddingTop:20, marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:14 }}>LAB VALUES <span style={{ fontWeight:400 }}>(optional)</span></div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {LAB_FIELDS.map(f => (
            <FieldInput key={f.name} field={f} value={form[f.name]} error={errors[f.name]} onChange={handleChange} />
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
        <Button type="submit" variant="primary" loading={loading}>Submit Vitals</Button>
      </div>
    </form>
  )
}
