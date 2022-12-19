import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const TOUTIAO_USER = 'toutiao-user'

export default new Vuex.Store({
  state: {
    user: getItem(TOUTIAO_USER) // 存储用户的token refresh_token等登录信息
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      // 1. 把数据存储到state中(数据是响应式的)
      state.user = payload
      // 2. 再把数据存入localStorage(数据是持久化的)
      setItem(TOUTIAO_USER, payload)
    }
  },
  actions: {},
  modules: {}
})
