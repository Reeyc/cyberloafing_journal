# 内存回收机制 GC

写的程序执行完了，这些程序里的对象就没有用了，而这些对象就称之为 **垃圾**，这些 **垃圾** 大量堆积在内存中，久而久之，就会造成内存不足。\
每种编程语言都有自己的垃圾回收机制，JavaScript也一样。

JavaScript采用`标记清除`的方式来回收内存：

一旦某个函数创建执行上下文（入栈），则标记该函数内的变量 **进入环境**\
当销毁该函数的执行上下文（出栈），则标记该函数内的变量 **离开环境**

* 全局执行上下文在浏览器关闭后出栈
* 函数执行上下文在函数执行完后出栈

而被标记 **离开环境** 的变量会在下一次垃圾回收机制运作时销毁该变量，释放其所占用的内存。

或者手动将变量设置为 **离开环境**：
将变量设置为`null`，意思为断开引用，空指针对象，也就是没有地方在引用它了，垃圾回收机制下次运作时就会将它释放。

## 函数内存回收机制

一个函数开始执行的时候：会开启内存空间来保存其内部的变量，方便函数内后面的语句所使用

当该函数执行完毕的时候：其内部的变量也一样，会被`标记清除`

下次再执行此函数的时候，一切又回到起点，重启开空间...标记清除释放...

但是，如果该函数内部还有函数，而内层函数引用了外层函数的变量，并且内层函数在外层函数之外被调用了，则变量将不能被销毁。变量会被缓存到一个 **闭包环境** 当中，除非内层函数被删除，或者设为空指针对象，否则该变量都会一直存在着。
```js
function outer(){
  var num = 100;
  return function(){
    alert(num++);
  }
} 

//1.正常情况外层函数被调用即被 "标记清除"
var inner = outer(); //内层函数

//2.但是内层函数在外层函数之外的地方被引用了
//则被内层函数使用的变量不会被释放，而被缓存起来
inner();

inner(); //101
inner(); //102
inner(); //103
```

## 闭包
本质上，闭包就是一个函数，只不过它跟普通函数的区别在于它能够访问其他函数内的数据，并将这些数据给缓存起来不被销毁，从而灵活实现各种应用。

::: tip
外层函数内的变量是被缓存起来了，因此才没被销毁，但是内层函数的数据可没被缓存起来，所以会正常销毁。
:::

```js
function outer(){
  var num = 100;
  return function (){
    var num2 = 999;
    alert(++num)
    alert(++num2)
  }
}

var inner = outer();

inner() // num => 101  num2 => 1000
inner() // num => 102  num2 => 1000
inner() // num => 103  num2 => 1000
inner() // num => 104  num2 => 1000
```

### 闭包的作用

1. 隔绝数据（避免污染全局环境）
2. 缓存数据（保存需要用到的数据）

```js
var global = {};

(function(param){
  function inner(){
    alert(++param);
  }
  function inner2(){
    alert('bad~~');
  }
  global.key = inner; //外部引用，需要用到的数据
})(100);

global.key(); //101
global.key(); //102
global.key(); //103 => 缓存数据

console.log(inner2); //not defined => 隔绝数据
```
jQuery采用的结构就是一个闭包环境

```js
(function (win) {
  var cQuery = function (object) {
    return cQuery.prototype.init(object);
  }
  cQuery.prototype = {
    constructor: cQuery,
    init: function (object) {
        this.self = object;
    }
  }
  cQuery.prototype.init.prototype = cQuery.prototype;
  win.cQuery = win.$ = cQuery;
})(window);

var myObj = new cQuery({
  key: 'Hello'
});

console.log(myObj.self); //{key:'Hello'}
```

#### 闭包内的this
`this`是浏览器向函数内部传递的一个隐含参数。默认它是在函数执行时绑定的，而非定义时

```js
var key = 'The Window';

var obj = {
  key : 'myObj',
  method: function () {
    return function () {
      alert(this.key);
    }
  }
}

obj.method()(); //The Window
```
为什么此处`this`指向 **window** 呢？

首先，需要搞明白：**函数作为函数调用**和**函数作为方法调用**的区别\
前者只是一个普通的函数，它属于**window**。后者属于方法所属的对象，例如：

```js
var key = 'The Window';

var obj = {
  key : 'myObj',
  method: function () {
    return function () {
      alert(this.key);
    }
  }
}

obj.method() //this指向方法所属的对象 => obj

var closure = obj.method() //这个就是匿名函数了(闭包)

closure() //它不属于该对象，并且它是在全局环境中执行的，故而，相当于 window.closure()
```
为什么闭包函数没有获取到`obj.method`内的`this`呢？\
一个函数执行时，只能获取到自己内部的`this`和`arguments`对象，而不可能直接访问外层函数内的这两个变量

解决方法：用变量传递
```js
var key = 'The Window';

var obj = {
  key : 'myObj',
  method: function () {
    var _this = this; //变量保存传递
    return function () {
      alert(_this.key);
    }
  }
}

obj.method()(); //myObj
```

### 闭包的问题

闭包不会自动销毁，只有保证闭包不可能再被调用了，才会被销毁。

由于闭包会使得函数内部中的变量都保存在内存中，内存消耗很大，所以不能滥用闭包，否则可能会造成网页的性能问题。

```js
var closure = (function(param){
  return function(){
    alert(param++);
  }
})(100);
 
closure(); //100
closure(); //101
closure(); //102

closure = null; //闭包设置断开引用，内部数据被销毁，释放内存

closure(); //closure not a function
```

### 柯里化

函数柯里化的定义：<font style="color: #f00">通过函数调用，并且继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式。</font>

其实函数柯里化的书写方式就是分为两步：
1. 函数内部返回（单个/多个）函数，每个函数接收不同的参数。
2. 利用闭包的缓存特性，将多个参数统一处理为一个参数。

下面是一个最简单的函数柯里化的例子：
```js
function currying(a) {
  return function (b) {
    return function (c) {
      return a + b + c
    }
  }
}

var sum = currying(1)(2)(3)
console.log(sum)
```

函数柯里化的优点在于：

* **延迟计算**：柯里化函数将在接收到最后一个参数的时候才进行最后的计算，与普通一次性接收所有参数的函数相比，延迟了最终计算。

* **参数复用**：前面传入的参数可以被后续的调用所复用。

个人认为，柯里化的重要意义在于可以把函数完全变成「接受一个参数；返回一个值」的固定形式，让人们将关注的重点聚焦到函数本身，而不因冗余的数据参数分散注意力。

<Vssue />