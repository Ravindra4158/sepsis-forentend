import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAlerts } from '@/hooks/useAlerts'
import { usePermission } from '@/hooks/usePermission'
import { PERMISSIONS, ROLE_META } from '@/utils/rbac'
import { RoleBadge } from '@/components/common/StatusBadge'
import patientService from '@/services/patientService'

export default function Navbar() {
  const { user, logout }    = useAuth()
  const { unreadCount }     = useAlerts()
  const { can }             = usePermission()
  const navigate            = useNavigate()
  const [time, setTime]     = useState('')
  const [query, setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US',{hour12:false}))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const handleSearch = (e) => {
    const q = e.target.value
    setQuery(q)
    clearTimeout(debounceRef.current)
    if (q.length < 2) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await patientService.search(q)
        setResults(Array.isArray(data) ? data.slice(0,6) : data.patients?.slice(0,6) || [])
      } catch { setResults([]) }
      finally { setSearching(false) }
    }, 350)
  }

  const meta = ROLE_META[user?.role] || {}

  return (
    <header style={{
      height:'var(--navbar-height)', background:'rgba(255,255,255,0.54)',
      borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center',
      padding:'0 28px', gap:18, flexShrink:0,
      position:'sticky', top:0, zIndex:'var(--z-navbar)',
      backdropFilter:'blur(16px)',
    }}>
      {/* Search — only for roles that can view patients */}
      {can(PERMISSIONS.VIEW_PATIENTS) && (
        <div ref={searchRef} style={{ position:'relative', flex:1, maxWidth:340 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
            style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={query} onChange={handleSearch}
            placeholder="Search patient name or MRN"
            style={{ paddingLeft:34, height:42, background:'rgba(255,255,255,0.8)', border:'1px solid var(--border)', borderRadius:'var(--radius-full)' }}
            onFocus={e=>e.target.style.borderColor='var(--border-focus)'}
            onBlur={e=>{ e.target.style.borderColor='var(--border)'; setTimeout(()=>{ setResults([]); setQuery('') },180) }}
          />
          {(results.length > 0 || searching) && (
            <div style={{
              position:'absolute', top:42, left:0, right:0, zIndex:300,
              background:'var(--bg-card)', border:'1px solid var(--border-strong)',
              borderRadius:'var(--radius-md)', overflow:'hidden', boxShadow:'var(--shadow-md)',
            }}>
              {searching && <div style={{ padding:'10px 14px', fontSize:12, color:'var(--text-muted)' }}>Searching…</div>}
              {results.map(p => (
                <button key={p.id} onMouseDown={()=>{ navigate(`/patients/${p.id}`); setQuery(''); setResults([]) }}
                  style={{
                    width:'100%', padding:'10px 14px', display:'flex', alignItems:'center', gap:10,
                    borderBottom:'1px solid var(--border)', cursor:'pointer', fontFamily:'var(--font-display)',
                    transition:'background 0.1s',
                  }}
                  onMouseOver={e=>e.currentTarget.style.background='var(--bg-card-hover)'}
                  onMouseOut={e=>e.currentTarget.style.background='transparent'}
                >
                  <div style={{ flex:1, textAlign:'left' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.full_name}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:1 }}>{p.mrn || p.id} · {p.ward}</div>
                  </div>
                  {can(PERMISSIONS.VIEW_RISK_SCORE) && p.risk_level && (
                    <span style={{ fontSize:10, fontWeight:700, color: p.risk_level==='CRITICAL'?'var(--red)':p.risk_level==='HIGH'?'var(--orange)':'var(--amber)' }}>
                      {p.risk_level}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ flex:1 }} />

      {/* Unread alerts badge */}
      {can(PERMISSIONS.VIEW_ALERTS) && unreadCount > 0 && (
        <button onClick={()=>navigate('/alerts')} className="pulse-red" style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'5px 14px', borderRadius:'var(--radius-full)',
          background:'var(--red-bg)', border:'1px solid var(--red-border)',
          cursor:'pointer', fontFamily:'var(--font-display)',
        }}>
          <span className="blink" style={{ width:7, height:7, borderRadius:'50%', background:'var(--red)', display:'inline-block' }} />
          <span style={{ fontSize:12, fontWeight:700, color:'var(--red)' }}>
            {unreadCount} Active Alert{unreadCount>1?'s':''}
          </span>
        </button>
      )}

      {/* System online */}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px rgba(31,111,104,0.35)' }} />
        <span style={{ fontSize:11, color:'var(--text-muted)' }}>Inference Ready</span>
      </div>

      {/* Clock */}
      <div style={{
        fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-muted)',
        padding:'6px 12px', background:'rgba(255,255,255,0.76)',
        border:'1px solid var(--border)', borderRadius:'var(--radius-full)', letterSpacing:'0.05em',
      }}>{time}</div>

      {/* User chip */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', textAlign:'right' }}>
            {user?.name || user?.email}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:2 }}>
            <RoleBadge role={user?.role} />
          </div>
        </div>
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:`${meta.color}18`, border:`2px solid ${meta.color}55`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:15, color:meta.color, fontWeight:700,
        }}>{meta.icon || (user?.name?.[0] || '?')}</div>
      </div>
    </header>
  )
}
