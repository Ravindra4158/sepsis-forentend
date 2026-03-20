import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useVitals } from '@/hooks/useVitals'
import { PERMISSIONS, ROLES } from '@/utils/rbac'
import patientService from '@/services/patientService'
import alertService   from '@/services/alertService'
import PatientVitals  from '@/components/patient/PatientVitals'
import SepsisRiskChart from '@/components/charts/SepsisRiskChart'
import AlertCard      from '@/components/alerts/AlertCard'
import StatusBadge    from '@/components/common/StatusBadge'
import Button         from '@/components/common/Button'
import Loader         from '@/components/common/Loader'
import { getRiskColor, getRiskBg, getRiskBorder } from '@/utils/riskColor'
import { formatAge, formatDate, formatTimeShort, timeAgo } from '@/utils/formatDate'
import { notify } from '@/components/common/NotificationToast'

export default function PatientDetails() {
  const { id } = useParams()
  const { can } = useAuth()
  const navigate = useNavigate()
  const { vitals, history, labs, loading: vLoading } = useVitals(id, { poll: true })
  const [patient,    setPatient]    = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [predictionHistory, setPredictionHistory] = useState([])
  const [patAlerts,  setPatAlerts]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeTab,  setActiveTab]  = useState('vitals')

  const backRoute = '/patients'
  const vitalsRoute = `/vitals/add/${id}`
  const canViewRisk = can(PERMISSIONS.VIEW_RISK_SCORE)
  const canViewAlerts = can(PERMISSIONS.VIEW_ALERTS)
  const canUpdateVitals = can(PERMISSIONS.UPDATE_VITALS)
  const canUpdatePatient = can(PERMISSIONS.UPDATE_PATIENT)

  useEffect(() => {
    let active = true
    setLoading(true)

    patientService.getById(id)
      .then((p) => {
        if (!active) return
        const normalized = {
          ...p,
          full_name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          patient_id: p.patient_id || p.mrn,
          medical_record_number: p.medical_record_number || p.mrn,
          bed: p.bed || (p.bed_number != null ? `Bed ${p.bed_number}` : '—'),
          age: p.age ?? (p.date_of_birth ? formatAge(p.date_of_birth) : null),
          admission_date: p.admission_date || p.admitted_at,
        }
        setPatient(normalized)
      })
      .catch((err) => {
        if (!active) return
        notify.error(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    if (canViewRisk) {
      patientService.getPredictionHistory(id, { limit: 24 })
        .then((data) => {
          if (!active) return
          const items = data.items || data
          const list = Array.isArray(items) ? items : (items ? [items] : [])
          setPrediction(list[0] || null)
          setPredictionHistory(
            [...list]
              .reverse()
              .map((entry) => ({
                ...entry,
                time: formatTimeShort(entry.predicted_at),
              }))
          )
        })
        .catch(() => {
          if (active) setPrediction(null)
          if (active) setPredictionHistory([])
        })
    }

    if (canViewAlerts) {
      alertService.getByPatient(id)
        .then((alerts) => {
          if (!active) return
          setPatAlerts(alerts.items || alerts || [])
        })
        .catch(() => {
          if (active) setPatAlerts([])
        })
    }

    return () => {
      active = false
    }
  }, [id, canViewRisk, canViewAlerts])

  if (loading) return <Loader text="Loading patient record…" />
  if (!patient) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠</div>
      <h2>Patient not found</h2>
      <Button variant="ghost" style={{ marginTop: 16 }} onClick={() => navigate(backRoute)}>← Back</Button>
    </div>
  )

  const risk   = prediction?.risk_level || patient.risk_level || 'LOW'
  const score  = prediction?.risk_score || patient.risk_score  || 0
  const color  = getRiskColor(risk)
  const bg     = getRiskBg(risk)
  const border = getRiskBorder(risk)
  const name   = patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()
  const isCrit = risk === 'CRITICAL'

  // Gauge
  const sz = 120, r2 = (sz-12)/2, circ = 2*Math.PI*r2, offset = circ - (score/100)*circ

  const TABS = [
    { key: 'vitals',    label: 'Vitals & Labs' },
    { key: 'risk',      label: 'AI Risk Analysis', hidden: !canViewRisk },
    { key: 'alerts',    label: `Alerts (${patAlerts.length})`, hidden: !canViewAlerts },
    { key: 'info',      label: 'Patient Info' },
  ].filter(t => !t.hidden)

  return (
    <div className="anim-fade">
      {/* Back */}
      <button onClick={() => navigate(backRoute)} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', transition: 'var(--transition-fast)' }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseOut={e  => e.currentTarget.style.color = 'var(--text-muted)'}>
        ← Back to Patients
      </button>

      {/* Patient header */}
      <div className={isCrit ? 'pulse-red' : ''} style={{
        background: 'var(--bg-card)', border: `1px solid ${isCrit ? border : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 22,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${color},${color}33)` }} />

        <div style={{ display: 'grid', gridTemplateColumns: canViewRisk ? '200px minmax(0, 1fr)' : '1fr', gap: 24, alignItems: 'stretch' }}>
          {/* Gauge */}
          {canViewRisk && (
            <div style={{
              flexShrink: 0,
              textAlign: 'center',
              background: `${color}10`,
              border: `1px solid ${color}25`,
              borderRadius: '24px',
              padding: '18px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 190,
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: 10 }}>CURRENT RISK</div>
              <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
                <circle cx={sz/2} cy={sz/2} r={r2} fill="none" stroke="rgba(24,50,56,0.10)" strokeWidth="8" />
                <circle cx={sz/2} cy={sz/2} r={r2} fill="none" stroke={color} strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                  transform={`rotate(-90 ${sz/2} ${sz/2})`}
                  style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
                <text x={sz/2} y={sz/2-4} textAnchor="middle" dominantBaseline="middle"
                  fill={color} fontSize="26" fontWeight="800" fontFamily="var(--font-mono)">{score}</text>
                <text x={sz/2} y={sz/2+18} textAnchor="middle" fill="var(--text-muted)" fontSize="10">/ 100</text>
              </svg>
              <div style={{ marginTop: 10 }}>
                <StatusBadge status={risk} dot={isCrit} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
                {risk === 'LOW' ? 'Stable profile' : risk === 'MODERATE' ? 'Watch closely' : risk === 'HIGH' ? 'Escalated monitoring' : 'Immediate intervention'}
              </div>
            </div>
          )}

          {/* Info */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: 8 }}>PATIENT SUMMARY</div>
                <h1 style={{ fontSize: 26, marginBottom: 8 }}>{name}</h1>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>
                  {[patient.age ? `${patient.age}y` : null, patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : patient.gender, patient.ward, patient.bed].filter(Boolean).join(' · ')}
                  &nbsp;·&nbsp;<span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{patient.patient_id || patient.medical_record_number}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.62)', border: '1px solid var(--border)', borderRadius: '18px', padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>DIAGNOSIS</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{patient.primary_diagnosis || patient.diagnosis || 'Not entered'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.62)', border: '1px solid var(--border)', borderRadius: '18px', padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>ADMITTED</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(patient.admission_date || patient.admitted_at)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{timeAgo(patient.admission_date || patient.admitted_at)}</div>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {canUpdateVitals && (
                  <Button variant="success" size="sm" onClick={() => navigate(vitalsRoute)}>+ Add Vitals</Button>
                )}
                {canUpdatePatient && (
                  <Button variant="secondary" size="sm" onClick={() => {}}>Edit</Button>
                )}
              </div>
            </div>

            {/* Risk flags */}
            {canViewRisk && prediction?.top_features?.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 7 }}>AI-DETECTED RISK FACTORS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {prediction.top_features.map((feature) => (
                    <span key={feature.name} style={{
                      padding: '3px 10px', borderRadius: 'var(--radius-xs)', fontSize: 11, fontWeight: 600,
                      background: bg, color, border: `1px solid ${border}`,
                    }}>⚠ {feature.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 20px', fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400,
            color: activeTab === tab.key ? 'var(--cyan)' : 'var(--text-muted)',
            borderBottom: `2px solid ${activeTab === tab.key ? 'var(--cyan)' : 'transparent'}`,
            marginBottom: -1, cursor: 'pointer', transition: 'var(--transition-fast)',
            fontFamily: 'var(--font-display)',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'vitals' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 24px' }}>
          {vLoading ? <Loader /> : <PatientVitals vitals={vitals || {}} labs={labs || {}} history={history || []} />}
        </div>
      )}

      {activeTab === 'risk' && canViewRisk && (
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', marginBottom: 16 }}>
            <SepsisRiskChart data={predictionHistory} height={180} showBands />
          </div>
          {prediction && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {[
                  { label: 'LSTM Probability',     val: `${((prediction.lstm_probability||0)*100).toFixed(1)}%` },
                  { label: 'XGBoost Probability',  val: `${((prediction.xgb_probability||0)*100).toFixed(1)}%` },
                  { label: 'Ensemble Probability', val: `${((prediction.ensemble_probability||0)*100).toFixed(1)}%` },
                  { label: 'SIRS Score',            val: `${prediction.sirs_score||0} / 4` },
                  { label: 'SOFA Score',            val: prediction.sofa_score || '—' },
                  { label: 'Model Version',         val: prediction.model_version || '—' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: 5 }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--cyan)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && canViewAlerts && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {patAlerts.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}><div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>No alerts for this patient</div>
            : patAlerts.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      {activeTab === 'info' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '22px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {[
              { label: 'Full Name',          val: name },
              { label: 'Medical Record No.', val: patient.patient_id || patient.medical_record_number },
              { label: 'Date of Birth',      val: formatDate(patient.date_of_birth) },
              { label: 'Gender',             val: patient.gender },
              { label: 'Ward',               val: patient.ward },
              { label: 'Bed',                val: patient.bed },
              { label: 'Attending Physician', val: patient.physician_name || '—' },
              { label: 'Admission Date',     val: formatDate(patient.admission_date || patient.admitted_at) },
              { label: 'Primary Diagnosis',  val: patient.primary_diagnosis || patient.diagnosis },
              { label: 'Comorbidities',      val: Array.isArray(patient.comorbidities) ? patient.comorbidities.join(', ') || '—' : (patient.comorbidities || '—') },
            ].map(item => (
              <div key={item.label} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
