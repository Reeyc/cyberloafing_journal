# 动画

## transition
Vue内置组件`<transition> </transition>`用于给元素或组件添加动画效果。
```vue
<template>
  <div id="app">
    <transition>
      <h1 v-show="isShow">Hello World</h1> <!-- h1要执行动画效果 -->
    </transition>
    <button @click="toggleHandle">toggle</button>
  </div>
</template>
```
`<transition>`组件包裹的元素，会在动画运行的某个时间点给元素添加不同的类名，所以，在CSS样式里面给这些类名添加相应的过渡效果，就实现了动画。

---

当元素进入动画时，默认情况下，添加的类名：
* **`v-enter`**：在动画开始前添加，在动画执行的第二帧时移除（通常用于设置过渡前的样式）。
* **`v-enter-active`**：在动画开始时添加，整个动画阶段都存在，动画结束后移除。
* **`v-enter-to`**：在动画执行的第二帧开始时添加（也就是v-enter结束时），在动画结束后移除。

![动画曲线](/assets/img/animate.png)
<center>动画曲线图</center>

给`<transition>`组件添加一个`name`属性，取值为自定义的前缀，例如，图上的fade是自定义的类名前缀。
```vue
<transition name='fade'> <transition>
```
当元素离开动画时，默认情况下，添加的类名：
* **`v-leave`**
* **`v-leave-active`**
* **`v-leave-to`**

作用和上面三者相反。上面的是元素进入动画时添加的，而这三个是元素离开动画时添加的。

---

实现一个元素的显示和隐藏动画：
```css
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: all 3s;
}
```
---

Vue中还提供了一种方式，用于自定义整个类名，而不仅于前缀。以下属性跟`name`一样，需定义在`<transition>`组件上，取值为要定义的类名。
* **`enter-calss`**：给v-enter过渡自定义类名
* **`enter-to-class`**：...
* **`enter-active-class`**：...
* **`leave-class`**：...
* **`leave-to-class`**：...
* **`leave-active-class`**：...

以上属性取值的类名分别对应Vue动画运行阶段产生的那6个内置类名。

## 初始渲染的过渡动画
当模板渲染到页面上的时候，元素的显示也是一种变化，但是却没有触发相应的动画样式。这是因为渲染该元素上去的时候，对应的类名还没有绑定上去。

**`appear`**：不需要取值，它会将该组件上指定的类名随着`<transition>`渲染的同时，一起渲染到页面上。换言之，`appear`可以实现第一次渲染页面时的过渡动画。包括后面要讲的`transition`钩子事件，也可以通过`appear`提前绑定。

---

`appear`跟**进入过渡**、**离开过渡**一样，也可以自定义类名。\
**`appear-class`**、**`appear-to-class`**、**`appear-active-class`**。这些类名跟enter进入过渡动画的效果是一样的，因为只有初始渲染的情况，所以`appear`没有其他的类似**leave**的效果。
```vue
<transition 
  appear
  appear-active-class="animated bounceOut"
  enter-active-class="animated bounceOut" 
  leave-active-class="animated bounceOutLeft"
>
  <h1 v-show="isShow">Hello World</h1>
</transition>
```

## 过渡和动画同时执行
如果在同一个元素上既定义了**过渡效果***transition*，又定义了**动画效果***keyframes*，此时就需要手动在`<transition>`组件上定义动画的结束时常，否则Vue无法判断到底以哪个动画为结束时间。
* `type`：定义结束时间的动画类型，例如：`transition`或者`keyframes`。
```js
type='transition' //该元素的动画，以transition动画结束为结束时间
```
* `duration`：定义这个元素的动画结束时间，单位是毫秒，`duration`属性不仅可以取值为简单的数值，还可以取值为一个对象。
   * 对象的`enter`属性代表**进入**动画的结束时常。
   * 对象的`leave`属性代表**离开**动画的结束时常。
```js
//该元素的入场动画结束时间为2s
//该元素的出场动画结束时间为3s
:duration='{ enter: 2000, leave: 3000 }' 
```
:::tip
由于`duration`属性和`type`属性相冲突，所以设置了`duration`属性，`type`属性可以省略。
:::

## animate.css
```sh
npm install animate.css@3.7.2 --save--dev # 安装
```
`animate.css`是一个第三方的库，其内部装了许多的CSS过渡动画，需要时候可以上其[官网](https://animate.style/)查阅动画效果，官网有标明了动画对应的类名。
```js
import animated from "animate.css"
Vue.use(animated)
```
使用这个库给元素定义类名时，需要在给这个元素一个额外的类名：`animated`，表示`animate.css`将使用这个元素，结合给元素自定义类名。

例如：`bounceOut`和`bounceOutLeft`是我们需要的动画效果。
```vue
<transition 
  enter-active-class="animated bounceOut" 
  leave-active-class="animated bounceOutLeft"
>
  ...
</transition>
```

## 多元素动画
当`<transition>`内的多个元素同时执行动画的时候，可以给`<transition>`绑定一个`mode`属性，用于定义动画间过渡的模式，有以下两种取值：
* **`in-out`**：当**显示**的动画执行完毕再执行**退出**的动画。
* **`out-in`**：当**退出**的动画执行完毕再执行**显示**的动画。
:::warning
当有相同标签名的元素切换时，需要通过`key`特性设置唯一的值来标记以让Vue区分它们，否则Vue为了效率只会替换相同标签内部的内容。
:::
```vue
<template>
  <div>
    <button @click="isShow = !isShow">切换</button>
    <!--当动画显示完再执行退出动画-->
    <transition mode="in-out">
      <div v-if="isShow" key="1">Hello</div>
      <div v-else key="2">World</div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return { isShow: true }
  }
}
</script>

<style>
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: all 1s;
}
</style>
```

## 列表动画
内置组件`<transition-group> </transition-group>`为一段列表元素设置动画，它的原理是将列表中的每个元素用`<transition>`包裹而实现。
```vue
<template>
  <div>
    <button @click="add">Add</button>
    <button @click="remove">Remove</button>
    <transition-group>
      <div v-for="item of listArr" :key="item.id">{{ item.content }}</div>
    </transition-group>
  </div>
</template>

<script>
export default {
  data() {
    return { listArr: [], count: 0 }
  },
  methods: {
    add() {
      this.listArr.push({ id: this.count++, content: "Hello World" })
    },
    remove() {
      this.listArr.pop()
    }
  }
}
</script>

<style>
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: all 1s;
}
</style>
```

## 动画钩子
除了上面的种种方式，还可以通过JS来实现动画。`<transition>`组件默认会绑定一些钩子事件，当动画执行到某些时间点的时候会自动触发这些钩子函数，这一点跟绑定类名如出一辙。
* **`before-enter`**
* **`enter`**
* **`after-enter`**
* **`before-leave`**
* **`leave`**
* **`after-leave`**

以上钩子事件的触发时机，分别对应动画运行阶段产生的那6个内置类名一致。

所有钩子事件的响应函数内部，都有一个参数，参数对应`<transition>`包裹的**根元素**。而`enter`和`leave`的响应函数则有两个参数，第二个参数是一个回调函数，动画执行完毕，必须调用该回调函数，表示告诉Vue动画执行完毕了，才会往下触发`after-enter`和`after-leave`。
```vue
<template>
  <div id="app">
    <transition appear @before-enter="handleBeforeEnter" @enter="handleEnter" @after-enter="handleAfterEnter">
      <h1>Hello World</h1>
    </transition>
  </div>
</template>

<script>
export default {
  methods: {
    handleBeforeEnter(el) {
      el.style.color = "red"
    },
    handleEnter(el, done) {
      setTimeout(() => {
        el.style.color = "blue"
      }, 2000)
      setTimeout(() => {
        done() //动画执行完毕了需要调用回调函数
      }, 4000)
    },
    handleAfterEnter(el) {
      console.log("动画结束了")
    }
  }
}
</script>
```

---

通常情况下，web实现动画效果，主要分成两种方式：
* **帧动画（JS）**：每隔一段时间更改元素的状态，来实现动画效果。
   * **`setInterval()`**
   * **`setTimeout()`**

* **补间动画（CSS）**：定义起始状态和结束状态，中间的过程由浏览器的渲染引擎去执行。
   * **`transition`**
   * **`animation`**

补间动画由浏览器去执行，结合浏览器渲染引擎最合适的一种方式，所以性能最高。\
而帧动画由开发者自己设定动画的开始、结束和过程，其渲染的方式可能与浏览器渲染引擎不搭，性能不高。所以，实现动画效果尽量用CSS3实现，性能优于JS。

使用`<transition>`的钩子事件来实现动画是**帧动画**，结合**钩子事件** + **CSS3**的动画属性来实现才是最完整的方案。

## Velocity.js
```sh
npm install velocity-animate --save--dev # 安装
```
`Velocity.js`和`animate.css`一样，是第三方的库，专门用于JS+CSS设置动画，JS来配置，CSS来执行。其返回一个`Velocity`函数。
:::tip
`Velocity`函数不是构造函数，但是首字母大写
:::

* 参数一：`<transition>`包裹的根元素。
* 参数二：样式对象，内部键值对对应CSS的样式。
* 参数三：配置对象。常用的属性如下：
   * `duration`：定义动画的时长。
   * `complete`：动画结束之后要执行的回调。
   * 更多属性上[官网](http://shouce.jb51.net/velocity/index.html)查阅...

`Velocity`是专门用来设置动画的，所以通常在`enter`或者`leave`钩子事件函数内调用它。
```vue
<template>
  <div id="app">
    <transition appear @before-enter="handleBeforeEnter" @enter="handleEnter" @after-enter="handleAfterEnter">
      <h1>Hello World</h1>
    </transition>
  </div>
</template>

<script>
import "@/assets/velocity.min.js"
export default {
  methods: {
    handleBeforeEnter(el) {
      el.style.fontSize = "10px"
    },
    handleEnter(el, done) {
      //在enter里调用Velocity()
      Velocity(
        //transition包裹的根元素
        el,
        //样式对象
        { fontSize: "50px" },
        //配置对象
        {
          duration: 5000,
          complete: done //动画完毕执行回调
        }
      )
    },
    handleAfterEnter(el) {
      console.log("动画结束了")
    }
  }
}
</script>
```

<Vssue />