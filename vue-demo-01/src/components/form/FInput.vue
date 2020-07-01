<template>
  <div>
    <input :value="value" :type="type" v-bind="$attrs" @input="handleInput" />
  </div>
</template>

<script>
export default {
  inject: {
    fForm: {
      from: "form",
      default: "",
    },
  },
  inheritAttrs: false, // 让父dom不包含attr下来的属性
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
  },
  data() {
    return {};
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
      this.dispatch("FFormItem", e.target.value);
    },
    // 如果直接使用$parent派发事件，很有可能input的父级组件并不是formItem
    // 应该遍历input的上级组件，直到找到formItem对应的组件
    dispatch(componentName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, params);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
