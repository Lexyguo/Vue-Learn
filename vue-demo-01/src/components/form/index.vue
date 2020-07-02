<template>
  <div>
    <f-form ref="form" :model="form" :rules="rules">
      <f-input v-model="form.id" hidden="true"></f-input>
      <f-formItem label="姓名" prop="name">
        <f-input v-model="form.name" placeholder="请输入你的姓名"></f-input>
      </f-formItem>
      <f-formItem label="年龄" prop="age">
        <f-input v-model="form.age" placeholder="请输入你的年龄"></f-input>
      </f-formItem>
      <f-formItem>
        <button @click="login">login</button>
      </f-formItem>
    </f-form>
  </div>
</template>

<script>
import FInput from "./FInput.vue";
import FFormItem from "./FFormItem.vue";
import FForm from "./FForm.vue";
export default {
  components: {
    FForm,
    FInput,
    FFormItem,
  },
  data() {
    return {
      form: {
        name: "",
        age: "",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$notice({
            title: "暗号",
            message: "村长喊你来搬砖", // "欢迎你呀！" + this.form.name,
          }).show();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
