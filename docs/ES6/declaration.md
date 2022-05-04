# 块级作用域
es5中有全局作用域和函数作用域的概念。es6新增了一个块级作用域。

块级作用域由一对`{ }`大括号形成。
* 块级作用域能访问到外部的变量。
* 外部无法访问块级作用域内的变量。
```js
let outer = 'outer'

{
  let inner = 'inner'
  console.log(outer) // 'outer'
}

console.log(inner) // Uncaught ReferenceError: inner is not defined
```

## let & const
除了`var`和`function`声明以外，es6还多了`let`和`const`声明。

* `var`声明不会形成块级作用域，而`let`和`const`声明会形成块级作用域。
```js
let global = 100
{
  var inner1 = 10
  let inner2 = 20
  const inner3 = 30
  //100 10 20 30 块级作用域能访问全局变量
  console.log(global, inner1, inner2, inner3)
  {
    //100 10 20 30 块级作用域能一级一级往外部访问变量
    console.log(global, inner1, inner2, inner3)
  }
}
//Error：全局作用域无法访问块级作用域变量 inner2 inner3报错
console.log(global, inner1, inner2, inner3) 
```
:::warning
* 对象字面量的`{ }`不是块级作用域。
* `if`、`for`、`函数参数`等表达式内的值属于**块级作用域内**的值。
:::

## 暂时性死区
**暂时性死区**TDZ，当程序在块级作用域进行实例化时，在此作用域中通过`let`、`const`声明的变量会先在作用域中被创建出来，但因此时还未进行词法绑定，所以是不能被访问的，如果访问就会抛出错误。因此，在这运行流程进入**作用域创建变量**，到**变量可以被访问**之间的这一段时间，就称之为**暂时性死区**。

而其中通过`var`、`function`的声明并不会出现暂时死区，因为其具有[预解析](/js/base/function.html#预解析)的特性。

```js
console.log(variable1) // undefined
console.log(variable2) // ƒ variable2( ){ }
console.log(variable3) // Uncaught ReferenceError: variable3 is not defined
console.log(variable4)

var variable1 = 1
function variable2( ){ }

let variable3 = 2
const variable4 = 3
```

#### let 和 const 的区别
* let用于声明变量
* const用于声明常量，const一声明必须有值，且后面不可修改值

```js
let test1 //Good
let test2 = 100
test2 = 200 //Good

const test3 //Error: 声明必须赋值
const test3 = 300
test3 = 400 //Error: 赋值后不可修改

const test4 = { key: 'value' }
test4.key = 'value2' //引用类型可修改属性
```
:::tip
`const`声明基本类型的值不可修改，引用类型可以修改属性，不可修改引用地址。
:::

<Vssue />