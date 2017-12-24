export const state = () => ({
  currentCustomerId: null,
  currentCustomer: {},
})

export const mutations = {
  SET_CUSTOMER(state, customer) {
    state.currentCustomer = customer
    state.currentCustomerId = customer.id
  },
  REMOVE_CUSTOMER(state) {
    state.currentCustomer = null
    state.currentCustomerId = {}
  },
}
