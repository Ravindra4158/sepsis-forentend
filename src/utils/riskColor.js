import { RISK_COLORS, RISK_BG, RISK_BORDER, NORMAL_RANGES } from './constants'

export const scoreToLevel = (s) => s>=65?'CRITICAL':s>=40?'HIGH':s>=20?'MODERATE':'LOW'

const resolve = (levelOrScore) =>
  typeof levelOrScore === 'number' ? scoreToLevel(levelOrScore) : levelOrScore

export const getRiskColor  = (v) => RISK_COLORS[resolve(v)]  || RISK_COLORS.LOW
export const getRiskBg     = (v) => RISK_BG[resolve(v)]      || RISK_BG.LOW
export const getRiskBorder = (v) => RISK_BORDER[resolve(v)]  || RISK_BORDER.LOW

export const isAbnormal = (key, value) => {
  const r = NORMAL_RANGES[key]
  if (!r) return false
  return value < r.min || value > r.max
}

export const vitalColor = (key, value) =>
  isAbnormal(key, value) ? '#f87171' : 'var(--text-secondary)'
