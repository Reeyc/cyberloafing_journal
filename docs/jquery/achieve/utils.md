# 静态工具方法实现

仅实现部分，这些工具方法都是写到jQuery类中。

:::warning
注意：有的浏览器不支持`trim()`方法，可以用原生js的`string.replace()`方法来替换成空串。
:::

```js
jQuery.extend({
  isString: function (str) {
    return typeof str === "string"
  },
  isHTML: function (str) {
    return str.charAt(0) == "<" && str.charAt(str.length - 1) == ">" && str.length >= 3
  },
  isObject: function (obj) {
    return typeof obj === "object"
  },
  isWindow: function (win) {
    return win === window
  },
  isArray: function (arr) {
    return Array.isArray(arr)
  },
  isFakeArray: function (obj) {
    function verifyAllProp(obj) {
      var flag = true
      for (var key in obj) {
        if (key !== "length") {
          if (isNaN(+key) || typeof +key !== "number") {
            flag = false
            break
          }
        }
      }
      return flag
    }
    if (jQuery.isObject(obj) && !jQuery.isWindow(obj) && "length" in obj && verifyAllProp(obj)) {
      return true
    } else {
      return false
    }
  },
  isFunction: function (fun) {
    return typeof fun === "function"
  },
  trim: function (str) {
    if (!jQuery.isString(str)) {
      // 非字符串则直接返回
      return str
    }
    if (str.trim) {
      // 支持trim则用trim()方法处理
      return str.trim()
    } else {
      // 不支持则用原生js的replace()方法处理
      return str.replace(/^\s+|\s+$/g, "")
    }
  }
})
```

<Vssue />