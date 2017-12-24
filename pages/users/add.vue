<template>
  <div class="edit-user">
    <Loader v-if="loading" />
    <b-row align-h="center" v-else>
      <b-col cols="12" md="8" lg="7">
        <b-card :title="$t('edit-user')" class="mt-3 mt-md-5 shadow">
          <form @submit.prevent="add" class="w-100">
            <b-alert
              variant="danger"
              class="mb-2"
              :show="error ? true : false"
              >{{ error }}</b-alert
            >
            <label>{{ $t('name') }}</label>
            <b-input
              type="text"
              :placeholder="$t('name')"
              v-model="name"
              required
              class="mb-4"
              :disabled="loadingAdd"
            />
            <label>{{ $t('phone') }}</label>
            <b-input
              type="number"
              :placeholder="$t('phone')"
              v-model="mobile"
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

            <!-- Only allow changing password when logged in user himself -->
            <!-- <template v-if="isUserHimself"> -->
            <b-row>
              <b-col cols="12" md="6">
                <label>{{ $t('password') }}</label>
                <b-input
                  type="password"
                  :placeholder="$t('new-password')"
                  v-model="password"
                  class="mb-4"
                  required
                  :disabled="loadingAdd"
                />
              </b-col>
              <b-col cols="12" md="6">
                <label>{{ $t('confirm-password') }}</label>
                <b-input
                  type="password"
                  :placeholder="$t('confirm-new-password')"
                  v-model="confirmPassword"
                  class="mb-4"
                  required
                  :disabled="loadingAdd"
                />
              </b-col>
            </b-row>
            <!-- </template> -->

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
import UserService from '~/services/UserService'

export default {
  name: 'EditUser',
  middleware: 'authenticated',
  components: {
    VueBootstrapTypeahead,
  },
  props: {
    userObject: {
      type: Object,
    },
  },
  head() {
    return {
      title: this.$t('add-user'),
    }
  },
  data() {
    return {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      loading: false,
      loadingAdd: false,
      error: '',
    }
  },
  computed: {
    isUserHimself() {
      const user = this.$store.getters['auth/getAuthUser']
      if (user) {
        return user.id == this.$route.params.id
      }
      return false
    },
  },
  methods: {
    async remove() {
      if (confirm(this.$t('confirmation'))) {
        this.loadingDelete = true
        try {
          await UserService.delete(this.$route.params.id)
          this.$router.push({
            name: 'users',
          })
        } catch (err) {
          console.error(err)
        }
        this.loadingDelete = false
      }
    },
    async add() {
      this.error = ''

      if (this.password) {
        if (this.password !== this.confirmPassword) {
          this.error = this.$t('errors.passwords-dont-match')
        } else if (this.password && this.password.length < 4) {
          this.error = this.$t('errors.password-too-short')
        }
      }

      if (this.error) return

      this.loadingAdd = true
      try {
        const res = await UserService.create({
          name: this.name,
          email: this.email,
          mobile: this.mobile,
          password: this.password,
          role: 'customer_user',
          customer: this.currentCustomerId,
        })
        this.$toast.success(this.$t('changes-saved'))

        this.$router.push({
          name: 'users',
        })
      } catch (err) {
        console.error(err)
      }
      this.loadingAdd = false
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