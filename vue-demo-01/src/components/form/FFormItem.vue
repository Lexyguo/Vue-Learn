<template>
  <div class="f-form-item">
    <label v-if="label">{{label}}</label>
    <div>
      <slot></slot>
      <p v-if="validateMessage">{{validateMessage}}</p>
    </div>
  </div>
</template>

<script>
import AsyncValidator from "async-validator";
export default {
  inject: ["form"],
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
  }
};
</script>

<style scoped>
.f-form-item {
  display: inline-flex;
  align-items: center;
  margin-bottom: 30px;
}
label {
  min-width: 100px;
}
</style>