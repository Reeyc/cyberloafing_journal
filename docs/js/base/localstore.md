# 本地缓存
HTTP协议一个特点就是 **无状态** ，即：无法保存状态，每一次会话都是初次会话。\
如果单纯的希望服务端去记录每一个访问状态这是不可能的，此时就需要通过一种技术让服务端记住客户端，这种技术就是**Cookie**

## Cookie
**cookie** 会话跟踪技术，可以将数据保存到本地浏览器当中，在js中，**document**对象中有一个属性**cookie**就是用来操作**cookie**的。\
保存一个cookie：以键值对的方式来保存一段字符串
```js
document.cookie = 'key=value'
```

#### cookie查看
可以直接输出`document.cookie`查看，也可以从 **开发者工具** - **Application** - **Cookies** - **当前网页地址** 查看。

### cookie生命周期
默认情况下，cookie的生命周期是**一次会话**，也就是关闭浏览器就会清除cookie。\
自定义生命周期：在当条cookie数据字符串key=value后面以分号隔开，继续以键值对的方式拼接`expires = 指定的时间`
```js
var d = new Date()
d.setDate(28) //setDate()将日期修改为28号 

document.cookie = `key=value;expires=${d};` //expires=过期日期 
```
设置了过期时间，只要过期时间还没到，即使关闭浏览器cookie还是保存着。\
如果到了过期时间，即使会话还在，cookie也会立即被清除。

### cookie保存
保存多条cookie不能继续以字符串的形式拼接前面的cookie，这样只能保存到第一条cookie。
想保存多条cookie，只能一条一条保存。
```js
var d = new Date()
d.setDate(28)

//错误, 只保存了key=value 
document.cookie = `key=value;age=33;expires=${d};`

//正确, 保存了a=b c=d 
document.cookie = `a=b;expires=${d};`
document.cookie = `c=d;expires=${d};`
```
* 数量限制：不同的浏览器有不同的数量限制，有的限制20个cookie，有的限制50个cookie
* 大小限制：一张页面的cookie总大小不能超过4kb（4000字节）

|           | IE6.0      | IE7.0/8.0/9.0+ | Opera       | FF          | Safari      | Chrome      |
| --------- | -----------|----------------|-------------|-------------|-------------|-------------|
| cookie个数 | 每个域为20个 | 每个域为50个    | 每个域为30个  | 每个域为50个 | 没有个数限制   | 每个域为53个 |
| cookie大小 | 4095个字节  | 4095个字节      | 4096个字节   | 4097个字节  | 4097个字节    | 4097个字节   |

一般都是本页面访问本页面的cookie，本页面也可以访问其他页面的cookie。但是有前提条件：
 * 在同一个路径下
 * 用相同浏览器打开

如果 **访问页** 和 **cookie页** 在相同文件夹中，可以访问\
如果 **访问页** 在 **cookie页** 的子文件夹中，可以访问\
如果 **访问页** 在 **cookie页** 的父文件夹中，不可以访问

一般都会把cookie放在网站根目录，使得上下路径都能访问到这些cookie。
```js
var d = new Date()

document.cookie = `a=b;path=/;expires=${d};` 
document.cookie = `c=d;path=/;expires=${d};`
```

### cookie跨域
如果 **访问页** 和 **cookie页** 不在同一个域名下则无法访问，比如 <u>www.a.com</u> 默认无法访问 <u>www.b.com</u> 下的cookie。\
如果想让 <u>www.a.com</u> 能访问 <u>www.b.com</u> 下的cookie，需要设置cookie的`domain`属性，
`domain`属性是cookie的域名地址，将其修改后别的地址也能访问。
```js
document.cookie = `a=b;path=/;domain=a.com;expires=${d};`
document.cookie = `c=d;path=/;domain=a.com;expires=${d};`
```
::: tip
www是二级域名，只要修改一级域名就能访问了
:::

### cookie封装
```js
//添加cookie
function addCookie(key, value, day, path, domain) {
  //处理路径
  var index = window.location.pathname.lastIndexOf("/") //获取/号最后出现的位置
  var currentPath = window.location.pathname.slice(0, index) //截取
  path = path || currentPath //设置

  //处理域名
  domain = domain || document.domain

  //处理时间
  if (!day) {
    document.cookie = `${key}=${value};path=${path};domain=${domain}` //没有时间，系统会默认生成(一次会话)
  } else {
    var date = new Date()
    date.setDate(date.getDate() + day)
    document.cookie = `${key}=${value};expires=${date.toGMTString()};path=${path};domain=${domain}`    
}

//获取cookie
function getCookie(key) {
  var cookie = document.cookie.split(";")
  for (var i = 0; i < cookie.length; i++) {
    var temp = cookie[i].trim()
    var kv = temp.split("=")
    if (kv[0] === key) {
      return kv[1]
    }
  }
}

//删除cookie
function delCookie(key, path) {
  //时间过期, 系统会自动删除cookie, 设置日期为-1就过期了
  addCookie(key, getCookie(key), -1 ,path);
}
```

## localStorage & sessionStorage
`sessionStorage`和`localStorage`是H5的API，也是本地储存，而且空间更大，可以算是cookie的升级版。
* `sessionStorage`储存大小为5M。关闭浏览器窗口清除
* `localStorage`储存大小为5M。永久储存（除非手动删除）

两者的相同点：本地储存、都是**window**对象的属性、储存类型都是字符串、相同的API

```js
//添加或修改
localStorage.setItem(/* keyName, keyValue */)
sessionStorage.setItem(/* keyName, keyValue */)

//获取
localStorage.getItem(/* keyName */)
sessionStorage.getItem(/* keyName */)

//删除
localStorage.removeItem(/* keyName */) 
sessionStorage.removeItem(/* keyName */)

//清空
localStorage.clear()
sessionStorage.clear()
```
::: tip
如果是对象会储存为`[object Object]`，可以用JSON序列化形式存对象。同样使用JSON反序列化读取。
:::

<Vssue />