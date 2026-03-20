import React, { useEffect } from 'react'
import { useStore } from '@/store/store'

const ICONS = { success:'✓', error:'✕', warning:'⚠', info:'ℹ' }
const COLORS = {
  success: { color:'var(--green)', border:'var(--green-border)', bg:'var(--green-bg)' },
  error:   { color:'var(--red)',   border:'var(--red-border)',   bg:'var(--red-bg)'   },
  warning: { color:'var(--amber)', border:'var(--amber-border)', bg:'var(--amber-bg)' },
  info:    { color:'var(--cyan)',  border:'var(--cyan-border)',  bg:'var(--cyan-bg)'  },
}

const emitNotification = (notif) => {
  window.dispatchEvent(new CustomEvent('app-notify', { detail: notif }))
}

export const notify = Object.assign(emitNotification, {
  success(message, title = 'Success') {
    emitNotification({ type: 'success', title, message })
  },
  error(message, title = 'Error') {
    emitNotification({ type: 'error', title, message })
  },
  warning(message, title = 'Warning') {
    emitNotification({ type: 'warning', title, message })
  },
  info(message, title = 'Info') {
    emitNotification({ type: 'info', title, message })
  },
})

export default function NotificationToast() {
  const { notifications, pushNotification, dismissNotification } = useStore()

  useEffect(() => {
    const handleNotify = (e) => pushNotification(e.detail)
    window.addEventListener('app-notify', handleNotify)
    return () => window.removeEventListener('app-notify', handleNotify)
  }, [pushNotification])

  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:'var(--z-toast)',
      display:'flex', flexDirection:'column-reverse', gap:10,
    }}>
      {notifications.map(n => {
        const c = COLORS[n.type] || COLORS.info
        return (
          <div key={n.id} className="anim-slide-r" style={{
            width:340, background:'var(--bg-card)',
            border:`1px solid ${c.border}`,
            borderRadius:'var(--radius-md)',
            boxShadow:'var(--shadow-md)',
            overflow:'hidden',
          }}>
            <div style={{ height:3, background:c.color }} />
            <div style={{ padding:'12px 14px', display:'flex', gap:12, alignItems:'flex-start' }}>
              <span style={{
                width:26, height:26, borderRadius:'50%', flexShrink:0,
                background:c.bg, color:c.color, border:`1px solid ${c.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:700,
              }}>{ICONS[n.type]}</span>
              <div style={{ flex:1 }}>
                {n.title && <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:2 }}>{n.title}</div>}
                <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5 }}>{n.message}</div>
              </div>
              <button onClick={() => dismissNotification(n.id)} style={{ color:'var(--text-muted)', fontSize:16, cursor:'pointer', flexShrink:0 }}>×</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
