# 核心函数

## jQuery函数

jQuery函数是jQuery库的最核心函数，jQuery的一切都是基于此函数的。该函数主要将各种类型的参数智能地封装为jQuery对象，以便于使用jQuery对象提供的其他属性和方法对DOM元素进行操作。

:::tip
jQuery库中，为jQuery定义了一个别名为 `$`，因此调用`$()`也相当于在调用`jQuery()`。
:::

本章节主要介绍jQuery核心函数接收的各种入参以及返回值。

## falsy值

>  falsy 指的是在 Boolean 上下文中认定可转换为 false 的值。

返回一个的空的jQuery对象。

```js
$()
$("")
$(0)
$(NaN)
$(null)
$(undefined)
$(false)
```

---

## 函数

该函数会等待DOM元素加载完毕才执行，注：但不会等待图片加载完毕。
```js
$(function () {
  // 该函数会等待DOM加载完毕才执行
  console.log(document.getElementById("box"))
})
```
更多的细节请查看 [入口函数](/jquery/base/load.html) 章节。

---

## 字符串

* **字符串html代码片段**

创建对应的DOM元素，并将这些DOM元素保存到jQuery对象中返回。
```js
$(function () {
  const ele = $("<div>new Element</div>")
  $("body").append(ele) // 将新创建的HTML元素添加进body内
})
```
可以是多层嵌套的html代码片段：
```js
$(function () {
  const ele = $(`<div> 
    <p>
      <span>new Element</span>
    </p>
  </div>`)

  $("body").append(ele) // 将新创建的HTML元素添加进body内
})
```
* **字符串CSS选择器**

非字符串html代码片段的，会将其当成CSS选择器，将查找出来的元素保存到jQuery对象中返回。
```js
$(function () {
  $("#id") // ID选择器
  $(".class") // 类选择器
  $("tagName") // 标签选择器
  $("[propName]") // 属性选择器
  $("[propName=value]") //属性值选择器
  $("ele > .class") // 子类选择器
  $("ele .class") // 后代选择器
  $("ele + class") // 兄弟选择器
  $("ele, .class") // 并集选择器
  $("ele.class") // 交集选择器
  $("ele:checked") // 伪类选择器

  // ...more
})
```
还有更多，只要是CSS选择器都可以入参去查询DOM。

---

## 真数组/伪数组
将数组中的所有元素展开保存到jQuery对象中返回。
```js
var trueArr = [10, 20, 30, 40, 50]
var falseArr = { 0: "a", 1: "b", 2: "c", length: 3 }

console.log($(trueArr)) // 数组中的元素依次保存到jQuery对象中

console.log($(falseArr)) // 数组中的元素依次保存到jQuery对象中
```

## 对象、DOM元素、其他基本类型
将传入的对象，DOM元素，基本数据保存到jQuery对象中返回。
```js
$(function () {
  // 对象
  $(new Promise(function () {
    // ...
  }))

  // DOM元素
  $(".box")

  // 其他类型
  $(99)
  $(true)

  // 全部返回jQuery对象，都保存在jQuery对象中
})
```

<Vssue />