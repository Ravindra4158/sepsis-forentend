import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, CartesianGrid } from 'recharts'
import { scoreToLevel } from '@/utils/riskColor'
import { RISK_COLORS } from '@/utils/constants'

const TT = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null
  const v = payload[0]?.value||0
  const col = RISK_COLORS[scoreToLevel(v)]
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', padding:'8px 12px', fontSize:11 }}>
      <div style={{ color:'var(--text-muted)', marginBottom:3 }}>{label}</div>
      <div style={{ color:col, fontFamily:'var(--font-mono)', fontWeight:700, fontSize:14 }}>Risk: {v}</div>
    </div>
  )
}

export default function SepsisRiskChart({ data=[], height=160 }) {
  const key  = data[0]?.risk_score!==undefined?'risk_score':'riskScore'
  const last = data[data.length-1]?.[key]||0
  const color = RISK_COLORS[scoreToLevel(last)]
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em' }}>SEPSIS RISK TREND</span>
        <div style={{ display:'flex', gap:12 }}>
          {[['Critical',65,'#ef4444'],['High',40,'#f97316'],['Moderate',20,'#f59e0b']].map(([l,,,c])=>(
            <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:16, height:1.5, background:l==='Critical'?'#ef4444':l==='High'?'#f97316':'#f59e0b', opacity:0.6 }}/>
              <span style={{ fontSize:9, color:'var(--text-muted)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
          <defs>
            <linearGradient id="riskG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35}/><stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false}/>
          <XAxis dataKey="time" tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={[0,100]} tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} width={22}/>
          <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="5 3" strokeOpacity={0.4}/>
          <ReferenceLine y={40} stroke="#f97316" strokeDasharray="5 3" strokeOpacity={0.4}/>
          <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="5 3" strokeOpacity={0.4}/>
          <Tooltip content={<TT/>}/>
          <Area type="monotone" dataKey={key} stroke={color} strokeWidth={2.5} fill="url(#riskG)" dot={false} isAnimationActive={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
