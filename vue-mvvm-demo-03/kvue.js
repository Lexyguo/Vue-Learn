function defineReactive(obj, key, val) {
    // val可能是对象，需要递归处理
    observe(val)

    // 每执行一次defineReactive，就创建一个Dep实例
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', val);
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set', newVal);
                observe(newVal)
                val = newVal

                // 通知更新
                dep.notify()

            }
        }
    })
}

// 对象响应式处理
function observe(obj) {
    // 判断obj类型必须是对象
    if (typeof obj !== 'object' || obj == null) {
        return
    }

    new Observe(obj);
}

// 将$data中的key代理到KVue实例上
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(newVal) {
                if (newVal !== vm.$data[key]) {
                    vm.$data[key] = newVal
                }
            }
        })
    })
}

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

class KVue {
    constructor(options) {
        // 保存选项
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods

        // 相应化处理
        observe(this.$data)

        proxy(this)

        // 编译:解析所有指令
        new Compile('#app', this)
    }

}

function protoAugment(target, src) {
    target.__proto__ = src
}

function copyAugment(target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}
const hasProto = '__proto__' in {}
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator(...args) {
        const result = original.apply(this, args)
        const ob = this.__ob__
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if (inserted) ob.observeArray(inserted)
        // notify change
        ob.dep.notify()
        return result
    })
})
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
class Observe {
    constructor(value) {
        this.value = value
        this.dep = new Dep()
        def(value, '__ob__', this)
        // 判断value是obj还是数组
        if (Array.isArray(value)) {
            if (hasProto) {
                protoAugment(value, arrayMethods)
            } else {
                copyAugment(value, arrayMethods, arrayKeys)
            }
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    walk(obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
    }

    observeArray(items) {
        for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }

}

class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)

        // 编译模版
        if (this.$el) {
            this.compile(this.$el)
        }
    }

    compile(el) {
        // 递归遍历el
        el.childNodes.forEach(item => {
            // 判断是否是节点
            if (this.isElement(item)) {
                this.compileElement(item)
            } else if (this.isInter(item)) { // 判断是否是差值表达式
                this.compileText(item)
            }

            // 判断是否存在子节点
            if (item.childNodes) {
                this.compile(item)
            }
        })
    }

    // 编译差值表达式
    compileText(node) {
        // 获取匹配表达式
        // var val = this.$vm[RegExp.$1];
        // node.textContent = node.textContent.replace(`{{${RegExp.$1}}}`, val)

        this.update(node, RegExp.$1, 'text')

        // 思考{{ }}中为表达式时如何处理？

    }

    // 编译节点
    compileElement(node) {
        const attributes = node.attributes
        node.events = {}
        Array.from(attributes).forEach(attr => {
            const atrName = attr.name
            const exp = attr.value

            // 判断属性类型
            if (/^k-|^@|^:/.test(atrName)) {
                if (this.isDirective(atrName)) {
                    const dir = atrName.substring(2);
                    // 执行指令
                    this[dir] && this[dir](node, exp)
                } else {
                    // fn类型：1、表达式 2、methods里定义的fn
                    const vm = this.$vm;
                    node.events[exp] = function bindEvent(target) {
                        var event = vm.$methods[exp] || new Function(exp)

                        return event && event.call(this.$vm, target);
                    }

                    const name = atrName.replace('@', '').split('.')[0]
                    node.addEventListener(name, node.events[exp].bind(this))
                    // 更新
                    new Watcher(vm, exp, function (fn) {
                        node.addEventListener(name, fn.bind(this))
                    })
                }
            }

        })
    }

    text(node, exp) {
        // node.textContent = this.$vm[exp]
        this.update(node, exp, 'text')
    }

    html(node, exp) {
        // node.innerHTML = this.$vm[exp]
        this.update(node, exp, 'html')
    }

    // 所有动态绑定都需要创建更新函数以及对应watcher实例
    update(node, exp, dir) {
        //初始化更新方法
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])

        // 更新
        new Watcher(this.$vm, exp, function (val) {
            fn && fn(node, val)
        })
    }

    textUpdater(node, value) {
        node.textContent = value
    }

    htmlUpdater(node, value) {
        node.innerHTML = value
    }

    isElement(node) {
        return node.nodeType === 1
    }

    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    isDirective(attrName) {
        return attrName.indexOf('k-') === 0
    }
}

// Watcher: 小秘书，界面中的一个依赖对应一个小秘书

class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm
        this.key = key

        this.updateFn = updateFn

        // 读一次数据，触发defineReactive里面的get()
        Dep.target = this;
        this.vm[this.key];
        Dep.target = null
    }

    // 管家调用
    update() {
        // 传入当前的最新值给更新函数
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}

class Dep {
    constructor() {
        this.deps = []
    }

    addDep(watcher) {
        this.deps.push(watcher)
    }

    notify() {
        this.deps.forEach(watch => watch.update())
    }
}