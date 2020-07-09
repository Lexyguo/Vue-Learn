export default {
  name: 'router-view',
  render(h) {
    // console.log(this.$vnode)
    // console.log(this.$router)
    // console.log(this.$parent)
    this.$vnode.data.routerView = true;
    let depth = 0;
    let parent = this.$parent

    while (parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {}
      if (vnodeData && vnodeData.routerView) {
        // 说明当前view是一个router-view
        depth++;
      }
      parent = parent.$parent
    }
    this.$vnode.data.routerViewDepth = depth

    // 获取路由实例
    // const { routeMap, current } = this.$router;
    // const comp = routeMap[current] ? routeMap[current].components.default : null;

    let comp = null
    const route = this.$router.matched[depth];
    console.log(this.$router)
    if (route) {
      console.log(route.component)
      comp = route.component
    }

    return h(comp);
  }
}