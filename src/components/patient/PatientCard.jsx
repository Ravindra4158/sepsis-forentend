import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PERMISSIONS } from '@/utils/rbac'
import { RiskBadge } from '@/components/common/StatusBadge'
import { getRiskColor } from '@/utils/riskColor'
import { vitalColor } from '@/utils/riskColor'

export default function PatientCard({ patient }) {
  const navigate   = useNavigate()
  const { can }    = useAuth()
  const [hov, setHov] = useState(false)
  const level = patient.risk_level || patient.riskLevel || 'LOW'
  const score = patient.risk_score || patient.riskScore || 0
  const color = getRiskColor(level)

  const v = patient.latest_vitals || {}
  const fullName = patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
  const patientMeta = [patient.mrn || patient.patient_id, patient.age ? `${patient.age}y` : null, patient.gender, patient.ward, patient.bed || patient.bed_number].filter(Boolean).join(' · ')

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => navigate(`/patients/${patient.id}`)}
      style={{
        background: hov ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border:`1px solid ${level === 'CRITICAL' ? color + '50' : hov ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius:'var(--radius-lg)', padding:'20px 20px', cursor:'pointer',
        transition:'var(--transition)',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `var(--shadow-md)` : 'var(--shadow-sm)',
        position:'relative', overflow:'hidden',
      }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${color},transparent)`, opacity:0.7 }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>{fullName || 'Unnamed patient'}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{patientMeta}</div>
        </div>
        {can(PERMISSIONS.VIEW_RISK_SCORE) && (
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(25,52,56,0.08)" strokeWidth="5" />
            <circle cx="26" cy="26" r="20" fill="none" stroke={color} strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2*Math.PI*20}
              strokeDashoffset={2*Math.PI*20 - (score/100)*2*Math.PI*20}
              transform="rotate(-90 26 26)"
              style={{ transition:'stroke-dashoffset 0.6s ease' }}
            />
            <text x="26" y="27" textAnchor="middle" dominantBaseline="middle"
              fill={color} fontSize="12" fontWeight="700" fontFamily="var(--font-mono)">{score ?? '—'}</text>
          </svg>
        )}
      </div>

      {can(PERMISSIONS.VIEW_RISK_SCORE) && (
        <div style={{ marginBottom:12 }}>
          <RiskBadge level={level} score={score} pulse={level === 'CRITICAL'} />
        </div>
      )}

      {can(PERMISSIONS.VIEW_VITALS) && Object.keys(v).length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:12 }}>
          {[
            { label:'HR',   value: v.heart_rate,       unit:'bpm',  ok: v.heart_rate>=60&&v.heart_rate<=100 },
            { label:'BP',   value: v.systolic_bp,      unit:'mmHg', ok: v.systolic_bp>=90&&v.systolic_bp<=140 },
            { label:'T°',   value: v.temperature,      unit:'°C',   ok: v.temperature>=36.1&&v.temperature<=37.5 },
            { label:'SpO₂', value: v.spo2,             unit:'%',    ok: v.spo2>=95 },
          ].map(vt => (
            <div key={vt.label} style={{
              background: vt.ok ? 'rgba(255,255,255,0.58)' : 'var(--red-bg)',
              border:`1px solid ${vt.ok ? 'var(--border)' : 'var(--red-border)'}`,
              borderRadius:'var(--radius-sm)', padding:'7px 6px', textAlign:'center',
            }}>
              <div style={{ fontSize:9, color:'var(--text-muted)', letterSpacing:'0.06em', marginBottom:2 }}>{vt.label}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:12, fontWeight:600, color: vt.ok ? 'var(--text-secondary)' : 'var(--red)' }}>
                {vt.value != null ? (typeof vt.value === 'number' && vt.value < 10 ? vt.value.toFixed(1) : Math.round(vt.value)) : '—'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize:10, color:'var(--text-muted)' }}>
          <div>{patient.primary_diagnosis || 'No diagnosis entered'}</div>
        </div>
        <span style={{ fontSize:10, color:'var(--green)', fontWeight:600 }}>Open record</span>
      </div>
    </div>
  )
}
