
let FVue

class Store {
    constructor(options) {

        // 保存mutations
        this._mutations = options.mutations

        // 保存actions
        this._actions = options.actions

        const store = this
        const { commit, dispatch } = store;

        this.dispatch = function boundDispatch(type, payload) {
            return dispatch.call(store, type, payload)
        };
        this.commit = function boundCommit(type, payload, options) {
            commit.call(store, type, payload, options)
        };

        // getters
        // 1.遍历用户传入getters所有key，动态赋值，其值应该是函数执行结果
        // 2.确保它是响应式的，
        // Object.defineProperty(this.getters, key, {get(){}})
        // 3.缓存结果，可以利用computed

        // 保存getters
        this._getters = options.getters

        this.getters = {}
        const computed = {}
        this.forEachValue(this._getters, (fn, key) => {
            computed[key] = () => fn(store.state);
            Object.defineProperty(this.getters, key, {
                get: () => store._vm[key],
            })
        })


        // 响应式的state
        this._vm = new FVue({
            data: { $$state: options.state }, // $$ 的写法是为了隐藏state这个属性
            computed
        })

    }

    get state() {
        return this._vm._data.$$state;
    }

    set state(v) {
        console.error('please use replaceState to reset state');
    }

    forEachValue(obj, fn) {
        Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
    }

    // commit(type, payload)： 执行mutations,修改状态
    commit(type, payload) {
        const entry = this._mutations[type];
        // 根据type获取对应对mutations
        if (!entry) {
            console.log('this type mutations is undefined')
            return
        }
        entry(this.state, payload);
    }

    dispatch(type, payload) {
        const entry = this._actions[type];
        // 根据type获取对应对mutations
        if (!entry) {
            console.log('this type actions is undefined')
            return
        }
        return entry(this, payload);
    }
}

function install(Vue) {
    FVue = Vue;

    // 混入
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default { Store, install }