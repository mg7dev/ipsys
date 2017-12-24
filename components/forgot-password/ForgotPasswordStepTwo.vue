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
        {{ $t('forgot-password-line-3') }}
      </p>
      <b-form @submit.prevent="verifyCode" class="text-center">
        <b-row align-h="around">
          <b-col v-for="i in 4" :key="i">
            <b-input
              @input="focusNext(i, $event)"
              v-model="codes[i]"
              :disabled="loading"
              class="mb-4 text-center"
              required
              type="text"
              :id="`code-${i}`"
              maxlength="1"
            />
          </b-col>
        </b-row>
        <b-button type="submit" :disabled="loading" variant="primary">{{
          $t('verify')
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
    step: {
      type: Number,
      required: true,
    },
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
      error: '',
      codes: ['', '', '', ''],
    }
  },
  methods: {
    focusNext(index, val) {
      const next = document.querySelector(`#code-${index + 1}`)
      if (next && val) {
        next.focus()
      } else {
        if (val) {
          this.verifyCode()
        }
      }
    },
    async verifyCode() {
      this.error = ''
      this.loading = true

      try {
        await UserService.verifyForgotPasswordCode({
          code: this.codes.join(''),
          hideToast: true,
          username: this.$props.username,
        })

        // Go to step 2
        this.$emit('update:step', this.step + 1)
        this.$emit('update:code', this.codes.join(''))
      } catch (err) {
        this.error = this.errMess(err)
        this.codes = this.codes.map(() => '')
      }

      this.loading = false
    },
  },
}
</script>

<style></style>
