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