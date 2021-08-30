# 执行上下文

执行上下文可以理解为执行环境，当JS解释器执行JS代码前，默认会先创建并进入执行环境，再执行代码。在JS中，存在以下几种执行上下文：

* **全局执行上下文**\
执行全局代码时，会首先创建一个执行上下文，并在这个执行上下文内执行全局代码，这个执行上下文就是全局执行上下文

* **函数执行上下文**\
每一个函数所执行时，也会创建一个执行上下文，函数内的代码都在这个执行上下文里面执行
:::tip
不包括函数内被调用的函数，如果函数内还有函数被调用了，那么会创建一个新的执行上下文来执行这个内部函数的代码。即使是递归也是一样的
:::

* **eval执行上下文**\使用`eval函数`消耗性能过大，很少有人使用，所以这里不做介绍

## 执行上下文栈
每执行一个函数就创建一个执行上下文，这么多的执行上下文，JS是按照什么样的机制进行管理的？

答案是，每调用一个函数，就将产生的执行上下文添加到栈中（入栈）\
每当函数调用完毕，就将该函数所处的执行上下文移除栈顶（出栈）

这种机制叫做 **执行上下文栈** 或者 **堆栈**

```js
function outer() {
  console.log('执行outer内代码');
  function inner() {
    console.log('执行inner内代码');
  }
  inner()
}

console.log('执行全局代码');
outer()
console.log('继续执行全局代码');
```
1. 首先毫无疑问，先创建一个**全局执行上下文**，把它添加到调用栈列表，执行全局内代码
2. 执行到`outer()`这一行，创建一个**函数执行上下文**，把它压入栈顶，并执行该函数内代码
3. 执行到`inner()`这一行，创建一个**函数执行上下文**，也把它压入栈顶，并执行该函数内代码
4. 当`inner`函数执行完毕了，将它所处的执行上下文从调用栈中移除，继续执行`outer`函数未执行完的代码
5. 当`outer`函数执行完毕了，将它所处的执行上下文从调用栈中移除，继续执行全局内未执行完的代码

![execution](/assets/img/execution.png)

可以得出，调用栈的 **栈顶** 永远是当前正在执行的函数执行上下文，执行完毕则被移除调用栈。\
而 **栈底** 永远是全局执行上下文，它会在浏览器关闭之后才被移除调用栈。

## 执行上下文的建立阶段
* 创建变量对象
* 初始化作用域链
* 确定this指向

以上三者均在执行函数代码前完成。
```js
executionContext = {
  'variableObject' : {},
  'scopeChain' : [],
  'this' : {}
}
```

### 变量对象（Variable Object）
在执行上下文建立的时候，最先做的一件事就是在执行上下文内创建一个变量对象。变量对象的构成：**arguments参数对象**、**函数声明**、**变量声明**

每找到一个**函数声明**，就在变量对象内用该函数名字创建一个属性，值默认指向`该函数的引用地址`\
每找到一个**变量声明**，就在变量对象内用该变量名字创建一个属性，值默认指向`undefined`

例如：现有一个函数
```js
function foo() {
  var a = 9; //变量声明

  function b() { //函数声明
    alert(a);
  }
}
foo();
```
该函数执行时，它的执行上下文中的变量对象是这样子的（此时还未执行函数内代码）：
```js
variableObject = {
  'arguments' : {...},  //arguments参数对象
  'b': <ref to function>  //函数声明
  'a': undefined  //变量声明
}
```
**没赋值的情况下，函数声明比变量声明的优先级高**
```js
function myTest(){
  var a;
  function a(){
    alert('Hello~');
  }
  console.log(a); //function a(){...}
}
myTest();
```
赋值的情况下，变量声明的值就会覆盖函数声明指向的引用地址
```js
function myTest(){
  var a = 100;
  function a() {
    alert('Hello~');
  }
  console.log(a); //100
}
myTest();
```

### 活动对象（Activation Object）
变量对象**VO** 是构成执行上下文EC的重要组成部分，在代码执行之前就已经创建完毕，代码执行前是无法访问**VO**的。\
而当代码进入执行阶段之后，这个所谓的`变量对象VO`就变成了`活动对象AO`，对象里面的属性都能被访问了，然后开始执行阶段的操作，换句话说，`AO`就是`VO`在真正执行时的另一种形态。
```js
function myTest(a){
  var s = 10;
  function x(){
    alert('Hello');
  }
}
/*
VO = {
  arguments: {a: undefined },
  x: <ref to function>,
  s: undefined
}
*/


myTest(100);
/*
AO = {
  arguments: {a: 100, ... },
  x: <ref to function>,
  s: 10
}
*/
```
但是，在全局执行上下文内则有所不同：

全局对象是**window**对象，全局执行上下文在执行前的初始化阶段，全局变量、函数都被挂在**window**对象上，因此全局执行上下文内的变量可以通过变量对象的属性名间接访问。

### 作用域链（scopeChain）

作用域链是除了变量对象之外，另一个组成执行上下文的重要部分，由当前内存中各个变量对象**VO**串起来的**单向链表**
```js
var num = 100;
function a() {
  function b() {
    function c() {
      alert(num);
    }
    c();
  }
  b();
}
a();
```
每入栈一个执行上下文，就创建一个`VO`，然后把这个`VO`添加到 **作用域链** 里面当函数c的执行上下文。\
入栈时，此时栈内一共有4个执行上下文，也就是说有4个变量对象VO这4个VO要按顺序被添加到scopeChain中：
```js
EC(c) = {
  'variabelObject': {...},
  'scopeChain': [VO(c), VO(b), VO(a), VO(global)],
  'this': {...}
}
```
后添加的**VO**可以访问前面添加的**VO**内部的属性，而前面添加的则无法访问后面的
```js
function a(){
  var num = 100;
  function b() {
    var num2 = 200;
    console.log(num + num2); //300
  }
  b();
  console.log(num + num2); //num2 is not defined
}
a();
```
由执行上下文入栈的顺序和作用域链的访问规则可以得出：**作用域链的终点是全局作用域**

### This

除了创建变量对象和作用域链之外，JS解释器在执行上下文中还做了一件重要的事：确定`this`指向\
`this`指向一个对象，在函数调用时（执行上下文入栈）确定，并且不可更改。

**当函数作为普通函数调用，此时`this`指向全局对象`window`**
```js
function demo(){
  console.log(this); //window
}
demo();

function demo2(){
  function demo3(){
    console.log(this); //window
  }
  demo3();
}
demo2();
```
**当函数作为对象的方法调用，此时`this`指向方法所属的对象**
```js
var obj = {
  foo:function() {
    console.log(this); //obj{...}
  },
  foo2:function() {
    (function() {
      console.log(this); //独立的函数，不属于obj对象，window
    })();
  }
}
obj.foo()
obj.foo2()
```

**当函数作为构造函数调用，此时`this`指向新创建的对象**
```js
function Parent(age) {
  this.age = age;
}
var child = new Parent(18);
console.log(child.age); //18
```

**通过`call`、`apply`、`bind`显式绑定，此时`this`指向指定的对象（第一实参）**
```js
function test(){
  console.log(this.age); //18、28、38
}

test.call({age: 18});   
test.apply({age: 28}); 
test.bind({age: 38})();
```

**ES6箭头函数中的`this`是词法作用域，不再是执行时确定指向。**\
词法作用域指的是函数定义时所在的作用域。所以，箭头函数本身内并没有`this`，函数在哪里定义，这个`this`就是谁的`this`
```js
let foo = () => console.log(this);
foo(); //window 在window里定义

let obj = {
  foo: function() {
    let foo = () => console.log(this);
    foo(); //obj 在obj.foo里定义，this即是obj.foo的this
  }
}
obj.foo();
```

箭头函数没有`this`，因此无法通过`call`、`apply`、`bind`来绑定
```js
let obj = {
  foo:function() {
    let foo = () => console.log(this);
    foo.call({name: 'bad'}); //obj
  }
}
obj.foo();
```