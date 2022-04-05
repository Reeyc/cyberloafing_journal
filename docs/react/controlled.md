# 受控组件

在React中有两种处理表单的方式：
* 受控组件
* 非受控组件（Dom方式）

## 受控组件
在HTML中，表单元素是可输入的，换言之，表单元素有自己的可变状态。而React认为，所有可变的状态，都应当放入state内追踪。所以，React需要将表单组件的状态揽入state内管理。

在Vue中，有`v-model`双向绑定指令可以使Vue更方便的控制表单元素的值。而React则需要自己绑定值和监听事件来控制`state`的值。

1. 需要自己通过value绑定值。
2. 监听表单元素值的变化事件，动态修改state内的值。
```jsx
class Hello extends React.Component {
  state = {
    txt: ""
  }
  inputChange = e => {
    //2. 在事件响应函数内动态修改state内的值
    this.setState({ txt: e.target.value })
  }
  render() {
    return (
      <div>
        {/* 1. 监听input元素的change事件 */}
        <input type="text" value={this.state.txt} onChange={this.inputChange} />
      </div>
    )
  }
}
```

## 多受控组件封装

```jsx
class Hello extends React.Component {
  state = {
    val1: "",
    val2: "",
    val3: true,
    val4: false,
    val5: ""
  }
  elChange = e => {
    //2. 在事件响应函数内动态修改state内的值
    const { type, name, value } = e.target
    if (type === "checkbox") {
      this.setState({ [name]: e.target.checked })
    } else {
      this.setState({ [name]: value })
    }
  }
  render() {
    return (
      <div>
        {/* 1. 监听元素的change事件 */}
        <input type="text" name="val1" value={this.state.val1} onChange={this.elChange} />
        <input type="textarea" name="val2" value={this.state.val2} onChange={this.elChange} />

        <br />

        <input type="checkbox" name="val3" checked={this.state.val3} onChange={this.elChange} />
        <input type="checkbox" name="val4" checked={this.state.val4} onChange={this.elChange} />

        <br />

        <select name="val5" value={this.state.val5} onChange={this.elChange}>
          <option value="all">all</option>
          <option value="bj">bj</option>
          <option value="sh">sh</option>
          <option value="gz">gz</option>
        </select>
      </div>
    )
  }
}
```

## 非受控组件
非受控组件跟受控组件相反，指的是状态不保存在`state`里面的组件，这样的组件想获取其的值，就需要操作Dom来获取，非特殊情况不建议使用。

方式一：通过`ref`属性关联DOM元素，再从DOM元素中获取其`value`值。
```jsx
class Hello extends React.Component {
  getValue = () => {
    // 2. 从DOM元素获取其value值
    console.log(this.refs.input.value)
  }
  render() {
    return (
      <div>
        {/* 1.ref绑定DOM元素 */}
        <input type="text" ref="input" />
        <button onClick={this.getValue}>获取元素的值</button>
      </div>
    )
  }
}
```

方式二：
  * 通过`React.createRef`创建一个ref对象，一般在`constructor`中进行。
  * 将创建的`ref`对象关联到DOM元素上。
  * 通过`ref对象.current.value`的方式获取元素的值。
```jsx
class Hello extends React.Component {
  constructor() {
    super()
    // 1.创建一个ref对象
    this.txtRef = React.createRef()
  }
  getValue = () => {
    // 3.通过ref对象.current.value的方式获取元素的值
    console.log(this.txtRef.current.value)
  }
  render() {
    return (
      <div>
        {/* 2. 将ref对象关联到对应的DOM元素上 */}
        <input type="text" ref={this.txtRef} />
        <button onClick={this.getValue}>获取元素的值</button>
      </div>
    )
  }
}
```

## ref
和vue一样，react的`ref`属性可以绑定DOM元素，也可以绑定组件。

绑定DOM元素时，通过ref获取到的就是**DOM元素**。绑定组件时，获取到的则是**组件实例**。
```jsx
class App extends React.Component {
  getRef() {
    console.log(this.refs.hello)
    console.log(this.refs.example)
  }

  render() {
    return (
      <div>
        <div ref="hello">hello world</div>
        <Example ref="example" />
        <button onClick={this.getRef.bind(this)}>click</button>
      </div>
    )
  }
}
```
在react中，ref属性除了设置为字符串以外，还可以设置为一个回调函数，这也是官方强烈推荐的做法。

函数在DOM元素或组件加载完毕时触发，参数为关联的DOM或者组件。
```jsx
class App extends React.Component {
  render() {
    return (
      <div>
        <div ref={e => console.log(e)}>hello world</div>
        <Example ref={e => console.log(e)} />
      </div>
    )
  }
}
```

<Vssue />