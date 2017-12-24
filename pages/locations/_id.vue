<template>
  <div class="edit-location">
    <Loader v-if="loading" />
    <b-row align-h="center" v-else>
      <b-col cols="12" md="8" lg="7">
        <b-card :title="$t('edit-location')" class="mt-3 mt-md-5 shadow">
          <form @submit.prevent="update" class="w-100">
            <label>{{ $t('name') }}</label>
            <b-input
              type="text"
              :placeholder="$t('name')"
              v-model="location.name"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('email') }}</label>
            <b-input
              type="email"
              :placeholder="$t('email')"
              v-model="location.email"
              class="mb-4"
              :disabled="loadingUpdate"
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
              v-model="location.contact_name"
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('contact-phone') }}</label>
            <b-input
              type="text"
              :placeholder="$t('contact-phone')"
              v-model="location.contact_phone"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('address-1') }}</label>
            <b-input
              type="text"
              :placeholder="$t('address-1')"
              v-model="location.address_1"
              required
              class="mb-4"
              :disabled="loadingUpdate"
            />
            <label>{{ $t('address-2') }}</label>
            <b-input
              type="text"
              :placeholder="$t('address-2')"
              v-model="location.address_2"
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
            <b-button
              size="sm"
              class="mt-3"
              type="button"
              variant="danger"
              :disabled="loadingDelete"
              squared
              @click="remove"
              >{{ $t('delete') }}</b-button
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
import CustomerService from '@/services/CustomerService'

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
      title: this.$t('edit-location'),
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
      loadingDelete: false,
      location: {},
    }
  },
  async mounted() {
    this.getPostalCodes()
    if (this.$props.locationObject) {
      this.location = locationObject
    } else {
      this.getLocation()
    }
  },
  computed: {
    city() {
      if (this.location.postal_code_id) {
        const postalCode = _.find(
          this.postalCodes,
          (o) => o.id === this.location.postal_code_id
        )

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
    async remove() {
      if (confirm(this.$t('confirmation'))) {
        this.loadingDelete = true
        try {
          await CustomerService.deleteLocation(
            this.currentCustomerId,
            this.$route.params.id
          )
          this.$router.push({
            name: 'locations',
          })
        } catch (err) {
          console.error(err)
        }
        this.loadingDelete = false
      }
    },
    updateZip(id) {
      this.location.postal_code_id = id
    },
    async update() {
      this.loadingUpdate = true
      try {
        const res = await CustomerService.updateLocation(
          this.currentCustomerId,
          this.$route.params.id,
          this.location
        )

        this.$store.commit('customer/SET_CUSTOMER', {
          ...this.currentCustomer,
          locations: res.data,
        })
        this.$toast.success(this.$t('changes-saved'))
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
        const id = this.location.postal_code_id
        this.location.postal_code_id = null
        this.location.postal_code_id = id
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
        // this.$router.push({
        //   name: 'locations',
        // })
      }
      this.loading = false
    },
  },
  watch: {
    'location.postal_code_id'(id) {
      if (id) {
        const postalCode = _.find(this.postalCodes, (o) => o.id === id)

        if (postalCode) {
          if (this.$refs.typeahead)
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