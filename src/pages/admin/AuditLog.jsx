import React, { useEffect, useState } from 'react'
import adminService from '@/services/adminService'
import Loader from '@/components/common/Loader'
import Button from '@/components/common/Button'
import { notify } from '@/components/common/NotificationToast'
import { formatDateTime } from '@/utils/formatDate'

export default function AuditLog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(25)

  useEffect(() => {
    setLoading(true)
    adminService.getAuditLog({ limit })
      .then((data) => setEntries(data.items || []))
      .catch((err) => notify.error(err.message))
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) return <Loader text="Loading audit log..." />

  return (
    <div className="anim-fade">
      <div className="page-heading">
        <div>
          <h1 style={{ marginBottom: 4 }}>Audit Log</h1>
          <p>Track admin and system events across users, settings, and authentication flows.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} style={{ minWidth: 120 }}>
            {[10, 25, 50, 100].map((value) => <option key={value} value={value}>Last {value}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      <div className="clinical-surface" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '180px 130px 150px 1fr 220px', gap: 12, fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          <span>TIMESTAMP</span>
          <span>ACTION</span>
          <span>ACTOR</span>
          <span>RESOURCE</span>
          <span>DETAILS</span>
        </div>
        {entries.length === 0 && (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>No audit entries available.</div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '180px 130px 150px 1fr 220px', gap: 12, alignItems: 'start' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDateTime(entry.timestamp)}</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{entry.action || 'event'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              <div>{entry.actor_name || 'System'}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 3, textTransform: 'capitalize' }}>{entry.actor_role || 'system'}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{entry.resource || 'system'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', overflowWrap: 'anywhere' }}>
              {entry.details && Object.keys(entry.details).length > 0 ? JSON.stringify(entry.details) : 'No additional details'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
