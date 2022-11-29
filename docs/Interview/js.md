# JS

## 深拷贝
```js
function deepClone(o1, o2 = {}) {
  for (const key in o1) {
    const item = o1[key]
    if (item instanceof Object) {
      //值是对象
      o2[key] = {}
      deepClone(item, o2[key])
    } else if (item instanceof Array) {
      //值是数组
      o2[key] = []
      deepClone(item, o2[key])
    } else {
      //值是普通类型
      o2[key] = item
    }
  }
  return o2
}
```
## 节流 & 防抖
* 节流：高频时间触发，但n秒内只会执行一次，稀释函数的执行频率。
```js
function throttle(fn, time) {
  let flag = false
  return function () {
    if (flag) return
    flag = true //进入执行阶段
    setTimeout(() => {
      fn.apply(this, arguments)
      flag = false //执行完毕，更新状态
    }, time)
  }
}
```
* 防抖：触发高频时间之后，n秒内函数只会执行一次，若n秒内高频时间再次触发，则重新计算时间。
```js
function debounce(fn, delay) {
  let timer = null
  return function () {
    timer && clearTimeout(timer) //重复触发，重新计算时间
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}
```

## 发布订阅
```js
//发布订阅
class EventEmitter {
  constructor() {
    this.subs = {} //保存所有不同的事件类型
  }
  //绑定事件
  on(event, cb) {
    if (this.subs[event]) { //每种类型的事件用不同数组保存, 如果事件已存在, 则添加响应函数
      this.subs[event].push(cb)
    } else {
      this.subs[event] = [] //如果事件不存在, 则创建事件数组, 并添加响应函数
      this.subs[event].push(cb)
    }
  }
  //解绑事件
  off(event, offCb) {
    if (this.subs[event]) {
      let index = this.subs[event].findIndex(cb => cb === offCb) //获取要解绑的事件的索引
      this.subs[event].splice(index, 1) //解绑事件
      if (!this.subs[event].length) delete this.subs[event] //当前事件类型为空时, 删除数组
    }
  }
  //触发事件
  trigger(event, ...arg) {
    this.subs[event] && this.subs[event].forEach(cb => { //循环触发该类型中未解绑的事件
      cb(...arg)
    })
  }
}

let example = new EventEmitter()

example.on("demo", () => console.log("Hello World")) //绑定事件
example.trigger("demo") //触发事件 Hello World

example.on("demo", () => console.log("Bay")) //再次绑定事件
example.trigger("demo") //触发多个事件 Hello World Bay

example.off("demo", () => console.log("Hello World")) //解绑某个事件
example.trigger("demo") //再触发 Bay
```

## call & apply & bind
## 闭包
## Event Loop
事件循环的设计是为了解决JS单线程造成的代码堵塞的问题。

执行流程：
<font style="color: #f00">
  执行一个宏任务，先执行同步代码，执行完毕。中途若遇到异步代码，则推入事件队列，异步代码分为宏任务和微任务，两者都会被推入事件队列，队列内的微任务先执行完毕，再执行宏任务（新的宏任务）。
  <br>
  <br>
  新的宏任务继续重复上面的流程，反复循环，形成事件循环。
</font>

常见的宏任务：
* script（最外层同步代码）
* setTimeout/setInterval
* UI rendering/UI事件
* postMessage、MessageChannel
* setImmediate、I/O（Node.js）

常见的微任务：
* Promise.then
* Async/Await（实际就是Promise.then）
* MutaionObserver
* Object.observe（已废弃，使用Proxy对象替代）
* process.nextTick（Node.js）

下面是一个实际应用的例子：
```js
async function async1() {
  console.log("async1 start") //2. 同步代码，执行
  await async2()
  console.log("async1 end") //6. 异步微任务，执行
}

async function async2() {
  console.log("async2") //3. 同步代码，执行
}

console.log("script start") //1. 同步代码，执行

/**
 * 异步宏任务（新的宏任务）
 */
setTimeout(function () {
  new Promise(function (resolve) {
    console.log("promise2") //8. 新的宏任务内，同步代码，执行
    resolve()
  }).then(function () {
    console.log("then2") //10. 新的宏任务内，异步微任务，执行
  })
  console.log("settimeout") //9. 新的宏任务内，同步代码，执行
})

async1()

new Promise(function (resolve) {
  console.log("promise1") //4. 同步代码，执行
  resolve()
}).then(function () {
  console.log("then1") //7. 异步微任务，执行
})

console.log("script end") //5. 同步代码，执行
```

## Promise.all
## Promise