# Set & Map
除了 [Symbol](/es6/symbol.html) 以外，**Set**和**Map**也是ES6新增的两种数据类型。

## Set
Set有点类似于数组，与数组的区别就是，Set是一种集合，里面不能含有相同的元素。这也是Set的特性，如果操作集合时，出现相同的元素，会操作失败，相同的元素不会被添加进去。

```js
new Set()
```
创建一个集合，不传参数，创建一个**空的Set集合**，传递一个数组，自动**将数组转为一个集合**。
```js
let set = new Set([1, 2, 3, 4, 5])
let set2 = new Set()

console.log(set, set2)

console.log(Object.prototype.toString.call(set)) //[object Set]
console.log(Object.prototype.toString.call(set2)) //[object Set]
```
* `size`：与数组的`length`属性一样，返回集合的长度。
```js
let set = new Set([1, 2, 3, 4, 5])
console.log(set.size) //5
```

* `has()`：查询集合里的元素。查询成功返回`true`，否则返回`false`。
```js
let set = new Set([1, 2, 3, 4, 5])
console.log(set.has(3)) //true
```

* `add()`：往集合里添加元素，默认添加到最后一个。返回一个新的集合。
```js
let set = new Set([1, 2, 3, 4, 5])
console.log(set.add(6)) //Set对象 {1, 2, 3, 4, 5, 6 }
```

* `delete()`：删除集合里指定的元素，删除成功返回`true`，否则返回`false`。
```js
let set = new Set([1, 2, 3, 4, 5])
console.log(set.delete(4)) //true
```

* `clear()`：清空集合，没有返回值。
```js
let set = new Set([1, 2, 3, 4, 5])

console.log(set.clear()) //返回undefined
console.log(set) //已清空
```

## WeakSet
`WeakSet`也是一种集合，只不过集合里面只能拥有对象这一种类型，跟`Set`的区别在于：
* WeakSet不支持其他类型的集合，只支持对象的集合。
* WeakSet没有`size`属性，也没有`clear()`方法。
* WeakSet无法被遍历。
* WeakSet的对象都是弱引用，也就是其他地方不再引用该对象，则垃圾回收机制就会回收该对象，而不管WeakSet是否引用。
```js
let weakList = new WeakSet()

weakList.add({}) // good
weakList.add(100) //bad

weakList.forEach(() => {}) //bad

weakList.clear() //bad
```

## Map
Map一种新的数据结构，类似于对象。对象属性名只能是字符串，而Map属性名可以是任意的数据类型。
```js
new Map()
```
创建一个Map结构数据。传递一个`iterator`接口数据，该数据里面的每个成员都是双元素的数组。
```js
let obj = {}
let arr = []
let map = new Map([
  ['Hello', 'ES6'], //以字符串作属性名
  [obj, 'Object'],  //以对象作属性名
  [arr, 'Array']    //以数组作属性名
])
```
:::tip
map和set本身也是`iterator`接口数据，它们也可以当做`new Map`的参数。
:::

**Map**的属性和方法与**Set**差不多，区别在于：
* Set用`add()`来添加元素，Map用`set()`来添加元素。
* Map可以用`get()`来获取某一个元素。
* Map操作的API都是传递**key值**，而Set传递**元素**。

其他的和Set一模一样。
```js
let obj = {}
let arr = []
let map = new Map([
  ['Hello', 'ES6'],  //以字符串作属性名
  [obj, 'isObject'], //以对象作属性名
  [arr, 'isArray']   //以数组作属性名
])

console.log(Object.prototype.toString.call(map)) //[object Map]

console.log(map.size) //3

map.set(100, 'isNumber') //添加一个属性
console.log(map)

console.log(map.get(obj)) //获取指定属性 isObject

console.log(map.delete('Hello')) //删除指定属性 true
console.log(map)

console.log(map.has(arr)) //查询一个属性 true

map.clear() //清空所有属性
```

## WeakMap
参考Set和weakSet的区别。

## 对象、数组、Map、Set
```js
let obj = {}
let arr = []
let set = new Set()
let map = new Map()
let item = { t: 'test' } //测试单元

//增
obj.t = 'test'
arr.push(item)
set.add(item)
map.set('t', 'test') //key值，value值

//查
console.log('t' in obj)
console.log(arr[0])
console.log(set.has(item)) //根据完整元素
console.log(map.has('t')) //根据key值

//改
obj.t = 'test2'
arr[0] = { t: 'test2' }
set[0] = { t: 'test2' }
map.set('t', 'test2')

//删
delete obj['t']
arr.splice(0, 1)
set.delete(item) //根据完整元素
map.delete('t') //根据key值
```
建议使用**Map**跟**Set**存储数据，将来放弃数组和对象，如果要求数据的唯一性就用Set，其他情况用Map。