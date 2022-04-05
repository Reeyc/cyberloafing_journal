# 内置组件
除了自定义的全局组件和局部组件之外，Vue官方还提供了一些内置的组件。

## component
动态组件。`component`常用于配合`is`属性来定义一个动态加载的组件，`is`的值指向一个被渲染的组件，根据需求动态修改`is`所指向的值，就实现了动态组件。

`is`的值可以是**组件名**，也可以是**组件对象**。
```vue
<template>
  <div id="app">
    <component :is="show"></component>
    <button @click="handleClick">切换</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //is的值可以是组件名，或者是组件对象
      commentArr: [
        "child",
        {
          template: `<div>Hello Vue</div>`
        }
      ],
      index: 0
    }
  },
  computed: {
    show() {
      return this.commentArr[this.index]
    }
  },
  methods: {
    handleClick() {
      if (this.index >= this.commentArr.length - 1) {
        this.index = 0
      } else {
        this.index++
      }
    }
  }
}
</script>
```
:::tip
`component`动态加载的组件相当于也会对组件进行创建、销毁的过程，如不需要，可以采用`keep-alive`来进行缓存。
:::

## keep-alive
缓存组件。组件都有自己的生命周期，每当组件被销毁-新建，那么这个组件又会重新的走一圈生命周期。如果它的生命周期钩子函数上做了许多的逻辑运算，显然这会对性能造成极大的开销。
```vue
<template>
  <div id="app">
    <child v-if="show"></child>
    <button @click="show = !show">销毁</button>
  </div>
</template>

<script>
//组件的每次创建与销毁，都要历经一遍生命周期
Vue.component("child", {
  template: `<div>Hello World</div>`,
  beforeCreate() { console.log("beforeCreated~") },
  created() { console.log("created~") },
  beforeMount() { console.log("beforeMount~") },
  mounted() { console.log("mounted~") },
  beforeDestroy() { console.log("mounted~") },
  destroyed() { console.log("destroyed~") }
})

export default {
  data() {
    return {
      show: true
    }
  }
}
</script>
```
被`keep-alive`包裹起来的组件，当它被销毁时，将会被保存到缓存中，如果下次需要用它时，会从缓存中取。也就是说，这个组件不会再经历 创建->编译->挂载等等操作。这种方案在路由中用得很多。

代码还是上面的代码，只不过我们将`child`组件渲染的时候，用一个`keep-alive`将其包裹，一旦其被销毁，会将它保存至缓存中，从而避免它又重复的执行生命周期钩子函数。
```vue
<div id="app">
  <keep-alive>
    <child v-if="show"></child>
  </keep-alive>
  <button @click="show = !show">销毁</button>
</div>
```
:::tip
在缓存中的组件不会渲染到DOM中，也就是不会影响DOM的开销
:::

---

如何知道组件被停用或者保持活跃？
* **`activated`**：当组件在使用中时（活跃），调用该函数。
* **`deactivated`**：当组件被缓存起来时（停用），调用该函数。

被`keep-alive`包裹的组件永远不会执行`beforeDestroy`和`destroyed`，因为这两个钩子函数是在组件被销毁才执行，而`keep-alive`保证了组件不会被销毁。
```vue
<template>
  <div id="app">
    <keep-alive>
      <child v-if="show"></child>
    </keep-alive>
    <button @click="show = !show">销毁</button>
  </div>
</template>

<script>
Vue.component("child", {
  template: `<div>Hello World</div>`,
  beforeCreate() { console.log("beforeCreated~") },
  created() { console.log("created~") },
  activated() { console.log("组件使用中，活跃状态~") },
  deactivated() { console.log("组件已保存至缓存中，停用状态~") }
})

export default {
  data() {
    return {
      show: true
    }
  }
}
</script>
```

## slot
插槽组件。官方给的定义是：slot作为内容分发的出口。通说一点说就是：留下一个插槽坑，允许别的组件往这个插槽坑里面填内容。\
通常我们在子组件中放置插槽，允许父组件往插槽里面填内容，内容也可以是Dom元素。
```vue
<!-- a.vue -->
<template>
  <b>Hello World!</b>
</template>

<script>
import b from "./b"
export default {
  components: { b }
}
</script>

<!-- b.vue -->
<template>
  <div>允许父组件插入的内容：<slot>Hello Vue!</slot></div>
</template>
```
上面代码中，组件b是组件a的子组件，组件b对外提供了一个插槽，当组件a使用组件b时，往组件b的插槽插入了一段内容`Hello World！`，这一段内容最终会渲染到组件b插槽所在的位置中。\
如果该位置已经有了其他内容，那么这些内容会被覆盖掉，例如上面代码中的`Hello Vue!`。

### 具名插槽
有时候只需要某一部分的内容变化，这时候就可以使用具名插槽来实现。\
顾名思义，就是具有名字的插槽。给这个`slot`插槽一个`name`属性，表示给该插槽命名。
```vue
<div>
  <slot name="mySlot"></slot>
</div>
```
外部调用这个组件时，定义一个`slot`属性，取值为对应`slot`插槽的`name`值。
```vue
<div>
  <b slot="mySlot"></b>
</div>
```
这样就能使插入的内容和指定插槽一一对应上了。
```vue
<!-- a.vue -->
<template>
  <child>
    <div slot="header">header</div> <!--插入header插槽-->
    <div slot="footer">footer</div> <!--插入footer插槽-->
  </child>
</template>

<script>
import b from "./b"
export default {
  components: { b }
}
</script>

<!-- b.vue -->
<template>
  <div>
    <slot name="header"></slot>
    <div>content</div>
    <slot name="footer"></slot>
  </div>
</template>
```

### 作用域插槽
`slot`还可以绑定动态数据，将数据传递到外部。外部使用`slot-scope`属性接收，值为一个对象，保存了插槽传递出来的数据。
* 对象的`key`是当前插槽传递出来的**属性**。
* 对象的`value`是当前插槽传递出来的**值**。
:::tip
`slot-scope`必须绑定在`template`标签上，只有`template`标签不会被渲染到页面上
:::
```vue
<!-- a.vue -->
<template>
  <child>
    <!-- data将是一个对象，对象的key&value是当前插槽传递出来的属性&值 -->
    <template slot-scope="data">
      <div>{{ data }}</div>
    </template>
  </child>
</template>

<script>
import b from "./b"
export default {
  components: { b }
}
</script>

<!-- ################################################################# -->

<!-- b.vue -->
<template>
  <div>
    <!--通过插槽，将数组的每个元素传递出去-->
    <slot v-for="item of menuList" :arrKey="item"></slot>

    <!--通过插槽，将msg传递出去-->
    <slot :strKey="msg"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [100, 200, 300],
      msg: "Hello"
    }
  }
}
</script>
```
数据`data`的输出结果如下：
> { "arrKey": 100 } <br>
> { "arrKey": 200 } <br>
> { "arrKey": 300 } <br>
> { "strKey": 'Hello' }

## 递归组件
就是自己调用自己的组件，前提是该组件必须有`name`名称。

递归组件常用来做多级数据嵌套渲染的情况，例如下面这种情况，接口返回一个树形数据。
```json
"categoryList": [{
  "title": "成人票",
  "children": [{
    "title": "成人三馆联票",
    "children": [{
      "title": "成人三馆联票 - 某一连锁店销售"
    }]
  },{
    "title": "成人五馆联票"
  }]
}, {
  "title": "学生票"
}]
```
要把这样的数据渲染到页面上时，使用递归是最高效的。
```vue
<template>
  <div>
    <div v-for="(item, index) of list" :key="index">
      {{ item.title }}
      <div v-if="item.children">
        <!--如果还有子数组, 递归调用组件本身, 直到没有子数组-->
        <detail-list :list="item.children"></detail-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailList", //递归组件必须有name
  props: {
    list: Array //接收数据
  }
}
</script>
```

## 异步组件
按需加载的组件，或者通过条件判断加载的组件。ES6的`import`指令可以是一个函数调用，传递的参数就是使用`import 变量 from 地址`指令中的`地址`，例如：
```js
import xxx from '@/home/Home'
import('@/home/Home')
```
在组件加载机制上，两者的功能是一样的，但是`import()`允许动态加载，也就是说`import()`可以不用写在首部，当需要这个组件时候才加载。

之前使用`import`指令的方式是，先在首部加载完所有需要的组件，当真正需要时候直接调用变量。而使用`import()`不用这样做，当真正需要这些组件的时候才去加载。
```js
/*import*/
import Header from "./components/Header";
import Swiper from "./components/Swiper";

export default {
  components: {
    Header,
    Swiper
  }
};

/*import()*/
export default {
  components: {
    Header: () => import('./components/Header'),
    Swiper: () => import('./components/Swiper'),
  }
};
```
这种方案在路由中用得比较多，当路由匹配时候才去加载对应组件，这样就节省了大量的资源。

但是，异步组件也不一定是完美的，当项目比较小的时候，完全可以一次性加载完毕，再去调用对应变量，影响微乎其微。但如果用异步组件的话，每次只加载对应的组件，但是下一次又将会继续加载另外的组件，反而得不偿失，所以异步组件也应当按需使用。

<Vssue />