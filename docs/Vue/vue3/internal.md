# 内置组件

## Teleport
传送门组件，可以**将组件内的DOM结构传送到组件外指定的节点中**。传统的组件被渲染后，组件内的DOM元素一般都会被渲染在组件的位置中。而被`Teleport`组件包裹的DOM元素，可以被指定渲染到组件之外的DOM节点上。

最常见的例子就是`Model`、`Dialog`之类的弹窗，通常都是渲染到body的子级中，此时用`Teleport`组件刚好合适。

组件有一个`to`属性，接收一个**CSS选择器字符串**或者一个**DOM节点**。下面是一个将`dialog`渲染到`body`下面的例子。
```vue
<template lang="">
  <button @click="visible = true">open</button>

  <Teleport to="body">
    <!-- dialog会被渲染到body下面 -->
    <div v-if="visible" class="dialog">
      <h2>this is a dialog!!!</h2>
      <button @click="visible = false">close</button>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const visible = ref(false)
</script>

<style scoped>
.dialog {
  width: 300px;
  height: 200px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  border: 2px solid #000;
}
</style>
```

## Suspense
用于管理异步组件。使用`Suspense`组件包裹一个异步组件，当异步组件还未加载出来时，Suspense可以**定义异步组件的加载状态**。这种功能类似于图片未加载完毕时，出现的预加载图标。

Suspense组件提供两个插槽：`#default`和`#fallback`，当`#default`插槽中的节点未加载完毕，将显示`#fallback`后备插槽中的节点。
```vue
<template lang="">
  <Suspense>
    <template #default>
      <HelloWorld></HelloWorld>
    </template>
    <!--当default插槽未加载完毕时，加载fallback后备插槽-->
    <template #fallback>
      <h2>loading...</h2>
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue"

// defineAsyncComponent声明异步组件
const HelloWorld = defineAsyncComponent(() => import("@/components/HelloWorld.vue"))
</script>
```

:::warning
setup函数用于返回一个对象供模板使用，但如果setup函数返回的是`Promise`对象，那么该组件就会自动变成**异步组件**。
```vue
<!-- @/components/HelloWorld.vue -->
<template lang="">
  <h1>{{ msg }}</h1>
</template>

<script lang="ts">
export default {
  setup() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          msg: "hello world"
        })
      }, 1000)
    })
  }
}
</script>
```
如果使用的是`script-setup`语法糖的写法，那么顶层的`await`指令也会让该组件自动变成**异步组件**。
```vue
<!-- @/components/HelloWorld.vue -->
<template lang="">
  <h1>{{ data.msg }}</h1>
</template>

<script lang="ts" setup>
const data = await myPromise()

function myPromise() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        msg: "hello world"
      })
    }, 1000)
  })
}
</script>
```
:::

<Vssue />