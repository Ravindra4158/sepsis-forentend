import React from 'react'
import AlertCard from './AlertCard'
import Loader from '@/components/common/Loader'

export default function AlertList({ alerts=[], loading=false, onAcknowledge }) {
  if (loading) return <Loader />
  if (!alerts.length) return (
    <div style={{ textAlign:'center', padding:'56px 0' }}>
      <div style={{ fontSize:48, marginBottom:12 }}>✓</div>
      <div style={{ fontSize:15, fontWeight:600, color:'var(--text-secondary)' }}>No alerts found</div>
      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>All patients are within normal parameters</div>
    </div>
  )
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {alerts.map(a=><AlertCard key={a.id} alert={a} onAcknowledge={onAcknowledge}/>)}
    </div>
  )
}
