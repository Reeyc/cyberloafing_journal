# 组合、复用

## 混入
混入(mixin) 用于分发组件中的可复用功能。一个mixin对象可以包含任意的组件选项（如`data`、`methods`、生命周期钩子函数等等）。当组件使用了mixin对象时，所有mixin对象的选项将会“**混合**”进入该组件本身的选项。
```js
// @/mixins/example.js

// 导出一个mixin对象
export default {
  data() {
    return {
      msg: "hello"
    }
  },
  created() {
    this.sayHello()
  },
  methods: {
    sayHello() {
      console.log(this.msg)
    }
  }
}
```
在组件中使用：Vue实例提供了一个mixins选项，用于注入mixin对象。
```vue{7,10-12,15-17}
<script>
import example from "@/mixins/example"
export default {
  mixins: [example], //注入mixin对象
  data() {
    return {
      msg: "hello"
    }
  },
  created() {
    this.sayHello()
  },
  mounted() {},
  methods: {
    sayHello() {
      console.log(this.msg)
    }
  }
}
</script>
```

### 选项冲突问题
当组件本身和mixin对象含有同名选项时：
* 值为**对象**的选项，例如`props`、`computed`、`methods`等等，会被合并在同一个对象内。两个对象的键名相同时，<u>**取组件本身内的对象键值对**</u>。

* 同名**钩子函数**则会被合并为一个**数组**，并**依次执行**，<u>**mixin对象**</u>内的钩子函数会**优先**于<u>**组件**</u>本身的钩子函数执行。
```js
// @/mixins/example.js

// 导出一个mixin对象
export default {
  data() {
    return { x: 1 }
  },
  created() {
    console.log("run in mixin")
    this.print()
  },
  methods: {
    print() {
      console.log(`x in mixin：`, this.x)
    }
  }
}

// instace.vue
import example from "@/mixins/example"
export default {
  mixins: [example],
  data() {
    return { y: 2 }
  },
  created() {
    console.log("run in instance")
    this.print()
  },
  methods: {
    print() {
      console.log(`y in instance：`, this.y)
    }
  }
}
```
上面例子中，mixin对象和组件对象的methods选项都有同名`print`方法，取**组件内的print方法**，所以双方执行的都是：
```js
print() {
  console.log(`y in instance：`, this.y)
}
```

双方都有相同的`created`钩子函数，两个钩子函数会被合并到一个数组内依次执行，**先执行mixin对象的再到组件内的**。所以，最终的执行结果是：
```log
run in mixin
y in instance： 2
run in instance
y in instance： 2
```

### 全局混入
Vue构造函数提供一个`mixin`方法，用于创建全局mixin对象，传递的参数就是mixin对象。
```js
Vue.mixin({
  created() {
    console.log(this.$data)
  }
})
```
:::danger
注意：全局混入的mixin对象将来会混入到的每一个vue实例当中，请慎重使用。
:::

## 过滤器
过滤器用作于一些常见文本的格式化，过滤数据再展示，Vue实例的`filters`属性值为一个对象，对象的`key`表示过滤器名字，对象的`value`表示过滤函数，函数内的参数是要过滤的数据。

过滤语法应当插入模板当中。
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
### 全局过滤器
Vue构造函数提供一个`filter`方法，用于创建全局过滤器，在任何地方都能使用的过滤器，参数一是过滤器名字，参数二是过滤函数，用法和局部过滤器基本一致。
```js
//全局过滤器
Vue.filter("globalFilter", function(val, arg) {
  return arg + val
})
```

## 自定义指令
除了`v-model`、`v-show`等内置指令外，Vue还允许我们自定义指令。在Vue中，代码复用的主要形式还是以组件为主，而自定义指令通常用于**操作底层DOM元素**。

Vue实例的`directives`属性值是一个对象，对象的`key`表示自定义指令名字，对象的`value`用于自定义指令的选项。一个指令定义对象提供如下几个钩子函数。

### 钩子函数
:::tip
钩子函数说白了就是生命周期，即当一个指令绑定到一个元素上时，这个元素会经历5个生命周期钩子函数。
:::
* **`bind()`**：当元素节点渲染完毕时触发（初始化）。
* **`inserted()`**：当元素插入到父节点的时候触发（可获取父元素）。
* **`update()`**：当元素的样式、内容发生改变时触发。
* **`componentUpdated()`**：当`update()`执行完毕后触发。
* **`unbind()`**：当元素从DOM中删除时触发。
```vue
<div v-if="show" v-test>{{ msg }}</div>

<script>
export default {
  data() {
    return {
      show: true,
      msg: "hello world"
    }
  },
  directives: {
    test: {
      bind() {
        console.log("初始化")
      },
      inserted() {
        console.log("插入父节点")
      },
      update() {
        console.log("内容更新")
      },
      componentUpdated() {
        console.log("内容更新之后")
      },
      unbind() {
        console.log("元素销毁")
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.msg = "hello vue"
    }, 2000)

    setTimeout(() => {
      this.show = false
    }, 3000)
  }
}
</script>
```

### 钩子函数参数
钩子函数会被传入以下参数：
* **`el`**：指令绑定的DOM元素。
* **`binding`**：一个对象，包含以下信息：
  * `name`：指令名（不含`v-`前缀）
  * `value`：指令绑定的值（例如`v-permission="'admin'"`，`'admin'`就是value值）。
  * `oldValue`：指令绑定的前一个值。
  * `expression`：字符串形式的指令表达式。
  * `arg`：传递给指令的参数（例如`v-permission:add`，`'add'`就是arg值）
  * `modifiers`：一个对象，保存指令的修饰符。
* **`vnode`**：vue编译生成的虚拟节点。
* **`oldVnode`**：上一个虚拟节点。

### 指令值
自定义指令可以给指令赋值，从而在钩子函数内部根据值来对DOM元素进行对应的操作。

下面是一个**判断当前角色是否是admin来渲染按钮**的自定义指令。
```vue
<template>
  <button v-permission="'admin'">add</button>
</template>

<script>
const role = ["admin"]
export default {
  directives: {
    permission: {
      inserted(el, bind) {
        if (!role.includes(bind.value)) {
          el.parentNode.removeChild(el)
        }
      }
    }
  }
}
</script>
```

### 全局指令
和`component`、`mixin`、`filter`一样，`directive`也可以全局注册自定义指令，作用于全部Vue实例。

Vue构造函数提供`directive`方法，参数一是自定义指令名字，参数二是自定义指令选项配置，用法和局部自定义指令基本一致。
```js
Vue.directive("permission", {
  inserted(el, bind) {
    if (!role.includes(bind.value)) {
      el.parentNode.removeChild(el)
    }
  }
})
```

## 插件
插件是vue扩展的终极方案，插件的功能范围没有严格的限制，插件可以用于添加全局方法、指令、过滤器、混入、原型方法等等。

当我们开发一套可复用的功能发布到**github**或者**npm**时，使用插件的方式来开发才是最合适的。如果多次注册相同插件，Vue会自动规避掉相同的，届时多次调用`Vue.use()`也只会注册一次该插件。

像我们常用的 [VueRouter](/vue/vue2/vue_router.md)、[Vuex](/vue/vue2/vuex.md) 都是以插件的形式开发的。

### 使用插件
---
通过全局方法`Vue.use(MyPlugin)`使用插件，该方法的调用必须在`new Vue()`使用应用之前。
```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  // ...
})
```

### 开发插件
vue规定，扩展的插件必须暴露一个`install`方法，方法的第一位参数是Vue构造函数，第二参数是可用于插件配置的**options对象**。将来`Vue.use()`使用插件时，Vue会自动调用该`install`方法。
```js
// @/plugins/MyPlugin

const MyPlugin = {
  install(Vue) {
    /**
     * 添加全局指令
     */
    Vue.directive("preview", { /* ... */ })

    /**
     * 添加全局过滤器
     */
    Vue.filter("formatData", function () { /* ... */ })

    /**
     * 添加全局混入
     */
    Vue.mixin({ /* ... */ })

    /**
     * 添加全局组件
     */
    Vue.component("toast", { /* ... */ })

    /**
     * 添加Vue原型方法
     */
    Vue.prototype.$http = function () { /* ... */ }
  }
}

export default MyPlugin
```
在`new Vue()`之前使用：
```js
// main.js
import MyPlugin from "@/plugins/MyPlugin"
Vue.use(MyPlugin)
```

<Vssue />