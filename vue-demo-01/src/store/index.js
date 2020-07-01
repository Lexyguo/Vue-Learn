import Vue from 'vue'
import Vuex from 'vuex'
import child from './child'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    login(state) {
      state.isLogin = true
    },
    logout(state) {
      state.isLogin = false
    }
  },
  actions: {
    loginWithName({ commit }, username) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin') {
            commit('login')
            resolve(username + '登录成功！')
          } else {
            reject('用户名错误！')
          }
        }, 1000);
      })
    }
  },
  modules: {
    child
  }
})
