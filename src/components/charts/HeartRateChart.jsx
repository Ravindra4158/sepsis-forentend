import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const TT = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', padding:'8px 12px', fontSize:11 }}>
      <div style={{ color:'var(--text-muted)', marginBottom:3 }}>{label}</div>
      <div style={{ color:'#f87171', fontFamily:'var(--font-mono)', fontWeight:600 }}>{payload[0]?.value?.toFixed(0)} bpm</div>
    </div>
  )
}

export default function HeartRateChart({ data=[], height=120 }) {
  const last = data[data.length-1]?.heart_rate || data[data.length-1]?.heartRate || 0
  const abnormal = last>100||last<60
  const color = abnormal?'#f87171':'#22d3ee'
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em' }}>HEART RATE</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:600, color:abnormal?color:'var(--text-primary)' }}>{last.toFixed(0)}</span>
          <span style={{ fontSize:10, color:'var(--text-muted)' }}>bpm</span>
          {abnormal&&<span style={{ fontSize:9, color, fontWeight:700 }}>⚠</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
          <defs>
            <linearGradient id="hrG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25}/>
              <stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={['auto','auto']} tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} width={28}/>
          <ReferenceLine y={100} stroke="rgba(248,113,113,0.25)" strokeDasharray="4 3"/>
          <ReferenceLine y={60}  stroke="rgba(248,113,113,0.25)" strokeDasharray="4 3"/>
          <Tooltip content={<TT/>}/>
          <Area type="monotone" dataKey={data[0]?.heart_rate!==undefined?'heart_rate':'heartRate'}
            stroke={color} strokeWidth={2} fill="url(#hrG)" dot={false} isAnimationActive={false}/>
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:3 }}>Normal: 60–100 bpm</div>
    </div>
  )
}
