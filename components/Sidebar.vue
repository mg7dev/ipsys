<template>
  <div class="sidebar">
    <b-sidebar
      backdrop-variant="primary"
      backdrop
      shadow
      id="sidebar-1"
      :title="$t('menu')"
    >
      <b-nav vertical class="w-100">
        <b-nav-item
          active-class="active-class"
          v-for="(item, i) in items"
          :key="i"
          :active="$route.name === item.routeName"
          :to="{ name: item.routeName }"
          exact
        >
          {{ $t(item.translation) }}</b-nav-item
        >
        <b-nav-item @click="logout">{{ $t('logout') }}</b-nav-item>
      </b-nav>
    </b-sidebar>
  </div>
</template>

<script>
import jsCookie from 'js-cookie'

export default {
  name: 'Sidebar',
  props: {
    items: Array,
  },
  methods: {
    logout() {
      if (confirm(this.$t('confirmation'))) {
        this.$store.commit('auth/LOGOUT')
        jsCookie.remove('access_token')
        this.$router.push('/')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  .nav-link {
    background: white;
    color: $primary;
  }
  .active-class {
    background: $primary;
    color: white;
  }
}
</style>