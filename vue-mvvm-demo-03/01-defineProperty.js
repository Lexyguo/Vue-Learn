// 对象响应式原理
// 1.Object.defineProperty()

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', val)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set', newVal)
                observe(newVal)
                val = newVal;
            }
        }
    })
}

function observe(obj) {
    // obj必须是对象
    if (typeof obj !== 'object' || obj === null) {
        return
    }
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

function set(obj, key, val) {
    defineReactive(obj, key, val)
}

const obj = { foo: 'foo', name: 'color' }

// defineReactive(obj, 'name', 'gzq');
observe(obj)

obj.name
obj.name = 'super'
// obj.foo = 'fooo'

obj.name = { bar: 'bar' }
obj.name.bar = 'aaa'
set(obj, 'a', 'bbb')
obj.a = ['nnn', 'ahsjda', 'sadad']
obj.a.slice(1, 1)
obj.a
obj.a.push('axczc')
obj.a
// obj.a
