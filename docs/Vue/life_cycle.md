# 生命周期

Vue实例有一个完整的生命周期：
>开始创建、初始化数据、编译模板、挂载Dom、渲染→更新→渲染、销毁

等一系列过程，我们称这是Vue的生命周期。通俗说就是Vue实例从创建到销毁的过程，就是生命周期。

## 生命周期钩子函数
每个vue实例在初始化时，都做了许多事，比如：监听数据变化，编译模板，实例挂到dom上。做这些事情就需要运行一些特殊的函数，这些函数叫做生命周期钩子函数。
:::tip
生命周期钩子内的`this`也都指向vue实例。
:::

## beforeCreate
实例通过`new Vue()`创建出来之后会初始化事件和生命周期，然后就会执行`beforeCreate`钩子函数，这个时候，数据还没有挂载，只是一个空壳，无法访问到数据和真实的dom，一般不做操作，或者作一些loading之类的操作
```js
new Vue({
  el: "#app",
  data() {
    return {
      mas: "Hello World"
    }
  },
  beforeCreate() {
    console.log(this.$el)   //undefined
    console.log(this.$data) //undefined
  }
})
```

## created
数据已经初始化完毕，然后执行`created`函数，这个时候已经可以使用到数据，也可以更改数据，在这里更改数据不会触发`updated`函数，在这里可以在渲染前更改数据（倒数第二次机会），而不会触发其他的钩子函数，一般可以在这里做初始数据的获取，例如Ajax异步请求。
```js
new Vue({
  el: "#app",
  data() {
    return {
      mas: "Hello World"
    }
  },
  created() {
    console.log(this.$el)   //undefined
    console.log(this.$data) //object
  }
})
```

## beforeMount
接下来开始找实例对应的模板，编译模板成虚拟Dom放入到`render()`中准备渲染，然后执行`beforeMount`钩子函数，在这个函数中虚拟Dom已经创建完成，马上就要渲染，在这里也可以更改数据，不会触发`updated`，在这里可以在渲染前更改数据（最后一次机会），而不会触发其他的钩子函数。简而言之，数据已被渲染成虚拟Dom，但还未挂载到真实Dom，在真实Dom上，数据还是一个占位符`<!---->`
```vue
<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello World"
    }
  },
  beforeMount() {
    console.log(this.$parent.$el)
  }
}
</script>
```

## mounted
接下来开始`render()`，渲染出真实dom，然后执行`mounted`钩子函数，此时，组件已经出现在页面中，数据和真实dom都已经处理好了，事件都已经挂载好了，到这里一个Vue生命周期的**初始化**已经完成了，可以在这里操作真实dom等事情。
```vue
<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello World"
    }
  },
  mounted() {
    console.log(this.$parent.$el)
  }
}
</script>
```

## beforeUpdate
一旦实例的数据更改之后，会立即执行`beforeUpdate`，然后虚拟dom机制会重新构建虚拟dom与上一次的虚拟dom树利用`diff算法`进行对比之后重新渲染，一般不做什么事儿，简而言之：重新构建虚拟DOM，但是还未挂载到真实DOM。
```vue
<template>
  <!-- 点击更新数据，将Hello World 改为 Hello Vue -->
  <div @click="msg = 'Hello Vue'">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello World"
    }
  },
  beforeUpdate() {
    console.log(this.$parent.$el.innerHTML) //Hello World
  }
}
</script>
```

## updated
当更新完成后，执行`updated`，此时，数据已经更改完成，dom也重新`render`完成，可以操作更新后的虚拟Dom。
```vue
<template>
  <!-- 点击更新数据，将Hello World 改为 Hello Vue -->
  <div @click="msg = 'Hello Vue'">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello World"
    }
  },
  beforeUpdate() {
    console.log(this.$parent.$el.innerHTML) //Hello Vue
  }
}
</script>
```

## beforeDestroy
当经过某种途径调用`$destroy`方法后，执行`beforeDestroy`，此时Vue实例还未开始销毁工作，一般在这里做一些销毁前的善后工作，例如清除计时器、清除非指令绑定的事件等等
```vue
<template>
  <div>
    <div>{{ msg }}</div>
    <button @click="destroy">销毁</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 0
    }
  },
  methods: {
    destroy() {
      this.$destroy()
    }
  },
  mounted() {
    setInterval(() => {
      console.log(++this.msg) //定时器未销毁
    }, 1000)
  },
  beforeDestroy() {
    console.log(this) //Vue实例完全存在
  }
}
</script>
```

## destroyed
实例的数据绑定、监听...去掉后只剩下dom空壳，这个时候，执行`destroyed`钩子函数，在这里做善后工作也可以。
```vue
<template>
  <div>
    <div>{{ msg }}</div>
    <button @click="destroy">销毁</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 0,
      timer: null
    }
  },
  methods: {
    destroy() {
      this.$destroy()
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      console.log(++this.msg) //定时器未销毁
    }, 1000)
  },
  destroyed() {
    clearInterval(this.timer) //销毁定时器
  }
}
</script>
```