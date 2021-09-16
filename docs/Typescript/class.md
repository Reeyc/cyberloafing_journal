# 类

ts中的类，以及实例属性、实例方法、镜头属性、静态方法。
```ts
class Person {
  name: string //实例属性
  age: number
  gender: string
  constructor(name: string, age: number, gender: string) {
    this.name = name
    this.age = age
    this.gender = gender
  }
  publicMethod(): void {
    console.log('实例方法') //实例方法
  }
  static staticProp: string = '静态属性' //静态属性（支持static关键字声明）
  static staticMethod(): void {
    console.log('静态方法') //静态方法
  }
}
```

## 实例属性/实例方法修饰符
TS为class里面的实例属性和实例方法添加了4种修饰符。
* **`public`（公开的）**：基类 / 子类 / 实例都能访问（默认修饰符）。
* **`protected`（受保护的）**：基类 / 子类能访问（只能在基类和子类内部访问）。
* **`private`（私有的）**：基类能访问（只能在基类内部访问）。
* **`readonly`（只读的）**：基类、子类、实例都能访问（只能访问，不可修改）。

:::warning
* 静态属性也可以使用修饰符，但是一般不会这么用，修饰符的优先级高于`static`关键字。
* `constructor`也是方法，也可以使用，一般用于`protected`，给子类生成实例，基类不做实例生成。
:::

```ts
class Person {
  public name: string    //公开的属性（默认就是public）
  protected age: number  //受保护的属性
  private gender: string //私有的属性
  readonly score: number //只读的属性
  constructor(name: string, age: number, gender: string, score: number) {
    this.name = name
    this.age = age
    this.gender = gender
    this.score = score
  }
  say(): void {
    console.log("基类：", this.name) //Good
    console.log("基类：", this.age) //Good
    console.log("基类：", this.gender) //Good
    console.log("基类：", this.score) //Good
  }
}

class Child extends Person {
  constructor(name: string, age: number, gender: string, score: number) {
    super(name, age, gender, score)
  }
  say(): void {
    console.log("子类：", this.name) //Good
    console.log("子类：", this.age) //Good
    console.log("子类：", this.gender) //Bad
    console.log("子类：", this.score) //Bad
  }
}

const p = new Person("zs", 18, "男", 100)
const c = new Child("ls", 16, "女", 200)

p.say()
c.say()

console.log("实例：", c.name) //Good
console.log("实例：", c.age) //Bad
console.log("实例：", c.gender) //Bad
console.log("实例：", c.score) //Bad

c.score = 300 //Bad
```
### 属性也可以在构造函数中初始化
```ts
class Person {
  constructor(public name: string, private gender: string) {}
  say() {
    console.log(`my gender is ${this.gender}`)
    console.log(`my name is ${this.name}`)
  }
}

const tom = new Person("Tom", "女")
tom.say()
```

## 抽象类
使用`abstract`关键字声明抽象类和抽象方法。
* 抽象方法只能存在于抽象类之中。
* 抽象类不允许被实例化，只能实例化实现了所有抽象方法的子类。
```ts
abstract class Person {
  constructor(public name: string) {}
  abstract say(words: string): void //抽象方法
}

class Developer extends Person {
  constructor(name: string) {
    super(name)
  }
  say(words: string): void {
    console.log(`${this.name} says ${words}`)
  }
}

const lolo = new Developer("lolo")
lolo.say("I love ts!") //lolo says I love ts!
```

### 多态
在父类中定义一个抽象方法，在多个子类中对这个方法有不同的实现。在程序运行时，会根据不同的对象，执行不同的操作，这样就实现了运行时绑定。

## 类方法重载
Ts支持函数重载，类方法本质上也是函数，因此类方法也支持重载。
```ts
class ProductService {
  getProducts(): void
  getProducts(id: number): void
  getProducts(id?: number) {
    if (typeof id === "number") {
      console.log(`获取id为 ${id} 的产品信息`)
    } else {
      console.log(`获取所有的产品信息`)
    }
  }
}

const productService = new ProductService()
productService.getProducts(666) // 获取id为 666 的产品信息
productService.getProducts() // 获取所有的产品信息
```