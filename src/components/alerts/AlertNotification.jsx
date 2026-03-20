import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRiskColor } from '@/utils/riskColor'

export default function AlertNotification({ alert, onDismiss }) {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const color = getRiskColor(alert.severity)

  useEffect(() => {
    requestAnimationFrame(()=>setShow(true))
    const t = setTimeout(()=>{ setShow(false); setTimeout(onDismiss,320) }, 7000)
    return ()=>clearTimeout(t)
  }, [])

  return (
    <div style={{
      width:340, background:'var(--bg-surface)',
      border:`1px solid ${color}44`, borderRadius:'var(--radius-md)',
      boxShadow:`var(--shadow-md), 0 0 24px ${color}18`,
      transform: show?'translateX(0)':'translateX(120%)',
      opacity: show?1:0,
      transition:'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3, background:`linear-gradient(90deg,${color},${color}44)` }}/>
      <div style={{ padding:'14px 16px', display:'flex', gap:12, alignItems:'flex-start', marginTop:4 }}>
        <div style={{
          width:36, height:36, borderRadius:'50%', flexShrink:0,
          background:`${color}18`, border:`2px solid ${color}55`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
        }}>
          {alert.severity==='CRITICAL'?'🚨':alert.severity==='HIGH'?'⚠️':'📋'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color }}>{alert.severity} ALERT</span>
            <button onClick={()=>{setShow(false);setTimeout(onDismiss,300)}} style={{ color:'var(--text-muted)', fontSize:18, cursor:'pointer', lineHeight:1 }}>×</button>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{alert.patient_name}</div>
          <div style={{ fontSize:11, color:'var(--text-secondary)', marginBottom:8 }}>{alert.ward} · Risk {alert.risk_score}/100</div>
          <button onClick={()=>navigate(`/patients/${alert.patient_id}`)} style={{
            width:'100%', padding:'6px 0', background:`${color}14`, border:`1px solid ${color}40`,
            borderRadius:'var(--radius-sm)', color, fontSize:11, fontWeight:600, cursor:'pointer',
            fontFamily:'var(--font-display)',
          }}>View Patient →</button>
        </div>
      </div>
    </div>
  )
}
