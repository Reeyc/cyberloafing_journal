# Async

**async**函数是ES2017推出的一种异步解决方案，async函数可以看做Generator函数的语法糖，它跟Generator函数的性质一样，优点在于：

* **更好的语义化**

将Generator函数的`*`号换为  function前面的`async`关键字，将`yield`语句换做`await`语句。
```js
function fetchData() {
  console.log("result!")
  return Promise.resolve()
}

function* a() {
  yield fetchData()
  console.log("generator finish")
}

async function b() {
  await fetchData()
  console.log("async finish")
}
```
* **自带执行器**

Generator要使用`next`方法调用才会执行函数，而`async`函数可以像普通函数一样直接调用执行。
```js
// 接上面的代码

const it = a()

it.next() //result!
it.next() //generator finish

b() //result!  async finish
```

* **更方便的返回值**

async函数的返回值是**Promise对象**，这比Generator函数的返回值是**Iterator对象**方便多了，可以直接使用`then`方法指定下一步的操作。
```js
async function getData() { /* ... */ }

getData().then(() => {
  console.log("hello world")
})
```

## await命令
函数执行的时候，一旦遇到`await`关键字就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。\
默认情况下，`await`后面是一个Promise对象，`await`会返回该对象的结果。
```js
async function getData() {
  const res = await new Promise(resolve => {
    setTimeout(() => {
      resolve("hello world")
    }, 1000)
  })
  console.log(res) //hello world
}

getData()
```
如果不是Promise对象，`await`就直接返回该值。
```js
async function getData() {
  const res = await 123
  console.log(res)
}

getData()
```

## async函数的返回值
async函数默认返回一个**Promise对象**，这是硬性的，如果手动指定了返回其他类型的数据，则这个数据会被当做`Promise.resolve()`的参数返回出去。
```js
async function getData(obj) {
  if (obj) {
    return obj
  }
}

//async函数默认返回一个Promise对象
getData().then(() => {
  console.log("default return Promise")
})

//手动指定的返回值，会被会被当成then的参数返回来
getData("hello world").then(res => {
  console.log(res)
})
```

### 返回值的状态
async函数返回值的状态取决于`await`后面的Promise对象的状态，一旦有一个`await`语句后面的Promise对象变为`reject`状态，那么async函数返回的Promise对象也是`reject`状态。并且整个async函数都会中断执行。
```js
async function getData() {
  await Promise.resolve("hello world")
  await Promise.reject("Something went wrong")
  console.log("finish")
}

getData()
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err) // Something went wrong 返回的Promise的状态为rejected
  })
```

## 错误处理
当async函数内部有`await`语句后面的Promise状态变为`reject`时，async函数会中断执行。\
为了防止出错，async函数的错误通常使用`try...catch`代码块来捕获。
```js
const COUNT = 3

async function getEvenNum() {
  for (let i = 0; i < COUNT; i++) {
    try {
      await new Promise((resolve, reject) => {
        const res = Math.round(Math.random() * 10)
        console.log(`第${i + 1}次：${res}`)
        if (res % 2 === 0) {
          resolve(res)
        } else {
          throw new Error(res)
        }
      })
      break
    } catch (err) {}
  }
}

getEvenNum()
```
上面代码中，`getEvenNum`用于获取偶数，如果`await`操作成功，就会使用`break`语句退出循环。如果失败，会被`catch`语句捕捉，然后进入下一轮循环。

## 并发
async函数内部的`await`命令是继发的关系，也就是必须等待当前的`await`有返回值且状态不为`rejected`时候，才会继续往下执行async函数。如果多个`await`命令后面的操作不是继发关系，最好让它们同时触发。最好的方案就是采用`Promise.all()`。
```js
function getHeaderData() {
  console.log("Start")
}
function getMainData() {
  console.log("Start")
}
function getFooterData() {
  console.log("Start")
}

async function init() {
  await Promise.all([getHeaderData(), getMainData(), getFooterData()])
  console.log("finish")
}
init()
```
上面代码中，`getHeaderData`、`getMainData`和`getFooterData`是三个独立的异步操作，之间互不依赖，可以采用并发的方式让它们同时触发来提高效率。