<template>
  <div>
    <h2 @click="welcomeOne">{{name}}</h2>
    <span>{{$attrs.msg}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Child Two",
      isReceive: false
    };
  },
  methods: {
    welcomeOne() {
      if (this.isReceive) {
        this.$root.$emit("relayOne", "Welcome One!");
        this.isReceive = false;
      }
    }
  },
  mounted() {
    this.$bus.$emit("say", "Hello, Child One");

    this.$parent.$on("relay", relay => {
      this.isReceive = true;
      console.log("replay from one: ", relay);
    });
  }
};
</script>

<style lang="scss" scoped>
</style>