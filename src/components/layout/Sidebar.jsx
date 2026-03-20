import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAlerts } from '@/hooks/useAlerts'
import { useStore } from '@/store/store'
import { ROLES, PERMISSIONS, ROLE_META } from '@/utils/rbac'

const NAV_DOCTOR = [
  { to:'/dashboard/doctor', icon:'Overview', label:'Command View' },
  { to:'/patients',         icon:'Patients', label:'Patients' },
  { to:'/alerts',           icon:'Alerts', label:'Alerts', alertBadge:true },
]
const NAV_NURSE = [
  { to:'/dashboard/nurse',  icon:'Overview', label:'Shift View' },
  { to:'/patients',         icon:'Patients', label:'Patients' },
  { to:'/alerts',           icon:'Alerts', label:'Alerts', alertBadge:true },
]
const NAV_ADMIN = [
  { to:'/admin',            icon:'Admin', label:'Operations' },
  { to:'/admin/audit-log',  icon:'Audit', label:'Audit Log' },
  { to:'/patients',         icon:'Patients', label:'Patients' },
  { to:'/users',            icon:'Users', label:'Users' },
  { to:'/settings',         icon:'Settings',  label:'Settings' },
]

function NavItem({ to, icon, label, open, badge }) {
  return (
    <NavLink to={to} style={({ isActive }) => ({
      display:'flex', alignItems:'center', gap:12,
      padding: open ? '12px 14px' : '12px 0',
      justifyContent: open ? 'flex-start' : 'center',
      borderRadius:'var(--radius-md)',
      color: isActive ? 'var(--green)' : 'rgba(247,250,248,0.72)',
      background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
      border: `1px solid ${isActive ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
      fontWeight: isActive ? 600 : 400, fontSize:13,
      transition:'var(--transition-fast)',
      whiteSpace:'nowrap', overflow:'hidden', textDecoration:'none',
    })}>
      <span style={{ fontSize:11, flexShrink:0, textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.82 }}>{icon}</span>
      {open && <span style={{ flex:1 }}>{label}</span>}
      {open && badge > 0 && (
        <span style={{
          minWidth:20, height:20, borderRadius:10,
          background:'var(--red)', color:'#fff',
          fontSize:10, fontWeight:700,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'0 5px',
        }}>{badge > 99 ? '99+' : badge}</span>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { unreadCount }  = useAlerts()
  const { sidebarOpen }  = useStore()

  const role     = user?.role
  const roleMeta = ROLE_META[role] || {}
  const navItems = role === ROLES.DOCTOR ? NAV_DOCTOR
                 : role === ROLES.NURSE  ? NAV_NURSE
                 : NAV_ADMIN

  return (
    <aside style={{
      position:'fixed', top:0, left:0,
      width: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed)',
      height:'100vh', zIndex:'var(--z-sidebar)',
      background:'rgba(24,50,56,0.95)',
      borderRight:'1px solid rgba(255,255,255,0.08)',
      display:'flex', flexDirection:'column',
      transition:'width 0.28s ease', overflow:'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height:'var(--navbar-height)', display:'flex', alignItems:'center',
        padding:'0 18px', gap:12, borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0,
      }}>
        <div style={{
          width:40, height:40, borderRadius:'14px', flexShrink:0,
          background:'linear-gradient(135deg,#dceee8,#9ed0c4)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
          color:'#183238',
        }}>S</div>
        {sidebarOpen && (
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:'var(--text-inverse)', letterSpacing:'-0.3px' }}>
              SepsisShield
            </div>
            <div style={{ fontSize:9, color:'rgba(247,250,248,0.58)', letterSpacing:'0.14em' }}>CLINICAL OPERATIONS</div>
          </div>
        )}
      </div>

      {/* Role chip */}
      {sidebarOpen && (
        <div style={{
          margin:'12px 12px 4px',
          padding:'8px 12px',
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'var(--radius-sm)',
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{ fontSize:16 }}>{roleMeta.icon}</span>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color: '#d7ebe5' }}>
              {roleMeta.label}
            </div>
            <div style={{ fontSize:10, color:'rgba(247,250,248,0.58)', marginTop:1 }}>{user?.name}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:'10px 10px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
        {sidebarOpen && (
          <div style={{ fontSize:9, fontWeight:700, color:'rgba(247,250,248,0.48)', letterSpacing:'0.12em', padding:'6px 8px 4px' }}>
            MENU
          </div>
        )}
        {navItems.map(item => (
          <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label}
            open={sidebarOpen} badge={item.alertBadge ? unreadCount : 0} />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={logout} style={{
          width:'100%', display:'flex', alignItems:'center',
          gap:10, padding: sidebarOpen ? '9px 12px' : '9px 0',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          borderRadius:'var(--radius-sm)',
          background:'transparent', border:'1px solid transparent',
          color:'rgba(247,250,248,0.62)', fontSize:13, cursor:'pointer',
          transition:'var(--transition-fast)',
        }}
          onMouseOver={e => { e.currentTarget.style.background='rgba(186,75,69,0.12)'; e.currentTarget.style.color='#f6d4d1' }}
          onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(247,250,248,0.62)' }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
