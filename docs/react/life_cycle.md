# 生命周期

react 中的类组件拥有生命周期（函数组件没有生命周期），类组件的生命周期也经历 4 个阶段：

- **`Initialization`**：初始化阶段。
- **`Mounting`**：挂载阶段。
- **`Updation`**：更新阶段。
- **`Unmounting`**：销毁阶段

每个阶段都会自动执行对应的钩子函数。例如我们熟知的`render`就是一个生命周期钩子函数，它在 state 数据发生变化时执行。

:::danger
`constructor`并不算是生命周期函数，它是类创建时执行的构造函数，虽然性质跟生命周期钩子函数很像，但不能认定为生命周期函数。
:::

## Initialization 阶段

这个阶段没有生命周期钩子函数，你也可以将`constructor`当作这个阶段的钩子函数。

- `props`和`state`数据在这个阶段初始化。
- 事件处理函数在这个阶段绑定`this`。

```jsx
class Example extends React.Component {
  state = {
    content: "hello world",
  };
  constructor(props) {
    super(props);
    console.log("----------组件初始化：", this.props, this.state);
  }
  render() {
    return <div>{this.state.content}</div>;
  }
}
```

## Mounting 阶段

这个阶段为挂载阶段，表示 DOM 渲染完毕的过程。

### componentWillMount <Badge type="warning" text="17.0版本已废弃"/>

在组件即将被挂载到页面的时刻执行。

### render

页面`state`或`props`发生变化时执行，该函数用于返回 reactDOM。在这里不能调用`setState`，否则将会造成递归更新，死循环。

### componentDidMount

组件挂载到 DOM 完成时执行。在此处才能获取到完整的 DOM 来进行 DOM 操作，也推荐在此处进行 http 请求。

```jsx
class Example extends React.Component {
  state = {
    content: "hello world",
  };
  constructor(props) {
    super(props);
    console.log("----------组件初始化：", this.props, this.state);
  }
  componentWillMount() {
    console.log("----------DOM渲染之前：", this.refs.content);
  }
  render() {
    console.log("----------DOM挂载中");
    return <div ref="content">{this.state.content}</div>;
  }
  componentDidMount() {
    console.log("----------DOM渲染完毕：", this.refs.content);
  }
}
```

## Updation 阶段

该阶段为组件更新阶段。触发组件更新有三种情况：

1. 调用`setState()`。
2. 当接收到新的`props`。
3. 调用`fouceUpdate()`强制更新。

### shouldComponentUpdate

会在组件更新之前执行。它要求必须返回一个布尔类型的结果：

- 返回`true`，就同意组件更新。
- 返回`false`，就反对组件更新。

`shouldComponentUpdate`有两个参数，参数一是改变后的 props，参数二是改变后的 state。将来可以利用这两个参数来判断是否需要更新组件，避免频繁执行`render`，造成没必要的性能消耗。

### componentWillUpdate <Badge type="warning" text="17.0版本已废弃"/>

该函数在组件更新之前，且`shouldComponenUpdate`返回`true`之后执行。

### componentDidUpdate

组件更新之后执行，此时的 DOM 也已经更新完毕，可以在此获取到最新的 DOM。

该函数的参数是更新之前的 props。在该函数调用`setState()`也会导致递归更新，最好的方式就是比较`props`是否发生了变化，变化之后才调用`setState()`。

```jsx {38}
class Example extends React.Component {
  state = {
    content: "hello world",
  };
  constructor(props) {
    super(props);
    console.log("----------组件初始化：", this.props, this.state);
  }
  componentWillMount() {
    console.log("----------DOM渲染之前：", this.refs.content);
  }
  render() {
    console.log("----------DOM挂载中");
    return (
      <input
        type="text"
        value={this.state.content}
        onChange={this.inputChange.bind(this)}
      />
    );
  }
  componentDidMount() {
    console.log("----------DOM渲染完毕：", this.refs.content);
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "----------DOM更新前执行，用于判断是否允许执行componentWillUpdate：",
      nextProps,
      nextState
    );
    return true;
  }
  componentWillUpdate() {
    console.log("----------DOM更新前执行，在shouldComponentUpdate之后执行");
  }
  componentDidUpdate(prveProps) {
    console.log("----------DOM更新完毕");
    if (propProps.content !== this.props.content) {
      //props发生了变化，可以更新state了
      this.setState({});
    }
  }

  inputChange(e) {
    this.setState({ content: e.target.value });
  }
}
```

## Unmounting 阶段

### componentWillUnmount

组件卸载之前执行，此时还能获取到 props 和 state 对象。常用于**清理定时器**和**解绑全局事件**等操作。

```jsx
class Example extends React.Component {
  state = {
    content: "hello world",
  };
  constructor(props) {
    super(props);
    console.log("----------组件初始化：", this.props, this.state);
  }
  componentWillMount() {
    console.log("----------DOM挂载之前：", this.refs.content);
  }
  render() {
    console.log("----------DOM挂载中");
    return (
      <input
        type="text"
        value={this.state.content}
        onChange={this.inputChange.bind(this)}
      />
    );
  }
  componentDidMount() {
    console.log("----------DOM挂载完毕：", this.refs.content);
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(
      "----------DOM更新前执行，用于判断是否允许执行componentWillUpdate：",
      nextProps,
      nextState
    );
    return true;
  }
  componentWillUpdate() {
    console.log("----------DOM更新前执行，在shouldComponentUpdate之后执行");
  }
  componentDidUpdate() {
    console.log("----------DOM更新完毕");
  }
  componentWillUnmount() {
    console.log("----------组件卸载：", this.props, this.state);
  }

  inputChange(e) {
    this.setState({ content: e.target.value });
  }
}
```

## componentWillReceiveProps <Badge type="warning" text="17.0版本已废弃"/>

当父组件重新渲染（调用 setState）时，子组件的`componentWillReceiveProps`触发，首次渲染进来不会触发。

```jsx
//父
class App extends React.Component {
  state = {
    content: 1,
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ content: 2 });
    }, 3000);
  }
  render() {
    return <Example content={this.state.content} />;
  }
}

//子
class Example extends React.Component {
  render() {
    return null;
  }
  componentWillReceiveProps() {
    console.log("----------父组件重新渲染：", this.props);
  }
}
```
