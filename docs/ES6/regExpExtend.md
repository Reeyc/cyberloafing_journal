# 正则扩展

## RegExp
**`RegExp(pattern[, flags])`** 的变化：
* `pattern`：正则语法,语法可以携带修饰符。
* `flags`：修饰符，该修饰符可以覆盖参数一内的正则语法的修饰符。

正则对象的`flags`属性可以打印该正则正在启用的修饰符模式。
```js
//原本是gi模式,覆盖后变为i模式
let reg = new RegExp(/a/gi, 'i')

console.log(reg.flags) //i
```

ES5正则修饰符：
* `i`：<u>不区分大小写</u>，属性**ignoreCase**检查是否开启`i`模式。
* `g`：<u>全局匹配</u>，属性**global**检查是否开启`g`模式。

ES6新增正则修饰符：
* `y`：<u>全局匹配</u>，并且匹配到一个后面必须紧跟下一个。属性**sticky**检查是否开启`y`模式。
```js
let reg = /a+/g //g模式
let reg2 = /a+/y //y模式

console.log(reg.sticky) //false
console.log(reg2.sticky) //true

//第一次匹配，两者都能匹配到a
console.log(reg.test('a_aa')) //true
console.log(reg2.test('a_aa')) //true

//继续匹配，g能匹配到aa，y无法匹配到aa，因为不是紧跟着的
console.log(reg.test('a_aa')) //true
console.log(reg2.test('a_aa')) //false
```
* `u`：<u>Unicode模式</u>，正确识别四个字符的**Unicode编码**，在ES5无法正确识别。
```js
const val = /^\uD83D/
const Uval = /^\uD83D/u

//无法正确识别
console.log(val.test('\uD83D\uDC2A')) //true

//Unicode模式，正确识别
console.log(Uval.test('\uD83D\uDC2A')) //false
```

<Vssue />