# 运算符

## 算数运算符
* <u>**\+&nbsp;&nbsp;&nbsp;&nbsp;\-&nbsp;&nbsp;&nbsp;&nbsp;\*&nbsp;&nbsp;&nbsp;&nbsp;\/**</u>

将运算的两个值或多个值转为**number**类型，并进行加减乘除运算，将结果返回\
对于无法转为**number**类型的值，运算的结果会返回`NaN`
``` js
console.log(100 - 50); //50
console.log(true - false); //1
console.log(new Object - {}); //NaN
```
::: warning
**拼串现象：**+号运算符的特殊情况，如果运算的某一方是字符串，会作拼串操作，如另一方非字符串，会将其转为字符串再拼串
```js
console.log('Hello' + ' World'); //'Hello World'
console.log('Hi ' + {}); //'Hi [object Object]'
console.log(1 + '99'); //'199'
```
:::
### 取模
* <u>**\%**</u>

`%`就是取模运算符，取模就是相除，并取余数
``` js
console.log(10 % 3); //1  10/3 ...余1
console.log(8 % 5); //3  8/5 ...余3
```

## 一元运算符
* <u>**\+&nbsp;&nbsp;&nbsp;&nbsp;\-**</u>

也叫作正负运算符，`+`是正运算符，`-`是负运算符。\
正负运算符跟算数运算符的`+ -`区别在于：\
两者都会将运算单位转为**number**类型，\
但正负运算符允许只有一个单位，但是运算符必须写在运算单位的前面。\
而算数运算符要求两边都有运算单位，并且如果有一边是字符串，则结果会转为字符串。
``` js
console.log(typeof +'100'); //number
console.log(typeof ('100'+'')); //string
```

## 自增、自减运算符
* <u>**\++&nbsp;&nbsp;&nbsp;&nbsp;\--**</u>

自增&自减运算符仅对**number**类型的数据有效，而且是用变量缓存的**number**类型，不可以直接对**number**数据使用自增&自减运算符。\
自增&自减运算符都会对变量本身造成影响：
   * 自增：变量+1
   * 自减：变量-1
``` js
var num = 100;
console.log(++num); //num=101
console.log(++num); //num=102

console.log(--num); //num=101
console.log(--num); //num=100
```
### 写在变量前
自增&自减运算符也是一个表达式，当自增&自减运算符写在变量前，表达式返回的是自增&自减前的值，如何理解这句话？
``` js
var num = 100;
console.log(num++, num); //100 101
console.log(num++, num); //101 102
console.log(num++, num); //102 103
```
上例中，变量**num**自增，并且每次自增都打印表达式的值和变量本身的值\
可以看到，每次返回的表达式的值还是变量自增之前的值，而变量实际上已经变化了。自减同理。


### 写在变量后
理解了上面的情况，再来看这种会很简单，自增&自减写在变量之后，表达式返回的是自增&自减前的值\
而自增&自减写在变量之前，表达式返回的是自增&自减后的值。
``` js
var num = 100;
console.log(--num, num); //99 99
console.log(--num, num); //98 98
console.log(--num, num); //97 97
```
总之，自增&自减运算符无论是写在变量前，还是变量后，它们的共同点是都会即时的对变量产生影响

## 逻辑运算符
* <u>**\!&nbsp;&nbsp;&nbsp;&nbsp;\&&&nbsp;&nbsp;&nbsp;&nbsp;\||**</u>

逻辑运算符主要有3种：非运算符`!`、与运算符`&&`、或运算符`||`。\
主要用作于逻辑判断，默认都会将数据转为**boolean**值来判断。
从符号的名称上来理解：\
判断数据是否非我们要的数据，用`!`非运算符\
判断某个数据与某个数据，用`&&`与运算符\
判断某个数据或某个数据，用`||`或运算符

### 非运算符
在数据的前面机上一个`!`号，将数据转为**boolean**值，并取反
``` js
var flag = null;
if (!flag) {
    alert('Hello')
} else {
    alert('something went wrong');
}
```
上例中，**flag**为`null`，它使用了`!`进行类型转换，并取反，原本转为**boolean**是`false`，取反后转为`true`，所以执行了`alert('Hello')`

### 与运算符
对符号两侧的值进行与运算，并返回值，同样两侧的值都会转为**boolean**再判断
``` js
var flag = null;
var flag2 = '';

if (!flag && !flag2) {
    alert('Hello')
} else {
    alert('something went wrong');
}
```
上例，**flag**和**flag2**转为**boolean**都是`false`，非运算符将它们取反为`true`，此时结合与运算符进行与运算，当左边的值与右边的值都为`true`时，与运算符返回`true`，也就执行了`alert('Hello')`

#### 与运算符的返回规则
我们知道，当两侧的值为`true`时，与运算符返回`true`，那么它返回的是哪边的`true`呢？\
答案是返回右边的`true`。与运算符有一套返回值的规则：
* 当两侧为`false`，直接返回左侧代码，而不会检查右侧
* 当两侧为`true`，会返回右侧代码
* 当左侧为`false`，直接返回左侧的代码，而不检查右侧
* 当左侧为`true`，不检查右侧，直接返回右侧代码
``` js
console.log(1 && 0); //true false, 返回0
console.log('' && -99); //flase true, 返回''
console.log([] && {}); //true true, 返回{}
console.log(NaN && null); //flase false, 返回NaN
```
>只需要明白一点：与运算符优先返回`false`的一方，有`false`返回`false`，没`false`返回最后一个`true`。

### 或运算符
对符号两侧的值进行或运算，并返回值，同样两侧的值都会转为**boolean**再判断
与运算符需要两侧都满足`true`，才会返回`true`，而或运算符只需要一方满足`true`，就会返回`true`。
``` js
var flag = null;
var flag2 = '';

if (!flag || flag2) {
    alert('Hello')
} else {
    alert('something went wrong');
}
```
还是这个例子，**flag**为`null`，转为**boolean**是`true`，或运算符会直接返回`true`，而不会去管右侧**flag2**的值，即使它为`false`

#### 或运算符的返回规则
其实跟与运算符是相反的，与运算符优先找`false`，而或运算符优先找`true`
* 当两侧为`true`，返回左侧代码，不会检查右侧
* 当两侧为`false`，返回右侧代码
* 当左侧为`true`，直接返回左侧代码，不检查右侧
* 当左侧为`false`，直接返回右侧代码，不检查右侧
``` js
console.log(1 || 0); //true false, 返回1
console.log('' || -99); //flase true, 返回-99
console.log([] || {}); //true true, 返回[]
console.log(NaN || null); //flase false, 返回null
```

## 赋值运算符
* <u>**\=&nbsp;&nbsp;&nbsp;&nbsp;\+=&nbsp;&nbsp;&nbsp;&nbsp;\-=&nbsp;&nbsp;&nbsp;&nbsp;\*=&nbsp;&nbsp;&nbsp;&nbsp;\/=&nbsp;&nbsp;&nbsp;&nbsp;\%=**</u>

`=`号用于赋值，将右侧的值赋予左侧的变量
```js
console.log(a = 100); //100
```
`+= -= *= /= %=`属于复合赋值运算符，它们会计算后并直接赋值出来，而不用我们再使用`=`号赋值。
也就是说它们同时执行了**运算**和**赋值**的操作
``` js
var num = 100;

console.log(num += 10); //110 (num = num + 10)
console.log(num *= 2); //220 (num = num * 2)
console.log(num %= 3); //1 (num = num / 3 ...1)
```

## 关系运算符
* <u>**\>&nbsp;&nbsp;&nbsp;&nbsp;\>=&nbsp;&nbsp;&nbsp;&nbsp;\<&nbsp;&nbsp;&nbsp;&nbsp;\<=**</u>

关系运算符用于比较符号两侧的值，关系成立则返回`true`，关系不成立则返回`false`\
对于非**number**类型的数据，会将其转换为**number**类型再作运算
``` js
console.log(true > false); //true
console.log('18' < 17); //false
console.log(1 >= "1"); //true
console.log('99' <= Number.MAX_VALUE); //true
```
::: warning
任何值跟`NaN`运算，都返回`false`
:::

两个字符串作比较时，比较的是它们的Unicode编码，一位一位的进行比较，如果这边的第一位编码大于另一边第一位的编码，那么不会再检查第二位。
``` js
console.log('我' > '你'); //true
```

## 比较运算符
* <u>**\==&nbsp;&nbsp;&nbsp;&nbsp;\!=&nbsp;&nbsp;&nbsp;&nbsp;\===&nbsp;&nbsp;&nbsp;&nbsp;\!==**</u>

`==`判断两侧的值是否相等，`!==`判断两侧的值是否不相等，返回`true`或者`flase`\
`===`判断两侧的值是否全等，`!==`判断两侧的值是否不全等，返回`true`或者`flase`\
相等？全等？\
比较的是**number**类型的值，对于非**number**类型的值，会转换为**number**类型再比较，这就是比较相等。\
而比较全等不会作类型转换，严格比较当前的类型
``` js
console.log(99 == '99'); //true
console.log(0 != ''); //false
console.log(10 == parseInt('10abc')); //true

console.log(99 === '99'); //false
console.log(1000 !== 1000); //false
```
::: tip
引用类型比较的是引用地址，因此两个对象无论如何比较，都是不相等\
但是对象的属性比较的是值，对象属性可以是相等情况
``` js
var obj = { age: 18 };
var obj2 = { age: 18 };

console.log(obj == obj2); //false
console.log(obj2.age === obj2.age); //true
```
:::

## 三元运算符
* <u>**\?&nbsp;&nbsp;:**</u>

三元运算符也称作**条件运算符**、**三目运算符**，用于判断表达式的结果来决定执行哪一项语句。语法：
``` js
表达式结果 ? 语句一 : 语句二;
```
结果为`true`执行语句一，结果为`false`执行语句二。非**boolean**类型的结果会转为**boolean**值再判断。\
三元运算符常用于简单的逻辑判断，如果逻辑较为复杂，建议使用`if`语句或者`switch`语句。
``` js
var a = 1;
var b = 2;
var c = 3;
var max;
max = a > b ? a : b;  //表达式结果为false, 将b赋值给max
max = max > c ? max : c;  //表达式结果为false，将c赋值给max
console.log(max);   //最大值：3
```
三元运算符也可以嵌套使用，但是不推荐，不利于代码的阅览
``` js
var a = 1;
var b = 2;
var c = 3;
var max;

max = (a > b ? a : b) > c ?  (a > b ? a : b) : c;
console.log(max);
```

## 运算符的优先级
运算符也是有优先级之分的，优先级高的会优先运算，如果优先级一样的，则会从前往后运算
| 运算符                | 描述                         |
| -------------------- |---------------------------- |
| ()                   | 表达式分组                    |
| ++ -- - ~ !          | 一元运算符                    |
| * / %                | 乘法、除法、取模               |
| + - +                | 加法、减法、字符串连接          |
| << >> >>>            | 移位                         |
| < <= > >=            | 小于、小于等于、大于、大于等于    |
| == != === !==        | 等于、不等于、严格等、非严格相等  |
| &                    | 按位与                        |
| ^                    | 按位异或                      |
| \|                   | 按位或                        |
| &&                   | 逻辑与                        |
| \|\|                 | 逻辑或                        |
| ?.                   | 条件                          |
| = += -= *= /= %=     | 赋值运算                      |
| ,                    | 多重求值                      |

<Vssue />