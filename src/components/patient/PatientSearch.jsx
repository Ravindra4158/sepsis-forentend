import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import patientService from '@/services/patientService'
import { getRiskColor } from '@/utils/riskColor'

export default function PatientSearch({ onSelect }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInput = async (e) => {
    const q = e.target.value
    setQuery(q)
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const data = await patientService.search(q)
      setResults((data.items || data).slice(0, 8))
    } catch { setResults([]) }
    finally { setLoading(false) }
  }

  const handleSelect = (patient) => {
    if (onSelect) onSelect(patient)
    else navigate(`/patients/${patient.id}`)
    setQuery(''); setResults([])
  }

  return (
    <div style={{ position:'relative' }}>
      <input
        value={query} onChange={handleInput}
        placeholder="Search patients by name or ID…"
        style={{ paddingLeft:36 }}
      />
      {results.length > 0 && (
        <div style={{
          position:'absolute', top:42, left:0, right:0, zIndex:300,
          background:'var(--bg-card)', border:'1px solid var(--border-strong)',
          borderRadius:'var(--radius-md)', overflow:'hidden', boxShadow:'var(--shadow-md)',
        }}>
          {results.map(p => (
            <button key={p.id} onMouseDown={() => handleSelect(p)} style={{
              width:'100%', padding:'10px 14px', display:'flex', alignItems:'center', gap:10,
              background:'transparent', cursor:'pointer', borderBottom:'1px solid var(--border)',
              transition:'var(--transition-fast)', textAlign:'left',
            }}
              onMouseOver={e => e.currentTarget.style.background='var(--bg-card-hover)'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}
            >
              <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, background:getRiskColor(p.risk_level), boxShadow:`0 0 4px ${getRiskColor(p.risk_level)}` }} />
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unnamed patient'}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)' }}>{p.patient_id || p.mrn || p.id} · {[p.ward, p.bed || (p.bed_number != null ? `Bed ${p.bed_number}` : null)].filter(Boolean).join(' · ')}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
