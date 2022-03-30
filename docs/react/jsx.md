# JSX

- `React.createElement(component, props, ...children)`：用于创建 react 元素。
  - `component`：元素的名称。
  - `props`：元素的属性。
  - `children`：元素的字节点。

---

- `ReactDOM.render(element, container[, callback])`：将 react 元素渲染到页面上。
  - `element`：要渲染的 react 元素。
  - `container`：react 元素挂载的节点。
  - `callback`：元素渲染完毕执行的回调。

---

使用`createElement`带来的弊端：

```js
const App = React.createElement(
  "div",
  { className: "container " },
  React.createElement("h1", null, "hello"),
  React.createElement(
    "ul",
    null,
    React.createElement("li", { className: "item" }),
    React.createElement("li", { className: "item" }),
    React.createElement("li", { className: "item" })
  )
);
```

- 繁琐不整洁。
- 不直观，无法一眼看出所描述的结构。
- 不优雅，编码体验不爽。

## JSX 介绍

JSX 是 **`Javascript XML`** 的简写，表示在 Javascript 中编写 XML 格式的代码。它是 JS 的一种语法扩展，一种形似 HTML 的标签语法，其通过`@babel/preset-react`编译之后，才能够运行在浏览器中，`create-react-app` 脚手架中已经默认有该配置，无需手动配置。

JSX 能够解决`createElement`带来的弊端，推荐使用 JSX 的语法来编写 React 元素。

```jsx
const App = (
  <div>
    <h1>hello</h1>
    <ul>
      <li className="item"></li>
      <li className="item"></li>
      <li className="item"></li>
    </ul>
  </div>
);
```

:::warning
JSX 使用的**注意点**：

- React 元素的属性名使用驼峰命名法。

```jsx
const App = <h1 testProp="hello">hello</h1>;
```

- 特殊属性名 `class` 更改为 `className`，`for` 更改为 `htmlFor`，因为 `class` 和 `for` 都是 js 中的保留字。

```jsx
const App = <h1 className="hello">hello</h1>; //添加一个hello的css类名
```

- 没有子节点的任意 React 元素都可以以 `/>` 结尾。
- 建议使用小括号包裹 JSX，将其看作一个整体，避免编辑器自动插入分号。

```jsx
const App = (
  <h1 className="hello">
    <span />
  </h1>
);
```

:::

### 插入 JS 表达式

JSX 也可以像 Vue 的`template`模板一样，插入简单的 JS 表达式。区别在于 Vue 的插值语法是双大括号 `{{}}` ，而 JSX 中则是单大括号 `{}`。

```jsx
const name = "zs";
const x = 10;
const y = 20;

ReactDOM.render(
  <div>
    hello {name}，{x + y}
  </div>,
  document.getElementById("root")
);
```

JSX 本身也是一个表达式，也可以被应用与其他的 JSX 中。

```jsx
const name = "zs";
const x = 10;
const y = 20;

const header = <h1>header</h1>;

ReactDOM.render(
  <div className="container">
    {header}
    hello {name}，{x + y}
  </div>,
  document.getElementById("root")
);
```

对象是一个例外，除了`style`属性外，`{ }` 内不接收对象。即使通过对象变量的方式也不行。

```jsx
const name = "zs";
const x = 10;
const y = 20;

const header = <h1>header</h1>;

ReactDOM.render(
  <div className="container">
    {header}
    hello {name}，{x + y}
    {{ x: "y" } /* Error: Objects are not valid as a React child */}
  </div>,
  document.getElementById("root")
);
```

### 插入 DOM 结构

在 Vue 中用`v-html`指令可以插入 dom 结构，而在 React 中，需要在父元素上使用`dangerouslySetInnerHTML`属性指向一个对象，对象的`__html`属性指向一个 dom 结构。

```jsx
const dom = "<h1>hello world</h1>";

ReactDOM.render(
  <div dangerouslySetInnerHTML={{ __html: dom }}></div>,
  document.getElementById("root")
);
```

## 条件渲染

JSX 的条件渲染无法像 Vue 一样提供`v-if`指令直接在模板内部进行。而是需要在外部定义函数来判断条件，在模板内调用函数来实现条件渲染。

```jsx
let isLoading = true;

function toggleLoading() {
  if (isLoading) {
    return <h1>数据正在加载中，请稍后...</h1>;
  }
  return <h1>数据已经加载完毕</h1>;
}

ReactDOM.render(<div>{toggleLoading()}</div>, document.getElementById("root"));
```

## 列表渲染

Vue 中可以通过`v-for`指令在模板中渲染列表。在 JSX 中也可以在模板中渲染列表，通过调用数组的`map`方法来获取到每一项数据渲染到模板中。

```jsx
const arr = [
  { id: 1, name: "ZS" },
  { id: 2, name: "LS" },
  { id: 3, name: "WW" },
];

ReactDOM.render(
  <div>
    {arr.map((item) => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>,
  document.getElementById("root")
);
```

:::warning
在渲染列表的同时，要给每一个元素加上一个唯一的`key`值，这一点跟 Vue 的 `:key` 如出一辙，都是为了更高效的更新虚拟 Dom。
:::

## 样式处理

可以通过两种方式为 React 元素添加样式。

- **`style`** 属性对应的 `{ }` 可以接收一个对象，对象的键值对就是 CSS 的属性和值。

```jsx
ReactDOM.render(
  <h1 style={{ color: "red", backgroundColor: "skyblue" }}> hello React </h1>,
  document.getElementById("root")
);
```

- **`className`** 为元素绑定 CSS 类，再去 css 文件中书写样式，并引入该文件执行。 <Badge text="推荐"/>

```jsx
import "../css/index.css"; //引入样式文件并执行

ReactDOM.render(
  <h1 className="title"> hello React </h1>,
  document.getElementById("root")
);
```

```css
/* index.css */
.title {
  color: red;
  background-color: skyblue;
}
```
