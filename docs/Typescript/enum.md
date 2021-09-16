# 枚举类型

枚举类型是ts为js扩展的一种类型，原生js是没有枚举类型的。枚举类型用`enum`关键字声明，用于表示固定的几个值。
```ts
//声明一个Test的枚举类型，枚举值为one、two、three
enum Test { one, two, three }

//该枚举类型的变量只能赋值到该类型里的枚举值
let val: Test
val = Test.one //Good
val = false //Error
val = "hello" //Error

val = 100 //Good
```

## 枚举值
枚举值必须有初始值，如果没有初始值，初始值默认为**number**类型。枚举值的值底层本质就是数值，从0开始递增。
```ts
enum Test { one, two, three }

const val1: Test = Test.one
const val2: Test = Test.two
const val3: Test = Test.three

console.log(val1, val2, val3) //0 1 2
```
可以在声明枚举类型的时候就指定枚举值的值，如果没有指定，那么枚举值的值从数值0开始递增。如果指定了，那么该指定的枚举值会影响后面的枚举值，后面的会在该基础上继续递增，不影响前面的枚举值。
```ts
enum Test { one, two = 5, three }

const val1: Test = Test.one
const val2: Test = Test.two
const val3: Test = Test.three

console.log(val1, val2, val3) //0 5 6
```

## 枚举值与数据
可以枚举值拿到对应的数字，也可以通过数字拿到对应的枚举值。
```ts
enum Test { one, two = 5, three = 8 }

console.log(Test.one, Test.two) //0 5
console.log(Test[0], Test[1]) //one two
```

## 枚举值数据的类型
枚举值数据的类型只能是**number**类型或者**string**类型。
```ts
enum Test {
  one = "hello",
  two = "world",
  three = "ts"
}
const test: Test = Test.one //'hello'

enum Test2 {
  one = "world", //如果某个枚举值非数值类型，下一项枚举值要补上数值类型，否则会影响后面递增
  two = 5,
  three
}
const test2: Test = Test.three //6

enum Test3 {
  one = {}, //报错，枚举值只能是number类型或者string类型
  two,
  three
}
```