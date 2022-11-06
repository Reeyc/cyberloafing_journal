# 受控组件

在React中有两种处理表单的方式：
* 受控组件
* 非受控组件（Dom方式）

## 受控组件
在HTML中，表单元素是可输入的，换言之，表单元素有自己的可变状态。而React认为，所有可变的状态，都应当放入`state`内追踪。所以，React需要将表单组件的状态揽入`state`内管理。

在Vue中，有`v-model`语法糖双向绑定指令可以使Vue更方便的控制表单元素的值。而React则需要自己绑定值和监听事件来控制`state`的值。

1. 需要自己通过`value`绑定值。
2. 监听表单元素值的变化事件，动态修改`state`内的值。
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
下面是一个利用**函数柯里化**特性实现的多受控组件封装例子：

```jsx
class Hello extends React.Component {
  state = {
    val1: "",
    val2: "",
    val3: true,
    val4: false,
    val5: ""
  }
  handleChange = name => {
    return e => {
      const { type, value } = e.target
      if (type === "checkbox") {
        this.setState({ [name]: e.target.checked })
      } else {
        this.setState({ [name]: value })
      }
    }
  }
  getData = () => {
    console.log(this.state)
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.val1} onChange={this.handleChange("val1")} />
        <textarea value={this.state.val2} onChange={this.handleChange("val2")}></textarea>

        <input type="checkbox" checked={this.state.val3} onChange={this.handleChange("val3")} />
        <input type="checkbox" checked={this.state.val4} onChange={this.handleChange("val4")} />

        <select value={this.state.val5} onChange={this.handleChange("val5")}>
          <option value="beijing">beijing</option>
          <option value="shanghai">shanghai</option>
          <option value="guangzhou">guangzhou</option>
        </select>

        <button onClick={this.getData}>getData</button>
      </div>
    )
  }
}
```

## 非受控组件
非受控组件跟受控组件相反，指的是状态不保存在`state`里面的组件，这样的组件想获取其的值，就需要操作Dom来获取，非特殊情况不建议使用。

在React中，可以通过 [refs](/react/refs.md) 的方式来操作DOM：

* 通过`React.createRef`创建一个ref对象。
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

<Vssue />