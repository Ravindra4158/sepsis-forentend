import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RiskBadge } from '@/components/common/StatusBadge'
import { timeAgo } from '@/utils/formatDate'
import { getRiskColor } from '@/utils/riskColor'
import Loader from '@/components/common/Loader'

export default function RecentAlerts({ alerts = [], loading = false }) {
  const navigate = useNavigate()
  return (
    <div className="clinical-surface" style={{ overflow:'hidden' }}>
      <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h3 style={{ fontSize:13, fontWeight:700 }}>Recent Alerts</h3>
        <button onClick={() => navigate('/alerts')} style={{ fontSize:11, color:'var(--green)', cursor:'pointer', fontWeight:600 }}>View all</button>
      </div>
      {loading
        ? <Loader text="Loading…" />
        : alerts.length === 0
          ? <div style={{ padding:'24px 18px', textAlign:'center', fontSize:12, color:'var(--text-muted)' }}>No active alerts</div>
          : alerts.slice(0, 6).map((a, i) => (
            <div key={a.id} onClick={() => navigate(`/patients/${a.patient_id}`)} style={{
              padding:'11px 18px', display:'flex', alignItems:'center', gap:12,
              borderBottom: i < Math.min(alerts.length, 6) - 1 ? '1px solid var(--border)' : 'none',
              cursor:'pointer', transition:'var(--transition-fast)',
            }}
              onMouseOver={e => e.currentTarget.style.background='var(--bg-card-hover)'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}
            >
              <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, background:getRiskColor(a.severity), boxShadow:`0 0 0 4px ${getRiskColor(a.severity)}15` }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.patient_name || 'Unknown patient'}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)' }}>{[a.ward, a.bed].filter(Boolean).join(' · ') || 'Clinical alert'}</div>
              </div>
              <RiskBadge level={a.severity} />
              <span style={{ fontSize:10, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{timeAgo(a.triggered_at || a.created_at)}</span>
            </div>
          ))
      }
    </div>
  )
}
