# Vue3响应式原理

Vue3跟Vue2一样，通过对象的 **属性劫持** + **依赖收集** + **触发更新** 来实现的数据响应式。只不过Vue2使用的是`Object.defineProperty`，而Vue3用的是ES6的`Proxy`代理对象实现。

`Proxy`支持监听对象进行的访问、赋值等操作，Vue3在这些操作发生时通知相关依赖以维护响应式系统的更新：

> 当我们将一个数据对象定义为响应式对象（`reactive`）时，Vue3将在这个对象上建立一个`Proxy`，`Proxy`在这个对象属性被访问时收集依赖，在属性被修改时触发更新，从而实现高效的响应式系统。

## 创建响应式对象 reactive
通过ES6的`Proxy`创建响应式对象，并通过`track`和`trigger`进行依赖追踪和触发更新：
- `getter`负责监听对象属性的**读取**，并调用`track`进行依赖收集。
- `setter`负责监听对象属性的**赋值**，并调用`trigger`触发更新。
```js
function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      let res = Reflect.get(obj, key, receiver)
      track(obj, key) // track 收集依赖属性
      return res
    },
    set(obj, key, value, receiver) {
      let oldValue = obj[key]
      let result = Reflect.set(obj, key, value, receiver)
      if (oldValue !== value) {
        trigger(obj, key) // trigger 触发依赖更新
      }
      return result
    }
  })
}
```

## 依赖收集函数 track
Vue3维护一个`WeakMap`，用于管理所有的`reactive`响应式对象。所有的`reactive`对象维护一个`Map`来管理该对象所有属性的副作用集合（`Set`结构）。
```js
// 管理所有的reactive响应式对象
const targetMap = new WeakMap()

function track(target, key) {
  let depsMap = targetMap.get(target) // 获取reactive对象
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key) // 获取reactive对象的 effect set
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
}
```

## 触发更新函数 trigger
找到`reactive`响应式对象，通过遍历，依次触发其对应属性的**副作用集合**。
```js
function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect.run())
  }
}
```

## 副作用管理 ReactiveEffect
Vue3封装了一个`effect`函数用于**声明副作用函数**，副作用函数内通常访问了`reactive`响应式对象的属性，当响应式数据变化时，Vue自动执行这个副作用函数。
:::tip
若副作用函数内没有访问`reactive`响应式对象的属性，实际上就没有任何意义，仅仅会被当成一个普通的回调函数执行第一次。
:::
:::tip
`activeEffect`作为一个临时变量，用于储存当前的`effect`，才好让`track`知道将其作为依赖收集起来。
:::
```js
let activeEffect = null

// 管理副作用
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    this.fn()
    activeEffect = null
  }
}

function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

// 声明响应式对象
const state = reactive({ count: 0 })

effect(() => {
  // 访问响应式对象的属性、产生依赖
  console.log("count:", state.count)
})

// 数据改变时，触发 effect
state.count++
```

## Vue 3 响应式核心实现
完整代码：
```js
let activeEffect = null

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    this.fn()
    activeEffect = null
  }
}

const targetMap = new WeakMap()

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
}

function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect.run())
  }
}

function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      let res = Reflect.get(obj, key, receiver)
      track(obj, key)
      return res
    },
    set(obj, key, value, receiver) {
      let oldValue = obj[key]
      let result = Reflect.set(obj, key, value, receiver)
      if (oldValue !== value) {
        trigger(obj, key)
      }
      return result
    }
  })
}

function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

// 测试
const state = reactive({ count: 0 })

effect(() => {
  console.log("count:", state.count)
})

state.count++
```

## 自动追踪
在实际开发中，通常不需要我们手动调用`effect`来产生依赖并追踪，Vue3模板本身就会自动追踪响应式数据的依赖，这是Vue内部已经封装好的机制。

在`setup`里，Vue会自动收集依赖并更新DOM，不需要手动调用`effect`。
```vue
<template>
  <!-- Vue 自动追踪依赖 -->
  <p>Count: {{ state.count }}</p>
  <button @click="increment">+1</button>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>
```

:::tip 组件之外
`setup`只能用在组件内，如果你在Vue组件之外（如 Vuex/Pinia）使用响应式数据，就可以采用`effect`来实现：
```js
// store.js
import { reactive, effect } from 'vue'

export const state = reactive({ count: 0 })

effect(() => {
  console.log("Global state count:", state.count)
})
```
:::

:::tip effect vs watch
`effect`和`watch`都适用于对响应式数据的监听，`effect`会自动追踪内部多个响应式数据，更适用于响应式系统的底层处理。

而`watch`虽然需要声明，但也因此更精准，不会因为每个属性变化都执行，并且其可以获取到变化的新值和旧值，适用于监听特定数据变化，在开发中用的更多。
```js
watch(() => state.count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变成了 ${newValue}`)
})
```

而如果你不想手动声明依赖项，Vue还提供了来自动帮你追踪副作用里面的所有响应式数据。
```js
watchEffect(() => {
  console.log("Count:", state.count)
})
```
:::