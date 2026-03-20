import React from 'react'
import { RISK_COLORS, RISK_BG, RISK_BORDER } from '@/utils/constants'

const LEVELS = [
  { key:'CRITICAL', label:'Critical',  icon:'Immediate', sub:'Immediate action required' },
  { key:'HIGH',     label:'High Risk', icon:'Escalated', sub:'Physician notified' },
  { key:'MODERATE', label:'Moderate',  icon:'Watch', sub:'Closely monitored' },
  { key:'LOW',      label:'Stable',    icon:'Stable', sub:'Within normal limits' },
]

export default function RiskSummaryCards({ counts = {}, total = 0 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
      {LEVELS.map(lvl => {
        const count = counts[lvl.key] ?? 0
        const color  = RISK_COLORS[lvl.key]
        const bg     = RISK_BG[lvl.key]
        const border = RISK_BORDER[lvl.key]
        return (
          <div key={lvl.key} className={lvl.key === 'CRITICAL' && count > 0 ? 'pulse-red' : ''} style={{
            background:'var(--bg-card)', border:`1px solid ${count > 0 ? border : 'var(--border)'}`,
            borderRadius:'var(--radius-md)', padding:'18px 20px',
            position:'relative', overflow:'hidden',
            transition:'var(--transition)',
            boxShadow:'var(--shadow-sm)',
          }}>
            <div style={{ position:'absolute', top:0, right:0, width:70, height:70, borderRadius:'50%', background:`radial-gradient(circle,${color}12 0%,transparent 70%)`, transform:'translate(20px,-20px)' }} />
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:count > 0 ? color : 'var(--text-muted)', marginBottom:10 }}>{lvl.icon}</div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:34, fontWeight:700, color: count > 0 ? color : 'var(--text-muted)', lineHeight:1, marginBottom:4 }}>
              {count}
            </div>
            <div style={{ fontSize:12, fontWeight:600, color: count > 0 ? color : 'var(--text-secondary)', marginBottom:2 }}>{lvl.label}</div>
            <div style={{ fontSize:10, color:'var(--text-muted)' }}>{lvl.sub}</div>
          </div>
        )
      })}
    </div>
  )
}
