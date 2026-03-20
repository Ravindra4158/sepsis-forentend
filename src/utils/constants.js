export const RISK_LEVELS   = { CRITICAL:'CRITICAL', HIGH:'HIGH', MODERATE:'MODERATE', LOW:'LOW' }
export const RISK_COLORS   = { CRITICAL:'#ef4444', HIGH:'#f97316', MODERATE:'#f59e0b', LOW:'#10b981' }
export const RISK_BG       = { CRITICAL:'rgba(239,68,68,0.10)', HIGH:'rgba(249,115,22,0.10)', MODERATE:'rgba(245,158,11,0.10)', LOW:'rgba(16,185,129,0.10)' }
export const RISK_BORDER   = { CRITICAL:'rgba(239,68,68,0.30)', HIGH:'rgba(249,115,22,0.30)', MODERATE:'rgba(245,158,11,0.30)', LOW:'rgba(16,185,129,0.30)' }

export const NORMAL_RANGES = {
  heartRate:       { min:60,   max:100,  unit:'bpm',      label:'Heart Rate' },
  systolicBP:      { min:90,   max:140,  unit:'mmHg',     label:'Systolic BP' },
  diastolicBP:     { min:60,   max:90,   unit:'mmHg',     label:'Diastolic BP' },
  temperature:     { min:36.1, max:37.5, unit:'°C',       label:'Temperature' },
  respiratoryRate: { min:12,   max:20,   unit:'/min',     label:'Resp. Rate' },
  spo2:            { min:95,   max:100,  unit:'%',        label:'SpO₂' },
  wbc:             { min:4.5,  max:11.0, unit:'×10³/µL',  label:'WBC' },
  lactate:         { min:0.5,  max:2.0,  unit:'mmol/L',   label:'Lactate' },
  creatinine:      { min:0.6,  max:1.2,  unit:'mg/dL',    label:'Creatinine' },
}

export const ALERT_STATUSES = { ACTIVE:'active', ACKNOWLEDGED:'acknowledged', RESOLVED:'resolved', ESCALATED:'escalated' }
export const WARDS = ['ICU-A','ICU-B','ICU-C','ICU-D','CCU','PICU','NICU']
export const GENDER_OPTIONS = [{ value:'M', label:'Male' },{ value:'F', label:'Female' },{ value:'O', label:'Other' }]
export const PAGE_SIZE = 20
