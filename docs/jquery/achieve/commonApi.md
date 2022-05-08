# 常用API实现（上）

## 遍历相关

### each

在jQuery中，`each`用于遍历数组或对象，可以在回调函数内：

* 通过`return true`跳过当次循环。
* 通过`return false`跳出整个循环。

且为了方便操作，回调函数内的`this`也被改造成了当前循环到的元素。具体实现如下：
```js
jQuery.extend({
  each: function (obj, callback) {
    if (jQuery.isArray(obj)) {
      // 数组
      for (var i = 0; i < obj.length; i++) {
        // 1. 利用 call 改造回调函数内的 this 为当前遍历的元素
        // 2. 判断返回值，如果是 return true 则跳过当次循环，return false 终止循环
        var result = callback.call(obj[i], i, obj[i])
        if (result === true) {
          continue
        } else if (result === false) {
          break
        }
      }
    } else if (jQuery.isObject(obj)) {
      // 对象
      for (var key in obj) {
        // 不遍历原型上的属性
        if (obj.hasOwnProperty(key)) {
          // 此处与上边同理...
          var result = callback.call(obj[key], key, obj[key])
          if (result === true) {
            continue
          } else if (result === false) {
            break
          }
        }
      }
    }
    return obj
  }
})
```

`each`既是类的静态方法，也是实例方法。不同的是，实例方法只需要接收一个`callback`，不需要接收遍历的目标，因为遍历的目标就是调用者本身，也就是jQuery对象。
```js
jQuery.fn.extend({
  each: function (callBack) {
    return jQuery.each(this, callBack)
  }
})
```

正因如此，所以要格外注意，以不同方式调用`each`，`callback`回调里面的参数可能是不一样的：
```js
// 原生对象
var obj = {
  a: "b",
  c: "d"
}

// obj未被封装，遍历的是原生对象
$.each(obj, function (index, element) {
  // index === a element === b
  // index === c element === d
  console.log(' index === ', index, ' element === ', element)
})

// obj已被封装，遍历的是封装后的jQuery对象
$(obj).each(function (index, element) {
  // index === 0 element === {a: 'b', c: 'd'}
  console.log(' index === ', index, ' element === ', element)
})
```
上面例子中，`$.each(obj)`遍历的是原生的JS对象，所以可以拿到原生对象对应的 key/value ，而`$(obj).each()`遍历的是jQuery对象，也就是`$(obj)`，它的结构是这样的：
```js
{
  0: {
    a: "b",
    c: "d"
  },
  length: 1
}
```
所以此时`callback`内的参数自然跟`$.each(obj)`的方式不一样了。

### map

`map`和`each`很相像，都可以用于遍历对象、数组，区别在于：
* `map`如果遍历的是数组，则`callback`回调参数的位置和`each`是相反的。
* `map`的`this`指向window对象，而不是当前遍历的元素。
* `map`通常用于加工数组或对象，所以`map`的返回值是一个数组，如果 而`each`返回被遍历的对象。
* `map`的`return`是用来加工的，所以不存在`return true`或`return false`来控制循环。

具体实现如下：

```js
jQuery.extend({
  each: function (obj, callback) {
    // ...
  },
  map: function (obj, callBack) {
    // 保存加工后的数组
    var temp = []
    if (jQuery.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        // 此处不显式指定 this 指向，回调函数的 this 默认都是window对象
        var result = callBack(obj[i], i)
        // 规避 undefined 值
        if (result) {
          temp.push(result)
        }
      }
    } else if (jQuery.isObject(obj)) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var result = callBack(key, obj[key])
          // 规避 undefined 值
          if (result) {
            temp.push(result)
          }
        }
      }
    }
    // 将加工后的数组返回
    return temp
  }
})
```

:::warning
`map`和`each`一样，既是jQuery的静态方法，也是实例方法。所以要注意的点可以参考上面`$.each(obj)` 和 `$(obj).each()`。
```js
jQuery.fn.extend({
  each: function (callBack) {
    return jQuery.each(this, callBack)
  },
  map: function (callBack) {
    return jQuery.map(this, callBack)
  }
})
```
:::

## 筛选相关

### get
`get(index)`：将jQuery对象里指定的元素返回。

| 参数 | 描述 |
| - | - |
| 正数 | 获取jQuery对象里指定的元素返回。|
| 负数 | 倒着获取并返回。|
| 省略 | 将调用者jQuery对象转为一个数组返回。|

```js
jQuery.fn.extend({
  get: function (num) {
    if (arguments.length === 0) {
      // 省略参数
      return [].slice.call(this)
    } else if (num >= 0) {
      // 正数
      return this[num]
    } else {
      // 负数
      return this[this.length + num]
    }
  }
})
```

### eq
`eq(index)`：获取jQuery对象里指定的元素，并继续把该元素包装成jQuery对象的形式返回。

| 参数 | 描述 |
| - | - |
| 正数 | 获取jQuery对象里指定的元素，并将其包装成jQuery对象返回。|
| 负数 | 倒着获取并返回。|
| 省略 | 返回一个新的jQuery对象。|

```js
jQuery.fn.extend({
  get: function (num) {
    // ...
  },
  eq: function (num) {
    if (arguments.length === 0) {
      // 省略参数，返回新的jQuery对象
      return jQuery()
    } else {
      // 获取元素并包装成jQuery对象返回
      // 此处直接利用 get 的效果实现正负数的获取
      return jQuery(this.get(num))
    }
  }
})
```
### first & last

* `first()`：获取jQuery对象中的第一个元素，并以jQuery对象的形式返回。
* `last()`：获取jQuery对象中的最后一个元素，并以jQuery对象的形式返回。

```js
jQuery.fn.extend({
  get: function (num) {
    // ...
  },
  eq: function (num) {
    // ...
  },
  first: function () {
    // 直接利用eq的效果实现
    return this.eq(0)
  },
  last: function () {
    return this.eq(-1)
  }
})
```

### next & prev

* `next(selector)`：获取所有指定元素的前一个元素，并将其包装成jQuery对象返回。
* `prev(selector)`：获取所有指定元素的后一个元素，并将其包装成jQuery对象返回。

| 参数 | 描述 |
| - | - |
| selector | 筛选获取到的指定元素。省略参数，则返回获取到的所有指定元素。 |

在获取（前/后）一个元素前，需要先编写两个工具方法，用于获取当前元素的（前/后）一个元素：
```js
jQuery.extend({
  // 获取下一个节点
  get_nextsibling: function (n) {
    var x = n.nextSibling
    if (x === undefined) return false
    // 循环持续寻找，只找元素节点
    while (x !== null && x.nodeType !== 1) {
      x = x.nextSibling
    }
    return x
  },
  // 获取上一个节点
  get_previoussibling: function (n) {
    var x = n.previousSibling
    if (x === undefined) return false
    while (x !== null && x.nodeType !== 1) {
      x = x.previousSibling
    }
    return x
  }
})
```
具体实现细节：
```js
jQuery.fn.extend({
  get: function (num) {
    // ...
  },
  eq: function (num) {
    // ...
  },
  first: function () {
    // ...
  },
  last: function () {
    // ...
  },
  next: function (selector) {
    // 获取多个调用者的前一个元素，所以要用数组保存
    var result = []
    if (arguments.length === 0) {
      // 省略参数：全部获取
      this.each(function (index, element) {
        var next = jQuery.get_nextsibling(element)
        if (next) {
          result.push(next)
        }
      })
    } else {
      // 传参：获取后，根据CSS选择器过滤一遍
      this.each(function (index, element) {
        // 当前元素的下一个元素
        var next = jQuery.get_nextsibling(element)
        $(selector).each(function (i, e) {
          if (e === null || e !== next) return true
          result.push(e)
        })
      })
    }
    return jQuery(result)
  },
  prev: function (selector) {
    var result = []
    if (arguments.length === 0) {
      this.each(function (index, element) {
        var pre = jQuery.get_previoussibling(element)
        if (pre) {
          result.push(pre)
        }
      })
    } else {
      this.each(function (index, element) {
        var pre = jQuery.get_previoussibling(element)
        $(selector).each(function (i, e) {
          if (e === null || e !== pre) return true
          result.push(e)
        })
      })
    }
    return jQuery(result)
  }
})
```