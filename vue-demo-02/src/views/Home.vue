<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>{{ title }}</h1>
    <p @click="counter">counter : {{ $store.state.counter }}</p>
    <p @click="asyncCounter">async counter: {{ $store.state.counter }}</p>
    <p>double counter: {{ doubleCount }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Welcome to vue-router demo",
    };
  },
  methods: {
    counter() {
      this.$store.commit("add");
    },
    asyncCounter() {
      this.$store.dispatch("add");
    },
  },
  computed: {
    doubleCount() {
      return this.$store.getters.doubleCounter;
    },
  },
};
</script>
