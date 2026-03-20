import api from './api'

const authService = {
  register:       (data)        => api.post('/auth/register', data),
  login:          (credentials) => api.post('/auth/login', credentials),
  logout:         ()            => api.post('/auth/logout'),
  getMe:          ()            => api.get('/auth/me'),
  refreshToken:   ()            => api.post('/auth/refresh'),
  forgotPassword: (email)       => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, pwd)  => api.post('/auth/reset-password', { token, new_password: pwd }),
}

export default authService
