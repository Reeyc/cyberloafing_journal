# 事件
事件就是文档或者浏览器窗口里发生的一些特定交互瞬间，JS跟HTML是通过事件来实现交互的。\
比如：单击某个元素，双击某个元素，鼠标悬停到某个元素上方，按下键盘上的某个键 等等...\
处理事件（行为）：既然事件发生了，那就处理一下事件，在事件对应的属性中设置一些js代码，当事件发生时，这些代码就会执行。\
常见的一些事件属性：
| 事件名        | 触发时机                   |
| ------------ | ------------------------- |
| onabort      | 图像的加载被中断             |
| onblur       | 元素失去焦点                |
| onchange     | 表单元素的内容改变           |
| onclick      | 鼠标点击某个对象             |
| ondbclick    | 鼠标双击某个对象             |
| onerror      | 当加载文档或图像时发生某个错误 |
| onfocus      | 元素获得焦点                |
| onkeydown    | 某个键盘的键被按下           |
| onkeypress   | 某个键盘的键被按下或按住      |
| onkeyup      | 某个键盘的键被松开           |
| onload       | 某个页面或图像被完成加载      |
| onmousedown  | 某个鼠标按键被按下           |
| onmousemove  | 鼠标被移动                  |
| onmouseout   | 鼠标从某元素移开             |
| onmouseover  | 鼠标被移到某元素之上         |
| onmouseup    | 某个鼠标按键被松开           |
| onreset      | 重置按钮被点击              |
| onresize     | 窗口或框架被调整尺寸         |
| onselect     | 文本被选定                 |
| onsubmit     | 提交按钮被点击              |
| onunload     | 用户退出页面                |
为元素的对应事件绑定响应函数的形式来响应事件，这样，每当事件触发时，其对应的函数就会被调用。
```js
//获取按钮元素节点对象
var btn = document.getElementById("btn");
//为按钮对象绑定一个单击响应函数
btn.onclick = function(){
  alert("Hello!");
};
```
事件响应函数都是由浏览器调用的，而不是开发者调用的。\
浏览器在调用响应函数时（触发函数），每次都会将一个事件对象作为实参传递进函数里。

## 事件对象
在这个事件对象中，封装了当前事件的所有相关信息。\
比如：鼠标的坐标，哪个键盘被按下，滚轮滚动的方向....等等许许多多的事件相关信息。\
常见的一些事件对象属性：
| 属性名         | 描述                                         |
| ------------- | ------------------------------------------- |
| altKey        | 返回触发鼠标事件时是否按下了 "ALT" 键            |
| button        | 返回触发鼠标事件时按下的鼠标按钮                  |
| clientX       | 返回触发鼠标事件时，鼠标指针相对于当前窗口的水平坐标 |
| clientY       | 返回触发鼠标事件时，鼠标指针相对于当前窗口的垂直坐标 |
| ctrlKey       | 返回触发鼠标事件时是否按下了 "CTRL" 键           |
| metaKey       | 返回按键事件触发时是否按下了 "META" 键           |
| relatedTarget | 返回与触发事件的元素相关的元素                   |
| screenX       | 返回窗口/鼠标指针相对于屏幕的水平坐标             |
| screenY       | 返回窗口/鼠标指针相对于屏幕的垂直坐标             |
| shiftKey      | 返回按键事件触发时是否按下了 "SHIFT" 键          |

所以，在定义响应函数时，可以创建一个形参来操作这个事件对象，或者也可以用`argument`对象来操作，不过不如形参来的方便一些。
```js
window.onload = function () {
  var box = document.getElementById('box')

  //此时event就是浏览器传的事件对象
  box1.onmousemove = function (event) {
    //兼容性调整
    event = event || window.event

    var x = event.clientX //获取鼠标指针的x坐标
    var y = event.clientY //获取鼠标指针的y坐标

    // 用arguments属性来操作事件对象也可以
    // var x = arguments[0].clientX;
    // var y = arguments[0].clientY;
  }
}
```

## 事件冒泡
指的就是事件的向上传导，当子元素的事件执行时，其祖先元素的相同事件也会分别执行，这就是事件的冒泡。
* 冒泡只会向上传导，不会向下传导。
* 冒泡只会执行祖先元素的相同事件，不同事件不会执行。
```html
<body>
  <div id="box1">box1
    <div id="box2">box2</div>
  </div>
  <script>
    var body = document.body;
    var box1 = document.getElementById("box1");
    var box2 = document.getElementById("box2");

    //给body、box1、box2分别绑定了一个单击响应函数
    //当box2(子元素)的响应函数执行时，box1跟body(祖先元素)的onclick响应函数也会执行
    //当box1(子元素)的响应函数执行时，body(祖先元素)的onclick响应函数也会执行
    box2.onclick = function () { alert("我是box2的响应函数"); };
    box1.onclick = function () { alert("我是box1的响应函数"); };
    body.onclick = function () { alert("我是body的响应函数"); };
  </script>
</body>
```
### 清除冒泡
冒泡特性绝大多数情况是对我们有用的，如果有特殊情况不需要冒泡，可以自己阻止冒泡。\
在浏览器传递的事件对象中，有一个属性可以用来取消冒泡：
* event.cancelBubble：true 取消冒泡（<u>火狐、IE8不支持，IE8没有事件对象，需要处理兼容性问题</u>）
* event.stopPropagation()：调用取消冒泡（<u>火狐支持，IE8不支持</u>）
```js
box2.onclick = function (event) {
  event = event || window.event
  alert('我是box2的响应函数')
  event.cancelBubble = true //清除冒泡
}

box1.onclick = function (event) {
  event = event || window.event
  alert('我是box1的响应函数')
  event.stopPropagation && event.stopPropagation() //清除冒泡
}

body.onclick = function () {
  alert('我是body的响应函数')
}
```

## 事件委托
想往动态新增的元素上绑定事件，就要用到事件委托，也叫事件委派、事件委任。\
利用事件的冒泡特性，给元素共同的祖先元素绑定一次相同事件，即可应用到多个后代元素上，即使后代元素是后添加的。
```js
window.onload = function () {
  var btn = document.querySelector('.btn')
  var ul = document.querySelector('ul')

  //点击按钮创建元素
  btn.onclick = function () {
    var li = document.createElement('li')
    li.innerHTML = "<a href='#' class='test'>点击</a>"
    ul.appendChild(li)
  }

  //利用冒泡特效，当a触发事件时，ul也会触发
  ul.onclick = function () {
    alert('冒泡到了ul!!! ul的相同事件将会触发')
  }
}
```
祖先元素中不一定只包含这些指定的后代元素，也有可能包含别的元素，导致触发祖先元素事件的元素也可能不是我们期望的元素。\
所以要进行判断，如果触发事件的元素不是我们期望的元素，则不执行。\
在事件对象中有一个属性，来获取触发该事件的对象：**target**
```js
//给所有a的父元素添加响应函数，当a触发事件时，相同的事件会冒泡到父元素
ul.onclick = function (event) {
  event = event || window.event
  if (event.target.className == 'test') {
    //判断触发事件的对象是否是我们期望的元素
    alert('冒泡到了ul!!! ul的相同事件将会触发')
  }
}
```

## 事件绑定
除了通过`元素.事件`的方式绑定事件以外，还提供了另外两种方法让我们给元素绑定事件：
* **addEventListener**：支持其他，不支持IE8
   * 参数一：事件的字符串，去除on
   * 参数二：事件响应函数
   * 参数三：布尔值，一般都是传一个false

* **attachEvent**：支持IE8，不支持其他，从后往前执行
   * 参数一：事件的字符串，要写on
   * 参数二：事件响应函数

:::tip
在**addEventListener**中，回调函数的this是**绑定事件的对象**。\
在**attachEvent**中，回调函数的this是**window**。
:::

```js
//处理兼容性
function eventBind(obj, event, fun) {
  if (obj.addEventListener) {
    //3其他浏览器
    obj.addEventListener(event, fun, false)
  } else {
    //IE8，记得要加on
    obj.attachEvent('on' + event, fun.bind(obj)) //改变this指向
  }
}

var btn = document.querySelector('.btn')
eventBind(btn, 'click', function () {
  console.log('hello world')
})
```

### 事件解绑
**绑定事件的三种方式**
* `对象.事件 = function`
* `addEventListener()`
* `attachEvent()`

**解绑事件的三种方式**
* `对象.事件 = null`
* `removeEventListener()`
* `detachEvent()`

::: warning
浏览器之间是有差异的，为了避免不必要的缺陷，用什么样的方式绑定事件，最好就用什么样的方式解绑事件
:::
```js
//解绑事件(处理兼容性)
//绑定的事件函数必须是命名函数,否则无法用此方式解绑
function detEvent(obj, event, callbackName) {
  if (obj.removeEventListener) {
    //其他浏览器
    return obj.removeEventListener(event, callbackName, false)
  } else {
    //IE8
    return obj.detachEvent('on' + event, callbackName)
  }
}
```

## 事件传播
* 微软公司认为事件应该是由内往外传播（冒泡），也就是当事件触发时，先触发当前元素事件，然后分别向外层祖先元素依次触发相同事件。
* 网景公司认为事件应该是由外往内传播（捕获），也就是当事件触发时，会先从最外层祖先元素开始触发相同事件，然后向内依次触发。

W3C结合了两种方案，将事件传播分成了3个阶段：
* 捕获阶段：当事件触发时，从最外层祖先元素开始捕获，直到捕获到目标元素。
* 目标阶段：当捕获到目标阶段时，就在这里触发事件。
* 冒泡阶段：目标元素触发事件之后，会向祖先元素依次触发相同事件。

![event](/assets/img/event.png)
所以，一般默认情况下，事件的传播是从目标阶段开始触发的。\
如果有需求，需要在捕获阶段就触发事件的话：将`addEventListener`的第三个参数设为`true`（捕获阶段执行事件，相同事件将从外向内触发）。
:::tip
由于IE8以下的浏览器不支持`addEventListener`这个方法，所以IE8及以下浏览器无法设置元素从捕获阶段开始就触发事件
:::
```js
var ul = document.querySelector('ul')
var li = document.querySelector('li')
var span = document.querySelector('span')

function eventBind(obj, event, fun) {
  obj.addEventListener(event, fun, true) //true， 捕获阶段触发，由外向内触发
}

eventBind(span, 'click', function () {
  alert('我是span的事件')
})

eventBind(li, 'click', function () {
  alert('我是li的事件')
})

eventBind(ul, 'click', function () {
  alert('我是ul的事件')
})
```

## 键盘事件
键盘事件主要用于表单项，需要绑定给可以获取焦点的对象或者`document`。\
按键按下事件：**onkeydown**\
按键松开事件：**onkeyup**

### 属性
| 属性名                     | 作用                                                     |
| ------------------------- | -------------------------------------------------------- |
| keyCode                   | 返回一个按键的Unicode编码                                   |
| ctrlKey、shiftKey、altKey  | 返回`ctrl`、`shift`、`alt`键是否被按下，返回`true`/`false`  |

要求按键盘（上下左右）移动div：
```js
document.body.appendChild(document.createElement('div'))
var box = document.querySelector('div')
var speed = 50 //速度50

document.onkeydown = function (event) {
  event = event || window.event

  if (event.ctrlKey) speed += 50 //按下ctrl速度加快
  if (event.altKey) speed -= 50 //按下alt速度减慢

  switch (event.keyCode) {
    case 37: //左 37
      box.style.left = box.offsetLeft - speed + 'px'
      break
    case 38: //上 38
      box.style.top = box.offsetTop - speed + 'px'
      break
    case 39: //右 39
      box.style.left = box.offsetLeft + speed + 'px'
      break
    case 40: //下40
      box.style.top = box.offsetTop + speed + 'px'
      break
  }
}
```
:::tip
* 当`onkeydown`连续触发时，第一次和第二次会间隔小段时间，这是浏览器设定的，目的是为了防止误操作，用户按下一个键盘时，太敏感会触发第二次，可以采用定时调用来取消这一段间隔。
* 按键在文本框中输入内容会显示出内容，这是`onkeydown`的默认行为，可以通过`return false`来取消默认行为。
:::

<Vssue />