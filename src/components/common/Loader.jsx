import React from 'react'

export default function Loader({ fullscreen = false, size = 36, text = '' }) {
  const wrap = fullscreen ? {
    position:'fixed', inset:0, display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    background:'rgba(244,247,243,0.92)', zIndex:999,
    gap:16,
  } : {
    display:'flex', flexDirection:'column', alignItems:'center',
    justifyContent:'center', padding:'40px 20px', gap:12,
  }

  return (
    <div style={wrap}>
      <svg width={size} height={size} viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#dbe5df" strokeWidth="4" />
        <circle cx="25" cy="25" r="20" fill="none" stroke="var(--green)" strokeWidth="4"
          strokeLinecap="round" strokeDasharray="80 120"
          style={{ animation:'spin 0.9s linear infinite', transformOrigin:'center' }} />
      </svg>
      {text && <span style={{ fontSize:13, color:'var(--text-muted)', letterSpacing:'0.06em' }}>{text}</span>}
    </div>
  )
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding:'14px 16px' }}>
          <div className="skeleton" style={{ height:14, width:`${60 + Math.random()*30}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:20 }}>
      <div className="skeleton" style={{ height:16, width:'60%', marginBottom:12 }} />
      <div className="skeleton" style={{ height:12, width:'40%', marginBottom:20 }} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:52 }} />)}
      </div>
    </div>
  )
}
