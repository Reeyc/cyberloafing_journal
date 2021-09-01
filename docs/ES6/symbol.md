# Symbol
ES6新增的一种数据类型：`Symbol`，代表着一种唯一的数据类型。

`Symbol`是一个全局API，调用`Symbol`时，返回一个独一无二的数据。
```js
let a = Symbol()
let b = Symbol()

console.log(Object.prototype.toString.call(a)) //[object Symbol]
console.log(Object.prototype.toString.call(b)) //[object Symbol]

console.log(a === b) //false
```
`Symbol`接受一个字符串**key**值做参数，该**key**值用于对该`Symbol`的描述。
:::tip
如果传递的是一个对象，则会调用该对象的`toString`方法转为字符串，再作描述。
:::
```js
let a = Symbol('hello')
console.log(a) //Symbol(hello)
```

## Symbol.for()
传递一个**key值**，`Symbol`会根据该**key值**，在全局里搜索，并以`Symbol`类型返回这个找到的数据。如果找不到，则返回一个**全新的Symbol数据**。
```js
let str = 'hello'
let mySymbol = Symbol.for(str) //str已存在

console.log(mySymbol)        //Symbol(hello)
console.log(typeof mySymbol) //symbol

let a = Symbol.for('aaa') //找不到，创建新的symbol(aaa)
let b = Symbol.for('aaa') //已存在，返回symbol(aaa)

console.log(a === b) //true
```

## Symbol.keyFor()
返回使用了`Symbol.key`返回的symbol数据的key值
```js
let a = Symbol.for('aaa')
let b = Symbol.for('aaa')

console.log(a === b) //true

console.log(Symbol.keyFor(a)) //返回key值：aaa
console.log(Symbol.keyFor(b)) //返回key值：aaa
```

## 应用场景
例如：在开发中，经常会遇到对象的属性名重复的问题，从而造成属性值覆盖。
```js
let a = 'abc'
let obj = { [a]: 'hello', abc: 'es6' }

console.log(obj) //{ 'abc' : 'es6' }
```
这时候就需要用到**Symbol数据**了，**Symbol数据**是独一无二的，不同于其他数据，用`Symbol`可避免属性重复问题。
```js
let abc = Symbol.for('abc')
let obj = { abc: 'es6', [abc]: 'hello' }

console.log(obj) //{ 'abc': 'es6', Symbol(abc) :'hello' }
```

## Symbol的问题
由于`Symbol`是全新的数据类型，用`Symbol`数据做对象属性的话，`for...in`或者`for...of`的方式是无法遍历出来的，只能遍历以往的数据类型。

* **Object.getOwnPropertySymbols(obj)**
   * `obj`：需要遍历Symbol数据的对象。
   * `return`：一个数组，该数组里仅仅包含了对象的Symbol属性信息，不包含以往的数据类型。
```js
let abc = Symbol.for('abc')
let obj = { abc: 'es6', [abc]: 'hello' }

Object.getOwnPropertySymbols(obj).forEach(key => {
  console.log(key, obj[key]) //Symbol(abc) 'hello'
})
```

* **Reflect.ownKeys(target)**
   * `target`：需要遍历Symbol数据的对象。
   * `return`：一个数组，该数组里包含了对象的所有属性信息，包括Symbol信息。
```js
let abc = Symbol.for('abc')
let obj = { abc: 'es6', [abc]: 'hello' }

Reflect.ownKeys(obj).forEach(key => {
  console.log(key, obj[key]) //abc es6   Symbol(abc) 'hello'
})
```
