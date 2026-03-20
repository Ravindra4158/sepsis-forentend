import api from './api'

const patientService = {
  getAll:              (params)     => api.get('/patients/', { params }),
  getById:             (id)         => api.get(`/patients/${id}`),
  create:              (data)       => api.post('/patients/', data),
  update:              (id, data)   => api.put(`/patients/${id}`, data),
  delete:              (id)         => api.delete(`/patients/${id}`),
  search:              (q)          => api.get('/patients/search', { params:{ q } }),
  getPrediction:       (id)         => api.post(`/patients/${id}/predictions/`),
  getPredictionHistory:(id, params) => api.get(`/patients/${id}/predictions/`, { params }),
  getDashboardStats:   ()           => api.get('/patients/stats/dashboard'),
}

export default patientService
