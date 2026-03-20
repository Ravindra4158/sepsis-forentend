import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PERMISSIONS } from '@/utils/rbac'
import HeartRateChart from '@/components/charts/HeartRateChart'
import TemperatureChart from '@/components/charts/TemperatureChart'
import RespirationChart from '@/components/charts/RespirationChart'
import BloodPressureChart from '@/components/charts/BloodPressureChart'
import { isAbnormal } from '@/utils/riskColor'
import { NORMAL_RANGES } from '@/utils/constants'

function VitalRow({ label, value, unit, rangeKey }) {
  const range = NORMAL_RANGES[rangeKey] || {}
  const abnormal = isAbnormal(rangeKey, value)
  const color = abnormal ? '#f87171' : 'var(--text-primary)'
  const pct = range.min && range.max
    ? Math.min(100, Math.max(0, ((value - range.min*0.7) / (range.max*1.3 - range.min*0.7)) * 100))
    : 50

  return (
    <div style={{
      padding:'11px 14px',
      background: abnormal ? 'rgba(239,68,68,0.06)' : 'transparent',
      border:`1px solid ${abnormal ? 'rgba(239,68,68,0.22)' : 'var(--border)'}`,
      borderRadius:'var(--radius-sm)', marginBottom:8,
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
        <span style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.07em' }}>{label}</span>
        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:18, fontWeight:600, color }}>{typeof value === 'number' ? (value<10?value.toFixed(1):Math.round(value)) : '—'}</span>
          <span style={{ fontSize:10, color:'var(--text-muted)' }}>{unit}</span>
          {abnormal && <span style={{ fontSize:9, color:'#f87171', fontWeight:700 }}>⚠</span>}
        </div>
      </div>
      <div style={{ height:4, background:'rgba(255,255,255,0.05)', borderRadius:2, position:'relative' }}>
        {range.min && <div style={{ position:'absolute', height:'100%', background:'rgba(16,185,129,0.2)', borderRadius:2, left:`${((range.min-range.min*0.7)/(range.max*1.3-range.min*0.7))*100}%`, width:`${((range.max-range.min)/(range.max*1.3-range.min*0.7))*100}%` }} />}
        <div style={{ position:'absolute', width:8, height:8, borderRadius:'50%', top:-2, left:`calc(${pct}% - 4px)`, background: abnormal ? '#f87171' : '#10b981', boxShadow:`0 0 5px ${abnormal?'#f87171':'#10b981'}`, transition:'left 0.5s ease' }} />
      </div>
      {range.min && <div style={{ fontSize:9, color:'var(--text-muted)', marginTop:4, display:'flex', justifyContent:'space-between' }}>
        <span>Normal: {range.min}–{range.max} {unit}</span>
        {abnormal && <span style={{ color:'#f87171' }}>OUT OF RANGE</span>}
      </div>}
    </div>
  )
}

export default function PatientVitals({ vitals = {}, labs = {}, history = [] }) {
  const { can } = useAuth()
  if (!can(PERMISSIONS.VIEW_VITALS)) return (
    <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>
      You do not have permission to view vitals.
    </div>
  )

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
      {/* Vitals column */}
      <div>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:12 }}>CURRENT VITALS</div>
        {[
          { label:'Heart Rate',        value:vitals.heart_rate,       unit:'bpm',   rangeKey:'heartRate' },
          { label:'Systolic BP',       value:vitals.systolic_bp,      unit:'mmHg',  rangeKey:'systolicBP' },
          { label:'Diastolic BP',      value:vitals.diastolic_bp,     unit:'mmHg',  rangeKey:'diastolicBP' },
          { label:'Temperature',       value:vitals.temperature,      unit:'°C',    rangeKey:'temperature' },
          { label:'Respiratory Rate',  value:vitals.respiratory_rate, unit:'/min',  rangeKey:'respiratoryRate' },
          { label:'SpO₂',              value:vitals.spo2,             unit:'%',     rangeKey:'spo2' },
        ].map(vt => <VitalRow key={vt.label} {...vt} />)}

        {/* Labs */}
        {Object.keys(labs).length > 0 && <>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', margin:'16px 0 10px' }}>LAB VALUES</div>
          {[
            { label:'WBC',        value:labs.wbc,        unit:'×10³/µL', rangeKey:'wbc' },
            { label:'Lactate',    value:labs.lactate,    unit:'mmol/L',  rangeKey:'lactate' },
            { label:'Creatinine', value:labs.creatinine, unit:'mg/dL',   rangeKey:'creatinine' },
          ].map(lb => <VitalRow key={lb.label} {...lb} />)}
        </>}
      </div>

      {/* Charts column */}
      <div>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--text-muted)', letterSpacing:'0.1em', marginBottom:12 }}>TREND CHARTS</div>
        {[
          { Component: HeartRateChart,    title:'Heart Rate' },
          { Component: TemperatureChart,  title:'Temperature' },
          { Component: RespirationChart,  title:'Respiration' },
          { Component: BloodPressureChart,title:'Blood Pressure' },
        ].map(({ Component, title }) => (
          <div key={title} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 16px', marginBottom:12 }}>
            <Component data={history} height={80} />
          </div>
        ))}
      </div>
    </div>
  )
}
