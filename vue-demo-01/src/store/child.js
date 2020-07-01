export default {
  namespaced: true, // 避免命名冲突
  state: {
    userName: 'Parent',
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
    welcome({ commit }, username) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === this.state.child.userName) {
            commit('login')
            resolve(username + '欢迎回来！')
          } else {
            reject('用户名错误！')
          }
        }, 1000);
      })
    }
  }
}