# 函数

## 完整函数格式
在TS中函数的完整格式应由两部分组成，参考如下方式：
```ts
//1. 函数声明，声明函数类型，可限制参数和返回值
type retNumber = (a: number, b: number) => number

let func: retNumber

//2. 函数实现，具体函数操作
func = function (x, y) {
  return x + y
}

//也可以连写
let func2: (a: number, b: number) => number = function (x, y) {
  return x + y
}

func(10, 20)        //OK
func2(10, 'hello')  //Error
```
或者也可以像JS中的直接声明函数：
```ts
//参数x为number类型，参数y为number类型，返回值为number类型
function getNumber(x: number, y: number): number {
  return x + y
}
getNumber(10, 20)
```

## 可选参数
TS中的可选参数和接口中的可选属性是一样的，在参数后面加一个`?`号，代表该参数可有可无。
* 可选参数可以有**多个**。
* 可选参数必须在**最后**（顺序不可乱，跟JS中的剩余参数是同一个道理）。
```ts
function test(x: number, y?: number, z?: number): number {
  return x + (y || 0) + (z || 0)
}

console.log(test(10))
console.log(test(10, 20))
console.log(test(10, 20, 30))
```

## 默认参数
跟JS中的默认参数一样。
```ts
function test(x: number, y: number = 10): number {
  return x + y
}

console.log(test(10))
console.log(test(10, 20))
```

## 剩余参数
跟JS中的剩余参数一样，将剩余的参数封装到一个数组中返回。
```ts
function test(x: number, ...y: string[]) {
  console.log(y)
}

test(10) //[]
test(10, '20', '30', '40') // ["20", "30", "40"]
```

## 函数重载
两个功能相同的函数，只是根据不同的参数做出不同的处理，这时候没必要写两个函数，可以使用函数重载来实现。

函数重载要注意顺序的问题，需要声明两个不同参数返回值的函数在上面，在下面接上函数的实现方式。
```ts
function getArray(x: number): number[]
function getArray(y: string): string[]
function getArray(val: any): any[] {
  if (typeof val === 'string') {
    return val.split('')
  } else {
    const result = []
    for (let i = 0; i < val; i++) {
      result.push(i)
    }
    return result
  }
}

console.log(getArray('hello world'))
console.log(getArray(10))
```

<Vssue />