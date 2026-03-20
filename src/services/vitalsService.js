import api from './api'

const vitalsService = {
  getLatest:  (patientId)         => api.get(`/patients/${patientId}/vitals/latest`),
  getHistory: (patientId, params) => api.get(`/patients/${patientId}/vitals/history`, { params }),
  create:     (patientId, data)   => api.post(`/patients/${patientId}/vitals/`, data),
}

export default vitalsService
