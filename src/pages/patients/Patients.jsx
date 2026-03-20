import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { PERMISSIONS, ROLES } from '@/utils/rbac'
import PatientCard   from '@/components/patient/PatientCard'
import PatientTable  from '@/components/patient/PatientTable'
import PatientSearch from '@/components/patient/PatientSearch'
import Button        from '@/components/common/Button'

const RISK_FILTERS = ['ALL','CRITICAL','HIGH','MODERATE','LOW']
const FILTER_COLORS = { ALL:'var(--cyan)', CRITICAL:'#ef4444', HIGH:'#f97316', MODERATE:'#f59e0b', LOW:'#10b981' }

export default function Patients() {
  const { can, role } = useAuth()
  const { patients, total, loading, fetchPatients } = usePatients()
  const navigate = useNavigate()
  const [view,   setView]   = useState('grid')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { fetchPatients() }, [])

  const filtered = filter === 'ALL'
    ? patients
    : patients.filter(p => (p.risk_level || p.riskLevel) === filter)

  const counts = RISK_FILTERS.reduce((acc, f) => {
    acc[f] = f === 'ALL' ? patients.length : patients.filter(p => (p.risk_level||p.riskLevel) === f).length
    return acc
  }, {})

  const addRoute = role === ROLES.DOCTOR ? '/patients/add' : null

  return (
    <div className="anim-fade">
      <div className="page-heading">
        <div>
          <h1 style={{ marginBottom: 4 }}>Patients</h1>
          <p>{total} monitored patients across the active system</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PatientSearch style={{ width: 260 }} />
          {can(PERMISSIONS.ADD_PATIENT) && addRoute && (
            <Button variant="primary" size="sm" onClick={() => navigate(addRoute)}>+ Add Patient</Button>
          )}
        </div>
      </div>

      <div className="clinical-surface" style={{ padding:'18px 20px', marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center', gap:18, flexWrap:'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {RISK_FILTERS.map(f => {
            const active = filter === f
            const col = FILTER_COLORS[f]
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.05em',
                background: active ? `${col === 'var(--cyan)' ? 'rgba(45,111,138,0.1)' : col+'1a'}` : 'rgba(255,255,255,0.62)',
                color: active ? col : 'var(--text-muted)',
                border: `1px solid ${active ? col+(col.startsWith('var') ? '' : '40') : 'var(--border)'}`,
                transition: 'var(--transition-fast)',
                fontFamily: 'var(--font-display)',
              }}>
                {f} <span style={{ opacity: 0.7 }}>{counts[f]}</span>
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.62)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          {[['grid','⊞'],['table','≡']].map(([v,icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '7px 14px', fontSize: 16,
              background: view === v ? 'var(--green-bg)' : 'transparent',
              color:      view === v ? 'var(--green)' : 'var(--text-muted)',
              borderRight: v === 'grid' ? '1px solid var(--border)' : 'none',
              transition: 'var(--transition-fast)', cursor: 'pointer',
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
          {[...filtered].sort((a,b) => (b.risk_score||b.riskScore||0) - (a.risk_score||a.riskScore||0))
            .map(p => <PatientCard key={p.id} patient={p} />)}
        </div>
      ) : (
        <PatientTable patients={filtered} loading={loading} />
      )}

      {!loading && filtered.length === 0 && (
        <div className="clinical-surface" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 30, marginBottom: 12, color:'var(--green)' }}>No active matches</div>
          <div style={{ fontSize: 14 }}>No patients found for this filter</div>
        </div>
      )}
    </div>
  )
}
