# Bom
**Browser Object Model** 浏览器对象模型。

## navigator
`navigator`对象代表的是当前浏览器的信息。

#### 属性
* `appName`返回当前浏览器的名称。
* `userAgent`一个字符串，里面包含当前浏览器的相关信息，不同的浏览器有不同的信息。
```js
window.navigator.appName
//Chrome：   netscape
//Firefox：  netscape
//Safari：   netscape
//IE11：     netscape
//IE10以下： Microsoft Internet Explorer
```
#### 其他浏览器
Netscape是网景公司的名称（已倒闭），由于JavaScript最早是由网景公司发明的，所以其他的浏览器返回`Navigator.appName`的值是`netscape`，意思是向网景公司致敬的意思。

#### IE10以下
而用IE10以下输出`Navigator.appName`，则不会返回`netscape`，因为当时微软是网景公司的竞争对手，网景公司就是被微软所干掉的，所以IE10以下的浏览器都会返回`Microsoft Internet Explorer`。

#### IE11
由于外界对IE浏览器的印象不好，微软决定从IE11开始，去掉一切IE11与微软相关的标识，目的就是为了让大家识别不出IE11，把IE11当做跟其他浏览器一样对待，所以，使用IE11输出`Navigator.appName`返回的也是`netscape`。

`appName`属性已经无法区分出IE11，可以使用`userAgent`属性试试：
```js
window.navigator.userAgent
//chrome:   Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36
//firefox:  Mozilla/5.0 (Windows NT 6.1; WOW64; rv:62.0) Gecko/20100101 Firefox/62.0
//IE8:      Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.3)
//IE9:      Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.3)
//IE10:     Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.3)
//IE11:     Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0) like Gecko
```
通过观察，可以发现不同的浏览器返回的字符串也不同：
* Chrome返回的字符串中带有：chrome
* Firefox返回的字符串中带有：firefox
* IE8~IE10中返回的字符串中带有：MSIE

可以通过正则表达式来检查一个字符串的规则，借此来判定浏览器：
```js
var sign = window.navigator.userAgent

if (/chrome/i.test(sign)) { /* chrome浏览器 */ }
if (/firefox/i.test(sign)) { /* Firefox浏览器 */ }
if (/msie/i.test(sign)) { /* IE浏览器 */ }
```
但是这种方式也依旧无法识别出IE11，因为微软将IE11中与微软相关的标识都已经去除，IE11中并没有`msie`字符。

### ActiveXObject
**ActiveXObject** 对象只有IE浏览器中有，所以我们可以通过判断 **ActiveXObject** 来检查IE11。
::: tip
如果直接将`!!ActiveXObject`转换成布尔值的话，IE10以下是`true`，IE11却是`false`，微软在IE11上动了一些手脚，目的不让我们区分出IE11。我们可以通过`in`运算符来判断`ActiveXObject`对象是否属于**window**，借此来识别IE11。
:::

```js
var sign = window.navigator.userAgent

if (/chrome/i.test(sign)) { /* chrome浏览器 */ }
if (/firefox/i.test(sign)) { /* Firefox浏览器 */ }
if (/msie/i.test(sign)) { /* IE浏览器 */ }
if ("ActiveXObject" in window) { /* IE11浏览器 */ }
```

## history
`History`对象代表浏览器的历史记录。

#### 属性
`length`返回浏览器历史列表的URL数量，也就是页面数量。
::: tip
仅访问当次历史列表，当浏览器关闭重启后，将重新计算数量。
:::

#### 方法
* `back()`跳转到历史列表中的前一个页面，没有则不跳。
* `forward()`跳转到历史列表的后一个页面，没有则不跳。
* `go()`传递一个整数作参数，代表要跳转的页数，正整数往前跳，负整数往后跳。
```js
history.length    //输出页面数量
history.back()    //回退
history.forward() //前进
history.go(2)     //前进多页
history.go(-2)    //后退多页
```
**History** 的好处就是不会刷新URL地址，一切操作都是在历史中进行，多用于SPA应用。

## location
**Location** 对象代表的是浏览的的地址栏信息，通过该对象可直接查看或修改地址栏信息。
浏览器的地址栏分为多个部分，比如<u>协议部分</u>，<u>端口号部分</u>，<u>路径部分</u>等等。\
直接打印`location`或者`window.location`，可以获取到完整的地址栏信息。

#### 属性
`lacation`对象的属性大都是用于获取或修改地址栏的部分信息的，例如：协议，端口，路径等等。
| 属性        | 描述                       |
| ---------- | -------------------------- |
| hash       | 返回一个URL的锚部分           |
| host       | 返回一个URL的主机名和端口      |
| hostname   | 返回URL的主机名              |
| href       | 返回完整的URL                |
| pathname   | 返回的URL路径名               |
| port       | 返回一个URL服务器使用的端口号   |
| protocol   | 返回一个URL协议               |
| search     | 返回一个URL的查询部分          |

#### 方法
* `assige()`跳转到其他页面，跳转后的页面 **会** 加入历史记录列表，参数传页面地址。
* `replace()`用别的页面来替换当前页面，跳转后的页面 **不会** 加入历史记录列表，参数传新的页面地址。
* `reload()`用来重载当前页面，作用和刷新一样。
:::tip
`reload()`参数传`true`的话，可以强制清空缓存，再刷新页面
:::

```js
location //打印完整地址信息
location.assign('https://www.baidu.com') //跳转到百度首页(会加入历史记录)
location.replace('https://www.jd.com') //用京东首页替换当前页面(不加入历史记录)
location.reload(true) //强制清空缓存，并刷新当前页面
```

## window
**Window** 对象代表的是整个浏览器的窗口，在DOM中也代表的是全局对象。\
一些常见的`window`的属性和方法，比如：
* `document`代表整个网页文档
* `history`操作当次浏览的历史记录列表
* `location`操作浏览器的信息栏
* `navigator`返回当前浏览器的信息
* `alert()`普通弹窗
* `confirm()`带有取消与确认的弹窗
* `prompt()`带有输入框的弹窗
* `setInterval()`定时器
* `setTimeout()`延时器

`window`的属性和方法特别多，出于篇幅考虑，本文仅介绍一些常用的，有需要请自行查阅文档。

### setInterval
`setInterval()`定时调用。其实就是一个定时循环，定时调用可以自定义执行的时间间隔。
* 参数1：每隔一段时间执行的回调函数。
* 参数2：每次调用间隔的时间，单位毫秒。
* 返回值：该方法有一个**number**类型的返回值，该返回值是该定时调用的唯一标识。

`clearInterval()`关闭定时调用
* 参数：直接传定时调用对象，或者传定时调用标识都行。
```js
var num = 1

//开启定时器
var timer = setInterval(function () {
  console.log(num)
  num++
  if (num > 5) {
    //关闭定时器
    clearInterval(timer) //直接传递定时调用对象可以
    clearInterval(1)     //传递定时调用标识也可以
  }
}, 1000)
```

### seiTimeout
`setTimeout()`延时调用。延迟调用的回调函数只会执行一次，需要延迟一段时间执行。
* 参数1：需要延迟执行的回调函数。
* 参数2：需要延迟的时间，单位毫秒。
* 返回值：该方法有一个**number**类型的返回值，该返回值是该定时调用的唯一标识。

`clearTimeout()`关闭延时调用
* 参数：直接传定时调用对象，或者传定时调用标识。
```js
var btn = document.querySelector('#btn01')

var timer = null

//开启延时器
timer = setTimeout(function () {
  console.log('Hello~~')
}, 3000)

btn.onclick = function () {
  //关闭延时器
  clearTimeout(timer)
  console.log('已关闭延时器')
}
```