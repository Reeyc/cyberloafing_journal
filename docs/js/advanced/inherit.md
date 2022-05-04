# 继承
继承其实是一种关系，类（父级构造函数）与类（子级构造函数）之间的关系。继承的作用是为了代码重用和数据共享。

要求创建出如下两种对象：
* 人类：年龄、吃饭、睡觉、
* 学生：年龄、吃饭、睡觉、成绩

通过观察发现：学生有三种属性和人的属性一样，可以通过创建两个类，给其中一个类（父）的原型添加属性方法，另外一个类（子）的原型指向这个父类，这就是继承的关系

## 通过原型实现继承
```js
//人的构造函数(父类)
function Person(name, age, sex) {
  this.name = name
  this.age = age
  this.sex = sex
}
Person.prototype.eat = function() {
  console.log("吃饭")
}
Person.prototype.sleep = function() {
  console.log("睡觉")
}

var per = new Person("人", 20, "男")     // 创建一个人
per.eat()                               // 让人吃饭
per.sleep()                             // 让人睡觉

//学生的构造函数(子类)
function Student(score) {
  //添加属性(无法继承的属性,父级类没有)
  this.score = score
}

//关键的一步：把子级类的原型指向改变为父级类的实例对象的原型
Student.prototype = new Person("学生", 16, "男")

var stu = new Student(100)   // 创建一个学生
stu.eat()                    // 让学生吃饭
stu.sleep()                  // 让学生睡觉

//可以自己扩展原型方法
Student.prototype.study = function() {
  console.log("学习")
}
stu.study()                  //让学生学习
```
总结：通过继承的方式，让子类继承父类的属性跟方法，在创建实例对象时，即使子级类没有这些属性跟方法也没关系，因为父级类有，会继承过来，这样就节省了大量的空间，以及避免了大量不必要的代码

:::warning
通过原型实现继承有一个缺陷：改变子类的原型指向的同时，继承过来的子类属性直接**初始化**了，如果通过子类创建多个实例对象，那么这些实例对象的属性值都会是一样的。
:::

```js
function Person(name, age, sex) {
  this.name = name
  this.age = age
  this.sex = sex
}
Person.prototype.eat = function() {
  console.log("吃饭")
}

function Student(score) {
  this.score = score
}

//实现继承的同时，直接初始化了属性值
Student.prototype = new Person("小明", 18, "男")

var stu1 = new Student(100)
var stu2 = new Student(120)
var stu3 = new Student(140)

console.log(stu1.name, stu1.age) // 小明 18
console.log(stu2.name, stu2.age) // 小明 18
console.log(stu3.name, stu3.age) // 小明 18
```

## 通过构造函数实现继承
在子类中调用父类的`call`方法，传递属性参数，强行父类的`this`改变为子类的实例对象。
```js
function Person(name, age, sex) {
  this.name = name
  this.age = age
  this.sex = sex
}
Person.prototype.eat = function() {
  console.log("吃饭")
}

function Student(name, age, sex, score) {
  //直接在子级类中调用父级类，并强制把父级类中的this改为子级类的实例对象
  Person.call(this, name, age, sex)
  this.score = score
}

//通过这种方式实现继承不再初始化属性了
var stu1 = new Student("小红", 18, "女", 100)
var stu2 = new Student("小蓝", 19, "男", 90)
var stu3 = new Student("小绿", 20, "男", 80)

console.log(stu1.name, stu1.age) // 小红 18
console.log(stu2.name, stu2.age) // 小蓝 19
console.log(stu3.name, stu3.age) // 小绿 20
```

:::warning
这种构造函数实现继承也有缺陷：由于不改变原形指向，子类跟子类的实例对象无法访问父级类的原型方法。
:::

接上段代码：
```js
//...

stu1.eat() //Error: 没有继承父类的原型
```

## 组合继承

* 改变原型指向实现继承：属性值固定的问题。
* 借用构造函数实现继承：无法访问父级类原型方法。

两种方式各有缺陷，既然如此，把两种方式结合起来就可以搞定问题了
```js
function Person(name, age, sex) {
  this.name = name
  this.age = age
  this.sex = sex
}
Person.prototype.eat = function() {
  console.log("吃饭")
}

function Student(name, age, sex, score) {
  //解决属性值固定问题
  Person.call(this, name, age, sex)
  this.score = score
}

//解决访问父级类原型方法问题
Student.prototype = new Person() //不传值
Student.prototype.sleep = function() {
  console.log("睡觉")
}

var stu1 = new Student("小红", 18, "女", 100)
var stu2 = new Student("小蓝", 19, "男", 90)
var stu3 = new Student("小绿", 20, "男", 80)

console.log(stu1.name, stu1.age)
console.log(stu2.name, stu2.age)
console.log(stu3.name, stu3.age)

stu1.eat()
stu1.sleep()

```

<Vssue />