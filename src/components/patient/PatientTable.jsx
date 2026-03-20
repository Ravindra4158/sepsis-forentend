import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PERMISSIONS } from '@/utils/rbac'
import { RiskBadge } from '@/components/common/StatusBadge'
import { getRiskColor, vitalColor } from '@/utils/riskColor'
import { SkeletonRow } from '@/components/common/Loader'

const COLS = [
  { key:'patient_id',  label:'ID',       w:80  },
  { key:'full_name',   label:'Patient',   w:180 },
  { key:'ward',        label:'Location',  w:110 },
  { key:'risk_level',  label:'Risk',      w:130 },
  { key:'heart_rate',  label:'HR',        w:70  },
  { key:'systolic_bp', label:'BP',        w:80  },
  { key:'temperature', label:'Temp',      w:80  },
  { key:'spo2',        label:'SpO₂',      w:70  },
]

export default function PatientTable({ patients = [], loading = false }) {
  const navigate   = useNavigate()
  const { can }    = useAuth()
  const [sortKey,  setSortKey]  = useState('risk_score')
  const [sortDir,  setSortDir]  = useState('desc')
  const [hovRow,   setHovRow]   = useState(null)

  const toggleSort = (k) => { if(sortKey===k) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortKey(k);setSortDir('desc')} }

  const sorted = [...patients].sort((a,b) => {
    let va = sortKey==='risk_score' ? a.risk_score : sortKey==='full_name' ? a.full_name : a[sortKey]
    let vb = sortKey==='risk_score' ? b.risk_score : sortKey==='full_name' ? b.full_name : b[sortKey]
    if(va<vb) return sortDir==='asc'?-1:1
    if(va>vb) return sortDir==='asc'?1:-1
    return 0
  })

  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid var(--border)' }}>
              {COLS.filter(c => c.key!=='risk_level' || can(PERMISSIONS.VIEW_RISK_SCORE)).map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)} style={{
                  padding:'10px 14px', textAlign:'left', fontSize:10, fontWeight:700,
                  letterSpacing:'0.09em', color:'var(--text-muted)', cursor:'pointer',
                  whiteSpace:'nowrap', userSelect:'none', minWidth:col.w,
                }}
                  onMouseOver={e => e.currentTarget.style.color='var(--text-secondary)'}
                  onMouseOut={e => e.currentTarget.style.color='var(--text-muted)'}
                >
                  {col.label} {sortKey===col.key && (sortDir==='asc'?'↑':'↓')}
                </th>
              ))}
              <th style={{ padding:'10px 14px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:'0.09em', color:'var(--text-muted)' }}>
                Flags
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({length:6}).map((_,i)=><SkeletonRow key={i} cols={COLS.length+1} />)
              : sorted.map((p,i) => {
                  const v = p.latest_vitals || {}
                  const isHov = hovRow === p.id
                  return (
                <tr key={p.id}
                      onMouseEnter={() => setHovRow(p.id)} onMouseLeave={() => setHovRow(null)}
                      onClick={() => navigate(`/patients/${p.id}`)}
                      style={{
                        borderBottom: i<sorted.length-1 ? '1px solid var(--border)' : 'none',
                        background: isHov ? 'var(--bg-card-hover)' : p.risk_level==='CRITICAL' ? 'rgba(239,68,68,0.03)' : 'transparent',
                        cursor:'pointer', transition:'var(--transition-fast)',
                      }}
                    >
                      <td style={{ padding:'12px 14px', fontFamily:'var(--font-mono)', color:'var(--text-muted)', fontSize:11 }}>{p.patient_id || p.mrn || '—'}</td>
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unnamed patient'}</div>
                        <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:1 }}>{p.age ? `${p.age}y` : '—'} {p.gender || '—'} · {p.primary_diagnosis || 'No diagnosis entered'}</div>
                      </td>
                      <td style={{ padding:'12px 14px', color:'var(--text-secondary)' }}>{[p.ward, p.bed || (p.bed_number != null ? `Bed ${p.bed_number}` : null)].filter(Boolean).join(' · ') || '—'}</td>
                      {can(PERMISSIONS.VIEW_RISK_SCORE) && (
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <RiskBadge level={p.risk_level} />
                            <span style={{ fontFamily:'var(--font-mono)', fontSize:12, fontWeight:700, color:getRiskColor(p.risk_level) }}>{p.risk_score}</span>
                          </div>
                        </td>
                      )}
                      {[
                        { val:v.heart_rate,  ok:v.heart_rate>=60&&v.heart_rate<=100 },
                        { val:v.systolic_bp, ok:v.systolic_bp>=90&&v.systolic_bp<=140 },
                        { val:v.temperature, ok:v.temperature>=36.1&&v.temperature<=37.5, decimals:1 },
                        { val:v.spo2,        ok:v.spo2>=95 },
                      ].map((vt,j) => (
                        <td key={j} style={{ padding:'12px 14px', fontFamily:'var(--font-mono)', fontSize:12, color:vt.ok?'var(--text-secondary)':'#fca5a5' }}>
                          {vt.val != null ? (vt.decimals ? vt.val.toFixed(vt.decimals) : Math.round(vt.val)) : '—'}
                        </td>
                      ))}
                      <td style={{ padding:'12px 14px' }}>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                          {(p.risk_flags||[]).slice(0,3).map(f=>(
                            <span key={f} style={{ fontSize:9, padding:'1px 6px', borderRadius:'var(--radius-xs)', background:`${getRiskColor(p.risk_level)}12`, color:getRiskColor(p.risk_level), border:`1px solid ${getRiskColor(p.risk_level)}25` }}>{f}</span>
                          ))}
                          {(p.risk_flags||[]).length>3 && <span style={{ fontSize:9, color:'var(--text-muted)' }}>+{p.risk_flags.length-3}</span>}
                        </div>
                      </td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
      <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border)', fontSize:11, color:'var(--text-muted)', display:'flex', justifyContent:'space-between' }}>
        <span>{sorted.length} patients</span>
        <span>Click any row to view full record</span>
      </div>
    </div>
  )
}
