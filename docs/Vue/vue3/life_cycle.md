# 生命周期

## 生命周期的变化
Vue3.0中保留了Vue2中的所有生命周期，用于选项式API中，其中，`beforeDestroy`、`destroyed`被改名为`beforeUnmount`，`unmounted`。
```vue
<script lang="ts">
export default {
  beforeCreate() {
    console.warn("---beforeCreate---")
  },
  created() {
    console.warn("---created---")
  },
  beforeMount() {
    console.warn("---beforeMount---")
  },
  mounted() {
    console.warn("---mounted---")
  },
  beforeUpdate() {
    console.warn("---beforeUpdate---")
  },
  updated() {
    console.warn("---updated---")
  },
  beforeUnmount() { // beforeDestroy 更名为 beforeUnmount
    console.warn("---beforeUnmount---")
  },
  unmounted() { // destroyed 更名为 unmounted
    console.warn("---unmounted---")
  }
}
</script>
```

在组合式API中使用生命周期：
* 所有生命周期需要加上`on前缀`，并且后一个字母需是大写，变成驼峰的形式。
* 生命周期钩子函数变成`回调函数`的形式。
* vue没有导出`beforeCreate`、`created`这两个生命周期（代表移除）。
```vue
<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated } from "vue"

onBeforeMount(() => {
  console.warn("---onBeforeMount---")
})
onMounted(() => {
  console.warn("---onMounted---")
})
onBeforeUpdate(() => {
  console.warn("---onBeforeUpdate---")
})
onUpdated(() => {
  console.warn("---onUpdated---")
})
onBeforeUnmount(() => {
  console.warn("---onBeforeUnmount---")
})
onUnmounted(() => {
  console.warn("---onUnmounted---")
})
</script>
```

## 新的生命周期：setup
在vue3中，新增了一个生命周期钩子`setup`，他的执行时间在所有生命周期中最早。当setup执行时，当前的组件还没有被创建，这意味着不能从setup内**this不可用**。
```vue
<script lang="ts">
export default {
  setup() {
    console.log(this) //undefined
  }
}
</script>
```

### setup的返回值
setup返回的对象的**属性**能够被渲染在模板中，对象的**方法**能够绑定在模板事件中。

由于vue3向下兼容vue2，所以当`setup`和`data`、`methods`共存时，setup返回对象的属性和data返回对象的属性会被合并为一个新对象，methods中的方法也是同理。但如果有同名属性冲突，以**setup中的优先**。所以**尽量不要在vue3中混合使用setup、data、methods**。
```vue
<template lang="">
  <div>{{ msg }}</div>
  <button @click="handleClick">click</button>
</template>

<script lang="ts">
import { ref } from "vue"

export default {
  setup() {
    //ref生成响应式数据
    const msg = ref("hello world")
    return {
      msg,
      handleClick: function () {
        msg.value = "hello vue3"
      }
    }
  }
}
</script>
```
:::warning
当setup作为一个`async`函数时，该组件会变为一个 <u>**[异步组件](/vue/vue3/internal.html#suspense)**</u>，因为`async`函数返回的是`Promise`对象。
:::

### setup的参数
setup执行的时候虽然组件还没有创建，但是父组件早已创建完毕（如果有的话），vue在setup中提供了两个参数，来供我们获取父组件传递进来的东西。
* 参数一：**`props`** 对象（获取父组件传递进来的，且**经过props声明的数据**）。
* 参数二：**`context`** 对象，包含以下三个属性。

  * `context.attrs`：获取父组件传递进来的，且**没有经过props声明的所有数据**。
  * `context.emit`：获取父组件传递进来的**自定义事件**。
  * `context.slots`：获取父组件在该组件中传递的**slot插槽**。

```vue
<!-- 父组件 -->
<template lang="">
  <HelloWorld :msg="msg" :msg2="'hello vue3'" @method="method">
    <div>slot content</div>
  </HelloWorld>
</template>

<script lang="ts" setup>
import HelloWorld from "@/components/HelloWorld.vue"
import { ref } from "vue"

const msg = ref("hello world")

const method = (data: any) => {
  console.log(data)
}
</script>

<!-- ------------------------------------------------------- -->

<!-- 子组件 -->
<script lang="ts">
export default {
  //props声明
  props: {
    msg: String
  },
  setup(props, { attrs, emit, slots }) {
    console.log(props.msg) //hello world

    console.log(attrs.msg2) //hello vue3

    emit("method", { name: "tom" }) //触发自定义事件

    console.log(slots.default()) //获取默认插槽
  }
}
</script>
```

## script-setup
一个新的语法糖，目前属于实验阶段，未来可能会有所改动。就是在`<script>`标签内加一个`setup`的属性，成为`<script setup>`，该语法糖方便了许多特性的使用：
* 在整个`script-setup`区域内都相当于在**setup生命周期钩子函数**中。
* 在整个`script-setup`区域内声明的**顶层变量**和**顶层函数**都可以直接在模板中使用。
```vue
<template lang="">
  <div>name:{{ user.name }}</div>
  <div>age:{{ user.age }}</div>
  <button @click="ageChange">click!</button>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, reactive } from "vue"

onBeforeMount(() => {
  console.warn("---onBeforeMount---")
})
onMounted(() => {
  console.warn("---onMounted---")
})

/**
 * ...
 */

console.warn("---setup---") //最早执行

//reactive生成响应式数据
const user = reactive({
  name: "tom",
  age: 18
})

function ageChange(): void {
  user.age++
}
</script>
```