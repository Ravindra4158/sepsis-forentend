import React from 'react'
import { RiskBadge } from '@/components/common/StatusBadge'
import { useNavigate } from 'react-router-dom'

export default function ICUStatus({ patients = [], wardStats = null, loading = false }) {
  const navigate = useNavigate()
  const wards = wardStats
    ? Object.keys(wardStats).sort()
    : [...new Set(patients.map(p => p.ward).filter(Boolean))].sort()

  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
        <h3 style={{ fontSize:13, fontWeight:700 }}>ICU Ward Status</h3>
      </div>
      {wards.length === 0 && (
        <div style={{ padding:'22px 18px', color:'var(--text-muted)', fontSize:12 }}>
          No ward data available.
        </div>
      )}
      {wards.map(ward => {
        if (wardStats) {
          const patientCount = wardStats[ward] || 0
          return (
            <div key={ward} style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.08em', marginBottom:4 }}>{ward}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)' }}>
                    {patientCount} patient{patientCount === 1 ? '' : 's'} currently assigned
                  </div>
                </div>
                <button
                  onClick={() => navigate('/patients')}
                  style={{
                    padding:'6px 10px',
                    borderRadius:'var(--radius-sm)',
                    background:'var(--bg-surface)',
                    border:'1px solid var(--border)',
                    cursor:'pointer',
                    color:'var(--text-secondary)',
                    fontSize:11,
                    fontWeight:600,
                    transition:'var(--transition-fast)',
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor='var(--border-strong)'}
                  onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
                >
                  View Patients
                </button>
              </div>
            </div>
          )
        }

        const wardPatients = patients.filter(p => p.ward === ward)
        return (
          <div key={ward} style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.08em', marginBottom:10 }}>{ward}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {wardPatients.map(p => (
                <button key={p.id} onClick={() => navigate(`/patients/${p.id}`)} style={{
                  padding:'5px 10px', borderRadius:'var(--radius-sm)',
                  background:'var(--bg-surface)', border:'1px solid var(--border)',
                  cursor:'pointer', display:'flex', alignItems:'center', gap:6,
                  transition:'var(--transition-fast)',
                }}
                  onMouseOver={e => e.currentTarget.style.borderColor='var(--border-strong)'}
                  onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}
                >
                  <span style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)' }}>{p.bed}</span>
                  <RiskBadge level={p.risk_level} />
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
