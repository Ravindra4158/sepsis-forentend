import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { useAlerts } from '@/hooks/useAlerts'
import { PERMISSIONS } from '@/utils/rbac'
import patientService from '@/services/patientService'
import RiskSummaryCards from '@/components/dashboard/RiskSummaryCards'
import RecentAlerts from '@/components/dashboard/RecentAlerts'
import ICUStatus from '@/components/dashboard/ICUStatus'
import PatientCard from '@/components/patient/PatientCard'
import PatientSearch from '@/components/patient/PatientSearch'
import Button from '@/components/common/Button'
import StatusBadge from '@/components/common/StatusBadge'
import Loader from '@/components/common/Loader'

export default function NurseDashboard() {
  const { user, can } = useAuth()
  const { patients, fetchPatients, loading } = usePatients()
  const { alerts, criticalAlerts, eventTick } = useAlerts()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [sLoading, setSLoading] = useState(true)

  const loadDashboard = () => {
    fetchPatients({ limit: 12, sort: 'risk_score', order: 'desc' })
    patientService.getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setSLoading(false))
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    if (!eventTick) return
    loadDashboard()
  }, [eventTick])

  const urgentPatients = patients.filter((p) => ['CRITICAL', 'HIGH'].includes(p.risk_level || p.riskLevel))

  return (
    <div className="anim-fade">
      <div className="page-heading">
        <div>
          <h1 style={{ marginBottom: 4 }}>Nurse Shift View</h1>
          <p>Welcome, {user?.name?.split(' ')[0]} · {user?.ward || 'All Wards'} coverage with alert-first workflows.</p>
        </div>
        <PatientSearch style={{ width: 280 }} placeholder="Search patients..." />
      </div>

      <div style={{ marginBottom: 24 }}>
        <RiskSummaryCards
          counts={{
            CRITICAL: stats.critical || 0,
            HIGH: stats.high || 0,
            MODERATE: stats.moderate || 0,
            LOW: stats.low || 0,
          }}
          total={stats.total || 0}
          loading={sLoading}
        />
      </div>

      {criticalAlerts.length > 0 && (
        <div className="pulse-red" style={{
          background: 'var(--red-bg)', border: '1px solid var(--red-border)',
          borderRadius: 'var(--radius-md)', padding: '14px 18px',
          marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--red)' }}>Critical</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', marginBottom: 2 }}>
              {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} — Immediate action required
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {criticalAlerts.map((a) => a.patient_name || a.patientName).join(', ')}
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={() => navigate('/alerts')}>
            View Alerts
          </Button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14 }}>Patients Requiring Attention</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>All patients</Button>
          </div>
          {loading && <Loader />}
          {!loading && urgentPatients.length === 0 && (
            <div className="clinical-surface" style={{ padding: '36px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 28, marginBottom: 8, color: 'var(--green)' }}>Stable</div>
              <div>All patients are currently stable</div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
            {urgentPatients.map((p) => <PatientCard key={p.id} patient={p} />)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RecentAlerts alerts={alerts} loading={loading} />
          <ICUStatus patients={patients} loading={loading} />
        </div>
      </div>

      {can(PERMISSIONS.UPDATE_VITALS) && patients.length > 0 && (
        <div className="clinical-surface" style={{ padding: '18px 20px' }}>
          <h3 style={{ fontSize: 14, marginBottom: 14 }}>Quick Vitals Entry</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {patients.slice(0, 8).map((p) => {
              const risk = p.risk_level || p.riskLevel || 'LOW'
              const name = p.name || `${p.first_name} ${p.last_name}`
              return (
                <button
                  key={p.id}
                  onClick={() => navigate(`/vitals/add/${p.id}`)}
                  style={{
                    padding: '7px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                    background: 'rgba(255,255,255,0.62)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', transition: 'var(--transition-fast)',
                    fontFamily: 'var(--font-display)',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <StatusBadge status={risk} size="xs" />
                  {name.split(' ')[0]} {name.split(' ').slice(-1)}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
