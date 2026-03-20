import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

const parse = (d) => {
  if (!d) return null
  if (d instanceof Date) return isValid(d) ? d : null
  const p = parseISO(d)
  return isValid(p) ? p : null
}

export const formatDate      = (d, f='dd MMM yyyy')     => { const dt=parse(d); return dt ? format(dt,f) : '—' }
export const formatDateTime  = (d)                       => { const dt=parse(d); return dt ? format(dt,'dd MMM yyyy, HH:mm') : '—' }
export const formatTime      = (d)                       => { const dt=parse(d); return dt ? format(dt,'HH:mm:ss') : '—' }
export const formatTimeShort = (d)                       => { const dt=parse(d); return dt ? format(dt,'HH:mm') : '—' }
export const timeAgo         = (d)                       => { const dt=parse(d); return dt ? formatDistanceToNow(dt,{addSuffix:true}) : '—' }
export const formatAge       = (dob)                     => {
  const dt=parse(dob)
  if (!dt) return '—'
  return Math.floor((Date.now()-dt.getTime())/(365.25*24*60*60*1000))
}
