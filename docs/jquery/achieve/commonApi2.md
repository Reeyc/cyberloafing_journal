# 常用API实现（中）

## 元素系列

### appendTo & prependTo

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.appendTo(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将元素添加到父元素内最后面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标父元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>添加的子元素集合。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.prependTo(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将元素添加到父元素内最前面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标父元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>添加的子元素集合。</td>
    </tr>
  </table>
</div>

不同情况：

* 一子一父，把指定的子元素添加到指定的父元素中。
* 一子多父，把指定的子元素分别添加到多个指定的父元素当中，
* 多子多父，把多个指定的子元素添加到多个指定的父元素当中。

所以要开启双循环，遍历父元素内遍历子元素，把当前遍历到的子元素加入当前父元素当中。

:::warning 注意
如果当前子元素加入当前父元素之后，下次循环再将当前子元素加入后面的父元素的话，就会把之前父元素内的子元素给移动掉了。所以，后面的父元素要复制一份再加。
:::

```js
jQuery.fn.extend({
  appendTo: function (elem) {
    var $this = this
    var result = []
    // 遍历父元素
    jQuery(elem).each(function (index, element) {
      // 遍历子元素
      $this.each(function (i, e) {
        if (element.nodeType === 1 && e.nodeType === 1) {
          if (index == 0) {
            // 第一个父元素直接加
            element.appendChild(e)
            result.push(e)
          } else {
            // 后面的父元素复制一份子元素再加
            var temp = e.cloneNode(true)
            element.appendChild(temp)
            result.push(temp)
          }
        }
      })
    })
    return jQuery(result)
  },
  prependTo: function (elem) {
    var $this = this
    var result = []
    jQuery(elem).each(function (index, element) {
      $this.each(function (i, e) {
        if (element.nodeType === 1 && e.nodeType === 1) {
          // 处理后添加问题
          if (index == 0) {
            // 借助 insertBefore 实现插入父元素内第一位
            element.insertBefore(e, element.firstChild)
            result.push(e)
          } else {
            var temp = e.cloneNode(true)
            element.insertBefore(temp, element.firstChild)
            result.push(temp)
          }
        }
      })
    })
    return jQuery(result)
  }
})
```

### append & prepend

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.append(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将子元素添加到元素内最后面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标子元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.prepend(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将子元素添加到元素内最前面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标子元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
</div>

`append`、`prepend` 也是用来往父元素内部添加子元素的，这两个API和 `append`、`prepend` 的区别：

#### 调用者和参数的顺序不同。
* `appendTo` / `prependTo` 是子元素调用，传递父元素。
* `append` / `prepend` 是父元素调用，传递子元素。

#### 对字符串的处理不同。
* `appendTo` / `prependTo` 会把字符串当做**选择器**来处理。
* `append` / `prepend` 会把字符串当做**普通的字符串**来处理。

#### 返回值不同。
* `appendTo` / `prependTo` 的返回值是子元素集合。
* `append` / `prepend` 的返回值是调用者。

```js
jQuery.fn.extend({
  appendTo: function (elem) {
    // ...
  },
  prependTo: function (elem) {
    // ...
  },
  append: function (elem) {
    if (jQuery.isString(elem)) {
      // 原生js才能使用innerHTML属性，要先用get()转为原生js对象
      this.get(0).innerHTML += elem
    } else {
      // 非字符串的处理，借助appendTo()实现添加
      jQuery(elem).appendTo(this)
    }
    return this
  },
  prepend: function (elem) {
    if (jQuery.isString(elem)) {
      // 字符串加到前面
      this.get(0).innerHTML = elem + this.get(0).innerHTML
    } else {
      jQuery(elem).prependTo(this)
    }
    return this
  }
})
```

### insertBefore & insertAfter

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.insertBefore(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将元素添加到目标元素外的前面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>添加的元素集合。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.insertAfter(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将元素添加到目标元素外的后面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标子元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>添加的元素集合。</td>
    </tr>
  </table>
</div>

由于是添加到目标元素的外部，所以需要获取目标元素的父元素。通过其父元素的`insertBefore()`方法可以随意将元素随意插入想要的位置。

```js
jQuery.fn.extend({
  insertBefore: function (elem) {
    var $this = this
    var result = []
    // 遍历目标元素
    jQuery(elem).each(function (index, element) {
      var parent = element.parentNode // 获取目标元素的父元素
      // 遍历插入者元素
      $this.each(function (i, e) {
        if (element.nodeType === 1 && e.nodeType === 1) {
          // 处理后添加问题
          if (index == 0) {
            parent.insertBefore(e, element) // 通过目标元素的父元素实现添加
            result.push(e)
          } else {
            var temp = e.cloneNode(true)
            parent.insertBefore(temp, element)
            result.push(temp)
          }
        }
      })
    })
    return jQuery(result)
  }
})
```

原生JS的`insertBefore()`只支持将元素插入目标元素前面，无法插入目标元素的后面。这里可以借助上一章实现的 [get_nextsibling()](/jquery/achieve/commonApi.html#next-prev) 工具方法来获取目标元素的下一个元素。

```js
jQuery.fn.extend({
  insertBefore: function (elem) {
    // ...
  },
  insertAfter: function (elem) {
    var $this = this
    var result = []
    jQuery(elem).each(function (index, element) {
      var parent = element.parentNode // 获取目标元素的父元素
      var next = jQuery.get_nextsibling(element) // 获取目标元素的下一个元素
      $this.each(function (v, e) {
        if (element.nodeType === 1 && e.nodeType === 1) {
          if (index == 0) {
            parent.insertBefore(e, next)
            result.push(e)
          } else {
            var temp = e.cloneNode(true)
            parent.insertBefore(temp, next)
            result.push(temp)
          }
        }
      })
    })
    return jQuery(result)
  }
})
```

### before & after

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.before(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将元素添加到目标元素外的前面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.after(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将元素添加到目标元素外的后面</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>目标元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
</div>

`before`、`after` 也是用来往目标元素外部添加元素的，这两个API和 `insertBefore`、`insertAfter` 的区别：

#### 调用者和参数的顺序不同。
* `insertBefore`  / `insertAfter` 是插入者调用，传递参考者。
* `before` / `after` 是参考者调用，传递插入者

#### 对字符串的处理不同。
* `insertBefore`  / `insertAfter` 会把字符串当做**选择器**来处理。
* `before` / `after` 会把字符串当做**普通的字符串**来处理。

#### 返回值不同。
* `appendTo` / `prependTo` 的返回值是添加的元素集合。
* `append` / `prepend` 的返回值是参考者。

:::warning 注意
原生JS的 `insertBefore()` 插入的参数必须是节点，不能是字符串。所以要通过 `createTextNode()` 将字符串转化为文本节点再插入。
:::

```js
jQuery.fn.extend({
  insertBefore: function (elem) {
    // ...
  },
  insertAfter: function (elem) {
    // ...
  },
  before: function (elem) {
    if (jQuery.isString(elem)) {
      // 字符串
      this.each(function (value, element) {
        var textStr = document.createTextNode(elem) // 转为文本节点
        var parent = element.parentNode // 参考者的父元素
        parent.insertBefore(textStr, element)
      })
    } else {
      // 非字符串的处理跟 insertBefore() 是一样的
      jQuery(elem).insertBefore(this)
    }
    return this
  },
  after: function (elem) {
    if (jQuery.isString(elem)) {
      this.each(function (value, element) {
        var textStr = document.createTextNode(elem)
        var parent = element.parentNode // 参考者的父元素
        var next = jQuery.get_nextsibling(element) // 参考者的后一个元素
        parent.insertBefore(textStr, next)
      })
    } else {
      jQuery(elem).insertAfter(this)
    }
    return this
  }
})
```

### replaceAll & replaceWith

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.replaceAll(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将目标元素替换成指定的元素，替换后的元素调用。</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>替换前的元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.replaceWith(elem)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">将目标元素替换成指定的元素，替换前的元素调用。</td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>elem</td>
      <td>替换后的元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
</div>

借用原生JS的 `replaceChild()` 方法实现替换元素。

```js
jQuery.fn.extend({
  replaceAll: function (elem) {
    var $this = this
    var result = []
    // 遍历所有被替换的元素
    jQuery(elem).each(function (index, element) {
      // 遍历所有替换的元素
      $this.each(function (v, e) {
        if (element.nodeType === 1 && e.nodeType === 1) {
          if (index == 0) {
            element.parentNode.replaceChild(e, element)
            result.push(e)
          } else {
            var temp = e.cloneNode(true)
            element.parentNode.replaceChild(temp, element)
            result.push(temp)
          }
        }
      })
    })
    return jQuery(result)
  },
  replaceWith: function (elem) {
    var result = []
    this.each(function (index, element) {
      jQuery(elem).each(function (v, e) {
        if (element.nodeType === 1 && e.nodeType === 1) {
          if (index == 0) {
            element.parentNode.replaceChild(e, element)
            result.push(element)
          } else {
            var temp = e.cloneNode(true)
            element.parentNode.replaceChild(temp, element)
            result.push(element)
          }
        }
      })
    })
    return jQuery(result)
  }
})
```

### empty & remove

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.empty()</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">清空元素内容，不删除元素本身。</td>
    </tr>
    <tr>
     <td colspan="2">无参数</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.remove(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">删除元素自身。</td>
    </tr>
    <tr>
      <td>selector</td>
      <td>删除匹配的元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
</div>

```js
jQuery.fn.extend({
  empty: function () {
    this.each(function (index, element) {
      element.innerHTML = ""
    })
    return this
  },
  remove: function (selector) {
    if (arguments.length === 0) {
      // 无参数
      this.each(function (index, element) {
        if (element.nodeType === 1) {
          element.parentNode.removeChild(element) // 删除每一个调用者
        }
      })
    } else {
      // 有参数
      this.each(function (index, element) {
        jQuery(selector).each(function (i, e) {
          if (element.nodeType === 1 && e.nodeType === 1) {
            if (e.tagName === element.tagName) {
              e.parentNode.removeChild(e) // 删除指定的调用者
            }
          }
        })
      })
    }
    return this
  }
})
```

### clone

**`Element.clone(deep)`** 拷贝元素。

| 参数 | 描述 |
| - | - |
| deep | 深度拷贝，默认浅拷贝 |
| **返回值** | 拷贝后的元素集合 |

深拷贝会将元素的 [事件](/jquery/achieve/commonApi3.html#on)  也拷贝过来，浅拷贝仅仅是拷贝元素。

利用原生JS的 `cloneNode(true)` 实现元素的拷贝。

```js
jQuery.fn.extend({
  clone: function (deep) {
    var result = []
    this.each(function (index, element) {
      if (element.nodeType === 1) {
        var temp = element.cloneNode(true)
        if (deep) {
          // 深拷贝，遍历事件集合
          jQuery.each(element.eventsCache, function (name, arr) {
            jQuery.each(arr, function (i, fn) {
              jQuery(temp).on(name, fn) // 给复制的元素添加事件
            })
          })
        }
        result.push(temp)
      }
    })
    return jQuery(result)
  }
})
```

## 属性系列

### attr

**`Element.attr(key, value | attributes)`** 操作元素的 [特性值](/jquery/base/property.html#特性和属性) 。

| 参数 | 描述 |
| - | - |
| key | 特性名称 |
| value | 特性值，省略该参数是获取第一个元素的值，传递则是全部设置 |
| attributes | 不传 key/value 的话，可以直接传递一个对象，用于批量设置 |
| **返回值** | 返回特性值，设置则是返回调用者 |

```js
jQuery.fn.extend({
  attr: function (attr, value) {
    if (jQuery.isString(attr)) {
      // 字符串
      if (arguments.length === 1) {
        // 获取
        return this.get(0).getAttribute(attr)
      } else {
        // 设置
        this.each(function (index, element) {
          if (element.nodeType === 1) {
            element.setAttribute(attr, value)
          }
        })
      }
    } else if (jQuery.isObject(attr)) {
      // 对象
      this.each(function (index, element) {
        jQuery.each(attr, function (key, value) {
          if (element.nodeType === 1) {
            element.setAttribute(key, value)
          }
        })
      })
    }
    return this
  }
})
```

### prop

**`Element.prop(key, value | properties)`** 操作元素的 [属性值](/jquery/base/property.html#特性和属性) 。

参数以及返回值同 `attr()` 一致。

```js
jQuery.fn.extend({
  attr: function (attr, value) {
    // ...
  },
  prop: function (prop, value) {
    if (jQuery.isString(prop)) {
      // 字符串
      if (arguments.length === 1) {
        // 获取
        return this.get(0)[prop]
      } else {
        // 设置
        this.each(function (index, element) {
          element[prop] = value
        })
      }
    } else if (jQuery.isObject(prop)) {
      // 对象
      this.each(function (index, element) {
        jQuery.each(prop, function (key, value) {
          element[key] = value
        })
      })
    }
    return this
  }
})
```

## 文本系列

### html & text

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.html(content)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">设置元素的innerHTML属性。</td>
    </tr>
    <tr>
      <td>content</td>
      <td>innerHTML内容，省略参数是获取第一个元素的值，传递参数是全部设置。</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.text(content)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">设置元素的innerText属性。</td>
    </tr>
    <tr>
      <td>content</td>
      <td>innerText内容，省略参数是获取所有元素的值拼接起来，传递参数是全部设置。</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者。</td>
    </tr>
  </table>
</div>

```js
jQuery.fn.extend({
  html: function (content) {
    if (arguments.length === 0) {
      // 获取
      return this[0].innerHTML
    } else {
      // 设置
      this.each(function (index, element) {
        element.innerHTML = content
      })
    }
    return this
  },
  text: function (content) {
    if (arguments.length === 0) {
      // 获取
      var result = ""
      this.each(function (index, element) {
        if (element.nodeType === 1) {
          result += element.innerText
        }
      })
      return result
    } else {
      // 设置
      this.each(function (index, element) {
        element.innerText = content
      })
    }
    return this
  }
})
```

### val

**`Element.val(value)`** 操作表单项的 `value` 属性 。

| 参数 | 描述 |
| - | - |
| value | 表单项的 value 值，省略该参数是获取第一个元素的值，传递是全部设置。 |
| **返回值** | 返回 value 值，设置则是返回调用者。 |

```js
jQuery.fn.extend({
  html: function (content) {
    // ...
  },
  text: function (content) {
    // ...
  },
  val: function (value) {
    if (arguments.length === 0) {
      // 获取
      return this.get(0).value
    } else {
      // 设置
      this.each(function (index, element) {
        element.value = value
      })
    }
    return this
  }
})
```

`val('')` 可以传递一个空串将表单值清空。`html('')` 和 `text('')` 也是同理。