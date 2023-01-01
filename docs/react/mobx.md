# Mobx

Mobx 跟 [Redux](/react/redux.md) 一样，是一个用于管理数据状态的工具库。

```sh
npm i mobx -S
```

## Observable state

在Mobx中，它管理的状态state叫做`Observable state`（可观察的状态值），它的UI视图模型就是`observers`（观察者），当`Observable state`发生改变时会通知到它的`observers`，然后`observers`可以通过`actions`做一些处理，再通知其他依赖的`Observable state`更新。

### observable

`observable(source)`：克隆一个对象并把它转化成可观察对象。`observable`也可以当成注解使用。

* `source`参数是克隆的源对象（可以是对象/数组/Map/Set）。

```js
// 生成一个 observable 对象
const observUser = observable({
  name: "鲨鱼辣椒"
})
```

### makeObservable

`makeObservable(target, annotations?)`：用于将一个对象转化为一个可观察对象。

* `target`参数是要转化的对象。
* `annotations`参数为每一个属性映射注解（observable/computed/action/...）

```js
import { makeObservable, observable, action } from "mobx"

const observUser = makeObservable(
  {
    // 定义可观察对象（observable）
    name: "鲨鱼辣椒",
    setName: name => (observUser.name = name)
  },
  {
    // 给成员加注解
    name: observable,
    setName: action
  }
)
```

### makeAutoObservable

`makeAutoObservable(target, overrides?)`：加强版的`makeObservable`，会自动推断可观察对象的所有成员类型。

* `target`参数是要转化的对象。
* `overrides`参数支持重写注解覆盖，用法跟`annotations`参数一样。

```js
import { makeAutoObservable } from "mobx"

// 使用 makeAutoObservable 代替 makeObservable
const observUser = makeAutoObservable({
  name: "鲨鱼辣椒",
  setName: name => (observUser.name = name)
})
```

## Action

Mobx 中，Action 是任意可以改变 State 的代码，比如用户事件处理、后端推送数据处理、定时器事件处理等等。

跟 Vuex 的 [Mucation](/vue/vue2/vuex.md#mutations)、Redux 的 [Reducer](/react/redux.md#reducer) 一样，为了更好的追踪状态的变化，以及在 devtool 中呈现以 Action 为级别的 update-list，Mobx 建议将所有修改`observable`的代码标记为 Action。

### action

每次更新 **可观察状态** 都会导致 Mobx 生成一次 Action 事务（tick），下面代码中，调用了`setFirstName`和`setLastName`，会自动计算[Computed Value](/react/mobx.html#computed-values)，导致 [autorun](/react/mobx.html#reactions) 触发了两次。
```js {15-16}
import { makeAutoObservable, autorun } from "mobx"

const observUser = makeAutoObservable({
  firstName: "鲨鱼",
  lastName: "辣椒",
  get filterName() {
    return `${this.firstName}爱${this.lastName}`
  },
  setFirstName: firstName => (observUser.firstName = firstName),
  setLastName: lastName => (observUser.lastName = lastName)
})

// 使用 action 包裹更改 observable 的函数
setTimeout(() => {
  observUser.setFirstName("猴子")
  observUser.setLastName("葡萄")
}),1000)

autorun(() => {
  console.log("name is changed：", observUser.filterName)
})
```
这种场景下生成两次 Action 事务是没意义的，可以将两次更新的动作封装成一个 Action 方法。或者使用`action`函数包裹更新 **可观察状态** 的函数，使这些动作指定为一次 Action 事务。

```js {9-12}
import { action } from "mobx"

/**
 * ...
 */

// 使用 action 包裹更改 observable 的函数
setTimeout(
  action(() => {
    observUser.setFirstName("猴子")
    observUser.setLastName("葡萄")
  }),
  1000
)
```

### action.bound

当使用class为 **可观察状态** 做建模时，对应实例的 Action 内部的`this`可能会丢失，例如下面这个例子，`setInterval`调用了Action，此时 Action 内部的`this`应该是window。在里面更新`count`就会导致异常了。

```js {12}
class Counter {
  count = 0
  constructor() {
    makeAutoObservable(this)
  }
  setCount() {
    this.count++
  }
}

const counter = new Counter()
setInterval(counter.setCount, 1000)

autorun(() => {
  console.log("count is changed：", counter.count)
})
```

可以使用箭头函数声明 Action，或者使用`action.bound`，`action.bound`可以为对应的 Action 做注解，并且绑定 Action 内部的`this`为当前实例，这样就不会造成`this`丢失的情况。
```js {5}
class Counter {
  count = 0
  constructor() {
    makeAutoObservable(this, {
      setCount: action.bound // 给 setCount 绑定 this
    })
  }
  setCount() {
    this.count++
  }
}
```

### runInAction

当 Action 中包含异步操作时，异步操作的代码（Callback/Promise/setTimeout/Async-Await/...）是在下一个 [事件循环](/js/advanced/event_loop.md) 中触发的，当前 Action 无法对下一个事件循环中的代码建立事务。

这时候就可以使用`runInAction`工具函数，`runInAction`用于在 Action 中的异步操作之后建立tick事务。下面代码是模拟 发起http请求的前后 各建立一次tick事务，并使用 [reaction](/react/mobx.md#reactions) 做出反应：

```js {18-21}
function getData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("success")
    }, 1000)
  })
}

const observUser = makeAutoObservable({
  firstName: "鲨鱼",
  lastName: "辣椒",
  state: "pending",
  get filterName() {
    return `${this.firstName}爱${this.lastName}`
  },
  setFirstName: async firstName => {
    observUser.firstName = firstName
    const state = await getData() // 模拟http异步请求数据
    runInAction(() => {
      observUser.state = state
    })
  },
  setLastName: lastName => (observUser.lastName = lastName)
})

setTimeout(action(() => {
  observUser.setFirstName("猴子")
  observUser.setLastName("葡萄")
}), 1000)

// 观察 filterName 和 state 的变化，并拿到变化前后的值
reaction(
  () => ({
    name: observUser.filterName,
    state: observUser.state
  }),
  (value, preValue) => {
    if (value.name !== preValue.name) {
      console.log("name is changed：", observUser.filterName)
    }
    if (value.state !== preValue.state) {
      console.log("state is changed：", observUser.state)
    }
  }
)
```

## Derivations

任何来源是 State 并且不需要进一步交互的东西都是 Derivation(派生)。换言之，Derivation 就是当指定的 State 发生变化，对应的 Derivation 会根据该变化做出自动更新。例如ES6的`getter`计算属性、React 的`useEffect`钩子函数等等。

Derivation(派生) 主要分为两种：

* **`Computed values`**：通过纯函数从当前的可观测 State 中派生**新值**。
* **`Reactions`**：当 State 改变时需要自动执行**反应**。

### Computed values

`Computed values`其实就是应用了ES6中的`getter`特性，当`get`函数内依赖的值没有发生变化，函数就不会重新计算：
```js {4-7}
const observUser = observable({
  firstName: "鲨鱼",
  lastName: "辣椒",
  get filterName() {
    // 派生一个新值
    return `${this.firstName}爱${this.lastName}`
  }
})

function changeUserName(firstName) {
  observUser.firstName = firstName
}

setTimeout(action(() => {
  changeUserName("猴子")
  console.log(observUser.filterName)
}), 1000)
```

### Reactions

Reactions 的目的是每当关联的值发生变化时，自动触发**反应**。Reactions 主要提供了三个API：

* **`autorun(effect)`**：接收一个`effect`函数，函数会在**初始化**时，以及所**观察的值发生变化**时会运行。
  ```js
  import { observable, action, autorun } from "mobx"

  const observUser = observable({
    name: "鲨鱼辣椒",
    setName: name => observUser.name = name
  })

  setTimeout(action(() => {
    observUser.setName("蜻蜓队长")
  }), 1000)

  autorun(() => {
    // 初始化时会执行，observUser.name更新时会再次执行
    console.log(observUser.name)
  })
  ```

* **`reaction(data, effect)`**：接收一个`data`函数和`effect`函数，`data`函数会在**初始化**时，以及所**观察的值发生变化**时会运行。

  `data`的返回值会被输入到`effect`的第一位入参。`effect`的第二位参数则记录了`data`的返回值变化前的值。`effect`在初始化时不会执行，只有当`data`的返回值发生变化时才会执行。
  ```js
  import { observable, action, reaction } from "mobx"

  const observUser = observable({
    name: "鲨鱼辣椒",
    setName: name => observUser.name = name
  })

  setTimeout(action(() => {
    observUser.setName("蜻蜓队长")
  }), 1000)

  reaction(
    () => {
      // 初始化时会执行，observUser.name更新时会再次执行
      console.log(observUser.name)
      return observUser.name
    },
    (value, preValue) => {
      // 第一个函数返回值更新时执行
      console.log(`新值-${value}`, `旧值-${preValue}`)
    }
  )
  ```
  :::tip
  `reaction`跟`autorun`的区别也在于此：`autorun`的用法更为简单。而`reaction`的`effect`函数可以拿到变化前后的值，可以在这里进行更精细的副作用操作。
  :::


* **`when(predicate, effect)`**：接收一个`predicate`函数和`effect`函数，`predicate`函数会在**初始化**时，以及所**观察的值发生变化**时会运行。
  
  当`predicate`返回`true`时，`effect`函数才会执行，并且`when`的自动执行器会被清理掉，可以在`effect`函数里进行一些清理的操作。
  ```js
  import { observable, when } from "mobx"

  const observCount = observable({
    count: 0,
    increment: () => observCount.count++
  })

  setInterval(observCount.increment, 1000)

  when(
    () => {
      console.log(observCount.count)
      // 一旦...
      return observCount.count > 5
    },
    () => {
      // 然后...
      console.log('count is greater than 5')
    }
  )
  ```
  上面代码中，当`count`值为6时，执行了`effect`函数，也关闭了`when`的执行器。

  如果没有提供`effect`函数，`when`会返回一个Promise，你可以异步的观察`observable`的状态。
  ```js
  when(() => {
    console.log(observCount.count)
    return observCount.count > 5
  }).then(() => {
    // 满足条件时，Promise 会执行 resolve
    console.log("count is greater than 5")
  })
  ```
  调用返回值Promise的`cancel()`方法可以提前关闭`when`。下面代码中的`when`被提前关闭了，`counterWhenPromise.then`永远不会执行。
  ```js {3}
  const timer = setInterval(() => {
    if (observCount.count >= 3) {
      counterWhenPromise.cancel()
      clearInterval(timer)
    } else {
      observCount.increment()
    }
  }, 1000)

  const counterWhenPromise = when(() => {
    return observCount.count > 5
  })

  counterWhenPromise.then(() => {
    console.log("count is greater than 5")
  })
  ```
  
:::tip 总结
* **`autorun`**：观察`observable`，每当发生变化执行函数。
* **`reaction`**：观察`observable`，可以拿到变化前后的值。
* **`when`**：观察`observable`，自定义函数执行的前置条件，当满足条件则关闭执行器。
:::

## Observer

在 Mobx 中，观察者指的是UI视图模型，与 [React集成](/react/mobx-react.md) 时，观察者通常指的是 React 组件，负责观察`observable`，可以接收到`observable`发生变化时发出的消息，并且根据变化做出响应。

## 装饰器

在 Mobx6 之前，推荐使用装饰器语法，可将某个对象标记为`observable`, `computed`和`action`，使代码更直观简洁。

### 安装依赖
```sh
npm i @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D
```
在`.babelrc`文件中启用（注意，插件的顺序很重要）：
```js
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
}
```

### 重写脚手架配置
默认`create-react-app`脚手架创建的JS项目是不支持装饰器语法的，需要通过`react-app-rewired`跟`customize-cra`来重写配置：
```sh
npm i react-app-rewired customize-cra -D
```

在项目根目录创建`config-overrides.js`文件，并写入以下代码：
```js
const { override, addDecoratorsLegacy } = require("customize-cra")

module.exports = override(addDecoratorsLegacy())
```

然后在`package.json`修改执行脚本的指令为下面这种：
```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
},
```

再重新运行项目`npm run start`就可以在项目中使用装饰器语法了。

---

### 装饰成员

下面代码中，使用了装饰器语法来声明`observable`、`computed`、`action`：
```js {9,11,15}
// @/store/counter.js
import { observable, action, computed, makeAutoObservable } from "mobx"

class CounterStore {
  // 非observable变量
  staticCount = 0

  // 声明observable变量
  @observable count = 0
  // 声明computed
  @computed get getEvenCount() {
    return this.count % 2 === 0 ? this.count : 0
  }
  // 声明action
  @action.bound increment = () => {
    this.count++
    this.staticCount++
  }
}

export default new CounterStore()
```
```js
// @/store/index.js
import counter from "./counter"

const store = { counter }

export default store
```

---

### 在React组件中使用
Mobx 在 React 中的应用，具体可以查看[这篇文章](/react/mobx-react.md)
```sh
npm i mobx-react -S
```

* 使用`<Provider store={store}/>`向下层组件传递Store：
  ```jsx {5,6,10-12}
  import React from "react"
  import ReactDOM from "react-dom/client"
  import App from "./App"

  import { Provider } from "mobx-react"
  import store from "./store/index"

  const root = ReactDOM.createRoot(document.getElementById("root"))
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  )

  export default root
  ```

* 使用`inject`注入Store，声明`observer`观察者：
  ```jsx {4-5}
  import React from "react"
  import { inject, observer } from "mobx-react"

  @inject("store") // 注入store
  @observer // 声明observer(观察者)
  export default class App extends React.Component {
    render() {
      const { counter } = this.props.store
      const { count, getEvenCount, increment } = counter
      return (
        <div>
          <h2>{count}</h2>
          <h2>{getEvenCount}</h2>
          <button onClick={() => increment()}>+1</button>
        </div>
      )
    }
  }
  ```

---

:::warning 注意版本更新
在 Mobx6 之后，装饰器语法尚未定案以及未被纳入ES标准，标准化的过程还需要很长时间，且未来制定的标准可能与当前的装饰器实现方案有所不同。出于兼容性的考虑，官方在 Mobx6 中放弃了它们，并建议使用`makeObservable`、`makeAutoObservable`代替。
:::

<Vssue />