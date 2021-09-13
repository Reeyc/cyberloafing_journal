# 基础指令

Vue提供了一些对于**页面+数据**的更为方便的输出，这种操作称之为指令，以`v-xxx`表示。\
指令中封装了一些dom行为，结合一个属性作为暗号，暗号有不同的值，根据不同的值进行相关的dom操作

## 插值语法
将响应式数据以双大括号的方式`{{ }}`插入到模板之中，括号内两侧的空格会被忽略。插队数据的**key**值，渲染对应的**value**值。
```vue
<template>
  <!-- 插入数据的key值，渲染对应的value -->
  <div>{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello World"
    };
  }
};
</script>
```
Vue中所有的数据绑定，都支持简单的JavaScript表达式，对于复杂的，应使用`computed`计算属性来代替。
```vue
<template>
  <!-- 插入对象的key值，渲染对应的value -->
  <div>{{firstName + lastName}}</div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "Hello",
      lastName: "World"
    };
  }
};
</script>
```

## v-html
相当于`innerHTML`，如果对应的数据不是html标签格式，会被当成普通文本看待。插队数据的**key**值，渲染对应的**value**值。
```vue
<template>
  <div>
    <!-- 渲染一个span标签 -->
    <div v-html="isHtml"></div>
    <!-- 渲染一个文本 -->
    <div v-html="isNotHtml"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHtml: "<span>Hello</span>",
      isNotHtml: "World"
    };
  }
};
</script>
```
:::warning
新的插值会替换元素内的内容，包括它的子元素
:::

## v-text
相当于`innerText`，往元素中插入文本，但是无法插入html标签，即使是html格式的字符串也会被当成普通文本。效果跟插值语法`{{ }}`一样，使用较少。
```vue
<template>
  <div>
    <!-- 渲染一个<span>Hello</span>文本 -->
    <div v-text="isHtml"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHtml: "<span>Hello</span>"
    };
  }
};
</script>
```

## v-if、v-else-if、v-else
判断某个数据，如果为`true`，则创建该元素，如果为`false`则不创建或销毁。`v-else-if`和`v-else`如果要写，必须要连在`v-if`的后面，否则会报错，`v-else`是最终匹配的指令，它不需要值。
```vue
<template>
  <div>
    <div v-if="ofIf">Hello World</div>
    <div v-else-if="ofElseIf">Hello Vue</div>
    <div v-else>{{msg}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ofIf: null,
      ofElseIf: "",
      msg: "Hello Vue"
    };
  }
};
</script>
```
:::tip
`v-if`绑定的元素，如果为`false`不创建，但会在页面上留下一个空的注释，表示将来值为`true`时，Vue要在这里渲染内容
:::

## v-show
`v-show`也是判断数据，如果为 **true** 则显示该元素，如果为 **false** 则隐藏该元素，它的原理是给元素添加`display:block/none`。`v-show`和`v-if`的区别：
* 为 **false** 时，`v-show`会隐藏，`v-if`会销毁
* 为 **true** 时，`v-show`将元素显示，`v-if`则是新创建元素
```vue
<template>
  <div>
    <div v-show="isShow">{{msg}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: 1,
      msg: "Hello Vue"
    };
  }
};
</script>
```

## v-for
用于遍历对象或者数组并渲染到页面上，语法：
```html
<div v-for='(item, index) in data'></div>

<!-- in 关键字也可以换成 of -->
<div v-for='(item, index) of data'></div>
```
有两个参数，参数二可选
* 如果遍历的是数组：参数一：元素，参数二：索引
* 如果遍历的是对象：参数一：属性值，参数二是属性名

`v-for`比上面所有的渲染指令优先级要高，所以`v-for`渲染出来的元素能通过上面的指令插值进去
```vue
<template>
  <div>
    <div v-for="(item,index) of dataArr">
      <span>{{index}}</span>
      <h2>{{item.title}}</h2>
      <p>{{item.content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataArr: [{
          title: "Vue",
          content: "Hello Vue"
        },{
          title: "JS",
          content: "Hello JS"
        }]
    };
  }
};
</script>
```

## v-bind
绑定数据的指令，它通过冒号绑定一个数据，例如：
```html
<h1 v-bind:index='1'></h1>
```
上面例子中，`index`就是`v-bind`要绑定到元素上的属性，`1`就是绑定的值。
```vue
<template>
  <div>
    <!-- 将 Hello=World 绑定到div上 -->
    <div v-bind:hello="msg"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "World"
    };
  }
};
</script>
```
* Vue为`v-bind`提供了一个简写，就是一个冒号`:`
* `v-bind`绑定的属性还可以接收一个对象，不过这仅在属性为 [style、class](/Vue/class_style.html) 时生效。

---

如果通过索引操作数组数据，则数据和视图无法响应。通过属性操作对象数据，数据和视图也无法响应。这是因为Vue数据响应式原理核心是采用`Object.defineProperty`这个API来实现的，而`Object.defineProperty`本身只能劫持对象的属性，如果属性值也是对象，则深层的对象属性不会被劫持到。解决方案：
* 通过API的方式操作数组，Vue重写了7个数组方法来进行劫持：`push、pop、shift、unshift、splice、sort、reverse`。
* 通过直接修改数据的引用。
* 通过`Vue.set`方法修改数据。

### Vue.set
**`Vue.set(target,propertyName,value)`**
* target：要操作的目标，通常为对象、数组
* propertyName：操作目标的属性或者索引
* value：更新的值
```vue
<template>
  <div>
    <div v-for="(item,index) of dataArr">
      <span>{{index}}</span>
      <h2>{{item.title}}</h2>
      <p>{{item.content}}</p>
    </div>
    <button @click="handleClick">change</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataArr: [{
          title: "Vue",
          content: "Hello Vue"
        },{
          title: "JS",
          content: "Hello JS"
        }]
    };
  },
  methods: {
    handleClick() {
      Vue.set(this.dataArr, 0, {
        title: "angular",
        content: "Hello angular"
      });
    }
  }
};
</script>
```

## v-on
`v-on`绑定的数据的属性为JavaScript的事件名（去除`on`前缀），属性值为事件响应函数
```vue
<template>
  <div>
    <!-- 将 click事件 绑定到div上 -->
    <div v-on:click="handleClick">click me</div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      alert("Hello World");
    }
  }
};
</script>
```
* `v-on`也用得非常多，Vue也提供了一个简写，就是一个`@`符号。
* `v-on`不仅能绑定事件，还可以简单的逻辑运算
```vue
<template>
  <div>
    <!-- 点击将Hello修改为World -->
    <div @click="msg='World'">{{msg}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello"
    };
  }
};
</script>
```

## v-model
`v-bind`能将数据绑定到视图上，但是当视图发生了改变，并不能返回到数据上，而双向数据就是将视图发生的改变返回到数据中。\
给需要双向绑定的元素加上`v-model`指令，值指向绑定数据，即可实现双向绑定。
```vue
<template>
  <div>
    <input type="text" v-model="msg">
    <h1>{{msg}}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello"
    };
  }
};
</script>
```
双向绑定其实通过`v-bind`结合`v-on`也能实现，监听表单项的`input`、`change`事件，当其发生变化时，即时的将变化返回到数据上。不过这种方式显然不如`v-model`方便。