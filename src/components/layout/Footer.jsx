import React from 'react'
export default function Footer() {
  return (
    <footer style={{
      height:'var(--footer-height)', borderTop:'1px solid var(--border)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 28px', background:'rgba(255,255,255,0.58)', flexShrink:0,
      backdropFilter:'blur(12px)',
    }}>
      <span style={{ fontSize:11, color:'var(--text-muted)' }}>
        SepsisShield AI · Clinical Monitoring Workspace
      </span>
      <span style={{ fontSize:11, color:'var(--text-muted)' }}>
        Clinical decision support only. Confirm with the treating team.
      </span>
    </footer>
  )
}
