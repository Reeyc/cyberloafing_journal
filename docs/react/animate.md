# 动画

react 的动画实现原理和 vue 是一样的，也就是为元素动画的各个阶段添加 CSS 类名。由自己定义 CSS 样式来实现元素的动画效果。

安装

```sh
npm install react-transition-group --S
```

该插件提供三个核心组件：

- **`Transition`**
- **`CSSTransition`**
- **`TransitionGroup`**

## CSSTransition 使用

引入`CSSTransition`组件后直接使用，`CSSTransition`组件的属性：

- **`in`**：组件开关，控制组件的显示、隐藏。
- **`unmountOnExit`**：是否在元素退出完成后删除元素。
- **`appear`**：是否启用初始化过渡。
- **`timeout`**：过渡中状态过渡到结束状态所需时间。
- **`classNames`**：动画类名前缀

```jsx
import { CSSTransition } from "react-transition-group";

import "./index.css";

class App extends React.Component {
  state = {
    isShow: true,
  };
  toToggole() {
    this.setState({ isShow: !this.state.isShow });
  }
  render() {
    return (
      <div>
        <CSSTransition
          in={this.state.isShow} //用于判断是否出现的状态
          timeout={2000} //动画持续时间
          classNames="test" //className前缀
          unmountOnExit
          appear
        >
          <div>hello world</div>
        </CSSTransition>
        <div>
          <button onClick={this.toToggole.bind(this)}>Toggle</button>
        </div>
      </div>
    );
  }
}
```

CSSTransition 为各个动画阶段的元素添加的 CSS 类名：

- **`xxx-enter`**：进入动画之前添加。
- **`xxx-enter-active`**：整个进入动画阶段添加。
- **`xxx-enter-done`**：进入动画完成时添加。
- **`xxx-exit`**：退出动画之前添加。
- **`xxx-exit-active`**：整个退出动画阶段添加。
- **`xxx-exit-done`**：退出动画完成时添加。

:::tip
进入和退出由 `in` 对应的变量所定义，由 `true` -> `false` 的过程叫退出，由 `false` -> `true` 的过程叫做进入。
:::

编写 CSS 样式实现动画：

```css
.test-enter {
  /* 进入动画开始 */
  opacity: 0;
}
.test-enter-active {
  /* 进入动画全阶段 */
  opacity: 1;
  transition: opacity 1s;
}
.test-enter-done {
  /* 进入动画结束 */
  opacity: 1;
}

.test-exit {
  /* 退出动画开始 */
  opacity: 1;
}
.test-exit-active {
  /* 退出动画全阶段 */
  opacity: 0;
  transition: opacity 1s;
}
.test-exit-done {
  /* 退出动画结束 */
  opacity: 0;
}
```

## TransitionGroup 使用

`CSSTransition`为单个元素使用提供动画效果，而`TransitionGroup`则为多个元素提供动画效果。

下面是一个往列表中添加元素的动画效果。

```jsx
class App extends React.Component {
  state = {
    list: [{ name: "Hello World" }, { name: "Hello World" }],
  };
  handleClick() {
    this.setState({
      list: [...this.state.list, { name: "Hello World" }],
    });
  }
  render() {
    return (
      <>
        <button onClick={this.handleClick.bind(this)}>Add</button>
        <TransitionGroup>
          {this.state.list.map((item, index) => (
            <CSSTransition
              key={index}
              timeout={500}
              appear
              unmountOnExit
              classNames="test"
            >
              <div>{item.name}</div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </>
    );
  }
}
```

```css
.test-enter {
  opacity: 0;
}

.test-enter-active {
  opacity: 1;
  transition: opacity 1s;
}

.test-enter-done {
  opacity: 1;
}

.test-exit {
  opacity: 1;
}

.test-exit-active {
  opacity: 0;
  transition: opacity 1s;
}

.test-exit-done {
  opacity: 0;
}
```

<Vssue />
