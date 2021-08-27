# 数组
数组也是对象的一种，也能用来存储数据，对象用于储存**无序数据**，数组用于储存**有序数组**，用数组来存储数据，性能更好。\
对象中的每个数据都有自己的属性名跟属性值，而数组中的数据不叫属性，叫作**元素**或者**下标**，数组中的每个元素都有自己的索引跟值。\
元素跟属性值一样，可以是任意类型的数据。

### 创建数组
* 使用构造函数
```js
var arr = new Array();

//参数接收的不是元素，而是返回的数组的长度
var arr2 = new Array(10)
```
上例中，arr2为一个长度为10的数组，里面包含10个空元素

* 使用字面量
```js
var arr = []
```

## 索引
从0开始的整数（包括0）就是索引。\
对象中使用**字符串**来作为属性名，对象中的属性可以用.号或者[ ]号创建。\
而数组中是使用**数字**来作为索引的，数组中的元素只能用[ ]号来创建。
```js
var obj = {}; //创建一个对象
obj.name = "zs"; // 往对象中添加属性

var arr = []; //创建一个数组
arr[0] = "ls"; // 往数组中添加元素

arr[1] = 100; //往数组中添加多个元素
arr[2] = true;
arr[3] = undefined;
arr[4] = null;
```
读取数组中的元素：`数组[索引]`
::: tip
如果读取数组中不存在的索引，将返回`undefined`
:::

## length
数组的**length属性**保存了数组的长度（元素的个数）。
```js
var arr = [];
arr[0] = "zs";
arr[1] = 100;

console.log(arr.length); //2
```
**length属性**可以获取到连续性的索引的元素，但是对于非连续性的索引，**length**会获取到最大的那个索引+1，所以尽量不要写非连续性的索引。
```js
var arr = [];
arr[0] = "zs";
arr[1] = 100;
arr[99] = "Hello"; //添加索引99

console.log(arr.length);  //长度100
```
操作**length属性**不仅可以查看数组的长度，还可以修改数组的长度（删除元素）。
```js
数组.lenght = 元素的个数;
```
如果将`length`设置大于原长度，多余的部分将被空出来
```js
var arr = [];
arr[0] = "zs";
arr[1] = 100;
arr.length = 10; //将数组的长度设置为10, 多余的部分将会空出来

console.log(arr); 
console.log(arr.length);
```
同理，如果将`length`设置小于原长度，多出来的元素将被删除
```js
var arr = [];
arr[0] = "zs";
arr[1] = 100;
arr[2] = true; //这条元素会被删除
arr.length = 2; //将数组的长度设置为2

console.log(arr); 
console.log(arr.length); 
```
把索引改成`数组.length`，意思是在最大的索引上+1，这样就能够保证每次添加的索引都是连续性的
```js
var arr = [];
arr[0] = "zs"; 
arr[1] = 100;
arr[2] = true;
arr[arr.length] = 'Hello'; // 第4个, 最大索引+1[3+1]
arr[arr.length] = 'nihao'; // 第5个, 最大索引+1[4+1]
arr[arr.length] = 'abcd'; // 第6个, 最大索引+1[5+1]

console.log(arr); 
```

## 遍历数组
遍历就是读取数组中的所有元素。利用**for循环**，将一个数组遍历：
* 将条件表达式中循环的次数跟数组的长度一致。
* 把for的**初始化变量**当做数组的索引，每循环一次，就可以通过`数组[变量]`拿到当前的元素。
* 把条件表达式的最大值改成`数组.length`（最大索引+1），将会循环到数组的最大索引才停止。
```js
var arr = ['hello', true, 100, null];

for (var i = 0; i < arr.length; i++) {
  console.log(arr[i);
}
```

## 数组常用的API

| 方法名        | 作用                                        |
| ------------ | ------------------------------------------ |
| push         | 向后加，影响原数组，返回新长度                  |
| pop          | 向后删，影响原数组，返回被删的元素               |
| unshift      | 向前加，影响原数组，返回新长度                  |
| shift        | 向前删，影响原数组，返回被删的元素               |
| slice        | 截取，不影响原数组，返回新数组（截取的元素）       |
| splice       | 删除，影响原数组，返回新数组（被删的元素）        |
| concat       | 合并数组，不影响原数组，返回新数组（合并后的数组）  |
| join         | 转字符串，不影响原数组，返回字符串               |
| reverse      | 倒序，影响原数组，返回原数组                    |
| sort         | 按照Unicode编码排序，影响原数组，返回原数组      |

::: tip
此处不包含ES6+的API
:::

```js
var arr = ['hello', 'world', 'hello', 'js']

arr.push(99) //5
arr.pop() //99

arr.unshift(55) //5
arr.shift() //55

arr.slice(0, 2) //['hello', 'world']
arr.splice(3, 1) //['js']

arr.concat(['world'], 99) //['hello', 'world', 'hello', 'world', 99]

arr.join('-') //hello-world-hello

arr.reverse() //['hello', 'world', 'hello']

var arr2 = [100, 200, 300]
arr2.sort(function (a, b) {
  return b - a 
}) //[300, 200, 100]
```

## 真数组 & 伪数组
真数组跟伪数组有很多共同点，比如：都有索引，或者称作数字属性，都有`length属性`，都可以被`for循环`遍历等等...
```js
var arr = [10, 20, 30] //真数组
var obj = { 0: 10, 1: 20, 2: 30, length: 3 } //对象可以看作伪数组

console.log(arr[0]) //10
console.log(obj[0]) //10

console.log(arr.length) //3
console.log(obj.length) //3

for (var i = 0; i < arr.length; i++) {
  console.log(arr[i])
}

for (var i = 0; i < obj.length; i++) {
  console.log(obj[i])
}
```
在JS中，有很多内置的伪数组对象。比如：`Arguments`、`HTMLCollection`、`NodeList`等等...\
真数组和伪数组的区别：
* 真数组的长度是可变的。伪数组的长度是不可变的。
```js
var arr = [10, 20, 30] //真数组
var obj = { 0: 10, 1: 20, 2: 30, length: 3 } //伪数组

arr[3] = 40 //真数组添加元素，改变长度
obj[3] = 40 //伪数组添加元素，不改变长度

console.log(arr.length) //4
console.log(obj.length) //3
```
* 真数组能够使用数组的方法。伪数组不能使用数组的方法。
```js
var arr = [10, 20, 30] //真数组
var obj = { 0: 10, 1: 20, 2: 30, length: 3 } //伪数组

arr.splice(1, 1) //[10, 30]
obj.splice(1, 1) //Error
```
---

#### 数组去重
```js
var arr = [1, 2, 3, 4, 5, 3, 3, 2]

for (var i = 0; i < arr.length; i++) {
  //j=i+1，每个元素跟自己的下一个元素开始比较
  //arr[i]=当前元素，arr[j]=当前元素的下一个元素
  for (var j = i + 1; j < arr.length; j++) {
    if (arr[i] === arr[j]) {
      arr.splice(j, 1) //两个数相等，则删除这个重复的元素
      j-- //删了之后让它自减一次，不急着自增，在该位置上再比较一遍，避免有连续的重复数
    }
  }
}
```

#### 数组倒序
```js
var arr = [1, 2, 3, 4, 5]

//倒序只需要交换 元素一半数量 的次数就行
for (var i = 0; i < arr.length / 2; i++) {
  var curr = arr[i] //当前元素
  var beCurr = arr[arr.length - 1 - i] //对立元素
  
  //替换位置
  arr[i] = beCurr
  arr[arr.length - 1 - i] = curr 
}
```

#### 冒泡排序
```js
var arr = [1, 2, 3, 4, 5]

//升序
//一共要比较元素数量-1轮，因为每轮比较后都少一次，最后一轮只剩自己
for (var i = 0; i < arr.length - 1; i++) {
  //每轮比较过后，次数少一(-1)，并且比较过的不用再比较(-i)
  for (var j = 0; j < arr.length - 1 - i; j++) {
    //两数判断 (降序只需要把符号换成小于号即可)
    if (arr[j] > arr[j + 1]) {
      var curr = arr[j]     //保存当前数
      var next = arr[j + 1] //保存下一个数

      //替换位置
      arr[j] = next
      arr[j + 1] = curr
    }
  }
}
```