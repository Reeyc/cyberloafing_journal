# 泛型

泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。换言之，泛型就相当于一个动态的类型，由将来指定类型的时候决定。

通常用于解决代码没有提示，代码也不会报错，因为TS编译器不知道你的`any`是属于什么类型。

泛型语法：<类型>，泛型写在函数、接口、类的名称后面。

## 泛型函数
```ts
//定义一个泛型T，他的类型由传进来的时候决定
function createArray<T>(len: number = 5, val: T): Array<T> {
  return new Array(len).fill(val)
}

//传了string进去，泛型将会是string类型，而接下来的item将会有代码提示和报错提示
const res = createArray<string>(10, 'hello').map((item: string) => item.length)
```

## 泛型接口
```ts
interface Person<T> {
  (arg: T): T[]
}

const func: Person<string> = function (name: string) {
  return new Array(5).fill(name)
}

func("hello")
```

## 泛型类
类用于生成实例，给类传递泛型类型只能约束实例方法，所以类的静态成员不能使用泛型类型。
```ts
class Log<T> {
  // 静态成员不能引用类类型参数。
  // static run(value: T) {
  //   console.log(value)
  //   return value
  // }
  run(value: T) {
    console.log(value)
    return value
  }
}

//实例化时可以指定类型
let log1 = new Log<number>()
//约束实例方法
log1.run(11)

//实例化没有指定类型
let log2 = new Log()
//实例方法调用可以传递任意类型参数
log2.run(11)
log2.run("111")
```

常见泛型变量代表的意思
* T：表示类型（Type）
* K：表示对象中的键类型（Key）
* V：表示对象中的值类型（value）
* E：表示元素类型（Element）

## 泛型推导
对于泛型函数和泛型类，可以不传递类型进去，因为TS将会根据参数推导出泛型的类型。
```ts
function getData<T>(name: T): T[] {
  return new Array(5).fill(name)
}
//泛型函数调用，没有传递类型，ts会进行类型推导
getData(true)

class Person<T> {
  sayName(name: T): T {
    return name
  }
}
//泛型类调用，没有传递类型，ts会进行类型推导
const obj = new Person()
obj.sayName("Tom")
```

## 泛型默认值
泛型可以设置默认类型。
```ts
interface Log<T = string> {
  (arg: T): T
}

const myLog: Log = function <T>(value: T): T {
  return value
}

myLog("hello") //Good
myLog(666)     //Error 类型“number”的参数不能赋给类型“string”的参数。
```

## 多个泛型
泛型可同时存在多个。
```ts
function createArray<T, U>(len: T, val: U): Array<U> {
  return new Array(len).fill(val)
}

const res = createArray(5, "hello").map(item => item.length)
console.log(res)
```

## 泛型约束
泛型约束就是给泛型加接口条件，指定满足特定接口条件的类型才可通过检查。
```ts
interface LengthInterface {
  length: number
}

//定义一个泛型T，该泛型的类型必须满足LengthInterface接口条件
function createArray<T extends LengthInterface>(len: number, val: T): T[] {
  return new Array(len).fill(val)
}

createArray<string>(5, 'hello') //Good
createArray<number>(5, 'hello') //Error: number类型没有length属性，不满足接口条件
```

## 使用类型参数
一个泛型被另一个泛型所约束，这就叫在泛型中使用类型参数，也就是说被约束的泛型必须存在主泛型的key中。
语法：`<被约束的泛型 extends keyof 主泛型>`
```ts
//K必须存在T的key中
function getProps<T, K extends keyof T>(obj: T, key: K): any {
  return obj[key]
}

const obj = { a: 'a', b: 'b' }
getProps(obj, 'b') //Good
getProps(obj, 'c') //Error
```