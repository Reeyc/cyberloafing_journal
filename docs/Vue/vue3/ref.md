# ref & reactive
vue3中暴露了两个API：`reactive`与`ref`，用于创建响应式数据。

## reactive
为**对象类型**（对象、数组、Map、Set）创建一个响应式对象（Proxy对象）。如果对象数组中嵌套了多层，一样会进行递归劫持所有属性监听变化实现响应式。
```vue
<template lang="">
  <div>name:{{ user.name }}</div>
  <div>age:{{ user.age }}</div>

  <div v-for="(item, index) in list" :key="index">{{ item }}</div>

  <button @click="change">click!</button>
</template>

<script lang="ts" setup>
import { reactive } from "vue"

const user = reactive({
  name: "tom",
  age: 18
})

const list = reactive([100, 200])

function change(): void {
  user.age++
  list[0] = 1000
}
</script>
```

响应式对象内的对象类型（对象、数组、Map、Set）也是Proxy。
```ts
import { reactive } from "vue"

const user = reactive({
  children: {}
})

console.log(user.children) // Proxy {}
```

## ref
ref会将接收的数据转换为一个 **`ref对象`**。注意，ref对象并不是Proxy对象，ref对象仅仅有一个 **`value`属性**，属性值为传递进来的数据。value属性是响应式的，vue内部使用`get`和`set`劫持了 **`value`属性**。

* 当我们在JS中，读取或者修改时，都应该**操作value属性**。
* 当我们在模板中使用时，可以**免写`.value`**，vue为了顶层变量做了解套处理。

```vue
<template lang="">
  <div>{{ msg }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"

const msg = ref("hello world") //ref对象、顶层变量

onMounted(() => {
  msg.value = "hello vue3"
  console.log(msg.value)
})
</script>
```

### ref接收对象类型
ref不仅可以为**基本类型**创建一个响应式数据，也可以接受**对象类型**。当接收的值为对象类型时，vue内部会调用`reactive`，将这个值深度递归劫持属性变化转换为**响应式对象**，再赋值到`value`属性上。
```vue
<template lang="">
  <div>{{ obj.msg }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"

// obj是ref对象
// obj.value被reactive包装成Proxy响应式对象
const obj = ref({
  msg: "hello world"
})

console.log(obj)

onMounted(() => {
  obj.value.msg = "hello vue3"
  console.log(obj.value.msg)
})
</script>
```

### ref的解套
ref在**模板**中：自动解套，省略.value属性，只对顶层变量解套。
```vue
<template lang="">
  <div>{{ msg }}</div> <!-- 自动解套 -->
  <div>{{ obj.msg.value }}</div>  <!-- 没有解套，需要.value -->
</template>

<script lang="ts" setup>
import { ref } from "vue"

//顶层变量
const msg = ref("hello world")

const obj = {
  //非顶层变量
  msg: ref("hello vue3")
}
</script>
```

ref在**响应式对象**中：自动解套，会将value的值赋值给响应式对象的属性。
```vue
<script lang="ts" setup>
import { ref, reactive } from "vue"

//顶层变量
const msg = ref("hello world")

const obj = reactive({ msg })

console.log(msg.value) //hello world

/**
 * 自动解套，将value值赋值给obj.msg
 */
console.log(obj.msg) //hello world
</script>
```

### 模板ref

ref除了用于**定义响应式数据**以外，还能用于**获取DOM元素**。
:::warning
声明的DOM变量必须和模板的**ref值**相同。
:::
如果ref属性挂载的目标不是DOM元素，而是组件，那么获取到的是组件实例。
```vue
<template lang="">
  <input type="text" ref="inputRef" />
  <HelloWorld ref="helloWorldRef" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"

import HelloWorld from "@/components/HelloWorld.vue"

//声明的DOM变量必须和模板的ref值相同
const inputRef = ref<HTMLInputElement | null>(null)
const helloWorldRef = ref<InstanceType<typeof HelloWorld> | null>(null) //使用InstanceType内置的工具类型获取组件实例类型

onMounted(() => {
  inputRef.value && inputRef.value.focus()
  console.log(helloWorldRef.value?.$el.innerText)
})
</script>
```