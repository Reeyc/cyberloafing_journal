# Dom
**Document Object Model** 文档对象模型，由ECMAScript实现的宿主环境提供的对象，可以理解为：浏览器提供的对象。
所有的BOM和DOM都是宿主对象（简单来说，可以通过DOM来操纵WEB页面）。
* **文档** Document：表示整个HTML网页的文档（也就是.html文件）
* **对象** Obeject：将网页中的每一个部分都转化为对象（标签、属性、文本、甚至注释等等..）
* **模型** Model：表示对象之间的关系，方便我们获取对象（DOM树）
![dom-tree](/assets/img/dom-tree.png)

## 节点
节点是网页中很重要的一个概念，网页就是由节点组成的，网页中的每一个部分都是节点，比如文档，标签，属性，文本，注释等等都是一个节点。\
虽然都是节点，但是类型并不相同，常用的节点分为四类：`文档节点`，`元素节点`，`属性节点`，`文本节点`。\
想要获取一个节点，可以通过DOM树的关系来获取到它，文档节点是所有内容的祖先节点，浏览器中提供了一个文档节点对象`document`，这个对象是`window`属性，代表的是整个网页，我们可以通过这个文档对象来获取其他的节点。

#### 通过document对象来获取其他节点
可以通过以下四种方法获取到元素节点对象：
| 方法名                    | 作用                                        |
| ------------------------ | ------------------------------------------ |
| getElementById           | 根据id获取元素节点对象（单数）                  |
| getElementsByTagName     | 根据标签获取元素节点对象（复数）                 |
| getElementsByClassName   | 根据class获取元素节点对象（复数）               |
| getElementsByName        | 根据name获取元素节点对象，多用于表单项（复数）    |

::: tip
获取复数的API都以类数组的形式返回，即使只获取到1个节点一样如此
:::

```html
<body>
  <button id="btn">按钮</button>  
  <script>
    document.getElementById("btn");
  </script>
</body>
```
下面这两种方法可以支持 **css选择器** 格式的字符串当做参数，来获取元素，并且兼容IE8：
| 方法名                    | 作用                                        |
| ------------------------ | ------------------------------------------ |
| querySelector            | 根据css选择器格式获取元素节点对象（单数）         |
| querySelectorAll         | 根据css选择器格式获取元素节点对象（复数）         |

```html
<body>
  <button id="btn">按钮</button>  
  <script>
    document.querySelector("#btn"); //元素
    document.querySelectorAll("#btn"); //[元素]
  </script>
</body>
```

## 文档的加载
浏览器执行代码从上至下执行的。\
如果将JS代码写在网页元素的前面，此时浏览器执行了JS代码，却还没有执行HTML代码，如果在JS代码中获取DOM元素，就会报错，因为此时HTML元素尚未加载。\
所以，我们要将JS代码写在网页元素的后面，也就是body标签的最底下。
```html
<body>
  <div id="demo"> </div>
  <script>
    var demo = document.getElementById('#demo')
  </script>
</body>
```
但是，这样并不能完全满足需求，有时候就是需要JS代码写在head标签里，此时，可以用`onload`绑定页面加载事件。\
`onload`事件当一张**图片**或者一份**html文档**加载完成时触发事件，`window.onload`事件会在文档加载完成之后执行JS代码，将JS代码写到onload属性对应的响应函数里面，这样就能够保证这些代码执行时，页面已经加载完成了。
```js
//给window绑定页面加载事件
window.onload = function() {
  //获取按钮对象
  var btn = document.getElementById("btn");
  //给按钮绑定单击事件
  btn.onclick = function() {
    alert("Hello!");
  };
};
```

## DOM查询
在JS中，还有其他方法能够帮助我们获取到元素的子节点：
| 方法名                    | 作用                                                      |
| ------------------------ | -------------------------------------------------------- |
| parentNode               | 获取元素的父节点，不含文本节点                                |
| children                 | 获取元素下的所有子元素节点，不含文本节点                        |
| firstChild               | 获取元素下的第一个子节点                                      |
| lastChild                | 获取元素下的最后一个子节点                                    |
| previousSibling          | 获取该节点的前一个兄弟节点                                    |
| nextSibling              | 获取该节点的后一个兄弟节点                                    |
| childNodes               | 获取元素下的所有子节点（不支持IE8及以下的浏览器）                 |
| firstElementChild        | 获取元素下的第一个子节点，不含文本节点（不支持IE8及以下浏览器）     |
| lastElementChild         | 获取元素下的最后一个子节点，不含文本节点（不支持IE8及以下浏览器）   |
| perviousElementSibling   | 获取该节点的前一个兄弟节点，不含文本节点（不支持IE8及以下的浏览器） |
| nextElementSibling       | 获取该节点的后一个兄弟节点，不含文本节点（不支持IE8及以下的浏览器） |

## 操作节点
| 方法名                    | 作用                |
| ------------------------ | ------------------ |
| createElement   | 创建元素节点                  |
| createTextNode  | 创建文本节点                  |
| createAtttibute | 创建属性节点                  |
| cloneNode       | 克隆元素节点                  |
| appendChild     | 把新的子节点添加到指定节点       |
| removeChild     | 删除子节点                    |
| replaceChild    | 替换子节点                    |
| insertBefore    | 在指定的子节点前面插入新的子节点  |
| getAttribute    | 返回指定的属性值               |
| setAttribute    | 设置指定的属性值               |

往body中加入div标签，div里加入span标签：
```js
var div = document.createElement('div')
var span = document.createElement('span')
var text = document.createTextNode('哈哈哈')

span.appendChild(text)
div.appendChild(span)
document.body.appendChild(div)
```

### 操作属性节点
```html
<body>
  <div key="value"></div>
  <script>
    var div = document.querySelector('div')
    console.log(div.getAttribute("key")); //value

    div.setAttribute("key", "value2");
    console.log(div.getAttribute("key")); //value2

    div.removeAttribute("key");
    console.log(div.getAttribute("key")); //null
  </script>
</body>
```

## innerHTML & innerText
| 属性           | 作用                           |
| ------------- | ----------------------------- |
| innerHTML     | 用于获取元素的内容，包含标签和文本  |
| innerText     | 用于获取元素的内容，仅包含文本      |

```html
<body>
  <div>
    <span>哈哈哈</span>
  </div>
  <script>
    var div = document.querySelector('div')
    div.innerHTML //<span>哈哈哈</span>
    div.innerText //哈哈哈
  </script>
</body>
```
`innerHTML`可以获取元素的内容，包括文本，同理，修改元素的`innerHTML`可以实现创建、修改、删除元素：
```html
<body>
  <div>
    <span>哈哈哈</span>
  </div>
  <script>
    var div = document.querySelector('div')
    div.innerHTML = "<span>哈哈哈</span> <span>嘿嘿嘿</span>" //修改div标签的内部结构
  </script>
</body>
```
使用innerHTML属性进行DOM操作的注意点：
* 使用`innerHTML`进行添加操作，会把原先的元素覆盖掉，如果是添加要用`+=`运算符。
* 如果原先的元素绑定了事件，那么不能使用`innerHTML`操作，会使前面的事件失效，因为<u>innerHTML会覆盖原先的元素</u>，所以`innerHTML`属性不推荐单独使用，一般情况下都是结合两种方式使用，先用`createElement`方法创建元素节点，再用`innerHTML`属性创建文本节点。

## 操作元素样式
```js
元素.style.样式名 = "样式值"; //语法
div.style.width = "300px";
```
::: warning
在css中，凡是带有`-`的在js中都不合法，应该用驼峰命名法，去掉`-`，`-`后面的第一个字母用大写表示。
:::

```js
background-color = "yellow"; //Bad
backgroundColor = "yellow";  //Good
```
通过这种方式修改的是**内联样式**，读取时，也是只读**内联样式**，无法读取样式表的样式

```html
<head>
  <style>
    #box {
      width: 100px;
      height: 100px;
      background-color: pink;
    }
  </style>
</head>

<body>
  <button id="btn">按钮</button>
  <div id="box"></div>
  <script>
    window.onload = function () {
      var box = document.querySelector("#box");
      var btn = document.querySelector("#btn");
      btn.onclick = function () {
        box.style.width = "400px"; //设置内联样式
        console.log(box.style.width); //读取内联样式
      };

      console.log(box.style.width); //不可读取样式表
    };
  </script>
</body>
```
## 获取元素样式
除了`元素.style.样式`可以修改和读取内联样式，还有别的方式可以用于读取样式表的样式：\
假设有这么一个DOM元素及其样式表：
```html
<head>
  <style>
    #box {
      height: 100px;
      background-color: pink;
    }
  </style>
</head>

<body>
  <button id="btn">按钮</button>
  <div id="box" style="width: 200px"></div>
</body>
```
* **元素.currentStyle.样式**

获取元素当前正在显示的样式（支持IE浏览器，不支持其他浏览器）
```js
var box = document.querySelector("#box");
var btn = document.querySelector("#btn");
btn.onclick = function () {
  box.style.width = "400px";
  console.log(box.currentStyle.width); //400px
};

console.log(box.style.width); //200px
console.log(box.currentStyle.width); //200px
```
* **getComputedStyle(元素, null).样式**

获取元素当前正在显示的样式（支持其他浏览器，不支持IE浏览器）
   * 参数一：被获取样式的元素对象
   * 参数二：伪元素（一般都直接传`null`）
   * 返回值：封装了当前元素样式的样式对象

```js
var box = document.querySelector("#box");
var btn = document.querySelector("#btn");
btn.onclick = function () {
  box.style.width = "400px";

  var boxStyle = getComputedStyle(box, null);
  console.log(boxStyle.width); //400px
};

console.log(box.style.width); //200px

var boxStyle = getComputedStyle(box, null);
console.log(boxStyle.width); //200px
```
处理兼容性：
```js
function getStyle(dom, style) {
  if (window.getComputedStyle) {
    //其他浏览器
    return getComputedStyle(dom, null)[style]
  } else {
    //IE
    return dom.currentStyle[style]
  }
}
```
`currentStyle`和`getComputedStyle()`都可以获取到样式表或者外部css文件的样式，但是仅仅是只读的，不能修改样式。

:::tip
无论是通过`style`或是`currentStyle`或是`getComputedStyle()`返回的样式都是**带单位**的，需要去除单位转为**number**类型才能计算。
:::

## 其他样式属性
### client系列
* clientWidth、clientHeight：获取元素当前可见宽度值或高度值（<u>含内边距、不含边框</u>）
* clientLeft、clientTop：获取元素左边框或上边框的宽度值
### offset系列
* offsetWidth、offsetHeight：获取元素完整宽度值或高度值（<u>含内边距、含边框</u>）
* offsetLeft、offsetTop：获取元素对于定位父元素的偏移值
* offsetParent：获取元素的定位父元素
   * 如果有多个祖先元素有定位属性，则获取到**最近的定位父元素**。
   * 如果所有的祖先元素都没有定位属性，则获取到**body**。
### scroll系列
* scrollWidth、scrollHeight：获取元素整个滚动区域的宽度值或者高度值（<u>不含边框</u>）
* scrollTop、scrollLeft：获取水平或者垂直滚动条滚动的距离

假设有一个DOM元素如下：
```html
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    #box1 {
      position: relative;
      width: 300px;
      height: 400px;
      padding: 10px;
      border: 1px solid #000;
      background-color: skyblue;
    }
    #box2 {
      width: 400px;
      height: 500px;
      padding: 10px;
      border: 1px solid #000;
      background-color: yellow;
    }
  </style>
</head>

<body>
  <div id="box1">
    <div id="box2"></div>
  </div>
</body>
```
通过三大系列获取到的值如下：
```js
var div1 = document.getElementById("box1");
var div2 = document.getElementById("box2");

//可获取，不可修改
div1.clientHeight = 430;
div2.offsetHeight = 530;

console.log("client：" + div1.clientWidth); //320(含内边距)
console.log("client：" + div1.clientHeight); //420(含内边距)

console.log("offset：" + div2.offsetWidth); //422(含内边距、边框)
console.log("offset：" + div2.offsetHeight); //522(含内边距、边框)

console.log("div2的定位父元素：" + div2.offsetParent.id); //box1 获取最近的定位父元素，没有则获取body

//距离定位父元素的偏移量
console.log("div2距离定位父元素的水平偏移：" + div2.offsetLeft); //10
console.log("div2距离定位父元素的垂直偏移：" + div2.offsetTop); //31

//整个元素的滚动长度
console.log("div1滚动长度：" + div1.scrollHeight); //div1 滚动了553
console.log("div2滚动长度：" + div2.scrollHeight); //div2 滚动了520

//元素滚动与初始的距离(滚动条的距离)
console.log("div1滚动水平距离：" + div1.scrollLeft);
console.log("div1滚动垂直距离：" + div1.scrollTop);
```
::: tip
三大系列获取到的值都是不带单位的**number**类型，可以直接进行运算
:::

## 操作CSS类
改变元素的样式，通过操作CSS类的方式更方便。
* 添加class

如果仅仅是将元素的class修改成别的class，那么可以直接将原先的class给替换掉。\
否则新的class前记得加空格，否则会将新旧class拼串成一个全新class。应该使用`+=`运算符
```js
元素.className += " class"
```

* 查询class
当需要查询一个元素中是否已经含有某个class时，需要用正则表达式来检查它的class字符串。
   * 需要用`\b\b`单词边界区分，否则只要含有这个字符就都会返回`true`。
   * 建议使用正则表达式构造函数，正则表达式字面量无法传递变量。

* 删除class
需要删除class中的某个class时，一样需要正则检查字符串规则。\
由于class也是一段字符串，可以用字符串的`replace`方法来删除。
```js
//查询
function myHasClass(obj, cn) {
  var reg = new RegExp('\\b' + cn + '\\b')
  return reg.test(obj.className)
}

//添加（有则不再加）
function myAddClass(obj, cn) {
  if (!myHasClass(obj, cn)) {
    obj.className = obj.className + ' ' + cn
  }
}

//替换
function myRelaClass(obj, cn) {
  obj.className = cn
}

//删除（有则删，没有删不了，所以不用判断）
function myRemoveClass(obj, cn) {
  var reg = new RegExp('\\b' + cn + '\\b')
  obj.className = obj.className.replace(reg, '')
}

//切换(有则删，没有则加)
function myToggleClass(obj, cn) {
  if (myHasClass(obj, cn)) {
    myRemoveClass(obj, cn)
  } else {
    myAddClass(obj, cn)
  }
}
```