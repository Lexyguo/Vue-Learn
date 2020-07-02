import Vue from 'vue'

export default function create(Component, props) {
  // 方法一：Vue.extend 生成组件的构造函数
  const Profile = Vue.extend(Component);

  // 创建 Profile 实例，并挂载到生成的元素上。
  const comp = new Profile({ propsData: props }).$mount();
  document.body.appendChild(comp.$el);

  // 删除函数
  comp.remove = () => {
    document.body.removeChild(comp.$el);
    comp.$destroy();
  }

  // // 方法二：Vue.Component
  // const vdom = new Vue({
  //   render(c) {
  //     return c(Component, { props })
  //   }
  // }).$mount();
  // // 通过vm.$el获取生成的dom
  // document.body.appendChild(vm.$el)

  // // 删除函数
  // // 获取组件实例
  // const comp = vm.$children[0]

  // comp.remove = () => {
  //   document.body.removeChild(vm.$el)
  //   vm.$destroy()
  // }

  return comp;
}