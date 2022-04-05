# 组件化

组件可以简单理解为一段html元素，只不过这段元素是由Vue实例模板渲染出来的，可以随心所欲的操控这段元素，并且重复使用，这样一来，多个组件就可以构成一个应用。一个web应用可以使用多个独立的、可复用的小组件来构成，任意的应用界面都可以抽象为一个组件树。

例如：Vue的实例都可以看作是一个组件，最初始的`new Vue()`可以看做是一个根组件。

---

**组件开发的优点**
* 提高开发效率
* 方便重复使用
* 简化调试步骤
* 提升项目整体的可维护性
* 便于多人协同开发

根据规范，建议所有组件的名字都要以**大写字母**开头，为了容易区分这是组件，组件的名字不能和原生**html标签**的名字一样，否则会报错，因为组件也是以标签的形式写到模板之中的，跟html标签一样，容易起冲突。

## 局部组件

### 声明
局部组件是一个对象，这个对象就是Vue实例的**options**，可以有`data`，`template`等等一系列的属性。
```js
//1.声明
var App = {
  data() {
    return {
      msg: "hello world"
    }
  },
  template: `<div>我是App组件</div>`
}
```
:::warning
组件对象的`data`必须是一个函数返回一个对象，这样做的目的是：组件是可以被复用的，但是每个组件都应该有自己独立的数据，而不跟其他的组件数据有所关联，所以组件每次调用`data`函数，都会返回一个全新的对象引用，使得对象与别的组件对象毫无关联。
:::

### 挂载
将这个组件对象挂载到Vue实例上，Vue实例的`components`属性返回一个对象，对象中包含着每个组件的名字。`key：组件名`、`value：组件对象`。
```js
new Vue({
  el: "#app",
  components: {
    App: App //2.挂载
  }
})
```

### 使用
挂载完毕后，Vue实例已经能接收到这个组件了，把这个组件放到模板里面，模板里面的标签名就是声明组件时，组件对象所对应的**key**名。
```vue
<div id="app">
  <App></App> <!-- 3.使用 -->
</div>
```

## 全局组件
全局组件也叫公共组件，它可以在任何地方被调用，不仅仅是根组件模板内，也可以是局部组件模板内。\
全局组件的注册和挂载，统一为一个步骤：通过`Vue.component()`方法。
* 参数一：全局组件名
* 参数二：全局组件
因为全局组件在定义时就已经挂载到了Vue实例上，因此不必再到`components`里面挂载它。
```vue
<template>
  <div id="app">
    <Global></Global>
  </div>
</template>

<script>
//全局组件
Vue.component("Global", {
  template: `<div>我是全局组件</div>`
})
</script>
```

## 组件通信方案

### props、$emit
当组件A内部含有组件B，那么组件B就是组件A的子组件，同理，组件A是组件B的父组件。

* **父组件向子组件传值**

父组件在模板通过`v-bind`向子组件绑定数据，子组件定义`props`属性，取值为一个数组或对象，数组里的每一个元素都是父组件传递过来的自定义属性名，然后就可以使用数据了。
```js
//父组件
var App = {
  data() {
    return {
      msg: "Hello Child"
    }
  },
  //1.父组件在子组件模板内绑定数据
  template: 
  `<div>
     <Global :prop='msg'></Global>
     <div> 我是App组件 </div>
   </div>`
}

//子组件
Vue.component("Global", {
  template: `<div>我是全局组件</div>`,
  props: ["prop"], //2.子组件通过prop接受数据
  mounted() {
    console.log(this.prop) //Hello Child
  }
})
```
:::warning
Vue建议，子组件不要轻易修改父组件传递过来的值，因为父组件中有可能不只一个子组件，如果别的子组件也引用了这些数据，就会造成数据不正常的情况。想要修改的话：
* 子组件通过`$emit`触发自身事件，通知父元素来修改数据。
* 父组件给子组件绑定数据的时候，使用`.sync`修饰符。
:::

---

**props类型校验**

组件内的`props`属性不仅可以是一个数组，还可以是一个对象，主要用作于数据校验。
* `key`：父组件传递过来的数据名称。
* `value`：一个校验对象，对象内的一系列属性用作于数据校验。
   * `type`：规定的数据类型，例如`String`。
   * `required`：是否必须存在，`false`表示该数据可有可无，`true`表示该数据必须存在。
   * `default`：数据默认值，若传递过来的数据为空，则默认使用该值。
   * `validator`：一个方法，方法内的参数是数据，可以返回一个更深层次的校验。
```js
props: {
  data: {
    type: String,
    required: false,
    default: "defaule value",
    validator(value) {
      return value.length < 5
    }
  }
}
```
校验结果如果对不上，则Vue会报出一个警告，表示传过来的数据不符合预期。

* **子组件向父组件传值**

Vue实例的`$emit`方法用于触发实例上的自定义事件。
* 参数一：要触发的事件名
* 参数二：将参数传递给事件的响应函数
父组件在加载子组件标签时，我们给这个子组件标签绑定一个自定义事件，事件响应函数设定在父组件之内，而子组件就触发这个给自己绑定的自定义事件，并传递参数进去，如此一来，父组件内的事件响应函数就可以拿到数据了。
```js
//父组件
var App = {
  //1.父组件在子组件标签内绑定事件
  template: 
  `<div>
    <Global @custom='handle'></Global>
    <div> 我是App组件 </div>
   </div>`,
  methods: {
    //2.响应函数设定在自己内部
    handle(data) {
      console.log(data)
    }
  }
}

//子组件
Vue.component("Global", {
  data() {
    return {
      msg: "Hello Parent"
    }
  },
  template: `<div>我是全局组件</div>`,
  mounted() {
    //3.子组件触发这个给自己绑定的事件，并传递数据
    this.$emit("custom", this.msg)
  }
})
```

### $on、$emit
`$on + $emit`，就是 **发布-订阅** 的模式，也叫作观察者模式，这种通信方式比较灵活，不仅父子组件之间可以通信，平行组件之间也可以通信。

`$on`用于给实例绑定自定义事件，`$emit`则用于触发实例上的自定义事件。\
新建一个中间件，当任意两个组件通信时，这个中间件就负责代理双方组件的通信。可能多个组件会用到这个实例，所以建议定义到`Vue.prototype`原型上去。
```js
// main.js
Vue.prototype.$bus = new Vue(); //代理通信
```
订阅方通过`this.$bus.$on`给这个实例绑定自定义事件，并从它的事件响应函数里取数据。\
发布方通过`this.$bus.$emit`触发这个实例的自定义事件，并传递参数过去。
```vue
<div id="app">
  <V_nav></V_nav>
  <V_aside></V_aside>
</div>

<script>
//代理实例
Vue.prototype.$bus = new Vue()

var V_nav = {
  template: `<div @click='handleClick'>我是A组件</div>`,
  methods: {
    handleClick() {
      //触发代理实例上的handle，并传递参数
      this.$bus.$emit("handle", "Hello Brother!")
    }
  }
}

var V_aside = {
  template: `<div>我是B组件</div>`,
  created() {
    //给代理实例绑定handle，并接受参数
    this.$bus.$on("handle", function(data) {
      alert(data)
    })
  }
}
</script>
```

<Vssue />