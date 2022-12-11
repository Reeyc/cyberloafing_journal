# Props（下）


## Props 的初始化

使用类组件时，如果使用了`constructor`构造函数：

```jsx {12}
class Hello extends React.Component {
  state = {
    x: 1,
  };
  render() {
    return <Child x={this.state.x} />;
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    console.log(this.props);
  }
  render() {
    return <div>hello {this.props.x}</div>;
  }
}
```

1. 必须在构造函数内调用`super()`，这是因为发生类继承时，要先初始化父类，完成子类实例的塑造。
2. 必须将`props`传递给`super`，也就是父类的构造函数，否则无法在构造函数内使用`this.props`，因为`React.Component`内部需要将`props`初始化。

```js
// React.Component
class Component {
  constructor(props) {
    this.props = props;
    // ...
  }
}
```

而实际上即使你调用`super()`不传`props`, 仍然能在`render`里访问`this.props`，这是因为调用`super`后，React 将`props`赋值在实例对象上。

```js
const instance = new YourComponent(props);
instance.props = props;
```

但是在构造函数内不能通过`this`访问`props`，因为`props`是初始化完毕之后赋值给实例对象的。

```jsx
class Child extends React.Component {
  constructor(props) {
    super();
    console.log(this.props); //undefined
  }
  render() {
    return <div>hello {this.props.x}</div>;
  }
}
```

### 单项数据流的概念

和 vue 一样，react 倡导单向数据流，主要是项目越来越复杂时，组件互相影响加上复用会使 debug 的成本会非常高。

当父组件传值给子组件时，子组件不能直接通过`props`修改父组件传过来的数据，这样会违背单向数据流的概念。所以，react 将`props`对象定义成**只读**的，换言之，我们不能修改`props`对象内的数据。

```jsx
//父
class App extends React.Component {
  render() {
    return <Example content={"hello"} />;
  }
}
```

```jsx
//子
class Example extends React.Component {
  handleClick() {
    // TypeError: Cannot assign to read only property 'content' of object '#<Object>'
    this.props.content = "update";
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>click</button>;
  }
}
```

## props.children

`props.children`表示组件标签的子节点，当组件标签内有子节点时，props 就会有该属性。

```jsx
class App extends React.Component {
  render() {
    return (
      <Child>
        文本节点
        <p>JSX节点</p>
        <Test>组件节点</Test>
        {() => {}}
      </Child>
    );
  }
}

class Child extends React.Component {
  render() {
    console.log(this.props); // {children: Array(4)}
    return null;
  }
}
```

组件标签内的子节点包括：文本节点、react 元素节点、组件节点、或者是函数节点。

- 当子节点只有一个时，`props.children`为对应的子节点。
- 当子节点为多个时，`props.children`为一个数组，数组的每个元素对应每个子节点。

除了子节点数据以外，`children`也可以像一个普通属性一样传递：
```jsx
class App extends React.Component {
  render() {
    return <Child children={1}></Child>
  }
}

class Child extends React.Component {
  render() {
    console.log(this.props) // {children: 1}
    return null
  }
}
```
:::warning
当组件标签内有内容时，这些内容优先级更高，会覆盖默认传递的`children`属性：
```jsx
class App extends React.Component {
  render() {
    return (
      <Child children={1}>
        文本节点
        <p>JSX节点</p>
        {() => {}}
      </Child>
    )
  }
}

class Child extends React.Component {
  render() {
    console.log(this.props) // {children: Array(3)}
    return null
  }
}
```
:::

## 类型约束

为了将来方便维护，建议父组件向子组件传递数据时，对数据进行约束。

需要先引入`PropTypes`，这个包在通过`create-react-app`脚手架创建项目时，就已经自动帮我们安装了。

```js
import PropTypes from "prop-types";
```

引入后，需要给接收数据的组件加上一个静态属性`propTypes`，来实现约束效果：

```jsx
//子
class Example extends React.Component {
  handleClick() {
    // TypeError: Cannot assign to read only property 'content' of object '#<Object>'
    this.props.content = "update";
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>click</button>;
  }
}

//给Example组件加上propTypes静态属性
Example.propTypes = {
  content: PropTypes.string, //传过来的content必须是string类型
  data: PropTypes.object.isRequired, //传过来的data必须是object类型，且不可省略
};
```

`propTypes`常见的约束类型：string、number、bool、object、array、func

```js
//约束
Child.propTypes = {
  val1: PropTypes.string, //必须是string类型
  val2: PropTypes.number, //必须是number类型
  val3: PropTypes.bool, //必须是boolean类型
  val4: PropTypes.object, //必须是对象
  val5: PropTypes.array, //必须是数组
  val6: PropTypes.func, //必须是函数
};
```

### 约束特定结构的对象

`propTypes.shape`用于约束特定结构的对象。

```js
/**
 * 传进来的val是一个对象，且必须为以下结构
 * name的值是一个字符串，且不可省略
 * age的值是一个数值
 * flag的值是一个布尔值
 */
Child.propTypes = {
  val: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    flag: PropTypes.bool,
  }),
};
```

### 使用默认值

`defaultProps`可以为传过来的数据提供默认值。

```js
//约束
Example.propTypes = {
  content: PropTypes.string, //传过来的content必须是string类型
  data: PropTypes.object.isRequired, //传过来的data必须是number类型，且不可省略
};

//默认
Example.defaultProps = {
  content: "hello react", //当content没有传过来时，其值默认为 hello react
};
```

### 约束简写

类的静态属性可以使用ES6的`static`关键字在类内部声明：

```jsx
//子
class Example extends React.Component {
  static propTypes = {
    content: PropTypes.string,
    data: PropTypes.object.isRequired,
  };
  handleClick() {
    // TypeError: Cannot assign to read only property 'content' of object '#<Object>'
    this.props.content = "update";
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>click</button>;
  }
}
```

### 函数式组件的类型约束

类本身就是组件，所以`propTypes`写在类的静态属性上实现约束效果，而函数组件跟类组件其实是一样的，其本身也是组件，只需要给函数加上`propTypes`即可：

```jsx
function Example(props) {
  return <h1>function component</h1>
}

Example.propTypes = {
  content: PropTypes.number,
  data: PropTypes.object.isRequired
}
```

<Vssue />