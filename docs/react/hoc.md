# 高阶组件

## 高阶组件（HOC）
**Higher-OrderComponent** 和`render-props`模式一样，高阶组件主要的目的是为了实现状态逻辑复用。

高阶组件本质上是一个函数，用于包装对应的组件，使其获得对应的状态逻辑，增强组件的功能。类似于js中的工厂函数，生产具有特定属性的对象。
```js
function production() {
  const obj = new Object()
  obj.name = 'Tom'
  obj.age = 18
  return obj
}
```
高阶组件约定名称以`with`开头，接收一个组件作为参数。
```js
/**
 * WrappedComponent参数是一个组件，所以以大写字母开头
 */
function withMouse(WrappedComponent) { }
```

1. 高阶组件内部创建一个类，这个类提供了组件需要的状态逻辑。
2. 这个类的`render`方法将传递进来的组件返回，并提供复用的state和props给这个组件。
3. 高阶组件函数将这个类返回。
```jsx
//获取鼠标坐标的HOC
function withMouse(WrappedComponent) {
  class Mouse extends React.Component {
    state = {
      x: 0,
      y: 0
    }
    handleMouseMove = e => {
      this.setState({ x: e.clientX, y: e.clientY })
    }
    componentDidMount() {
      window.addEventListener("mousemove", this.handleMouseMove)
    }
    compnentWillUnmount() {
      window.removeEventListener("mousemove", this.handleMouseMove)
    }
    render() {
      //将传递进来的这个组件包装一下，给它state和props
      return <WrappedComponent {...this.state} {...this.props}></WrappedComponent>
    }
  }
  return Mouse
}
```
4. 然后在外界，通过调用HOC包装对应组件，使其拥有对应的state和props。
```jsx
class Position extends React.Component {
  render() {
    return (
      <p>
        横坐标：{this.props.x} <br />
        纵坐标：{this.props.y}
      </p>
    )
  }
}

//包装Position组件，赋予其状态逻辑
const PositionMouse = withMouse(Position)

class App extends React.Component {
  render() {
    return <PositionMouse></PositionMouse>
  }
}
```

---

如果这个HOC包装类多个组件，那么在`React Development Tools`调试工具中，这些组件的名称都会是`Mouse`，因为这些包装后的组件其实就是HOC的返回值，也就是上例中的`Mouse`组件。这样不方便我们进行调试。

![HOC](/assets/img/hoc.png)

解决方案：React组件都有一个`displayName`的静态属性，该属性的值决定了该组件在`React Development Tools`调试工具中展示的名称。
```jsx
function withMouse(WrappedComponent) {
  class Mouse extends React.Component {
    /* ... */
  }
    
  //将Mouse组件取名为传递进来的需要包装的那个组件名称
  Mouse.displayName = WrappedComponent.displayName || WrappedComponent.name || "Component"
    
  return Mouse
}
```