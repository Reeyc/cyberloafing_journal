# 实例基本属性
任何的Vue实例都是通过Vue函数构建的，Vue实例在初始化时，需传入一个选项对象，对象的一系列属性用于配置Vue实例。

想要访问Vue实例的属性，需要给该属性带有`$`前缀，例如`vm.$data`，Vue这么设计的目的是为了与用户自定义的属性区分开。
```vue
<script>
export default {
  data() {
    return {
      data: "Hello World"
    };
  },
  methods: {
    methods() {
      console.log("Hello Vue");
    }
  },
  created() {
    console.log(this.data); //获取'Hello World'
    console.log(this.$data); //获取data数据对象

    console.log(this.methods); //获取methods函数
  }
};
</script>
```
:::tip
Vue仅暴露一些常用的实例属性，例如`$data`、`$el`、`$props`等等
:::

## el
Vue实例使用的根元素，表示Vue将接管这个Dom元素。该属性通常只在根实例上使用，也就是`new Vue()`的时候，后续的一系列子组件挂载到根组件上，所以一般不需要`el`属性。
```vue
<!-- 渲染 Hello World -->
<template>
  <div id="app">{{ 'Hello World' }}</div>
</template>
<script>
  new Vue({
    el: '#app' //Vue将接管id=app这个Dom的区域
  });
</script>
```

## template
Vue实例渲染的模板，该模板的优先级比`el`指定的Dom优先级要高。`template`指定的Dom元素，前后必须有闭合标签，允许是单闭合标签。
```vue
<!-- 渲染 Hello Vue -->
<template>
  <div id="app">{{ 'Hello World' }}</div>
</template>
<script>
  new Vue({
    el: '#app', 
    template:`<div> Hello Vue </div>`
  });
</script>
```

## methods
Vue实例的方法，Vue将`methods`里面的所有方法都拷贝到Vue实例上，因此直接访问**实例.方法**也是可以访问到的。
```vue
<template>
  <div id="app"></div>
</template>
<script>
  const vm = new Vue({
    el: '#app',
    methods: {
      method() {
        console.log(1);
      }
    },
  });
  console.log(vm.method); //访问method方法
</script>
```

## data
Vue实例的数据，其代理了Vue的数据访问，当访问**实例.key**时会访问到**实例.data.key**。
```vue
<template>
  <div id="app" @click="handleClick">get data</div>
</template>
<script>
const vm = new Vue({
  el: "#app",
  data() {
    return {
      msg: "Hello World"
    }
  },
  methods: {
    handleClick() {
      console.log(this.msg) //'Hello World'
    }
  }
})
console.log(vm.msg) //'Hello World'
</script>
```
:::warning
data的数据必须是由一个函数返回，否则使用一个纯对象来声明data数据，那么所有的实例都会通过引用共享这个data对象，导致对象被修改时实例之间数据互相污染。
:::

## watch
监听单个数据发生的变化，当变化自动触发侦听器。侦听器是一个方法，参数一是变化后的值，参数二是变化前的值。
```vue
<template>
  <div id="app" @click="handleClick">{{ msg }}</div>
</template>
<script>
new Vue({
  el: "#app",
  data() {
    return {
      msg: "Hello World"
    }
  },
  methods: {
    handleClick() {
      this.msg = "Hello Vue"
    }
  },
  watch: {
    msg(newVal, oldVal) {
      //侦听数据msg的变化
      alert(`msg从 ${oldVal} 变为了 ${newVal} `)
    }
  }
})
</script>
```
### 深度监听
如果数据是引用类型的话，修改该数据的属性值，不会触发监听器，因为数据的引用没有发生变化。\
此时可以使用`deep`深度监听，深度监听时，侦听器不再是一个方法，而是一个对象，对象名为要侦听的数据，对象内部：
* `handler`：对应一个函数，数据变化触发函数，函数的参数也是新值和旧值。
* `deep`：对应一个布尔值，取值为`true`，表示数据变化时，触发`handler`方法。
```vue
<template>
  <div id="app" @click="handleClick">Change!</div>
</template>
<script>
new Vue({
  el: "#app",
  data() {
    return {
      obj: { key: "value" },
      arr: [100, 200, 300]
    }
  },
  methods: {
    handleClick() {
      this.obj.key = "bar"
      this.arr[0] = 999
    }
  },
  watch: {
    "obj.key": {
      //直接侦听属性
      handler(newVal, oldVal) {
        console.log(`obj.key从 ${oldVal} 变为了 ${newVal} `)
      },
      deep: true
    },
    "arr[0]": {
      //Error
      handler(newVal, oldVal) {
        console.log(`arr[0]从 ${oldVal} 变为了 ${newVal} `)
      },
      deep: true
    }
  }
})
</script>
```
:::warning
数组无法侦听索引元素变化，可以使用数组的API或者`Vue.set`来修改数组
```vue
<template>
  <div id="app" @click="handleClick">Change!</div>
</template>
<script>
new Vue({
  el: "#app",
  data() {
    return {
      arr: [100, 200, 300]
    }
  },
  methods: {
    handleClick() {
      this.$set(this.arr, 0, 999)
    }
  },
  watch: {
    arr(newVal, oldVal) {
      console.log(`arr[0]从 ${oldVal} 变为了 ${newVal} `)
    }
  }
})
</script>
```
:::

## computed
处理一些复杂的计算方法，求值的方式依赖于数据进行缓存，数据没变化，就不会重新求值。计算属性本质上是属性，是ES6的getter，所以访问的时候不能加`()`。
```vue
<template>
  <div id="app">{{ reverse }}</div>
</template>
<script>
new Vue({
  el: "#app",
  data() {
    return {
      msg: "Hello World"
    }
  },
  computed: {
    reverse() {
      return this.msg
        .split("")
        .reverse()
        .join("")
    }
  }
})
</script>
```
:::tip
`computed`默认只有`getter`，没有`setter`，也就是说如果修改，`setter`要自己加上去，加了`setter`之后，计算属性完整的写法应该是这样的
```vue
<template>
  <div id="app" @click="handleClick">{{ reverse }}</div>
</template>
<script>
new Vue({
  el: "#app",
  data() {
    return {
      msg: "Hello World"
    }
  },
  methods: {
    handleClick() {
      this.reverse = "Hello Vue"
    }
  },
  computed: {
    reverse: {
      get() {
        return this.msg
          .split("")
          .reverse()
          .join("")
      },
      set(val) {
        console.log(`触发setter，将数据修改为 ${val}`)
      }
    }
  }
})
</script>
```
:::

## filters
过滤数据再展示，对应一个对象，对象的`key`表示过滤器名字，对象的`value`表示过滤函数，函数内的参数是要过滤的数据。过滤语法应当插入模板当中。
> 语法： 数据 | 过滤器
```vue
<template>
  <div id="app">
    <input type="text" v-model="money" />
    <h1>{{ money | handleMoney }}</h1>
  </div>
</template>

<script>
new Vue({
  el: "#app",
  data() {
    return {
      money: ""
    }
  },
  filters: {
    handleMoney(val) {
      return "$" + val //过滤money再展示
    }
  }
})
</script>
```
过滤器是一个函数，它也可以以函数的形式调用，传递的参数在函数内，过滤数据参数的下一个参数。
```vue
<template>
  <div id="app">
    <input type="text" v-model="money" />
    <h1>{{ money | handleMoney('.00') }}</h1>
  </div>
</template>

<script>
new Vue({
  el: "#app",
  data() {
    return {
      money: ""
    }
  },
  filters: {
    handleMoney(val, suffix) {
      return "$" + val + suffix //过滤money再展示
    }
  }
})
</script>
```
### Vue.filter
全局过滤器，在任何地方都能使用的过滤器，参数一是过滤器名字，参数二是过滤函数，用法和局部过滤器基本一致。
```js
//全局过滤器
Vue.filter("globalFilter", function(val, arg) {
  return arg + val
})
```
---

Vue还有更多实例的属性，需要请上[Vue](https://cn.vuejs.org/v2/api/#data)官网查阅。