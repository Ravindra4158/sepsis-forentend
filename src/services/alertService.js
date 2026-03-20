import api from './api'

const alertService = {
  getAll:        (params) => api.get('/alerts/', { params }),
  getById:       (id)     => api.get(`/alerts/${id}`),
  getByPatient:  (pid)    => api.get(`/alerts/patient/${pid}`),
  acknowledge:   (id, note = null) => api.patch(`/alerts/${id}/acknowledge`, { note }),
  resolve:       (id, note) => api.patch(`/alerts/${id}/resolve`, { note }),
  escalate:      (id)     => api.patch(`/alerts/${id}/escalate`),
  getStats:      ()       => api.get('/alerts/stats'),
}

export default alertService
