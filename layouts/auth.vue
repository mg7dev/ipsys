<template>
  <div class="defaul-layout">
    <LangSwitcher />
    <Header />
    <b-container>
      <Nuxt />
    </b-container>
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>

<style lang="scss" scoped>
.containers {
  min-height: 85vh;
}
</style>
