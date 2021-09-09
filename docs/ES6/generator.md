# Generator
Generator函数是ES6推出的一种异步解决方案，从多个角度来理解Generator函数：
* **状态机**：函数内部封装了多个状态
* **迭代器生成机**：函数会返回一个迭代器对象，该对象会依次遍历内部的状态

Generator在形式上就是一个普通函数，它的书写形式和普通函数大致一样，区别在于Generator函数的`function`关键字后面要加一个`*`号，而且它内部有自己专属的`yield`语句
```js
function* demo() {
  console.log("Hello World")
  yield
}
let iterator = demo() //指针对象 Iterator接口
```
调用Generator函数，函数并不会执行，而是返回一个[Iterator迭代器对象](/ES6/iterator.html)。
```js
// Genarator函数作为对象方法
let obj = {
  demo: function*() { //常规
    yield
  },
  *demo2() { //简写
    yield
  }
}

let it = obj.demo(),
  it2 = obj.demo2()

// Genarator函数作为匿名函数
let it3 = (function*() {
  yield
})()
```

## 执行
迭代器对象含有Generator内部所有状态，每次调用该对象的`next`方法，就会执行函数，将指针指向下一个状态，也就是执行到`yield`语句处，遇到`return`就会结束函数的执行。

换句话说：Generator函数是分段执行的，`yield`是暂停的信号，调用`next`会继续执行，`return`是结束的信号。
```js
function* demo() {
  console.log("Hello")
  yield
  console.log("World")
  yield
  console.log("ES6")
  return
  console.log("Generator")
}

let iterator = demo()

iterator.next() // 'Hello'
iterator.next() // 'World'
iterator.next() // 'ES6'
iterator.next() // return结束
```

## 状态
每一个`yield`后面的表达式的值就是当前阶段的状态，该状态保存在 [Iterator](/ES6/iterator.html) 接口的信息对象的`value`属性中。\
`done`属性则是一个Boolean值，它代表状态的遍历是否结束，`false`表示未结束，`true`表示已结束，当遇到`return`或者没有`return`且执行到最后一个`yield`时，它变为`true`。
```js
function* demo(num) {
  yield num
  yield (y = num + 200)
  return y + 300
}

let iterator = demo(100)

console.log(iterator.next()) // { value: 100, done: false }
console.log(iterator.next()) // { value: 300, done: false }
console.log(iterator.next()) // { value: 600, done: true }
console.log(iterator.next()) // { value: undefined, done: true }
```
上面的demo函数内部一共有3个状态：100、300、600，这些状态会在每次执行时，保存到信息对象的`value`属性中。

---

:::tip
* `yield`表达式如果用于另一个表达式中，需要给`yield`表达式加上括号。
* `yield`表达式只能存在Generator函数中，否则会报错。
:::

## Generator.prototype.next
ES6规定，Generator返回的Iterator对象都是Generator函数的实例，也就是说可以使用Generator原型上的方法。

**Generator.prototype.next**方法用于执行函数，方法的参数可以替换掉`yield`表达式的值。

首次调用**next**方法执行到第一个`yield`语句时暂停，因此第一个`yield`表达式的值是无法通过**next**方法来操控的。而接下来每一次调用**next**方法，传递的参数都会替换掉上一个`yield`的值。

:::tip
语义来上讲，首次调用 **next** 方法算是用于启动迭代器对象的。
:::

```js
function* demo(num) {
  console.log(yield num)
  console.log(yield (y = num + 200))
  return (x = y + 300)
}

let iterator = demo(100)

iterator.next(555)  // 第一次调用，传递的参数无效，无法改变 yield 的值
iterator.next(666)  // 666
iterator.next(888)  // 888
iterator.next(1000) // 函数执行已结束
```
上面就是个很直观的例子，每次执行函数时，都将一个新的值注入`yield`的返回值，并打印出来：
1. 第一次调用**next** ，执行函数，并传递一个参数555，遇到`yield`时暂停，也就是说还未执行`yield`，所以无法替换第一个`yield`的值。
2. 第二次调用**next**，从上次`yield`处执行，并替换`yield`的值为666，打印出来666。
3. 第三次同理...

:::tip
**yield表达式的值** 和 **yield后面的表达式的值** 两者不是同一个东西。
* **yield表达式的值**跟`next`的参数挂钩，如没有参数，则值为`undefined`。
* **yield后面的表达式的值**代表的是当前阶段的状态，会被保存在Iterator的信息对象的`value`属性中。
:::

```js
function* demo() {
  console.log("Started")
  console.log('yield表达式的值为：', yield 100 + 200) // 100 + 200为当前阶段状态
  console.log('yield表达式的值为：', yield 300 + 400) // 300 + 400为当前阶段状态
  return "End"                                      // 'End'为当前阶段状态
}

let iterator = demo()

console.log('信息对象：',iterator.next())               // {value: 300, done: false}
console.log('信息对象：',iterator.next("First yield"))  // {value: 700, done: false}
console.log('信息对象：',iterator.next("Second yield")) // {value: "End", done: true}
console.log('信息对象：',iterator.next("Third yield"))  // {value: undefined, done: true}
```

### for...of
任意对象的`Symbol.iterator`方法，指向该对象的Iterator接口，也就是迭代器生成函数，用于生成迭代器对象。

而Generator就是迭代器生成函数，因此在给对象部署Iterator接口的时候，可以直接给`Symbol.iterator`属性赋值Generator函数。

`for...of`遍历Generator产生的迭代器对象，会自动调用**next**方法，所以不需要再加上**next**方法
```js
// Generator函数 (生产迭代器对象)
function* createIterator() {
  for (let Key of Object.keys(this)) {
    yield [Key, this[Key]]
  }
}

const obj = {
  key: "value",
  foo: "bar",
  [Symbol.iterator]: createIterator //给对象部署Iterator接口，指向Generator函数
}

// for...of循环默认调用了next()方法执行Generator函数
for (let [key, value] of obj) {
  console.log(key, value)
}

// 其他循环需要手动调用next()方法来执行Generator函数
const it = obj[Symbol.iterator]()
let result = it.next()
while (!result.done) {
  const [key, value] = result.value
  console.log(key, value)
  result = it.next()
}
```

## Generator.prototype.throw
**Generator.prototype.throw**方法用于在函数外部抛出错误，在函数内外都能捕获

必须在`try`代码块内抛出错误，在`catch`语句内捕获，如果没有`try/catch`语句，会直接报错，终止脚本。`catch`只会捕获一次错误，多出来的错误`catch`不会再执行，由下一个`catch`语句块捕获。
```js
function* demo() {
  try {
    yield
  } catch (e) {
    console.error(e) //Error: Catching internal errors!
  }
}

let it = demo()
it.next()

try {
  it.throw(new Error("Catching internal errors!"))
  it.throw(new Error("Catching external errors!"))
} catch (e) {
  console.error(e) //Error: Catching external errors!
}
```
如上，迭代器对象抛出两个错误，第一个错误被Generator函数内部`catch`语句捕获，再次发生错误时，`catch`语句已经执行过了，多出来那个错误被外部`catch`语句捕获。

`throw`方法被捕获后，会附带执行下一条`yield`表达式，相当于执行一次**next**方法。
```js
function* demo() {
  try {
    yield console.log("Hello")
  } catch (e) {
    console.error(e)
  }
  yield console.log("World") //被执行
}

let it = demo()
it.next()

try {
  it.throw(new Error("Catching internal errors!"))
  it.throw(new Error("Catching external errors!"))
} catch (e) {
  console.error(e)
}
```

:::warning
**Generator.prototype.throw**方法和全局的`throw`命令没有任何关系，后者只能被全局`catch`代码块捕获。\
如下代码中，data和data2都没有定义，是全局错误，只有第一条被全局的`catch`捕获。
```js
function* demo() {
  try {
    yield console.log("Hello")
  } catch (e) {
    console.log("generator catch：", e)
  }
  yield console.log("World")
}

let it = demo()
it.next()

try {
  it.throw(data)
  it.throw(data2)
} catch (e) {
  console.log("global catch：", e)
}
```
:::

## Generator.prototype.return
默认情况下，Generator函数当前的状态由**yield后面表达式的值**决定。\
**Generator.prototype.return**方法传递的参数可以强制指定`value`的值，如不传参数将是`undefined`。\
**return**方法还会终止Generator函数的循环，相当于执行了**return**语句
```js
function* demo() {
  yield "One"
  yield "Two"
  yield "Three"
}

let it = demo()
console.log(it.next())      // {value: One, done: false}
console.log(it.return(999)) // {value: 999, done: true}
console.log(it.next())      // {value: undefined, done: true}
```
上述代码中，第二次循环，信息对象的值应该是`{value: Two, done: false}`，**return**方法强制将其指定为999，并且结束循环，也就相当于执行了一次**return**语句。

## yield*
`yield*`表达式可以在Generator函数内执行另一个Generator函数。

Generator函数当前的状态由**yield后面表达式的值**决定，即使表达式的值是另一个Generator函数产生的迭代器对象，也是如此。如果想要保存的是另一个迭代器对象的内部值，就要用到`yield*`表达式，表示该值是一个迭代器对象，将其内部值保存。
```js
function* a() {
  yield "World"
}

function* b() {
  yield "Hello"
  yield a() //迭代器对象
}

for (let key of b()) {
  console.log(key)
}

// ==============================

function* c() {
  yield "World"
}

function* d() {
  yield "Hello"
  yield* a() //World
}

for (let key of d()) {
  console.log(key)
}
```
它的实现原理也就是`for...of`遍历了`yield*`后面的迭代器对象，可以得出，如果遍历`yield*`所在的Generator，就相当于一次性遍历了多个Generator函数。如下代码中，b1和b2的处理方式其实是一样的。
```js
function* a() {
  yield "World"
}

function* b1() {
  yield "Hello"
  yield* a()
}

function* b2() {
  yield "Hello"
  for (let key of a()) {
    yield key
  }
}
```

:::warning
如果被代理的迭代器对象内有**return**语句，此时用`for...of`遍历无法获取到**return**后的值，因为`for...of`在遇到**return**时，已经将`done`变为`true`，所以不会遍历到**return**的值。

解决方案就是用`yield`表达式的值来获取：
```js
function* a() {
  yield 100 + 200
  yield 300 + 400
  return "End"
}

function* b() {
  yield 900
  let returnValue = yield* a()
  yield returnValue
  yield 300
}

let c = b()
for (let key of c) {
  console.log(key) //900,300,700,End,300
}
```
:::

在`yield*`后面原生具有Iterator接口的数据，都会被`for...of`所遍历。例如：数组、字符串等等
```js
function* a() {
  yield* "abcd"
  yield* [10, 20, 30]
}

const it = a()
for (let key of it) {
  console.log(key) //a,b,c,d,10,20,30
}
```
**yield\*的应用**：`yield*` + `递归`使数组扁平化
```js
function* arrayFlat(element) {
  if (Array.isArray(element)) { //元素具有Iterator接口
    for (let i = 0; i < element.length; i++) {
      yield* arrayFlat(element[i])
    }
  } else {
    yield element
  }
}

const testArray = [100, [200, 300, [400]]]

// =============== 结果测试 ===============
// for...of
let iterator = arrayFlat(testArray)
for (let key of iterator) {
  console.log(key) //100,200,300,400
}

// 其他循环
let iterator2 = arrayFlat(testArray)
let info = iterator2.next()
while (!info.done) {
  console.log(info.value) //100,200,300,400
  info = iterator2.next()
}
// =============== End ==============

console.log([...arrayFlat(testArray)])
```

## Generator内的this
Generator返回的遍历器对象可以继承**Generator.prototype**属性上的方法。

但是Generator函数和普通的构造函数有区别：不能使用**New**关键字来调用Generator函数，因为Generator函数返回的是遍历器对象，而不是`this`，换句话说，Generator函数内部的`this`默认情况下不可用。
```js
function* A() {
  yield "World"
}

let it = new A() //Uncaught TypeError: A is not a constructor
```
可以自定义一个构造函数（解决`New`关键字问题），函数内部调用Generator函数，并改变Generator函数内部`this`指向为自己的原型对象（解决内部`this`问题）
```js
function Constructor(...arg) {
  return demo.apply(demo.prototype, arg)
}

function* demo(a, b, c) {
  yield (this.a = a)
  yield (this.b = b)
  yield (this.c = c)
  return c
}

let obj = new Constructor(100, 200, 300)

for (let key of obj) {
  console.log(key) //100,200,300
}

console.log(obj.a, obj.b, obj.c) //100,200,300
```