# 解构赋值
从数组或者对象中提取出值，并给变量赋值。

## 数组解构
将数组解构赋值给变量
```js
//按顺序右边数组分别赋值给左边变量a,b
let [a, b] = [1, 2]
console.log(a, b) //1, 2

let arr = [100, 200]
let [c, d] = arr
console.log(c, d) //100, 200
```

## 对象解构
将对象解构赋值给变量

```js
//按顺序右边对象分别将属性赋值给左边变量
let { a, b } = { a: 1, b: 2 }
console.log(a, b) //1 2

let obj = { c: 888, d: 999 }
let { c, e } = obj 
console.log(c, e) //888 undeinfed
```
:::warning
变量跟属性名要一致
:::

## 解构默认值
在赋值时，左边变量可以通过`=`号设置默认值。数组按顺序匹配，没有匹配到的变量，将会是`undefined`，而成功匹配的，则会覆盖默认值。
```js
let [a, b, c = 300] = [100, 200]
let { d, e, f = 999 } = { d: 777, e: 888 }
console.log(a, b, c, d, e, f) //100 200 300 777 888 999

let [g, h, i] = [666, 333]
console.log(g, h, i) //666 333 undefined

let { j, k, l = 3 } = { j: 7, k: 8, l: 9 }
console.log(j, k, l) //7 8 9
```

## 解构重命名
在赋值时，左边变量可以通过`:`号重命名。\
重命名只用于对象解构赋值，数组用不上，数组只有元素，没有属性名。 
```js
let { a: q, b: w, c: e } = { a: 100, b: 200, c: 300 }
console.log(q, w, e) //100 200 300
```

## 省略解构
在赋值时，左边一个`,`号代表一个变量，想给某变量赋指定的值，可以用`,`号跳跃。
```js
let [, , num3] = [100, 200, 300]
console.log(num3) //300
```
---

#### 解构应用场景
* 方便变量交换
```js
let a = 100;
let b = 200;
[a, b] = [b, a]
console.log(a, b) //200 100
```
* 接收函数指定返回值
```js
function test() {
  return [1, 2, 3, 4, 5]
}

let [, , , , c] = test()
console.log(c) //5
```