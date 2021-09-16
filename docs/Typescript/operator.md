# 操作符

## typeof
在TypeScript 中，`typeof`操作符可以用来获取一个变量声明或对象的类型。
```ts
interface Person {
  name: string
  age: number
}

const sem: Person = { name: "semlinker", age: 33 }

type Sem = typeof sem

function toArray(x: number): Array<number> {
  return [x]
}

type Func = typeof toArray
```
上述代码中，通过`typeof`操纵符获取到`sem`和`toArray`的类型，并赋值给类型变量`Sem`和`Func`，之后我们就可以使用`Sem`类型和`Func`类型了。
```ts
const tom: Sem = {
  name: "Tom",
  age: 20
}

const getScore: Func = function (x: number): number[] {
  return new Array(10).fill(x)
}
```

## keyof
`keyof`操作符可以用于获取某种类型的所有键，其返回类型是联合类型。
```ts
interface Person {
  name: string
  age: number
}

//字面量："name" | "age"
type K1 = keyof Person
const tom: K1 = "name"

//字面量："length" | "toString" | "pop" | "push" | "concat" | "join"
type K2 = keyof Person[]
const tom2: K2 = "length"

//索引签名：string | number
type K3 = keyof { [x: string]: Person }
const tom3: K3 = "hello"
```

## in
`in`既可以像JS中，用来判断某个属性是否存在于对象中，也可以用来遍历枚举类型和字面量类型。
```ts
//遍历枚举类型
enum Test {
  one,
  two,
  three
}
type Obj = {
  [k in Test]: any
}
const obj: Obj = {
  0: "hello",
  1: "world",
  2: 999
}

//遍历类型字面量
type Test2 = "one" | "two" | "three"
type Obj2 = {
  [k in Test2]: any
}
const obj2: Obj2 = {
  one: "hello",
  two: "world",
  three: 999
}

//判断属性prop是否存在对象obj3中
const obj3 = {
  prop: "hello world"
}
console.log("prop" in obj3) //true
```