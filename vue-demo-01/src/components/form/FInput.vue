<template>
  <div>
    <input :value="value" :type="type" v-bind="$attrs" @input="handleInput" />
  </div>
</template>

<script>
import emitter from "@/mixins/emitter";
export default {
  inject: {
    fForm: {
      from: "form",
      default: ""
    }
  },
  mixins: [emitter],
  inheritAttrs: false, // 让父dom不包含attr下来的属性
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "text"
    }
  },
  data() {
    return {};
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
      this.dispatch("FFormItem", "validate");
    }
  }
};
</script>

<style lang="scss" scoped></style>
