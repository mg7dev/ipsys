<template>
  <div class="header shadow">
    <b-container class="text-center text-sm-left">
      <nuxt-link :to="{ name: 'index' }">
        <img src="/logo.png" alt="LPG Oslo Logo" class="logo" />
      </nuxt-link>

      <div v-if="$store.state.auth.accessToken" class="menu">
        <b-button
          v-for="(item, i) in items"
          :key="i"
          :variant="$route.name === item.routeName ? 'primary' : 'transparent'"
          class="mx-1"
          squared
          size="sm"
          :to="{ name: item.routeName }"
          >{{ $t(item.translation) }}</b-button
        >
        <b-button
          variant="outline-primary"
          class="ml-5 mx-1"
          squared
          size="sm"
          @click="logout"
          >{{ $t('logout') }}</b-button
        >
      </div>
    </b-container>
    <sidebar v-if="$store.state.auth.user" :items="items" />
  </div>
</template>

<script>
import cookie from 'js-cookie'
import jsCookie from 'js-cookie'
import Sidebar from './Sidebar'

export default {
  name: 'Header',
  components: { Sidebar },
  data() {
    return {
      items: [
        {
          translation: 'my-orders',
          routeName: 'orders',
        },

        {
          translation: 'my-locations',
          routeName: 'locations',
        },
        {
          translation: 'my-users',
          routeName: 'users',
        },
        {
          translation: 'profile',
          routeName: 'profile',
        },
      ],
    }
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
.header {
  width: 100%;
  // box-shadow: 0px 3px 4px 1px lightgrey;
  display: flex;
  align-items: center;
  background: white;

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      display: flex;
      flex: 1;
      justify-content: flex-end;
    }
  }

  .logo {
    width: 105px;
    padding: 4px 0 20px 0;
  }

  .hamburger {
    display: none;
  }

  @media (max-width: 768px) {
    div.menu {
      display: none !important;
    }

    .container {
      position: relative;
      justify-content: center;
      .hamburger {
        display: block;
        position: absolute;
        left: 10px;
        top: auto;
      }
    }
  }
}
</style>
