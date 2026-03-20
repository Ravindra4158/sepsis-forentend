import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts'

export default function BloodPressureChart({ data=[], height=140 }) {
  const sKey = data[0]?.systolic_bp!==undefined?'systolic_bp':'systolicBP'
  const dKey = data[0]?.diastolic_bp!==undefined?'diastolic_bp':'diastolicBP'
  const lastS = data[data.length-1]?.[sKey] || 0
  const lastD = data[data.length-1]?.[dKey] || 0
  const sBad = lastS<90||lastS>140
  const dBad = lastD<60||lastD>90
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.08em' }}>BLOOD PRESSURE</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:600, color:sBad?'#f87171':'var(--text-primary)' }}>{lastS.toFixed(0)}</span>
          <span style={{ fontSize:14, color:'var(--text-muted)' }}>/</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:20, fontWeight:600, color:dBad?'#f87171':'var(--text-primary)' }}>{lastD.toFixed(0)}</span>
          <span style={{ fontSize:10, color:'var(--text-muted)' }}>mmHg</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{top:4,right:0,bottom:0,left:0}}>
          <XAxis dataKey="time" tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} interval="preserveStartEnd"/>
          <YAxis domain={[40,180]} tick={{fill:'#334d63',fontSize:9}} axisLine={false} tickLine={false} width={28}/>
          <ReferenceLine y={90}  stroke="rgba(248,113,113,0.25)" strokeDasharray="4 3"/>
          <ReferenceLine y={140} stroke="rgba(248,113,113,0.25)" strokeDasharray="4 3"/>
          <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-strong)', borderRadius:'var(--radius-sm)', fontSize:11 }}/>
          <Line type="monotone" dataKey={sKey} stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} name="Systolic"/>
          <Line type="monotone" dataKey={dKey} stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false} name="Diastolic"/>
        </LineChart>
      </ResponsiveContainer>
      <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:3 }}>Normal: 90–140 / 60–90 mmHg</div>
    </div>
  )
}
