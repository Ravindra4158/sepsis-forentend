import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

export default function RespirationChart({ data=[], height=120 }) {
  const key  = data[0]?.respiratory_rate!==undefined?'respiratory_rate':'respiratoryRate'
  const last = data[data.length-1]?.[key] || 0
  const abnormal = last>20||last<12
  const color = abnormal?'#a78bfa':'#22d3ee'
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em' }}>RESPIRATORY RATE</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:600, color:abnormal?color:'var(--text-primary)' }}>{last.toFixed(0)}</span>
          <span style={{ fontSize:10, color:'var(--text-muted)' }}>/min</span>
          {abnormal&&<span style={{ fontSize:9, color, fontWeight:700 }}>⚠</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
          <defs>
            <linearGradient id="rrG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25}/><stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={['auto','auto']} tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} width={24}/>
          <ReferenceLine y={20} stroke="rgba(167,139,250,0.3)" strokeDasharray="4 3"/>
          <ReferenceLine y={12} stroke="rgba(167,139,250,0.3)" strokeDasharray="4 3"/>
          <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', fontSize:11 }}/>
          <Area type="monotone" dataKey={key} stroke={color} strokeWidth={2} fill="url(#rrG)" dot={false} isAnimationActive={false}/>
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:3 }}>Normal: 12–20 /min</div>
    </div>
  )
}
