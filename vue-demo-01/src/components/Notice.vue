<template>
  <div class="box" v-if="isShow">
    <h3>{{ title }}</h3>
    <p class="box-content">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(this.hide, this.duration);
    },
    hide() {
      this.isShow = false;
      this.remove();
    },
  },
};
</script>

<style scoped>
.box {
  position: fixed;
  top: 0;
  left: 20%;
  right: 20%;
  height: 200px;
  z-index: 10;
  text-align: center;
  pointer-events: none;
  background-color: #fff;
  border: 2px solid #da33;
}
</style>
