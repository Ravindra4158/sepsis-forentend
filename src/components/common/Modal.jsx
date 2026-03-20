import React, { useEffect } from 'react'
import Button from './Button'

export default function Modal({ open, onClose, title, children, footer, width = 520 }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:'var(--z-modal)',
      background:'var(--bg-modal)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:20, backdropFilter:'blur(6px)',
    }} onClick={onClose}>
      <div className="anim-fade" style={{
        background:'var(--bg-card)',
        border:'1px solid var(--border-strong)',
        borderRadius:'var(--radius-lg)',
        width:'100%', maxWidth:width,
        maxHeight:'90vh', display:'flex', flexDirection:'column',
        boxShadow:'var(--shadow-lg)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'18px 22px', borderBottom:'1px solid var(--border)',
        }}>
          <h3 style={{ fontSize:'1rem', fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{
            width:28, height:28, borderRadius:'50%',
            background:'var(--bg-surface)', border:'1px solid var(--border)',
            color:'var(--text-muted)', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, transition:'var(--transition-fast)',
          }}>×</button>
        </div>
        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px' }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{
            padding:'14px 22px', borderTop:'1px solid var(--border)',
            display:'flex', justifyContent:'flex-end', gap:10,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
