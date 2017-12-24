import createPersistedState from 'vuex-persistedstate'

const persistedState = ({ store }) => {
  if (process.browser) {
    createPersistedState({
      key: 'session',
    })(store)
  }
}

export default persistedState
