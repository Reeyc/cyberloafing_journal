# 函数
将一些代码封装起来，将来要用到这些代码的时候，直接调用这个函数即可。

### 创建函数
* **使用构造函数**
```js
//通过构造函数创建函数,代码片段必须要用双引号括起来
var fun = new Function("alert('你好')");
fun(); //调用函数
```

* **使用函数声明** <Badge text="推荐"/> 
```js
function fun() {
  alert('Hello');
} //函数声明末尾不用加分号

fun();
```

* **使用函数表达式** <Badge text="推荐"/> 
```js
var fun = function (){
  alert('Hello');
}; //赋值语句要加分号

fun();
```

## 形参
形式参数，在创建函数的括号中定义一个或者多个形参。也就是在函数内部定义变量的意思，但是记住，仅仅是定义变量，没有赋值，所以此时形参的值是`undefined`\
如下代码中，两者的值是一样的
```js
function fun(a, b){
  console.log(a); //undefined
  console.log(b); //undefined
}
fun();

function fun2(){
  var a;
  var b;
  console.log(a); //undefined
  console.log(b); //undefined
}
fun2();
```

## 实参
实际参数，在调用函数的括号中定义数量对应形参的实参。实参写在调用函数时的括号内，实参的值将赋值给形参的变量
* 实参的数量、顺序对应形参的数量、顺序
* 超出数量形参的实参，没有形参接收
* 实参可以是任意类型，包括对象、数组、函数（回调函数）
```js
function fun(a, b){
  console.log(a); //1
  console.log(b); //2
}
fun(1, 2, 3);
```
上述代码中，实参按顺序1赋值给a，2赋值给b，3超出形参的数量，没有被接收

## 返回值
函数就像一个代码块，内部专门用于封装实现各种行为功能的代码。\
当外部想要拿到函数内部代码产生的结果时：
* 在函数内，通过`return`语句返回该结果
* 在函数外，调用函数的返回值就是函数内部`return`的结果
```js
function fun(a, b) {
  var sum = a + b; 
  return sum; //将运行结果返回
  console.log("hello world") //return以后的代码都不会执行
}
var temp = fun(1, 2); //变量temp接收运行结果
console.log(temp); //3
```
::: tip
* 如果函数省略了`return`，函数默认返回值为`undefined`
* `return`会终止函数的执行，也就是说，`return`以后的代码永远不会被执行
* `return`后面的值可以是任何类型
* `return`只能返回一个值，但是如果想返回多个值的话，可以把这些值用对象或数组返回
:::

## 方法
对象的属性值可以是任意数据类型，当然也包括函数。\
所谓方法，也就是当一个函数作为对象的属性值时，那么这个函数是对象的方法，调用这个函数就是调用对象的方法。\
比如：`document.write()`就是调用`document`对象的`write`方法。
```js
function fun(){
  console.log('函数'); 
}
fun(); //调用函数

var obj = {
  name: "zs",
  age: 18,
  gender: "男",
  method: function() { //方法
    console.log('方法');
  }
};
obj.method(); //调用方法
```

## this
浏览器在调用函数时，每次都会向函数内部传递一个隐含的的参数，这个参数就是`this`。\
`this`指向是不固定的，他每次都会指向一个对象。至于指向哪个对象，需要看这个函数的调用方式来决定：
* 调用函数形式，`this`永远都是**window**。
* 调用方法形式，`this`将会是调用方法的那个对象。
```js
function fun() {
  console.log(this); //widnow
}
fun();

var obj = {
  method: fun
};
obj.method(); //obj

var obj2 = {
  method:fun
}
obj2.method(); //obj2
```
函数各种情况调用时的this指向：
| 调用情况              | this指向                     |
| -------------------- |---------------------------- |
| 普通函数              | window                      |
| 方法                 | 调用方法的对象                 |
| 回调函数              | window                      |
| 事件响应函数           | 触发事件的对象                |
| 构造函数              | 新创建的实例对象               |
| 原型方法              | 调用原型方法的实例对象          |
| 实例对象的方法         | 调用方法的实例对象             |
| call、apply、bind    | 实参的第一个对象               |
:::warning
严格模式下，所有函数都被当成方法，全局函数需通过`window.xxx()`调用，否则`this`指向`undeinfed`
:::

## arguments

`arguments`跟this一样也是浏览器向函数内部传递的数据，他是一个隐含的对象。\
它的作用是：将实参封装到一个伪数组中。
```js
function fun() {
  console.log(this) //Window
  console.log(arguments) //伪数组: [1,2,3]
  console.log(arguments.length) //3
}

fun(1, 2, 3)
```
**arguments.callee**：指向一个函数，这个函数就是当前正在执行的函数。
```js
function fun() {
  console.log(arguments.callee === fun) //true
}

fun()
```

## 作用域和预解析
作用域就是指在某些区域内起作用的的意思。

### 全局作用域
全局就是整个页面，顾名思义，在整个页面都能起作用的意思。\
在我们的页面中，有一个对象`window`一直存在，它由浏览器创建。
* 在全局中直接声明的变量，会被当做`window`对象的属性保存。
* 在全局中直接声明的函数，会被当做`window`对象的方法保存。
```js
//两者其实是一样的
var a = 100;
console.log(a);
console.log(window.a);

//两者其实是一样的
function fun(){
  console.log('Hello');
}
console.log(fun);
console.log(window.fun);
```

### 函数作用域
也叫局部作用域，每调用一次函数就开启一个函数作用域，每个函数作用域之间都是相互独立的，他们没有任何关系。
* 函数作用域**可以**访问全局作用域的变量
* 全局作用域**无法**访问函数作用域的变量
* 全局作用域在页面打开时创建，页面关闭时销毁
* 而函数作用域在调用函数时创建，函数执行完毕时销毁
```js
var global = 100; //全局变量

function fun(part) {
  part = 200; //局部变量
  console.log(global); //函数内可以访问全局变量
}
fun();

console.log(part); //全局无法访问函数变量
```

当全局跟局部都有变量时：
* 全局作用域只能寻找全局的变量。
* 局部作用域会优先寻找里自己最近作用域里的变量，如果没有则会往上，一级一级寻找变量。
```js
var part = 100; //全局变量

function fun() {
  var part = 200; //局部变量
  function fun2() {
    console.log(part); //200, 往上一级一级访问
  }
  fun2();
}
fun();

console.log(part); //100, 全局只能访问全局
```
所以，如果在函数作用域中声明变量没有写`var`关键字，那么这个变量指向的是全局的变量
```js
var num = 10;
function fun(){
  num = 100; //不写var等于全局变量(修改全局的num为100)
}
fun();
console.log(num); //100

var num2 = 20;
function fun2(num2){
  num2 = 200; //有形参就相当于定义了变量，所以是局部变量，不影响全局
  console.log(num2); //200
}
fun2();
console.log(num2); //20
```

### 预解析
`var`关键字会在所有代码执行前把变量声明好，但不赋值
```js
var a = 100;
console.log(a); //正常写法

b = 200;
console.log(b); //没有声明，不会报错，作为window的属性存在，但是不建议这样写

console.log(c); //undefined，声明了，但还没有赋值，
var c = 300;

console.log(d); //报错，没有声明
d = 400;
```
`function`关键字会在所有代码执行前把函数声明好
```js
function fun() {
  alert('Hello,fun');
}
fun(); //正常写法

fun2(); //也可以, function和var一样会预解析
function fun2()  {
  alert('Hello,fun2');
}

fun3(); //报错，function和var只是预解析，但是还没有赋值，fun3只是一个undeinfed还不是一个函数
var fun3 = function() {
  alert('Hello,fun3');
}
```

## 构造函数
构造函数就像是一个模板，专门用于生成实例对象。\
在**ES6**以前，构造函数和普通函数的格式没什么区别，只是按照规范，构造函数首字母是大写。
构造函数和普通函数唯一的区别就是调用方式的不同：
* 普通函数调用函数是`fun()`
* 构造函数调用函数是`new Fun()`
```js
function Person(){ } // 创建构造函数(首字母大写)
new Person(); // 调用构造函数
var per = new Person(); // 创建实例对象
```
在调用构造函数的同时，浏览器隐式的执行了一个流程：
1. 创建一个新的对象
2. 将这个新的对象设置为函数中的`this`，可以利用`this`来引用新建的对象
3. 执行函数中的代码
4. 将这个新建的对象作为返回值返回
```js
function Person(name, age, gender){
  //构造函数中的this，是创建出来的实例对象
  this.name = name;
  this.age = age;
  this.gender = gender;
  //每次调用构造函数时,就会产生一个新的实例对象，
  //浏览器已将该实例对象作为返回值返回,而不用我们return
}

var per1 = new Person('zs', 18, '男');
var per2 = new Person('ls', 19, '女');
```
使用同一个构造函数创建的对象，称这个构造函数为**类**，称这些对象为**实例**，也就是这个类（构造函数）的实例（对象）。\
`instanceof`关键字可以检查一个实例是否属于某个类，是则返回`true`，否则返回`false`。
```js
对象 instanceof 构造函数名
```
:::tip
所有对象跟`Object`做`instanceof`检查时都会返回`true`，所有对象都是`Object`的后代（继承概念）。
:::

```js
function Person(name, age, gender){
  this.name = name;
  this.age = age;
  this.gender = gender;
}

var per1 = new Person('zs', 18, '男');

console.log(per1 instanceof Person); //true
console.log(per1 instanceof Object); //true
console.log(Person instanceof Object); //true
```

## call & apply
函数也是对象的一种，所以函数也有方法，需要通过函数对象来调用。\
`call`和`apply`都是函数中的一种方法，调用它们需要通过函数对象来调用，比如：
```js
function fun() { }

fun(); //调用这个函数
fun.call();  //调用函数的call方法
fun.apply(); //调用函数的apply方法
```
**call**和**apply**的作用：
* call和apply和普通调用函数一样，每次调用这两个方法都会**执行函数**。
* 以call和apply的方式调用，可以指定函数的第一个实参为对象，此时这个对象将成为函数执行时的`this`。从第二个参数开始传递对应形参的实参。
* 如果call和apply方法中第一个参数不传递对象或者传递`null`，那么此时`this`是`window`。
* call和apply不存在于函数的原型当中，而是存在于**Function构造函数**的原型当中，所有的函数都是**Function**的后代（原型概念）。

**call**和**apply**的区别：
* call的方式调用：传参数是**依次传递**。
* apply的方式调用：传参数是封装到一个**数组**中一次性传递。
```js
var obj = { name: 'zs' }
var obj2 = { name: 'ls' }
var obj3 = {
  name: 'xm',
  say: function (a, b) {
    console.log(this.name)
    console.log(a)
    console.log(b)
  }
}

function fun(a, b) {
  console.log(this)
  console.log(a)
  console.log(b)
}
fun('实参1', '实参2') //执行函数
fun.call(obj, 'call实参1', 'call实参2') //改变this指向并执行
fun.apply(obj2, ['apply实参1', 'apply实参2']) //改变this指向并执行

obj3.say.apply(obj, [1, 2])
```

## bind
bind也和call、apply一样：
* 都属于函数的方法，都存在于**Function**的构造函数原型当中。
* 都用于改变`this`的指向（实参的第一个对象，不传则是`window`）。

bind和call、apply的区别是：
* 调用了`call`和`apply`会直接执行函数，而调用`bind`方法不会直接执行。
* `bind`会复制一份函数，谁调用`bind`就复制谁，返回值就是被复制的这个函数。
* `call`和`apply`是在调用的时候改变`this`的指向，`bind`是在复制的时候改变`this`的指向。
```js
function fun1() {
  console.log(this.name)
}

var obj = { name: 'zs' }

var temp = fun1.bind(obj) //复制，但不会执行
temp()
```

## 自执行函数
一般函数都是需要调用才会执行，有的函数不需要调用，一写出来就执行，这种函数叫作自调用函数，也可以叫一次性函数：
1. 先写一个匿名函数。
2. 用一对括号把整个函数括起来（浏览器会把括号内当做一个整体）。
3. 此时已经是一个完整的函数对象了，需要调用他就要在他的后面加上一个括号，就像平时的调用函数一样。
```js
(function () {
  console.log('hello world')
})()
```
把局部变量变为全局变量：
由于**window**是全局对象，所以我们可以利用**window**把局部变量变为全局变量。
```js
(function (win) {
  var num = 10 //局部变量
  win.num = num //2:给window新建属性,把局部变量赋值给这个属性
})(window) //1:传递window作为实参

console.log(num) //10

//也可以不用传递参数，直接接收
(function () {
  var num = 10
  window.num = num
})()

console.log(num)
```

## 递归
递归就是函数自己调用自己。\
递归本质上也是也是一种循环，递归要找到规律，并且有结束条件，否则函数将会无限调用自己，造成死循环。
```js
//以下代码慎执行

//这就是一种递归，不过这种递归没有结束条件，所以会无限循环调用
function recursive() {
  console.log('死循环')
  recursive()
}
recursive()
```
递归要有结束条件：
```js
function recursive(num) {
  num++
  if (num <= 5) { //结束条件
    console.log(num)
    recursive(num)
  }
}
recursive(1)
```
递归实现n个数字的累加和：
```js
function recursive(num) {
  if (num === 1) return 1 //结束条件
  return num + recursive(num - 1)
}

var result = recursive(5)
console.log(result) //15
```

## 严格模式
JS文件中的严格模式：在文件首行写上`"use strict"`（就像HTML文件中的`doctype`文档声明一样，如果有严格模式就要严格按照规则写代码）。\
函数中的严格模式：
`use strict`会将他下面的所有代码都执行严格模式，将`use strict`写在函数之前一行，或者函数内首行都行。\
严格模式下的函数会被看成是方法，谁调用这个函数，函数内的`this`就是谁。如果是全局函数，直接调用这个函数，`this`是`undefined`，必须要用**window**来调用才会是**window**，这就是严格模式下的`this`。
```js
'use strict'
function fun() {
  console.log(this)
}
fun() //没人调用，this是undefined
window.fun() //有人调用，this是window

var obj = {
  name: 'zs',
  fun: function () {
    'use strict'
    console.log(this)
  }
}
obj.fun() //有人调用，this是obj这个对象
```