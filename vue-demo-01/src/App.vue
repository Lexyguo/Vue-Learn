<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <!-- <Communication /> -->
    <!-- <Form></Form> -->
    <Recursive></Recursive>
  </div>
</template>

<script>
// import Communication from "./components/communication";
// import Form from "./components/form";
import Recursive from "./components/recursive";

export default {
  name: "App",
  components: {
    // Communication
    // Form
    Recursive
  },
  data() {
    return {};
  },
  methods: {}
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
