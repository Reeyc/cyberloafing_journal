# jQuery插件机制

jQuery这个类中包含了太多静态方法和实例方法，代码过多会造成阅览性很差，并且难以查错维护。

应该将这些方法分类包装到一个方法中管理，并且这个方法提供了可扩展性（插件）。

定义一个静态管理方法，用来接收并拷贝对象。
```js
jQuery.extend = function (obj) {
  for (var key in obj) {
    this[key] = obj[key]
  }
}
```

调用这个静态管理方法，并把需要集中管理的静态方法以对象的键值对方式传递进去，这也正是jQuery的插件机制。
```js
// 扩展静态方法
jQuery.extend({
  isString: function () {
    // ...
  },
  isHTML: function () {
    // ...
  },
  isObject: function () {
    // ...
  },
  isWindow: function () {
    // ...
  },
  isArray: function () {
    // ...
  },
  isFunction: function () {
    // ...
  },
  trim: function () {
    // ...
  }
})
```

原型方法也可以和静态方法一样：
```js
jQuery.extend = jQuery.prototype.extend = function (obj) {
  for (var key in obj) {
    this[key] = obj[key]
  }
}
```
实例方法批量管理：
```js
// 管理元素相关API
jQuery.fn.extend({
  append: function () {
    // ...
  },
  appendTo: function () {
    // ...
  },
  prepend: function () {
    // ...
  },
  prependTo: function () {
    // ...
  }
})

// 管理文本相关API
jQuery.fn.extend({
  html: function () {
    // ...
  },
  text: function () {
    // ...
  }
})

// 管理动画相关API
jQuery.fn.extend({
  show: function () {
    // ...
  },
  hide: function () {
    // ...
  },
  toggle: function () {
    // ...
  }
})
```

<Vssue />