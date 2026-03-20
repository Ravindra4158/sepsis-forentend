import React, { useState } from 'react'
import Button  from '@/components/common/Button'
import { notify } from '@/components/common/NotificationToast'
import adminService from '@/services/adminService'
import Loader from '@/components/common/Loader'

const Section = ({ title, children }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 24px', marginBottom: 20 }}>
    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>{title}</h3>
    {children}
  </div>
)

const Row = ({ label, sub, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
    <div>{children}</div>
  </div>
)

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)} style={{
    width: 44, height: 24, borderRadius: 12, padding: 2, cursor: 'pointer',
    background: value ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
    border: 'none', transition: 'var(--transition)',
    display: 'flex', alignItems: 'center',
    justifyContent: value ? 'flex-end' : 'flex-start',
  }}>
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-sm)' }} />
  </button>
)

export default function Settings() {
  const [settings, setSettings] = useState(null)
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  React.useEffect(() => {
    Promise.all([adminService.getSettings(), adminService.getHealth()])
      .then(([settingsData, healthData]) => {
        setSettings({
          emailAlerts: settingsData.notifications?.emailAlerts ?? true,
          smsAlerts: settingsData.notifications?.smsAlerts ?? false,
          pagerAlerts: settingsData.notifications?.pagerAlerts ?? true,
          criticalThreshold: settingsData.model?.criticalThreshold ?? 65,
          highThreshold: settingsData.model?.highThreshold ?? 40,
          pollingInterval: settingsData.model?.pollingInterval ?? 5,
          dataRetentionDays: settingsData.operations?.dataRetentionDays ?? 365,
          autoEscalateMin: settingsData.notifications?.autoEscalateMin ?? 10,
          maintenanceMode: settingsData.operations?.maintenanceMode ?? false,
        })
        setHealth(healthData)
      })
      .catch((err) => notify.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await adminService.updateSettings({
        notifications: {
          emailAlerts: settings.emailAlerts,
          smsAlerts: settings.smsAlerts,
          pagerAlerts: settings.pagerAlerts,
          autoEscalateMin: settings.autoEscalateMin,
        },
        model: {
          criticalThreshold: settings.criticalThreshold,
          highThreshold: settings.highThreshold,
          pollingInterval: settings.pollingInterval,
        },
        operations: {
          dataRetentionDays: settings.dataRetentionDays,
          maintenanceMode: settings.maintenanceMode,
        },
      })
      notify.success('Settings saved successfully')
    } catch (err) {
      notify.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) return <Loader text="Loading system settings..." />

  return (
    <div className="anim-fade" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>System Settings</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Configure SepsisShield AI system parameters</p>
        </div>
        <Button variant="primary" onClick={handleSave} loading={saving}>Save Changes</Button>
      </div>

      <Section title="🔔 Alert Notifications">
        <Row label="Email Alerts" sub="Send critical alerts to physician email">
          <Toggle value={settings.emailAlerts} onChange={v => set('emailAlerts', v)} />
        </Row>
        <Row label="SMS Alerts" sub="Send SMS to on-call phone numbers">
          <Toggle value={settings.smsAlerts} onChange={v => set('smsAlerts', v)} />
        </Row>
        <Row label="Pager Integration" sub="Send to hospital paging system">
          <Toggle value={settings.pagerAlerts} onChange={v => set('pagerAlerts', v)} />
        </Row>
        <Row label="Auto-Escalation Window" sub="Minutes before unacknowledged alert escalates">
          <input type="number" value={settings.autoEscalateMin} min={5} max={60}
            onChange={e => set('autoEscalateMin', +e.target.value)}
            style={{ width: 80, textAlign: 'center' }} />
        </Row>
      </Section>

      <Section title="🤖 AI Model Thresholds">
        {[
          { label: 'Critical Risk Threshold', key: 'criticalThreshold', sub: 'Score ≥ this triggers CRITICAL alert', min: 50, max: 95 },
          { label: 'High Risk Threshold',     key: 'highThreshold',     sub: 'Score ≥ this triggers HIGH alert',     min: 20, max: 64 },
        ].map(({ label, key, sub, min, max }) => (
          <Row key={key} label={label} sub={sub}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="range" min={min} max={max} value={settings[key]}
                onChange={e => set(key, +e.target.value)}
                style={{ width: 120, accentColor: 'var(--cyan)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--cyan)', minWidth: 32 }}>
                {settings[key]}
              </span>
            </div>
          </Row>
        ))}
        <Row label="Vitals Polling Interval" sub="How often AI re-evaluates patient risk (seconds)">
          <input type="number" value={settings.pollingInterval} min={3} max={60}
            onChange={e => set('pollingInterval', +e.target.value)}
            style={{ width: 80, textAlign: 'center' }} />
        </Row>
      </Section>

      <Section title="🗄 Data & Compliance">
        <Row label="Data Retention Period" sub="Days to retain raw vital sign readings">
          <input type="number" value={settings.dataRetentionDays} min={90} max={3650}
            onChange={e => set('dataRetentionDays', +e.target.value)}
            style={{ width: 90, textAlign: 'center' }} />
        </Row>
        <Row label="HIPAA Audit Logging" sub="All PHI access is timestamped and logged">
          <Toggle value={true} onChange={() => notify.info('Audit logging cannot be disabled — HIPAA requirement')} />
        </Row>
        <Row label="Maintenance Mode" sub="Disables new alerts — use during system updates">
          <Toggle value={settings.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
        </Row>
      </Section>

      <Section title="ℹ System Information">
        {[
          { label: 'System Version',    val: 'SepsisShield AI v1.0.0' },
          { label: 'AI Model Version',  val: health?.model?.model_version || 'rule-based' },
          { label: 'Model Provider',    val: health?.model?.provider || 'auto' },
          { label: 'Database Mode',     val: health?.database?.mode || 'in_memory' },
        ].map(item => (
          <Row key={item.label} label={item.label}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{item.val}</span>
          </Row>
        ))}
      </Section>
    </div>
  )
}
