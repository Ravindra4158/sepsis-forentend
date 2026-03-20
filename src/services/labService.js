import api from './api'

const labService = {
  getByPatient: (patientId, limit = 50) => api.get(`/patients/${patientId}/labs/`, { params: { limit } }),
  create:       (patientId, data)        => api.post(`/patients/${patientId}/labs/`, data),
}

export default labService
