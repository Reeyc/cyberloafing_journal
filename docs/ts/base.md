# 基础类型

类型在TypeScript中的应用：
```ts
const str: string = "hello world"   //字符串
const num: number = 100             //数值
const bool: boolean = false         //布尔值
const undef: undefined = undefined  //undefined
const nul: null = null              //null
const obj: object = { }             //object

//##################################################################

const num: number = 10
const str: string = num //Error: str声明是string类型，却取值为numer类型
```

## Any类型
`any`属于ts中的顶级类型， ts编译器不会对any类型的数据做任何检查。换言之，any类型的数据本身可以取值为任意类型数据。
```ts
let val: any

val = "hello"    //OK
val = 1000       //OK
val = false      //OK
val = [ ]        //OK
val = { }        //OK
val = null       //OK
val = undefined  //OK
```
* `any`类型的数据可以赋值给任意类型。
```ts
let val: any

//任何数据也都可以赋值为any类型
const val1: unknown = val    //OK
const val2: string = val     //OK
const val3: number = val     //OK
const val4: boolean = val    //OK
```

* 可以访问`any`类型数据上的任何属性。
```ts
let value: any

value.foo.bar //OK
value.trim()  //OK
value()       //OK
new value()   //OK
value[0][1]   //OK
```

## Unknown类型
`Any`类型的数据可以执行任何操作，例如访问不存在的属性，调用不存在的函数，都不会经过ts的代码检查，这样就无法使用typescript提供的大量的保护机制。

为了解决这一缺陷，typescript3.0引入了`unknown`类型。`unknown`代表未知的类型。

和`any`一样，`unknown`同属于ts中的顶级类型，所以`unknown`类型的数据本身可以取值为任意类型。
```ts
let val: unknown

val = "hello"    //OK
val = 1000       //OK
val = false      //OK
val = [ ]        //OK
val = { }        //OK
val = null       //OK
val = undefined  //OK
```
* 但是`unknown`更严谨，因为是未知的类型，所以`unknown`类型只能赋值给`any`类型和`unknown`类型本身，不允许赋值为其他类型。
```ts
let val: unknown

const val1: unknown = val    //OK
const val2: any = val        //OK
const val3: string = val     //Error
const val4: number = val     //Error
const val5: boolean = val    //Error
```
* 不允许访问`unknown`类型数据上的属性，因为他是未知的。可以通过类型断言来访问。
```ts
let val: unknown = "hello"

console.log(val.length)              //Error

console.log((<string>val).length)    //OK
console.log((val as string).length)  //OK
```

---
**总结`any`和`unknown`的区别**：

两者都是顶级类型，但是`unknown`更加严格，不像`any`那样不做类型检查，反而`unknown`因为未知性质，不允许访问未知属性，不允许赋值给其他有明确类型的变量。

## Void类型
`void`跟`any`正好相反，表示没有类型，一般用于函数的返回值，表示该函数没有任何返回值。为了便于开发和维护，没有返回值的函数，建议都要加上`void`。
```ts
//1. void类型的函数，表示没有返回值
function hello(): void {
  console.log('hello world')
}

//2. void类型的变量，只能赋值给null/undefined
let test: void;
test = undefined //OK
test = null //OK
test = "hello" //Error
```

## Never类型
`never`表示永远不可能存在值的类型，一般用于抛出异常或者永不可能有返回值的函数。
```ts
function test(): never {
  throw new Error("error")
}

function test(): never {
  while(true) { }
}
```

## 类型推论
没有指定类型，也没有赋值，会被当成`any`类型。
```ts
let str //没指定类型，也没指定值，str为any类型
```
而没有指定类型，却赋值了，TypeScript会自动根据值推测出这个类型，如下两段代码其实是一样的。
```ts
let str = 'hello'
str = 100 //Type 'number' is not assignable to type 'string'.

let str: string = "hello" //ts把该变量推测为string类型
str = 100
```