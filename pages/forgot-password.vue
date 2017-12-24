<template>
  <div class="forgot-password">
    <b-row
      class="mt-3"
      align-h="center"
      align-v="center"
      style="min-height: 50vh"
    >
      <b-col cols="12" md="6" lg="5">
        <ForgotPasswordStepOne
          v-if="step === 1"
          :step.sync="step"
          :username.sync="username"
        />
        <fade-transition>
          <LazyForgotPasswordStepTwo
            v-if="step === 2"
            :step.sync="step"
            :code.sync="code"
            :username="username"
          />
        </fade-transition>
        <fade-transition>
          <LazyForgotPasswordStepThree
            v-if="step === 3"
            :code.sync="code"
            :username="username"
            @reset="step = 4"
          />
        </fade-transition>
        <fade-transition>
          <b-card class="shadow" v-if="step === 4">
            <p class="lead text-center">
              {{ $t('password-reset-successfully') }}
            </p>
            <b-button to="/" variant="primary" squared>{{
              $t('login')
            }}</b-button>
          </b-card>
        </fade-transition>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  middleware: 'guest',
  data() {
    return {
      code: '',
      newPassword: '',
      confirmNewPassword: '',
      loading: false,
      step: 1,
      error: '',
      username: '',
    }
  },
  head() {
    return {
      title: this.$t('forgot-password-?'),
    }
  },
}
</script>

<style lang="scss" scoped>
.forgot-password {
  .fa-exclamation-circle {
    font-size: 70px !important;
  }
  .card-body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
  }
}
</style>
