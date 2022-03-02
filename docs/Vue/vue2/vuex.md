# Vuex

Vuex是一个专为Vue应用开发的状态管理模式，它像一个共享的仓库（store），内部保存了组件的共享数据。当有其他的组件需要用到这些数据时，就可以从仓库里面去取。
修改数据也是同理，每当改变仓库里的数据，都会映射到所有调用该数据的组件，换言之Vuex的操作数据流程就是一个单向数据流。

**安装**
```sh
npm install vuex --save
```
**使用**
```js
//引入
import Vuex from "vuex"

//vue使用插件
Vue.use(Vuex)

//初始化全局对象
const store = new Vuex.Store({})

//把全局对象挂载到vue根组件上
new Vue({
  store
})
```
Vuex通常由以下几个核心概念所构建而成：
* **`State`**：存放数据。
* **`Gtters`**：数据的计算属性。
* **`Mutations`**：存放同步改变数据的事务。
* **`Actions`**：存放异步操作。
* **`Modules`**：模块分割。

**Vuex的完整流程**\
组件中触发Action，Action提交Mutations，Mutations修改State。组件根据State或Getters来渲染页面。具体如下图

![vuex流程](/assets/img/vuex.png)

## State
Vuex通过`store`选项，提供了一种机制将状态从根组件注入到每一个子组件中。子组件就能通过`this.$store`访问到store的实例
```js
const store = new Vuex.Store({
  state: {
    //存放数据...
    sayHello: "Hello World"
  }
})

new Vue({
  el: "#app",
  store,
  components: { App }
})

const App = {
  template: `<div>{{ hello }}</div>`,
  computed: {
    hello() {
      return this.$store.state.sayHello 
    }
  }
}
```

## Gettters
Getters里存放了`state`数据的取值函数`get`，接受`state`作为参数，可以对`state`数据进行加工再返回。
```js
const store = new Vuex.Store({
  state: {
    sayHello: "Hello World"
  },
  getters: {
    doneSayHello: state => {
      return "Tom say " + state.sayHello
    }
  }
})
```

## Mutations
更改`store`中的状态的唯一通道就是提交`mutation`，每一个`mutation`都是函数，函数的第一个参数是 **state对象**。第二个参数是传递进来的数据，官方称之为 **载荷（Payload）**。

`mutation`函数不能直接调用，而是需要通过`store`的`commit`方法来调用，官方称之为 **提交载荷**。
```js
const store = new Vuex.Store({
  state: {
    sayHello: "Hello World"
  },
  mutations: {
    setSay: (state, obj) => {
      // mutations里面直接更新state数据
      state.sayHello = `${obj.name} say hello ${obj.say}`
    }
  }
})

const App = {
  template: `<button @click="sayHello">click</button>`,
  methods: {
    sayHello() {
      this.$store.commit('setSay', { name: 'Tom', say: 'Vuex' })
    }
  }
}
```

### Mutation必须是同步函数
`mutation`是修改状态的唯一通道，并且这个过程是同步的。当我们在`mutation`里Debug时，里面若是含有异步操作，且在异步回调中修改状态，这时候的状态是不可跟踪的。因为当`mutation`执行完毕了，异步回调还没有调用。
```js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```
上面是官方的一个例子，`api.callAsyncMethod`是一个ajax请求，在其异步回调内修改`state`的`count`值，当在这里面Debug时，`count`的值是不可追踪的，因为`mutation`执行完毕了，异步回调还没执行。

### 使用常量替代Mutation事件类型
官方建议使用常量替代`mutation`事件类型，可以让你的代码合作者对整个app包含的`mutation`一目了然。
```js
// mutation-types.js
export const SET_THEME = 'SET_THEME'
export const SET_TOKEN = 'SET_TOKEN'
```
```js
// store.js
import Vuex from 'vuex'
import * as Type from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    [Type.SET_THEME] (state) {
      // mutate state
    }
  }
})
```

## Actions
**Actions** 用于存放所有的异步操作，里面的每一个成员都是函数。函数的第一个参数不是**store**对象，而是一个包含了**store**对象的相同属性和方法的`context`对象。第二个参数是传递进来的数据。

**actions**不是直接更改状态，**mutation**才是更改状态的唯一通道，所以**actions**里面的状态不可以追踪，可以调用`context.commit`提交一个**mutation**，也可以通过`context.state`和`context.getters`来获取**state**和**getters**。
```js
import { login } from "@/api"

const store = new Vuex.Store({
  state: {
    userInfo: null
  },
  mutations: {
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    login({ commit }, obj) {
      login(obj).then(res => {
        commit("userInfo", res)
      })
    }
  }
})
```
上面的代码中，引入的`login`是一个axios请求，其返回的是**Promise对象**，代表其包含异步操作，可以在**actions**里面调用它，并在其回调里调用`commit`，保证在**mutations**里面状态是同步的。

---

**actions函数**也是不可以直接调用的，需要通过**store对象**的`dispatch`方法来触发。
```js
store.dispatch('login', { username: 'admin', password: 123456 })
```

### 组合Actions
**actions**包含了异步操作，而多个异步操作经常会以继发的关系出现。例如：用户登陆成功之后，再根据用户的信息去请求菜单树接口...等等。这种情况可以将**actions**包裹一个**Promise对象**返回的方式来处理实现接口的继发关系。
```js
import { login, getMenuTree } from "@/api"

const store = new Vuex.Store({
  state: { ... },
  mutations: { ... },
  actions: {
    login({ commit }, obj) {
      return new Promise((resolve, reject) => {
        login(obj)
          .then(res => {
            commit("userInfo", res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getMenuTree({ commit }, obj) {
      getMenuTree(obj).then(res => {
        commit("menuInfo", res)
      })
    }
  }
})

const loginData = { username: "admin", password: 123456 }

store.dispatch("login", loginData).then(userData => {
  store.dispatch("menuInfo", userData)
})
```

## 辅助函数
**`mapState`**、**`mapGetters`**、**`mapMutations`**、**`mapActions`** 都是vuex抛出的api，它们主要用于在组件中映射**store**里的数据。
```js
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
```
* `mapState`：用于映射`store.state`的数据。
* `mapGetters`：用于映射`store.getters`的数据。
* `mapMutations`：用于映射`store.mutations`内的数据。
* `mapActions`：用于映射`store.actions`内的数据。

返回值为一个对象，对象里的键值就是调用时候传递的参数键值对象，例如 **`mapState`**：
```js
const result = mapState({ key: "value", foo: "bar" })

console.log(result) // { key:'value', foo:'bar' }
```
将`store.state`对象内的属性传递进去，并在组件内通过`computed`计算属性来简化调用`this.$store.state.dataKey`的方式。
```js
export default {
  computed: mapState({
    hello() {
      return this.$store.state.sayHello
    }
  }),

  //相当于
  computed: {
    hello() {
      return this.$store.state.sayHello
    }
  }
}
```
`mapState`函数也可以接收一个字符串数组，用于映射`store.state`对象内的键值对，数组内的每个元素必须对应`store.state`的键名。
```js
mapState(['key'])
this.key = store.state.key
```
再借助**展开运算符**实现终极简化方案：
```js
//store
state: {
  sayHello: "Hello World"
},
    
//混入computed计算属性
computed: {
  ...mapState(['sayHello'])
}

//调用
<h1>{{ sayHello }}</h1>
```
**`mapGetters`**、**`mapMutations`**、**`mapActions`** 的使用方式也是一样的。
:::tip
需要注意的是，`mapState`与`mapGetters`里面都是属性，可以通过展开运算符混入到`computed`计算属性当中。而`mapMutations`与`mapActions`里面都是方法，应当混入到`methods`当中。
```js
//mustations
mutations: {
  sayHello(state, data) {
    state.key = data
  }
}

//methods
methods: {
  ...mapMutasions(["sayHello"])
}

this.sayHello(data)
//相当于
this.$store.commit("sayHello", data)
```
:::

## Modules
开发大型应用时，**store**对象可能变得相当臃肿。Vuex允许将**store**分割成模块（module）。每个模块拥有自己的`state、mutation、action、getter`、甚至是嵌套子模块。
```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
```
:::warning
模块内的**state**对象应当由一个函数来声明返回，否则使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时**store**或模块间数据互相污染的问题。这一点跟vue组件的**data**对象如出一辙。
:::

### 局部状态
获取模块的状态
```js
console.log(store.state.a.xxx)
console.log(store.state.b.xxx)
```
模块内的**mutation**和**getter**，接收的第一个参数也是模块的**state**状态对象。\
而**getter**的第三个参数则是根节点的**state**状态对象。
```js
const moduleA = {
  state: () => ({ count: 2 }),
  getters: {
    // state为模块内的state对象，rootState为根节点的state对象
    doubleCount(state, getters, rootState) {
      return state.count * 2 + rootState.count * 2
    }
  },
  mutations: {
    // state为模块内的state对象
    increment(state) {
      state.count++
    }
  }
}

const store = new Vuex.Store({
  state: { count: 10 },
  modules: { a: moduleA }
})

console.log(store.getters.doubleCount) // 24
```
模块内的**actions**，通过`context.state`暴露出模块的**state**状态对象。根节点的状态对象则为`context.rootState`。
```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}

store.dispatch("incrementIfOddOnRootSum")
```

### 命名空间
默认情况下，模块内部的**action**、**mutation**和**getter**是注册在全局命名空间的。

就像上面的代码中，可以直接通过`store.getters.doubleCount`和`store.dispatch("incrementIfOddOnRootSum")`调用到模块内部的**getter**和**action**。

如果希望模块具有更高的封装度，可以给模块添加`namespaced: true`属性使其成为带有命名空间的模块。当命名空间的模块被注册后，它的所有**action**、**mutation**和**getter**都会自动根据模块注册的路径调整命名：
```js
const store = new Vuex.Store({
  modules: {
    account: {
      //带有命名空间的模块
      namespaced: true,
      state: () => ({ ... }),
      getters: {
        isAdmin () { ... } // 获取getters：getters['account/isAdmin']
      },
      actions: {
        login () { ... } // 调用actions：dispatch('account/login')
      },
      mutations: {
        login () { ... } // 调用mutations：commit('account/login')
      },

      //嵌套模块，会继承父模块的命名空间
      modules: {
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // 获取getters：getters['account/profile']
          }
        }
      }
    }
  }
})
```
:::tip
启用了命名空间的**getter**和**action**，其内部的`getter`，`dispatch`和`commit`都是局部的。也就是说，更改`namespaced`属性后不需要修改模块内的代码。
```js
const store = new Vuex.Store({
  state: { count: 10 },
  modules: {
    account: {
      namespaced: true,
      state: () => ({ count: 1 }),
      getters: {
        getCount(state, getter, rootState) {
          return state.count * 2
        }
      },
      mutations: {
        setCount(state, num) {
          state.count += num
        }
      },
      actions: {
        handleCount({ commit, dispatch }, num) {
          commit("setCount", num)
        }
      }
    }
  }
})

console.log(store.getters["account/getCount"]) // 2
store.dispatch("account/handleCount", 2)
console.log(store.getters["account/getCount"]) // 6
```
:::

---

#### 访问全局内容
在带命名空间的模块内，**getter**的第三个和第四个参数接收的是`rootState`和`rootGetters`。**action**也可以通过`context`对象来访问他们。

若需要在全局命名空间内分发**action**或提交**mutation**，将`{ root: true }`作为第三参数传给`dispatch`或`commit`即可。
```js
const store = new Vuex.Store({
  state: { count: 10 },
  mutations: {
    setCount(state, num) {
      state.count += num
    }
  },
  modules: {
    account: {
      namespaced: true,
      state: () => ({ count: 1 }),
      getters: {
        getCount(state, getter, rootState, rootGetters) {
          return rootState.count * 2 //读取全局内容
        }
      },
      actions: {
        handleCount({ commit, dispatch, rootState, rootGetters }, num) {
          commit("setCount", num, { root: true }) //提交全局commit
        }
      }
    }
  }
})

console.log(store.getters["account/getCount"]) // 20
store.dispatch("account/handleCount", 2)
console.log(store.getters["account/getCount"]) // 24
```

---

#### 带命名空间的模块映射
当使用`mapState`,`mapGetters`,`mapActions`和`mapMutations`这些辅助函数来映射带命名空间的模块时，要将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。
```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,
      state: () => ({ count: 0 }),
      getters: {
        getCount() { /* ... */ }
      },
      mutations: {
        setCount() { /* ... */ }
      },
      actions: {
        handleCount() { /* ... */ }
      }
    }
  }
})
```
```js
export default {
  computed: {
    ...mapState("account", ["count"]),
    ...mapGetters("account", ["getCount"])
  },
  methods: {
    ...mapMutations("account", ["setCount"]),
    ...mapActions("account", ["handleCount"]),
  },
}
```