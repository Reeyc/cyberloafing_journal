# Promise

## 异步的概念
关于 **异步**，可以这么理解：一个任务拆分成两段，先执行第一段，转而去执行其他任务，等到某个时间点，再回过头来执行第二段。\
而 **同步** 则相反，一个任务必须做完，才能执行下一个任务。


异步编程的优点：

在同步模式下，CPU大多数时间是在等待中度过的，例如：等待一个网络链接，等待MySQL服务器的数据返回等等，还有可能会造成代码的阻塞，例如`alert()`

而异步的代码就是把这些等待的时间充分利用起来，把网络连接，访问数据库这些耗时的事情注册一个`callback`切换出来，让CPU先去干别的活，当网络连接，访问数据库成功时，再回来处理这个`callback`。

JS是一门单线程的语言，也就意味着：JS同时只能做一件事，所以，异步的操作对于JS来说尤为重要。

## Callback
通常，我们使用回调函数来实现异步编程：
```js
function foo() {
  console.log(1);
  setTimeout(function () {
    console.log(3);
  }, 1000);
}
foo();
console.log(2);

// Output：1 2 3
```
通过观察可以发现`setTimeout`内的回调函数，会在1000ms后被调用，上述代码的输出结果是1、2、3，可以得出：**异步操作会在将来某个时间点调用某个函数**


其中，事件监听就是最典型的异步操作，例如Ajax：
* 在`status === 200`的时候调用`success`函数
* 在`status !== 200`的时候调用`error`函数
```js
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      return success(xhr);
    } else {
      return error(xhr);
    }
  }
}
```
异步任务会等待当前脚本中所有同步任务执行完后，才执行。
```js
(function(callback) {
  setTimeout(function() {
    alert(1);
  }, 0);
  callback && callback();
})(foo);

alert(2);

function foo() {
  alert(3);
}
```
上述代码的执行顺序是：**3 2 1**

解读：`setTimeout`的回调本身就是异步调用，它会等待所有同步任务执行完毕才执行，也就是将回调函数放到任务队列中，等待当前的代码执行完毕再执行。\
重点是改变了代码流程，把回调函数的执行放到了等待当前的代码执行完毕再执行。

而`callback`不是异步调用，它仅仅是一个普通的函数调用，它处在自调用函数当中，一上来就执行自调用函数，所以`alert(3)`最先执行，然后执行`alert(2)`，当所有同步调用执行结束后，执行`setTimeout`回调函数的异步调用`alert(1)`

:::tip
回调函数不代表一定是异步调用，两者没有任何直接关系
:::

### 回调地狱
回调函数实现异步的缺点是，异步多级依赖的情况下会层层嵌套，代码难以阅读和维护。\
更重要的是，多个回调函数嵌套会造成代码的强耦合，如果其中的某一个回调需要修改，有可能造成外面的回调与里面的回调也要跟着修改

![回调地狱](../.vuepress/public/assets/img/callback.png)

### 异常处理
异步操作不支持`try/catch`捕获`callBack`内部异常。\
因为异步调用一般以传入`callBack`的方式来指定异步操作完成后要执行的动作，根据任务队列的处理机制，异步调用本体和`callBack`属于不同的事件循环。而`try/catch`只能捕获当次事件循环的异常，对`callback`无能为力。
```js
try {
  function foo() {
    throw new Error("Something terrible has happened!")
  }
  foo()
} catch (error) {
  console.error(error) //捕获到错误
}

try {
  setTimeout(function() {
    throw new Error("Something terrible has happened!") //未捕获到错误
  }, 0)
} catch (error) {
  console.error(error)
}

```

## Promise
ES6中推出的**Promise**对象可以解决优化JS的异步操作方案。\
首先，通过`Promise`类构建一个promise实例
```js
let promise = new Promise();
```
:::tip
`new Promise()`调用是同步任务，立即执行
:::

promise实例在初始化的时候，接收一个回调函数作参数，语法：
```js
new Promise(function(resolve, reject){ /* ... */ });
```
* resolve：当实例的状态由`pending`（未完成）置为`fulfilled`（成功），执行该回调函数
* reject：当实例的状态由`pending`（未完成）置为`rejected`（失败），执行该回调函数

## Promise.prototype.then
`then`存在于**Promise**的原型当中，意味着每个promise的实例都可以调用`then`方法。

`then`接收两个回调函数作参数，这两个回调函数分别对应`resolve`和`reject `，换言之，`then`的两个参数，用于定义初始化promise实例时的`resolve`和`resolve`
:::tip
第二个参数可选，通常情况下用`catch`代替
:::

```js
function promiseInit(num) {
  return new Promise(function(resolve, reject) {
    num > 100 ? resolve(num) : reject(new Error("something went wrong!"))
  })
}
promiseInit(100).then(
  function(data) {
    console.log(data) //定义resolve
  },
  function(error) {
    console.log(error) //定义reject
  }
)
```
`then`就是异步操作，它符合异步任务的特征：**在将来的某个时间点调用某个函数**
* 在promise对象状态为`fulfilled`时，调用第一个参数回调函数，也就是`resolve()`
* 在promise对象状态为`reject`时，调用第二个参数回调函数，也就是`reject()`

### then的返回值
`then`默认会返回一个**新的promise实例**，借用此特性，来实现链式编程，解决回调地狱问题。
:::tip
即使**then**执行`reject`，返回的promise也是`fulfilled`状态，也就是说执行`reject`，后面的**then**也会继续执行`resolve`
:::
```js
let func = data => {
  data--
  return new Promise(function(resolve, reject) {
    data > 2 ? resolve(data) : reject(data)
  })
}

func(5) //return resolve(4)
  .then(data => {
    return func(data) //return resolve(3)
  })
  .then(data => {
    return func(data) //return reject(2)
  })
  .then(null, err => {
    new Error(err) // 执行reject(2)
  })
  .then(() => {
    console.log("continue")
    return Promise.reject() //继续执行then，返回状态为rejected的promise
  })
  .then(
    function() {
      console.log("good")
    },
    function() {
      console.log("bad") // promise状态为rejected，执行bad
    }
  )

```
* Promise.resolve：用于直接返回一个`fulfilled`状态的**promise**对象
* Promise.reject：用于直接返回一个`rejected`状态的**promise**对象

then不仅可以返回promise，也可以返回其他的数据
```js
func()
  .then(() => {
    return { key: "value" }
  })
  .then(data => {
    console.log(data) // { key:'value' }
  })
```

## Promise.prototype.catch
`then`的链式调用可以解决回调地狱的问题，而`catch`则用于捕获异步回调内的错误。

当promise实例的状态置为`rejected`时，调用`reject`，执行失败的回调函数，即then的第二个参数，它可以将失败的参数给传递出来，因此调用`reject`时，可以捕获发生在then内部发生的错误
```js
function promiseInit(data) {
  return new Promise(function(resolve, reject) {
    data > 10 ? resolve(success) : reject(new Error("something went wrong!"))
  })
}

promiseInit(10)
  .then(null, function(error) {
    //捕获错误：something went wrong!
    console.error(error)
    //再次初始化新的promise实例
    return promiseInit(11)
  })
  .then(
    function(info) {
      //异步操作成功，执行resolve，但是success未定义
      alert(info)
    },
    function(err) {
      //捕获错误：success not a defined
      console.error(err)
    }
  )
```
`Promise.prototype.catch`相当于then第二个参数，用于捕获发生在then内部的错误。

两者区别在于：`reject`只能捕获当前promise实例的then内部引发的错误，如果promise链上的其他then内部引发错误，则无法被当前`reject`所捕获。
```js
let func = data => {
  data++
  return new Promise(function(resolve, reject) {
    data < 100 ? resolve(data) : reject(data)
  })
}

func(99)
  .then(null, err => {
    console.error(new Error(err)) // Error: 100
  })
  .then(
    () => {
      throw new Error("Something terrible has happened!")
    },
    err => {
      console.error(err) // Error: Something terrible has happened!
    }
  )
```
为了解决这种情况，可以在每个then内都写一个`reject`来捕获错误，但是现在有更好的方案，就是`catch`。

**Promise**对象的错误具有**冒泡**性质，会一直向后传递，直到被捕获为止，也就是说，错误总是会被下一个`catch`语句捕获。
```js
let func = () => {
  return new Promise(function(resolve, reject) {
    resolve()
  })
}

func()
  .then(() => {
    throw new Error("Something terrible has happened!")
  })
  .catch(error => {
    console.error(error) //Error: Something terrible has happened!
  })
```
所以说，两者并非完全等价的，我们在调用then时，总是在最后面加上一个`catch`来捕获异常，并且舍弃`reject`来捕获异常。

值得一提的是：若没有使用`catch`方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应，通俗的说法就是 <u>**Promise会吃掉错误**</u>。
```js
let func = () => {
  return new Promise(function(resolve, reject) {
    resolve()
  })
}

func().then(() => {
  throw new Error("Something terrible has happened!")
})

console.log("good")

// Output: good
// Output: Error: Something terrible has happened!
```
这是一个坑点，在异步事件队列中发生的异常无法被`catch`捕获，因为`catch`在异步事件队列之前已执行完毕，但是then可以，因为then是在`catch`之前执行的
```js
let promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    throw new Error()
  }, 0)
})

promise.catch(function(error) {
  console.error(error) //无法捕获
})
```

## Promise.prototype.finally
`finally`方法用于指定不管Promise对象最后状态如何，都会执行的操作
```js
function getData() {
  let isLoading = true
  return new Promise((resolve, reject) => {
    $ajax({
      success: function() {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

getData()
  .then(() => { /* */ })
  .catch(() => { /* */ })
  .finally(() => {
    isLoading = false
  })
```
上述代码中定义了一个ajax请求，并在请求开始前加载loading动画，而不论请求结果如何，一旦promise的状态发生改变，都会把loading动画给关闭。

## Promise.all
```js
Promise.all([promise1, promise2, promise3])
```
该方法用于把多个promise实例合并成一个promise实例来操作，参数接收一个数组，数组里存放n个promise实例
* 当数组中所有promise对象的状态为`fulfilled`时，这个返回的promise对象的状态就是`fulfilled`
* 当数组中有某个promise的状态为`rejected`时，则返回的promise状态为`rejected`

返回的`promise.then`内，回调函数的参数保存每个promise对象`resolve`传递出来的参数
```js
let promiseInit = num => {
  return new Promise((resolve, reject) => {
    num > 100 ? resolve(num) : reject(new Error())
  })
}

// 所有promise对象状态为fulfilled
Promise.all([promiseInit(101), promiseInit(102), promiseInit(103)])
  .then(function(data) {
    console.log(data) //[101,102,103] 数组中保存每个promise对象的resolve传递出来的参数
  })
  .catch(error => {
    console.log(error)
  })

// 有某个promise状态为rejected
Promise.all(
  [promiseInit(101), promiseInit(102), promiseInit(100)] //throw new Error
)
  .then(function(data) {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
```

## Promise.race
```js
Promise.race([promise1, promise2, promise3])
```
`Promise.race`的参数和`Promise.all`的参数一样，接收一个promise实例数组，`Promise.race`会取数组中最快定义状态的一个promise实例，返回的promise对象就是所取的那个promise实例
```js
let promiseInit = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //根据传递的ms来初始化新建的promise对象
      resolve(time)
    }, time)
  })
}

Promise.race([promiseInit(1000), promiseInit(2000), promiseInit(800)])
  .then(function(value) {
    console.log(value) //800 最快的promise
  })
  .catch(function(error) {
    console.log(error)
  })
```

<Vssue />