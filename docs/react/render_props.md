# Render-props

`render-props`并不是一些新的API，而是一种使用技巧，React官方也在使用的一种模式。

组件都有一个`render`方法，该方法返回一个JSX结构。而组件内通过`props`属性可以接收外界传递进来的数据，包括函数。

现在有一个获取今天日期的组件，该组件的`render`是调用外界传递进来的函数的返回值：
```jsx
class Day extends React.Component {
  getTodayDay() {
    const date = new Date()
    const Y = date.getFullYear()
    const M = date.getMonth() + 1
    const D = date.getDate()

    return `${Y}-${M}-${D}`
  }

  render() {
    //render返回一个JSX结构，将数据传递给外部，由外部定义JSX结构
    return this.props.render(this.getTodayDay())
  }
}

Day.propTypes = {
  render: PropTypes.func.isRequired
}
```

外界使用这个组件时，需要将一个带有返回JSX结构的函数传递进去：
```jsx
class App extends React.Component {
  render() {
    return (
      <Day
        render={data => {
          {/* 外部接收数据并定义JSX结构 */}
          return <h1>{data}</h1>
        }}
      ></Day>
    )
  }
}
```
这种就是`render-props`模式，有点类似于vue的scope作用域插槽：<u>由组件内部提供数据，组件外部获取数据来自定义UI</u>。

## 使用children更优雅
我们知道，在组件标签内部的节点被称之为子节点，子节点可以是一个函数，将来在组件内部可以通过`props.children`访问到这个子节点。

那么`render`函数的返回值就可以使用`children`来调用了：
```jsx
class Day extends React.Component {
  /**
   * ...
   */
  render() {
    return this.props.children(this.getTodayDay())
  }
}

Day.propTypes = {
  children: PropTypes.func.isRequired
}
```
此时外界调用组件时，应该要将函数写在组件标签的内部：
```jsx
class App extends React.Component {
  render() {
    return <Day>{data => <h1>{data}</h1>}</Day>
  }
}
```

---

官方的`context`就是使用了`render-props`模式：
```jsx
const { Consumer } = React.createContext()

/* ... */
render() {
  return (
    <div>
      <Consumer>{data => <span>{data}</span>}</Consumer>
    </div>
  )
}
```