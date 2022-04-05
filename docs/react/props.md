# Props

React 的`props`属性主要用于组件间的通信。

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

- 子组件如果是**类组件**，需要通过`this.props`来获取传递过来的数据。

```jsx {5}
import React from "react";

class Example extends React.Component {
  render() {
    return <h1>{this.props.content}</h1>;
  }
}

export default Example;
```

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

兄弟组件通信其实是结合了父传子 + 子传父的方式来实现的。首先两个兄弟组件都拥有一个共同的父组件，作为两个组件沟通的桥梁。

- 传输方：向父组件传输数据。
- 接收方：接受从父组件传递过来的数据。

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

## Props 的初始化

使用类组件时，如果使用了`constructor`构造函数：

```jsx {12}
class Hello extends React.Component {
  state = {
    x: 1,
  };
  render() {
    return <Child x={this.state.x} />;
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    console.log(this.props);
  }
  render() {
    return <div>hello {this.props.x}</div>;
  }
}
```

1. 必须在构造函数内调用`super()`，这是因为发生类继承时，要先初始化父类，完成子类实例的塑造。
2. 必须将`props`传递给`super`，也就是父类的构造函数，否则无法在构造函数内使用`this.props`，因为`React.Component`内部需要将`props`初始化。

```js
// React.Component
class Component {
  constructor(props) {
    this.props = props;
    // ...
  }
}
```

而实际上即使你调用`super()`不传`props`, 仍然能在`render`里访问`this.props`，这是因为调用`super`后，React 将`props`赋值在实例对象上。

```js
const instance = new YourComponent(props);
instance.props = props;
```

但是在构造函数内不能通过`this`访问`props`，因为`props`是初始化完毕之后赋值给实例对象的。

```jsx
class Child extends React.Component {
  constructor(props) {
    super();
    console.log(this.props); //undefined
  }
  render() {
    return <div>hello {this.props.x}</div>;
  }
}
```

### 单项数据流的概念

和 vue 一样，react 倡导单向数据流，主要是项目越来越复杂时，组件互相影响加上复用会使 debug 的成本会非常高。

当父组件传值给子组件时，子组件不能直接通过`props`修改父组件传过来的数据，这样会违背单向数据流的概念。所以，react 将`props`对象定义成**只读**的，换言之，我们不能修改`props`对象内的数据。

```jsx
//父
class App extends React.Component {
  render() {
    return <Example content={"hello"} />;
  }
}
```

```jsx
//子
class Example extends React.Component {
  handleClick() {
    // TypeError: Cannot assign to read only property 'content' of object '#<Object>'
    this.props.content = "update";
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>click</button>;
  }
}
```

## props.children

`props.children`表示组件标签的子节点，当组件标签内有子节点时，props 就会有该属性。

```jsx
class App extends React.Component {
  render() {
    return (
      <Child>
        文本节点
        <p>JSX节点</p>
        <Test>组件节点</Test>
        {() => {}}
      </Child>
    );
  }
}

class Child extends React.Component {
  render() {
    console.log(this.props);
    return null;
  }
}
```

组件标签内的子节点包括：文本节点、react 元素节点、组件节点、或者是函数节点。

- 当子节点只有一个时，`props.children`为对应的子节点。
- 当子节点为多个时，`props.children`为一个数组，数组的每个元素对应每个子节点。

## 类型校验

为了将来方便维护，建议父组件向子组件传递数据时，对数据进行校验。

需要先引入`PropTypes`，这个包在通过`create-react-app`脚手架创建项目时，就已经自动帮我们安装了。

```js
import PropTypes from "prop-types";
```

引入后，就可以在接收数据的组件下方使用，注意是组件的下方，而不是在组件里边。

```jsx
//子
class Example extends React.Component {
  handleClick() {
    // TypeError: Cannot assign to read only property 'content' of object '#<Object>'
    this.props.content = "update";
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>click</button>;
  }
}

//约束
Example.propTypes = {
  content: PropTypes.string, //传过来的content必须是string类型
  data: PropTypes.object.isRequired, //传过来的data必须是object类型，且不可省略
};
```

`propTypes`常见的约束类型：string、number、bool、object、array、func

```js
//约束
Child.propTypes = {
  val1: PropTypes.string, //必须是string类型
  val2: PropTypes.number, //必须是number类型
  val3: PropTypes.bool, //必须是boolean类型
  val4: PropTypes.object, //必须是对象
  val5: PropTypes.array, //必须是数组
  val6: PropTypes.func, //必须是函数
};
```

### 约束特定结构的对象

`propTypes.shape`用于约束特定结构的对象。

```js
/**
 * 传进来的val是一个对象，且必须为以下结构
 * name的值是一个字符串，且不可省略
 * age的值是一个数值
 * flag的值是一个布尔值
 */
Child.propTypes = {
  val: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    flag: PropTypes.bool,
  }),
};
```

### 使用默认值

`defaultProps`可以为传过来的数据提供默认值。

```js
//约束
Example.propTypes = {
  content: PropTypes.string, //传过来的content必须是string类型
  data: PropTypes.object.isRequired, //传过来的data必须是number类型，且不可省略
};

//默认
Example.defaultProps = {
  content: "hello react", //当content没有传过来时，其值默认为 hello react
};
```

<Vssue />