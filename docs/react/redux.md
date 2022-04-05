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

## Reducer

真正的更新 Store 里面的`state`，是由`reducer`去完成的，`action`的作用是派发通知给`reducer`。所以说，`reducer`本质上为了处理`action`而诞生的一个函数。

reducer 接收两个参数，一个是初始化的 state 对象，一个是当前传进来的 action。reducer 不能将原有的 state 对象更改，且必须<u>返回一个新的 state 对象</u>，换言之，每次处理 action 时，应该将一份 state 对象深拷贝，并在拷贝后的对象内进行操作，然后将这个新的对象返回。

```js
/* /store/reducer.js */

import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM } from "./actionTypes";

const defaultState = {
  inputValue: "",
  list: ["早上4点起床，锻炼身体", "中午下班游泳一小时"],
};

const action = (state = defaultState, action) => {
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
    return newState;
  }
  if (action.type === DELETE_ITEM) {
    //删除item
    let newState = { ...state };
    newState.list.splice(action.value, 1);
    return newState;
  }
  //遇到未知的action，要将原有的state对象返回
  return state;
};

export default action;
```

reducer 需要挂载到`createStore`函数中的第一位参数：

```js
/* /store/index.js */
import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(reducer);

export default store;
```

结合上面的`action`和`reducer`，下面的代码是一个增删 todoList 的例子：

```jsx
import React from "react";
import store from "../../store/index";

import { Input, Button, List } from "antd";

import {
  changeInputAction,
  addItemAction,
  deleteItemAction,
} from "../../store/actionCreators";

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(this.storeChange); //订阅Redux的状态，传递一个监听器函数
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
  /**
   * 监听状态变化，同步到组件state
   */
  storeChange = () => {
    this.setState(store.getState());
  };
  render() {
    return (
      <>
        <div style={{ margin: "20px" }}>
          <Input
            value={this.state.inputValue}
            placeholder="Basic usage"
            onChange={this.inputChange}
            style={{ width: "250px", margin: "0 10px 10px 0" }}
          />
          <Button type="primary" onClick={this.addItem}>
            Add
          </Button>

          <List
            size="small"
            bordered
            dataSource={this.state.list}
            style={{ width: "250px" }}
            renderItem={(item, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "3px 10px",
                }}
              >
                <div>{item}</div>
                <Button
                  type="danger"
                  size="medium"
                  onClick={() => this.deleteItem(index)}
                >
                  Delete
                </Button>
              </div>
            )}
          />
        </div>
      </>
    );
  }
}

export default index;
```

## Redux Dev Tools

1. 去 chrome 应用商店搜索`Redux Dev Tools`插件并安装。
2. 在`createStore`函数的第二个参数传递一段代码：

```js
import { createStore } from "redux";
import reducer from "./reducer";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

<Vssue />