import apiClient from '../api/apiClient'

export const authService = {
  async signup(userData) {
    const user = { id: '1', name: userData.name || userData.email.split('@')[0], email: userData.email, role: 'user' }
    return { user, accessToken: 'mock-token', refreshToken: 'mock-refresh' }
  },

  async login(credentials) {
    const user = { id: '1', name: credentials.email.split('@')[0], email: credentials.email, role: 'user' }
    return { user, accessToken: 'mock-token', refreshToken: 'mock-refresh' }
  },

  async refreshToken(refreshToken) {
    return { accessToken: 'mock-token', refreshToken: 'mock-refresh' }
  },

  async forgotPassword(email) {
    return { message: 'Reset link sent' }
  },

  async resetPassword(token, password) {
    return { message: 'Password reset successful' }
  },

  async getProfile() {
    return { user: { id: '1', name: 'Demo User', email: 'demo@test.com' } }
  },

  async updateProfile(userData) {
    return { user: { id: '1', ...userData } }
  }
}