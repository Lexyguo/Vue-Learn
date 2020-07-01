<template>
  <div>
    <h2 @click="relayTwo">{{name}}</h2>
    <p>{{msg1}}</p>
    <p>
      <slot>smell</slot>
    </p>
    <p>
      <slot name="text"></slot>
    </p>
    <p>
      <slot name="data" :time="time"></slot>
      <button @click="addTime">点我一下</button>
    </p>
  </div>
</template>

<script>
export default {
  inject: {
    msg1: {
      from: "msg",
      default: "welcome"
    }
  },
  data() {
    return {
      name: "Child One",
      isReceive: false,
      time: 0
    };
  },
  methods: {
    relayTwo() {
      if (this.isReceive) {
        this.$parent.$emit("relay", "Hi, Child Two!");
      }
    },
    addTime() {
      this.time++;
    }
  },
  mounted() {
    this.$bus.$on("say", word => {
      console.log("My brother say: ", word);
      this.isReceive = true;
    });
    this.$root.$on("relayOne", word => {
      this.isReceive = false;
      console.log("Relay from two", word);
    });
  }
};
</script>

<style lang="scss" scoped>
</style>