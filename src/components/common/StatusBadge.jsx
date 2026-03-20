import React from 'react'
import { getRiskColor, getRiskBg, getRiskBorder } from '@/utils/riskColor'
import { ROLE_META } from '@/utils/rbac'

export function RiskBadge({ level, score, pulse = false }) {
  const color  = getRiskColor(level)
  const bg     = getRiskBg(level)
  const border = getRiskBorder(level)
  return (
    <span className={pulse && level === 'CRITICAL' ? 'pulse-red' : ''} style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', borderRadius:'var(--radius-full)',
      background:bg, color, border:`1px solid ${border}`,
      fontSize:10, fontWeight:700, letterSpacing:'0.1em',
      whiteSpace:'nowrap',
    }}>
      {level === 'CRITICAL' && <span className="blink" style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block' }} />}
      {level}{score !== undefined && ` · ${score}`}
    </span>
  )
}

export function AlertStatusBadge({ status }) {
  const map = {
    active:       { color:'#ef4444', bg:'rgba(239,68,68,0.10)',     border:'rgba(239,68,68,0.30)',     label:'Active' },
    acknowledged: { color:'#f59e0b', bg:'rgba(245,158,11,0.10)',    border:'rgba(245,158,11,0.30)',    label:'Acknowledged' },
    resolved:     { color:'#10b981', bg:'rgba(16,185,129,0.10)',    border:'rgba(16,185,129,0.30)',    label:'Resolved' },
    escalated:    { color:'#a78bfa', bg:'rgba(167,139,250,0.10)',   border:'rgba(167,139,250,0.30)',   label:'Escalated' },
  }
  const m = map[status] || map.active
  return (
    <span style={{
      padding:'3px 10px', borderRadius:'var(--radius-full)',
      background:m.bg, color:m.color, border:`1px solid ${m.border}`,
      fontSize:10, fontWeight:700, letterSpacing:'0.08em',
    }}>{m.label}</span>
  )
}

export function RoleBadge({ role }) {
  const m = ROLE_META[role] || { label: role, color:'var(--text-muted)' }
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', borderRadius:'var(--radius-full)',
      background:`${m.color}15`, color:m.color,
      border:`1px solid ${m.color}35`,
      fontSize:10, fontWeight:700, letterSpacing:'0.08em',
    }}>
      {m.icon && <span>{m.icon}</span>} {m.label}
    </span>
  )
}

export function OnlineDot({ online = true }) {
  return (
    <span style={{
      display:'inline-block', width:8, height:8, borderRadius:'50%',
      background: online ? 'var(--green)' : 'var(--text-muted)',
      boxShadow: online ? '0 0 6px var(--green)' : 'none',
    }} />
  )
}

export default function StatusBadge({ status, label, dot, size, style }) {
  const isOnline = status === 'online'
  const isOffline = status === 'offline'
  if (isOnline || isOffline) {
    return (
      <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize: size==='xs'?10:12, ...style }}>
        {dot && <OnlineDot online={isOnline} />}
        {label || status}
      </span>
    )
  }
  // Risk levels
  const upStatus = status?.toUpperCase?.()
  if (['LOW','MODERATE','HIGH','CRITICAL'].includes(upStatus)) {
    return (
      <span style={{ display:'inline-flex', alignItems:'center', gap:5, ...style }}>
        {dot && upStatus === 'CRITICAL' && <span className="blink" style={{ width:6, height:6, borderRadius:'50%', background:'var(--red)', display:'inline-block' }} />}
        <RiskBadge level={upStatus} />
      </span>
    )
  }
  return <AlertStatusBadge status={status} />
}
