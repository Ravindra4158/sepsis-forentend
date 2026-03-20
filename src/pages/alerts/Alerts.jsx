import React, { useEffect, useState } from 'react'
import { useAlerts } from '@/hooks/useAlerts'
import AlertList   from '@/components/alerts/AlertList'
import alertService from '@/services/alertService'

export default function Alerts() {
  const { alerts, loading, fetchAlerts, eventTick } = useAlerts()
  const [filter, setFilter] = useState('all')
  const [stats,  setStats]  = useState({})

  const loadAlertsPage = () => {
    fetchAlerts()
    alertService.getStats().then(setStats).catch(() => {})
  }

  useEffect(() => {
    loadAlertsPage()
  }, [])

  useEffect(() => {
    if (!eventTick) return
    loadAlertsPage()
  }, [eventTick])

  return (
    <div className="anim-fade">
      <div className="page-heading">
        <div>
          <h1 style={{ marginBottom: 4 }}>Alerts</h1>
          <p>Real-time sepsis notifications triaged by severity and status</p>
        </div>
        <button onClick={fetchAlerts} style={{
          padding: '10px 16px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600,
          background: 'rgba(255,255,255,0.72)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
          cursor: 'pointer', transition: 'var(--transition-fast)', fontFamily: 'var(--font-display)',
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
          onMouseOut={e  => e.currentTarget.style.borderColor = 'var(--border)'}
        >Refresh</button>
      </div>

      {Object.keys(stats).length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Active',       val: stats.active       || 0, color: '#ef4444' },
            { label: 'Acknowledged', val: stats.acknowledged || 0, color: '#f59e0b' },
            { label: 'Resolved',     val: stats.resolved     || 0, color: '#10b981' },
            { label: 'Total Today',  val: stats.total_today  || 0, color: 'var(--cyan)' },
          ].map(s => (
            <div key={s.label} className="clinical-surface" style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
      )}

      <AlertList alerts={alerts} loading={loading} filter={filter} onFilterChange={setFilter} />
    </div>
  )
}
