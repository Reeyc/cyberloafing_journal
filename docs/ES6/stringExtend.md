# 字符串扩展

## Unicode表示法
在ES6之前，JS无法正确识别大于`0xFFFF`的Unicode编码。ES6之后，用`{ }`包裹Unicode编码就能被识别了。
```js
console.log('\u20BB7')   //无法正确识别
console.log('\u{20BB7}') //能够识别
```

## 字符串遍历
遍历字符串可以使用`for循环`，因为字符串在底层也是以数组的方式实现的，而问题是，for无法正确操作Unicode编码大于`0xFFFF`的字符。

在ES6中，新增了`for...of`的遍历方法，并且能够正确识别Unicode编码大于`0xFFFF`的字符。
```js
for (let key of arr) {
  // ...
}
```
* `let`后的变量：每次循环遍历到的那个元素、字符。
* `of`后的字符串：被遍历的那个数组、字符串。

```js
let str = '\u{20BB7}abc'

for (let i = 0; i < str.length; i++) {
  console.log(str[i]) //乱码 乱码 a b c 0xFFFF是两个字节以上的
}

for (let code of str) {
  console.log(code) //𠮷 a b c 能够正确识别0xFFFF的Unicode编码
}
```
**for...of加解构赋值遍历二维数组**
```js
let ardimensArr = [
  ['hello', 'ES5'],
  ['hello', 'ES6'],
  ['hello', 'ES7']
]

for (let [val, val2] of ardimensArr) {
  console.log(val, val2) //hello ES5 hello ES6 hello ES7
}
```

## 字符串模板
ES6中的模板字符很方便用来做字符串拼接，代码可观性也很好，在开发中用的非常多。\
要使用模板的字符串不再是由单引号或双引号包裹，而是由反引号` `` `包裹。字符串变量则要用`${ }`来括起来。
```js
let str1 = 'zs'
let str2 = 'man'
console.log(`my name is ${str1}, i am a ${str2}`) //my name is zs, i am a man
```

### 标签模板
函数调用也可以使用字符串模板，这种方式叫做标签模板
```js
console.log`'Hello World'`
alert`Hello ES6`
```

## 字符串API扩展
**`repeat(count)`**：字符串拷贝
* `count`：拷贝的份数。
* `return`：拷贝后的字符串。
```js
let str = 'hello world '
console.log(str.repeat(3)) //hello world hello world hello world
```
---

**`startsWith(searchString[, position])`**：判断字符串中是否以某些字符开头\
**`endsWith(searchString[, position])`**：判断字符串中是否以某些字符结尾
* `searchString`：需要检索的字符。
* `position`：从此处索引开始检索。
* `return`：是则返回`true`，否则返回`false`。

```js
let str = 'hello world'
console.log(str.startsWith('h')) //true
console.log(str.endsWith('d'))   //true

//ES5实现
let isFirst = str.indexOf('h') === 0
let isLast = str.lastIndexOf('d', str.length - 1) === str.length - 1

console.log(isFirst) //true
console.log(isLast)  //true
```
---

**`padStart(targetLength[, padString])`**：字符串首部补全\
**`padEnd(targetLength[, padString])`**：字符串尾部补全
* `targetLength`：填充的目标长度。
* `tpadString`：用于填充的字符。
* `return`：补全后的字符串。
```js
let date = '2019'

//将字符数往后补全至10个长度，不足的用字符8代替
let end = date.padEnd(10, '8') //2019888888

//将字符数往前补全至10个长度，不足的用字符6代替
let start = date.padStart(10, '6') //6666662019
```

考虑到篇幅问题，此处仅列举部分API，更多的字符串扩展API请自行查阅。

<Vssue />