<template>
  <div class="add-location">
    <Loader v-if="loading" />
    <b-row align-h="center" v-else>
      <b-col cols="12" md="8" lg="7">
        <b-card :title="$t('add-location')" class="mt-3 mt-md-5 shadow">
          <form @submit.prevent="add" class="w-100">
            <label>{{ $t('name') }}</label>
            <b-input
              type="text"
              :placeholder="$t('name')"
              v-model="name"
              required
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('email') }}</label>
            <b-input
              type="email"
              :placeholder="$t('email')"
              v-model="email"
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('zip') }}</label>
            <vue-bootstrap-typeahead
              ref="typeahead"
              :placeholder="$t('zip')"
              v-model="zipCode"
              @hit="updateZip($event.value)"
              required
              :data="postalCodesDropdown"
              :serializer="(o) => o.text"
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('city') }}</label>
            <b-input
              type="text"
              readonly
              :placeholder="$t('city')"
              :value="city"
              required
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('contact-person') }}</label>
            <b-input
              type="text"
              :placeholder="$t('contact-person')"
              v-model="contact_name"
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('contact-phone') }}</label>
            <b-input
              type="text"
              :placeholder="$t('contact-phone')"
              v-model="contact_phone"
              required
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('address-1') }}</label>
            <b-input
              type="text"
              :placeholder="$t('address-1')"
              v-model="address_1"
              required
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('address-2') }}</label>
            <b-input
              type="text"
              :placeholder="$t('address-2')"
              v-model="address_2"
              class="mb-4"
              :disabled="loadingAdd"
            />

            <b-button
              size="sm"
              class="mt-3"
              type="submit"
              variant="primary"
              :disabled="loadingAdd"
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
import CustomerService from '~/services/CustomerService'

export default {
  name: 'EditLocation',
  middleware: 'authenticated',
  components: {
    VueBootstrapTypeahead,
  },
  props: {
    locationObject: {
      type: Object,
    },
  },
  head() {
    return {
      title: this.$t('add-location'),
    }
  },
  data() {
    return {
      name: '',
      email: '',
      zip: '',
      contact_name: '',
      contact_phone: '',
      address_1: '',
      address_2: '',
      postalCodes: [],
      loading: true,
      zipCode: '',
      loadingAdd: false,
      loadingDelete: false,
      location: {},
    }
  },
  async mounted() {
    this.getPostalCodes()
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
    updateZip(id) {
      this.zip = id
    },
    async add() {
      this.loadingAdd = true
      const {
        name,
        email,
        address_1,
        address_2,
        contact_name,
        contact_phone,
        zip,
      } = this
      try {
        const res = await CustomerService.createLocation(
          this.currentCustomerId,
          {
            name,
            email,
            address_1,
            address_2,
            contact_name,
            contact_phone,
            zip,
          }
        )

        this.$store.commit('customer/SET_CUSTOMER', {
          ...this.currentCustomer,
          locations: res.data,
        })
        this.$router.push({
          name: 'locations',
        })
      } catch (err) {
        console.error(err)
      }
      this.loadingAdd = false
    },
    async getPostalCodes() {
      this.loading = true
      try {
        const res = await api.$get('/postal-codes')
        this.postalCodes = res.data
        const id = this.zip
        this.zip = null
        this.zip = id
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
    async getLocation() {
      this.loading = true
      try {
        const res = await CustomerService.showLocation(
          this.currentCustomerId,
          this.$route.params.id
        )
        this.location = res.data
      } catch (err) {
        console.error(err)
      }
      this.loading = false
    },
  },
  watch: {
    zip(id) {
      if (id) {
        const postalCode = _.find(this.postalCodes, (o) => o.id === id)

        if (postalCode) {
          this.$refs.typeahead.inputValue = postalCode.code
          this.zipCode = postalCode.code
        }
      }
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