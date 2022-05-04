# 文本相关API

## html

**`Element.html(val)`**：获取匹配的第一个元素的html内容，或设定html内容。

| 参数 | 描述 |
| - | - |
| val | 设定的内容，如果是html片段，会创建元素出来 |
| **返回值** | 获取的html内容，如是设置，则返回调用者 |

其实效果同原生js的`innerHTML`。
```js
$(function () {
  // 传递html代码片段，会创建<div>元素
  $("body").html('<div id="box"><div>')

  // 传递普通文本
  $("#box").html("hello world")

  /**
   * hello world
   * 不传参则是获取自身内容
   */
  console.log($("#box").html())

  /**
   * <p>hello world</p>
   * 如果有子元素，会把子元素的标签也获取到
   */
  $("#box").html("<p>hello world</p>")
  console.log($("#box").html())

  /**
   * <p>
   *   hello world
   *   <span>hello span</span>
   * </p>
   * 多层html标签也可以获取到
   */
  $("#box").html(`<p>
     hello world
     <span>hello span</span>
   </p>`)
  console.log($("#box").html())
})
```

## text

**`Element.text(text)`**：获取匹配的第一个元素的文本内容，或设定文本内容。

| 参数 | 描述 |
| - | - |
| text | 设定的文本内容 |
| **返回值** | 获取的文本内容，如是设置，则返回调用者 |

`html()`同JS的`innerHTML`，`text()`则是同JS的`innerText`。区别在于：

`html()`若是接收一个html代码片段会创建对应的元素，而`text()`专门用于操作文本，即是接收的是html代码片段，也会被当成普通文本，不会创建元素。
```js
$(function () {
  $("body").html('<div id="box"><div>')

  // <p>hello world</p> 会被当成普通文本添加进<div>中
  $("#box").text("<p>hello world</p>")
})
```
同理，`text()`读取到的内容也不会包含html标签。
```js
$(function () {
  $("body").html('<div id="box"><div>')

  $("#box").html("<p>hello world</p>")
  // hello world => 读取纯文本
  console.log($("#box").text())

  $("#box").html(`<p>hello world <span>hello span</span> </p>`)
  // hello world hello span  => 多层嵌套也可以读取到所有文本
  console.log($("#box").text())
})
```

:::warning 注意
设置内容的时候，同`innerHTML`、`innerHText`一样，`html()`和`text()`会重新构建元素的html内容，这会把元素之前所存在的内容（包含子元素）都给替换掉，需谨慎操作。
```js
$(function () {
  // 在body里添加一个<div>元素
  $("body").html('<div id="box"><div>')

  // 把body里的内容全部清空，替换成文本 hello world
  $("body").html("hello world")

  // or

  $("body").text("hello world")
})
```
:::

## val

**`Element.val(value)`**：获取匹配的第一个表单元素的value值，或设置value值。

| 参数 | 描述 |
| - | - |
| value | 设置的value值 |
| **返回值** | 获取的value值，如是设置，则返回调用者 |

原理就是操作原生 DOM对象`.value` 值。

```js
$(function () {
  $("body").html(`
    <input type="text" />
    <input type="checkbox" />
    <input type="radio" />
    <select>
      <option>111</option>
      <option>222</option>
      <option>333</option>
    </select>
  `)

  // 设置
  $('input[type="text"]').val("hello world")
  $('input[type="checkbox"]').val("check")
  $('input[type="radio"]').val("radio")
  $("select").val("222")

  // 获取
  console.log($('input[type="text"]').val()) // 'hello world'
  console.log($('input[type="checkbox"]').val()) // 'check'
  console.log($('input[type="radio"]').val()) // 'radio'
  console.log($("select").val()) // '222'
})
```