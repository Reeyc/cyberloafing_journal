# 常用API实现（下）

## CSS系列

### css

**`Element.css(key, value | properties)`** 操作元素的CSS样式 。

| 参数 | 描述 |
| - | - |
| key | 样式名 |
| value | 样式值，省略该参数是获取第一个元素的值，传递则是全部设置 |
| properties | 不传 key/value 的话，可以直接传递一个对象，用于批量设置 |
| **返回值** | 返回样式值，设置则是返回调用者 |

实现一个工具方法，用于兼容获取样式：
```js
jQuery.extend({
  get_style: function (obj, attr) {
    if (window.getComputedStyle) {
      // 现代浏览器
      return getComputedStyle(obj, null)[attr]
    } else {
      // IE8及以下
      return obj.currentStyle[attr]
    }
  }
})
```

实现 `css()`：
```js
jQuery.fn.extend({
  css: function (prop, value) {
    if (jQuery.isString(prop)) {
      // 字符串
      if (arguments.length === 1) {
        // 获取
        return jQuery.get_style(this.get(0), prop)
      } else {
        // 设置
        this.each(function (index, element) {
          element.style[prop] = value
        })
      }
    } else if (jQuery.isObject(prop)) {
      // 对象
      this.each(function (index, element) {
        jQuery.each(prop, function (key, value) {
          if (element.nodeType === 1) {
            element.style[key] = value // 批量设置
          }
        })
      })
    }
    return this
  }
})
```

### hasClass

**`Element.hasClass(class)`** 检查当前的元素是否存在某个特定的类。

| 参数 | 描述 |
| - | - |
| class | 类名 |
| **返回值** | 存在返回true，否则返回false |

如果查询的元素是多个，只要有一个元素含有这个类，就返回true。

原生JS的 `indexOf()` 方法可以检索一段字符中是否含有特定的字符。但是这样获取到的类名有可能不是我们需要的，比如需要 `box` 类， `box-wrap` 这个类也会被检索到。正确的处理方式是，在检索的时候在类的前面加 空格字符串 来区检索，因为类与类之间是天然存在空格的。

需要注意，第一个类的前面没有空格，最后的类后面也没有空格，检索之前需手动加上。

:::danger 注意
由于操作的是都是字符串，为了避免原有的类首尾已经存在空串的情况，所以操作之前把字符串 `trim()` 一下，下面三个 `addClass`、`removeClass`、`toggleClass` 同理。
:::

```js
jQuery.fn.extend({
  hasClass: function (name) {
    var flag = false
    if (jQuery.isString(name)) {
      this.each(function (index, element) {
        if (element.nodeType === 1) {
          // 给首尾的类补上空格
          var classNames = " " + jQuery.trim(element.className) + " "
          if (classNames.indexOf(" " + name + " ") >= 0) {
            flag = true // 只要有一个元素包含该类名，就返回true
            return false // each() 内 return false 可以终止循环
          }
        }
      })
    }
    return flag
  }
})
```

### addClass

**`Element.addClass(class)`** 给元素添加指定的类。

| 参数 | 描述 |
| - | - |
| class | 类名 |
| **返回值** | 调用者 |

* 已经存在的类，不会重复添加。
* 中间用空格隔开，可以同时添加多个类。

```js
jQuery.fn.extend({
  hasClass: function (name) {
    // ...
  },
  addClass: function (name) {
    if (jQuery.isString(name)) {
      var classNmaes = jQuery.trim(name).split(" ")
      this.each(function (index, element) {
        if (element.nodeType === 1) {
          jQuery.each(classNmaes, function (i, n) {
            if (!element.className) {
              // 元素没有类
              element.className = n
            } else if (!jQuery(element).hasClass(n)) {
              // 元素中没有含有这个类
              element.className = element.className + " " + n
            }
          })
        }
      })
    }
    return this
  }
})
```

### removeClass

**`Element.removeClass(class)`** 给元素删除指定的类。

| 参数 | 描述 |
| - | - |
| class | 类名 |
| **返回值** | 调用者 |

* 省略参数，会删除所有指定元素的所有类。
* 中间用空格隔开，可以同时删除多个类。

利用原生JS的 `replace()` 来删除字符串，为了避免跟 `indexOf()` 一样检索出错的情况，所以检索之前建议都加上空串来检索。

```js
jQuery.fn.extend({
  hasClass: function (name) {
    // ...
  },
  addClass: function (name) {
    // ...
  },
  removeClass: function (name) {
    if (arguments.length === 0) {
      this.each(function (index, element) {
        element.className = "" // 删除所有类
      })
    } else if (jQuery.isString(name)) {
      var classNmaes = jQuery.trim(name).split(" ")
      this.each(function (index, element) {
        if (element.nodeType === 1) {
          jQuery.each(classNmaes, function (i, n) {
            if (jQuery(element).hasClass(n)) {
              // 给首尾的类补上空格
              var tempClassNames = " " + jQuery.trim(element.className) + " "
              // 给当前的类补上空格
              var tempClassName = ""
              var firstStr = " " + n // 用于检索第一个类
              var lastStr = n + " " // 用于检索最后一个类
              var middleStr = " " + n + " " // 用于检索中间类
              if (tempClassNames.indexOf(firstStr) >= 0) { 
                tempClassName = firstStr
              } else if (tempClassNames.lastIndexOf(lastStr) >= 0) { 
                tempClassName = lastStr
              } else {
                tempClassName = middleStr
              }
              // 替换完毕后，把首尾多余的空格去除
              element.className = jQuery.trim(tempClassNames.replace(tempClassName, ""))
            }
          })
        }
      })
    }
    return this
  }
})
```

### toggleClass

**`Element.toggleClass(class)`** 给元素切换指定的类（存在则删除，不存在则添加）。

| 参数 | 描述 |
| - | - |
| class | 类名 |
| **返回值** | 调用者 |

* 省略参数，会删除所有指定元素的所有类。
* 中间用空格隔开，可以同时切换多个类。

```js
jQuery.fn.extend({
  hasClass: function (name) {
    // ...
  },
  addClass: function (name) {
    // ...
  },
  removeClass: function (name) {
    // ...
  },
  toggleClass: function (name) {
    if (arguments.length === 0) {
      // 不传参删除所有类
      this.each(function (index, element) {
        jQuery(element).removeClass()
      })
    } else if (jQuery.isString(name)) {
      var classNmaes = jQuery.trim(name).split(" ")
      this.each(function (index, element) {
        if (element.nodeType === 1) {
          jQuery.each(classNmaes, function (i, n) {
            if (jQuery(element).hasClass(n)) {
              // 有则删
              jQuery(element).removeClass(n)
            } else {
              // 无则加
              jQuery(element).addClass(n)
            }
          })
        }
      })
    }
    return this
  }
})
```

## 事件系列

### on

**`Element.on(events[,fn])`**：给元素绑定事件。

| 参数 | 描述 |
| - | - |
| events | 标准的事件类型（不带`on`前缀） |
| fn | 事件响应函数 |
| **返回值** | 调用者 |

实现一个工具方法，用于兼容绑定事件：
```js
jQuery.extend({
  add_event: function (obj, event, callBack) {
    if (obj.addEventListener) {
      // 现代浏览器
      obj.addEventListener(event, callBack, false)
    } else {
      // IE8及以下
      obj.attachEvent("on" + event, callBack)
    }
  }
})
```

* `on()` 可以为多个元素同时绑定事件。
* `on()` 可以为多个元素多次绑定相同事件，并且不会覆盖，先绑定的先执行，后绑定的后执行。

思路：遍历绑定事件的多个元素，采用对象缓存不同的事件类型，每个事件类型为一个数组，数组维护同一个类型事件的多个响应函数，调用时遍历数组循环调用回调函数。

```js
jQuery.fn.extend({
  on: function (event, callBack) {
    this.each(function (index, element) {
      if (element.nodeType === 1) {
        if (!element.eventsCache) {
          // 缓存事件类型
          element.eventsCache = {}
        }
        if (!element.eventsCache[event]) {
          // 维护事件数组
          element.eventsCache[event] = [callBack]
          jQuery.add_event(element, event, function () {
            // 遍历事件数组，依次触发相同事件
            jQuery.each(element.eventsCache[event], function (i, fn) {
              fn()
            })
          })
        } else {
          element.eventsCache[event].push(callBack)
        }
      }
    })
    return this
  }
})
```

### off

**`Element.off(events[,fn])`**：给元素解绑事件。

| 参数 | 描述 |
| - | - |
| events | 解绑的标准事件类型（不带`on`前缀） |
| fn | 具名函数，解绑指定元素的指定事件 |
| **返回值** | 调用者 |

`off()` 不传参的情况会解绑该元素所有事件。传递 events 就会解绑对应的事件。

思路：将事件类型对象 `eventsCache` 设置为空对象可以解绑所有事件。将事件类型数组 `eventsCache[event]` 设置为空数组可以解绑对应的元素所有事件。

---

`off()` 的 fn 参数传递具名函数可以解绑元素的指定事件。

思路：循环执行事件回调时加判断，如果两个函数全等，则从数组内移除。

`off()` 实现时，可以不用再判断元素的 `eventsCache` 和 `eventsCache[event]` 非空了，因为元素调用 `on()` 的时候已经为这个元素创建了对象跟数组。

```js
jQuery.fn.extend({
  on: function (event, callBack) {
    // ...
  },
  off: function (event, callBack) {
    var arg = arguments
    this.each(function (index, element) {
      if (element.nodeType === 1) {
        if (arg.length === 0) {
          // 省略参数，解绑所有事件
          element.eventsCache = {}
        } else if (arg.length === 1) {
          // 传一个参数，解绑指定类型事件
          element.eventsCache[event] = []
        } else {
          // 传多个参数，解绑具名函数事件
          jQuery.each(element.eventsCache[event], function (i, fn) {
            if (fn === callBack) {
              element.eventsCache[event].splice(i, 1)
            }
          })
        }
      }
    })
    return this
  }
})
```

## 请求系列

### ajax

jQuery的 `ajax()` 接受的参数比较多，并且不用考虑顺序问题，所以采用对象的方式进行传递，因为对象本身就是无序数据的集合。

补充知识点：
1. IE6等低版本浏览器认为，请求同一个URL只能有一个结果，换言之，只要每次请求的URL没有变化，就永远只能获取到原来那份数据。解决方案是，让每次请求的URL都携带一个不同的字符参数，建议使用时间戳。
2. IE6不支持 `XMLHttpRequest` 来创建 XHR 对象，要使用 `ActiveXObject("Microsoft.XMLHTTP")` 来创建。
3. `xhr.open(method, url, async)` 用于初始化一个http请求。

| 参数 | 描述 |
| - | - |
| method | 请求的方法，例如 get、post |
| url | 请求的地址，get方式请求直接拼接到该参数后面 |
| async | 请求的方式，可选，默认true为异步，false为同步 |

4. `xhr.send(body)` 用于发送一个http请求。

| 参数 | 描述 |
| - | - |
| body | 请求体 |

:::warning 注意
ajax发送post请求的请求体默认是 **payload格式** 的，`xhr.setRequestHeader()` 用于设置请求头的属性，可以在此设置请求体为 **urlencoded格式** 。
```js
// urlencoded格式
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
```
:::

5. `xhr.abort()` 方法用于取消http请求。
6. `xhr.onreadystatechange()` 事件用于监听http状态的变化。
7. `xhr.readyState` 返回http请求的状态值。

| 值  | 描述                                              |
| ---| ------------------------------------------------- |
| 0  | **请求未初始化**，未开始 `send()` 发送请求             |
| 1  | **请求正在载入**，正在 `send()` 发送请求               |
| 2  | **请求载入完毕**，已 `send()` 发送请求，接收到响应体内容 |
| 3  | **解析**，正在解析响应体的信息                        |
| 4  | **请求已完成，且响应已就绪**，响应体已全部解析完毕        |

8. 获取处理的结果，xhr对象提供一系列API来帮助我们获取响应的内容：
* `responseText` 获取文本格式的响应体信息
* `responseXML` 获取XML格式的响应体信息
* `getResponseHeader()` 获取单个响应头信息，传递指定属性参数
* `getAllResponseHeaders()`获取所有响应头信息，无需传参

---

具体的实现如下：

定义一个工具方法，用于将对象转为 urlcode 格式参数，并处理中文字符：
```js
jQuery.extend({
  objToStr: function (data) {
    data = data || {}
    data.t = new Date().getTime() // 保存实时时间

    var result = []
    for (var key in data) {
      // 转码(处理URL中文)
      result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    }
    return result.join("&")
  }
})
```

`ajax()` 具体实现：

```js
jQuery.extend({
  ajax: function (option) {
    option.type = option.type || "get"
    var xhr, timer
    // 参数对象转字符串
    var params = jQuery.objToStr(option.data)
    // 创建异步对象
    if (window.XMLHttpRequest) {
      // 现代浏览器
      xhr = new XMLHttpRequest()
    } else {
      // IE6及以下
      xhr = new ActiveXObject("Microsoft xhr")
    }
    if (option.type.toLowerCase() === "get") {
      // GET
      xhr.open(option.type, option.url + "?" + params, true)
      xhr.send()
    } else if (option.type.toLowerCase() === "post") {
      // POST
      xhr.open(option.type, option.url, true)
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
      xhr.send(params)
    }
    // 监听
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        clearInterval(timer)
        if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304) {
          // 成功
          option.success && option.success(JSON.parse(xhr.responseText))
        } else {
          // 失败
          option.error && option.error(xhr)
        }
      }
    }
    // 请求超时
    if (option.timeout) {
      timer = setInterval(function () {
        xhr.abort()
        clearInterval(timer)
      }, option.timeout)
    }
  }
})
```

<Vssue />