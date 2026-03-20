export const required   = (v) => (v!==undefined&&v!==null&&v!=='') ? null : 'This field is required'
export const email      = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email address'
export const minLength  = (n) => (v) => v&&v.length>=n ? null : `Minimum ${n} characters`
export const maxLength  = (n) => (v) => !v||v.length<=n ? null : `Maximum ${n} characters`
export const numeric    = (v) => !isNaN(parseFloat(v))&&isFinite(v) ? null : 'Must be a number'
export const inRange    = (min,max) => (v) => { const n=parseFloat(v); return n>=min&&n<=max?null:`Must be between ${min} and ${max}` }
export const positive   = (v) => parseFloat(v)>0 ? null : 'Must be positive'
export const passwordStrength = (v) => {
  if (!v||v.length<8) return 'At least 8 characters'
  if (!/[A-Z]/.test(v)) return 'Include one uppercase letter'
  if (!/[0-9]/.test(v)) return 'Include one number'
  return null
}
export const validate = (value, fns=[]) => { for (const f of fns){ const e=f(value); if(e) return e } return null }
