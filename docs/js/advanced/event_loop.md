# 事件循环

## 单线程
JavaScript在设计之初便是单线程，即指程序运行时，只有一个线程存在，同一时间只能做一件事。

JavaScript为什么是单线程，而不是多线程？

这跟它的用途有关，Js作为运行在浏览器上的脚本语言，主要用途是与用户交互，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂问题。比如，JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

为了解决单线程运行阻塞问题，JavaScript用到了计算机系统的一种运行机制，这种机制就叫做事件循环（Event Loop）。

## 事件循环
在JavaScript中，所有的任务都可以分为

* 同步任务：立即执行的任务，同步任务一般会直接进入到主线程中执行。
* 异步任务：异步执行的任务，比如`ajax`网络请求，`setTimeout`定时函数等。

同步任务与异步任务的运行流程图如下：

![事件循环](/assets/img/event-loop.png)

可以看到，同步任务进入**主线程**，即主执行栈，异步任务进入**任务队列**，主线程内的任务执行完毕为空，会去任务队列读取对应的任务，推入主线程执行。上述过程的不断重复就是事件循环。
```js
setTimeout(() => {
  console.log(2) //异步任务
})

console.log(1) //同步任务
```

## 宏任务 & 微任务
如果将任务划分为同步任务和异步任务并不是那么的准确，举个例子：
```js
console.log(1)

setTimeout(() => {
  console.log("setTimeout")
}, 0)

new Promise(resolve => {
  console.log("new Promise")
  resolve()
}).then(() => {
  console.log("then")
})

console.log(2)
```
上面代码中，除了`setTimeout`回调和`then`回调以外，其他都是同步任务，所以，理论上输出顺序是：

`1` => `'new Promise'` => `2` => `'setTimeout'` => `'then'`

:::warning
  注意：`new Promise`回调属于同步任务，立即执行。
:::

但实际输出顺序是：

`1` => `'new Promise'` => `2` => `'then'` => `'setTimeout'`

通过观察，发现`setTimeout`回调和`then`回调的执行顺序不符合预期，原因在于异步任务还可以细分为 **宏任务**(macroTask) 与 **微任务**(microTask) 。

### 宏任务
宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，对一些高实时性的需求就不太符合。

常见的宏任务有：
* script (可以理解为外层同步代码)
* setTimeout/setInterval
* UI rendering/UI事件
* postMessage、MessageChannel
* setImmediate、I/O（Node.js）

### 微任务
一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。

常见的微任务有：
* Promise.then
* Async/Await（实际就是Promise.then）
* MutaionObserver
* Object.observe（已废弃，使用Proxy对象替代）
* process.nextTick（Node.js）

事件循环，宏任务，微任务的关系如图所示：

![事件循环](/assets/img/macro-micro.png)

按照这个流程，它的执行机制是：
1. 执行一个宏任务，如果遇到微任务就将它放到微任务的**事件队列**中。
2. 当前宏任务执行完成后，会查看微任务的事件队列，然后将里面的所有微任务依次执行完。
3. 当前宏任务内的微任务执行完成后，继续执行下一个宏任务。这个过程反复循环，就形成了事件循环。

回到上面的代码
```js
console.log(1)

setTimeout(() => {
  console.log("setTimeout")
}, 0)

new Promise(resolve => {
  console.log("new Promise")
  resolve()
}).then(() => {
  console.log("then")
})

console.log(2)
```
`then`的回调属于微任务，它会被加入事件队列，`setTimeout`回调属于一个新的宏任务，它应该等待当前宏任务内事件队列的微任务清空之后，再执行。所以输出结果应该是：

`1` => `'new Promise'` => `2` => `'then'` => `'setTimeout'`

## async & await
我们知道：
* **async函数隐式的返回一个Promise对象**。

  > 如果自定义返回值非Promise对象，也会被`Promise.resolve`包装成一个`fulfilled`状态的Promise对象返回。

* **await指令会堵塞下面的代码**。

  > 等待await语句后面跟着的Promise对象为`fulfilled`状态才会执行下面代码。

既然如此，可以把async函数本身看作是`new Promise`的回调函数（返回Promise对象），把await下面的代码看作是`then`的回调函数内容（堵塞代码，控制流程）。

而`then`的回调属于微任务，所以await下面的代码也属于微任务中的代码。

看下面例子：
```js
async function async1() {
  console.log("async1 start")
  await async2()
  console.log("async1 end")
}
async function async2() {
  console.log("async2")
}
console.log("script start")
setTimeout(function () {
  new Promise(function (resolve) {
    console.log("promise2")
    resolve()
  }).then(function () {
    console.log("then2")
  })
  console.log("settimeout")
})
async1()
new Promise(function (resolve) {
  console.log("promise1")
  resolve()
}).then(function () {
  console.log("then1")
})
console.log("script end")
```
`'async1 start'、'async2'、'script start'、'promise1'、'script end'`属于当前宏任务。

`'async1 end'、'then1'`属于事件队列的微任务。

`'promise2'、'settimeout'`属于事件队列的宏任务（也就是下一个宏任务）。

`'then2'`属于下一个宏任务内事件队列的微任务。

根据代码执行顺序，可以知道输出结果为：
```js
'script start'
'async1 start'
'async2'
'promise1'
'script end' // 当前宏任务执行完毕
'async1 end'
'then1' // 当前事件队列微任务执行完毕

// --- 开始执行当前事件队列内的宏任务（新的宏任务） ---

'promise2'
'settimeout' // 新的宏任务执行完毕
'then2' // 新的宏任务内事件队列微任务执行完毕
```

<Vssue />
