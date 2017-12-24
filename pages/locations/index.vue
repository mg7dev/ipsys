<template>
  <div class="locations">
    <b-card class="shadow mt-4" :title="$t('my-locations')">
      <b-row class="mb-3" align-h="between" align-v="start">
        <b-col cols="12" md="6" lg="4">
          <b-input v-model="search" type="search" :placeholder="$t('search')" />
        </b-col>
        <b-col cols="12" md="6" lg="4" class="text-right mt-2 mt-md-0">
          <b-button squared variant="primary" :to="{ name: 'locations-add' }">{{
            $t('add-location')
          }}</b-button>
        </b-col>
      </b-row>
      <b-table responsive="" :items="locationsDropdown" :fields="headers">
        <template #cell(actions)="data">
          <b class="text-info">
            <b-button
              variant="transparent"
              :to="{ name: 'locations-id', params: { id: data.item.id } }"
              size="sm"
            >
              <b-icon icon="pencil-square"></b-icon
            ></b-button>
          </b>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
import CustomerService from '~/services/CustomerService'
export default {
  name: 'Locations',
  middleware: 'authenticated',
  head() {
    return {
      title: this.$t('my-locations'),
    }
  },
  data() {
    return {
      loading: true,
      locations: [],
      search: '',
      headers: [
        {
          label: this.$t('name'),
          key: 'name',
        },
        {
          label: this.$t('city'),
          key: 'city_name',
        },
        {
          label: this.$t('email'),
          key: 'email',
        },
        {
          label: this.$t('actions'),
          key: 'actions',
        },
      ],
    }
  },
  mounted() {
    this.getLocations()
  },
  computed: {
    locationsDropdown() {
      return this.locations

        .map((l) => ({
          ...l,
          city_name: l.postal_code.city.name,
          zip_code: l.postal_code.code,
        }))
        .filter(
          (l) =>
            Object.values(l).filter((val) =>
              val
                ? val
                    .toString()
                    .toLowerCase()
                    .includes(this.search.toLowerCase())
                : false
            ).length
        )
    },
  },
  methods: {
    async getLocations() {
      try {
        const res = await CustomerService.getLocations(this.currentCustomerId)
        this.$store.commit('customer/SET_CUSTOMER', {
          ...this.currentCustomer,
          locations: res.data,
        })
        this.locations = res.data
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style>
</style>