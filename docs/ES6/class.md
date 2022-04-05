# Class
ES6中引进了类的概念，由关键字 **class** 来定义一个类。\
但其实，ES6中的类基本上是一种语法糖，它绝大部分功能特性ES5都可以实现。新的class语法只是让对象原型的写法更加清晰、更像面向对象编程而已。
```js
class Parent { } //定义一个Parent类
```

ES6的类，完全可以看作构造函数的另一种写法。
```js
class Parent { }

typeof Parent // "function"
Parent === Parent.prototype.constructor // true
```
上面代码表明，类的数据类型就是函数，类本身就指向构造函数。使用的时候，也是直接对类使用`new`命令，跟构造函数的用法完全一致。
```js
class Bar {
  doStuff() {
    console.log("stuff")
  }
}

const b = new Bar()
b.doStuff() // "stuff"
```
:::tip
* 类中不允许出现`function`关键字，所有方法需以es6的方法简写来定义
* 方法与方法之间不允许用**逗号**隔开
:::

## constructor
实例属性在constructor内部初始化。\
在ES5中，`constructor`是一个构造器属性，指向构造函数。\
在ES6中，`constructor`是一个方法，也就是构造函数，用于产生实例对象，每当通过`new`一个类时，浏览器会自动调用这个构造函数，里面的`this`也就是产生的实例对象
```js
class Parent {
  constructor(param1, param2) {
    this.name = param1
    this.age = param2
  }
}

let child = new Parent("zs", 20) //{ name:'zs', age:20 }
```

## getter & setter
在类的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() { }
  get prop() {
    return "getter"
  }
  set prop(value) {
    console.log("setter: " + value)
  }
}

let inst = new MyClass()

inst.prop // 'getter'
inst.prop = 123 // setter: 123
```

## extends
**class**可以通过`extends`关键字实现继承，这比ES5的通过修改原型链实现继承，要清晰和方便很多。
> 语法：class 子类 extends 父类
```js
class Parent { }

class Child extends Parent { }
```
实现继承之后的子类可以继承父类所有的属性和方法。也可以自己扩展方法。
```js
class Parent {
  constructor() {
    this.prop = "parent"
  }
  parentMethod() {
    console.log("hello world")
  }
}

class Child extends Parent {
  childMethod() {
    console.log(this.prop)
  }
}

const c = new Child()
c.parentMethod() //'hello world'
c.childMethod() //'parent'
```

## 静态属性 & 静态方法
**静态方法**和**静态属性**指的是定义在类本身的属性、方法，而非定义在实例对象上，这些方法和属性只能通过类来访问。

**静态方法**跟实例方法一样都是书写在类的内部，区别在于，静态方法前面要加上**static**关键字。
```js
class Parent {
  static method() {
    console.log("static method")
  }
}

Parent.method() // 'static'

const instance = new Parent()
instance.method() // Uncaught TypeError: instance.method is not a function
```
静态方法内的`this`指向父类本身，而非实例对象。
```js
class Parent {
  constructor() {
    this.x = "instance prop"
  }
  static method() {
    console.log(this.x)
  }
}
Parent.x = "static prop"

Parent.method() // 'static prop'
```
---

**静态属性**的定义是在类的外部进行属性赋值。
```js
class Parent { }
Parent.x = 1

const instance = new Parent()
instance.x //undefined
```
新的提案提供了类的静态属性，写法是跟静态方法一样，在实例属性的前面，加上**static**关键字。
```js
class Parent {
  static x = 1
}

const instance = new Parent()
instance.x //undefined
```
这种方式很直观，避免了将类的属性定义在类外部，使人容易忽略掉这个属性。

---

父类的静态方法和静态属性都会被子类继承。继承过来的静态方法内部`this`指向子类。
```js
class Parent {
  static method() {
    console.log(this.x)
  }
}

class Child extends Parent { }

Child.x = 1
Child.method() // 1
```

## 实例属性 & 实例方法
**实例属性**和**实例方法**都是通过实例对象来访问的。
* 实例属性定义在实例上。
实例属性的定义有两种方式，第一种是直接在类的最顶层定义，其他不变。第二种是在`constructor`构造函数内，通过`this`的方式来定义。
```js
class Parent {
  x = 1 //写法一
  constructor() {
    this.y = 2 //写法二
  }
}

console.log(Parent.hasOwnProperty("x")) // false
console.log(Parent.hasOwnProperty("y")) // false

const p = new Parent()
console.log(p.hasOwnProperty("x")) // true
console.log(p.hasOwnProperty("y")) // true
```

* 实例方法定义在父类的原型对象上。
```js
class Parent {
  x = 1
  method() {
    console.log(this.x)
  }
}

console.log("method" in Parent.prototype) //true
console.log("x" in Parent.prototype)      //false

const p = new Parent()
p.method()                 // 1
Parent.prototype.method()  // undefined
Parent.method()            // Uncaught TypeError: Parent.method is not a function
```
上面代码中，实例方法`method`可以通过实例`p`调用，并打印了实例属性`x`的值。`Parent.prototype`原型对象也可以调用，因为实例方法本身就存在类的原型对象之中，但是却打印`x`的值为`undefined`，因为实例属性`x`是定义在实例上的。最后，通过类本身调用实例方法会报错，因为方法定义在原型对象中。

## super
ES6引进了super关键字，super一般都在**发生继承时，在子类内调用**，它可以是函数也可以是对象。

### super作为函数
`super`当做函数时，它指向的是父类的构造函数`constructor`。\
`super`函数只能在子类的构造函数中调用，在别的地方调用会报错。当发生继承时，ES6规定必须在子类的构造函数内调用`super`函数，这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法。
```js
class Parent { }

class Child extends Parent {
  constructor(...arg) {
    super(...arg)
  }
}
```
如果没有定义，则浏览器会默认定义
```js
class Child extends Parent { }

//等价于
class Child extends Parent {
  constructor(...arg) {
    super(...arg)
  }
}
```
:::warning
需要注意的是，在子类的构造函数中，使用`this`关键字，必须是在调用`super`方法之后。因为子类的实例构建基于父类的实例。
```js
class Parent {}

class Child extends Parent {
  constructor(...arg) {
    console.log(this) //ERROR
    super(...arg)
    console.log(this) //OK
  }
}
```
:::

---

`super`虽然执行的是父类的构造函数，但是其内部`this`指向的是子类的实例，目的就是为了让子类的实例去继承父类的属性方法。

因此`super(...arg)`在这里相当于`Parent.prototype.constructor.apply(this, arg)`。
```js
class Parent {
  constructor() {
    console.log(this)
  }
}

class Child extends Parent {
  constructor(...arg) {
    super(...arg)
  }
}

new Child() // Child { }
```

### super作为对象
* **在实例方法中，super指向父类的原型对象**。
```js
class A {
  constructor() {
    this.x = 1
  }
  method() {
    console.log("hello world")
  }
}
A.prototype.y = 2

class B extends A {
  constructor() {
    super()
  }
  print() {
    console.log(super.x) // undefined
    console.log(super.y) // 2
    super.method()       // 'hello world'
  }
}

const b = new B()
b.print()
```
上面代码中，**super**作为对象在实例方法`print`中调用，此时**super**指向的是父类A的原型对象。
1. `super.x`不可读取，因为`x`是在父类实例上定义的属性，而非在原型对象中。
1. `super.y`可以读取，因为`y`是在父类原型对象上定义的属性。
1. `super.method`可以调用，因为实例方法都存放在原型对象中.
```js
console.log("x" in A.prototype)      //false
console.log("y" in A.prototype)      //true
console.log("method" in A.prototype) //true
```
在子类实例方法中通过**super**调用父类的方法时，方法内部的`this`指向当前的子类实例。
```js
class A {
  method() {
    console.log(this.x)
  }
}

class B extends A {
  constructor() {
    super()
    this.x = 1
  }
  get m() {
    return super.method()
  }
}

const b = new B()
b.m  // 1
```
上面代码中，实例方法`method`通过**super**调用，其内部`this`指向当前的子类实例。

---

* **在静态方法中，super指向父类本身。**

在静态方法中的**super**可以调用父类的静态方法，因为他指向的是父类本身。\
在实例方法中的**super**可以调用父类的实例方法，因为他指向的是父类的原型对象。
```js
class A {
  static method() {
    console.log("static 静态方法")
  }
  method() {
    console.log("instance 实例方法")
  }
}

class B extends A {
  static method() {
    super.method() //调用父类静态方法
  }
  method() {
    super.method() //调用父类实例方法
  }
}

B.method()

const b = new B()
b.method()
```
在子类静态方法中通过**super**调用父类的方法时，方法内部的`this`指向子类本身，而非子类的实例。
```js
class A {
  static method() {
    console.log(this.x)
  }
}

class B extends A {
  static method() {
    super.method()
  }
}
B.x = 1

B.method() // 1
```

## Mixin模式
`Mixin`（混入）指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。下面代码将多个类的接口混入另一个类。
```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()) //拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin) //拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype) //拷贝原型属性
  }

  return Mix
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== "constructor" && key !== "prototype" && key !== "name") {
      let desc = Object.getOwnPropertyDescriptor(source, key) //获取属性描述符
      Object.defineProperty(target, key, desc) //操作对象属性
    }
  }
}
```

<Vssue />