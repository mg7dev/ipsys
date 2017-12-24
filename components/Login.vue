<template>
  <div class="login shadow">
    <div class="header">{{ $t('login') }}</div>
    <b-form class="form" @submit.prevent="login">
      <b-alert variant="danger" :show="error ? true : false">{{
        $t(error)
      }}</b-alert>
      <b-input
        v-model="email"
        type="text"
        :placeholder="$t('email-or-mobile')"
        required
        class="mb-3"
        :disabled="loading"
      />
      <b-input
        v-model="password"
        type="password"
        :placeholder="$t('password')"
        required
        class="mb-5"
        :disabled="loading"
      />

      <!-- <b-form-checkbox
        v-model="remember"
        :disabled="loading"
        :value="true"
        :unchecked-value="false"
        class="mb-5"
      >
        {{ $t('remember-me') }}
      </b-form-checkbox>-->
      <b-button
        squared
        class="mb-3"
        type="submit"
        variant="primary"
        block
        :disabled="loading"
        >{{ $t('login') }}</b-button
      >
      <b-link
        variant="primary"
        class="w-100 d-block text-center"
        :to="{ name: 'forgot-password' }"
        >{{ $t('forgot-password-?') }}</b-link
      >
    </b-form>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'
import Cookie from 'js-cookie'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      error: '',
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.loading = true

      try {
        const res = await AuthService.login({
          mobile: this.email,
          password: this.password,
          hideToast: true,
        })
        this.$store.commit('auth/SET_AUTH', {
          user: res.user,
          accessToken: res.access_token,
        })
        this.$axios.setToken(res.access_token)
        Cookie.set('access_token', res.access_token)
        this.$router.push({
          name: 'choose-customer',
        })
      } catch (err) {
        this.loading = false
        this.error = this.errMess(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  background: white;
  border-radius: 3px;

  .header {
    width: 100%;
    padding: 5px 10px;
    background: $primary;
    color: white;
    border-radius: 3px 3px 0 0;
  }

  .form {
    padding: 20px;
  }
}
</style>
