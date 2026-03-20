import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import LoginForm from '@/components/forms/LoginForm'
import { ROLE_META } from '@/utils/rbac'

const DEMO_ACCOUNTS = [
  {
    label: 'Doctor Demo',
    role: 'Doctor',
    email: 'doctor@sepsis.ai',
    password: 'Doctor@123',
    color: ROLE_META.doctor?.color || 'var(--cyan)',
  },
  {
    label: 'Nurse Demo',
    role: 'Nurse',
    email: 'nurse@sepsis.ai',
    password: 'Nurse@123',
    color: ROLE_META.nurse?.color || 'var(--green)',
  },
  {
    label: 'Admin Demo',
    role: 'Admin',
    email: 'admin@sepsis.ai',
    password: 'Admin@123',
    color: ROLE_META.admin?.color || 'var(--amber)',
  },
]

export default function Login() {
  const { login, isAuthenticated, homeRoute, loading, error } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || homeRoute

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated])

  const handleSubmit = async (credentials) => {
    try {
      const user = await login(credentials)
      navigate(from, { replace: true })
    } catch { /* error shown via context */ }
  }

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:24, position:'relative', overflow:'hidden',
    }}>
      {/* Background decoration */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        <div style={{ position:'absolute', top:-80, right:-120, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(31,111,104,0.18) 0%,transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-100, left:-140, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(45,111,138,0.16) 0%,transparent 70%)' }} />
      </div>

      <div className="anim-fade" style={{ width:'100%', maxWidth:1040, position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1.15fr 0.85fr', gap:28 }}>
        <div className="clinical-surface" style={{ padding:'48px 44px', background:'linear-gradient(180deg, rgba(24,50,56,0.94), rgba(24,50,56,0.86))', color:'var(--text-inverse)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at top right, rgba(159,213,204,0.18), transparent 36%)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ width:64, height:64, borderRadius:'20px', background:'linear-gradient(135deg,#dceee8,#9ed0c4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginBottom:18, color:'#183238' }}>S</div>
            <div style={{ fontSize:12, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(247,250,248,0.68)', marginBottom:18 }}>Clinical Premium Workspace</div>
            <h1 style={{ color:'var(--text-inverse)', maxWidth:420, marginBottom:12 }}>Early sepsis surveillance designed for calm, fast clinical decisions.</h1>
            <p style={{ color:'rgba(247,250,248,0.72)', maxWidth:460, marginBottom:30 }}>
              Unified dashboards for bedside teams, role-aware workflows, and local inference support for AI-assisted risk monitoring.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[
                { label:'Active Monitoring', value:'24/7' },
                { label:'Alert Delivery', value:'Realtime' },
                { label:'Deployment', value:'Local AI' },
              ].map(item => (
                <div key={item.label} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'18px', padding:'16px 14px' }}>
                  <div style={{ fontSize:11, color:'rgba(247,250,248,0.58)', marginBottom:6 }}>{item.label}</div>
                  <div style={{ fontSize:22, fontWeight:700 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="clinical-surface" style={{ padding:'34px 36px', boxShadow:'var(--shadow-lg)', alignSelf:'center' }}>
          <div style={{ marginBottom:30 }}>
            <div style={{ fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:10 }}>Secure Sign In</div>
            <h2 style={{ fontSize:'1.5rem', marginBottom:6 }}>Access your care operations workspace</h2>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Use your hospital credentials to enter the role-based dashboard.</p>
          </div>
          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} demoAccounts={DEMO_ACCOUNTS} />
          <div style={{ marginTop:16, textAlign:'center' }}>
            <a href="/forgot-password" style={{ fontSize:12, color:'var(--text-muted)' }}>Forgot password?</a>
          </div>
          <div style={{ marginTop:24, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {Object.values(ROLE_META).map(r => (
              <div key={r.label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-muted)', padding:'6px 10px', border:'1px solid var(--border)', borderRadius:'var(--radius-full)', background:'rgba(255,255,255,0.58)' }}>
                <span>{r.icon}</span><span style={{ color:r.color }}>{r.label}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign:'center', fontSize:10, color:'var(--text-muted)', marginTop:18 }}>
            Clinical decision support only. Confirm treatment decisions at bedside.
          </p>
        </div>
      </div>
    </div>
  )
}
