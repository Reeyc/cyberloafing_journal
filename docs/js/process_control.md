# 流程控制语句

## if语句
```js
if (/*条件表达式*/) {
  //语句一
}

if (/*条件表达式*/) {
   //语句一
}else (/*条件表达式二*/) {
   //语句二
}

if (/*条件表达式*/) {
   //语句一
}else if (/*条件表达式二*/) {
   //语句二
}else (/*条件表达式三*/) {
   //语句三
}
```
以上三种都属于**if**判断语句，也就是说**else if**块和**else**块是可选的\
流程：先判断括号内表达式的结果\
结果为`true`，执行紧跟**if**后面的那一条语句，否则继续判断**else-if**后面的表达式结果\
结果为`true`，则执行紧跟**else-if**后面的那一条语句，否则继续判断，一直往下执行这些操作...\
直到最后，所有结果都为`false`，那么执行最后的**else**块的语句
::: tip
**if**是判断语句，只有当中有某一个条件表达式返回`true`，就执行表达式所对应的那个代码块，而不会再去执行其他的块了
:::

**一个简易的计算器**
```js
var num1 = +prompt("请输入第一位数：");
var op = prompt("请输入运算符：");
var num2 = +prompt("请输入第二位数：");

if (isNaN(num1, num2) || op !== "+" && op !== "-" && op !== "*" && op !== "/") {
    alert("输入错误~");
} else {
    if (op === "+") {
        alert(num1 + num2);
    } else if (op === "-") {
        alert(num1 - num2);
    } else if (op === "*") {
        alert(num1 * num2);
    } else if (op === "/") {
        alert(num1 / num2);
    }
}
```
从上述代码中可以看出**if**语句是可以嵌套使用的，而且**else if**块可以使用无限多个

## switch 语句
```js
switch (/*表达式*/) {
  case 表达式:
    //语句...
    break;
  case 表达式:
    //语句...
    break;
  default:
    //语句...
    break;
}
```
**switch**像是一种分支结构，本质上也是用于用于判断的。**switch**语句后面的表达式会从上到下，依次跟**case**后面的表达式进行全等比较。\
结果为`true`：则匹配这个**case**，并执行这个**case**下的代码。\
结果为`false`：则继续向下比较。

### default关键字
**default**的意思是<u>默认的</u>，当所有的**case**都为`false`时，则匹配**dafault**，就像**if**语句的**else**一样。
* **dafault**是可选的
* **dafault**可以写在**switch**内的任何位置（case之外），即使写在第一个**case**之前也没关系，会检查完**case**再去匹配**dafault**
```js
var scroe = +prompt("请输入成绩：");

if (isNaN(scroe) || scroe > 100 || score < 0) {
  alert("输入错误");
} else {
  switch (parseInt(scroe / 10)) {
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      alert("合格");
      break;
    default:
      alert("不合格");
      break;
  }
}
```
### case的穿透性
当某个**case**匹配成功的话，它后面的所有**case**都跟着匹配成功，这就是**case**的穿透性，即使后面的**case**表达式不符合条件也会匹配。\
**default**关键字用于退出分支，也就是当这个**case**执行后，立即退出分支，不再往后执行。\
**break**也是可选的，视需求而加，如果需要**case**穿透就不加，不需要就加，大多数情况下是不需要穿透的，所以建议要加上去。

## while循环
```js
while (/*表达式*/) {
  //循环体...
}
```
**while**首先会对条件表达式进行判断，结果为`true`则执行循环体一遍，循环体执行结束之后再次对条件表达式进行判断，结果为`true`则再次执行循环体，周而复始，往复循环...
```js
while (1) {
  console.log('此段代码，切勿模仿');
}
```
### 死循环
如果条件表达式结果永远为`true`的话，就出现了所谓的 **“死循环”**，也就是一直重复循环，永不停止。
我们应该慎用死循环以及避免死循环，因为脚本一直执行，会导致浏览器崩溃，所以，我们一定要设置一个<u>**更新表达式**</u>，也就是某个时刻改变条件表达式，让它不再足以触发循环，否则将触发死循环
```js
var num = 1;
while (num) {
  console.log('此段代码，切勿模仿');
  break;
}
```
以上代码仅执行一轮循环就被`break`给打断了

## do-while循环
```js
do {
//循环体...
} while (/*条件表达式*/)
```
`do-while`循环是`while`循环的第二种用法，它将`while`以及表达式写到了后面，并在开始加了一个`do`关键字\
仅是书写上的不同吗？\
答案不是的，`do-while`会先执行一次循环体，再判断表达式，来决定是否继续执行循环体，它`while`比最大的不同就是，它能保证语句至少可以执行一次。
```js
do {
  console.log('Hello World'); //执行一次
} while (false)
```
使用`while`循环，计算利润：
```js
var money = 1000; //本金
var year = 0;

while(year < 5){
  money *= 1.5; //年利润50%
  year++;
}

console.log(`这5年您一共挣了${money}元！`);
```

## for循环
```js
for (/*初始化表达式; 条件表达式; 更新表达式*/) {
  //循环体...
}
```
**for循环**跟**while循环**的原理都是一样的，只不过表达式书写的位置不同，**for循环**在开发中用的更多，因为它的结构更清晰\
循环的执行顺序：
1. 定义初始化表达式
2. 执行条件表达式
3. 执行循环体
4. 执行更新表达式
5. 执行条件表达式
6. 执行循环体
7. 往复循环...

我们发现，初始化表达式，仅在第一轮循环时执行，从第二轮循环开始就不再执行了，就像`while`的变量初始化是在`while`结构外部定义的一样，如果在循环结构内部定义，那么重复执行初始化表达式，循环一直满足条件一直执行，就造成死循环了，所以这种设计是合理的...
```js
for (var i = 0; i < 3; i++) {
  console.log(i);
}
```
每轮循环打印计数变量`i`的值，并且每轮结束都更新`i`的值，最终`i=3`时候不再满足`i<3`，所以该循环一共执行了3轮

**for循环**括号内的3个表达式可以写在外面，用变量缓存，表达式就用变量代替
```js
var i = 0;
var end = 3;
for (i; i < end; i++) {
  console.log(i);
}
```
或者你可以不写，因为分号`;`本身就代表了一个简短表达式
::: warning
不写的话，表达式的值就是`true`，将会造成死循环
:::

```js
var stopFor = 0;
for (;;) {
  console.log('123');
  stopFor++;
  if (stopFor > 3) break;
}
```
无论如何，你都应设置一个终止循环的标识，防止死循环的发生

### 嵌套for循环
**for循环**是可以嵌套使用的，也就是在当前轮外循环执行期间，执行内循环
::: tip
循环的<u>初始化表达式</u>仅对自己的循环才不会重复执行，如果是别的循环（如内循环），那么会重复执行
同理，内循环自己会对自己的初始化表达式约束，仅仅执行一次
:::
```js
for (var i = 0; i < 3; i++) { //外循环约束自己的表达式
  console.log(`i=====>${i}`);
  for (var j = 0; j < 3; j++) { //内循环约束自己的表达式
    console.log(`j==>${j}`);
  }
}
```
结果就是，每一轮外循环执行时，内循环`j`的值总是从头开始，往复循环

## break & continue
`break`我们已经认识了，它用于永远退出分支，退出循环等等，特别是针对于死循环，`break`很管用。\
但是`break`有一个注意点：不能单独使用在`if`语句中，但如果该`if`语句存在于`switch`、`while`、`for`之中，那么是可以使用的。
```js
var num = 100;
switch (num) {
  case 100:
    if (num) {
      alert('Hello World');
      break;
    }
  case 101:
    alert('Do not perform');
}

if(num){
  break; //Uncaught SyntaxError: Illegal break statement
  alert('???');
}
```
`break`是永远退出循环，而`continue`是退出当次循环，下一轮继续
```js
for (var i = 0; i < 5; i++) {
  document.write("外循环<br>");
  for (var j = 0; j < 5; j++) {
    if (j === 3) continue; // 跳过当次循环
    document.write("------内循环<br>");
  }
}
```
::: tip
`continue`不能单独用作于`if`或者`switch`之中
:::