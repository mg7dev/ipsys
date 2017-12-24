<template>
  <div class="users">
    <b-card class="shadow mt-4" :title="$t('my-users')">
      <b-row class="mb-3" align-h="between" align-v="start">
        <b-col cols="12" md="6" lg="4">
          <b-input v-model="search" type="search" :placeholder="$t('search')" />
        </b-col>
        <b-col cols="12" md="6" lg="4" class="text-right mt-2 mt-md-0">
          <b-button squared variant="primary" :to="{ name: 'users-add' }">{{
            $t('add-user')
          }}</b-button>
        </b-col>
      </b-row>
      <b-table responsive :items="usersDropdown" :fields="headers">
        <template #cell(actions)="data">
          <b class="text-info">
            <b-button
              variant="transparent"
              :to="{ name: 'users-id', params: { id: data.item.id } }"
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
  name: 'Users',
  middleware: 'authenticated',
  head() {
    return {
      title: this.$t('my-users'),
    }
  },
  data() {
    return {
      loading: true,
      users: [],
      search: '',
      headers: [
        {
          label: this.$t('name'),
          key: 'name',
        },
        {
          label: this.$t('email'),
          key: 'email',
        },
        {
          label: this.$t('phone'),
          key: 'mobile',
        },
        {
          label: this.$t('actions'),
          key: 'actions',
        },
      ],
    }
  },
  mounted() {
    this.getUsers()
  },
  computed: {
    usersDropdown() {
      return this.users

        .map((l) => ({
          ...l,
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
    async getUsers() {
      try {
        const res = await CustomerService.getUsers(this.currentCustomerId)
        this.$store.commit('customer/SET_CUSTOMER', {
          ...this.currentCustomer,
          users: res.data,
        })
        this.users = res.data.map((customer_user) => customer_user.user)
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style>
</style>