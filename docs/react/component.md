# 组件

React 中的组件思想和 Vue 是一样的，目的就是为了方便复用，就像搭积木一样，多个小组件可以组成一个大组件，多个大组件可以组成一个页面等等。

React 中创建组件的两种方式：

- **函数组件**：通过函数来创建组件。
- **类组件**：通过类来创建组件。

---

组件三大核心属性

* **[state](/react/state.md)**：收集组件状态。
* **[props](/react/props1.md)**：收集外界传递进组件的数据。
* **[refs](/react/refs.md)**：收集组件内的DOM元素。

:::warning
函数组件不可以使用`state`和`refs`特性，react在16.8.0版本开始提供了Hooks API帮助在函数组件中使用这些特性。
:::

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

React获取事件对象和原生JS一样，在事件响应函数内通过第一个参数获取。

:::tip
1. React中采用的是**自定义事件**，也叫**合成事件**，React对事件内部作了处理，也就是把原生事件都封装了一遍，因此触发的不是原生DOM事件。其目的是为了处理浏览器的**兼容性**问题。

2. React中的事件机制都采用了 [事件委托](/js/base/event.html#事件委托) 的方式，触发的元素都委托给了最外层的元素，其目的是为了**高效**，避免每个组件的多个元素绑定相同事件。
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

### 事件参数

在绑定事件时，需要注意带括号和不带括号的区别，实际上，加上括号代表的是**函数调用**，也就是说函数会在模板渲染时就已调用，此时绑定的是函数调用的返回值。不加括号代表的是正常绑定**函数本身**。

这一点，Vue框架内部做了处理。而在React中，内部没有做处理，所以绑定事件需要注意：
```jsx {11,12}
class Hello extends React.Component {
  handleClick(e) {
    console.log("不带括号") // 初始化时不执行，点击时正常执行
  }
  handleClick2(e) {
    console.log("带括号") // 初始化时已经执行，点击不会执行
  }
  render() {
    return (
      <>
        <div onClick={this.handleClick}>click</div>
        <div onClick={this.handleClick2()}>click2</div>
      </>
    )
  }
}
```

但是有的情况需要自己传递一些自定义的参数到事件函数内，就不可避免的需要加上括号了。此时有两种方式可以避免绑定事件为返回值`undefined`的问题：

1. 绑定内联函数，在内联函数内获取事件对象，再调用外层事件函数传递**事件对象**和**自定义参数**。

```jsx {10-12}
class Hello extends React.Component {
  handleClick(e, params) {
    console.log(e, params, "带括号")
  }
  render() {
    return (
      <>
        {/* 传递自定义参数 */}
        <div
          onClick={event => {
            this.handleClick(event, "cuctom")
          }}
        >
          click
        </div>
      </>
    )
  }
}
```

2. 将事件函数的返回值设置为一个**高阶函数**，这种方式就是应用了函数柯里化的写法 <Badge text="推荐"/>。

:::tip 高阶函数的定义
当一个函数符合下面两个规范中的任何一个，那么该函数就是高阶函数。
1. 函数A接收一个函数作为**参数**。
2. 函数A的**返回值**是一个函数。

出现上面两种情况之一，函数A就可称为高阶函数。
:::
```jsx {4-6}
class Hello extends React.Component {
  handleClick(params) {
    // 绑定的函数内返回一个函数，这个返回的函数才是真正的事件处理函数
    return e => {
      console.log(e, params, "带括号")
    }
  }
  render() {
    return (
      <>
        {/* 传递自定义参数 */}
        <div onClick={this.handleClick('custom')}>click</div>
      </>
    )
  }
}
```

### 事件响应函数内的 this

在JSX中绑定事件，事件响应函数内的`this`为`undefined`，这不是React的问题，而是Javascript本就存在的特性。函数内部的`this`在执行时绑定，而非定义时。而React的执行环境为严格模式，如果没有显式的指定函数调用对象，那么函数内的`this`为`undefined`。

```js
const obj = {
  x: 1,
  func() {
    console.log(this.x);
  },
};

obj.func(); //1

const temp = obj.func;

//在严格模式下，此时的this为undefined，打印undefined.x就会直接报错了
temp();
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

## 组件更新机制

在React中，父组件重新渲染时，也会重新渲染子组件，但只会渲染当前组件子树（局部渲染,当前组件以其所有子组件）。

![React组件更新机制](/assets/img/component-update.png)

上图中，组件`<App>`内包含两个`<Parent>`组件，每个`<Parent>`组件内又分别包含两个`<Child>`组件：

> 当`<Parent>`组件更新时，其对应的两个`<Child>`组件也会更新。其同级的`<Parent>`组件和其子组件不会更新。而当`<App>`组件更新时，图上所有的组件都会更新，因为所有的组件都是`<App>`组件的子组件。

正是这种机制，会引发效率上的问题：当组件更新时，会带动该组件下的所有子组件一起更新，如果子组件需要的状态没有发生变化，那么这个子组件就没必要更新，避免造成性能的消耗。

---

下面是两个优化方案：


### shouldComponentUpdate

`shouldComponentUpdate`是一个 [生命周期](/react/life_cycle.html#shouldcomponentupdate) 钩子函数，它在组件的`render`函数之前执行。

- 参数：变化后的`props`，变化后的`state`。
- 返回值：必须返回一个布尔类型的值，该值用于决定`render`函数是否执行。

思路：在子组件内部，通过`shouldComponentUpdate`的参数来判断，变化前后的`props`和`state`来决定组件是否更新，来减少性能的消耗。

下面是一个获取随机数的例子，当连续两次获取到的随机数一样，不触发组件更新：

```jsx {18-21}
class App extends React.Component {
  state = { count: 0 }
  handleClick = () => {
    this.setState(state => ({ count: Math.floor(Math.random() * 3) }))
  }
  render() {
    console.log("根组件更新")
    return (
      <>
        <button onClick={this.handleClick}>获取随机数</button>
        <Example count={this.state.count} />
      </>
    )
  }
}

class Example extends React.Component {
  shouldComponentUpdate(nextProps) {
    // 当count的值和上次一样，不触发组件更新
    return this.props.count !== nextProps.count
  }
  render() {
    console.log("子组件更新")
    return <div>{this.props.count}</div>
  }
}
```

### React.PureComponent

`React.PureComponent`和`React.Component`相似，区别在于`PureComponent`是纯组件，内部实现了`shouldComponentUpdate`自动对比`props`和`state`，而不需要我们再去手动对比。

PrueComponent对比规则：
- 基本类型：对比值。
- 引用类型：对比引用地址。

`PrueComponent`不会去对比对象的深层属性，换言之，如果对象中包含复杂的结构，此时要拷贝一份对象，覆盖原对象的引用地址，才能触发`PrueComponent`的对比规则。

---

如下代码中，`newObj`其实只是把`obj`对象复制了过来，而他们两的引用地址是没有发生改变的，所以在`<Example>`组件中，`this.props.obj === nextProps.obj`，因此`<Example>`组件永远也不会触发`render`更新。

```jsx {6}
class App extends React.Component {
  state = {
    obj: { count: 0 }
  }
  handleClick = () => {
    const newObj = this.state.obj // 相同引用地址
    newObj.count = Math.floor(Math.random() * 3)

    this.setState(state => {
      return { obj: newObj }
    })
  }
  render() {
    console.log("根组件更新")
    return (
      <>
        <button onClick={this.handleClick}>获取随机数</button>
        <Example obj={this.state.obj} />
      </>
    )
  }
}

class Example extends React.PureComponent {
  render() {
    console.log("子组件更新")
    return <div>{this.props.obj.count}</div>
  }
}
```

正确的写法是将引用类型拷一份出来，用一个新的对象来赋值，这样两个对象就属于不同的引用地址，就能有效的触发`React.PureComponent`内部的对比规则了。

```js {2}
handleClick = () => {
  const newObj = { ...this.state.obj } // 新的引用地址
  newObj.count = Math.floor(Math.random() * 3)

  this.setState(state => {
    return { obj: newObj }
  })
}
```

<Vssue />