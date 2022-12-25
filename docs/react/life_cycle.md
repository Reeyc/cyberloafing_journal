# 生命周期

react 中的class组件拥有生命周期（函数组件没有生命周期），class组件的生命周期也经历 4 个阶段：

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

### render <Badge text="常用"/>

页面`state`或`props`发生变化时执行，该函数用于返回 reactDOM。在这里不能调用`setState`，否则将会造成递归更新，死循环。

### componentDidMount <Badge text="常用"/>

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
    console.log("----------DOM挂载之前：", this.refs.content);
  }
  render() {
    console.log("----------DOM挂载中");
    return <div ref="content">{this.state.content}</div>;
  }
  componentDidMount() {
    console.log("----------DOM挂载完毕：", this.refs.content);
  }
}
```

## Updating 阶段

该阶段为组件更新阶段。触发组件更新有三种情况：

1. 调用`setState()`。
2. 当接收到新的`props`。
3. 调用`fouceUpdate()`强制更新。

### shouldComponentUpdate

控制更新组件的阀门。它会在组件更新之前执行，且要求必须返回一个布尔类型的结果：

- 返回`true`，就同意组件更新。
- 返回`false`，就反对组件更新。

`shouldComponentUpdate`默认返回`true`，它有两个参数，参数一是改变后的 props，参数二是改变后的 state。将来可以利用这两个参数来判断是否需要更新组件，避免频繁执行`render`，造成没必要的性能消耗。

### componentWillUpdate <Badge type="warning" text="17.0版本已废弃"/>

该函数在组件更新之前，且`shouldComponenUpdate`返回`true`之后执行。

### componentDidUpdate

组件更新之后执行，此时的 DOM 也已经更新完毕，可以在此获取到最新的 DOM。

该函数的参数是更新之前的`props`和更新之前的`state`。在该函数调用`setState()`也会导致递归更新，最好的方式就是调用之前加上判断条件：

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
    console.log( "----------控制组件更新的阀门：", nextProps, nextState);
    return true;
  }
  componentWillUpdate() {
    console.log("----------DOM更新前执行");
  }
  componentDidUpdate(preProps, preState) {
    console.log("----------DOM更新完毕");
    if (preProps.content !== this.props.content) {
      //props发生了变化，可以更新state了
      this.setState({});
    }
  }

  inputChange(e) {
    this.setState({ content: e.target.value });
  }
}
```

:::tip
`componentDidUpdate`还有第三个参数，该参数可以获取`getSnapshotBeforeUpdate`传递下来的快照信息。详细可以看 [getSnapshotBeforeUpdate](/react/life_cycle.html#getsnapshotbeforeupdate) 。
:::

## Unmounting 阶段

### componentWillUnmount <Badge text="常用"/>

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
    console.log( "----------控制组件更新的阀门：", nextProps, nextState);
    return true;
  }
  componentWillUpdate() {
    console.log("----------DOM更新前执行");
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

当组件接收的`props`更新时，触发`componentWillReceiveProps`钩子函数。传递进来的参数就是更新后的`props`。注意，首次传递的`props`不会触发该函数。

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
  componentWillReceiveProps(props) {
    console.log("----------父组件重新渲染：", props);
  }
}
```

## forceUpdate

`forceUpdate`不是一个钩子函数，而是组件原型上的方法，通过组件实例可以直接调用，主要用于强制更新组件，且不受`shouldComponentUpdate`阀门的影响。

当你没有修改任何状态，而是纯粹的想让组件更新，可以使用`forceUpdate`。
```jsx {16}
class Example extends React.Component {
  state = {
    content: "hello world"
  }
  constructor(props) {
    super(props);
    console.log("----------组件初始化：", this.props, this.state);
  }
  render() {
    console.log("----------DOM挂载中")
    return <div ref="content">{this.state.content}</div>
  }
  componentDidMount() {
    console.log("----------DOM挂载完毕：", this.refs.content)
    setTimeout(() => {
      this.forceUpdate() // 3s后强制更新组件
    }, 3000)
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("----------控制组件更新的阀门：", nextProps, nextState)
    return false // 不受阀门影响
  }
  componentWillUpdate() {
    console.log("----------DOM更新前执行")
  }
  componentDidUpdate(preProps) {
    console.log("----------DOM更新完毕")
  }
  componentWillUnmount() {
    console.log("----------组件卸载：", this.props, this.state);
  }
}
```

---

:::warning
上面介绍的`componentWillMount`、`componentWillUpdate`、`componentWillReceiveProps`被加上了17.0版本即将废弃的标签，并不是指完全不能用。React规定，在17.0以后的版本要使用这几个生命周期钩子函数，需要加上`UNSAFE_`前缀，主要原因是这些生命周期用的不多，而且可能会在React的未来版本中出现 bug，尤其是在启用异步渲染之后。
:::

## getDerivedStateFromProps

`getDerivedStateFromProps`是组件的静态方法钩子函数，所以声明时必须要加上`static`关键字。该钩子函数在`render`之前执行，且是**组件初始化**跟**组件更新**都会执行。
```jsx
class Example extends React.Component {
  static getDerivedStateFromProps() {
    console.log("----------获取从props派生的状态对象")
    return {}
  }
  render() {
    console.log("----------DOM挂载中")
    return <h1>hello</h1>
  }
}
```

`getDerivedStateFromProps`接收两个参数，第一个是组件内的`props`，第二个是组件内的`state`。该函数必须要返回一个状态对象或者`null`，对象会更新组件内的`state`对象。如果返回`null`则不更新。
```jsx
class Example extends React.Component {
  render() {
    return <Child x={2} />
  }
}
```
```jsx {5}
class Child extends React.Component {
  state = { x: 1 }
  static getDerivedStateFromProps(props, state) {
    console.log("----------获取从props派生的状态对象：", props, state)
    return props // 使用props更新state
  }
  render() {
    {/** 这里输出的是 2 */}
    return <h1>{this.state.x}</h1>
  }
}
```

`getDerivedStateFromProps`的应用：

从名称中可以得知，`getDerivedStateFromProps`主要用于从`props`中获取派生的状态对象。也就是使用`props`来更新`state`对象，从而保证该组件内的`state`对象永远取决于`props`。但其实该特性完全可以使用别的方式实现，所以该钩子函数平时用的很少。
```jsx {5}
class Child extends React.Component {
  state = { x: 1 }
  constructor(props) {
    super(props)
    this.state = Object.assign(this.state, props)
  }
  render() {
    return <h1>{this.state.x}</h1>
  }
}
```

## getSnapshotBeforeUpdate

`getSnapshotBeforeUpdate`在`render`之后，`componentDidUpdate`之前执行。它用于获取组件更新前的快照。

当你已经修改了组件状态，`getSnapshotBeforeUpdate`会在最新的DOM更新完毕前执行，可以在这里获取到更新前的DOM信息（例如宽高、位置等等），并通过返回值将快照向下传递给`componentDidUpdate`。

下面是一个`getSnapshotBeforeUpdate`向`componentDidUpdate`传递快照的例子：
```jsx {29}
class App extends React.Component {
  state = {
    left: 0,
    top: 0
  }
  divRef = React.createRef()
  componentDidMount() {
    setInterval(() => {
      this.setState({ left: this.state.left + 1 })
    }, 1000)
  }
  render() {
    return (
      <div
        ref={this.divRef}
        style={{
          position: "absolute",
          left: this.state.left,
          top: this.state.top,
          width: "100px",
          height: "100px",
          backgroundColor: "pink"
        }}
      ></div>
    )
  }
  getSnapshotBeforeUpdate() {
    // 将left偏移值当做快照向下传递给componentDidUpdate
    return this.divRef.current.offsetLeft
  }
  componentDidUpdate(preProps, preState, snapshotValue) {
    // snapshotValue就是getSnapshotBeforeUpdate传递过来的快照
    if (snapshotValue % 2 === 0) {
      this.setState({ top: this.state.top + 1 })
    }
  }
}
```
## 总结React生命周期

对React的生命周期钩子函数做一下总结：

* **常用的：**
  * `render`：组件状态更新时触发。
    > 这里调用setState会无限调用，造成死循环。
  * `componentDidMount`：组件更新完毕时触发。
    > 获取最新DOM，发送ajax请求等等。
  * `componentWillUnmount`：组件卸载前触发。
    > 解绑事件，销毁全局变量、销毁定时器等等。

* **不常用的：**
  * `shouldComponentUpdate`：组件更新前，在`render`前触发。
    > 控制是否允许更新的阀门。
  * `componentDidUpdate`：组件更新完毕时触发。
    > 可获取更新后的DOM。
  * `getDerivedStateFromProps`：组件初始化和更新都会触发，在`render`前触发。
    > 当`state`完全取决于`props`时使用。
  * `getSnapshotBeforeUpdate`：组件更新前触发，在`render`后，`componentDidUpdate`前触发。
    > 保留组件更新前的快照。

* **废弃的：**
  * `componentWillMount `：组件挂载前触发。
  * `componentWillUpdate `：组件更新前触发。
  * `componentWillReceiveProps`：`props`更新时触发。
   
* **API**
  * `forceUpdate`：强制触发组件更新。

<Vssue />