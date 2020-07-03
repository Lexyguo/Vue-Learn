<template>
  <div>
    <tree-node v-for="(item,index) in data" :key="index" :model="item" :props="props"></tree-node>
  </div>
</template>

<script>
import TreeNode from "./TreeNode";
export default {
  components: {
    TreeNode
  },
  props: {
    data: {
      type: Array,
      require: true
    },
    props: {
      default() {
        return {
          children: "children",
          label: "label",
          disabled: "disabled"
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>