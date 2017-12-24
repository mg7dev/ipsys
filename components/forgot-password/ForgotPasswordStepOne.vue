<template>
  <div class="forgot-password-step-one">
    <b-card class="shadow">
      <p class="lead text-center mb-5 font-weight-bold">
        {{ $t('forgot-password-?') }}
      </p>
      <b-alert class="my-3" :show="error ? true : false" variant="danger">{{
        $t(error)
      }}</b-alert>
      <p class="text-muted text-center mb-3">
        {{ $t('forgot-password-line-2') }}
      </p>
      <b-form @submit.prevent="sendCode" class="text-center">
        <b-input
          v-model="email"
          :disabled="loading"
          :placeholder="$t('email-or-mobile')"
          class="mb-4"
          required
          type="text"
        />
        <b-button type="submit" :disabled="loading" variant="primary">{{
          $t('send-code')
        }}</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'ForgotPasswordStepOne',
  props: {
    step: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      email: '',
      error: '',
    }
  },
  methods: {
    async sendCode() {
      this.error = ''
      this.loading = true

      try {
        await UserService.sendForgotPasswordCode({
          username: this.email,
          hideToast: true,
        })

        // Go to step 2
        this.$emit('update:step', this.step + 1)
        this.$emit('update:username', this.email)
      } catch (err) {
        this.error = this.errMess(err)
      }

      this.loading = false
    },
  },
}
</script>

<style></style>
