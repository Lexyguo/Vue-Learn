import View from './fvue-router-view'
import Link from './fvue-router-link'
let _fVue;

// 插件实现
class FVueRouter {
    constructor(options) {
        this.$options = options;

        // 响应式数据（只有响应式数据才能让render（）在数据刷新完后重新渲染）
        // 方法1
        // const inital = window.location.hash.slice(1) || '/';
        // _fVue.util.defineReactive(this, 'current', inital);

        // 方法2
        this.current = window.location.hash.slice(1) || '/'
        _fVue.util.defineReactive(this, 'matched', []);
        this.match()

        // 监听事件
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))

        // the path list is used to control path matching priority
        this.pathList = []
        // 缓存路由映射关系
        this.routeMap = Object.create(null)
        // $flow-disable-line
        this.nameMap = Object.create(null)

        this.$options.routes.forEach(route => {
            // this.routeMap[route.path] = route;
            this.addRouteRecord(this.pathList, this.routeMap, this.nameMap, route)
        })

        for (let i = 0, l = this.pathList.length; i < l; i++) {
            if (this.pathList[i] === '*') {
                this.pathList.push(this.pathList.splice(i, 1)[0])
                l--
                i--
            }
        }

    }

    onHashChange() {
        this.current = window.location.hash.slice(1)
        this.matched = []
        this.match()
    }

    addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
        const { path, name } = route
        const normalizedPath = normalizePath(
            path,
            parent,
            true
        )

        const record = {
            path: normalizedPath,
            components: route.components || { default: route.component },
            instances: {},
            name,
            parent,
            matchAs,
            redirect: route.redirect,
            beforeEnter: route.beforeEnter,
            meta: route.meta || {},
            props: route.props == null
                ? {}
                : route.components
                    ? route.props
                    : { default: route.props }
        }

        // 如果存在子路由则将子路由进行添加到Map中
        if (route.children) {
            route.children.forEach(child => {
                const childMatchAs = matchAs
                    ? cleanPath(`${matchAs}/${child.path}`)
                    : undefined
                this.addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
            })
        }

        if (!pathMap[record.path]) {
            pathList.push(record.path)
            pathMap[record.path] = record
        }

        if (name) {
            if (!nameMap[name]) {
                nameMap[name] = record
            } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
                console.error(
                    false,
                    `Duplicate named routes definition: ` +
                    `{ name: "${name}", path: "${record.path}" }`
                )
            }
        }

    }

    match(routes) {
        routes = routes || this.$options.routes
        // 递归遍历
        for (const route in routes) {
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route)
                return;
            }
            if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
                this.matched.push(route)
                if (route.children) {
                    this.match(route.children)
                }
                return;
            }
        }
    }
}

function cleanPath(path) {
    return path.replace(/\/\//g, '/')
}


function normalizePath(path, parent, strict) {
    if (!strict) path = path.replace(/\/$/, '')
    if (path[0] === '/') return path
    if (parent == null) return path
    return cleanPath(`${parent.path}/${path}`)
}

// 形参是Vue的构造函数
FVueRouter.install = function (Vue) {
    _fVue = Vue;

    // 1、挂载$router
    Vue.mixin({
        beforeCreate() {
            // 全局混入，将来在组件实例化的时候才执行
            // 需要判断此时router实例是否已经存在
            // this指的就是组件实例
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router;
            }
        }
    })

    // 2、实现两个组件 router-view、router-link

    Vue.component('router-link', Link)
    Vue.component('router-view', View)

}

export default FVueRouter