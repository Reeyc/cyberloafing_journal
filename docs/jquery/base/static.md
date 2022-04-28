# 静态方法

静态方法即是定义在jQuery函数上的方法，可以直接通过`jQuery`或者 **`$`** 来调用。

## holdReady

`holdReady(hold)`：暂停或恢复入口函数。
| 参数                | 描述                                    |
| ------------------ |---------------------------------------- |
| hold               | `true`暂停入口函数。`false`恢复入口函数。    |

`ready()`的回调函数就是入口函数。他会在页面所有的DOM元素加载完毕后立即执行（不包括图片）。有时候，我们希望jquery的入口函数不那么早执行。希望先将其他代码执行后再执行jquery的代码。此时就需要用到`holdReady`方法了。
```html
<script>
$.holdReady(true); //暂停入口函数
$(function () {
  console.log("我是入口函数~~");
});
</script>

<script>
window.onload = function () {
  var button = document.getElementsByTagName("button")[0];
  button.onclick = function () {
    $.holdReady(false); //点击恢复入口函数
  };
};
</script>
```

## each

`each(object, [callback])`：遍历对象或数组

| 参数 | 描述 |
| - | - |
| object | 要遍历的对象或数组 |
| callback | 回调函数 |
| **返回值** | 被遍历的对象/数组 |

`each`方法和原生JS数组的`forEach`方法很像，都是用来遍历数组的。区别在于：
* `each`可以遍历数组跟对象。`forEach`只能遍历数组。
* `each`中的回调参数顺序为：索引->元素，如果是对象则是：key->value，`forEach`是：元素->索引。
* `each`中的回调`this`指向元素的值，`forEach`则是指向`window`对象。
* `each`可以通过`return false`终止循环，而`forEach`使用`return false`则是跳过本次循环，终止循环只能通过手动抛出异常`throw new Error`来实现。
```js
$.each(["a", "b", "c"], function(i, e) {
  if (i === 2) return false
  console.log(i, e, this)
})

;["x", "y", "z"].forEach(function(e, i) {
  if (i === 2) return false
  console.log(e, i, this)
})
```

## map

`map(object, [callback])`：遍历对象或数组

| 参数 | 描述 |
| - | - |
| object | 要遍历的对象或数组 |
| callback | 回调函数 |
| **返回值** | 被加工过的对象/数组 |

静态方法`map`和`each`差不多，作用都是用来遍历数组或者对象的，并且不会影响原数组/对象。两者的区别在于：
* `each`的回调参数是：索引->元素，或者 key->value。`map`相反：元素->索引，或者 value->key。
* `each`的返回值是被遍历的对象/数组。`map`的返回值默认是一个空数组。
* `each`不支持自定义返回值。`map`可以用`return`对返回值数组的每一项进行加工操作。

```js
const result = $.map({ a: "b", c: "d" }, function(v, k) {
  console.log(v, k)
  return { [v]: k }
})

console.log(result) // { b: "a", d: "c" }
```

## 其他静态方法

### trim
`trim(str)`：去除字符串两端空格，参数传字符串。

| 参数 | 描述 |
| - | - |
| str | 要处理的字符串 |
| **返回值** | 处理后的字符串 |

```js
$(function () {
  var str = " 左右有空格 "; //字符串

  var temp = $.trim(str); //去除空格

  console.log(`---${temp}---`);
  console.log(`---${str}---`); //不会对原字符串产生影响
});
```

### isArray
`isArray(target)`：检查目标是否是数组。

| 参数 | 描述 |
| - | - |
| target | 要检查的目标 |
| **返回值** | true/false |

```js
$(function () {
  var arr = [1, 2];
  var obj = { 1: 10, 2: 20, length: 2 };
  var str = " 左右有空格 "; //字符串
  var win = window; //window
  var fun = function () {}; //函数

  console.log($.isArray(arr)); //数组 true
  console.log($.isArray(obj)); //伪数组 false
  console.log($.isArray(str)); //字符串 false
  console.log($.isArray(win)); //widnow flase
  console.log($.isArray(fun)); //函数 false
});
```

### isFunction
`isFunction(target)`：检查目标是否是函数。

| 参数 | 描述 |
| - | - |
| target | 要检查的目标 |
| **返回值** | true/false |

```js
$(function () {
  var arr = [1, 2];
  var obj = { 1: 10, 2: 20, length: 2 };
  var str = " 左右有空格 "; //字符串
  var win = window; //window
  var fun = function () {}; //函数

  console.log($.isFunction(arr)); //数组 false
  console.log($.isFunction(obj)); //伪数组 false
  console.log($.isFunction(str)); //字符串 false
  console.log($.isFunction(win)); //widnow flase
  console.log($.isFunction(fun)); //函数 true

  //jquery框架本身也算是一个大的匿名函数,所以传递jquery也是返回true
  console.log($.isFunction($)); //true
  console.log($.isFunction(jQuery)); //true
});
```

### isWindow
`isWindow(target)`：检查目标是否是全局Window对象。

| 参数 | 描述 |
| - | - |
| target | 要检查的目标 |
| **返回值** | true/false |

```js
$(function () {
  var arr = [1, 2];
  var obj = { 1: 10, 2: 20, length: 2 };
  var str = " 左右有空格 "; //字符串
  var win = window; //window
  var fun = function () {}; //函数

  console.log($.isWindow(arr)); //数组 false
  console.log($.isWindow(obj)); //伪数组 false
  console.log($.isWindow(str)); //字符串 false
  console.log($.isWindow(win)); //widnow true
  console.log($.isWindow(fun)); //函数 false
});
```

还有更多的静态方法建议查阅 [官网](https://api.jquery.com/)。

<Vssue />