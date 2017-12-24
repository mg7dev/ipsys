import api from './api'

export default {
  sendForgotPasswordCode(data) {
    return api.$post('/forgot-password', data)
  },
  verifyForgotPasswordCode(data) {
    return api.$post('/verify-forgot-password-code', data)
  },
  resetPassword(data) {
    return api.$post('/reset-password', data)
  },
  getCustomers() {
    return api.$get('/users/current/customers')
  },
  getProductGroups() {
    return api.$get('/companies/current/groups')
  },
  create(user) {
    return api.$post('/users', user)
  },
  createCustomerUser(customer_id, user) {
    return api.$post(`/customers/${customer_id}/create-and-add-user`, user)
  },
  update(id, user) {
    return api.$put(`/users/${id}`, user)
  },
  show(id) {
    return api.$get(`/users/${id}`)
  },
  delete(id) {
    return api.$delete(`/users/${id}`)
  },
}
