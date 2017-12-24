<template>
  <div class="auth-layout">
    <LangSwitcher />
    <Header />
    <b-container class="mb-5">
      <Nuxt />
    </b-container>
    <!-- <Footer /> -->
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
}
</script>