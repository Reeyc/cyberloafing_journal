# React-Redux

React-Redux 是 React 官方为了集成 [Redux](/react/redux.md) 作为 React 集中式状态管理而发布的工具。  

```sh
npm i react-redux -S
```

React-Redux 将所有组件分成两大类：**容器组件** 和 **UI组件**。

## 容器组件
容器组件用于连接Redux，并使用Redux提供的API，负责管理数据和业务逻辑，并将相关的`props`传递给UI组件，不负责UI的呈现。


## UI组件
UI组件只负责UI的呈现，不带有任何业务逻辑，没有状态`state`的使用，所有的参数是通过`props`获取。

```jsx
import React, { Component } from "react"
import { connect } from "react-redux"

// UI组件
class Item extends Component { }

// 容器组件
connect()()
```

## connect

`connect`是 React-Redux 导出的一个函数，该函数用于连接UI组件和Redux，并返回容器组件。

该函数接收两个回调函数作为参数，注入所需要的`state`和`dispatch`方法：

- **`mapStateToProps`**：用于将`store.state`映射给UI组件，函数的参数是`store.state`对象。
- **`mapDispatchToProps`**：用于将`store.dispatch`映射给UI组件，函数的参数是`store.dispatch`方法。

`mapStateToProps` 和 `mapDispatchToProps` 两个函数都必须返回一个对象，对象里的值就是映射给UI组件的`state`对象或者`dispatch`方法集合。

```jsx
// 将 store.state 映射给UI组件
function mapStateToProps(state) {
  return {}
}

// 将 store.dispatch 映射给UI组件
function mapDispatchToProps(dispatch) {
  return {}
}

connect(mapStateToProps, mapDispatchToProps)()
```

### 连接UI组件

`connect`函数返回一个高阶组件。

这个组件会将 UI组件 封装起来，并传入对应的`props`和`dispatch`方法，最终返回的组件就是一个容器组件。

```jsx
import React, { Component } from "react"
import { connect } from "react-redux"

// UI组件
class Index extends Component { }

// 将 store.state 映射给UI组件
function mapStateToProps(state) {
  return {}
}

// 将 store.dispatch 映射给UI组件
function mapDispatchToProps(dispatch) {
  return {}
}

// 容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Item)
```

### 连接Store

在使用容器组件时，通过`store`参数传递 Redux 的`store`对象，即可连接容器组件和Redux，否则`mapStateToProps`和`mapDispatchToProps`函数将无法获取到`state`和`dispatch`。

```jsx
import React from "react"
import store from "./store/index"

import Item from "./components/Item"

class App extends React.Component {
  render() {
    {/** 给容器组件传递store对象 */}
    return <Item store={store}></Item>
  }
}

export default App
```

### 组件内使用

当容器组件连接了 UI组件 和 Redux，并且容器组件内映射了`state`和`dispatch`到 UI组件 之后，此时在 UI组件 内就可以通过`props`来获取全局状态了。

下面是使用 React-Redux 版本实现 **增删TodoList** 的Demo，具体的 store 代码可以参考上一章 [Redux](/react/redux.html) 的Demo。
```jsx
import React, { Component } from "react"
import { connect } from "react-redux"

import { changeInputAction, addItemAction, deleteItemAsyncAction } from "../../store/actions"
import { Input, Button, List, Row } from "antd"

// UI组件
class Item extends Component {
  inputChange = e => {
    // 直接通过props调用映射进来的dispatch
    this.props.changeInputAction(e.target.value)
  }
  addItem = () => {
    this.props.addItemAction()
  }
  deleteItem = index => {
    this.props.deleteItemAsyncAction(index, 500)
  }
  render() {
    return (
      <div style={{ width: 300 }}>
        <Row justify="space-between" align="middle">
          <Input value={this.props.inputValue} onChange={this.inputChange} style={{ width: 200 }} />
          <Button type="primary" onClick={this.addItem}>Add</Button>
        </Row>
        <List
          dataSource={this.props.list}
          bordered
          renderItem={(item, index) => (
            <Row justify="space-between" align="middle">
              <div>{item}</div>
              <Button danger type="link" onClick={() => this.deleteItem(index)}>
                Delete
              </Button>
            </Row>
          )}
        />
      </div>
    )
  }
}

// 容器组件
const ContainerItem = connect(
  // 将 state 映射给UI组件
  state => ({
    inputValue: state.inputValue,
    list: state.list
  }),
  // 将 dispatch 映射给UI组件
  dispatch => ({
    changeInputAction: value => dispatch(changeInputAction(value)),
    addItemAction: () => dispatch(addItemAction()),
    deleteItemAsyncAction: (value, time) => dispatch(deleteItemAsyncAction(value, time))
  })
)(Item)

// 导出容器组件
export default ContainerItem
```

## mapDisptchToProps简写

`mapDisptchToProps`除了是一个函数以外，还可以是一个对象，对象里面的值是 **Action** 集合。

当UI组件调用对应的 **Action** 时，React-Redux 内部会自动通过`dispatch`派发到 **Reducer**，并走通整个 Redux 更新 **State** 的流程，可以省去我们自己调用`dispatch`的繁琐步骤。更推荐在开发中使用对象形式这种方案。

```js
/**
 * ...
 */

// 容器组件
const ContainerItem = connect(
  // 将 state 映射给UI组件
  state => ({
    inputValue: state.inputValue,
    list: state.list
  }),
  // 将 dispatch 映射给UI组件（对象形式）
  {
    changeInputAction,
    addItemAction,
    deleteItemAsyncAction
  }
)(Item)
```

## Provider

`<Provider />`是 React-Redux 导出的内置组件，通过`store`属性向他下面的所有后代组件提供数据。

所以通常将他包裹在最外层的根组件外面。并通过`store`属性来传递`store`对象，这样就不需要在每个容器上面传递`store`了。

```jsx
import React from "react"
import Item from "./components/Item"

class App extends React.Component {
  render() {
    {/** 去除store（不再一个个传递） */}
    return <Item></Item>
  }
}

export default App
```
```jsx
// 根组件
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import { Provider } from "react-redux"
import store from "./store/index"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  {/** 往下所有组件统一提供store数据 */}
  <Provider store={store}>
    <App />
  </Provider>
)
```

:::tip
Redux 通常需要自己在根组件外通过 `store.subscribe()` 监听整个`state`的变化来重新`render`整个应用。而使用了 React-Redux 之后则不需要自己再监听变化，每当`state`变化，React-Redux 会自动帮你`render`整个应用。
:::

## Hooks

### useSelector

在 React 16.8 之后，React引入了Hooks，使得我们可以使用`useSelector`来直接获取Redux中的状态，而不再需要`mapStateToProps`。
```jsx
import React from "react"
import { useSelector } from "react-redux"

const ItemList = () => {
  const list = useSelector(state => state.list)
  const inputValue = useSelector(state => state.inputValue)

  return (
    <div>
      <h3>Todo List</h3>
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>Current Input: {inputValue}</p>
    </div>
  )
}

export default ItemList
```

### useDispath

类似`useSelector`，我们可以使用`useDispatch`来触发 actions，而不再需要`mapDispatchToProps`。
```jsx
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { changeInputAction, addItemAction, deleteItemAsyncAction } from "../../store/actions"

const ItemList = () => {
  const dispatch = useDispatch()
  const list = useSelector(state => state.list)
  const inputValue = useSelector(state => state.inputValue)

  const handleInputChange = (e) => {
    dispatch(changeInputAction(e.target.value))
  }

  const handleAddItem = () => {
    dispatch(addItemAction())
  }

  const handleDeleteItem = (index) => {
    dispatch(deleteItemAsyncAction(index, 500))
  }

  return (
    <div>
      <input value={inputValue} onChange={handleInputChange} />
      <button onClick={handleAddItem}>Add</button>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            {item} <button onClick={() => handleDeleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ItemList
```
使用`useSelector`和`useDispatch`可以完全摆脱 connect，使代码更简洁，符合 Hooks 组件风格。

### useStore

`useStore`用于直接访问 store 对象。通常情况下，你不需要直接使用`useStore`，因为`useSelector`和`useDispatch`已经足够处理大多数场景。但在某些特殊情况下需要访问 store 对象时，`useStore`可能会派上用场。

```jsx
import { useStore } from 'react-redux'

const MyComponent = () => {
  const store = useStore()
  const state = store.getState() // 获取当前状态
  return <div>Current State: {JSON.stringify(state)}</div>
}
```

<Vssue />