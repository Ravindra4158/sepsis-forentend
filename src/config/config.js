const config = {
  apiUrl:  import.meta.env.VITE_API_URL  || 'http://localhost:8000/api/v1',
  wsUrl:   import.meta.env.VITE_WS_URL   || 'ws://localhost:8000/ws',
  appName: import.meta.env.VITE_APP_NAME || 'SepsisShield AI',
  env:     import.meta.env.VITE_ENV      || 'development',
  vitalsPollingInterval: 5000,
  riskThresholds: { critical:65, high:40, moderate:20 },
  pageSize: 20,
  alertSLA: { CRITICAL:5, HIGH:15, MODERATE:60 },
}
export default config
