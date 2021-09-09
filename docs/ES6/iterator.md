# Iterator
在JavaScript中，表示集合的数据结构，主要有`Array`和`Object`。ES6中又添加了`Set`和`Map`，我们还可以组合使用它们。

例如：Object中包含Array，Array中包含Map，像这样就需要一种统一的机制，来处理所有不同的数据结构

回顾以往遍历集合数据的方式，拿数组来举例子
* `for循环`是最原始的方式
```js
for (let i = 0; i < 5; i++) {
  console.log(i)
}
```
* 数组提供了更简洁的`forEach`方法
```js
['Hello', 'World'].forEach((e, i) => {
  console.log(e, i)
});
```
forEach方法也有缺点：无法使用`break`、`continue`、`return`等语句来控制流程
```js
['Hello', 'World'].forEach((e, i) => {
  if (e === 'Hello') return
  console.log(e, i); //World 1
});
```
* `for...in`可以使用`break`、`continue`来控制循环的流程，也可以遍历数组的键名。
```js
let = arr = ['Hello', 'world'];
for (let key in arr) {
  if (key == 0) continue;
  console.log(key, arr[key]); //1 World
}
```
但是遍历的键名是以字符形式存在的，例如"0" "1" "2"，而非数值类型。\
总之，`for...in`循环是为了遍历对象而设计的，不适用于数组。

## Iterator
Iterator是一个迭代器接口，它为不同的数据类型结构提供了统一的访问机制。换句话说，任何数据结构只要部署了`Iterator`接口，就可以完成遍历操作。

ES6中创造了一种新的遍历命令：`for...of`，Iterator主要供`for...of`消费。

### Iterator的遍历过程
1. 创建一个指针对象，对象含有内置方法`next`
   * **next()**：返回一个对象，对象中包含数据结构当前成员的信息，对象中有两个属性
      * **value**：当前成员的值
      * **done**：布尔值，代表是否遍历结束
2. 第一次调用`next()`，将指针指向数据结构的第一个成员
3. 第二次调用`next()`，指针指向下一个成员...以此类推，直到指向数据结构的结束位置
```js
let pointer = (data) => { 
  let nextIndex = 0;
  return { // 指针对象(依次指向成员)
    next() {
      if (nextIndex < data.length) {
        return { // 信息对象
          value: data[nextIndex++],
          done: false
        }
      } else {
        return { // 信息对象
          value: undefined,
          done: true
        }
      }
    }
  }
}

let iterator = pointer(['Hello', 'World']);

iterator.next(); // { value: 'Hello', fone: false }
iterator.next(); // { value: 'World', fone: false }
iterator.next(); // { value: undefined, fone: true }
```
每一次调用`next`，指针对象`iterator`的指针就指向数据结构的下一个成员，直到数据结构结束，`value`的值变成`undefined`，`done`变为`true`

## 默认Iterator接口
有一些数据默认已经部署了`Iterator`接口，而不需要我们手动去部署，这个接口部署在数据结构的`Symbol.iterator`属性上。换言之，只要某个数据拥有`Symbol.iterator`属性，那么这个数据就是可迭代的。当使用[某些特定的手段](/ES6/iterator.html#for-of)去迭代具有Iterator接口的数据时，默认就会调用一次该数据的`Symbol.iterator`属性。

:::tip
`Symbol.iterator`是一个表达式，返回的是一个独一无二的Symbol数据类型，因此只能放在`[ ]`内，而不能用`.`的方式
:::

默认具有Iterator接口的数据：Array、String、Map、Set、arguments、NodeList等等...
```js
foo();
function foo() {
  Array.prototype[Symbol.iterator]; // function(){...}
  String.prototype[Symbol.iterator]; // function(){...}
  Set.prototype[Symbol.iterator]; // function(){...}
  Map.prototype[Symbol.iterator]; // function(){...}
  arguments[Symbol.iterator]; // function(){...}
  NodeList.prototype[Symbol.iterator]; // function(){...}
  Object.prototype[Symbol.iterator]; //undefined
}
```
根据原型的特性，构造函数原型中存在的`Symbol.iterator`属性，实例化出来的对象也是可遍历的
```js
let arr = new Array('Hello', 'World');
for (let key of arr) {
  console.log(key); //'Hello' 'World'
}
```

## 部署Iterator接口
对象并没有`Symbol.iterator`属性，因为对象实际上是无序数据的集合，不确定哪些属性要先遍历，哪些后遍历，需要开发者自己确定，所以，如果想通过Iterator接口来遍历对象，就要为对象部署Iterator接口
```js
let obj = {
  key: 'value',
  foo: 'bar',
  data: ['hello', 'world'],
  fn() {},
  [Symbol.iterator]() {
    let arr = Object.values(this);
    let nextIndex = 0;
    return {
      next() {
        if (nextIndex < arr.length) {
          return {
            value: arr[nextIndex++],
            done: false
          };
        } else {
          return {
            value: undefined,
            done: true
          };
        }
      }
    };
  }
};
for (let key of obj) {
  console.log(key); //value, bar, [hello,world], function(){ }
}
```
伪数组和数组很类似，它同时具有数字键名和`length`属性，伪数据部署Iterator接口，可以直接调用Array的`Symbol.iterator`接口

```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: [][Symbol.iterator]
  //将数组的Symbol.iterator属性 赋值给 伪数组的Symbol.iterator 属性
}
for (let key of iterable) {
  console.log(key)
}
```

## for...of
ES6中推出了一种新的遍历命令：`for...of`。

它统一了所有集合数据结构的遍历机制，换句话说，只要部署了iterator接口的数据，都能被`for...of`所遍历，`for...of`实际上就相当于调用`Symbol.iterator`方法。

`for...of`对比`for`、`for...in`、`forEach`有明显的优势：
* 具有像`for...in`一样简洁的语法。
* 遍历数组的键名为数值类型。
* 可以使用`continue`和`break`控制循环。
* 可以遍历所有部署了iterator接口的数据类型。

```js
let obj = {
  start: [100, 200],
  end: [777, 888],
  [Symbol.iterator]() {
    const _this = this;
    let nextIndex = 0;
    let arr = _this.start.concat(_this.end);
    return {
      next() {
        if (nextIndex < arr.length) {
          return {
            value: arr[nextIndex++],
            done: false
          };
        } else {
          return {
            value: undefined,
            done: true
          };
        }
      }
    };
  }
};

for (let key of obj) {
  console.log(key); //100, 200, 777, 888
}

var iterator = obj[Symbol.iterator](); //指针对象
var result = iterator.next(); //信息对象
while (!result.done) { 
  console.log(result.value); //100,200,777,888
  result = iterator.next();
}
```

iterator提供了方便的遍历接口，除了`for...of`以外，以下场合默认也会调用iterator接口，也就是`Symbol.iterator()`
* 解构赋值
* 延展操作符
* yield*
* Array.from()
* Map() / Set()
* Promise.all() / Parmise.race()