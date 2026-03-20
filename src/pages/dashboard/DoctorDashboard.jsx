import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePatients } from '@/hooks/usePatients'
import { PERMISSIONS } from '@/utils/rbac'
import patientService from '@/services/patientService'
import RiskSummaryCards from '@/components/dashboard/RiskSummaryCards'
import PatientStats from '@/components/dashboard/PatientStats'
import RecentAlerts from '@/components/dashboard/RecentAlerts'
import ICUStatus from '@/components/dashboard/ICUStatus'
import SepsisRiskChart from '@/components/charts/SepsisRiskChart'
import PatientCard from '@/components/patient/PatientCard'
import PatientSearch from '@/components/patient/PatientSearch'
import Button from '@/components/common/Button'
import Loader from '@/components/common/Loader'
import { useAlerts } from '@/hooks/useAlerts'

export default function DoctorDashboard() {
  const { user, can } = useAuth()
  const { patients, fetchPatients, loading: pLoading } = usePatients()
  const { eventTick } = useAlerts()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [sLoading, setSLoading] = useState(true)
  const [trend, setTrend] = useState([])

  const loadDashboard = () => {
    fetchPatients({ limit: 8, sort: 'risk_score', order: 'desc' })
    patientService.getDashboardStats()
      .then((d) => { setStats(d); setTrend(d.risk_trend || []) })
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

  const criticalPatients = patients.filter((p) => (p.risk_level || p.riskLevel) === 'CRITICAL')
  const highPatients = patients.filter((p) => (p.risk_level || p.riskLevel) === 'HIGH')

  return (
    <div className="anim-fade">
      <div className="page-heading">
        <div>
          <h1 style={{ marginBottom: 4 }}>Doctor Command View</h1>
          <p>Welcome back, Dr. {user?.name?.split(' ').slice(-1)[0]} · active ICU monitoring and sepsis prioritization.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PatientSearch style={{ width: 260 }} />
          {can(PERMISSIONS.ADD_PATIENT) && (
            <Button variant="primary" size="sm" onClick={() => navigate('/patients/add')}>
              + Add Patient
            </Button>
          )}
        </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        <div className="clinical-surface" style={{ padding: '18px 22px' }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14 }}>ICU Risk Trend</h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Average AI risk score across monitored patients</p>
          </div>
          {sLoading ? <Loader /> : <SepsisRiskChart data={trend} height={180} showBands />}
        </div>
        <PatientStats stats={stats} loading={sLoading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <RecentAlerts limit={5} alertsPageRoute="/alerts" />
        <ICUStatus patients={patients} loading={sLoading} />
      </div>

      {criticalPatients.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, color: 'var(--red)' }}>Critical Patients</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>View all</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 14 }}>
            {criticalPatients.map((p) => <PatientCard key={p.id} patient={p} />)}
          </div>
        </div>
      )}

      {highPatients.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, color: 'var(--orange)' }}>High Risk Patients</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>View all</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 14 }}>
            {highPatients.map((p) => <PatientCard key={p.id} patient={p} />)}
          </div>
        </div>
      )}

      {pLoading && <Loader text="Loading patients..." />}
    </div>
  )
}
