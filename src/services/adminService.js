import api from './api'

const adminService = {
  getStats:    ()         => api.get('/admin/stats'),
  getAuditLog: (params)   => api.get('/admin/audit-log', { params }),
  getSettings: ()         => api.get('/admin/settings'),
  updateSettings: (data)  => api.put('/admin/settings', data),
  getHealth:   ()         => api.get('/admin/health'),
}

export default adminService
