import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '@/services/authService'
import Button from '@/components/common/Button'
import { validate, required, email } from '@/utils/validators'

export default function ForgotPassword() {
  const [emailVal, setEmailVal] = useState('')
  const [error,    setError]    = useState(null)
  const [sent,     setSent]     = useState(false)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate(emailVal, [required, email])
    if (err) { setError(err); return }
    setLoading(true)
    try {
      await authService.forgotPassword(emailVal)
      setSent(true)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div className="anim-fade clinical-surface" style={{ width:'100%', maxWidth:460, padding:'34px 36px', boxShadow:'var(--shadow-lg)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:'16px', background:'linear-gradient(135deg,#dceee8,#9ed0c4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, margin:'0 auto 12px', color:'#183238' }}>S</div>
          <h1 style={{ fontSize:'1.3rem' }}>Reset Password</h1>
        </div>
        {sent ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-bg)', border:'1px solid var(--green-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, color:'var(--green)', margin:'0 auto 14px' }}>i</div>
            <h3 style={{ marginBottom:8 }}>Reset link sent</h3>
            <p style={{ fontSize:13, color:'var(--text-secondary)' }}>Check your inbox for reset instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <p style={{ fontSize:13, color:'var(--text-secondary)' }}>Enter your email and we&apos;ll send a reset link.</p>
            {error && <div style={{ padding:'9px 12px', background:'var(--red-bg)', border:'1px solid var(--red-border)', borderRadius:'var(--radius-sm)', fontSize:12, color:'var(--red)' }}>{error}</div>}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:'var(--text-secondary)', marginBottom:6, letterSpacing:'0.06em' }}>EMAIL ADDRESS</label>
              <input type="email" value={emailVal} onChange={e => { setEmailVal(e.target.value); setError(null) }} />
            </div>
            <Button type="submit" variant="primary" fullWidth loading={loading}>Send Reset Link</Button>
          </form>
        )}
        <div style={{ marginTop:16, textAlign:'center' }}>
          <Link to="/login" style={{ fontSize:12, color:'var(--text-muted)' }}>Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}
