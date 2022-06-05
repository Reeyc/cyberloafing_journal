# 静态工具方法实现

仅实现一部分静态工具方法，这些方法都是写入到jQuery类中。这里提前实现是为了方面后面实现核心函数和各种API。

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
        if (obj.hasOwnProperty(key)) {
          if (key !== "length" && key !== "selector" && typeof +key !== "number") {
            flag = false
            break
          }
        }
      }
      return flag
    }
    return ycQuery.isObject(obj) && !ycQuery.isWindow(obj) && "length" in obj && verifyAllProp(obj)
  },
  isFunction: function (fun) {
    return typeof fun === "function"
  },
  trim: function (str) {
    if (!jQuery.isString(str)) {
      return str
    }
    if (str.trim) {
      return str.trim()
    } else {
      return str.replace(/^\s+|\s+$/g, "")
    }
  }
})
```

<Vssue />