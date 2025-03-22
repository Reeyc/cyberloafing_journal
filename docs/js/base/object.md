# 对象
对象是一种复合的数据类型，用来存储多个不同数据类型的属性。

对象大致分为三种：
* 内置对象：由ES标准中定义的对象，也就是JS自带的对象，在任何的JS环境中都可以直接使用。
```js
String Number Boolean Function Object Math Date JSON
```
* 宿主对象：由JS宿主环境提供的对象，这种对象依赖于宿主环境才能生存。常见的比如：
```js
DOM BOM //浏览器环境提供
global process //node环境提供
```
* 自定义对象：由开发者自定义的对象，这种对象在开发中用的最多。
```js
var obj = { }
```

### 创建对象
在js中创建对象有两种方式：
```js
var obj = new Object() //采用系统的构造函数的方式
var obj = { } //采用对象字面量的方式（推荐）
```
对象的内部是键值对的结构，键与值之间以冒号`:`隔开，每对键值之间以逗号`,`隔开，最后一对后面没有括号。
```js
var obj = {
  key: "value", //key是属性，"value"是值
  key2: 100
}
```

### 对象的增删改查
```js
//增：在对象中添加一个属性，语法：对象.属性名 = 属性值
obj.key = "value"
obj.name = "zs"

//删：在对象中删除一个属性，语法：delete 对象.属性名
delete obj.key

//改：在对象中修改一个属性，语法：对象.属性名 = 属性值
obj.name = "ls"

//查：在对象中读取一个属性，语法：对象.属性名
console.log(obj.name)
```
:::tip
对象的属性是字符串类型，而值可以是任意类型。
:::

## 对象属性
* **中括号书写**

对象的属性除了点的方式书写，还可以按中括号的方式来书写：
```js
var obj = { }

obj.name = "zs"
obj["name"] = "ls"
console.log(obj.name); //ls
console.log(obj["name"]); //ls
```
* **中括号传递变量**

中括号比点的优势在于：中括号还可以传递变量
```js
var obj = { 
  name: "zs"
}

var key = "name"
console.log(obj.name); //zs
console.log(obj[key]); //zs
```

* **查询属性**

使用`in`运算符可以检查一个对象中是否含有某个属性，有则返回`true`，无则返回`false`。
```js
var obj = {
  key: "value"
}

console.log('key' in obj) //true
console.log('key2' in obj) //false
```

## 枚举对象
枚举就是分别找到并排列出的意思，枚举对象其实就是遍历一次对象。
```js
//使用 for...in 语法遍历对象，该变量就是每次遍历到的属性名
for(var 变量 in 对象){
   //语句...
}
```
找出对象内的所有属性和值：
```js
var obj = {
  name: "zs",
  age: 18,
  gender: "男"
};

for(var key in obj){
  console.log(key); //name age gender
  console.log(obj[key]) //zs 18 男
}
```
## 内置对象

### Date
Date构造函数返回一个时间对象。

不传参数的话，默认返回的时间是执行代码那一瞬间：
```js
var date = new Date();
```
可以在调用时传一个格式化的时间作为参数：
```js
var date = new Date("09/06/2018 12:30:30");
```
* **方法**
```js
getDate() //获取当前日期
getDay() //获取当前星期几（周一到周六分别是1-6，周日是0）
getMonth() //获取当前月份（一月到十二月是0-11）
getFullYear() //获取当前年份
getHours() //获取当前小时
getMinutes() //获取当前分钟
getSeconts() //获取当前秒数
getMseconts() //获取当前毫秒
getTime() //获取当前时间戳
```
时间戳：指的是从格林威治时间1970年1月1日0时0分0秒到当前日期所花费的毫秒数。

计算机底层保存时间都是用毫秒作为单位的，我们也可以将时间戳转换为 秒/分/时/日/月/年。
```js
function formatDate(timestamp) {
  timestamp = timestamp || Date.now() //Date构造函数的now方法也可以获取当前时间戳
  var date = new Date(timestamp)
  var Y = date.getFullYear()
  var M = date.getMonth() + 1
  var D = date.getDate()
  var h = date.getHours()
  var m = date.getMinutes()
  var s = date.getSeconds()

  M = M < 10 ? '0' + M : M
  D = D < 10 ? '0' + D : D
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  s = s < 10 ? '0' + s : s

  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}
formatDate()
```

### Math
**Math**也是Js内置对象，不过**Math**跟**Date**不同：
* Date是构造函数（函数对象）
* Math不是函数（普通对象）

但Math对象的首字母也是大写。所以我们用Math对象的时候，不用再以构造函数的形式调用。

* **属性**\
Math对象的属性全都是常量，所谓常量就是指不会变动的数据：
```js
console.log(Math.E) //返回算术常量 e，即自然对数的底数（约等于2.718）
console.log(Math.PI) //返回圆周率（约等于3.14159）
console.log(Math.SQRT2) //返回 2 的平方根（约等于 1.414）

//还有更多...
```

* **方法**\
这里列举几种常用的方法：
```js
console.log(Math.ceil(1.1)) //2 对数进行上取舍（小数位有值就自动进1，0不算）
console.log(Math.ceil(1.0)) //1 

console.log(Math.floor(1.1)) //1 对数进行下取舍（舍弃数的小数位）

console.log(Math.round(1.5)) //2 对数进行四舍五入

console.log(Math.max(100, 200, 300)) //300 取一堆数中的最大值
console.log(Math.min(100, 200, 300)) //100 取一堆数中的最小值

console.log(Math.pow(2, 3)) //8 取2的3次幂
console.log(Math.sqrt(9)) //3 取3的开平方

//还有更多...
```
::: tip
用`Math`的方法对数取整比`parseInt`函数取整性能要高，但是`Math`只能对数值进行取整，而`parseInt`可以对数值跟字符串进行取整。
:::

**Math.random()**：取一个0~1之间的随机数（不包含0跟1）。
```js
//公式：
Math.random()                             //取 0 ~ 1  [不含0，1]
Math.random() * 10                        //取 0 ~ 10 [不含0，10]
Math.round(Math.random() * 10)            //取 0 ~ 10 [含0，10]
Math.round(Math.random() * x)             //取 0 ~ x  [含0，x]
Math.round(Math.random() * 9 + 1)         //取 1 ~ 10 [含1，10]
Math.round(Math.random() * (y - x) + x)   //取 x ~ y  [含x，y]

//测试：
Math.random()                             //取 0 ~ 1  的随机数  [不含0，1]
Math.round(Math.random())                 //取 0 ~ 1  的随机整数 [含0，1]
Math.round(Math.random() * 10)            //取 0 ~ 10 的随机整数
Math.round(Math.random() * 9 + 1)         //取 1 ~ 10 的随机整数
Math.round(Math.random() * (8 - 2) + 2)   //取 2 ~ 8  的随机整数
```

### RegExp
正则表达式用于定义一些字符串的规则，计算机可以根据正则表达式来检查一个字符串是否符合规则，或者将字符串中符合规则的内容提取出来。

JS创建正则表达式的两种方式：
* 调用构造函数创建正则表达式的对象：
```js
// new RegExp("正则规则", "匹配模式")
var reg = new RegExp("a", "i")
```
* 使用字面量创建正则表达式：
```js
// /正则规则/匹配模式
var reg = /a/i
```
正则规则：规则很多，考虑到篇幅，这里不列举，可以自行查阅。

匹配模式：`i`是忽略大小写，`g`是匹配全局模式。

#### 方法
* `test`：检查一个字符串是否符合正则表达式的规则，符合返回`true`，否则返回`false`。
```js
var reg = new RegExp('a') //正则规则
var str = 'abc'

console.log(reg.test(str)) //true
console.log(reg.test('abc')) //true
console.log(reg.test('bcd')) //false
```
* `exec`：检查一个字符串是否符合正则表达式的规则，符合返回数组，否则返回`null`。
```js
var reg = /a/ //正则规则
var str = 'abc'

console.log(reg.exec(str)) //["a"]
console.log(reg.exec('abc')) //["a"]
console.log(reg.exec('bcd')) //null
```

### String
在计算机底层，字符串是以字符数组的形式保存的。也就是说，一个字符串类似于一个数组，里面的每一个字符（包括空格）都是这个字符串里的元素，所以我们一样可以用`length`来获取长度，用`索引`来操作字符串。

#### 属性
* length：获取字符串的长度。
* prototype：指向原型对象。
```js
var str = 'hello world'
console.log(str.length) //11
console.log(str[0], str[5]) //h 空格

//不建议用这种方式
var str2 = new String()
String.prototype.name = 'hello js'
console.log(str2.name) //hello js
```

#### 方法
| 常用的方法             | 作用                         |
| -------------------- |---------------------------- |
| charAt | 返回指定位置的字符，传索引位置作参数。 |
| charCodeAt | 返回指定字符的Unicode编码，传索引位置做参数。 |
| concat | 连接多个字符串，传需要被连接的字符串作参数。<br>（其实就是“拼串”，不如+号好用）|
| indexOf | 检索字符串中是否含有指定的字符。<br>参数为需要检索的字符，如有第二个参数：表示从该位置开始检索<br>有则返回：该字符首次出现的索引位置<br>否则返回：-1 |
| lastIndexOf | 倒着检索字符串中是否含有指定的字符。<br>参数同上，返回值同上 |
| slice | 截取字符串中的内容。<br>参数一：开始位置（包含），参数二：结束位置（不包含）<br>如果只有一个参数，则开始往后全部截取<br>如果传负数，则从后往前计算 |
| substring | 用于截取字符串中的内容。参数同上<br>不能传递负数，否则会将这个负数设置为0<br>自动调整位置，如果第二个数小于第一个，则交换位置 |
| substr | 用于截取字符串中的内容。<br>参数一：开始位置（包含） 参数二：截取的字符数量 |
| split | 将一个字符串切割为一个数组。<br>参数为内容里的字符，根据该字符去切割数组。<br>如果参数是空串，则字符串中的每一个字符都是数组的元素 |
| toUpperCase | 将一个字符串转换为大写 |
| toLowerCase | 将一个字符串转换为小写 |

```js
var str = 'Hello JavaScript'

str.charAt(6) //检索，返回字符
str.charCodeAt(6) //检索，返回Unicode编码

str.concat('zs') //合并，返回字符串

str.indexOf('a', 6) //检索，返回索引位置
str.lastIndexOf('i', 1) //倒着检索，返回索引位置

str.slice(0, 3) //截取，开始位置、结束位置，返回字符串
str.substring(0, 2) //截取，开始位置、结束位置，不能传递负数，自动调整位置，返回字符串
str.substr(0, 3) //截取，开始位置，数量，返回字符串

str.split("a") //分割，传字符串内的字符，返回数组

str.toUpperCase() //转大写
str.toLowerCase() //转小写
```

#### 正则参数方法
字符串有一些方法支持传递正则表达式作为参数：
* **split**：将一个字符串转换为一个数组，参数传元素间的分隔符字符串或正则。
>split方法传递的正则默认是全局匹配模式（全部拆）
```js
var str = 'a1b2c3d4e5f6g'
console.log(str.split('b')) //["a1", "2c3d4e5f6g7"]
console.log(str.split(/[0-9]/)) //["a", "b", "c", "d", "e", "f", "g"]
```

* **search**：根据字符或正则检索字符串，符合则返回第一次出现的索引位置，不符合则返回-1。
>search方法只会找第一个，设置正则全局匹配也没用。
```js
var str = 'abc,acc,adc,aec'
console.log(str.indexOf(/a[bed]c/)) //-1 indexOf无法传递正则做参数
console.log(str.search(/a[bed]c/)) //0 abc第一次出现在索引0
```
* **match**：传递正则提取字符串中的内容并返回。
> match默认不是全局匹配，想全部截取，要自己设置全局匹配模式。\
> match会将这些截取到的内容封装到一个数组中返回，所以查询这些内容将会是数组对象。
```js
var str = 'a1bc,a2bc,a3dc,a4ec'
console.log(str.match(/[0-9]/))   //["1"] 非全局
console.log(str.match(/[0-9]/gi)) //["1","2","3","4"] 全局
```

* **replace**：将一个字符串中的内容替换成另外的新内容，需要传递两个参数，第一个参数是被替换的字符或正则，第二个参数是新内容。

如果只想删不想加，那么第二个参数传递空串就行了。
> replace默认不是全局匹配，可以自行设置全局匹配
```js
var str = 'a1bc,a2bc,a3dc,a4ec'
console.log(str.replace(/[0-9]/gi, '-hello-'))
```

### JSON
在我们开发项目的过程中，需要进行前后端交互才能开发出一个完整的项目。\
而我们的JS是浏览器脚本语言，JS对象只有JS认识，把JS的对象发到后台服务器，服务器是看不懂的。

有一种类型，所有语言都能看得懂，那就是字符串类型。\
所以，我们把数据传递到后台服务器进行交互时，需要将对象转换成一个字符串。\
**JSON**（js对象表示法 JavaScript Object Notation），就是一个特殊格式的字符串，JSON在开发中主要用来做数据的交互。

JSON主要分为：**JSON对象**、**JSON数组**\
JSON允许的值：
* 字符串
* 数值
* 布尔值
* null
* 对象（不包含函数对象）
* 数组
* undefined不能保存，函数也不能保存

#### 对象，数组转换成JSON
1. 将对象字面量用引号引起来。
2. 对象的属性名要用双引号引起来（单引号也不行）。
开发时数据太多，手工转换的话要加引号变成字符串，又要给属性名加双引号，太麻烦了，js提供了一个工具类`JSON`

`JSON.stringify()`

该方法需要传递一个对象作为参数，会自动帮这个对象加上引号，跟属性名加上双引号。
该方法的返回值就是这个对象的JSON对象。
```js
var obj = { name: 'javscript', age: 18 } //一个JS对象
var arr = [1, true, 'hello']             //一个JS数组

var str = JSON.stringify(obj)  //JS对象转为JSON对象
var str2 = JSON.stringify(arr) //JS数组转为JSON数组

console.log(str)  //'{"name" : "javascript", "age" : 18}'
console.log(str2) //'[1,true,"hello"]'
```

#### JSON转换成对象，数组
`JSON.parse()`

该方法需要传递一个字符串作参数，该方法的返回值就是对象。
```js
var obj = '{"name": "javascript", "age": 18}' //一个JSON对象
var arr = '[1, 2, 3, true, "Hello"]'            //一个JSON数组

var od = JSON.parse(obj) //将JSON对象转换为JS对象
var ad = JSON.parse(arr) //将JSON数组转换成JS数组

console.log(od.name) //javascript
console.log(ad[2])   //3
```
:::warning
IE7及以下浏览器没有JSON这个工具类，如果要兼容IE7的话，需要调用`eval`函数。
:::

#### eval函数
* 需要传递一个段字符串作参数。
* 调用就直接执行一段字符串形式的JS代码。
* 以对象的形式返回。
::: tip
JSON字符串中的对象的大括号{ }，`eval`函数会把它看做一个代码块，会报错，所以传递JSON对象作参数时，记得要在前后各加一个括号，表示一个整体，不是代码块。
:::

```js
var JSONObj = '{"name": "javascript"}'
var JsObj = eval('(' + JSONObj + ')')

console.log(JsObj)
```

::: danger
`eval`函数具有安全隐患（执行字符串），并且性能也比较差，所以，开发中尽量不要用。
:::

如果要兼容IE7及以下的JSON操作，可以通过引入一个外部的JS文件来操作，原理是一样的：IE7以下没有JSON这个工具类，那就自己创建这个工具类，然后引入。

<Vssue />