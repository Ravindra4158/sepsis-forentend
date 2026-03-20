import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import adminService from '@/services/adminService'
import patientService from '@/services/patientService'
import PatientStats from '@/components/dashboard/PatientStats'
import ICUStatus from '@/components/dashboard/ICUStatus'
import Button from '@/components/common/Button'
import StatusBadge from '@/components/common/StatusBadge'
import Loader from '@/components/common/Loader'
import { ROLE_META } from '@/utils/rbac'
import { timeAgo } from '@/utils/formatDate'
import { useAlerts } from '@/hooks/useAlerts'

function StatCard({ label, value, sub, color, icon, onClick }) {
  return (
    <div onClick={onClick} className="clinical-surface" style={{
      padding: '18px 20px',
      cursor: onClick ? 'pointer' : 'default', position: 'relative', overflow: 'hidden',
      transition: 'var(--transition)',
    }}
      onMouseOver={(e) => { if (onClick) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, fontSize: 12, opacity: 0.5, padding: 14, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{icon}</div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 34, fontWeight: 800, color: color || 'var(--cyan)', lineHeight: 1, marginBottom: 5 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}

export default function AdminPanel() {
  const { user } = useAuth()
  const { eventTick } = useAlerts()
  const navigate = useNavigate()
  const [systemStats, setSystemStats] = useState({})
  const [auditLog, setAuditLog] = useState([])
  const [pStats, setPStats] = useState({})
  const [health, setHealth] = useState({})
  const [loading, setLoading] = useState(true)

  const loadAdminPanel = () => {
    Promise.all([
      adminService.getStats(),
      adminService.getAuditLog({ limit: 10 }),
      adminService.getHealth(),
      patientService.getDashboardStats(),
    ]).then(([sys, audit, healthData, ps]) => {
      setSystemStats(sys)
      setAuditLog(audit.items || audit)
      setHealth(healthData)
      setPStats(ps)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAdminPanel()
  }, [])

  useEffect(() => {
    if (!eventTick) return
    loadAdminPanel()
  }, [eventTick])

  if (loading) return <Loader text="Loading admin panel..." />

  return (
    <div className="anim-fade">
      <div className="page-heading">
        <div>
          <h1 style={{ marginBottom: 4 }}>Operations Console</h1>
          <p>System management, staffing overview, and service health for {user?.name}.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" size="sm" onClick={() => navigate('/users')}>Manage Users</Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/audit-log')}>Audit Log</Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/settings')}>Settings</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="TOTAL USERS" value={systemStats.total_users || 0} icon="Users" color="var(--cyan)" sub="Active staff accounts" onClick={() => navigate('/users')} />
        <StatCard label="DOCTORS" value={systemStats.total_doctors || 0} icon="Doctors" color="var(--cyan)" sub={`of ${systemStats.total_users || 0} users`} />
        <StatCard label="NURSES" value={systemStats.total_nurses || 0} icon="Nurses" color="var(--green)" sub="Active ward nurses" />
        <StatCard label="TOTAL PATIENTS" value={systemStats.total_patients || 0} icon="Census" color="var(--purple)" sub="Currently admitted" onClick={() => navigate('/patients')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="ACTIVE ALERTS" value={systemStats.active_alerts || 0} icon="Alerts" color="var(--amber)" sub="Current unresolved alerts" />
        <StatCard label="CRITICAL NOW" value={pStats.critical || 0} icon="Priority" color="var(--red)" sub="Require intervention" />
        <StatCard label="MODEL MODE" value={health.model?.provider || 'Local'} icon="Inference" color="var(--cyan)" sub={health.model?.model_version || 'Pluggable model adapter'} />
        <StatCard label="SYSTEM STATUS" value={health.api?.status === 'online' ? 'Healthy' : 'Review'} icon="Status" color="var(--green)" sub={`${systemStats.database_mode || 'in_memory'} data mode`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <PatientStats stats={pStats} />
        <ICUStatus wardStats={pStats.ward_stats || {}} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="clinical-surface" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Staff by Role</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>Manage</Button>
          </div>
          {['doctor', 'nurse', 'admin'].map((role) => {
            const count = systemStats[`total_${role}s`] || 0
            const total = systemStats.total_users || 1
            const meta = ROLE_META[role] || {}
            return (
              <div key={role} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{meta.icon}</span> {meta.label}s
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: meta.color }}>{count}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(25,52,56,0.08)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: meta.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )
          })}
          <Button variant="primary" size="sm" style={{ marginTop: 8 }} fullWidth onClick={() => navigate('/users/add')}>
            + Add New User
          </Button>
        </div>

        <div className="clinical-surface" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14 }}>Recent Audit Log</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/audit-log')}>View All</Button>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 280 }}>
            {auditLog.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No audit entries yet</div>
            )}
            {auditLog.map((entry, i) => (
              <div key={i} style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                }}>
                  {entry.action === 'login' ? 'L' : entry.action === 'view' ? 'V' : entry.action === 'update' ? 'U' : 'A'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {entry.user_name || 'System'} — {entry.action || 'event'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                    {entry.resource || 'control plane'} · {entry.timestamp ? timeAgo(entry.timestamp) : 'just now'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="clinical-surface" style={{ padding: '18px 20px' }}>
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>System Health</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[ 
            { name: 'API Server', status: health.api?.status || 'online', latency: health.api?.latency_ms || systemStats.api_latency_ms },
            { name: 'AI Model', status: health.model?.status || 'online', latency: systemStats.model_latency_ms },
            { name: 'Database', status: health.database?.status || 'online', latency: null, sub: health.database?.mode || systemStats.database_mode },
            { name: 'Alert Engine', status: health.alerts?.status || 'online', latency: null, sub: `${health.alerts?.active_alerts || systemStats.active_alerts || 0} active` },
          ].map((svc) => (
            <div key={svc.name} style={{ background: 'rgba(255,255,255,0.62)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <span className="blink" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 5px var(--green)', display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{svc.name}</span>
              </div>
              <StatusBadge status={svc.status} size="xs" dot />
              {svc.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>{svc.sub}</div>}
              {svc.latency && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, fontFamily: 'var(--font-mono)' }}>{svc.latency}ms</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
