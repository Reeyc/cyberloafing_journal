# 组件

React 中的组件思想和 Vue 是一样的，目的就是为了方便复用，就像搭积木一样，多个小组件可以组成一个大组件，多个大组件可以组成一个页面等等。

React 中创建组件的两种方式：

- **函数组件**：通过函数来创建组件。
- **类组件**：通过类来创建组件。

## 函数组件

函数组件通常返回一段 JSX 代码，用于描述该组件的结构。

`ReactDom.render`不仅可以渲染 React 元素，也可以渲染 React 组件。将来使用时，将该组件的名称作为组件的标签名传进 `ReactDom.render` 的第一个参数即可。组件标签可以是单闭合标签，也可以是双闭合标签。

对于函数组件，React 约定了以下内容，且必须严格执行：

- 函数名必须以**大写字母**开头，React 以此区分 React 组件和 React 元素。
- 函数必须有**返回值**，如果不需要渲染 JSX，可以返回`null`，不可以返回`undefined`。

```jsx
function Hello() {
  return <div>hello world</div>;
}

ReactDOM.render(<Hello />, document.getElementById("root"));
```

函数组件也可以用箭头函数来创建，效果是一样的。

```jsx
const Hello = () => <div>hello world</div>;

ReactDOM.render(<Hello />, document.getElementById("root"));
```

## 类组件

使用 ES6 关键字`class`创建的组件，称之为类组件。类需通过`extend`关键字继承`React.Component`父类，从而可以使用父类提供的方法和属性。

React 同样对类组件进行了约定：

- 类名必须以**大写字母**开头。
- 类里面必须有一个`render`的方法，该方法类似于函数组件，必须有返回值，且是一段 JSX 结构，如果不想渲染 JSX 可以返回`null`。

渲染类组件同样是通过`ReactDom.render`来渲染。

```jsx
class Hello extends React.Component {
  render() {
    return <div>hello world</div>;
  }
}

ReactDOM.render(<Hello />, document.getElementById("root"));
```

## 组件抽离

一个项目中可能会有许许多多的组件，不可能将所有的组件都写在一个 JS 文件中。通常情况下，应该利用 ES6 的模块化语法将组件放到一个个不同的文件中，将组件抽离成一个个单独的个体，从而提升项目整体的可维护性。

上面是将`<Hello />`组件抽离出去的一个示例。

```jsx
//Hello.js
import React from "react";

class Hello extends React.Component {
  render() {
    return <div>hello world</div>;
  }
}

export default Hello;
```

```jsx
//index.js
import ReactDom from "react-dom";

import Hello from "./Hello";

ReactDom.render(<Hello />, document.getElementById("root"));
```

## 组件事件

React 跟 Vue 一样，也在模板中直接绑定事件，React 绑定事件语法与原生 Dom 绑定事件语法相似。

语法：`on+事件名称={事件响应函数}`
:::warning
React 事件采用驼峰命名法。
:::

### 绑定事件

函数组件中绑定事件：

```jsx
function Hello() {
  function handleClick() {
    console.log("函数组件点击事件触发");
  }

  return <button onClick={handleClick}>click</button>;
}
```

类组件中绑定事件：

```jsx
class Hello extends React.Component {
  handleClick() {
    console.log("类组件点击事件触发");
  }
  render() {
    return <button onClick={this.handleClick}>click</button>;
  }
}
```

### 事件对象

React 事件获取事件对象，Vue 是在绑定事件时传递一个`$event`参数来获取，而 React 获取事件对象则和原生 JS 一样，在事件响应函数内通过第一个参数获取。

:::warning
React 中的事件也叫合成事件，React 内部作了处理，其事件对象兼容所有的浏览器，将来不必担心兼容性的问题。
:::

下面是一个通过事件对象阻止浏览器默认行为的例子：

```jsx
class Hello extends React.Component {
  handleClick(e) {
    e.preventDefault();
    console.log("a标签的点击事件触发");
  }
  render() {
    return (
      <a href="https://www.baidu.com" onClick={this.handleClick}>
        click
      </a>
    );
  }
}
```

### 事件响应函数内的 this

在 JSX 中绑定事件，事件响应函数内的`this`为`undefined`，这不是 React 的问题，而是 Javascript 本就存在的。如果你将函数赋值给一个变量，然后通过变量调用函数，此时函数内部的 this 就会丢失。

```js
const obj = {
  x: 1,
  func() {
    console.log(this.x);
  },
};

obj.func(); //1

const temp = obj.func;
temp(); //在严格模式下，此时的this为undefined，打印undefined.x就会直接报错了
```

#### 解决方案

- 通过箭头函数：箭头函数内部没有 this，其里面的 this 是词法环境的 this，也就是外层的 this。这样通过 this 就能获取到实例了。

```jsx
class Hello extends React.Component {
  state = {
    count: 0,
  };
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.handleClick}>click</button>
      </div>
    );
  }
}
```

- 通过`bind`显式绑定：可以在绑定事件函数时，可以通过`bind`方法，动态绑定当前实例为响应函数内的 this。

```jsx
class Hello extends React.Component {
  state = {
    count: 0,
  };
  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.handleClick.bind(this)}>click</button>
      </div>
    );
  }
}
```

<Vssue />