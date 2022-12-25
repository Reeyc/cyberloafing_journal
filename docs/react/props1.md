# Props（上）

React 的`props`属性主要用于组件间的数据传递。

## 父子组件通信

### 父组件传值给子组件

父组件在使用子组件的时候，通过给子组件传递自定义属性 `key=value` 的形式传递数据给子组件。

```jsx {8}
import React from "react";
import ReactDOM from "react-dom";

import Example from "./Example";

class App extends React.Component {
  render() {
    return <Example content={"hello"} />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```

子组件通过`props`属性接收。

- 子组件如果是**函数组件**，函数的第一个参数就是`props`。

```jsx {4}
import React from "react";

function Example(props) {
  return <h1>{props.content}</h1>;
}

export default Example;
```

- 子组件如果是**class组件**，需要通过`this.props`来获取传递过来的数据。

```jsx {5}
import React from "react";

class Example extends React.Component {
  render() {
    return <h1>{this.props.content}</h1>;
  }
}

export default Example;
```

:::tip 批量传递
利用对象解构的方式可以批量传递多个数据：
```jsx {9}
class App extends React.Component {
  params = {
    x: 1,
    y: 2
  }
  render() {
    return (
      <div className="App">
        <Child {...this.params}></Child>
      </div>
    )
  }
}
```
:::

---

### 子组件传值给父组件

子组件传值给父组件，利用的也是`props`的方式。

父组件将自己的方法传递给子组件，并在方法内接受值。

```jsx {7,8,9,12}
import React from "react";
import ReactDOM from "react-dom";

import Example from "./Example";

class App extends React.Component {
  parentMethod(data) {
    console.log(data);
  }

  render() {
    return <Example method={this.parentMethod.bind(this)} />;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
```

子组件通过`props`调用父组件传递过来的方法，并从参数中传值过去。

```jsx {5}
import React from "react";

class Example extends React.Component {
  emitMethod = () => {
    this.props.method("hello world");
  };

  render() {
    return <button onClick={this.emitMethod}>send</button>;
  }
}

export default Example;
```

## 兄弟组件通信

### 状态提升
结合了父传子 + 子传父的方式来实现。将两个兄弟组件共有的父组件作为两个组件沟通的桥梁。

- 传输方：向父组件传输数据。
- 接收方：接受从父组件传递过来的数据。

这种方式官方称之为[状态提升](https://react.docschina.org/docs/lifting-state-up.html)，顾名思义，将两个组件需要的状态state提升至父组件来管理。

```jsx {11,12,20,26}
class Parent extends React.Component {
  state = {
    count: 0,
  };
  handleCount = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <>
        <Child1 count={this.state.count} />
        <Child2 handleCount={this.handleCount} />
      </>
    );
  }
}

class Child1 extends React.Component {
  render() {
    return <div>count: {this.props.count}</div>;
  }
}

class Child2 extends React.Component {
  emitHandleCount = () => {
    this.props.handleCount();
  };
  render() {
    return <button onClick={this.emitHandleCount}>click</button>;
  }
}
```

### 发布订阅

发布订阅是常用于实现异步通信的一种方式。可以自己手写一个发布订阅模式，也可以使用现成的库：
```shell
npm i pubsub-js
```
```js
import PubSub from "pubsub-js"
```
`pubsub-js`是一个用于实现发布订阅效果的js库。

- `subscribe()`用于接收消息，参数一是接收的消息名称，参数二是接收到消息时执行的回调函数，回调的参数就是<u>消息名称</u>和发布时携带过来的<u>数据</u>。
- `publish()`用于发布消息，参数一是发布的消息名称，参数二是携带的数据。

如果组件A要向组件B通信，那么在组件B内使用`subscribe()`订阅消息，接收数据。组件A内使用`publish()`发布消息，传送数据，即可实现兄弟组件通信。

```jsx {16-18,30}
class Parent extends React.Component {
  render() {
    return (
      <>
        <Child1 />
        <Child2 />
      </>
    )
  }
}

class Child1 extends React.Component {
  state = { count: 0 }
  componentDidMount() {
    // 订阅消息
    PubSub.subscribe("countChange", (_, count) => {
      this.setState({ count })
    })
  }
  render() {
    return <div>count: {this.state.count}</div>
  }
}

class Child2 extends React.Component {
  state = { count: 0 }
  handleCount = () => {
    this.setState({ count: this.state.count + 1 }, () => {
      // 发布消息
      PubSub.publish("countChange", this.state.count)
    })
  }
  render() {
    return <button onClick={this.handleCount}>click</button>
  }
}
```

:::tip
发布订阅模式的应用不仅限于兄弟组件通信，凡是有能够订阅消息的组件和发布消息的组件，就能实现通信。
:::

:::warning 注意
但需要注意的是，当组件A要发布消息时，必须保证组件B已经提前订阅了消息，否则是无法收到消息的。例如，组件A发布了消息，此时组件B还未渲染，组件B就无法收到该消息。
:::

## 跨级组件传值

当组件嵌套了多级，从最外层的组件想要传值给最内层的组件，通过`props`的方式需要一级一级传递，太过于繁琐。此时可以使用`context`的方式来传值。

1. 首先获取`Provider`和`Consumer`两个内置组件。

```js
const { Provider, Consumer } = React.createContext();
```

2. `Provider`组件用于提供数据，它包裹在最外层需要提供数据的组件外面。并通过`value`属性来传递数据。

```jsx
class App extends React.Component {
  render() {
    return (
      {/** <App>组件通过Provider向下传递数据 */}
      <Provider value="hello world">
        <Title></Title>
      </Provider>
    )
  }
}
```

3. `Consumer`组件用来消费数据，也就是接收。它在需要获取数据的组件里使用。其内部有一个回调函数，回调函数的参数就是`Provider`组件提供的数据。

```jsx
class Title extends React.Component {
  render() {
    return <SubTitle></SubTitle>;
  }
}

class SubTitle extends React.Component {
  render() {
    return (
      <>
        {/** 在<SubTitle>组件里面获取App组件传递过来的值 */}
        <Consumer>{(data) => <span>{data}</span>}</Consumer>
        <Child></Child>
      </>
    );
  }
}

class Child extends React.Component {
  render() {
    return (
      <div>
        {/** 在<Child>组件里面获取App组件传递过来的值 */}
        <Consumer>{(data) => <span>{data}</span>}</Consumer>
      </div>
    );
  }
}
```

<Vssue />