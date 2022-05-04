# 事件相关API

:::tip
  本章节基于jQuery3.0+版本，被废弃的`bind()`、`live()`、`delegate()`等API则不再描述。
:::

事件是构建 Web 应用程序来响应的内容。例如，当网页完成加载，或者用户选择某些内容、按键、调整窗口大小、提交表单或暂停视频时。

所有标准的事件类型可以参考文档：[MDN - Event reference](https://developer.mozilla.org/zh-CN/docs/Web/Events)。

---

在jQuery中通常使用`on()`来绑定事件。

## on

**`Element.on(events[,selector[,data[,fn]]])`**：给元素绑定事件。

| 参数 | 描述 |
| - | - |
| events | 标准的事件类型（不带`on`前缀），多个事件可以用空格隔开，也可以给事件类型加上命名空间 |
| selector | 为指定的后代元素绑定事件，如果省略，则为自身绑定事件 |
| data | 触发事件时，传递给`event.data`的数据 |
| fn | 事件响应函数 |
| **返回值** | 调用者 |

:::tip
以上参数，jQuery内部做了判断处理，不用担心顺序的问题，例如：`selector`和`data`不传进去，第二个参数直接传递`fn`响应函数，也是可以正常执行的。
:::

给`<button>`绑定click事件：
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    $("button").on('click', function () {
      $('input').val('hello world!!!')
    })
  })
</script>
```

### 多次绑定
多次绑定相同的事件不会被覆盖，jQuery会把相同事件推进一个 **队列** 中依次执行：
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    $("button").on('click', function () {
      $('input').val('hello world!!!')
    })

    $("button").on('click', function () {
      setTimeout(function () {
        $('input').val('hello jQuery!!!')
      }, 1000)
    })
  })
</script>
```

### 多元素绑定
可以同时给多个匹配的元素绑定事件：
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
  <p>click!!!</p>
</div>

<script>
  $(function () {
    $("button, p").on('click', function () {
      $('input').val('hello world!!!')
    })
  })
</script>
```

### this & event
* 事件响应函数内的`this`就是触发事件的元素。
* 事件响应函数内的第一个参数就是触发事件的对象（`event`）。

```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    $("button").on('click', function (event) {
      // 给this包装成jQuery元素，才能调用jQuery提供的API
      alert($(this).text()) // click!

      // event是当前触发事件的元素
      alert(event.target.innerText) // click!
    })
  })
</script>
```

### 绑定多事件
也可以绑定多个事件，以事件类型空格隔开：
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    // 当<button>和<input>点击的时候都会触发
    // 当<input>的value变化的时候也会触发
    $("button, input").on('click change', function () {
      console.log(this);
    })
  })
</script>
```

### 传递数据

`on` 的第三个参数data用于传递数据，将来可以从 `event` 对象中获取。至于第二个参数的介绍可以往下查看 [事件委派](/jquery/base/event.html#事件委派) 。
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    $("button").on('click', {
      callback: function () {
        alert('hello world!!!')
      }
    }, function (event) {
      event.data.callback && event.data.callback()
    })
  })
</script>
```

## one

**`Element.one(events[,selector[,data[,fn]]])`**：给元素绑定一次性事件。

| 参数 | 描述 |
| - | - |
| events | 标准的事件类型（不带`on`前缀），多个事件可以用空格隔开，也可以给事件类型加上命名空间 |
| selector | 为指定的后代元素绑定一次性事件，如果省略，则为自身绑定一次性事件 |
| data | 触发事件时，传递给`event.data`的数据 |
| fn | 事件响应函数 |
| **返回值** | 调用者 |

```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    // <button>的 click 只会触发一次
    // <input>的 click 只会触发一次
    // <input>的 change 只会触发一次
    $("button, input").one('click change', {
      callback: function () {
        console.log('hello world!!!')
      }
    }, function (event) {
      event.data.callback && event.data.callback()
    })
  })
</script>
```

## off

**`Element.off(events[,selector[,fnName]])`**：给元素解绑事件。

| 参数 | 描述 |
| - | - |
| events | 标准的事件类型（不带`on`前缀），多个事件可以用空格隔开，也可以给事件类型加上命名空间 |
| selector | 移除指定的后代的绑定事件，对应`on`的第二参数 |
| fnName | 函数名称，当一个元素以具名函数的方式多次绑定事件，传递函数名称可以解绑对应的事件 |
| **返回值** | 调用者 |

多个事件，根据事件类型解绑对应事件：
```html
<div id="box">
  <input type="text" />
  <button id="on">bind！</button>
  <button id="off">off！</button>
</div>

<script>
  $(function () {
    // 绑定多个事件
    $("#on").on('mouseover click', function () {
      console.log("hello world!!!")
    })

    $("#off").on('click', function () {
      // 根据事件类型取消对应的事件
      $("#on").off('click')
    })
  })
</script>
```

多个事件，根据具名函数解绑对应事件：
```html
<div id="box">
  <input type="text" />
  <button id="on">bind！</button>
  <button id="off">off！</button>
</div>

<script>
  $(function () {
    function printWorld() {
      console.log("hello world!!!")
    }

    function printJQuery() {
      console.log("hello jQuery!!!")
    }

    // 多次绑定
    $("#on").on('click', printWorld)
    $("#on").on('click', printJQuery)

    $("#off").on('click', function () {
      // 根据具名函数取消对应的事件
      $("#on").off('click', printJQuery)
    })
  })
</script>
```

## 阻止冒泡

关于事件冒泡的特性，以及在JS中阻止事件冒泡，请移步查看：[事件冒泡](/js/base/event.html#事件冒泡) 。

* 在原生JS中，`return false` 不能阻止冒泡，只能阻止默认行为。而在jQuery中，`return false`不仅能阻止默认行为，也能阻止冒泡。
```html
<div id="box">
  <a href="">link</a>
</div>

<script>
  $(function () {
    $("#box").on('click', function (e) {
      alert('Hi')
    })

    $('a').on('click', function () {
      console.log('hello link')
      return false
    })
  })
</script>
```

* 在原生JS中，`event.preventDefault()` 不支持IE8。而在jQuery中，任何方式绑定事件都能通过 `event.preventDefault()` 来取消默认行为。
```html
<a href="">link</a>

<script>
  $(function () {
    $('a').on('click', function (event) {
      event.preventDefault()
    })
  })
</script>
```

## 事件委派

事件委派指的是：有多个元素需要绑定相同的事件，这个时候不必给这些每个元素都绑定上。而是给他们共同的父元素（或祖先元素）绑定，然后通过触发事件的对象（`event`）来判断目标是否是期望的元素，如果是则响应。

:::tip
  事件委派实际上是利用的 [事件冒泡](/js/base/event.html#事件冒泡) 的原理：当父（或祖先）元素与子元素绑定了相同的事件，子元素的该事件触发，父（或祖先）元素该事件也会触发。
:::

`on()`的第二个参数`selector`可以应用于事件委派。

下面例子中，需要给所有的`<p>`标签都绑定事件，此时可以把事件委派给`#box`，当 `on` 的第二个参数接收了一个 `selector` CSS选择器，则jQuery内部会做判断，而不需要自己再手工判断。
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
  <p>hello</p>
  <p>hello</p>
  <p>hello</p>
  <p>hello</p>
</div>

<script>
  $(function () {
    // 给所有<p>标签绑定事件，委派给 #box
    $("#box").on('click', 'p', function () {
      console.log(this);
    })
  })
</script>
```

当你给某些元素绑定了事件，而将来又 **动态新增** 了新的匹配元素，此时这个新增的元素是没有及时绑定事件的。对于这种场景，事件委派也是一个很好的解决方案：
```html
<div id="box">
  <input type="text" />
  <button>click！</button>
  <p>hello</p>
  <p>hello</p>
  <p>hello</p>
  <p>hello</p>
</div>

<script>
  $(function () {
    // 普通方式绑定事件（提前）
    $('p').on('click', function () {
      console.log('before：', $(this).text())
    })

    // 事件委派的方式绑定事件
    $("#box").on('click', 'p', function () {
      console.log('delegate：', $(this).text())
    })

    // 1.5s后动态新增一个<p>标签
    setTimeout(function () {
      $('#box').append($(`<p>hello</p>`))
    }, 1500)
  })
</script>
```
上面代码中，1.5s后动态新增了一个`<p>`标签，而普通的方式已经提前绑定了事件，所有事件没有及时绑定到新增的元素。而委派的方式则没有问题，因为`#box`从一开始就存在了。

---

总结事件委派的优缺点：

:::tip 优点
* 不用手动（或循环）给每个目标元素都绑定事件，而是一次性给父（祖先）元素绑定事件。
* 解决动态新增的匹配元素没有及时的绑定事件。
:::

:::warning 缺点
* 每次父（祖先）元素触发事件，都需要判断当前点击的对象，如果匹配，再决定要不要执行，多了一个判断的环节（JS的渲染效率很高，此性能损耗其实可以忽略不计）。
:::

---

## trigger

**`Element.trigger(events[,data])`**：主动给元素触发事件。

| 参数 | 描述 |
| - | - |
| events | 触发的事件类型（不带`on`前缀），多个事件可以用空格隔开，也可以给事件类型加上命名空间 |
| data | 触发事件时，传递事件响应函数的数据，注意，数据不在`event.data`内，而是依次排列在`event`后面的参数中 |
| **返回值** | 调用者 |

```html
<div id="box">
  <input type="text" />
  <button>click！</button>
</div>

<script>
  $(function () {
    $("input").on('click change', function (event, data) {
      data.callback()
    })

    $('button').on('click', function () {
      // 主动触发<input>的click事件
      $("input").trigger('click', {
        callback: function () {
          console.log('hello world')
        }
      })
    })
  })
</script>
```

## 命名空间

`on()`除了可以绑定web标准事件以外，还可以绑定自定义的事件。自定义的事件只能通过`trigger()`来手动触发。
```html
<div id="box">
  <button>click！</button>
</div>

<script>
  $(function () {
    $("#box").on('myClick', function () {
      alert('Hi')
    })

    $('button').on('click', function () {
      $("#box").trigger('myClick')
    })
  })
</script>
```

自定义事件可以通过命名空间来管理，当多人开发时，为了避免出现同一个元素绑定多个相同的自定义事件，此时可以给自定义事件设置命名空间。
```html
<div id="box"></div>
<button>click!!!</button>

<script>
  $(function () {
    // 给绑定的事件设置第一个命名空间
    $("#box").on("myClick.tom", function () {
      alert("tom")
    })

    // 给绑定的事件设置第二个命名空间
    $("#box").on("myClick.lucy", function () {
      alert("lucy")
    })

    $('button').on('click', function () {
      // 触发第二个命名空间的事件
      $("#box").trigger("myClick.lucy")
    })
  })
</script>
```
给事件设置命名空间还能有效避免事件冒泡带来的困扰，因为绑定相同事件类型才会造成冒泡的现象。
```html
<div id="box">
  <div id="box2"></div>
</div>
<button>click!!!</button>

<script>
  $(function () {
    // 给大div绑定的事件
    $("#box").on("myClick.tom", function () {
      alert("tom")
    })

    // 给小div绑定的事件
    $("#box2").on("myClick.lucy", function () {
      alert("lucy")
    })

    $('button').on('click', function () {
      $("#box2").trigger("myClick.lucy")
    })
  })
</script>
```
但如果需要冒泡的特性，那么父（祖先）和子元素绑定同一个命名空间即可。
```html
<div id="box">
  <div id="box2"></div>
</div>
<button>click!!!</button>

<script>
  $(function () {
    // 给大div绑定的事件
    $("#box").on("myClick.lucy", function () {
      alert("tom")
    })

    // 给小div绑定的事件
    $("#box2").on("myClick.lucy", function () {
      alert("lucy")
    })

    $('button').on('click', function () {
      $("#box2").trigger("myClick.lucy")
    })
  })
</script>
```

## 内置事件

为了方便事件的绑定，jQuery内部对一些web标准事件进行了封装，只需要通过`Element.eventName(fn)`的方式直接调用即可，里面的`fn`就是事件响应函数。
```html
<button>click!!!</button>

<script>
  $(function () {
    // 直接通过 .click 的方式绑定点击事件
    $('button').click(function () {
      console.log('hello world')
    })
  })
</script>
```

jQuery封装的web事件列表可以查阅 [官网](https://api.jquery.com/category/events/mouse-events/) 。

### hover事件

**`Element.hover(enterFn[,leaveFn])`**：给元素绑定移入移出事件。

| 参数 | 描述 |
| - | - |
| enterFn | 移入事件的响应函数 |
| leaveFn | 移出事件的响应函数 |
| **返回值** | 调用者 |

`hover`不是web标准事件，而是jQuery基于标准事件`mouseenter`和`mouseleave`来封装实现的，当然也可以通过`on('mouseenter')`或者`on('mouseleave')`来绑定移入移出事件，不过显然使用`hover`更方便。

```html
<div id="box"></div>

<script>
  $(function () {
    $("#box").hover(function () {
      console.log("移入~~")
    }, function () {
      console.log("移出~~")
    })
  })
</script>
```

当只有一个参数时，移入移出都会触发

```html
<div id="box"></div>

<script>
  $(function () {
    $("#box").hover(function () {
      console.log("change!!!")
    })
  })
</script>
```

<Vssue />