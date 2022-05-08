# 静态工具方法实现

:::warning
仅实现部分，这些工具方法都是写到jQuery类中。
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