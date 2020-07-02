<template>
  <div class="f-form-item">
    <div>
      <label v-if="label">{{label}}</label>
      <slot></slot>
    </div>
    <span v-if="validateMessage" class="error">{{validateMessage}}</span>
  </div>
</template>

<script>
import AsyncValidator from "async-validator";
import emitter from "@/mixins/emitter";
export default {
  componentName: "FFormItem",
  inject: ["form"],
  mixins: [emitter],
  props: {
    label: {
      type: String,
      default: ""
    },
    prop: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      validateMessage: ""
    };
  },
  computed: {
    fieldValue() {
      return this.form.model[this.prop];
    },
    fieldRule() {
      return this.form.rules[this.prop];
    }
  },
  methods: {
    validate() {
      const model = { [this.prop]: this.fieldValue };
      const rule = { [this.prop]: this.fieldRule };
      const validator = new AsyncValidator(rule);

      return validator.validate(model, error => {
        if (error) {
          this.validateMessage = error[0].message;
        } else {
          this.validateMessage = "";
        }
      });
    }
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    });
    // 派发事件通知Form新增Item实例
    this.dispatch("FForm", "fake.form.addField", [this]);
  }
};
</script>

<style scoped>
div {
  display: inline-flex;
  align-items: center;
}

.f-form-item {
  flex-direction: column;
  margin-bottom: 30px;
}
label {
  min-width: 100px;
}
.error {
  margin-left: 100px;
  margin-top: 10px;
  text-align: left;
}
</style>