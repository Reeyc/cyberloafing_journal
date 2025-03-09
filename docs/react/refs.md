# Refs

React的`refs`属性用于管理组件内所标识的DOM元素。

通过`ref`来绑定DOM元素有三种方式：

## 字符串

在`render`函数里面，通过`ref`属性赋值一个字符串可以绑定DOM元素，此时被绑定的DOM元素就会保存在组件的`refs`对象内，通过对象访问`ref`属性的值就能获取到所绑定的DOM元素。

```jsx
class App extends React.Component {
  getInputRef = () => {
    { /* 2.在refs对象内，通过ref属性的值，访问所绑定Input元素 */ }
    const { inputRef } = this.$refs
    console.log(inputRef)
  }
  render() {
    return (
      <div>
        { /* 1.ref属性绑定Input元素 */ }
        <input ref="inputRef" type="text" />
        <button onClick={this.getInputRef}>获取InputRef</button>
      </div>
    )
  }
}
```

和vue一样，react的`ref`属性可以绑定DOM元素，也可以绑定组件。绑定DOM元素时，通过`ref`获取到的就是DOM元素。绑定组件时，获取到的则是组件实例。

```jsx
class App extends React.Component {
  getRef = () => {
    const { inputRef, childRef } = this.$refs
    console.log(inputRef) // Input元素
    console.log(childRef) // Child组件实例
  }
  render() {
    return (
      <div>
        <input ref="inputRef" type="text" />
        <Child ref="childRef" />
        <button onClick={this.getRef}>获取Ref</button>
      </div>
    )
  }
}
```

:::danger 废弃
注意，String 类型的 Refs 已经过时，React官方表示将在未来的版本中废弃这种方式，推荐使用下面两种方式。
:::

## 回调函数

`ref`属性不仅可以赋值字符串、还可以赋值回调函数，或者对象。当值为函数时，函数在DOM元素或组件加载完毕时触发，参数就是当前所关联的**DOM元素**或者**组件实例**。

函数书写可以是内联函数，或者是`render`之外的函数：

```jsx
class App extends React.Component {
  getChildRef = e => {
    console.log(e) // 输出 Child 组件实例
  }
  render() {
    return (
      <div>
        {/* 输出 Input 元素 */}
        <input ref={e => console.log(e)} type="text" />
        <Child ref={this.getChildRef} />
      </div>
    )
  }
}
```

:::warning 注意
若使用的是内联函数的形式，当**数据更新**时，该内联函数会执行两次，第一次被传入的参数是`null`，第二次才能正常获取到DOM元素或组件实例。原因是因为`render`重新加载之前，里面的内联函数被释放了。

```jsx
class App extends React.Component {
  state = { x: 1 }
  getChildRef = e => {
    console.log(e) // 输出Child组件实例
  }
  changeX = () => {
    this.setState({ x: this.state.x + 1 })
  }
  render() {
    console.log("render重载")
    return (
      <div>
        {/* 更新时，第一次输出：null */}
        {/* 更新时，第二次输出：Input元素 */}
        <input ref={e => console.log(e)} type="text" value={this.state.x} readOnly />
        <Child ref={this.getChildRef} />

        <button onClick={this.changeX}>更新render</button>
      </div>
    )
  }
}
```

不过这种官方表示这种影响是无关紧要的，如果想要避免，也可以采用`render`之外的函数，这样就不会受`render`重载的影响。
:::


## React.createRef

`React.createRef` 这个API返回一个**ref对象**，可以把该对象绑定到`ref`属性上，当DOM挂载完毕时，可以通过该对象的`current`属性获取到绑定的DOM元素。

```jsx
class App extends React.Component {
  // 1. React.createRef()返回一个ref对象
  inputRef = React.createRef()
  getInputRef = () => {
    // 3. DOM挂载完毕后，可以通过ref对象.current属性获取到元素
    console.log(this.inputRef.current)
  }
  render() {
    return (
      <div>
        { /* 2. 把ref对象挂载到ref属性上 */ }
        <input ref={this.inputRef} type="text" />
        <button onClick={this.getInputRef}>获取InputRef</button>
      </div>
    )
  }
}
```

一个**ref对象**只能储存一个被绑定的DOM元素。若绑定多个元素，则后绑定的元素会覆盖先绑定的元素。

```jsx
class App extends React.Component {
  myRef = React.createRef()
  getRef = () => {
    console.log(this.myRef) // {current: Child}
  }
  render() {
    return (
      <div>
        <input ref={this.myRef} type="text" />
        <Child ref={this.myRef} />
        <button onClick={this.getRef}>获取Ref</button>
      </div>
    )
  }
}
```

多个DOM元素只能通过多个**ref对象**来储存：

```jsx
class App extends React.Component {
  inputRef = React.createRef()
  childRef = React.createRef()
  getRef = () => {
    console.log(this.inputRef) // {current: input}
    console.log(this.childRef) // {current: Child}
  }
  render() {
    return (
      <div>
        <input ref={this.inputRef} type="text" />
        <Child ref={this.childRef} />
        <button onClick={this.getRef}>获取Ref</button>
      </div>
    )
  }
}
```

:::warning 注意
使用 `React.createRef()` 来绑定组件时，组件必须是**class组件**，**函数组件**是无法获取到实例的。如上面例子中，`<Child />`组件必须是class组件。
:::

在类组件中，`ref`会直接绑定到类实例，可以通过`this.refName.current`访问到类的实例，并调用其方法。

但是函数组件没有实例的概念，它仅仅是一个纯函数，渲染并返回UI。也就是说，传递给函数组件的`ref`会丢失，无法直接绑定到该组件的实例。

## forwardRef

`forwardRef`用于解决函数组件无法接收`ref`的问题，它让你能够将`ref`转发到函数组件内部的DOM元素或者其他子组件中。

`forwardRef`是一个函数，它接受一个函数组件作为参数，并返回一个新的组件。这个新组件可以将`ref`属性转发给其子组件：

```jsx
// 函数组件（使用了forwardRef进行包裹）
const MyButton = React.forwardRef((props, ref) => {
  return <button ref={ref}>Click me</button>
})

function App() {
  const buttonRef = React.createRef()

  const handleClick = () => {
    //可以通过 ref 调用 MyButton 内部的 DOM 元素方法
    buttonRef.current.focus()
  }

  return (
    <div>
      <MyButton ref={buttonRef} />
      <button onClick={handleClick}>Focus the button</button>
    </div>
  )
}
```
上述例子中，`<APP/>`将`ref`传递给`<MyButton/>`，而`<MyButton/>`组件使用了`forwardRef`进行包裹，因此当你在`<APP/>`调用`buttonRef.current.focus()`时，实际上是调用了`<MyButton/>`组件内的button元素的`focus()`方法。

<Vssue />