# React-Redux

React-Redux 是 React 官方为了集成 [Redux](/react/redux.md) 作为 React 集中式状态管理而发布的库。  

```sh
npm i react-redux -S
```

## 概念

React-Redux 将所有组件分成两大类：**容器组件** 和 **UI组件**。

> * 容器组件：负责管理数据和业务逻辑，不负责UI的呈现，有业务逻辑，并且使用Redux提供的API。
> ---
> * UI 组件：只负责UI的呈现，不带有任何业务逻辑，没有状态`state`的使用，所有的参数是通过`props`获取。

UI组件就是React常规组件，通常由开发者创建生成。而容器组件则是由 React-Redux 生成的组件。所有 Redux 相关的API操作都在容器组件进行。UI组件不参与任何的 Redux 操作。

换言之，容器组件相当于UI组件和Redux沟通的桥梁，容器组件跟UI组件通过`props`传递数据。

```jsx
// @/components/Item/index.jsx
import React, { Component } from "react"
import { connect } from "react-redux"

// UI组件
class Item extends Component { }

// 容器组件
connect()()
```

## connect

`connect`是 React-Redux 导出的一个函数，该函数用于连接UI组件和Redux，接收两个回调函数作为参数：

| 参数 | 描述 |
| - | - |
| **`mapStateToProps`** | 回调函数。用于将`store.state`映射给UI组件，函数的参数是`store.state`对象。 |
| **`mapDispatchToProps`** | 回调函数。用于将`store.dispatch`映射给UI组件，函数的参数是`store.dispatch`方法。 |

`mapStateToProps` 和 `mapDispatchToProps` 两个函数都必须返回一个对象，对象里的值就是映射给UI组件的`state`对象或者`dispatch`方法集合。

```jsx
// @/components/Item/index.jsx

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

`connect`是一个高阶函数，也就是说，它的返回值也是一个函数。

这个函数的返回值就是当前的容器组件，它接收一个UI组件作为参数，用于连接传入的UI组件。

```jsx
// @/components/Item/index.jsx
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

### 连接Redux

在使用容器组件时，通过`store`参数传递 Redux 的`store`对象，即可连接容器组件和Redux，否则`mapStateToProps`和`mapDispatchToProps`函数将无法获取到`state`和`dispatch`。

```jsx
// @/components/App.jsx
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
// @/components/App.jsx
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
// @/components/index.js
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

<Vssue />