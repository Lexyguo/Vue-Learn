<template>
  <div class="f-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: "FForm",
  provide() {
    return {
      form: this
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object
  },
  methods: {
    validate(cb) {
      // 全局校验方法
      // 1.执行内部所有FormItem校验方法，统一处理结果
      // 将FormItem数组转换为Promise数组
      const tasks = this.field
        .filter(item => item.prop)
        .map(item => item.validate());

      // 2.统一检查校验结果
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    }
  },
  created() {
    this.field = [];
    this.$on("fake.form.addField", field => {
      if (field) {
        this.field.push(field);
      }
    });
  }
};
</script>

<style scoped>
.f-form {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
</style>