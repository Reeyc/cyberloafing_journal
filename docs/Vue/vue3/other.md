# 其他响应式API

## ref的响应式特点
ref对象被传递给函数或是从一般对象上被解构时，不会丢失响应性。这个功能非常重要，因为后面需要经常用于将ref对象**传递到hook函数中**进行逻辑操作，并**保留响应式**。
```ts
// @/hook/useCount
import { Ref } from "vue"

export function useCount(ref: Ref<number>) {
  setInterval(() => {
    ref.value++
  }, 1000)
  return ref
}
```
```vue
<template lang="">
  <div>{{ count }}</div>
</template>

<script lang="ts" setup>
import { useCount } from "@/hook/useCount"
import { ref } from "vue"

const count = ref(0)

useCount(count)
</script>
```

其他一些常用的响应式API：

## toRef
将响应式对象的**某个属性转换为ref对象**。
* 参数一：响应式对象。
* 参数二：需要转为ref对象的属性名。

上面的例子可以换成下面`reactive`的写法：
```vue
<template lang="">
  <div>{{ obj.count }}</div>
</template>

<script lang="ts" setup>
import { useCount } from "@/hook/useCount"
import { reactive, toRef } from "vue"

const obj = reactive({
  count: 0
})

//toRef将count属性转为ref对象
useCount(toRef(obj, "count"))
</script>
```

## toRefs
将响应式对象的**所有属性转换为ref对象**，响应式对象本身变为普通对象（用于解构）。
* 参数：响应式对象。
```ts
// @/hook/useCount
import { Ref } from "vue"

interface ref {
  [propName: string]: Ref<string | number>
}

export function useCount(refs: ref) {
  const { name, age } = refs //ref从普通对象上结构也不会丢失响应式
  name.value = "Tom"
  age.value = 20
  return { name, age }
}
```
```vue
<template lang="">
  <div>{{ name }}</div>
  <div>{{ age }}</div>
</template>

<script lang="ts" setup>
import { useCount } from "@/hook/useCount"
import { reactive, toRefs } from "vue"

const user = reactive({
  name: "Lucy",
  age: 18
})

const { name, age } = useCount(toRefs(user))
</script> 
```

## shallowReactive
浅响应式，只处理了对象内**最外层属性**的响应式。
```vue
<template lang="">
  <div>{{ obj.prop }}</div>
  <div>{{ obj.children.prop }}</div>
</template>

<script lang="ts" setup>
import { onMounted, shallowReactive } from "vue"

const obj = shallowReactive({
  prop: 1,
  children: {
    prop: 2
  }
})

onMounted(() => {
  obj.children.prop = 20
})
</script>
```

## shallowRef
只处理了`value`属性的响应式，如传入对象，不会内部再调用`reactive`处理。
```vue
<template lang="">
  <div>{{ obj.count }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"

const obj = ref({
  count: 1
})

onMounted(() => {
  obj.value.count = 2
})
</script>
```

## readonly
返回一个**深度只读**的响应式对象，接收一个**响应式对象**、**纯对象**或者**ref对象**。
:::tip
深度：对象自身的属性和对象深层的属性都不允许被修改。
:::
```vue
<template lang="">
  <div>{{ count }}</div>
</template>

<script lang="ts" setup>
import { readonly, ref } from "vue"

const count = ref(0)

const copyCount = readonly(count)

count.value++
copyCount.value++ // Warning
</script>
```

## shallowReadonly
返回一个**浅度只读**的响应式对象，接收一个纯对象。
:::tip
浅度：对象自身的属性不允许被修改，对象深层的属性不受限制。
:::
```vue
<template lang="">
  <div>{{ obj.count }}</div>
  <div>{{ obj.children.count }}</div>
</template>

<script lang="ts" setup>
import { shallowReadonly } from "vue"

const obj = shallowReadonly({
  count: 0,
  children: {
    count: 0
  }
})

obj.count++ // Warning
obj.children.count++
</script>
```

## toRaw
返回由`reactive`或`readonly`创建的响应式对象的**原始对象**。改变原始对象的数据，响应式对象的**数据也会被更改**。但是不会被追踪，也就是**UI不会发生变化**。
```vue
<template lang="">
  <div>{{ obj.count }}</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRaw } from "vue"

const foo = { count: 0 }
const obj = reactive(foo)

const rawObj = toRaw(obj)
console.log(rawObj === foo) // true

onMounted(() => {
  rawObj.count++ //DOM加载完毕后，改变数据，不会更新到视图
  console.log(rawObj.count) // 1
  console.log(obj.count) // 1
})
</script>
```

## markRaw
使一个对象永远不可转为响应式对象。
```vue
<template lang="">
  <div>{{ obj.count }}</div>
</template>

<script lang="ts" setup>
import { markRaw, onMounted, reactive } from "vue"

const foo = { count: 0 }

const obj = reactive(markRaw(foo))
// const obj = reactive(foo)

onMounted(() => {
  obj.count++
})
</script>
```

## customRef
自定义ref对象，接收一个回调函数，返回一个带`get`和`set`的对象，回调里面有两个参数：
* **`track`**：追踪，用于get获取值的时候调用，告诉vue追踪数据。
* **`trigger`**：触发，用于set设置值的时候调用，告诉vue更新界面。

下面是一个使用customRef自定义防抖函数的例子：
```ts
// @/hook/useDebounce
import { customRef } from "vue"

export default function <T>(value: T, delay = 200) {
  let timeout: number
  return customRef(function (track, trigger) {
    return {
      get() {
        track() //告诉vue追踪数据
        return value
      },
      set(newVal: T) {
        clearTimeout(timeout)
        setTimeout(() => {
          value = newVal
          trigger() //告诉vue更新界面
        }, delay)
        trigger()
      }
    }
  })
}
```
```vue
<template lang="">
  <input type="text" v-model="text" />
  <div>{{ text }}</div>
</template>

<script lang="ts" setup>
import useDebounce from "@/hook/useDebounce"

const text = useDebounce<string>("", 500)
</script>
```

## 响应式数据的判断
vue3中提供了几个工具API，用于判断是否是某种类型的数据。
```vue
<script lang="ts" setup>
import { isProxy, isReactive, isReadonly, isRef, reactive, readonly, ref } from "vue"

const objForRef = ref(0)
const objForReactive = reactive({})
const objForReadonly = readonly({})

// isRef：判断一个数据是否是ref对象
console.log(isRef(objForRef), isRef(objForReactive)) // true false

// isReactive：判断一个数据是否由reactive创建的响应式对象
console.log(isReactive(objForReactive), isReactive(objForReadonly)) // true false

// isReadonly：判断一个数据是否由readonly创建的响应式对象
console.log(isReadonly(objForReactive), isReadonly(objForReadonly)) // false true

// isProxy：判断一个数据是否由readonly或者readonly创建的响应式对象
console.log(isProxy(objForRef), isProxy(objForReactive), isProxy(objForReadonly)) // false true true
</script>
```