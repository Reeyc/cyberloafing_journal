# Redux 中间件

Redux导出的`applyMiddleware()`方法，允许为redux添加中间件功能。将`applyMiddleware()`返回的结果传入`createStore()`的第二个参数即可。

```js
import { createStore, applyMiddleware } from "redux"
import reducer from "./reducer"
import thunk from "redux-thunk"

const store = createStore(reducer, applyMiddleware(thunk))

export default store
```

支持同时使用多个中间件：

```js
const store = createStore(
  reducer,
  applyMiddleware(middleware1, middleware2, /** ... */)
)
```

## redux-thunk

`redux-thunk`通常用于实现异步action。

```sh
npm i redux-thunk
```
```js
// 省略代码...
import thunk from "redux-thunk"

const store = createStore(reducer, applyMiddleware(thunk))
```

对象形式的`action`，会同步的派发给`reducer`。而`redux-thunk`支持为你的`action`返回一个函数，在函数内进行你的异步操作，并调用`dispatch`去通知`reducer`更新`state`。

```js
import { DELETE_ITEM } from "./actionTypes"

// sync action
export const deleteItemAction = payload => ({
  type: DELETE_ITEM,
  payload
})

// async action
export const deleteItemAsyncAction = (index, time) => {
  // 1. 异步Action返回一个函数（参数等同于store.dispatch方法）
  return dispatch => {
    setTimeout(() => {
      // 2. 异步操作之后，同步通知reducer更新state
      dispatch(deleteItemAction(index))
    }, time)
  }
}
```
组件内调用：
```js
import { deleteItemAsyncAction } from "@/store/actions"

deleteItemAsyncAction(1, 500)
```

:::tip
异步Action其实并不是必须的，我们完全可以在组件内执行完异步操作之后再去通知`reducer`同步更新`state`，这样也可以实现异步更新`state`的效果。

但如果不想将异步的操作交给组件自身，而是想放在`action`里进行的话，这种情况可以使用异步Action。
:::

## redux-promise

除了`redux-thunk`风格以外，`redux-promise`也可以实现异步action。

```sh
npm i redux-promise
```
```js
// 省略代码...
import reduxPromise from "redux-promise"

const store = createStore(reducer, applyMiddleware(reduxPromise))
```

`redux-promise`跟普通的action返回格式一样，返回一个对象，但是其payload的值规定必须是Promise，`redux-promise`会等待该Promise返回结果后自动调用`dispatch`。

也正因如此，`redux-promise`不支持并行多个异步action，通常适用于简单的异步操作。
```js
export const deleteItemAsyncAction = (index, time) => {
  return {
    type: DELETE_ITEM,
    payload: new Promise(resolve => {
      setTimeout(() => {
        resolve(index)
      }, time)
    })
  }
}
```

## redux-saga
`redux-saga`是一个用于处理 Redux 中副作用（如异步操作、数据获取等）的一种中间件。它使用 Generator 函数来处理副作用，并且基于 ES6/7 的 Generator、yield、take、put 等语法设计来帮助管理异步流程。
```sh
npm i redux-saga
```

`redux saga`主要由 **Watcher Saga** 和 **Worker Saga** 组成，其工作流程如下：

- **Watcher Saga**：监听特定的actionType，并触发Worker Saga。
- **Worker Saga**：负责执行异步任务，并触发action，更新state。

### 配置saga
```js
// 省略代码...
import createSagaMiddleware from "redux-saga"
import rootSaga from "./sagas"

// 1.创建sagaMiddleware
const sagaMiddleware = createSagaMiddleware()

// 2.创建store，并应用saga中间件
const store = createStore(reducer, applyMiddleware(sagaMiddleware))

// 3.运行saga
sagaMiddleware.run(rootSaga)

export default store
```


`redux saga`一些基本API：
- `call`：调用异步函数
- `apply`：调用异步函数，绑定上下文
- `delay`：模拟延时操作
- `fork`：非阻塞性调用
- `put`：触发action
- `select`：获取store状态
- `takeEvery`：监听action
- `takeLatest`：监听最新的action
- `take`：监听一次action
- `all`：批量运行任务
- `cancel`：取消fork任务

### 基本使用

下面是一个saga的基本使用例子：
- 声明action：
```js
export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST"
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS"
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE"

export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST
})

export const fetchUserSuccess = payload => ({
  type: FETCH_USER_SUCCESS,
  payload
})

export const fetchUserFailure = payload => ({
  type: FETCH_USER_FAILURE,
  payload
})
```
- 声明reducer：
```js
import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE } from "../actions/user"

const initialState = {
  data: null,
  loading: false,
  error: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return { ...state, loading: true, error: null }
    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, data: action.payload }
    case FETCH_USER_FAILURE:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export default userReducer
```
- 编写Saga：
```js
import { takeLatest, call, put } from "redux-saga/effects"
import { FETCH_USER_REQUEST, fetchUserSuccess, fetchUserFailure } from "../actions/user"

// 模拟异步函数
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: "xxx", email: "xxx@xx.com" })
    }, 2000)
  })
}

// Worker Saga
function* fetchUserSaga() {
  try {
    const res = yield call(getUserInfo) //2.调用异步函数
    yield put(fetchUserSuccess(res)) //3.触发action
  } catch (error) {
    yield put(fetchUserFailure(error))
  }
}

// Watcher Saga
function* userSaga() {
  yield takeLatest(FETCH_USER_REQUEST, fetchUserSaga) //1.监听action
}

export default userSaga
```
- 配置saga：
```js
import { createStore, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware from "redux-saga"
import userReducer from "./reducers/user"
import userSaga from "./saga/user"

// reducer
const rootReducer = combineReducers({
  user: userReducer
})

// saga
const saga = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(saga))

saga.run(userSaga)

export default store
```
- 组件内调用：
```jsx
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserRequest } from "@/store/actions/user"

export default function UserComponent() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state) => state.user)
  return (
    <div>
      <h2>User Info</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <div>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
        </div>
      )}
      <button onClick={() => dispatch(fetchUserRequest())}>
        Fetch User
      </button>
    </div>
  )
}
```

### 监听系列

#### `takeEvery`
监听每一次指定的action，并触发一个新的saga任务。适用于无需取消之前任务的场景，例如记录日志、发送请求但不关心结果是否会被覆盖。

:::tip
`takeEvery`的监听是非阻塞性执行，每次action触发时都会执行新的saga，不会等待之前的saga结束。
:::

```js
import { takeEvery, call } from 'redux-saga/effects'

function* fetchData(action) {
  yield call(api.getData, action.payload)
}

function* watchFetchData() {
  yield takeEvery('FETCH_REQUEST', fetchData)
}
```

#### `takeLatest`
监听最新的action并执行saga任务。适用于只需要最后一次请求结果的情况，比如搜索框输入时的自动补全请求、表单提交等。

:::tip
`takeLatest`的监听同样是非阻塞性执行，但它会自动取消之前未完成的任务，仅执行最新的action。
:::

```js
import { takeLatest, call } from 'redux-saga/effects'

function* fetchData(action) {
  yield call(api.getData, action.payload)
}

function* watchFetchData() {
  yield takeLatest('FETCH_REQUEST', fetchData)
}
```

#### `take`
监听action一次，`take`无法像`takeEvery/takeLatest`一样直接传入Saga任务作为第二个参数。它只是一个effect，用于监听指定的action，并返回该 action 的 payload。需要执行Saga任务的话可以手动调用`call`。
```js
import { take, call } from 'redux-saga/effects'

function* watchFetchData() {
  const action = yield take('FETCH_REQUEST')
  yield call(api.getData, action.payload)
}
```
:::tip
`take`是阻塞的，它会暂停Saga，直到指定的action触发。并且`take`只会监听一次，就不会再监听。

正因如此，通常情况下需要持续监听，可以采用`while(true)`或者`for(;;)`的方式进行监听：
```js
import { take, call } from 'redux-saga/effects'

function* watchFetchData() {
  while (true) {
    const action = yield take('FETCH_REQUEST')
    yield call(api.getData, action.payload)
  }
}
```
:::
:::warning 注意
`take + while(true)`执行的Saga任务是继发关系（串行），`takeEvery`的Saga任务是并发执行的，并不能平替`take + while(true)`。
:::

### 批量运行

#### `all`

`all()`适用于多种场景的并发执行：
- 同时运行多个异步函数
```js
import { all, call } from "redux-saga/effects"

function* task1() {
  yield call(apiCall1)
}

function* task2() {
  yield call(apiCall2)
}

function* rootSaga() {
  yield all([
    call(task1),
    call(task2),
  ])
}
```
- 同时运行多个action触发
```js
import { all, put } from "redux-saga/effects"

function* updateUI() {
  yield all([
    put({ type: "SHOW_LOADING" }),
    put({ type: "FETCH_DATA_START" }),
  ])
}
```
- 同时监听Watcher Saga
```js
import { all } from "redux-saga/effects"
import { watchFetchUser } from "./userSaga"
import { watchFetchPosts } from "./postSaga"

export default function* rootSaga() {
  yield all([
    watchFetchUser(),
    watchFetchPosts(),
  ])
}
```

### 非阻塞性

#### `fork`

使用`call`跟`all`执行的任务都是阻塞性的，需要等待任务执行完毕之后才会继续。而`fork`支持非阻塞性执行任务，通常用于后台独立运行的任务：
```js
import { fork, call } from 'redux-saga/effects'

function* fetchUser() {
  yield call(fetchUserApi) // 阻塞
  console.log('用户信息获取完成')
}

function* watchFetchUser() {
  yield fork(fetchUser) // 非阻塞，fetchUser 在后台运行
  console.log('不会等待 fetchUser 完成')
}
```

#### `cancel`
用于手动取消`fork`进行的任务。

`fork`的返回值是一个task对象，可以调用`cancel`传入该task对象进行取消任务。也可以查询任务的状态`isRunning()`、`isCancelled()`

```js
import { take, fork, cancel, call, delay } from 'redux-saga/effects'

function* backgroundTask() {
  try {
    while (true) {
      console.log('任务运行中...')
      yield delay(1000)
    }
  } finally {
    console.log('任务被取消了！')
  }
}

function* watchTask() {
  while (true) {
    yield take('START_TASK') // 监听 START_TASK
    const task = yield fork(backgroundTask) // 启动任务
    console.log('任务状态:', task.isRunning()) // true

    yield take('STOP_TASK') // 监听 STOP_TASK
    yield cancel(task) // 取消任务
    console.log('任务已取消:', task.isCancelled()) // true
  }
}
```

## redux-logger
`redux-logger`是一个用来帮助开发人员调试 Redux State 中间件，它会记录每个action 和 state变化，方便查看状态如何随着action的派发而变化。主要用于开发环境中，帮助调试。
```sh
npm i redux-logger --save-dev
```
```js
// 省略代码...
import logger from 'redux-logger'

// 仅在开发环境使用
const middleware = process.env.NODE_ENV === 'development' ? [logger] : []

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
)
```
定制化配置：
可以通过`redux-logger`的配置项来定制它的输出方式。常见的配置项包括：
- `collapsed`: 是否在日志中折叠 action，默认为`false`。
- `duration`: 是否显示每个 action 执行所花费的时间，默认为`false`。
- `level`: 日志的级别`(log/info/warn/error)`。默认为`log`。

每次`dispatch`时，它会显示：
- `prev state`: 执行action 前的 state。
- `action`: 当前执行的 action。
- `next state`: 执行action 后的 state。

<!-- ## redux-toolkit -->

## redux-persist
手动通过localstorage维护state的存取可以实现持久化，但是需要手动管理数据。推荐使用`redux-persist`插件来管理数据持久化：
```sh
npm install redux-persist
```
只需要按照固定步骤来使用即可：

1.导入对应配置
```js
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
```
2.配置持久化
```js
const persistConfig = {
  storage, // 默认使用 localStorage
  key: "root", // localstorage存储的key
  whitelist: [], // 仅这里的reducer持久化
  blacklist: [] // 仅这里的reducer不持久化
}
```
3.生成`store`和`persistor`并导出：
```js
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(
  persistedReducer, 
  composeWithDevTools(applyMiddleware(reduxThunk, reduxPromise))
)
const persistor = persistStore(store)

export { store, persistor }
```
4.根组件内使用：
```jsx
import { useRoutes } from "react-router-dom"
import routes from "@/router"

import { store, persistor } from "@/store/index"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

export default function App() {
  const router = useRoutes(routes)
  return (
    // 通过<Provider/>组件的store属性向后代组件提供数据，详见redux-react章节
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">{router}</div>
      </PersistGate>
    </Provider>
  )
}
```

<Vssue />