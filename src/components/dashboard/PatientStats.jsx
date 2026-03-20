import React from 'react'

export default function PatientStats({ stats = {} }) {
  const items = [
    { label:'Total Admitted',    value: stats.total ?? '—', color:'var(--cyan)'   },
    { label:'ICU Occupancy',     value: stats.icu_occupancy_pct != null ? `${stats.icu_occupancy_pct}%` : '—', color:'var(--purple)' },
    { label:'Avg Risk Score',    value: stats.avg_risk_score ?? '—', color:'var(--amber)'  },
    { label:'Discharged Today',  value: stats.discharged_today ?? '—', color:'var(--green)'  },
    { label:'New Admissions',    value: stats.new_today ?? '—', color:'var(--cyan)'   },
    { label:'Sepsis Confirmed',  value: stats.sepsis_confirmed ?? '—', color:'var(--red)'    },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
      {items.map(item => (
        <div key={item.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px' }}>
          <div style={{ fontSize:9, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:6 }}>{item.label.toUpperCase()}</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:24, fontWeight:700, color:item.color }}>{item.value}</div>
        </div>
      ))}
    </div>
  )
}
