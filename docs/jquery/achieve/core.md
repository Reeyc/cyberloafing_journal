# 核心函数实现原理

既然是造轮子，首先应该知道轮子怎么用 :joy: ，jQuery核心函数的各种**入参**以及**返回值**可以查看这篇 [核心函数](/jquery/base/core.html#jquery函数) 。

---

jQuery的初始化动作在`init`函数中进行：

```js
var init = jQuery.fn.init = function (selector) {
  /**
   * ...
   */
}
```

为了省略多余的结构代码，下面将`init`当做一个普通函数来编写，具体的jQuery结构可以查看：[jQuery基础结构](/jquery/achieve/structure.html)。

## 传递falsy值
> falsy 指的是在 Boolean 上下文中认定可转换为 false 的值。

```js
function init(selector) {
  // 去除前后空格
  selector = jQuery.trim(selector)
  if (!selector) { // false值
    return this  // false值参数，直接返回jQuery空对象本身
  }
}
```

---

## 传递字符串代码片段

如果是字符串，并且有 `"<内容>"` 的字符，说明需要创建一个DOM元素。

1. 先根据代码片段创建DOM元素。
2. 将第一层的元素添加到jQuery对象中（官方只取第一层）。
3. 返回的jQuery对象还有个`length`属性，记录了添加的元素个数。
4. 记得要将jQuery对象返回。

```js
function init(selector) {
  /**
   * ...
   */
  if (jQuery.isString(selector)) { // 字符串
    if (jQuery.isHTML(selector)) { // HTML代码片段
      var temp = document.createElement("div")
      temp.innerHTML = selector // 创建DOM元素

      // 将第一级元素依次赋值给jQuery对象保存
      // 1. JS的children属性只访问子元素，不访问后代元素
      // 2. push.apply()可以把temp.children中的元素依次添加到jQuery对象中
      // 3. temp.children是伪数组，包含length属性，不需要再创建length了
      ;[].push.apply(this, temp.children)

      return this // 将jQuery对象返回
    }
  }
}
```

---

## 传递字符串CSS选择器

非字符串html代码片段的，都会被当成CSS选择器，jQuery会根据CSS选择器去查询对应的DOM元素，并添加进jQuery对象中返回，这个jQuery对象还有一个`selector`属性，值为传进来的字符串CSS选择器。

1. 可以利用原生JS的`document.querySelectorAll()`来查找元素。
2. 将找到的元素跟实现字符串片段一样依次加入jQuery对象中。
3. 将参数保存到`selector`属性中。
4. 将该jQuery对象返回。

```js
function init(selector) {
  /**
   * ...
   */
  if (jQuery.isString(selector)) { // 字符串
    if (jQuery.isHTML(selector)) {
      // HTML代码片段：创建
      var temp = document.createElement("div")
      temp.innerHTML = selector
      ;[].push.apply(this, temp.children)
      return this
    } else {
      // CSS选择器：获取
      var res = document.querySelectorAll(selector)
      ;[].push.apply(this, res || [])
      this.selector = selector
      return this   
    }
  }
}
```

---

## 传递数组

将数组中的所有元素展开保存到jQuery对象中返回。

```js
function init(selector) {
  /**
   * ...
   */
  if (jQuery.isArray(selector) || jQuery.isFakeArray(selector)) { // 真/伪数组
    var arr = [].slice.call(selector) // 伪数组转为真数组
    ;[].push.apply(this, arr) // 展开数组，将元素依次添加到jQuery对象中
    return this
  }
}
```

---

## 传递函数

原生JS的`window.onload`事件是在页面（包括所有资源）加载完毕之后才执行，性能较差。jQuery官方的入口函数是在DOM加载完毕之后就执行（不等资源，比如图片等等...）。

在JS中，还有一种事件能够监听DOM加载完毕：`DOMContentLoaded`

### DOMContentLoaded

`DOMContentLoaded`：DOM加载完毕就执行事件，速度快，性能比`window.onload`好，但是这个事件不支持IE8及以下浏览器，而且这个事件只能通过`addEventListener`的方式来绑定。
```js
window.onload = function () {
  var p = document.getElementById("p")
  console.log(p) // 性能差,后执行
}
addEventListener(
  "DOMContentLoaded",
  function () {
    var p = document.getElementById("p")
    console.log(p) // 性能好,先执行
  },
  false
)
```

### onreadystatechange

在IE8中，可以给`document`绑定一种事件来监听DOM的加载：`onreadystatechange`。并且`document`对象有对应的状态来查看DOM的加载：`document.readyState`。

| 状态值 | 描述 |
| - | - |
| uninitialized | 还未开始加载 |
| loading | 正在加载 |
| interactive | 已加载 |
| complete | 加载完成 |

每当`document.readyState`发生变化都会执行事件响应函数。两者一般搭配使用，下面是结合`onreadystatechange`事件和`document.readyState`属性来监听IE8的DOM加载的例子：
```js
document.attachEvent("onreadystatechange", function () {
  if (document.readyState == "complete") {
    console.log("IE8 === DOM加载完毕~~")
  }
})
```

能够监听DOM的加载，接下来就可以实现jQuery的入口函数了。需要注意的是，实例方法`ready`的回调也能监听DOM的加载，因此可以在`ready`中实现，`init`中直接调用`ready`就行了：
```js
jQuery.fn.extend({
  ready: function (callBack) {
    // DOM已经加载完毕
    if (document.readyState == "complete") {
      callBack()
    } else if (document.addEventListener) {
      // 支持addEventListener
      document.addEventListener("DOMContentLoaded", callBack, false)
    } else {
      // 支持attachEvent
      if (document.readyState == "complete") {
        document.attachEvent("onreadystatechange", callBack)
      }
    }
  }
})
```

在`init`方法中：

```js
function init(selector) {
  /**
   * ...
   */
  if (jQuery.isFunction(selector)) { // 函数
    this.ready(selector)
  }
}
```

---

## 传递其他类型

剩余的其他类型，jQuery会将它们直接加入jQuery对象元素中，并返回jQuery对象。

```js
function init(selector) {
  /**
   * ...
   */
  else { // 其他剩余类型
    this[0] = selector
    this.length = 1
  }
}
```
---

到这里就实现了所有jQuery所有入参的情况，下面是`init`全部代码：

```js
function init(selector) {
  // 去除前后空格
  selector = jQuery.trim(selector)
  if (!selector) { // false
    return this
  } else if (jQuery.isString(selector)) { // 字符串
    if (jQuery.isHTML(selector)) {
      // 创建
      var temp = document.createElement("div")
      temp.innerHTML = selector
      ;[].push.apply(this, temp.children)
    } else {
      // 获取
      var res = document.querySelectorAll(selector)
      ;[].push.apply(this, res)
      this.selector = selector
    }
  } else if (jQuery.isArray(selector) || jQuery.isFakeArray(selector)) { // 真/伪数组
    var arr = [].slice.call(selector)
    ;[].push.apply(this, arr)
  } else if (jQuery.isFunction(selector)) { // 函数
    this.ready(selector)
  } else { // 剩余类型
    this[0] = selector
    this.length = 1
  }
  return this
}
```

<Vssue />