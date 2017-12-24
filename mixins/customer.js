export default {
  computed: {
    currentCustomer: {
      get() {
        return this.$store.state.customer.currentCustomer
      },
      set(customer) {
        this.$store.commit('customer/SET_CUSTOMER', customer)
      },
    },
    currentCustomerId() {
      return this.currentCustomer.id
    },
  },
}
