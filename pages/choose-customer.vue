<template>
  <div class="choose-customer">
    <b-row
      class="mt-3"
      align-h="center"
      align-v="center"
      style="min-height: 50vh"
    >
      <b-col cols="12" md="6" lg="5">
        <b-card class="shadow">
          <p class="lead text-center mb-2 font-weight-bold">
            {{ $t('choose-account') }}
          </p>
          <b-alert class="my-3" :show="error ? true : false" variant="danger">{{
            $t(error)
          }}</b-alert>
          <p class="small text-muted text-center mb-3">
            {{ $t('choose-account-description') }}
          </p>

          <button
            class="account"
            v-for="(customer, i) in customers"
            :key="i"
            @click="selectCustomer(customer.customer)"
          >
            <span>{{ customer.customer.name }}</span>
            <b-icon
              v-show="currentCustomerId === customer.customer.id"
              icon="check2"
            />
          </button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import UserService from '@/services/UserService'
import api from '@/services/api'

export default {
  name: 'ChooseCustomer',
  asyncData({ redirect, app }) {
    return UserService.getCustomers()
      .then((res) => {
        if (res.data.length === 1) {
          // Select customer by default
          app.store.commit('customer/SET_CUSTOMER', res.data[0].customer)
          redirect('/orders')
        }
        return { customers: res.data }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  data() {
    return {
      error: '',
      loading: true,
      customers: [],
    }
  },
  head() {
    return {
      title: this.$t('choose-account'),
      loading: true,
    }
  },
  mounted() {
    if(!this.customers.length) this.getCustomers()
  },
  methods: {
    async getCustomers() {
      this.loading = true
      try {
        const res = await UserService.getCustomers()
        this.customers = res.data

        if (res.data.length === 1) {
          // Select customer by default
          this.selectCustomer(res.data[0].customer)
        }
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    selectCustomer(customer) {
      this.currentCustomer = customer
      this.$router.push({
        name: 'orders',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.choose-customer {
  button.account {
    width: 100%;
    border: 0;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>