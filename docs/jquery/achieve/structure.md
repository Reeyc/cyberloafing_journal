# jQuery基础结构

jQuery的基本结构采用私有作用域（[IIFE](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)）的环境来实现。

```js
// jQuery的基本结构

// IIFE环境实现jQuery
;(function (w, undifined) {
  var jQuery = function (selector) {
    return new jQuery.fn.init(selector) // 将初始化方法返回并创建实例
  }
  jQuery.fn = jQuery.prototype = {
    // 自定义原型，需要手动设置构造器的指向
    construstor: jQuery,
  };

  var init = jQuery.fn.init = function (selector) {
    /**
     * ...
     */
  }

  // 插件扩展
  jQuery.extend = jQuery.prototype.extend = function (obj) {
    for (var key in obj) {
      this[key] = obj[key]
    }
  }

  // 改变原型指向
  init.prototype = jQuery.fn

  // 暴露给外部
  w.jQuery = w.$ = jQuery
})(window)
```
可以看出，jQuery函数本质上是一个工厂，其内部是借助了`jQuery.fn.init()`这个构造函数来初始化实例的。

---

**jQuery为什么采用 IIFE（沙箱） 的环境实现？**

为了避免污染全局作用域，IIFE拥有独立的词法作用域。
```js
;(function () {
  var num = 1
})()
console.log(num) // "Uncaught ReferenceError: num is not defined"
```

---

**jQuery为什么要传递一个 window ？**

内部有使用到window，为了提升查找的效率，内部有window，则JS不用再一层一层往外找。

---

**jQuery为什么要传递一个 undefined ？**

保证内部的`undefined`不被修改，因为在IE8及以下的浏览器中，`undefined`是可以被重写的。

```js
// IE8环境
undefined = 999
console.log(undefined) // 999
```

---

**jQuery为什么要自定义原型以及新的属性 fn ？**

自定义原型是为了更方便的定义原型属性和原型方法，至于`fn`别名只是clone了一份原型对象，简写的方式是为了更方便的访问原型。

---

**jQuery为什么要使用init来当做构造函数初始化？**

目的是为了将jQuery当成一个工厂，即调用`jQuery()`就会生成jQuery实例对象，而不需要繁琐的`new jQuery()`。而且将初始化的动作独立出来一个方法更方便管理。

---

**jQuery为什么要改变init的原型指向？**

因为实例是在`init`里面初始化的，而`init`的原型跟jQuery的原型毫无关系，所以实例无法访问jQuery原型的方法，将来的`extend`插件机制也是将方法添加到jQuery原型上，因此要将`init`的原型关联到jQuery的原型。

```js
$.fn.extend({
  isPro: function () {
    console.log("实例方法")
  }
})

$().isPro() // "实例方法"
```

---

**jQuery的extend是什么？**

jQuery扩展插件的机制，可以查看 [jQuery插件机制](/jquery/achieve/extend.html) 。

<Vssue />