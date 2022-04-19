# Pinia

## 手动状态管理
众所周知，`reactive()`可以将一个普通的对象构建成一个Proxy响应式对象，如果你有一部分状态需要在多个组件实例间共享，你可以使用`reactive()`来创建一个响应式对象，并在不同组件中导入它：
```ts
/**
 * 构建一个简单版的store仓库
 */
import { reactive } from "vue"

const store = {
  state: reactive({
    count: 0
  }),

  setCountAction(newValue: number) {
    this.state.count = newValue
  },

  resetCountAction() {
    this.state.count = 0
  }
}

export default store
```
使用时：
```ts
// ComponentA
import store from "@/customStore2"

let count = 1

setInterval(() => {
  store.setCountAction(count++)
}, 1000)
```
```ts
// ComponentB
import store from "@/customStore2"

{{ store.state.count }}
```
这样就实现了一个简单版的全局状态管理仓库。但是有几点需要格外注意：

* 所有状态的变更，都应放置在store自身的`action`中去管理。这种集中式状态管理能够被更容易追踪状态发生的变化。
* 不应该在`action`中替换原始的状态对象，而应执行`action`来`dispatch`事件通知store去改变。组件和store需要引用同一个共享对象，变更才能够被观察到。

## Pinia

虽然手动状态管理解决方案能够在简单的场景中应用，但在某些场景还是建议使用系统的状态管理方案，例如更强的团队协作约定、与`Vue DevTools`集成、服务端渲染支持等等。

Pinia是实现了上述需求的新一代状态管理库，当然 [Vuex](/vue/vue2/vuex.md) 也可以做到，但Pinia在生态系统中能够承担相同的职责且能做得更好，例如：

* 足够轻量，压缩后的体积只有1.6kb。
* 支持Vue2/3。
* 抛弃传统的`Mutation`，只有`state`、`getter` 和 `action`，简化状态管理库。
* `actions`支持同步和异步。
* 没有`Modules`嵌套，只有store的概念，store间可以自由使用，更好的代码分割。
* 完整的Typescript的支持。

---

因此 Pinia 也被认为是下一代的Vuex，即 Vuex5.x ，在 Vue3.0 的项目中使用也是备受推崇。以下段落取自 [官网](https://staging-cn.vuejs.org/guide/scaling-up/state-management.html#pinia)：
>Pinia 这款产品最初是为了探索 Vuex 的下一个版本，整合了核心团队关于 Vuex 5 的许多想法。最终，我们意识到 Pinia 已经实现了我们想要在 Vuex 5 中提供的大部分内容，因此决定将其作为新的官方推荐。

### 挂载Pinia
```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## State

#### 定义State
使用`defineStore()`函数创建一个store实例，函数接收一个唯一的id来标识该store。
```ts
//src/store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '蜻蜓队长'
    }
  }
})
```

#### 获取State
先获取导出的store实例，通过`store.xxx`的方式可以直接获取到state里的属性。
```vue
<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 也可以结合 computed 获取
const name = computed(() => userStore.name)
</script>

<template>
  <div>{{ userStore.name }}</div>
  <div>{{ name }}</div>
</template>
```

#### 修改State
修改state数据，可以直接通过 `store.属性名` 来修改。
```ts
userStore.name = '鲨鱼辣椒'
```
但一般不建议这么做，就像Vuex的 `mutation` 一样，为了更好的跟踪状态的改变，建议通过 `action` 去修改state，`action` 里可以直接通过 `this` 访问。
```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '蜻蜓队长'
    }
  },
  actions: {
    updateName(name) {
      this.name = name
    }
  }
})
```

```ts
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
userStore.updateName('鲨鱼辣椒')
```

## Getters
Pinia 的 `Getters` 在获取 `State` 值之前做一些逻辑处理，和 Vue 中的计算属性几乎一样，`getter` 中的值有缓存特性，如果值没有改变，多次使用也只会调用一次。
```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '蜻蜓队长'
    }
  },
  getters: {
    fullName: (state) => {
      console.log('getter被调用')
      return '蝎子莱莱 ' + state.name
    }
 }
})
```
```vue
<!-- 调用多次 -->
<div>{{ userStore.fullName }}</div>
<div>{{ userStore.fullName }}</div>
<div>{{ userStore.fullName }}</div>
<div>{{ userStore.fullName }}</div>
```

## Actions

`action` 支持异步，可以像写一个简单的函数一样支持 `async/await` 的语法。
```ts
export const useUserStore = defineStore('user', {
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      return data
    }
  }
})
```

`action` 之间也可以通过 `this` 相互调用。
```ts
export const useUserStore = defineStore('user', {
  actions: {
    async login(account, pwd) {
      const { userId } = await api.login(account, pwd)
      const { data } = await this.getRole(userId) // 可以通过this调用另一个action
      return data
    },
    getRole(userId) {
      return new Promise(resolve => {
        api.getRole(userId).then(res => {
          resolve(res)
        })
      }) 
    }
  }
})
```

调用另外一个store的 `action` 也是同理，引入store实例，通过 `实例.xxx()` 的方式可以直接调用实例的 `action`。
```ts
// 引入另外的store实例
import { usePermissionStore } from "@/store/permission"

export const useUserStore = defineStore('user', {
  actions: {
    async login(account, pwd) {
      const { userId } = await api.login(account, pwd)
      const { roleId } = await this.getRole(userId) // 可以通过this调用另一个action
      const { data } = await usePermissionStore.getMenu(roleId) // 通过store实例调用action
      return data
    },
    getRole(userId) {
      return new Promise(resolve => {
        api.getRole(userId).then(res => {
          resolve(res)
        })
      }) 
    }
  }
})
```

## 数据持久化
插件 `pinia-plugin-persist` 可以辅助实现数据持久化功能。

#### 安装
```sh
npm i pinia-plugin-persist --save
```

#### 使用
```ts
// src/store/index.ts
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const store = createPinia()
store.use(piniaPluginPersist)

export default store
```

接着在对应的 store 里开启 `persist` 即可。
```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '蜻蜓队长',
      age: 18,
      gender: 1
    }
  },
  persist: {
    enabled: true // 开启数据缓存
  }
})
```

* 默认以 store 的 `id` 作为 储存的 key 值。
* 数据默认存在 `sessionStorage` 里，可以自己指定存到 `localStorage` 里。
* 默认state里的**所有数据**都会被持久化，可以持久化指定的数据。
```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '蜻蜓队长',
      age: 18,
      gender: 1
    }
  },
  persist: {
    enabled: true, // 开启数据缓存
    strategies: [
      {
        key: 'my_user', // 存储指定的key
        storage: localStorage, //储存到localStorage
        paths: ['name', 'age'] //只持久化name和age
      }
    ]
  }
})
```