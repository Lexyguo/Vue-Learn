<template>
  <div id="app">
    <div>
      <input v-model="userName" type="text" @keyup.enter="loginWithUser" />
      <button @click="login" v-if="!$store.state.isLogin">登录</button>
      <button @click="logout" v-else>登出</button>
    </div>
    <Parent :msg="msg" />
  </div>
</template>

<script>
import Parent from "./Parent";

export default {
  provide() {
    return {
      msg: this.msg
    };
  },
  components: {
    Parent
  },
  data() {
    return {
      userName: "",
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    login() {
      this.$store.commit("login");
    },
    logout() {
      this.$store.commit("logout");
    },
    loginWithUser() {
      this.$store
        .dispatch("loginWithName", this.userName)
        .then(res => {
          alert(res);
        })
        .catch(e => {
          console.log("fail", e);
        });
    }
  }
};
</script>
