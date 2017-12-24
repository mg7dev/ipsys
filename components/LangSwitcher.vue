<template>
  <div class="lang-switcher">
    <b-container fluid>
      <button
        v-b-toggle.sidebar-1
        class="hamburger"
        size="lg"
        v-if="$store.state.auth.user"
      >
        <b-icon icon="filter-left"></b-icon>
      </button>
      <span v-if="!$store.state.auth.user"></span>

      <div>
        <BIconGlobe variant="white" />
        <select
          id="lang-switcher"
          v-model="selectedLang"
          @change="changeLocale"
        >
          <option
            v-for="locale in availableLocales"
            :key="locale.code"
            :value="locale.code"
          >
            {{ $t(`${locale.code}-lang`) }}
          </option>
        </select>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'LangSwitcher',
  data() {
    return { selectedLang: null }
  },
  computed: {
    availableLocales() {
      return this.$i18n.locales
    },
  },
  created() {
    this.selectedLang = this.$i18n.locale
  },
  methods: {
    changeLocale(e) {
      const code = e.target.value
      if (code !== this.$i18n.locale) {
        this.$i18n.setLocale(code)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.lang-switcher {
  width: 100%;
  background: $primary;
  padding: 10px;

  div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  select {
    margin-top: 3px;
    background: transparent;
    color: white;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    cursor: pointer;
    text-align-last: center;
    min-width: 72px;

    option {
      background: $primary;
      text-align-last: center;
    }
  }

  .hamburger {
    display: none;
    border: none;
    background: $primary;
    color: white;
    outline: none;

    * {
      font-size: 30px;
    }
  }

  @media (max-width: 768px) {
    .hamburger {
      display: block;
    }

    > div {
      justify-content: space-between;
    }
  }
}
</style>
