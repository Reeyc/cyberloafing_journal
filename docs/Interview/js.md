# JS

## 深拷贝
```js
function deepClone(o1, o2) {
  for (const key in o1) {
    const item = o1[key]
    if (item instanceof Array) {
      //值是数组
      o2[key] = []
      deepClone(item, o2[key])
    } else if (item instanceof Object) {
      //值是对象
      o2[key] = {}
      deepClone(item, o2[key])
    } else {
      //值是普通类型
      o2[key] = item
    }
  }
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
## Promise.all
## Promise