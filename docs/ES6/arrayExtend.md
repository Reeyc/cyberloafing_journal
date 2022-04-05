# 数组扩展

## 静态方法
**`Array.isArray(obj)`**： 检测对象是否为一个数组
* `obj`：需要检测的值。
* `return`：是则返回`true`，否则返回`false`。
```js
let list = [1, 2, 3];

let res =  Array.isArray(list)
console.log(res) // true
```
---

**`Array.from(arrayLike[, mapFn])`**：复制一个**真数组**、**伪数组**或者**集合**，将其转成一个新的数组返回
* `arrayLike`：被复制的原数据。
* `mapFn`：回调函数，该回调会遍历原数组，回调的参数就是原数组中的每个元素。
* `return`：新数组。

```js
let arr = [1, 2, 3]                     //真数组
let obj = { 0: 'a', 1: 'b', length: 2 } //伪数组

//转为一个真数组
let newArr1 = Array.from(arr) //[1,2,3]
let newArr2 = Array.from(obj) //['a','b']

//不影响原数组的引用
console.log(newArr1 === arr) //false
console.log(newArr2 === obj) //false

//参数二回调函数遍历
let newArr3 = Array.from(arr, function (e) {
  console.log(e) //1 2 3 循环遍历原数组
})

//ES5实现 伪数组转为真数组
obj = [].slice.call(obj)
```
---

**`Array.of(element0[, element1[, ...[, elementN]]])`**：将一个或多个数据合并成为一个新数组。
* `elementN`：需要合并的数据。
* `return`：新数组。
```js
Array.of(1, 'hello', {}, false) //[1, 'hello', {}, false]
```

## 实例方法

**`includes(valueToFind[, fromIndex])`**：判断数组中是否含有某些值
* `valueToFind`：检索的值。
* `fromIndex`：从此处索引开始检索。
* `return`：是则返回`true`，否则返回`false`。

```js
let arr = [10, 20, 30]
console.log(arr.includes(20)) //true

//ES5实现
console.log(arr.indexOf(20) !== -1) //true
```
---

**`fill(value[, start[, end]])`**：替换数组中的值 <Badge text="影响原数组" type="warning"/>
* `value`：指定替换成的值。
* `start`：被替换值的开始索引（包含）。
* `end`：被替换值的结束索引（不包含）。
* `return`：被影响后的数组。

```js
let arr = [1, 2, 3, 4, 5]
let arr2 = [100, 200, 300, 400, 500]
let arr3 = [111, 222, 333, 444, 555]

//全部替换
let newArr = arr.fill('7')
console.log(newArr) //[7,7,7,7,7]

//指定位置
let newArr2 = arr2.fill('7', 2, 4) //从索引2开始替换,替换到索引4(不含索引4)
console.log(newArr2) //[100,200,7,7,500] 索引2跟索引3被替换

//省略结束位置
let newArr3 = arr3.fill('7', 2) //从索引2开始替换,替换后面全部
console.log(newArr3) //[111,222,7,7,7]
```
---

**`flat([depth])`**：将多维数组转化为一维数组
* `depth`：指定转化的数组维度，默认一维数组。
* `return`：转化后的数组。

```js
let list = [1, 2, 3, [4, [5]]];

let res = list.flat(Infinity)
console.log(res) // [1, 2, 3, 4, 5]
```
---

**`find(callback)`**：查找某个元素是否存在数组中
* `callback`：在每个元素上执行的回调函数，回调函数有如下三个参数
   * element：当前遍历到的元素。
   * index：当前遍历到的索引。
   * array：可选，数组本身。
* `return`：存在返回 **该元素**，否则返回 **undefined**。

**`findIndex()`**：查找某个元素存在数组中的位置
* `callback`：在每个元素上执行的回调函数，回调函数参数同`find`
* `return`：存在返回 **该元素的索引**，否则返回 **-1**。

```js
let arr = [1, 2, 3, 4, 5]

let flag = arr.find(function (e, i, a) {
  return e > 1 //2, 3, 4, 5满足
})
console.log(flag) //返回第一个元素: 2

let flag2 = arr.findIndex(function (e, i, a) {
  return e > 1 //2, 3, 4, 5满足
})
console.log(flag2) //返回第一个元素索引: 1
```
更多数组ES6+ API请自行查阅

<Vssue />