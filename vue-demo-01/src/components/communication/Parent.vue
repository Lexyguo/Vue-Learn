<template>
  <div>
    <h1>Parent</h1>
    <ChildOne>
      <template>hhh,ok!</template>
      <template v-slot:text>You are funny!</template>
      <template v-slot:data="data">click Time {{data.time}}</template>
    </ChildOne>
    <span>{{loginResult1}}</span>
    <ChildTwo ref="child2" msg="parent say to child two with $attr way"></ChildTwo>
    <span>{{loginResult2}}</span>
  </div>
</template>

<script>
import ChildOne from "./ChildOne.vue";
import ChildTwo from "./ChildTwo.vue";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      loginResult1: "",
      loginResult2: ""
    };
  },
  components: {
    ChildOne,
    ChildTwo
  },
  computed: {
    ...mapState("child", ["isLogin", "userName"])
  },
  methods: {
    ...mapActions(["child/welcome"])
  },
  mounted() {
    console.log("refs name = ", this.$refs["child2"].name);
    console.log(this.$children[0].name);
    console.log(this.$children[1].name);
    this["child/welcome"](this.userName)
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  }
};
</script>

<style lang="scss" scoped>
</style>