# CSS相关API

## 操作CSS类

**`Element.hasClass(className)`**：检查元素是否存在某个class类。

| 参数 | 描述 |
| - | - |
| className | css类名，可以采用空格隔开的方式一次性**检查**多个类 |
| **返回值** | true / false |

---

**`Element.addClass(className)`**：为元素添加class类。

| 参数 | 描述 |
| - | - |
| className | css类名，可以采用空格隔开的方式一次性**添加**多个类 |
| **返回值** | 调用者 |

* 如果元素没有class这个属性，会默认创建class这个属性，然后添加类。
* 如果元素已经有了这个类名，那么不会重复添加。

---

**`Element.removeClass(className)`**：删除元素中的某个类。

| 参数 | 描述 |
| - | - |
| className | css类名，可以采用空格隔开的方式一次性**删除**多个类 |
| **返回值** | 调用者 |

* 只会删除类名，不会将整个class属性删除。
* 如果没有对应类名，也不会报错。

---

**`Element.toggleClass(className)`**：切换元素中的某个类（有则删，无则加）。

| 参数 | 描述 |
| - | - |
| className | css类名，可以采用空格隔开的方式一次性**切换**多个类 |
| **返回值** | 调用者 |

```js
$(function () {
  // 为<div>添加三个css类
  $("#box").addClass("index1 index2 index3")

  // 删除index1类
  $("#box").removeClass("index1")

  // 切换index2类（有则删，无则加）
  setInterval(() => {
    $("#box").toggleClass("index2")
    console.log($("#box").hasClass("index2"))
  }, 1500)
})
```

## 操作CSS样式

**`Element.css(key, value | properties)`**：用于操作元素的CSS样式。

| 参数 | 描述 |
| - | - |
| key | css属性名 |
| value | css属性值，如果传递value则是设置 |
| properties | 不传 key/value 的话，可以直接传递一个对象，用于批量设置 |
| **返回值** | 返回css属性值，设置则是返回调用者 |

通过`css()`设置的样式跟JS中`元素.style.属性`设置的样式一样，都是直接设置到内联样式中的。

```js
$(function () {
  // 逐个设置<div>的css属性
  $("#box").css("width", "100px")
  $("#box").css("height", "100px")

  // 链式操作设置<div>的css属性
  $("#box").css("color", "#000").css("backgroundColor", "#f00")

  // 批量操作设置<div>的css属性（推荐）
  $("#box").css({
    padding: "10px",
    margin: "10px"
  })
})
```

只传递一个参数是获取，注意，获取到的值是带单位的。
```js
// 获取<div>的width属性
console.log($("#box").css("width")) // '100px'
```

---

## 操作CSS尺寸

以下三种方式设置的属性样式是直接设置到内联样式中的，优先级比样式表要高。且获取是不带单位的，方便计算。

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.width(width)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素内容宽度，不含内边距、边框
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>width</td>
      <td>宽度值，不带单位则默认是px</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回宽度值，设置则是返回调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.height(height)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素内容高度，不含内边距、边框
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>height</td>
      <td>高度值，不带单位则默认是px</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回宽度值，设置则是返回调用者</td>
    </tr>
  </table>
</div>

```js
$(function () {
  // 设置<div>的内容宽高（可带可不带单位）
  $("#box").width(200)
  $("#box").height("200px")

  // 获取<div>的内容宽高
  console.log($("#box").width()) // 200
  console.log($("#box").height()) // 200
})
```

---

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.innerWidth(innerWidth)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素内部宽度，含内边距、不含边框
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>innerWidth</td>
      <td>内部宽度值，不带单位则默认是px</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回内部宽度值，设置则是返回调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.innerHeight(innerHeight)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素内部高度，含内边距、不含边框
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>innerHeight</td>
      <td>内部高度值，不带单位则默认是px</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回内部宽度值，设置则是返回调用者</td>
    </tr>
  </table>
</div>

```html
<style>
  #box {
    padding: 10px;
    box-sizing: border-box;
    background-color: #f00;
  }
</style>

<script>
  $(function () {
    // 设置<div>的内部宽高
    // 上下内边距 10+10, 200-(10+10) = 180(内容)，左右同理
    $("#box").innerWidth(200)
    $("#box").innerHeight(200)

    // 获取<div>的内部宽高（包含内边距）
    console.log($("#box").innerWidth()) // 200
    console.log($("#box").innerHeight()) // 200

    // 获取<div>的内容宽高
    console.log($("#box").width()) // 180
    console.log($("#box").height()) // 180
  })
</script>
```

---


<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.outerWidth(outerWidth)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素外部宽度，含内边距、含边框
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>outerWidth</td>
      <td>外部宽度值，不带单位则默认是px</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回外部宽度值，设置则是返回调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.outerHeight(outerHeight)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素外部高度，含内边距、含边框
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>outerHeight</td>
      <td>外部高度值，不带单位则默认是px</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回外部宽度值，设置则是返回调用者</td>
    </tr>
  </table>
</div>

```html
<style>
  #box {
    padding: 10px;
    border: 5px solid #000;
    box-sizing: border-box;
    background-color: #f00;
  }
</style>

<script>
  $(function () {
    // 设置<div>的外部宽高
    // 上下内边距 10+10, 上下边框 5+5，200-(10+10+5+5) = 170(内容)，左右同理
    $("#box").outerWidth(200)
    $("#box").outerHeight(200)

    // 获取<div>的外部宽高(包含边框、内边距)
    console.log($("#box").outerWidth()) // 200
    console.log($("#box").outerHeight()) // 200

    // 获取<div>的内部宽高(包含边框)
    console.log($("#box").innerWidth()) // 190
    console.log($("#box").innerHeight()) // 190

    // 获取<div>的内容宽高
    console.log($("#box").width()) // 170
    console.log($("#box").height()) // 170
  })
</script>
```

## 操作CSS位置

**`Element.offset(coordinates)`**：操作元素距离窗口的距离。

| 参数 | 描述 |
| - | - |
| coordinates | 包含left和top值的对象，用于设置元素距离窗口的定位 |
| **返回值** | 包含left和top值的对象，用于读取元素距离窗口的定位 |

```js
$(function () {
  $("#box").css({
    position: "absolute",
    left: 50,
    top: 100,
    width: 100,
    height: 100,
    background: "#f00"
  })

  const { left, top } = $("#box").offset()
  console.log(left, top) // 50 100
})
```

`offset()`的返回值是不带单位的，所以通过`offset()`设置样式值不要加单位，否则不生效。
```js
$(function () {
  /**
   * ...
  */

  $("#box").offset({ left: "200px", top: 200 })

  const { left, top } = $("#box").offset()
  console.log(left, top) // 50 200
})
```

:::warning 注意
`offset()`是计算基于浏览器窗口的距离，所以要保证元素自身的定位属性是`absolute`而且定位父元素是窗口（`body`），而`relative`是基于自身定位的。
```html
<div id="box"></div>

<script>
  $(function () {
    $("#box").css({
      position: "absolute",
      // position: "relative",
      left: 50,
      top: 0,
      width: 100,
      height: 100,
      background: "#f00"
    })

    const { left, top } = $("#box").offset()
    console.log(left, top) // 50 0
  })
</script>
```
上面一段代码中，`absolute`和`relative`切换时，`offset().top`的值是不一样的，因为`absolute`此时才是基于窗口（`body`）定位的，而`relative`是基于自身定位的。
:::

---

**`Element.position()`**：获取元素距离定位父元素的距离。

| 参数 | 描述 |
| - | - |
| 无参数 |  |
| **返回值** | 包含left和top值的对象，用于读取元素距离定位父元素的距离 |

`offset()`用于获取元素距离窗口的距离，`position()`用于获取元素距离定位父元素的距离。
```html
<style>
  #box {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  #p {
    position: relative;
    left: 5px;
    top: 5px;
  }
  #c {
    position: relative;
    left: 20px;
    top: 20px;
  }
</style>

<div id="box">
  <div id="p">
    <div id="c"></div>
  </div>
</div>

<script>
  $(function () {

    const { left, top } = $("#c").offset()
    console.log(left, top) // 35 35

    const { left: l, top: t } = $("#c").position()
    console.log(l, t) // 20 20
  })
</script>
```
上面代码中，三个元素嵌套了三层定位，`position()`只管获取当前元素距离 **定位**父元素 的距离。而`offset()`获取的是当前元素距离窗口的距离，也就是要层层距离叠加起来计算。

`position()`不支持设置距离，可以通过`css()`来设置。

---

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.scrollTop(scrollTop)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素垂直滚动的距离
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td>滚动的值，只接受number类型</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回垂直滚动的距离值，设置则是返回调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.scrollLeft(scrollLeft)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        操作元素水平滚动的距离
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>scrollLeft</td>
      <td>滚动的值，只接受number类型</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回水平滚动的距离值，设置则是返回调用者</td>
    </tr>
  </table>
</div>

```html
<style>
  #p {
    width: 500px;
    height: 500px;
    background-color: greenyellow;
    overflow: auto;
  }
  #c {
    width: 1000px;
    height: 1000px;
  }
</style>

<button id="set">set</button>
<button id="get">get</button>
<div id="p">
  <div id="c"></div>
</div>

<script>
  $(function () {
    $('#get').on('click', function () {
      console.log($('#p').scrollTop());
      console.log($('#p').scrollLeft());
    })

    $('#set').on('click', function () {
      $('#p').scrollTop(200)
      $('#p').scrollLeft(200)
    })
  })
</script>
```

:::warning 注意
在IE8及以下浏览器中，浏览器的滚动条是属于`<body>`的，在谷歌火狐等浏览器中，浏览的滚动条是属于`<html>`的。

因此，在IE8中，为`<html>`绑定`scrollTop`或者`scrollLeft`的话，值永远是0。同理，在chrome等浏览器中，为`<body>`绑定`scrollTop`或者`scrollLeft`的话，值永远是0。所以如果要操作浏览器窗口滚动条的话，需要做兼容处理。
```js
// 获取
$("html, body").scrollTop()

// 设置
$("html, body").scrollTop(800)
```
:::

<Vssue />