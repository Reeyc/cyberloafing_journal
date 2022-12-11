# Redux

Redux 和 React 之间没有直接的关系。Redux 是一个用来管理数据状态和 UI 状态的 JavaScript 应用工具，它支持 React、Angular、jQuery、甚至是纯 JavaScript。

```sh
npm i redux -S
```

## Store

管理数据的仓库，一个 redux 应用只有唯一的一个 store，store 有以下的职责：

- 维护应用的 state。
- 提供 `getState()` 方法获取 state。
- 提供 `dispatch(action)` 方法更新 state。
- 通过 `subscribe(listener)` 注册监听器。
- 通过 `subscribe(listener)` 返回的函数注销监听器。

在项目根目录下新建一个`store/index.js`文件，保存整个项目的 store 仓库。

```js
/* /store/index.js */
import { createStore } from "redux"; // 引入createStore方法
const store = createStore(); // 创建数据存储仓库
export default store; // 暴露出去
```

## Action

Action 是把数据从应用传到 store 的有效载荷，是 store 唯一的数据来源。

Action 本质上是一个对象，对象里面通常会一个`type`属性是对该 action 的描述，通常情况下，建议将`type`定义为**字符串常量**，并使用单独的文件来存放 types，将来便于维护。对象的其他属性是改变后的值。

```js
/* /store/actionTypes.js */
export const CHANGE_INPUT = "changeInput";
export const ADD_ITEM = "addItem";
export const DELETE_ITEM = "deleteItem";
```

当应用规模过大时，过多的 action 会导致应用变得难以维护，所以 action 应该跟`actionType`一样，用一个单独的文件存放起来。

```js
/* /store/actions.js */
import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM } from "./actionTypes";

export const changeInputAction = (value) => ({
  type: CHANGE_INPUT,
  value,
});

export const addItemAction = () => ({
  type: ADD_ITEM,
});

export const deleteItemAction = (value) => ({
  type: DELETE_ITEM,
  value,
});
```

- action 只是描述有状态发生了了改变，具体的改变过程应该由`reducer`去描述。
- action 通过`store.dispatch(action)`方法派发给`reducer`。

### 异步Action

普通对象的`action`，会同步的派发给`reducer`。而异步的`action`则是返回一个函数，在函数内进行你的异步操作，并调用`dispatch`去通知`reducer`更新`state`。

```js
/* /store/actions.js */
import { DELETE_ITEM } from "./actionTypes"

// 同步Action
export const deleteItemAction = value => ({
  type: DELETE_ITEM,
  value
})

// 异步Action
export const deleteItemAsyncAction = (index, time) => {
  // 1. 异步Action返回一个函数（参数是store.dispatch方法）
  return dispatch => {
    setTimeout(() => {
      // 2. 异步操作之后，同步通知reducer更新state
      dispatch(deleteItemAction(index))
    }, time)
  }
}
```
将来在组件内调用该异步Action就可以异步的更新状态了：
```js
/** 组件内 */
import { deleteItemAsyncAction } from "../../store/actions"

deleteItemAsyncAction(1, 500)
```

但是注意，默认情况下，Redux不支持函数形式的`action`，需要借用`redux-thunk`中间件来实现：

```sh
npm i redux-thunk -S
```

该中间件默认返回一个`thunk`对象，通过调用redux导出的`applyMiddleware()`方法，并传入该对象。将调用的结果传入`createStore()`的第二个参数，就可以让redux使用该中间件了。
```js
/* /store/index.js */
import { createStore, applyMiddleware } from "redux"
import reducer from "./reducer"

import thunk from "redux-thunk"

const store = createStore(reducer, applyMiddleware(thunk))

export default store
```

:::tip
异步Action其实并不是必须的，我们完全可以在组件内执行完异步操作之后再去通知`reducer`同步更新`state`，这样也可以实现异步更新`state`的效果。

但如果不想将异步的操作交给组件自身，而是想放在`action`里进行的话，这种情况可以使用异步Action。
:::


## Reducer

真正的更新 Store 里面的`state`，是由`reducer`去完成的，`action`的作用是派发通知给`reducer`。所以说，`reducer`本质上为了处理`action`而诞生的一个纯函数。

:::tip 纯函数
所谓纯函数，就是具备以下特点的函数：
* 只要是同样的输入（实参），必定得到同样的输出（返回）。
* 不得改写参数数据。
* 不会产生任何异常，例如网络请求，输入和输出设备。
* 不能调用`Math.random()`或者`Date.now()`等不纯的方法。
:::

reducer 接收两个参数，一个是初始化的`state`数据，一个是当前传进来的`action`。

reducer 遵循纯函数的原则，不能将原有的`state`更改，且必须返回一个新的`state`数据，如果是引用类型，应该将一份`state`深拷贝，并在拷贝后的`state`内进行操作，然后将这个新的`state`返回。否则引用相同，将会导致 Redux 不能识别状态的改变。

```js
/* /store/reducer.js */

import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM } from "./actionTypes";

const defaultState = {
  inputValue: "",
  list: ["早上4点起床，锻炼身体", "中午下班游泳一小时"],
};

const reducer = (state = defaultState, action) => {
  if (action.type === CHANGE_INPUT) {
    //输入框变化
    let newState = { ...state };
    newState.inputValue = action.value;
    return newState;
  }
  if (action.type === ADD_ITEM) {
    //新增item
    let newState = { ...state };
    newState.list.push(newState.inputValue);
    newState.inputValue = "";
    newState.list = [...newState.list]; // deep clone props
    return newState;
  }
  if (action.type === DELETE_ITEM) {
    //删除item
    let newState = { ...state };
    newState.list.splice(action.value, 1);
    newState.list = [...newState.list];
    return newState;
  }
  //遇到未知的action，要将原有的state对象返回
  return state;
};

export default reducer;
```

reducer 需要挂载到`createStore`函数中的第一位参数：

```js
/* /store/index.js */
import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

export default store;
```

:::tip
`reducer`第一次调用是由store自动触发的，传入的`state`参数是`undefined`，传入的`action.type`参数是Redux生成的随机字符串，目的是为了避免与开发者定义的`type`相同。
:::

:::tip
在组件中使用时，需要通过`store.subscribe()`来订阅redux的状态，否则redux状态改变不会实时同步到组件内。
:::

结合上面的`action`和`reducer`，下面的代码是一个增删 todoList 的例子：

```jsx
import React from "react";
import store from "../../store/index";

import { Input, Button, List, Row } from "antd";

import {
  changeInputAction,
  addItemAction,
  deleteItemAction,
} from "../../store/actions";

class index extends React.Component {
  constructor(props) {
    super(props);
    // 首次调用getState()，store就自动调用reducer
    this.state = store.getState();

    // 订阅Redux的状态，同步到组件state
    store.subscribe(() => {
      this.setState(store.getState());
    }); 
  }
  inputChange(e) {
    const action = changeInputAction(e.target.value);
    store.dispatch(action);
  }
  addItem() {
    const action = addItemAction();
    store.dispatch(action);
  }
  deleteItem(index) {
    const action = deleteItemAction(index);
    store.dispatch(action);
  }
  render() {
    return (
      <div style={{ width: 300 }}>
        <Row justify="space-between" align="middle">
          <Input value={this.state.inputValue} onChange={this.inputChange} style={{ width: 200 }} />
          <Button type="primary" onClick={this.addItem}>Add</Button>
        </Row>

        <List
          dataSource={this.state.list}
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

export default index;
```

`store.subscribe()`的订阅其实可以放在根组件外面，当Redux的状态发生改变，就重新`render`整个根组件`<App />`，这样可以避免在每个组件都要`subscribe()`订阅一次。

并且有React的diffing算法在，不必担心组件更新的效率问题（没有发生状态改变的组件不会重新渲染）。

## 模块化

在实际开发中，可能会有许多模块都有自己的状态需要加入到全局集中管理，这时候就会出现许多的`reducer`，统一放在一个文件中不好维护。建议将`action`、`reducer`也分成模块拆分到一个目录下，将来便于维护。

按模块拆分之后，会出现许多的`reducer`，此时`createStore`的参数不将是接收一个单一的`reducer`，而是使用 Redux 导出的`combineReducers`函数将许多的`reducer`组合成一个对象：
```js
import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"

import todoReducer from "./reducers/todo"
import menuReducer from "./reducers/menu"

const store = createStore(
  // 组合reducer
  combineReducers({
    todo: todoReducer,
    menu: menuReducer
  }),
  applyMiddleware(thunk)
)

export default store
```
拆分模块之后，`state`的获取方式也有一点变化，`store.getState()`返回的也将是一个模块集合的对象，应该从模块的属性取到对应的`state`：
```js
this.state = store.getState().todo

store.subscribe(() => {
  this.setState(store.getState().todo)
})
```
## Redux Dev Tools

1. 去 chrome 应用商店搜索`Redux Dev Tools`插件并安装。
2. 在项目中安装插件：
```sh
npm i redux-devtools-extension -S
```
3. 在`createStore`函数的第二个参数传递一段代码：

```js
import { createStore, applyMiddleware, combineReducers } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import todoReducer from "./reducers/todo"
import menuReducer from "./reducers/menu"

const store = createStore(
  combineReducers({
    todo: todoReducer,
    menu: menuReducer
  }),
  composeWithDevTools() // 使用开发工具扩展
)
```
但是这样就把`applyMiddleware`的位置挤掉了，如果想同时使用`applyMiddleware`和`composeWithDevTools`的话，可以在`composeWithDevTools`的参数中传递`applyMiddleware`即可。
```js
import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"

import todoReducer from "./reducers/todo"
import menuReducer from "./reducers/menu"

const store = createStore(
  combineReducers({
    todo: todoReducer,
    menu: menuReducer
  }),
  composeWithDevTools(applyMiddleware(thunk))
)

export default store

```

<Vssue />