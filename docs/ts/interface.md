# 接口

接口的类型是灵活的，通过`Interface`关键字生成一个接口。将来只要有变量的类型是该接口的，那么这个变量的形状就必须跟接口形状一致。
```ts
/* 定义一个Person接口 */
interface Person { 
  name: string; 
  age: number; 
}

/* tom的类型是person接口 */
let tom: Person = { name: 'Tom', age: 25 };

/* Error: 多一个少一个都是不被允许的 */
let tom: Person = { name: 'Tom' };
let tom: Person = { name: 'Tom', age: 25, gender: "男" };
```

## 可选属性
在`:`的前面加一个`?`号，代表该属性是可选属性，也就是说该属性可有可无。
```ts
interface Person { 
  name: string; 
  age?: number; 
}

  /* 不会报错 */
let tom: Person = { name: 'Tom' };
```

## 只读属性
定义接口的时候，在属性名前面加关键字`readonly`。将来声明变量的时候，必须给该只读属性赋值，且只读属性仅可读，不可修改。
```ts
interface Person {
  readonly id: number
  name: string
  age?: number
}

const reeyc: Person = { id: 1, name: 'reeyc' } //good
const hello: Person = { name: 'reeyc' } //bad：声明对象的时候，没有给只读属性id赋值
hello.id = 2 //bad: id是只读属性
```

## 索引签名
索引签名分为**字符串**索引签名和**数字**索引签名，语法：
```ts
[propName: string]: xxx
// or
[propName: number]: xxx
```
定义了索引签名的字段，同时也代表了该接口可以拥有任意属性名的字段。
```ts
interface Person {
  [propName: string]: any
}

const tom: Person = {
  name: "tom",
  gender: "male",
  age: 20
}
```
一旦定义了索引签名，那么该接口内的所有属性和值都要按照该属性和值的规则来定义。
```ts
interface Person {
  age?: number //Error: 索引签名的值为boolean类型，此处为number
  [propName: string]: boolean
}

interface Person2 {
  [propName: number]: any
}

const Tom: Person = {
  name: "tom" //Error：Perosn 索引签名值的类型为boolean
}

const Jenny: Person2 = {
  100: "hello",
  gender: "female" //Error：Perosn2 索引签名属性的类型为number
}
```
:::tip
如果属性定义为**number**类型，那么数组也可以通过检测，因为数组本质上就是对象，他的索引就是**number**类型。
```ts
//number类型的属性，数组也可以通过
interface Person3 {
  0: string
  [propName: number]: string
}
let tom: Person3 = ["hello", "world"] //Good
```
:::

任意类型也可以跟联合类型相结合，那么该接口内的属性值都应是该联合类型的值。
```ts
interface Person {
  readonly id: number
  name: string
  age?: number
  [propName: string]: string | number
}
```

## 函数接口
一个接口内只能有一个函数，这种接口专门用于定义函数的形状，用于限制函数的参数、返回值。
```ts
interface funcType {
  (param1: number, param2: number): number
}
const sum: funcType = function (x: number, y: number): number {
  return x + y
}
console.log(sum(10, 20))
```
类似于函数类型声明
```ts
type funcType = (param1: number, param2: number) => number
const sum: funcType = function (x: number, y: number): number {
  return x + y
}
console.log(sum(10, 20))
```

## 混合接口
一个接口内既有函数又有属性。可以通过断言的特性将函数转为该接口类型，那么就可以给函数加属性了。
```ts
interface mixture {
  count: number
  (param1: number, param2: number): number
}

/* 断言改变类型，给fn加count属性 */
const fn = <mixture>function (x: number, y: number): number {
  return x + y
}
fn.count = 0

console.log(fn(10, 20))
```

## 接口合并
名称相同的两个接口，不会覆盖而是进行合并。
```ts
interface Point { x: number }
interface Point { y: number }

const point: Point = { x: 1, y: 2 }
```

## 接口继承

### 接口继承接口
接口之间通过`extends`关键字继承。可以同时继承多个，多个继承接口以逗号分开。
```ts
interface widthInterface { width: number }

interface heightInterface { height: number }

interface rectInterface extends widthInterface, heightInterface {
  color: string
}

const demo: rectInterface = {
  width: 50,
  height: 50,
  color: '#f00'
}
```

### 类实现接口
在TypeScript里面，可以明确的强制一个类去符合接口的某些契约。也就是让一个类去实现一个接口。
```ts
// 语法
class 类 implements 接口 {
  // 实现
}
```
::: tip 注意事项
* 接口里面有的成员，类必须要有，且类型保持一致（约束）。
* 接口只能约束类的公有成员，不能约束构造函数、私有成员、受保护的成员等等。
* 类可以自行扩展接口中没有的成员。
:::
```ts
interface Animal {
  eye: string
  nose: string
  ear: string
  mouth: string
  eat(arg: number): void
  sleep(arg: boolean): string
}

//类要完全实现接口的成员
class Dog implements Animal {
  eye: string = "eye"
  nose: string = "nose"
  ear: string = "ear"
  mouth: string = "mouth"
  eat(arg: number): void {}
  sleep(arg: boolean): string {
    return this.eye
  }

  play(): void {} //类可以自行扩展成员
}
```
### 接口继承类
接口可以把类中的成员抽象出来，而没有成员的具体实现。接口继承类的语法：
```ts
interface 接口 extends 类 // 语法
```
:::warning
接口同样会继承到类的私有成员和被保护成员。

如此一来就引发来一个问题，**私有成员**和**被保护成员**只允许基类和子类访问，被接口抽象出来后，如果一个新的类去实现该接口，就能访问到私有成员和被保护成员，这是不合理的。因此Typescript限定了这个接口的使用访问，也就是说：只能被这个**类**或者其**子类**来实现这个接口。
:::
```ts
class Animal {
  constructor(name: string, age: number, gender: string) {
    this.name = name
    this.age = age
    this.gender = gender
  }
  private name: string
  protected age: number
  gender: string
  sleep(): string {
    return `${this.name} is sleeping`
  }
}

interface Dog extends Animal {} //接口抽象类

//通过其子类去实现这个接口
class Keji extends Animal implements Dog {
  //自行扩展成员
  eat(): void {
    console.log(this.age)
  }
}

//实例对象可以访问父类的私有或受保护的成员
const wangCai = new Keji("wangCai", 3, "male")

//Keji {name: "wangCai", age: 3, gender: "male"}
console.log(wangCai)

wangCai.eat()
```