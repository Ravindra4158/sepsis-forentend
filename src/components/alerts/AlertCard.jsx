import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAlerts } from '@/hooks/useAlerts'
import { PERMISSIONS } from '@/utils/rbac'
import { RiskBadge, AlertStatusBadge } from '@/components/common/StatusBadge'
import Button from '@/components/common/Button'
import { timeAgo, formatDateTime } from '@/utils/formatDate'
import { getRiskColor } from '@/utils/riskColor'

export default function AlertCard({ alert }) {
  const { can }                         = useAuth()
  const { acknowledgeAlert, resolveAlert } = useAlerts()
  const navigate                        = useNavigate()
  const [loading, setLoading]           = useState(false)
  const color = getRiskColor(alert.severity || alert.risk_level)

  const handleAck = async () => {
    setLoading(true)
    try { await acknowledgeAlert(alert.id) }
    finally { setLoading(false) }
  }

  const handleResolve = async () => {
    setLoading(true)
    try { await resolveAlert(alert.id) }
    finally { setLoading(false) }
  }

  const isActive = !alert.acknowledged_at

  return (
    <div className={isActive && alert.severity === 'CRITICAL' ? 'pulse-red' : ''} style={{
      background:'var(--bg-card)',
      border:`1px solid ${isActive ? color + '45' : 'var(--border)'}`,
      borderRadius:'var(--radius-md)',
      padding:'16px 18px',
      opacity: alert.status === 'resolved' ? 0.65 : 1,
      position:'relative', overflow:'hidden',
      transition:'var(--transition)',
    }}>
      {/* Left accent */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4, background: isActive ? color : 'var(--border)', borderRadius:'12px 0 0 12px' }} />

      <div style={{ paddingLeft:8 }}>
        {/* Top row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <RiskBadge level={alert.severity || alert.risk_level} pulse={isActive} />
            <AlertStatusBadge status={alert.status || (alert.acknowledged_at ? 'acknowledged' : 'active')} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-muted)' }}>{alert.alert_id || alert.id}</span>
          </div>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>{timeAgo(alert.triggered_at || alert.created_at)}</span>
        </div>

        {/* Patient */}
        <button onClick={() => navigate(`/patients/${alert.patient_id}`)} style={{
          fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:2,
          cursor:'pointer', transition:'color 0.15s', display:'block', textAlign:'left',
        }}
          onMouseOver={e => e.currentTarget.style.color = color}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}
        >{alert.patient_name || alert.patient_mrn || `Patient ${String(alert.patient_id).slice(0, 8)}`}</button>
        <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:6 }}>
          {[alert.ward, alert.bed].filter(Boolean).join(' · ') || 'Location unavailable'} · Risk score: <span style={{ fontFamily:'var(--font-mono)', color, fontWeight:700 }}>{alert.risk_score}</span>
        </div>
        <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:10, lineHeight:1.5 }}>{alert.message}</div>

        {/* Flags */}
        {alert.flags?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
            {alert.flags.map(f => (
              <span key={f} style={{
                fontSize:10, padding:'2px 8px', borderRadius:'var(--radius-xs)',
                background:`${color}12`, color, border:`1px solid ${color}25`,
              }}>⚠ {f}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:10, color:'var(--text-muted)' }}>
            Triggered: {formatDateTime(alert.triggered_at || alert.created_at)}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${alert.patient_id}`)}>
              View Patient
            </Button>
            {can(PERMISSIONS.ACKNOWLEDGE_ALERT) && isActive && (
              <Button variant="outline" size="sm" loading={loading} onClick={handleAck}
                style={{ borderColor:`${color}50`, color }}>
                Acknowledge
              </Button>
            )}
            {can(PERMISSIONS.ACKNOWLEDGE_ALERT) && alert.acknowledged_at && alert.status !== 'resolved' && (
              <Button variant="ghost" size="sm" loading={loading} onClick={handleResolve}>
                Resolve
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
