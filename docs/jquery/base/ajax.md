# 网络请求API

## jQuery.ajax

`jQuery.ajax(settings)`：执行一个异步的HTTP（Ajax）的请求。

| 参数 | 描述 |
| - | - |
| settings | 一个以键值对组成的 AJAX 请求选项。所有选项都是可选的。 |
| **返回值** | 调用者。 |

`settings`对象中，常用的选项：

| 选项 | 描述 |
| - | - |
| `url` | 设置请求的地址。 |
| `type` | 设置请求的方式，大小写不敏感，默认`'get'`。 |
| `data` | 设置请求携带的数据（对象）。 |
| `headers` | 设置请求头携带的数据（对象）。 |
| `timeout` | 设置请求超时的时间，单位ms，默认无超时限制。 |
| `contentType` | 请求数据的格式，也就是请求头的`Content-Type`字段。 |
| `dataType` | 响应数据的格式，如果指定为`'json'`格式，jQuery会自动将数据反序列化，否则需要自己`JSON.parse()`。 |
| `beforeSend(xhr)` | 请求**开始**前执行的回调函数。 |
| `success(res)` | 响应**成功**执行的回调函数。 |
| `error(xhr)` | 响应**失败**执行的回调函数。 |
| `complete(xhr)` | 响应**成功**或者**失败**都执行的回调函数。 |

以上是常用的选项，更多的选项请查阅 [官网](https://www.jquery123.com/jQuery.ajax/) 。

下面是一个发起ajax请求的例子：
```json
// /data.json
{
  "data": "hello world"
}
```
```js
// /index.js
$.ajax({
  // 请求同目录下的data.json文件
  url: "data.json",
  // 以get方式请求
  type: "get",
  // 请求携带的数据
  data: {
    key: "value"
  },
  // 请求携带的请求头数据
  headers: {
    "x-token": "abcd"
  },
  // 3s后超时
  timeout: 3000,
  // 以json格式的数据发起请求
  contentType: "application/json",
  // 将响应的数据视为json格式（这里可以省略，因为请求的数据本身就是json文件）
  dataType: "json",
  beforeSend: function (xhr) {
    console.log("=== 发起请求前：", xhr)
  },
  success: function (res) {
    console.log("=== 响应成功：", res)
  },
  error: function (xhr) {
    console.log("=== 响应失败：", xhr)
  },
  complete: function (xhr) {
    console.log("=== 成功或失败都执行：", xhr)
  }
})
```
如果把`data.json`文件改为`data.txt`文件：
```text
{
  "data": "hello world"
}
```
如果不加`dataType: "json"`将数据识别为`json`数据，那么得到的数据是这样的：
```text
"{
  "data": "hello world"
}"
```
加了`dataType: "json"`数据识别以后，得到的数据是这样的：
```js
{
  "data": "hello world"
}
```

## jQuery.ajaxSetup

`jQuery.ajaxSetup(settings)`：Ajax全局配置。

实际开发中，许多地方都需要发起Ajax请求，不可能每次都需要写一些相同的配置，例如：`type`、`header`、`timeout`等等。

而`ajaxSetup()`就是用来设置全局的Ajax请求配置，以便覆盖默认提供的配置。

| 参数 | 描述 |
| - | - |
| settings | 同`jQuery.ajax(setting)`。 |
| **返回值** | 调用者。 |

```js
$.ajaxSetup({
  type: "post", // 将来的每个请求都默认以post方式发起
  timeout: 10000, // 将来每个请求超时时间都为10s
  headers: { // 将来每个请求的请求头携带的数据
    Authorization: "Bearer abcd",
    lang: "ZH"
  },
  contentType: "application/json", // 将来每个请求携带数据的格式
  dataType: "json" // 将来每个请求响应数据的格式
})

$.ajax({
  url: "data.json",
  data: { key: "value" },
  success: function (res) {
    console.log("=== 响应成功：", res)
  },
  error: function (xhr) {
    console.log("=== 响应失败：", xhr)
  }
})

$.ajax({
  url: "data2.json",
  data: { key: "value" },
  success: function (res) {
    console.log("=== 响应成功：", res)
  },
  error: function (xhr) {
    console.log("=== 响应失败：", xhr)
  }
})
```

如果在某个请求中配置了全局中存在的配置，那么这个请求的配置会覆盖全局的配置：
```js
$.ajax({
  url: "data.json",
  type: 'get', // 这个请求以get的方式发起
  data: { key: "value" },
  success: function (res) {
    console.log("=== 响应成功：", res)
  },
  error: function (xhr) {
    console.log("=== 响应失败：", xhr)
  }
})
```

## jQuery.get & jQuery.post

`jQuery.get(url[,data][,success()][,dataType])`：以get方式执行一个异步的HTTP的请求。

`jQuery.post(url[,data][,success()][,dataType])`：以post方式执行一个异步的HTTP的请求。

| 参数 | 描述 |
| - | - |
| url | 请求的url。 |
| data | 请求携带的数据（对象）。|
| success(res) | 响应成功执行的回调函数。|
| dataType | 响应数据的格式。|
| **返回值** | 调用者。 |

`jQuery.get`和`jQuery.post`是经过jQuery封装的，以快捷的方式发送指定类型的请求，它们的参数比较少，但都是些重要的参数：

```js
// 以get的方式发起请求
$.get({
  url: "data.json",
  data: { key: "value" },
  success: function (res) {
    console.log(res)
  }
})

// 以post的方式发起请求
$.post({
  url: "data.json",
  data: { key: "value" },
  success: function (res) {
    console.log(res)
  }
})
```

## load()

Ajax的出现让JS能够实现局部更新，而不用刷新页面，jQuery为此功能封装了一个方法。

`Element.load(url[,data[,callback]])`：加载一段远程HTML代码，插入到指定的DOM元素当中。

| 参数 | 描述 |
| - | - |
| url | html文件地址（如果只要局部的html代码，后面要跟上选择器）。 |
| data | 请求的参数。|
| callback(res) | 载入成功的回调函数。|
| **返回值** | 调用者。 |

:::warning 注意
`load()`插入的元素，会直接覆盖原有元素里的内容。
:::

`load()`底层也是以Ajax的方式实现的（发起一个Ajax请求目标html文件），`load()`默认以GET方式发送请求。

```html
<!-- target.html -->
<body>
  <h2> h2标签 </h2>
  <h3> h3标签 </h3>
</body>
```

```html
<!-- index.html -->
<div id="box">
  <p>hello world</p>
</div>

<script>
  // 以GET方式发起一个请求，获取target.html内的全部内容，并插入到#box元素内
  $("#box").load("target.html", function (res) {
    console.log(res) // target.html 的全部内容
  })
</script>
```
传递了参数，会自动变为POST请求

```js
// 传递了参数，会自动变为POST请求
$("#box").load("target.html", {
  key: "value"
}, function (res) {
  console.log(res) // target.html 的全部内容
})
```

只想获取`target.html`中的`<h2>`标签，那么后面要跟上选择器，以空格的方式隔开。
```html
<!-- index.html -->
<div id="box">
  <p>hello world</p>
</div>

<script>
  $("#box").load("target.html h2")
</script>
```

## Ajax事件

* `Element.ajaxStart(callback)`：Ajax请求 **开始** 时，执行此事件。
* `Element.ajaxStop(callback)`：Ajax请求 **结束** 时，执行此事件。

---

* `Element.ajaxSuccess(callback)`：Ajax请求 **成功** 时，执行此事件。
* `Element.ajaxError(callback)`：Ajax请求 **失败** 时，执行此事件。

---

| 参数 | 描述 |
| - | - |
| callback | 回调函数。 |
| **返回值** | 调用者。 |

从jQuery1.8版本开始，这些事件只能绑定在`document`对象上，当请求进入对应的状态（开始、结束、成功、失败）时，就会触发回调函数。

```js
$(document)
  .ajaxStart(function () {
    console.log("send start")
  })
  .ajaxSuccess(function () {
    console.log("send success")
  })
  .ajaxStop(function () {
    console.log("send stop")
  })
  .ajaxError(function () {
    console.log("send error")
  })

$.get({ url: "data.json" })
```

:::tip
要注意事件绑定的时机，例如：请求已经发出时，才给`document`绑定`ajaxStart`事件，那么事件回调肯定不会触发。所以，应该在web应用最开始初始化时，给`document`绑定所有Ajax事件。
:::

一旦有请求**成功**或**失败**都会执行`ajaxSuccess()`或`ajaxError()`，即使这些请求是同一时刻发起的。

而如果请求是同一时刻**发起**的，`ajaxStart()`只会触发一次，同理，如果请求是同一时刻**响应**的，`ajaxError()`也是只会触发一次。
```js
$(function () {
  $(document)
    .ajaxStart(function () {
      console.log("send start")
    })
    .ajaxSuccess(function () {
      console.log("send success")
    })
    .ajaxStop(function () {
      console.log("send stop")
    })
    .ajaxError(function () {
      console.log("send error")
    })

  /**
   * send start
   * send success
   * send success
   * send stop
   */
  Promise.all([$.get({ url: "data.json" }), $.get({ url: "data.json" })])
})
```
接上面的代码，把`Promise.all`换成下面：
```js
/**
  * send start
  * send success
  * send stop
  * send start
  * send success
  * send stop
  */
$.get({ url: "data.json" })

// 延迟发起请求
setTimeout(function () {
  $.get({ url: "data.json" })
}, 1000)
```

<Vssue />