<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link><br />
      <router-link to="/hello">Hello</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
// 因为RouterView在router插件安装过程中已经被全局安装了，所以这里不需要再引入
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
