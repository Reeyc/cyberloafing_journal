# DvaJS

传统的React架构通常由React-Component、React-Router、React-Redux 和 Redux-Saga等一系列核心功能所组成。

而Dva正是对这种架构的抽象和简化。它封装了很多常见的模式，从而减少了代码量和配置的复杂度。

```sh
npm install dva-cli -g
```
使用`dva new xxx`指令快速创建一个dva项目：
```sh
dva new dva-react
```
dva生成的项目目录结构通常由以下目录组成：
```js
├── src
│   ├── assets
│   ├── components
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── services
│   ├── index.js
│   ├── router.js
```
index.js 是入口文件，在这里做了初始化dva实例、注册插件、注册model、注册router、启动dva等操作...

router.js 是全局路由出口文件，也就是根组件，路由在 index.js 里进行注册。

## Components

Dva 的组件化理念跟传统的React组件一样，把需要在多个地方复用的UI元素抽象成一个组件，在 /src/components 目录里面编写并导出，这里不过多赘述。

## Router

Dva的路由配置底层也是基于`react-router`的，使用方式差别不大。

在入口文件注册路由：
```js
import dva from 'dva'

// 1. 初始化dva
const app = dva()

// 2. 注册路由
app.router(require('./router').default)

// 3. 启动dva
app.start('#root')
```

### 集成react-router

通过`dva/router`输出`react-router`的接口：
```jsx
import React from "react"
import { Router, Route, Switch } from "dva/router"

export default function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact render={() => "Home"} />
        <Route path="/about" exact render={() => "About"} />
      </Switch>
    </Router>
  )
}
```

### 集成react-redux-router

::: tip react-redux-router
[react-redux-router](https://github.com/reactjs/react-router-redux)是一个将 react-router 和 redux 集成到一起的库，让你可以用 redux 的方式去操作`react-router`，目的是将 react-router 的状态也交由 redux 管理。通过`dispatch`派发路由跳转的`action`，可以在任何组件或 `effect`中实现编程式导航。
:::

Dva 集成了该库，也是通过`dva/router`去输出其接口，通过一个`routerRedux`属性来输出：
```jsx
import React from "react"
import { connect } from "dva"
import { routerRedux } from "dva/router"

export default connect()(function Btn({ dispatch }) {
  return (
    <button onClick={() => dispatch(routerRedux.push("/about"))}>
      Go to About
    </button>
  )
})
```
```js
import { routerRedux } from 'dva'

// 在effects里跳转
yield put(routerRedux.push('/about'))
```


### 动态加载

React本身提供了`lazy()`进行异步加载组件，而 Dva 提供的`dynamic()`可以异步加载组件和其对应的Model，这对于大型应用中按需加载功能模块变得更加方便和高效。
```js
// 声明 model
export default {
  namespace: "counter",
  state: { count: 0 },
  reducers: {
    add(state) {
      return { count: state.count + 1 }
    },
  },
}
```
使用 dynamic 按需加载对应的 model 和 组件：
```jsx
import dva from "dva"
import dynamic from "dva/dynamic"

const app = dva()

const HomePageComponent = dynamic({
  app,
  models: () => [import("../models/home")],
  component: () => import("../pages/HomePage"),
})

export default HomePageComponent
```

## Model

`model`是 Dva 中最重要的概念，Dva 将 Redux 中的`state`、`reducers`、`effects`和`subscriptions`集成到一个结构化的对象中。这样可以通过更简洁的代码来管理应用状态，避免了 Redux 中需要编写大量样板代码以及分散在多个文件中的繁琐结构。
```js
app.model({
  namespace: 'xxx',
  state: { /* ... */ },
  reducers: { /* ... */ },
  effects: { /* ... */ },
  subscriptions: { /* ... */ }
})
```

### namespace

`namespace`是每个`model`的唯一标识符，用来区分和管理不同模块的状态，使每个模块的状态和逻辑都相对独立，便于管理和维护。

通过观察以上`model`，你会发现没有 action，因为 Dva 会根据 `namespace` 自动生成带有命名空间的 action 类型。其生成的名称规则是：
`namespace/reducerName`或者`namespace/effectName`。

```js
// 声明一个model
app.model({
  namespace: 'counter',
  reducers: {
    add() { /* ... */ }
  },
  effects: {
    *getCountInfo() { /* ... */ }
  }
})
```
```js
// 将来在组件中调用就是：
dispatch({ type: 'counter/add' })
dispatch({ type: 'counter/getCountInfo' })
```

### state

等同于 Redux 中的 state。需要注意，其优先级低于传给 `dva()` 的 `initialState`。
```js
const app = dva({
  initialState: { count: 1 },
})

app.model({
  namespace: 'count',
  state: { count: 0 },
})
```
此时，在 `app.start()` 后 `state.count` 为 1 。

### reducers

等同于 Redux 中的 `reducers`。在 Dva 中，`reducer`以 key/value 的形式被集中在一个对象内进行管理。

### effects

Dva 集成了 [Redux-Saga](/react/redux_middleware.html#redux-saga)，不仅支持了处理副作用的场景，使用起来还比saga更加方便。

跟`reducer`一样，`effect`同以 key/value 的形式定义在一个对象内进行管理。通常情况下，你不再需要`take`监听控制流效果，`effects`就是用来代替这种`take`监听的机制。当你在 Dva 的 model 中定义了`effects`函数，Dva 会自动为你监听对应的 action。

```js
export default {
  namespace: 'user',
  state: {
    data: [],
  },
  effects: {
    *getInfo(_, { call, put }) {
      const response = yield call(fetch, '/api/data')
      const data = yield response.json()
      yield put({ type: 'save', payload: data })
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, data: payload }
    },
  }
}
```

这里的`effects`中，`*fetchData`其实就已经在内部替代了 Redux-Saga 中的`take`监听，Dva 会自动监听`dispatch({ type: 'data/fetchData' })`的 action，让你处理副作用的流程更加简洁。


### subscriptions

Dva 引入了自动化订阅机制，`subscriptions`用于监听路由变化或者其他副作用事件，其主要依赖于 `history.listen`、`window.addEventListener` 等监听机制来实现事件监听，返回一个清理函数。

`subscriptions`里的方法在 model 初始化时会被依次执行。

```js
subscriptions: {
  // 监听路由变化
  setup({ dispatch, history }) {
    return history.listen((location) => {
      console.log('当前路由:', location.pathname)
      if (location.pathname === '/home') {
        dispatch({ type: 'fetchData' }) // 触发 action
      }
    })
  },
  // websocket
  websocket({ dispatch }) {
    const socket = new WebSocket('wss://example.com/socket')

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      dispatch({ type: 'updateMessage', payload: data })
    }

    return () => {
      socket.close() // 组件卸载时清理 WebSocket
    }
  },
  // More...
}
```

---

Dva 至今已经不再维护，当你使用 Dva 创建新项目时，它会提示：
```sh
dva-cli is deprecated, please use create-umi instead, checkout https://umijs.org/guide/create-umi-app.html for detail.
如果你是蚂蚁金服内部用户，请使用 bigfish 创建项目，详见 https://bigfish.alipay.com/ 。
```

[Umi](https://umijs.org/) 是一款更强大的前端应用框架，提供了包括路由、状态管理、构建工具、代码分割、服务端渲染等一系列功能，并且其内部也集成了 Dva 进行状态管理。如果你需要构建一个完整的应用框架，希望能够轻松管理路由、状态、构建优化等，推荐使用 [Umi](https://umijs.org/) 集成开发。

<Vssue />