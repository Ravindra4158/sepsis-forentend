import React, { useState } from 'react'
import Button from '@/components/common/Button'
import { validate, required, email, minLength } from '@/utils/validators'

export default function LoginForm({ onSubmit, loading = false, error = null, demoAccounts = [] }) {
  const [form,   setForm]   = useState({ email:'', password:'' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    const emailErr = validate(form.email, [required, email])
    const passErr  = validate(form.password, [required, minLength(6)])
    if (emailErr) newErrors.email = emailErr
    if (passErr)  newErrors.password = passErr
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    onSubmit(form)
  }

  const applyDemoAccount = (account) => {
    setForm({ email: account.email, password: account.password })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {error && (
        <div style={{ padding:'10px 14px', background:'var(--red-bg)', border:'1px solid var(--red-border)', borderRadius:'var(--radius-sm)', fontSize:13, color:'var(--red)' }}>
          {error}
        </div>
      )}
      <div>
        <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.06em' }}>EMAIL ADDRESS</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@hospital.com" style={{ borderColor: errors.email ? 'var(--red)' : undefined }} />
        {errors.email && <div style={{ fontSize:11, color:'var(--red)', marginTop:4 }}>{errors.email}</div>}
      </div>
      <div>
        <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.06em' }}>PASSWORD</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ borderColor: errors.password ? 'var(--red)' : undefined }} />
        {errors.password && <div style={{ fontSize:11, color:'var(--red)', marginTop:4 }}>{errors.password}</div>}
      </div>
      {demoAccounts.length > 0 && (
        <div style={{ display:'grid', gap:10 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)', letterSpacing:'0.06em' }}>DEMO LOGINS</div>
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => applyDemoAccount(account)}
              style={{
                textAlign:'left',
                padding:'12px 14px',
                borderRadius:'var(--radius-md)',
                background:'rgba(255,255,255,0.58)',
                border:'1px solid var(--border)',
                cursor:'pointer',
                transition:'var(--transition-fast)',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor='var(--border-strong)'}
              onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)' }}>{account.label}</span>
                <span style={{ fontSize:10, color:account.color, fontWeight:700 }}>{account.role}</span>
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{account.email}</div>
              <div style={{ fontSize:11, color:'var(--text-secondary)', fontFamily:'var(--font-mono)', marginTop:2 }}>{account.password}</div>
            </button>
          ))}
        </div>
      )}
      <Button type="submit" variant="primary" fullWidth loading={loading} size="lg" style={{ marginTop:4 }}>Sign In</Button>
    </form>
  )
}
