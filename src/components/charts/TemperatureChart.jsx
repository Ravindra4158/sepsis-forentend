import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

export default function TemperatureChart({ data=[], height=120 }) {
  const last = data[data.length-1]?.temperature || 0
  const abnormal = last>37.5||last<36.1
  const color = last>37.5?'#f97316':last<36.1?'#60a5fa':'#22d3ee'
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em' }}>TEMPERATURE</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:600, color:abnormal?color:'var(--text-primary)' }}>{last.toFixed(1)}</span>
          <span style={{ fontSize:10, color:'var(--text-muted)' }}>°C</span>
          {abnormal&&<span style={{ fontSize:9, color, fontWeight:700 }}>{last>37.5?'▲ FEVER':'▼ LOW'}</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
          <defs>
            <linearGradient id="tempG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28}/>
              <stop offset="100%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={['auto','auto']} tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} width={32}/>
          <ReferenceLine y={37.5} stroke="rgba(249,115,22,0.3)" strokeDasharray="4 3"/>
          <ReferenceLine y={36.1} stroke="rgba(96,165,250,0.3)"  strokeDasharray="4 3"/>
          <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', fontSize:11 }}/>
          <Area type="monotone" dataKey="temperature" stroke={color} strokeWidth={2} fill="url(#tempG)" dot={false} isAnimationActive={false}/>
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:3 }}>Normal: 36.1–37.5 °C</div>
    </div>
  )
}
