<template>
  <div class="forgot-password-step-two">
    <b-card class="shadow">
      <p class="lead text-center mb-5 font-weight-bold">
        {{ $t('forgot-password-?') }}
      </p>
      <b-alert class="my-3" :show="error ? true : false" variant="danger">{{
        $t(error)
      }}</b-alert>
      <p class="text-muted text-center mb-3">
        {{ $t('forgot-password-line-4') }}
      </p>
      <b-form @submit.prevent="resetPassword" class="text-center">
        <b-row align-h="around">
          <b-col>
            <b-input
              v-model="password"
              :disabled="loading"
              class="mb-4"
              :placeholder="$t('new-password')"
              required
              type="password"
            />
            <b-input
              v-model="confirmPassword"
              :disabled="loading"
              class="mb-4"
              :placeholder="$t('confirm-new-password')"
              required
              type="password"
            />
          </b-col>
        </b-row>
        <b-button type="submit" :disabled="loading" variant="primary">{{
          $t('reset-password')
        }}</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'ForgotPasswordStepTwo',
  props: {
    code: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      password: '',
      confirmPassword: '',
      error: '',
    }
  },
  methods: {
    async resetPassword() {
      this.error = ''

      if (this.password.length < 4) {
        this.error = 'errors.password-too-short'
      } else if (this.password !== this.confirmPassword) {
        this.error = 'errors.passwords-dont-match'
      }

      if (!this.error) {
        this.loading = true

        try {
          await UserService.resetPassword({
            password: this.password,
            code: this.$props.code,
            hideToast: true,
            username: this.$props.username,
          })

          // Go to step 2
          this.$emit('reset')
        } catch (err) {
          this.error = this.errMess(err)
        }

        this.loading = false
      }
    },
  },
}
</script>

<style></style>
