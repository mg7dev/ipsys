import api from './api'
import paginationHelper from '@/helpers/pagination'

export default {
  get(params = {}) {
    return api.$get(paginationHelper('/orders', params))
  },
  show(id) {
    return api.$get(`/orders/${id}`)
  },
  create(order) {
    return api.$post('/orders/customer', order)
  },
  update(id, order) {
    return api.$put(`/orders/customer/${id}`, order)
  },
  remove(id) {
    return api.$put(`/orders/${id}/save-status`, {
      status: 'void',
    })
  },
  cancel(id, reason = '') {
    return api.$put(`/orders/${id}/save-status`, {
      status: 'void',
      void_reason: reason,
    })
  },
  getPDF(id) {
    return api.$get(`/orders/${id}/pdf`)
  },
}
