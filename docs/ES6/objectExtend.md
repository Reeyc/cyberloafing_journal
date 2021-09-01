# 对象扩展

## 简洁表达式
顾名思义，就是简写。
* 属性简写：在ES6中，对象的属性如果跟变量名一致，可以直接使用变量代替简写。

对象的属性都是字符串，实现原理也就是调用该变量的`toString`方法
```js
const key = 'value'
console.log(key.toString()) //'key'

const obj = { key: 100 }
const obj2 = { key } //简写

console.log(obj, obj2)
```
:::warning
如果变量名是对象的话，则属性名会是`[object Object]`，关于这一点，将来可以使用`Map`结构来取代对象。
:::

* 方法简写：不是用变量代替，而是纯粹的简写，省略`:function`。
```js
const obj = {
  method: function () {}, //ES5声明对象方法
  method() {} //ES6对象方法简写
}
```

## 属性表达式
在ES6之前，对象的属性名都是写固定的，不可修改变化，要是修改也是修改属性值。\
而在ES6中，对象的属性名是可变的，可以用`[变量]`代替。
```js
let key = 'hello'
let obj = {
  [key]: 'world' //变量代替属性名
}

console.log(obj) //{ hello: 'world' }
```

## 静态方法
**`Object.is(value1, value2)`**：判断两个值是否全等，跟`===`全等运算符是一样的。
* `value1`：被比较的第一个值
* `value2`：被比较的第二个值
* `return`：全等则返回`true`，否则返回`false`

```js
console.log(Object.is('hello', 'hello')) //true
console.log(Object.is({}, {})) //false, 比较引用地址
```
---

**`Object.assign(target, ...sources)`**：浅拷贝对象，将一些对象的属性一个个复制给一个对象，实现对象的浅拷贝。
* `target`：需要复制的对象。
* `sources`：被复制的对象。

:::tip
如果被复制的对象中，有属性相同，则后面被复制的会覆盖前面被复制的。
:::

```js
let obj = {}
let obj1 = { name: 'hello' }
let obj2 = { name: 'hi', age: 18 } //hi覆盖hello

Object.assign(obj, obj1, obj2)

console.log(obj) //{ name:'hi', age:18 }
```
---


**`Object.entries(obj)`**：把一个对象的键值以**数组**的形式遍历出来，结果和`for...in`一致，但不会遍历原型属性。
* `obj`：可以返回**可枚举属性**的对象。
* `return`：返回对象可枚举属性的键值对数组。

```js
let obj = { name: 1, age: 2 }
console.log(Object.entries(obj)) //[[name, 1],[age, 2]]
```
字符串和数组也是可枚举的，其索引和元素会被当成键值：
```js
let arr = [1, 2, 3, 4, 5]
let str = 'hello'

console.log(Object.entries(arr)) //[['0', 1], ['1', 2], ['2', 3], ['3', 4], ['4', 5]]
console.log(Object.entries(str)) //[['0', 'h'], ['1', 'e'], ['2', 'l'], ['3', 'l'], ['4', 'o']
```

数值、布尔值不可枚举
```js
console.log(Object.entries(100)) //[]
console.log(Object.entries(true)) //[]
```
---

#### 枚举对象 & 数组
`let...of`遍历器可以遍历一个数组，而`Object.entries`的返回值是一个数组，因此可以借此`Object.entries`+**解构赋值**来遍历对象。
```js
let obj = { name: 'hello', age: 'ES6' }
let arr = [1, 2, 3, 4, 5]

for (let [k, v] of Object.entries(obj)) {
  console.log(k, v)
  //k === name age
  //v === hello ES6
}

for (let [k, v] of Object.entries(arr)) {
  console.log(k, v)
  //k === 0 1 2 3 4
  //v === 100 200 300 400 500
}
```