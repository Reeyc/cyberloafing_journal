# 装饰器
在Ts中，装饰器仍然是一项实验性特性，未来可能有所改变。
在使用装饰器之前，需要在`tsconfig.json`的编译配置中开启以下配置项：
```ts
/* tsconfig.json */
experimentalDecorators: true
```

## 装饰器
装饰器是一种新的声明方式，作用于类、属性、方法、参数，语法为：`@decorate`。\
其本质上是一个函数，有固定的参数：
* **`target`**：...
* **`name`**：...
* **`descriptor`**：...

装饰器必须紧挨在被装饰的目标之前。装饰器会先于被修饰的目标之前执行，例如：
```ts
// 装饰器Getters
function Getters(target: Function): void {
  target.prototype.sayName = function (name: string): void {
    console.log(`hello ${this.name}！`)
  }
}

// 装饰Person类
@Getters
class Person {
  constructor(public name: string) {}
}

const tom: any = new Person("Tom")
tom.sayName()
```
上面代码中，装饰器**Getters**先于**Person**类先执行，扩展了该类的一个`sayName`方法。


## 装饰器工厂
由于装饰器本质上是一个函数，且本身有固定的参数，因此无法通过动态参数扩展该装饰器。这时候，就需要用到装饰器工厂。

装饰器工厂就是在装饰器外部包裹一层函数，函数可以接收参数，内部将该装饰器给返回。
:::warning
使用装饰器工厂时，需要以函数调用的方式使用，因为函数的返回值才是装饰器本身。
:::
```ts
function Getters(name: string) {
  return function (target: Function) {
    console.log(`hello ${name}！`)
  }
}

@Getters("Tom") //函数调用的方式，可传参数
class Person {}

new Person()
```

## 类装饰器
类装饰器只接收一个参数：
* **`target`**：被装饰的目标类，也就是指向类自己。

类装饰器可以返回一个新的类，这个返回的类将会覆盖掉被修饰的类。
```ts
function Getters(target: any): any {
  return class {
    public gender: string = "male"
    public birthday: any = "2020-01-01"
  }
}

@Getters
class Person {
  constructor(public name: string, public age: number) {}
}

const tom = new Person("Tom", 18)
console.log(tom) // { gender: "male", birthday: "2020-01-01" }
```

## 属性装饰器
属性装饰器接收两个参数：
* **`target`**：被装饰的目标类的原型对象。
* **`name`**：被装饰的属性名称。

如果属性装饰器返回一个值，那么会用这个值作为属性的属性描述符对象。
```ts
function propDecorator(target: any, name: string): any {
  const descriptor: PropertyDescriptor = {
    value: "newName",
    writable: true
  }
  return descriptor
}

class Person {
  @propDecorator
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

const tom: any = new Person("Tom", 18)

console.log(tom.name) //Tom
console.log(tom.__proto__.name) // newName
```
:::tip
属性描述符中的`value`属于原型上的属性，不会影响实例属性。
:::

## 方法装饰器
方法装饰器接收三个参数：
* **`target`**：如果是静态方法，则指向类本身，如果是实例方法，则指向类的原型对象
* **`name`**：被装饰方法的名称。
* **`descriptor`**：被装饰方法的属性修饰符。
```ts
function methodDecorator(target: any, name: string, descriptor: any): void {
  console.log(name, target)
}

class Person {
  private name: string
  constructor(name: string) {
    this.name = name
  }
  @methodDecorator
  static sayHello(): void {}
  @methodDecorator
  sayName(): void {}
}
```
跟属性装饰器同理，如果方法装饰器返回一个值，那么会用这个值作为方法的属性描述符对象。
```ts
function methodDecorator(flag: boolean): any {
  return function (target: any, name: string, descriptor: any): any {
    return {
      value: function () {
        if (flag) {
          console.log(this.name)
        } else {
          console.log("age of disappearance")
        }
      }
    }
  }
}

class Person {
  private name: string
  constructor(name: string) {
    this.name = name
  }
  @methodDecorator(false)
  sayName(): void {}
}

const tom = new Person("Tom")
tom.sayName()
```

## 参数装饰器
参数装饰器跟方法装饰器一样，接收三个参数：
* **`target`**：如果是静态方法，则指向类本身，如果是实例方法，则指向类的原型对象
* **`name`**：被装饰参数的方法名称。
* **`descriptor`**：参数的索引。
```ts
function required(target: any, propertName: string, index: number) {
  console.log(`修饰的是${propertName}的第${index + 1}个参数`)
}

class Info {
  name: string = "Tom"
  age: number = 18
  getInfo(placeholder: string, @required infoType: string): void {}
}

const info = new Info()
info.getInfo("hihi", "age") // 修饰的是getInfo的第2个参数
```

## 装饰器组合
一个目标上可以同时拥有多个装饰器或装饰器工厂。

执行顺序：从前往后执行所有的装饰器工厂，取出所有的装饰器，然后从后往前执行所有的装饰器。
```ts
function setProp1(): any {
  console.log("get setProp1")
  return function (target: Function): void {
    console.log("setProp1")
  }
}
function setProp2(): any {
  console.log("get setProp2")
  return function (target: Function): void {
    console.log("setProp2")
  }
}
function setProp3(target: Function): void {
  console.log("setProp3")
}

@setProp3
@setProp1()
@setProp2()
class Test {}

/**
 * Output:
 * get setProp1
 * get setProp2
 * setProp2
 * setProp1
 * setProp3
 */
```

<Vssue />