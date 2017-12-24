export const state = () => ({
  user: null,
  accessToken: null,
})

export const mutations = {
  SET_AUTH(state, { user, accessToken }) {
    state.user = user
    state.accessToken = accessToken
  },
  LOGOUT(state) {
    state.user = null
    state.accessToken = null
  },
}

export const getters = {
  getAuthToken(state) {
    return state.accessToken
  },
  getAuthUser(state) {
    return state.user
  },
}
