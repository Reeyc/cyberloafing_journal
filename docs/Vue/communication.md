# 组件通信汇总
vue是数据驱动视图更新的框架，对于vue来说组件间的数据通信尤为重要。

## props、$emit
父传子：父给子通过自定义属性绑定数据，子内部通过`props`接收父传递过来的属性。`props`可以是对象也可以是数组，对象可以开启`props`校验。
```vue
<!-- parent.vue -->
<template>
  <child :data="data"></child>
</template>

<script>
import child from "./children/child"
export default {
  data() {
    return { data: "hello world" }
  }
}
</script>
```
```vue
<!-- child.vue -->
<script>
export default {
  props: ["data"]
}
</script>
```
:::warning
子内部不能直接修改父传递过来的值，所有修改都会失效并发出警告，因为父有可能将该值传递给多个子组件，从而可避免数据异常。如有需求，父组件请使用`.sync`修饰符绑定数据。
:::

---

子传父：父通过自定义事件给子绑定事件，并在自己内部定义事件响应函数。子通过`$emit`触发绑定在自身的事件，并传递数据给事件响应函数。
```vue
<!-- parent.vue -->
<template>
  <!-- 给子元素绑定hello事件 -->
  <child @hello="world"></child>
</template>

<script>
import child from "./children/child"
export default {
  methods: {
    //在自己内部定义事件响应函数
    world(data) {
      console.log(data)
    }
  }
}
</script>
```
```vue
<!-- child.vue -->
<script>
export default {
  data() {
    return { data: "hello vue" };
  },
  mounted() {
    // 触发自己的hello事件，把data数据传递出去
    this.$emit("hello", this.data);
  }
};
</script>
```

## $children、$parent
* 父通过`$children`可以获取到所有的子组件实例（数组）。
* 子通过`$parent`可以获取到父组件实例（对象）。

能获取到实例了，也就代表了可以访问其内部任意属性了。
```vue
<!-- parent.vue -->
<template>
  <child></child>
</template>

<script>
import child from "./children/child"
export default {
  data() {
    return { msg: 99 }
  },
  mounted() {
    //this.$children[0] -> child实例
    this.$children[0].hello = "vue"
  }
}
</script>
```
```vue
<!-- child.vue -->
<script>
export default {
  data() {
    return { hello: "world" }
  },
  mounted() {
    //this.$parent -> parent实例
    console.log(this.$parent.msg) //99
  }
}
</script>
```
:::warning
需注意边界情况，如在`#app`上拿`$parent`得到的是`new Vue()`的根实例，在这实例上再拿`$parent`得到的将是`undefined`。而在最底层的子组件拿`$children`则是个空数组。
:::

## provide、inject
父通过`provide`提供数据，子通过`inject`注入数据。不论子组件嵌套有多深, 只要调用了`inject`那么就可以注入`provide`中的数据，类似穿透的效果。
```vue
<!-- parent.vue -->
<template>
  <child></child>
</template>

<script>
import child from "./children/child"
export default {
  provide: { hello: "world" }
}
</script>
```
```vue
<!-- child.vue -->
<script>
export default {
  inject: ["hello"],
  mounted() {
    console.log(this.hello);
  }
};
</script>
```
上面例子中，如果`child`子组件还有子组件的话，那么它的子组件获取`provide`数据的方式和它是一样的。

`provide`也可以是一个函数返回，这样还能方便的返回data中的数据。
```js
provide: () => {
  return { msg: this.msg }
},
```
:::warning
`provide`和`inject`绑定并不是可响应的。也就数说，通过`inject`注入的数据，并不能随着`provide`数据的变化而变化。
:::

## $refs、ref
`ref`可在模板中绑定标签，其绑定的值可以通过实例的`$refs`属性引用。

* 如果绑定的是**普通标签**，`this.$refs.xxx`为该标签的**DOM元素**引用。
* 如果绑定的是**组件**，`this.$refs.xxx`为该组件的**实例**引用。
```vue
<!-- parent.vue -->
<template>
  <child ref="comChild"></child>
</template>

<script>
import child from "./children/child"
export default {
  mounted() {
    this.$refs.comChild.hello()
  }
}
</script>
```
```vue
<!-- child.vue -->
<script>
export default {
  methods: {
    hello() {
      alert("world")
    }
  }
}
</script>
```

## EventBus
**EventBus**又称事件总线，采用 **发布-订阅** 的设计模式，在vue中可以使用它来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以通知其他组件。

换言之，**EventBus**不仅限于父子组件间的通信，所有平行组件（非父子组件）都可以用它通信，这也是它的缺点，当项目较大，就容易造成难以维护的灾难。

注册一个vue实例当作事件中心，挂载到vue原型上面，用于承载所有事件的发布和订阅通知。
```js
// main.js
Vue.prototype.$bus = new Vue()
```
发布订阅：
```js
// a.vue
export default {
  mounted() {
    //$on，给$bus订阅sayHello事件
    this.$bus.$on("sayHello", data => console.log(data))
  }
}

// b.vue
export default {
  mounted() {
    //$emit，给$bus发布sayHello，将参数"world"传递进去
    this.$bus.$emit("sayHello", "world")
  }
}
```
移除绑定的事件：
```js
this.$bus.$off("sayHello", { })
```

## $attrs、$listeners
实例的`$attrs`属性是一个对象，该保存了其他组件挂载在该组件上，且没有经过`props`声明的的所有数据。\
这些数据还会挂载到实例的DOM根元素上，实例的`inheritAttrs: false`可以关闭挂载这些数据。
```vue
<template>
  <child :name="name" :age="age" :gender="gender"></child>
</template>

<script>
import child from "./children/child"
export default {
  data() {
    return {
      name: "vue",
      age: 2,
      gender: "unknown"
    }
  }
}
</script>
```
```vue
<script>
export default {
  props: ["name", "age"], //name、age经过props声明
  mounted() {
    console.log(this.$attrs) //{ gender:"unknown" }
  }
}
</script>
```

## Vuex
Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

具体参考 [Vuex](/Vue/vuex.md)。