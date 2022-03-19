# 类型断言

类型断言就是把一个类型强制转为另一个类型。类型断言会跳过编译器的检查，不进行类型检查从而不会报错。

例如我们明确知道某个`any`变量是**string**类型，那么我们可以把该变量断言为**string**类型，这样编辑器也会有对应的字符串API提示了。

断言有两种方式：推荐使用第二种方式，第一种方式有兼容性的问题，在jsx中使用会出现问题。
```ts
let str: any = 'hello world'
str = <string>str //<类型>变量
console.log(str.length)

let str2: any = 'hello world'
str2 as string //变量 as 类型
console.log(str2.length)
```

## 非空断言
将排除一个数据为了不等于`null`或者`undefined`类型。
```ts
//maybeString参数是联合类型，其类型可能是string或者undefined或者null
function myFunc(maybeString: string | undefined | null) {
  //Error: 不能赋值为string，因为maybeString有可能是null或者undefined
  const onlyString: string = maybeString

  //Good: 非空断言，将排除maybeString为null或者undefined
  const ignoreUndefinedAndNull: string = maybeString!
}
```
调用函数忽略时，忽略函数为`undefined`类型：
```ts
type NumGenerator = () => number

//numGenerator参数是联合类型，其类型可能是NumGenerator或者undefined
function myFunc(numGenerator: NumGenerator | undefined) {
  const num1 = numGenerator()  //Error： 不可直接调用，因为numGenerator可能是undefined
  const num2 = numGenerator!() //OK：    非空断言，将排除numGenerator为undefined类型
}

//类似JS的短路运算符
function myFunc(numGenerator: NumGenerator | undefined) {
  numGenerator && numGenerator()
}
```

## 确定赋值断言
当某个变量在赋值之前使用他，ts就会报错。
```ts
let num: number
console.log(num) //Error: 在num赋值之前使用了num

num = 100
```
使用确定赋值断言，在声明的变量后面加一个 ! 符号，告诉ts该变量在后面确定会被赋值，可以先使用。
```ts
let num!: number
console.log(num) //Good

num = 100
```