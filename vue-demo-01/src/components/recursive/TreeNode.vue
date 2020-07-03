<template>
  <div style="margin:5px;">
    <div @click="toggle" :style="{ 'padding-left': (level - 1)*5 +'em' }">
      <button v-if="isFolder">{{open?'-':'+'}}</button>
      <label style="width:100px;">{{model[props.label]}}</label>
    </div>
    <div v-if="isFolder" v-show="open">
      <tree-node
        v-for="(item,index) in model[props.children]"
        :key="index"
        :props="props"
        :model="item"
        :level="level+1"
      ></tree-node>
    </div>
  </div>
</template>

<script>
export default {
  name: "tree-node", // 递归的组件必须被命名
  props: {
    model: Object,
    level: {
      type: Number,
      default: 1
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
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    isFolder() {
      const key = this.props["children"];
      return this.model[key] && this.model[key].length;
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>