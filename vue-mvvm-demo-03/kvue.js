function defineReactive(obj, key, val) {
    // val可能是对象，需要递归处理
    observe(val)

    Object.defineProperty(obj, key, {
        get() {
            console.log('get', val);
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set', newVal);
                observe(newVal)
                val = newVal
            }
        }
    })
}

function observe(obj) {
    // 判断obj类型必须是对象
    if (typeof obj !== 'object' || obj == null) {
        return
    }

    new Observe(obj);
}

class KVue {
    constructor(options) {
        // 保存选项
        this.$options = options
        this.$data = options.data
        // 相应化处理
        observe(this.$data)
    }

}

class Observe {
    constructor(value) {
        this.value = value

        // 判断value是obj还是数组
        this.walk(value)
    }

    walk(obj) {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))

    }
}

