<template>
  <div class="profile">
    <Loader v-if="loading" />
    <b-row align-h="center" v-else>
      <b-col cols="12" md="8" lg="7">
        <b-card :title="$t('profile')" class="mt-3 mt-md-5 shadow">
          <form @submit.prevent="update" class="w-100">
            <label>{{ $t('name') }}</label>
            <b-input
              type="text"
              :placeholder="$t('name')"
              v-model="name"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('email') }}</label>
            <b-input
              type="email"
              :placeholder="$t('email')"
              v-model="email"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('zip') }}</label>
            <vue-bootstrap-typeahead
              ref="typeahead"
              :placeholder="$t('zip')"
              v-model="zipCode"
              @hit="zip = $event.value"
              required
              :data="postalCodesDropdown"
              :serializer="(o) => o.text"
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('city') }}</label>
            <b-input
              type="text"
              readonly
              :placeholder="$t('city')"
              :value="city"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('contact-person') }}</label>
            <b-input
              type="text"
              :placeholder="$t('contact-person')"
              v-model="contactPerson"
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('contact-phone') }}</label>
            <b-input
              type="text"
              :placeholder="$t('contact-phone')"
              v-model="contactPhone"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('address-1') }}</label>
            <b-input
              type="text"
              :placeholder="$t('address-1')"
              v-model="address_1"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('address-2') }}</label>
            <b-input
              type="text"
              :placeholder="$t('address-2')"
              v-model="address_2"
              class="mb-4"
              :disabled="loadingUpdate"
            />

            <b-button
              size="sm"
              class="mt-3"
              type="submit"
              variant="primary"
              :disabled="loadingUpdate"
              squared
              >{{ $t('save-changes') }}</b-button
            >
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/services/api'
import _ from 'lodash'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'

export default {
  name: 'Profile',
  middleware: 'authenticated',
  components: {
    VueBootstrapTypeahead,
  },
  head() {
    return {
      title: this.$t('profile'),
    }
  },
  data() {
    return {
      name: '',
      email: '',
      zip: '',
      contactPerson: '',
      contactPhone: '',
      address_1: '',
      address_2: '',
      postalCodes: [],
      loading: true,
      zipCode: '',
      loadingUpdate: false,
    }
  },
  async mounted() {
    await this.getPostalCodes()

    // Populate fields
    const customer = this.currentCustomer
    this.name = customer.name
    this.email = customer.email
    this.zip = customer.postal_code_id
    this.contactPerson = customer.contact_person
    this.contactPhone = customer.contact_phone
    this.address_1 = customer.address_1
    this.address_2 = customer.address_2

    const postalCode = _.find(this.postalCodes, (o) => o.id === this.zip)

    if (postalCode) {
      if (this.$refs.typeahead)
        this.$refs.typeahead.inputValue = postalCode.code
      this.zipCode = postalCode.code
    }
  },
  computed: {
    city() {
      if (this.zip) {
        const postalCode = _.find(this.postalCodes, (o) => o.id === this.zip)

        if (postalCode) {
          return postalCode.city.name
        }
      }

      return ''
    },
    postalCodesDropdown() {
      return this.postalCodes.map((p) => ({
        text: p.code,
        value: p.id,
      }))
    },
  },
  methods: {
    async update() {
      const {
        name,
        email,
        zip,
        contactPerson,
        contactPhone,
        address_1,
        address_2,
      } = this
      this.loadingUpdate = true
      try {
        const res = await api.$put(
          `/customers/${this.currentCustomerId}/update-customer`,
          {
            name,
            email,
            zip,
            contactPerson,
            contactPhone,
            address_1,
            address_2,
          }
        )

        this.$store.commit('customer/SET_CUSTOMER', res.data)
      } catch (err) {
        console.error(err)
      }
      this.loadingUpdate = false
    },
    async getPostalCodes() {
      this.loading = true
      try {
        const res = await api.$get('/postal-codes')
        this.postalCodes = res.data
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
  },
}
</script>

<style lang="scss">
.field {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>