# jQuery对象

jQuery是一款优秀的JavaScript库。它的优势有：
* 强大的选择器：方便快速查找DOM元素。
* 链式调用：可以通过 . 号来不断调用jQuery方法。
* 隐式遍历：一次性操作多个元素。
* 读写合一：读数据，写数据用的是一个函数。
* 事件处理。
* DOM操作。
* 样式操作。
* 动画。
* 丰富的插件支持。
* 不用做兼容性处理。

---

jQuery库暴露了一个构造函数，命名为`jQuery`，还有一个别名为 **`$`** 。
```js
console.log(jQuery === $)
```

核心函数的原理是：内部会调用原型上的`init`方法并返回，而`init`方法内部则会根据不同参数来初始化一个jQuery实例对象。换言之，调用核心函数会返回一个jQuery实例对象。具体的实现细节可以看这一章：[核心函数实现原理](/jquery/achieve/core.md)。
```js
const instace = $()

console.log(instace.__proto__ === $.prototype) //true
```

## jQuery元素

jQuery核心函数可以接收多种不同的参数，如果传进去的是一个**字符串CSS选择器**，那么jQuery会根据这个选择器在DOM中查询到相应的DOM元素，并把其包装成一个jQuery对象返回。

jQuery对象是一个类数组对象，里面的每一项属性都是查询到的DOM元素。
```js
$(function () {
  addEle() // 原生JS创建元素
  function addEle() {
    const D = document.createElement("div")
    D.innerHTML = `
    <p class="demo">demo1</p>
    <p class="demo">demo2</p>
    <p class="demo">demo3</p> `
    document.body.appendChild(D)
  }

  console.log($(".demo")) 
  /*
   * S.fn.init(3) [p.demo, p.demo, p.demo]
   *   0: p.demo
   *   1: p.demo
   *   2: p.demo
   *   length: 3  
  */
})
```
:::tip
就算只查询到单个DOM元素，返回的jQuery对象也是类数组对象。
```js
console.log($("body"))
/*
 * S.fn.init [body]
 *   0: body
 *   length: 1 
*/
```
:::

## 链式调用

如果在调用函数的后面持续调用某些特定API的话，再次返回的依旧是上一次的实例对象，也就是相同的实例对象，这也是jQuery实现链式调用的原理。

```js
$(function () {
  $("body")
    .addClass("dark")
    .width("500px")
    .height("500px")
    .click(function () {
      console.log(this)
    })
})
```
上述代码中，给`body`绑定了一个`dark`的css类名，同时设置了宽高为500px，并且绑定了单击事件。

## 批量操作

jQuery对象本质上是一个js类数组对象（通过数字作为属性，并且包含`length`属性的对象），这么设计是为了将来能够实现jQuery批量操作元素。
```js
$(function () {
  $("div").css('border','1px solid #000') //给页面上所有的div元素加上边框

  console.log($("div"))
  /*
   * S.fn.init(3) [div, div, div]
   *   0: div
   *   1: div
   *   2: div
   *   length: 3
   */
})
```

除此之外，jQuery对象和js对象的区别在于，jQuery对象能够调用原型上提供的一系列强大的方法，这些方法能使开发者更便捷的去操作DOM。从而符合jquery的价值观：**`write Less，Do More`**（写的更少，做的更多）。

<Vssue />