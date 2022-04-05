# 函数扩展

## 参数默认值
在定义函数的时候，可以通过`形参 = 值`的方式给形参设置默认值。
```js
es6Fun()
es5Fun()

function es6Fun(param = 'default') {
  console.log(param) //default
}

//ES5的实现
function es5Fun(param) {
  param = param || 'default'
  console.log(param) //default
}
```
:::tip
函数的参数是根据顺序来排的，因此默认值参数最好放在最后一位参数，否则参数顺序会错乱。
:::

```js
//非最后参数设置默认值
function demo(a = 5, b) {
  return [a, b]
}
console.log(demo(3)) //[undefined, 3]

//最后参数默认值
function demo2(a, b = 5) {
  return [a, b]
}
console.log(demo2(3)) //[3, 5]
```
这种情况下可以通过`undefined`或者`null`来省略，`undefined`会触发参数的默认值，`null`不会触发默认值
```js
//当参数为undefined时，JS会使用默认参数
function demo3(a = 5, b) {
  return [a, b]
}
console.log(demo3(undefined, 3)) //[5, 3]

//参数为null时，则不会触发JS使用默认参数
function demo4(a = 5, b) {
  return [a, b]
}
console.log(demo4(null, 3)) //[null, 3]
```

## rest参数
rest参数就是延展操作符的运用，回顾ES6延展操作符`...`，作用展开拆分、操作剩余。而延展操作符也可以放在函数的形参之中，这种方式就叫做rest参数。

操作剩余：延展操作符必须在最后一位，将未匹配的参数封装为一个数组返回。
```js
function demo(param, ...param2) {
  console.log(param) //1
  console.log(param2) //[2,3,4]
}
demo(1, 2, 3, 4)
```
:::tip
rest参数的引入就是为了取代`arguments`参数，因此ES6的箭头函数中不再有`arguments`参数
:::

## 箭头函数
ES6的新增的箭头函数对于JS函数操作来说是革命性的更新，箭头函数简化了以往函数的定义方式。

ES5函数的`this`是执行时候确定的，也就是**动态绑定**的。\
而箭头函数的`this`是词法作用域，也就是定义是所在的对象，所以是**静态绑定**的。

> 语法：参数 => 操作

#### 箭头左边：函数的参数。
* 多个参数要用`( )`包括起来。
```js
const foo = param => console.log(param)
const foo2 = (param, param2) => console.log(param, param2)

foo(100)
foo2(100, 200)
```

#### 箭头右边：函数内部要做的操作，以及返回值。
* 多条语句要用`{ }`包括起来。
* 如果只有一条语句，会把该语句的返回值当作箭头函数的返回值。
```js
const foo = () => Boolean(1)
const foo2 = (param, param2) => {
  console.log(param)
  console.log(param2)
}

console.log(foo()) //true
foo2('hello', 'world')
```

1. 箭头函数没有`arguments`对象，应用reset参数代替。
```js
const foo = (...args) => {
  console.log(args) //[]
  console.log(arguments) //Error
}

foo()
```

2. 箭头函数本身并没有`this`，所谓的`this`是代码块之外的`this`。所以，箭头函数的`this`指向定义函数时，函数的所属的**那个对象的this**，而非调用时的对象。
```js
//箭头函数内没有this，其中的this指向定义时的外层代码块的this，而非调用时

function foo() {
  //在foo内定义，this其实是foo的this，而foo的this指向window，所以该箭头函数内this指向window
  let fun = () => console.log(this)
  fun()
}
foo()

const obj = {
  foo: function () {
    //在obj.foo内定义，所以该箭头函数内this指向obj
    let fun = () => console.log(this)
    fun()
  }
}
obj.foo()
```

3. 既然箭头函数本身没有`this`，所以也不能用`call`、`apply`、`bind`来改变`this`的指向。
```js
const foo = () => console.log(this)
foo.call({ }) //Window
```

4. 箭头函数不能当做构造函数来使用`new`调用，因为`this`是静态绑定的。
```js
const Foo = (age, gender) => {
  //没法改变实例的age、gender属性
  //因为箭头函数内的this是静态指向，也就是定义时就已经指向，而非调用时
  this.age = age
  this.gender = gender
}

const test = new Foo() //Foo is not a constructor
```

<Vssue />