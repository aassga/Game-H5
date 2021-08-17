import Vue from 'vue'
import Vuex from 'vuex'
import main from './module/main'
import user from './module/user'
import games from './module/games'
import agent from './module/agent'
import agency from './module/agency'
import lottery from './module/lottery'
import key from './module/key'
import agentModec from './module/agentModec'

Vue.use(Vuex)

export default function (Vue) {
  return new Vuex.Store({
    state: {
      pageLoading: false,
      debugInfo: {}
    },
    mutations: {
      updateLoadingStatus (state, payload) {
        state.pageLoading = payload.pageLoading
      }
    },
    modules: {
      main: main(Vue),
      user: user(Vue),
      games: games(Vue),
      agent: agent(Vue),
      agency: agency(Vue),
      lottery: lottery(Vue),
      agentModec: agentModec(Vue),
      key,
    }
  })
}
