# 原型

## 原型对象
每当创建一个函数时，浏览器都会向函数中添加一个隐含的属性`prototype`，这个属性指向一个对象，就是原型对象。每个函数都有自己的原型对象，不同函数之间的原型是不同的
:::tip
所有原型对象内部都有一个`constructor`属性（构造器），该属性指向原型对象所在的构造函数
:::

## 函数与构造函数
函数与构造函数本质上都是函数，是函数就会有`prototype`原型对象，区别在于构造函数可以产生实例对象。\
调用普通函数，`prototype`没有任何效果\
调用构造函数，构造函数所产生的的实例对象的指针`__proto__`，指向该构造函数的原型`prototype`
```js
function MyClass(){ } 
var mc = new MyClass()
mc.__proto__ === MyClass.prototype //true
```
构造函数产生的多个实例对象，指针全部都指向该构造函数的原型，这就是原型对象的特性，也是数据共享的概念
```js
function MyClass(){ } 

var mc = new MyClass()
var mc2 = new MyClass()

mc.__proto__ === MyClass.prototype //true
mc2.__proto__ === MyClass.prototype //true

mc.__proto__ === mc2.__proto__ //true
```
![prototype](/assets/img/prototype1.png)

当实例对象访问属性时，如果自身存在属性，就访问自身的属性，如果自身没有，就会通过`__proto__`到构造函数的原型中访问。

查询某个属性是否存在于某个对象中：
* `in`：查询某个属性是否存在于该对象本身或者原型链之内
* `hasOwnProperty()`：查询某个属性是否存在对象本身之内，而不会去查询原型对象

```js
function Person(){ }
Person.prototype.myTest = function(){ } //原型方法

var per = new Person()
console.log('myTest' in per) //true

console.log(per.hasOwnProperty('myTest')) //flase
```
利用数据共享的特性，把需要被多个对象使用的数据，保存到原型当中：
```js
function MyClass(){ } 

MyClass.prototype.width = '100px';

var mc = new MyClass()
var mc2 = new MyClass()

alert(mc.width) //'100px'
alert(mc2.width) //'100px'
```
这样不仅可以减少代码的冗余。还可以起到节省内存的效果，否则每个对象都独自设置属性，将会占用大量内存。

## 自定义原型对象
既然原型对象也是一个对象。那么可以用`{ }`的方式来自己定义原型。\
但是千万不能忘了`constructor`这个属性，自定义原型相当于覆盖原有的原型，所以需要手动把这个属性补上去。
```js
function MyClass() { }

MyClass.prototype = {
  constructor: MyClass,
  name: 'Hi~'
}

var mc = new MyClass()
mc.name //Hi~
```
原型里的属性方法都可以互相访问：
```js
function MyClass() { }

MyClass.prototype = {
  constructor: MyClass,
  name: 'Hi~',
  play: function () {
    alert('Hello~')
  },
  eat: function () {
    this.sleep()
  },
  sleep: function () {
    this.play()
  }
}

var mc = new MyClass()
mc.sleep() //Hello
```
给系统内置的对象设置原型属性方法：
```js
Array.prototype.bub = function () {
  for (var i = 0; i < this.length; i++) {
    for (var j = 0; j < this.length - i - 1; j++) {
      if (this[j] > this[j + 1]) {
        var temp = this[j]
        this[j] = this[j + 1]
        this[j + 1] = temp
      }
    }
  }
  return this
}

var arr = [9, 500, -8, 0, 36, -77]
console.log(arr.bub()) //[-77, -8, 0, 9, 36, 500]
```
:::warning
不推荐这样做，因为有可能会覆盖系统内置对象的方法，从而调用出错
:::

## 原型链
* 普通对象有`__proto__`属性，但是没有`prototype`这个属性，仅函数对象才有
* 函数对象有`__proto__`属性，也有`prototype`属性
```js
var obj = {}
var func = function(){ }

obj.prototype //undefined
func.prototype //原型
```
* `prototype`：原型对象
* `__proto__`：指向原型对象

要搞明白，`prototype`才是原型对象，而`__proto__`并不是原型对象，可以将它理解为一个指针，对象借用这个指针引用到构造函数的原型对象当中
```js
var Person = function(){ }
var per = new Person()

per.__proto__ //Person(){} 借用指针引用构造函数的原型
per.__proto__ === Person.prototype //true
```
而普通对象并没有`prototype`属性，所以严格来说，普通对象并没有原型对象。它只是借用`__proto__`这个指针指向了构造函数的原型对象

普通对象的`__proto__`属性指向衍生该对象的构造函数的`prototype`，那么构造函数的`__proto__`属性呢？

在JS中，所有的引用类型的`__proto__`属性都指向衍生该对象的构造函数，普通对象一样，构造函数也一样。默认情况下，每个函数的`__proto__`都是指向系统的`Function.prototype`。

换言之，相当于函数对象都是通过`new Function()`给生产出来的

```js
function Person(){ }                    //构造函数
Person.prototype.init = function () { } //原型方法
function child(){ }                     //普通函数

var per = new Person()
per.myTest = function(){ }              //对象方法


Person.__proto__ === Function.prototype                  //true
Person.prototype.init.__proto__ === Function.prototype   //true
child.__proto__ === Function.prototype                   //true
per.myTest.__proto__ === Function.prototype              //true
window.setInterval.__proto__ === Function.prototype      //true
```
总而言之：所有的引用类型的`__proto__`属性都指向衍生自己的构造函数的`prototype`对象。而构造函数也是引用类型，它也一样指向衍生自己的构造函数，默认所有函数都指向系统的`Function`构造函数的`prototype`对象。

包括`Function`和`Object`也不例外，它们也是构造函数，所以它们的`__proto__`也是指向`Function.prototype`

```js
Function.__proto__ === Function.prototype  //true
Object.__proto__ === Function.prototype    //true
```
既然这个`Function.prototype`这么强大，那它的`__proto__`又指向哪里呢？

先来了解`prototype`，`prototype`是原型对象，一个共享的内存空间，只要引用类型的`__proto__`指针指向这一块内存空间，那么这个引用类型就可以访问这块共享空间。

既然所有对象都有`__proto__`属性，并且指向`prototype`原型对象，而原型对象也是对象，那么它肯定也有`__proto__`这个属性，它指向哪里？
```js
function Test(){}
function myTest(){}

'__proto__' in Test.prototype    //true
'__proto__' in myTest.prototype  //true
```
答案是，所有的`prototype.__proto__`默认会指向`Object`这个系统的构造函数的`prototype`对象，而`Object.prototype.__proto__`属性指向的是`null`空指针对象。
```js
function Person(){}
var per = new Person()

per.__proto__.__proto__           //Object.prototype
per.__proto__.__proto__.__proto__ //null

// 包括Function的prototype也不例外
Function.prototype.__proto__           //Object.prototype
Function.prototype.__proto__.__proto__ //null
```
其实就像一根链子，链子的每一个环都是原型对象`prototype`，而衔接每一个环的地方就是指针`__proto__`。就形成了所谓的原型链，下图就是一个默认的原型链。

![prototype](/assets/img/prototype2.png)

<Vssue />