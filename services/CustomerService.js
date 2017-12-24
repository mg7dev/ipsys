import api from './api'

export default {
  getCredit(id) {
    return api.$get('/get-credit?customer=' + id)
  },
  getLocations(id) {
    return api.$get(`/customers/${id}/locations`)
  },
  getUsers(id) {
    return api.$get(`/customers/${id}/users`)
  },
  showLocation(customer, id) {
    return api.$get(`/customers/${customer}/locations/${id}`)
  },
  updateLocation(customer, id, location) {
    return api.$put(
      `/customers/${customer}/locations/${id}/update-customer`,
      location
    )
  },
  createLocation(customer, location) {
    return api.$post(
      `/customers/${customer}/locations/create-customer`,
      location
    )
  },
  deleteLocation(customer, id) {
    return api.$delete(
      `/customers/${customer}/locations/${id}/delete-customer`,
      location
    )
  },
}
