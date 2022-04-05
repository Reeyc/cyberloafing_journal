# 高级类型

## 联合类型
指定了多种类型，变量可以取值为多种类型中的一种。
```ts
let val: string | number = 100
console.log(val) //100

val = "hello"
console.log(val) //hello
```

变量赋值之前：可以访问联合类型中共有的属性和方法。
```ts
function f11(name: string | number) {
  console.log(name.toString()) //OK 两者都有toString方法
  console.log(name.length)     //Error number类型没有length属性
}
```

变量赋值之后：ts会进行类型推论，将该变量的类型推导出来，此后变量只能访问改类型的属性和方法。
```ts
let str: string | number
str = 100
console.log(str.toFixed())
console.log(str.length) //Error, Property 'length' does not exist on type 'number'.
```

## 类型声明
可以使用`type`关键字声明一个类型。
```ts
type myStr = string

const val: myStr = "hello" //OK
const val2: myStr = 100    //Error
```

### 声明联合类型
```ts
type message = string | string[]

const val: message = "hello"    //OK
const val2: message = ["hello"] //OK
const val3: message = 100       //Error
```

### 字面量声明
赋值该类型的变量的值必须是几个值中的某一个。
```ts
type EventNames = "click" | "scroll" | "mousemove"

const val1: EventNames = "click" //OK
const val2: EventNames = 123     //Error
```

### 函数的类型声明
通过函数类型声明我们可以对函数的输入和返回类型进行校验，确保进入的是符合我们要求的函数。
```ts
//函数类型声明：校验参数和返回值的类型
type handleString = (params: string) => number

function fun(handle: handleString, str: string) {
  handle(str)
}

fun(function (str: string) {
  return str.length
}, "hello")
```

## 交叉类型
`|`符号声明联合类型，`&`符号用于声明交叉类型，将多个类型合并为一个类型。\
交叉类型一般都是`{ }`结构，两个基本的类型使用`&`符号是无法合并的，例如：
```ts
type mergeType = string & number //Error
```
这种语法是错误的，因为没有数据既是**string**类型又是**number**类型。正确的写法应该是声明一个要合并的类型，将它用一个`{ }`包裹起来：
```ts
type type1 = { x: string; } //声明一个string类型
type type2 = { y: number; } //声明一个number类型
type margeType = type1 & type2 //合并

const val: margeType = { x: "hello", y: 100 } //交叉类型都是对象结构

//连写
const val2: type1 & type2 = { x: "hello", y: 100 }
```

### 同名基础类型冲突
如果两个要合并的类型中，有同名属性的，且这两个属性的类型都不一致，则该类型会被声明为`never`类型。原理很简单，如下代码，两个类型合并，`x`既为**string**又为**number**，很显然这种数据类型是不存在的，所以`x`会被声明为`never`类型。
```ts
type type1 = { x: string; p: boolean } //x类型为string
type type2 = { x: number; q: boolean } //x类型为number
type margeType = type1 & type2 //合并

const val: margeType = { x: "hello", y: 100 } //Error: x为never类型
```

### 同名非基础类型冲突
上例中，两个冲突的类型都是基本类型，如果两个类型是非基本类型合并的话，不会造成冲突。
```ts
interface D { d: boolean }
interface E { e: string }
interface F { f: number }

//三个类型都有同名x属性，但是x的类型不是基本类型，而是接口类型，不会造成冲突
interface A { x: D }
interface B { x: E }
interface C { x: F }

type ABC = A & B & C

let abc: ABC = {
  x: {
    d: true,
    e: "semlinker",
    f: 666
  }
}

console.log(abc)
```

<Vssue />