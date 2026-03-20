import React, { useState } from 'react'
import Button from '@/components/common/Button'
import { ROLES } from '@/utils/rbac'
import { validate, required, email, minLength, passwordStrength } from '@/utils/validators'

const ROLE_OPTIONS = [
  { value: ROLES.DOCTOR, label: '🩺 Doctor' },
  { value: ROLES.NURSE,  label: '💉 Nurse'  },
  { value: ROLES.ADMIN,  label: '⚙ Admin'  },
]

export default function UserForm({ onSubmit, loading = false, initialData = {}, isEdit = false }) {
  const [form,   setForm]   = useState({ name:'', email:'', role:'', ward:'', phone:'', password:'', ...initialData })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    const nameErr = validate(form.name,       [required, minLength(2)])
    const emailErr= validate(form.email,      [required, email])
    const roleErr = validate(form.role,       [required])
    const passErr = !isEdit ? validate(form.password, [required, passwordStrength]) : null
    if (nameErr) newErrors.name = nameErr
    if (emailErr) newErrors.email = emailErr
    if (roleErr) newErrors.role = roleErr
    if (passErr) newErrors.password = passErr
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    if (onSubmit) onSubmit(form)
  }

  const fields = [
    { name:'name',       label:'Full Name',   type:'text',     span:1 },
    { name:'email',      label:'Email',       type:'email',    span:1, disabled:isEdit },
    { name:'role',       label:'Role',        type:'select',   span:1, options:ROLE_OPTIONS, disabled:isEdit },
    { name:'ward',       label:'Ward',        type:'text',     span:1 },
    { name:'phone',      label:'Phone',       type:'text',     span:1 },
    ...(!isEdit ? [{ name:'password', label:'Password', type:'password', span:2 }] : []),
  ]

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {fields.map(f => (
          <div key={f.name} style={{ gridColumn:`span ${f.span}` }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.06em' }}>{f.label.toUpperCase()} *</label>
            {f.type === 'select'
              ? <select name={f.name} value={form[f.name]} onChange={handleChange} disabled={f.disabled} style={{ borderColor: errors[f.name] ? 'var(--red)' : undefined, opacity: f.disabled ? 0.75 : 1 }}>
                  <option value="">Select…</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              : <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange} disabled={f.disabled} style={{ borderColor: errors[f.name] ? 'var(--red)' : undefined, opacity: f.disabled ? 0.75 : 1 }} />
            }
            {errors[f.name] && <div style={{ fontSize:11, color:'var(--red)', marginTop:4 }}>{errors[f.name]}</div>}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}
