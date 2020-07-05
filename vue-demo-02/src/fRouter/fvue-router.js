let _fVue;

// 插件实现
class FVueRouter {
    constructor(options) {
        this.$options = options;

        // 响应式数据（只有响应式数据才能让render（）在数据刷新完后重新渲染）
        const inital = window.location.hash.slice(1) || '/';
        _fVue.util.defineReactive(this, 'current', inital);

        // 监听事件
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))

        // the path list is used to control path matching priority
        this.pathList = []
        // $flow-disable-line
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
            // Warn if route is named, does not redirect and has a default child route.
            // If users navigate to this route by name, the default child will
            // not be rendered (GH Issue #629)
            if (process.env.NODE_ENV !== 'production') {
                if (route.name && !route.redirect && route.children.some(child => /^\/?$/.test(child.path))) {
                    console.error(
                        false,
                        `Named Route '${route.name}' has a default child route. ` +
                        `When navigating to this named route (:to="{name: '${route.name}'"), ` +
                        `the default child route will not be rendered. Remove the name from ` +
                        `this route and use the name of the default child route for named ` +
                        `links instead.`
                    )
                }
            }
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

    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                require: true
            }
        },
        render(h) {
            return h(
                'a',
                {
                    attrs: {
                        href: '#' + this.to
                    }
                },
                this.$slots.default
            )
        }

    })

    Vue.component('router-view', {
        render(h) {
            // 获取路由实例
            const { routeMap, current } = this.$router;
            const comp = routeMap[current] ? routeMap[current].components.default : null;
            return h(comp);
        }
    })

}

export default FVueRouter