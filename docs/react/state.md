# State

React 的`state`属性主要用于管理组件内的状态。

## 有状态组件 & 无状态组件
函数组件和类组件的区别：
* 函数组件称之为：**无状态组件**。内部没有状态变化，通常只负责静态数据的展示。
* 类组件称之为：**有状态组件**。内部有数据状态发生变化，通常随着数据的变化而更新UI。

```jsx
class Hello extends React.Component {
  state = {
    count: 0
  }

  render() {
    return <h1>count: {this.state.count}</h1>
  }
}
```
上述例子中，组件内需要跟踪`count`的状态变化，此时应该使用类组件来创建。

## state & setState
state状态是私有的，只能在组件内部使用。在组件内通过 `state = {  }` 属性简写的方式声明state状态。通过`this.state`来获取状态。

`setState`方法是用来修改状态的，在React中，想要修改数据直接响应到页面上，需要调用`setState`方法来操作，参数传递的就是变化后的state内的值。而直接通过`this.state.xxx=xxx`的方式修改是不行的。这一点跟小程序的setData如出一辙。

语法：`this.setState({ 要修改的数据 })`

```jsx
class Hello extends React.Component {
  state = {
    count: 0
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 }) //Good
    this.state.count += 1 //TypeError: Cannot read properties of undefined
  }
  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.handleClick}>click</button>
      </div>
    )
  }
}
```

## 更新机制
React 为了优化性能，会将多个 `setState()` 调用合并为一次更新。以下面的代码为例：

```jsx
class Hello extends React.Component {
  state = {
    count: 0
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count)

    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count)
  }
  render() {
    console.log("render")
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.handleClick}>click</button>
      </div>
    )
  }
}
```

1. 两次同时调用了`setState()`，而`render`方法只触发了一次。
2. 每次调用`setState()`之后，`count`的值并没有立刻发生改变。

这足以说明，React的更新机制和Vue如出一辙，<u>不是每次更改状态都会立即更新渲染，而是将要更新的状态收集到队列中一起更新</u>。

---

正因为state是异步更新的，所以不能依赖他们的值来计算下一个state(状态)。

正确的做法是，将`setState`的参数写为一个回调函数，回调函数的第一个参数是最新的`state`，第二个参数是最新的`props`，返回值是state对象。这样一来，就可以在回调函数内获取到最新的state的值来进行下一步的计算了。

```jsx
class Hello extends React.Component {
  state = {
    count: 0
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 })
      
    //回调函数的参数是最新的state、最新的props
    this.setState((state, props) => {
      return { count: state.count + 1 }
    })

    //此处的打印并不会即时的变化，虽然换成了回调函数的形式，但是异步更新的机制还是不会变的
    console.log(this.state.count)
  }
  render() {
    console.log("render")
    return (
      <div>
        {/* 每次点击会加2，说明count成功的累加了2次 */}
        <div>{this.state.count}</div>
        <button onClick={this.handleClick}>click</button>
      </div>
    )
  }
}
```
可以发现`render`里面的`this.state.count`每次点击都会 +2，说明`count`成功的累加了2次。

而上面的`console.log(this.state.count)`没有即时打印出计算后的结果，则说明换成了回调函数的形式，state的更新机制还是异步的，这一点没有改变。

## setState的第二个参数
既然state的更新机制是异步更新，那么如何知道state更新完毕了呢。

在vue中，可以在`nextTick`的回调函数内捕获更新后的状态，而React也提供了一个回调函数来捕获最新的状态。这个回调函数就是`setState`的第二个参数。

```jsx
class Hello extends React.Component {
  state = {
    count: 0
  }
  handleClick = () => {
    this.setState({ count: this.state.count + 1 })

    this.setState(
      (state, props) => {
        return { count: state.count + 1 }
      },
      () => {
        //在此处可以捕捉到更新后的状态
        console.log("状态更新后：", this.state.count)
      }
    )

    //此处的打印并不会即时的变化，虽然换成了回调函数的形式，但是异步更新的机制还是不会变的
    console.log("状态更新前：", this.state.count)
  }
  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={this.handleClick}>click</button>
      </div>
    )
  }
}
```

<Vssue />