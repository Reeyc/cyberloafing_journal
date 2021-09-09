# Ajax
web程序的最初目的就是将数据放到服务器上，让所有网络用户都可以访问。\
在此之前，我们通常使用以下手段让客户端对服务端发起请求：
* url输入服务器地址
* 特定元素的href或者src属性
* 表单

传统的网页更新内容需要重新加载整个网页。\
**Ajax** 是一种技术手段，它能够使JS拥有`发送请求`、`接受响应`的功能，让JS实现网络编程。并且 **Ajax** 不需要重新加载网页就能更新网页局部内容，非常高效地提升用户体验。

## Ajax的基本使用

### 1. 创建XML
通过构造函数创建一个`XMLHttpRequest`对象
```js
var xhr = new XMLHttpRequest();
```
:::warning
IE6及以下不支持`XMLHttpRequest`。\
需要通过`ActiveXObject`构造函数来创建，并传递一个字符串参数`"Microsoft.XMLHTTP"`
```js
var xhr = new ActiveXObject("Microsoft.XMLHTTP");
```
:::

### 2. 创建http请求
```js
xhr.open(/*type*/, /*url*/, /*boolean*/);
```
* type：定义请求的类型
* url：定义请求的地址
* boolean：定义请求的方式，`true`为异步 <Badge text="默认"/> ，`false`为同步，该参数可选

### 3. 发送请求
```js
xhr.send();
```
若请求的类型为`get`请求，则无需传参，或者是传递`null`，因为`get`是在`open`请求的url处拼接传参。\
若请求的类型为`post`请求，则需要以 **urlencoded格式** 来传递参数。
```js
xhr.send('foo=bar&kay=value'); //POST方式传递参数
```
::: warning
`ajax`发送`post`请求的请求体默认是 **payload格式** 的，这在服务端无法有效获取到数据。\
:::

通过`setRequestHeader()`设置请求头的属性
```js
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded'); //urlencoded格式
```

#### 中断请求
ajax对象的`abort()`方法用于中断ajax请求
```js
xhr.abort();
```

### 4. 监听状态的变化
ajax请求是需要时间的（即使很快），因此要监听响应的状态。\
该步骤为异步操作，同步模式下可以省略。

:::tip
该步骤是异步回调操作，故而也可以注册在`open`和`send`之前
:::

#### readyState
返回ajax请求的状态值
| 值  | 描述                                        |
| ---| ------------------------------------------- |
| 0  | **请求未初始化**，未开始send发送请求             |
| 1  | **请求正在载入**，正在send发送请求               |
| 2  | **请求载入完毕**，已send发送请求，接收到响应体内容 |
| 3  | **解析**，正在解析响应体的信息                  |
| 4  | **请求已完成，且响应已就绪**，响应体已全部解析完毕  |

:::tip
**window**的`onload`事件就相当于`readyState === 4`
:::

#### onreadystatechange
该事件用于监听ajax请求的状态值的变化，每当值发生变化都会触发该事件
```js
xhr.onreadystatechange = function () {
  console.log(this.readyState);
}
```

#### status
返回http响应的状态码。http的状态码有很多，具体可以自己查询文档，这里介绍几个常见的
* 200：一切OK，请求、响应成功
* 301：永久重定向
* 302：临时重定向
* 403：没权限访问资源
* 404：资源不存在
* 500：服务端出错

### 5. 处理返回的结果
xhr对象提供一系列API来帮助我们获取响应的内容：
* `responseText` 获取文本格式的响应体信息
* `responseXML` 获取XML格式的响应体信息
* `getResponseHeader()` 获取单个响应头信息，传递指定属性参数
* `getAllResponseHeaders()` 获取所有响应头信息，无需传参

一次完整的ajax请求：
```js
function success(data) {
  console.log(data)
}

function fail(error) {
  console.error(error)
}

var xhr;
xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
xhr.onreadystatechange = function () {
  if (this.readyState !== 4) return
  if (this.status >= 200 && this.status <= 300 || this.status === 304) {
    return success(this.responseText)
  } else {
    return fail(this.status)
  }
}
xhr.open('GET', 'index.php')
xhr.send();
```
::: warning
IE6等低版本浏览器认为，请求同一个URL只能有一个结果，换言之，只要每次请求的URL没有变化，就永远只能获取到原来那份数据。
:::

解决方案：让每次请求的URL都携带一个随机的字符参数即可。\
在原生JS中，有以下几种方式能让数据实时不停的在变化
* 随机数
* 时间戳
```js
// 解决IE6的问题
xhr.open("GET", "index.php?t=" + (new Date().getTime()), true);
```

## Ajax封装
```js
// 工具方法：对象转字符串
function objToStr(data) {
  data = data || {}
  data.t = new Date().getTime()
  var res = []
  for (var key in data) {
    // 转码：处理URL中文
    res.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
  }
  return res.join("&")
}

// ajax请求
function ajax(option) {
  // 参数转字符串
  var str = objToStr(option.data)

  // 创建ajax对象
  var xhr, timer
  xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft XMLHTTP")

  // 异步监听响应
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      clearInterval(timer)
      if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304) {
        option.success(xhr.responseText)
      } else {
        option.error(xhr.status)
      }
    }
  }

  // 发送请求
  if (option.type.toLowerCase() === "get") {
    // GET
    xhr.open(option.type, option.url + "?" + str, true)
    xhr.send()
  } else if (option.type.toLowerCase() === "post") {
    // POST
    xhr.open(option.type, option.url, true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send(str)
  }

  // 请求超时
  if (option.timeout) {
    timer = setInterval(function() {
      xhr.abort()
      clearInterval(timer)
    }, option.timeout)
  }
}

ajax({
  url: "index2.php",
  type: "POST",
  data: { key: "value" },
  timeout: 5000,
  success: function(data) {
    console.log(data)
  },
  error: function(status) {
    console.error(status)
  }
})
```
Ajax虽然优化了用户体验，但随之而来的也有弊端。
::: tip
Ajax不利于SEO优化，SEO默认只会抓取html初始结构中的代码，而Ajax数据是后期动态从服务端请求获取的，所以搜索引擎蜘蛛并不会抓取到Ajax请求的数据。
:::

## 同源策略
同源：协议相同、域名相同、端口相同，缺一不可\
浏览器制定的一种策略，出于安全考虑，Ajax向不同源地址发起请求会被浏览器限制拿到数据。

同源对比地址：<u>http://www.example.com/detail.html</u>

| 对比地址                                        | 是否同源   | 原因               |
| ---------------------------------------------  | -------- | --------           |
| <u>https://www.example.com/detail.html</u>     | 不同源    | 协议不同            |
| <u>http://api.example.com/detail.html</u>      | 不同源    | 域名不同            |
| <u>http://www.example.com:8080/detail.html</u> | 不同源    | 端口不同            |
| <u>http://www.example.com/other.html</u>       | 同源      | 协议、域名、端口相同  |

如何处理跨域请求？

## JSONP
前端不仅ajax可以向服务端发起请求，特定标签的特定属性也可以。\
`script.src`属性可以发起请求，借助服务端配合，让服务端返回的数据是`application/javascript`类型的，`script.src`就将能够将其引入到标签内了。

#### 异步请求
`script.src`一旦请求，由于请求的结果可能还未出来，无法第一时间拿到数据。所以，客户端定义一个函数，在函数里面拿结果，而服务端返回数据的同时调用该函数

```js
var script = document.createElement('script');
script.src = "https://www.baidu.com/test.php";
document.body.appendChild(script);

// 写好函数让后端调用,以保证请求成功获取数据
function foo(result){
  console.log(result);
}
```

#### 函数覆盖
服务端返回的函数名是固定不变的，如果多次向服务端发送请求，那么前端就要写多个相同的函数，就会造成函数覆盖之前的。\
所以应该给每一个请求制定不同的函数名，服务端根据不同的函数名来调用：
```js
// 标识符不能以纯数字开头
var funName = "jsonp_" + Date.now() + Math.random().toString().substr(2, 5);

// 通过请求的url将函数名传递过去，方便后端获取
script.src = "http://www.baidu.com/test.php?callback=" + funName;

// 将函数保存在全局对象window内
window[funName] = function(data){
  console.log(data);
};
```
示例服务端返回数据：
```php
<?php

// 查询数据库之类...
$conn = mysqli_connect('localhost', 'root', '123456', 'demo');
mysqli_set_charset($conn, 'utf8');
$query = mysqli_query($conn, 'select * from `users`');
while ($row = mysqli_fetch_assoc($query)) {
  $data[] = $row;
}

// 转json数据
$json = json_encode($data);

if (empty($_GET['callback'])) {
  // 非跨域请求, 以json数据返回
  echo $json;
  exit();
}

// 跨域请求, 以JavaScript数据返回
header('Content-Type: application/javascript');
$callback_name = $_GET['callback'];
echo "typeof {$callback_name} === 'function' && {$_GET['callback']}({$json})";
```

#### JSONP封装
```js
function jsonp(url, data, callBack) {
  // 函数名
  var funNmae = "jsonp_" + Date.now() + Math.random().toString().substr(2, 5);

  // 参数对象转字符串
  if (typeof data === 'object') {
    var tempArr = [];
    for (var key in data) {
      var value = data[key];
      tempArr.push(key + "=" + value);
    }
    data = tempArr.join("&");
  }

  // 发送请求
  var script = document.createElement("script");
  script.src = url + "?" + data + "&callback=" + funNmae;
  document.body.appendChild(script);

  // 定义函数接收数据
  window[funNmae] = function (result) {
    callBack(result);

    // 确保接收数据完毕之后, 清除script标记
    delete window[funNmae];
    document.body.removeChild(script);
  };
}
```

## 跨域资源共享（CORS）
其实浏览器的同源策略只是默认不允许Ajax接收跨域数据。使用时会报一个错误：

> <font color=#e02c2c>No 'Access-Control-Allow-Origin' header is present on the requested resource</font>

请求的地址的响应头不存在`Access-Control-Allow-Origin`属性。\
如果让服务端设置响应头添加这个属性，就能够解决跨域问题了，这种方式叫做跨域资源共享：
```php
//跨域资源共享(CORS)
header("Access-Control-Allow-Origin: * ");
```

### Access-Control-Allow-Origin
取值为允许访问本页面的不同源地址
```php
//跨域资源共享(CORS)
header("Access-Control-Allow-Origin: https://www.baidu.com");
```
取值为通配符`*`表示所有不同源地址都能访问本页面