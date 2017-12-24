export const state = () => ({
  show: true,
})

export const mutations = {
  DISABLE(state) {
    state.show = false
  },
  ENABLE(state) {
    state.show = true
  },
}
