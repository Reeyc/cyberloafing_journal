# VueRouter

## 路由的基本使用
1. 安装并引入`vue-router`插件，该插件返回一个`VueRouter`构造函数。
```sh
npm i vue-router -S
```
```js
import Vue from "vue"
import VueRouter from "vue-router"
```
2. Vue使用该路由插件，将插件返回的`VueRouter`传递进Vue之中。
:::tip
使用第三方插件的时候，要调用`Vue.use()`来使用，并传递这个插件返回的对象
```js
Vue.use(VueRouter)
```
:::
3. 利用`VueRouter`类创建全局路由器，参数传递一个选项对象，返回一个全局路由器。
全局路由器创建出来后，将它挂载到Vue实例中，让所有Vue的组件都能使用路由功能。
```js
// 1.Vue使用路由插件
Vue.use(VueRouter)

// 2.创建路由器对象
var router = new VueRouter({
  // option...
})

new Vue({
  //3.vue实例关联路由对象
  router: router
})
```
4. 配置路由器，选项对象内有一个属性`routes`，取值为对象数组，里面的每个对象官方称为**路由记录**。路由记录的一系列属性用来配置路由信息。
   - **`path`**：定义路由路径，也就是锚点值。
   - **`component`**：定义路由对应的组件。
   - ...

当页面上的锚点值和属性`path`的锚点值相匹配时，加载`component`指向的组件。
```js
//全局路由器对象
var router = new VueRouter({
  //routes数组，配置路由信息
  routes: [
    //路由记录
    { path: "/login", component: Login }, //当锚点为/login时，加载Login组件
    //路由记录
    { path: "/register", component: Register } //当锚点为/register时，加载egister组件
  ]
})
```
5. 路由配合模板。当Vue使用`Vue-router`这个插件时，`Vue-router`会抛出两个全局组件，这两个组件配合模板一起使用。
* `<router-link> </router-link>`\
  该组件在模板中渲染时，会渲染成一个`a`标签，它的`to`属性会渲染成`a`标签的`href`属性。
* `<router-view> </router-view>`\
  该组件在模板中渲染时，会渲染成路由对象属性`component`对应的那个组件。
```js
// router.js
import Vue from "vue"
import Router from "vue-router"

import Index from "@/pages/Index/Index"
import Music from "@/pages/Music/Music"
import Movie from "@/pages/Movie/Movie"

Vue.use(Router)

export default new Router({
  routes: [
    { path: "/index", component: Index },
    { path: "/music", component: Music },
    { path: "/movie", component: Movie }
  ]
})
```
```vue
<template>
  <div>
    <router-link to="/index">首页</router-link>
    <router-link to="/music">音乐</router-link>
    <router-link to="/movie">电影</router-link>
    <router-view></router-view>
  </div>
</template>
```

## 命名路由
在路由记录中：属性`name`表示给该路由起一个名字。

在`<router-link>`组件内：通过`v-bind`绑定`to`属性，指向一个对象。对象内有一个属性`name`，指向路由记录中设置的`name`值，也就是路由名字，此时组件会自动找这个路由匹配规则对象的`path`属性，而不需要再手动写地址。
```js
//router.js
export default new Router({
  routes: [
    { path: "/index", name: "index", component: Index },
    { path: "/music", name: "music", component: Music },
    { path: "/movie", name: "movie", component: Movie }
  ]
})
```
```vue
<template>
  <div>
    <router-link :to="{ name: 'index' }">首页</router-link>
    <router-link :to="{ name: 'music' }">音乐</router-link>
    <router-link :to="{ name: 'movie' }">电影</router-link>
    <router-view></router-view>
  </div>
</template>
```

## 命名视图
在模板中，`<router-view>`表示视图，对应着该模板内所有路由的出口，也就是说视图默认只能加载一个。要想加载多个，除了只能用嵌套路由之外，还可以给视图命名。
```vue
<template>
  <div>
    <router-view name="index"></router-view>
    <router-view name="music"></router-view>
    <router-view name="movie"></router-view>
  </div>
</template>
```
在路由记录中，属性`components`对应一个键值对对象，表示多个视图分别要渲染的组件。
* `key`表示视图的`name`。
* `value`表示视图要渲染的组件。
```js
export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      //多个router-view分别要渲染的组件
      components: {
        index: Index,
        music: Music,
        movie: Movie
      }
    }
  ]
})
```
没有设置`name`的视图默认值为`default`，如果不想给视图设置`name`，又想加载对应的组件，则给这个组件一个`key`为`default`即可。
```js
export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      components: {
        default: Music, //没有name的router-view要加载的组件
        index: Index,
        music: Music,
        movie: Movie
      }
    }
  ]
})
```
```vue
<template>
  <div>
    <router-view name='index'></router-view> <!--加载Index-->
    <router-view name='music'></router-view> <!--加载Music-->
    <router-view name='movie'></router-view> <!--加载Movie-->
    <router-view></router-view> <!--加载Music-->
  </div>
</template>
```
:::warning
如果一个路由记录中定义了`components`，则渲染时不会再去找`component`。
:::

## 动态路由参数
在路由记录的`path`属性里，以冒号`:`拼接一个自定义`key`值。
```js
export default new Router({
  routes: [
    {
      path: "/index/:id", //:拼接id
      name: "index",
      component: Index
    }
  ]
})
```
在`<router-link>`组件中，`to`属性对应的对象，有一个属性`params`，对应一个键值对对象。

* **`key`**：对应在路由记录中的`path`属性拼接的`key`值。
* **`value`**：传递的参数。

Vue渲染的时候，不会把**Key**也渲染上去：`xxx.html#/user/1`。
```vue
<template>
  <div>
    <router-link :to="{ name: 'index', params: { id: 'music' } }">跳转</router-link>
    <router-view></router-view>
  </div>
</template>
```
:::tip
这种方式必须是命名路由，因为它依靠`name`值来关联对应的路由，从而找到对应路由的`path`。

但是你也可以自己定义`path`，如果定义了`path`的话，`params`将会失效，因为优先解析`to`对象中的`path`，而不是路由记录的`path`，`params`的参数只有在路由记录中的`path`内通过冒号`:`绑定才有效。如此你只能舍弃`params`，手动写完整的`path`参数，但是显然没有`params`来得方便。
:::
```vue
<router-link :to="{ path: `/index/${id}` }">跳转</router-link>
```
:::warning
如果定义了`path`又定义了`name`，那么`path`会失效。优先级：**`name > path > params`**。`name`和`params`不会冲突，通常是它们两一块使用，`path`则定义在路由记录内。
:::

## 路由查询参数
在`<router-link>`组件中，`to`属性对应的对象，有一个属性`query`，也对应一个键值对对象。

* **`key`**：查询参数的**key**。
* **`value`**：查询参数的**value**。

Vue渲染的时候，会把**Key**也渲染上去：`xxx.html#/user/?id=1`。
```vue
<template>
  <div>
    <router-link :to="{ query: { id: '1' } }">跳转</router-link>
    <router-view></router-view>
  </div>
</template>
```

## 路由信息对象
路由的`to`属性对应一个对象，对象中保存了命名路由的`name`、动态路由的参数、查询路由的参数...等等一系列路由相关的信息。

在使用`vue-router`插件的时候，它不仅会抛出两个全局组件，还抛出一个路由信息对象`route`，该对象自动关联在Vue的原型上。它包含了当前路由的相关信息，每当路由变化，它在根组件上也会随之变化，因此可以`watch`来侦听这个`route`对象。
```vue
<template>
  <div>
    <router-link :to="{ query: { id: '1' } }">跳转</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  watch: {
    $route(to, from) {
      console.log("路由发生了变化")
    }
  }
}
</script>
```

### 路由信息对象属性
 * **`path`**：当前路由的路径，不含查询参数。
 * **`fullpath`**：当前路由完整由路径，包含查询参数。
 * **`name`**：路由名称。
 * **`params`**：动态路由参数。
 * **`query`**：路由查询参数。
 * **`hash`**：路由hash值。
 * **`meta`**：保存字段信息。
 * 更多属性请查阅[官网](https://router.vuejs.org/zh/api/#路由对象属性)...

## 嵌套路由
在某个路由加载的组件之中，又有别的路由，这种情况叫做嵌套路由。简单点说，就是要在外层路由中加载各种内层路由。

在路由记录中，有一个属性`children`，取值为一个对象数组，里面的对象就是内层路由的路由记录。它们跟外层路由记录一样，也拥有各自的`path、name、component`等等，内层路由的`path`会自动**拼接**外层路由的`path`，当拼接后的路由匹配上时，加载对应的内层路由。

:::warning
内层路由配置`path`路径，不能像外层一样使用`/`号，否则会被当成绝对路径（根路径）
:::

嵌套路由的使用分为两种情况：

**内层路由的结构不一样**
```js
export default new Router({
  routes: [
    {
      path: "/index",
      name: "index",
      component: Index,
      children: [
        {
          path: "music", //不能加 / 号，否则path的值为绝对路径
          name: "music",
          component: Music
        },
        {
          path: "movie",
          name: "movie",
          component: Movie
        }
      ]
    }
  ]
})
```
```vue
<!-- App.vue根组件 -->
<template>
  <div>
    <router-link :to="{ name: 'index' }">跳转到首页</router-link>
    <router-view /> <!-- 外层路由出口 -->
  </div>
</template>

<!-- Index.vue外层组件 -->
<template>
  <div>
    <div>首页</div>
    <router-link :to="{ name: 'music' }">跳转到音乐</router-link>
    <router-link :to="{ name: 'movie' }">跳转到电影</router-link>
    <router-view /> <!-- 内层路由出口 -->
  </div>
</template>
```

**内层路由的结构一样，只是数据不同**

这种情况完全没有必要像上面那样定义一个个组件，再通过配置一个个路由来加载一个个组件，反而降低开发效率。

在结构一模一样的情况下，应该定义一个组件，这个组件相当于一个渲染模板。监听路由变化时，动态修改组件的内容即可，这种方式也叫做**动态路由匹配**。这种模式和公共组件的复用很类似，所以这种动态路由会多用于公共组件上。
* 监听路由变化：`watch`、`导航守卫`。
* 传递数据：路由出口相当于要渲染的子组件，可以通过组件传参的方式传递动态路由参数给这个视图渲染的子组件。
```js
export default new Router({
  routes: [
    {
      path: "/index",
      name: "index",
      component: Index,
      children: [
        {
          //渲染模板组件
          name: "comDesc",
          path: "/home/:id", //传递一个动态路由参数，让watch监听参数变化作相应
          component: ComDesc
        }
      ]
    }
  ]
})
```
```vue
<!-- Index.vue外层组件 -->
<template>
  <div>
    <div>首页</div>
    <router-link :to="{ name: 'comDesc', params: { id: '音乐' } }">音乐</router-link>
    <router-link :to="{ name: 'comDesc', params: { id: '电影' } }">电影</router-link>
    <router-view :newData="msg" /> <!--父子组件通信-->
  </div>
</template>
<script>
export default {
  data() {
    return { msg: "" }
  },
  watch: {
    $route(to, from) {
      this.msg = to.params.id //当动态路由参数发生变化，取出变化的参数，传递给子组件
    }
  }
}
</script>

<!--模板组件-->
<template>
  <div>{{ newData }}</div>
</template>

<script>
export default {
  props: ["newData"],
  created() {
    console.log("组件生命周期只走一圈")
  }
}
</script>
```
:::tip
这种方式复用的组件不会重新走一圈生命周期钩子，也就是不会重复的创建、销毁
:::

## 编程式导航
导航可以理解为跳转的意思，上面跳转路由都是通过`<router-link to='...'>`的方式，这种方式称作**声明式导航**，它的底层原理是调用了**history对象**的一系列API，例如：`history.pushState、history.replaceState、history.go`等等...

Vue封装改造了这些原生的API，存放在全局路由器对象`router`中，该对象自动挂载到Vue原型上，可以通过`this.$router.xxx()`调用这些API来实现路由的跳转。这种方式叫做**编程式导航**。

---

* **`router.push(location)`**：url追加信息，并添加进历史列表之中。
   * `location`：在url后追加的信息。可以是一个普通的字符串路径，也可以传递一个对象，对象不仅可以用于描述url信息，还可以添加参数，这个对象和声明式导航中`to`属性所指向的对象一样。

例如：原地址 <u>https://www.baidu.com</u> ，调用`$router.push('/home')`跳转到地址为 <u>https://www.baidu.com/home</u> 。
```vue
<template>
  <div>
    <button @click="locationIndex">首页</button>
    <button @click="locationMusic">音乐</button>
    <button @click="locationMovie">电影</button>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  methods: {
    locationIndex() {
      this.$router.push({ path: "/index" })
    },
    locationMusic() {
      this.$router.push({ path: "/music" })
    },
    locationMovie() {
      this.$router.push({ path: "/movie" })
    }
  }
}
</script>
```
---

* **`router.replace(location)`**：url追加信息，不会添加进历史列表之中。跟`push`的区别就是`replace`不会添加进历史列表，它的作用是**替换**当前url。
   * `location`：参考`push`的参数。

---

* **`router.go(n)`**：url跳转到历史列表中的第n个。
   * `n`：一个number类型，定义跳转的历史的数量，如果是负数就后退，例如：

```js
this.$router.go(-2); //后退两步（历史列表中的前两个页面）
```
更多的编程式导航API请查阅[官网](https://router.vuejs.org/zh/api/#router-实例方法)

:::warning
编程式导航API都是操作url变化的，当路由匹配成功时，才实施跳转，因此需要提前配置好**路由记录**。
:::

## 导航守卫
这里的导航可以理解为一种状态，是路由正在发生改变时的状态。守卫导航指的是`vue-router`通过某种方式来守护正在发生改变的路由。这些守卫其实就是一个个钩子函数，每当路由跳转时，都会触发对应的导航守卫。

* **`全局路由器.beforeEach()`**：全局前置守卫，全局范围内，每当有路由发生变化**之前**就会调用它，可以在此做一些路由跳转前的操作，例如监视权限，页面加载进度条等等。

参数是一个回调函数，回调函数接收3个参数：
1. 跳转前的路由信息对象。
2. 跳转后的路由信息对象。
3. 回调函数`next()`，每当执行`beforeEach()`，路由会卡在这里，只有调用了`next()`才会放行。`next()`可以传递一个对象，该对象就是跳转后的路由信息对象。传递一个`false`为不跳转。可以通过`next()`放行的同时，根据需求修改路由信息对象中的某些信息。
```js
//router.js
const router = new Router({
  routes: [
    { path: "/index", name: "index", component: Index },
    { path: "/music", name: "music", component: Music },
    { path: "/movie", name: "movie", component: Movie }
  ]
})

/**
 * 监视全局路由跳转
 * to 目的地路由信息对象
 * from 起始地路由信息对象
 * next 通行回调
 */
router.beforeEach((to, from, next) => {
  console.log(`从 ${from.path} 跳转到 ${to.path}`)
  next() //允许通行
})

export default router
```

* **`全局路由器.afterEach()`**：全局后置守卫，跟`beforeEach()`一样，不过一个是跳转之前触发，一个是跳转之后触发，所以`afterEach()`没有`next`参数。

* **`路由记录.beforeEnter()`**：单独的路由守卫，定义在路由记录内，只守护自己的路由，参数一样。

* **`组件.beforeRouterEnter()`**：组件前置守卫，定义在组件内部，当渲染该组件的对应路由被调用时触发，参数一样。

:::tip
`beforeRouterEnter()`守卫无法通过`this`获取组件实例，因为它是前置守卫，执行该守卫时，组件还未被渲染。但是官方提供了另一种方式来获取实例：
```js
beforeRouteEnter(to, from, next) {
  next(vm => { //这里的vm指的就是vue实例，可以用来当做this使用
    console.log(vm);
  });
}
```
:::

* **`组件.beforeRouterLeave()`**：组件后置守卫，跟`beforeRouterEnter()`相反，当导航离开当前组件对应的路由时候触发，参数一样。

* **`组件.beforeRouterUpdate()`**：组件复用守卫，在当前路由改变，但是组件被复用的时候触发，参数一样。

例如：一个父组件中包含两个子组件，在这两个子组件间跳转的时候，实质上都是在父组件之内，所以父组件上的`beforeRouterUpdate()`会触发。

:::warning
以上除了全局的`afterRouter()`没有`next()`参数以外，所有的守卫都拥有`next()`参数，守卫内必须调用`next()`才会放行，也就是路由才会跳转，否则路由将会卡在这里。
:::

<Vssue />