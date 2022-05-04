# 基本数据类型

## String
字符串要用 单引号 或 双引号 引起来，没有引号视为变量
``` js
var str = "string"; //字符串
var str2 = 'string'; //字符串

var variable = string; //string是变量
```

相同引号不能嵌套，不同引号可以嵌套
``` js
'Hello "World"'; //good
"Hello 'World'"; //good

"Hello "World""; //bad
'Hello 'World''; //bad
```

字符串中，有一些特殊字符不能直接显示，需要在这个特殊字符的前面加 \ 为转义字符
``` js
console.log('\\'); //显示 \
console.log('\"'); //显示 "
console.log('\''); //显示 '
console.log('\n'); //显示 换行
console.log('\t'); //显示 制表符

// ...还有更多
```

## Number

所有不加引号的数字都是`Number`类型，包括整数，小数，负数
``` js
console.log(100);  //number
console.log(0);    //number
console.log(0.99); //number
console.log(-100); //number
```

* `Number.MAX_VALUE`表示数字的最大值，如果超过这个值，会返回一个`infinity`代表无穷大
* `Number.MIN_VALUE`表示数字的最小值，如果超过这个值，会返回一个`-infinity`代表无穷小
``` js
console.log(Number.MAX_VALUE); //数字的最大值终点
console.log(Number.MIN_VALUE); //数字的最小值终点
```
\
非法数字`NaN`，当js计算不出一个结果时，就会返回一个`NaN`，表示非法数值
``` js
console.log(100 - 'string'); //NaN
```
::: tip
`NaN`也是`number`类型
:::
\
在js中，进行整数运算可以保证精确运算，进行小数运算，有可能会达到不准确的结果，所以，尽量不要使用js来进行小数运算
```js
console.log(0.1 + 0.2); //0.30000000000000004
```

## Boolean

布尔值只有两个，主要用来做逻辑上的判断：`true`代表真， `false`代表假
``` js
console.log(true);
console.log(false);

var a = 1;
var b = 2;
console.log(a + a === b); //true
console.log(a + a !== b); //false
```
在对象中，任何对象都是`true`，`null`和`undefined`是`false`
``` js
Boolean(new Object()); //true
Boolean(null);         //false
Boolean(undefined);    //false
```


## Null & Undefined
* `null`的数据类型只有一个，那就是`null`，表示空指针对象
* `undefined`的数据类型也只有一个，那就是`undefined`，表示未定义的值
``` js
Object.prototype.toString.call(null);      //[object Null]
Object.prototype.toString.call(undefined); //[object Undefined]
```


## 数据类型查询
使用`typeof`运算符来查询某个数据的类型
``` js
console.log(typeof '');   //string
console.log(typeof 0);    //number
console.log(typeof true); //boolean
console.log(typeof {});   //object
```
::: warning
`typeof`无法准确判断`null`、`Array`、`Set`、`Map`等数据类型。推荐使用`Object.prototype.toString.call`来判断这些数据类型。
``` js
console.log(typeof null);        //object
console.log(typeof []);          //object
console.log(typeof new Set([])); //object
console.log(typeof new Map([])); //object
```
:::

## 包装类的概念
`String`、`Number`、`Boolean`这种构造函数称之为**包装类**或者**工具类**，这种工具类主要是给JS解释器使用的。众所周知，基本数据类型是无法调用API的，只有引用类型才可以。当使用基本类型的数据来调用API时，JS解释器会将这个基本数据类型传递进`String`、`Number`、`Boolean`里面，暂时将它们转为引用类型，来得以调用API，当API调用完毕，JS解释器又会将这些数据转为基本数据类型
``` js
var helloWorld = 'Hello World';
helloWorld = helloWorld.split('').reverse().join('');

console.log(helloWorld); //dlroW olleH

console.log(typeof helloWorld); //string
```
上述例子，helloWorld本是字符串，却可以使用引用类型的`spilt`、`reverse`、`join`方法。原因就是JS引擎内部调用了包装类`String`，将其暂时转为引用类型，而后才将它转回来

## 数据类型转换
### 转string
* #### toString
`toString`存在于`Object`构造函数的`prototype`上，它的返回值是字符串类型的实例，根据原型链的指向，所有对象都可以使用`Object`构造函数`prototype`上的方法
``` js
new Number(100).__proto__ === Number.prototype; //true
Number.prototype.__proto__ === Object.prototype; //true

Object.prototype.hasOwnProperty('toString');  //true

new Number(100).toString(); //'100'
```
::: tip
如果是对象调用`toString`的话，返回的是字符串`[object Object]`
:::


* #### 包装类 String
**String**构造函数的返回值是字符串数据类型，它的实现效果和`toString`是一致的
``` js
console.log(String(100)); //'100'
console.log(String(true)); //'true'
console.log(String(null)); //'null'
console.log(new Object()); //[object Object]
```

* #### 加号运算符 <Badge text="推荐"/> 
在JavaScript中，数字使用`+`号跟数学中的加号效果是一样的。\
但如果是两个字符串使用`+`号运算的话，会把这两个字符串 **拼串** 起来。而如果一方是字符串，另一方不是字符串的话，非字符串的一方会被转成字符串，再进行 **拼串** 操作。\
所以，将一个数据类型`+`一个空串，就会将其转为字符串了。
``` js
console.log('Hello' + ' World'); //Hello World
console.log(100 + ''); //'100'
console.log(true + '');; //'true'
console.log(new Object() + ''); //'[object Object]'
```
### 转number
字符串中含有数值类型的字符可以转为**number**，如：`"100"`或`"100abc"`。\
布尔值也可以转为**number**，`true`会转为1，`false`会转为0。其他类型一律不行。
* #### 包装类 Number
``` js
console.log(typeof Number('100')); //number
console.log(typeof Number('-100')); //number
console.log(typeof Number('')); //number
```
* #### parseInt / parseFloat
`parseInt`和`parseFloat`是全局对象`window`的API，在何处都可以调用。\
`parseInt`会取出一个`String`、`Number`类型中的整数。\
`parseInt`从前往后扫描，遇到非**number**类型的字符就停止，因此，如果字符串中首位字符是非**number**类型的话，会取到`NaN`
``` js
console.log(typeof parseInt('100')); //100 number
console.log(typeof parseInt('10abc99')); //10 number
console.log(typeof parseInt('abc100')); //NaN number
```
`parseFloat`和`parseInt`大同小异，`parseFloat`会取整数与小数，`parseInt`用于取整数。

* #### 减 乘 除号 运算符 <Badge text="推荐"/> 
使用 - * / 运算符对含有**number**字符的字符串进行运算的时候，会把该字符转换为**number**类型再进行运算，为了运算后的结果与原来的一样，可以使用 -0 *1 /1 的方式进行运行，这样就实现了转换**number**类型，且不影响原值。
``` js
console.log('100' - 0); //100 number
console.log('100' * 1); //100 number
console.log('100' / 1); //100 number
```

* #### 正负运算符 <Badge text="推荐"/> 
正负运算符就是一个加号`+`和`-`。但是不要把它跟算数运算符的 + - 混淆。\
它必须写在数据的前面，可以接收只有一个运算的数据，把该数据隐性转为**number**，例如：`+'100'`\
而算数运算符必须有两个运算的数据，把数据拼为一个字符串，例如：`'100'+''`
``` js
console.log(+'100'); //100 number
console.log(+true); //1 number

console.log(-true); //-1 number
console.log(-'99'); //-99 number
```

### 转Boolean
**boolean**类型就两种值，一个是`true`，一个是`false`
* 字符串除了空串外，转为**boolean**都是`true`，空串转为`false`
* 数值除了0和`NaN`外，转为**boolean**都是`true`，0和**NaN**转为`false`
* 对象转为**boolean**都是`true`
* **null**和**undefined**转为`false`
* #### 包装类 Boolean
``` js
console.log(Boolean('Hello World')); //true
console.log(Boolean('')); //false

console.log(Boolean(100)); //true
console.log(Boolean(-100.009)); //true
console.log(Boolean(0)); //false
console.log(Boolean(NaN)); //false

console.log(Boolean(new Object())); //true
console.log(Boolean(null)); //false
console.log(Boolean(undefined)); //false
```

* #### 非运算符 <Badge text="推荐"/> 
非运算符`!`会将一个数据类型隐形转换为布尔值**boolean**并取反，同理，使用两个非运算符就可以转回来了。
``` js
console.log(!!'Hello World'); //true
console.log(!!''); //false

console.log(!!100); //true
console.log(!!-100.009); //true
console.log(!!0); //false
console.log(!!NaN); //false

console.log(!!new Object()); //true
console.log(!!null); //false
console.log(!!undefined); //false
```

<Vssue />