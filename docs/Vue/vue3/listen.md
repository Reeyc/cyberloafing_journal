# computed & watch
在vue3的选项式API中，vue2的`computed`和`watch`这两个选项同样被保存了下来，就不过多介绍了，主要看看vue3中的`computed`和`watch`。

## computed
在vue3中，`computed`是vue导出的一个函数API，函数的返回值就是当前的计算属性对象，它是一个 [ref对象](/vue/vue3/ref.md#ref) 。

* 当传入一个**回调函数**时，该函数就是该计算属性的`getter`。
```vue
<template lang="">
  <div>{{ fullName }}</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

const firstName = ref("hello")
const lastName = ref("world")

//ref对象
const fullName = computed(() => {
  return firstName.value + "_" + lastName.value
})
</script>
```

* 当传入一个**对象**时，对象内部需要自己书写`getter`和`setter`。
```vue
<template lang="">
  <div>{{ fullName }}</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

const firstName = ref("hello")
const lastName = ref("world")

const fullName = computed({
  get() {
    return firstName.value + "_" + lastName.value
  },
  set(val: string) {
    lastName.value = val
  }
})

setTimeout(() => {
  fullName.value = "vue3"
}, 1000)
</script>
```

## watch
`watch`和`computed`一样，是vue3中导出的函数API，watch的参数如下：
* 第一个参数：要监听的**响应式对象**。
* 第二个参数：执行的**动作函数**。
* 第三个参数：**配置对象**，可以进行如下配置：。
  * `immediate`: true 默认监听
  * `deep`: true 深度监听
  * `flush`: 'post' 等待DOM更新完毕时再执行回调

### 监听响应式对象
`watch`的第一个参数通常用于监听一个响应式对象。
:::warning
当第一个参数为响应式对象时，不需要开启`deep`，回调会在响应式对象的每一个层级被修改时都会触发。
:::
```vue
<script lang="ts" setup>
import { watch, reactive } from "vue"

const user = reactive({
  name: "Tom",
  children: [{ name: " Tony" }]
})

watch(
  user,
  val => {
    console.log(val)
  },
  { immediate: true }
)

setTimeout(() => {
  user.children[0].name = "Jerry"
}, 1000)
</script>
```

### 监听响应式对象的属性
watch的第一个参数用于监听响应式对象，如果响应式对象的属性值也是一个响应式对象，那么用此方法一样可以监听。

但如果响应式对象的属性值不是响应式对象的话，需要用一个函数返回该值来监听。
```vue
<script lang="ts" setup>
import { watch, reactive } from "vue"

const user = reactive({
  name: "Tom",
  children: [{ name: "Tony" }]
})

watch(
  () => user.name, //函数返回响应式对象的属性
  val => {
    console.log(val)
  },
  { immediate: true }
)

setTimeout(() => {
  user.name = "Jerry"
}, 1000)
</script>
```

### 批量监听
第一个参数传递一个**数组**，数组中的每个元素就是要批量监听的数据。执行的回调函数参数是一个**数组**，数组里面就是变化后的数据。
```vue
<script lang="ts" setup>
import { watch, reactive } from "vue"

const user = reactive({
  name: "Tom",
  children: [{ name: "Tony" }]
})

watch(
  [() => user.name, user.children],
  val => {
    console.log(val) // [...]
  },
  { immediate: true }
)

setTimeout(() => {
  user.name = "Jerry"
  user.children[0].name = "Lucy"
}, 1000)
</script>
```

### 等待DOM更新完毕执行
第三个参数配置`flush: "post"`可以使回调函数等待DOM更新完毕才执行。
```vue
<template lang="">
  <div ref="myRef">{{ user.name }}</div>
</template>

<script lang="ts" setup>
import { watch, reactive, ref } from "vue"

const user = reactive({
  name: "Tom",
  children: [{ name: "Tony" }]
})

const myRef = ref<HTMLInputElement | null>(null)
watch(
  user,
  () => {
    console.log(myRef.value?.innerText) //Jerry
  },
  { flush: "post" }
)

setTimeout(() => {
  user.name = "Jerry"
}, 1000)
</script>
```

### watchEffect
`watchEffect`不需要指定监听的数据，**回调函数中存在哪些响应式数据就监听哪些响应式数据**。所以`watchEffect`的第一个参数传递的是回调函数。
:::tip
watchEffect不需要配置`immediate: true`，默认就会执行初始化监听。
:::
```vue
<script lang="ts" setup>
import { ref, watchEffect } from "vue"

const count = ref(0)

watchEffect(() => {
  console.log(count.value)
})

setInterval(() => {
  count.value = Math.random()
}, 1000)
</script>
```

### watchPostEffect
`watchPostEffect`就是`watchEffect`加上`flush: "post"`的简写，默认执行初始化监听，当回调函数里面的响应式数据更新执行回调函数。如果有DOM更新，则会等待DOM也更新完毕时，再执行回调函数。
```vue
<template lang="">
  <div ref="myRef">{{ user.name }}</div>
</template>

<script lang="ts" setup>
import { watchPostEffect, reactive, ref } from "vue"

const user = reactive({
  name: "Tom",
  children: [{ name: "Tony" }]
})

const count = ref(0)

const myRef = ref<HTMLInputElement | null>(null)

watchPostEffect(() => {
  console.log(count.value)
  console.log(myRef.value?.innerText) //Jerry
})

setTimeout(() => {
  user.name = "Jerry" //响应式数据更新
  count.value = 1 //促使DOM更新
}, 1000)
</script>
```

<Vssue />