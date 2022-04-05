# Vue3响应式
众所周知，在vue2中，vue的数据响应式是通过`Object.defineProperty`这个API劫持数据来实现的。随之而来的弊端为：

* 只能监听对象上**已有的属性**，而对于新增或者删除的属性，则无法实现响应式。
* 数组的响应式需要额外实现。
:::tip
vue内部只实现了`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`等数组API。
:::

```vue
<body>
  <div id="app">
    <p>{{ msg }}</p>
    <p v-for="(item, index) of arr" :key="index">{{ item }}</p>
  </div>
</body>
<script src="https://lib.baomitu.com/vue/2.6.14/vue.min.js"></script>
<script>
  new Vue({
    el: '#app',
    data: function() {
      return {
        // msg: '',
        arr: [1, 2, 3]
      }
    },
    created() {
      this.msg = 'hi~'
      this.arr.push(4)
      setTimeout(() => {
        this.msg = 'vue' //不会响应
        this.arr[0] = 100 //不会响应
      })
    }
  })
</script>
```

## Proxy
vue3中的数据响应式是使用ES6`Proxy`来实现的，`new Porxy(target,handler)`返回一个代理对象。
* 参数一：需要代理的的对象。
* 参数二：定义代理对象的行为，里面包含`get`、`set`、`deleteProprety`等方法。

其实，`Object.defineProperty()`和`Proxy`的最终目的都是为了劫持属性，监听属性变化来更新数据和视图，实现响应式系统。

Proxy返回来的才是代理对象，所以在vue3的响应式系统中，数据操作都是以返回来的代理对象为主。
:::warning
操作代理对象同时也会影响到源对象（**Reflect反射**）。
:::



`Proxy`较`Object.defineProperty()`的优势在于，Proxy解决了vue2中的弊端：在对象上新增、删除属性，在数组中操作下标都会触发更新。
```vue
<template lang="">
  <span>{{ obj.msg }}</span>
  <span>{{ arr[0] }}</span>
</template>

<script lang="ts" setup>
import { reactive } from "vue"

const obj: any = reactive({})
const arr: any = reactive([])

obj.msg = "hello"
arr[0] = "vue3"

console.log(obj)
</script>
```
上例子中，vue内部将返回来的`obj`、`arr`包装成代理对象，当我们操作代理对象的属性时，就会触发其内部的`get`、`set`等方法，从而更新实现响应式系统。

<Vssue />