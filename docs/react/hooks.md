# Hooks

Hooks是React在16.8.0版本推出的新特性/新语法，Hooks可以让你在函数式组件能使用`state`以及其他的React特性。

---

Hook是一些`use`作为开头的，提供了React **state**及**生命周期**等特性的函数。Hook只能在函数式组件中使用，不能在类式组件中使用。

## useState

给组件添加`state`（状态）管理。传入的参数就是当前`state`的初始值，`useState`会返回一对值：当前状态和一个让你更新它的函数，你可以在事件处理函数中或其他一些地方调用这个函数。

```jsx
import { useState } from "react"

function App() {
  // count：当前状态， setCount：更新状态的函数
  const [count, setCount] = useState(0) // 0 => 初始值

  function change() {
    // 每当组件状态发生改变，整个App组件都会重新执行，但count依旧会记录最新的值
    setCount(count + 1)
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={change}>click</button>
    </>
  )
}

export default App
```

当组件内的`state`发生变化，整个函数组件都会重新渲染。函数在重复渲染时都会获取到该`state`的最新值。

**setXxx的第二种写法**：setXxx支持传入函数，接收原本的状态值，返回新的状态值，新的状态值将会覆盖掉原来的状态值。

```jsx
function App() {
  // ...
  function change() {
    setCount(oldCount => {
      console.log(oldCount) // 变化之前的值
      return oldCount + 1 // 更新值
    })
  }
  // ...
}
```

## useEffect

`useEffect`可以让你在函数式组件中执行副作用操作（模拟类组件中的生命周期钩子）。

生命周期是SPA应用一个至关重要的特性，有了生命周期，我们才可以更好的做以下这些事情：
- 发送ajax请求数据
- 启动/注销定时器
- 操作真实DOM
- ...

`useEffect`相当于类式组件中`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`三个生命周期钩子函数的结合。

它接收一个函数，这个函数会在DOM挂载完毕（`componentDidMount`）、state更新（`componentDidUpdate`）时执行

```jsx
import { useState, useEffect } from "react"

function Demo() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("componentDidMount 或 componentDidUpdate 时触发")
  })

  function change() {
    setCount(count + 1) // 更新state
  }
  return (
    <div id="demo">
      <h1>{count}</h1>
      <button onClick={change}>Click</button>
    </div>
  )
}

export default Demo
```

`useEffect`回调函数内有个可选的返回值函数，如果返回了函数，这个返回的函数会在组件注销时执行（`componentWillUnmount`）。

```jsx
import { useState, useEffect } from "react"
import root from "../../index"

function Demo() {
  useEffect(() => {
    return () => {
      console.log("componentWillUnmount 时触发")
    }
  })

  // 注销组件
  function unmount() {
    root.unmount(document.getElementById("demo"))
  }
  return (
    <div id="demo">
      <button onClick={unmount}>Unmount</button>
    </div>
  )
}

export default Demo
```

:::warning
需要注意的是，`state`一更新，整个组件会被重新渲染，也就相当于走了一遍注销创建的流程，此时`useEffect`回调里面的返回值函数（`componentWillUnmount`）也会被执行一次。
:::

#### useEffect优化

`useEffect`默认会监听组件内所有的`state`，一旦有`state`发生变化，它都会执行回调。而`useEffect`的第二个参数接收一个可选的数组类型，数组内的每一项元素就是需要监听的`state`，我们可以手动指定需要监听的`state`。
```jsx
import { useState, useEffect } from "react"

function Demo() {
  const [count, setCount] = useState(0)
  const [age, setAge] = useState(20)

  useEffect(() => {
    console.log("componentDidMount 或 componentDidUpdate 时触发")
  }, [age]) // 只有age这个state变化的时候才触发useEffect回调

  function changeCount() {
    setCount(count + 1)
  }
  function changeAge() {
    setAge(age + 1)
  }
  return (
    <div id="demo">
      <h1>count：{count}</h1>
      <h2>age：{age}</h2>
      <button onClick={changeCount}>changeCount</button>
      <button onClick={changeAge}>changeAge</button>
    </div>
  )
}

export default Demo
```
如果指定的是一个空数组，那就相当于不监听组件内的任何`state`变化，实际上就相当于抹除了`componentDidUpdate`的效果，仅保留`componentDidMount`。
```jsx
import { useState, useEffect } from "react"

function Demo() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("只有componentDidMount时触发")
    let timer = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, []) // 任何state发生变化都不会触发useEffect回调

  return (
    <div id="demo">
      <h1>count：{count}</h1>
    </div>
  )
}

export default Demo
```

## useRef

用于管理组件内所标识的DOM元素。用法跟`React.createRef()`很像，`useRef()`返回一个ref对象，将该ref对象通过`ref`属性绑定到元素上，就可以通过该对象的`current`属性获取到绑定的DOM元素。

传入的参数为初始化数据，通常传入null或者省略参数。

```jsx
import { useState, useRef } from "react"

function Demo() {
  const [count, setCount] = useState(0)
  const inputRef = useRef(null)

  function getCount() {
    setCount(inputRef.current.value)
  }

  return (
    <div id="demo">
      <h1>count：{count}</h1>
      <input ref={inputRef} type="text" />
      <button onClick={getCount}>Click</button>
    </div>
  )
}

export default Demo
```

## useContext

函数式组件通过`props`本身也能实现**父子组件通信**和**兄弟组件通信**。而如果需要做到**跨级组件通信**，就需要用到`useContext`。

1. 通过`React.createContext()`生成一个context（上下文）对象。
2. context对象的`<Provider>`组件包裹在需要接收数据的组件上，并通过`value`属性提供数据。
3. 在接收数据的组件内，通过调用`useConext()`传入前面生成的context对象，返回值就是传递过来的数据。

```jsx
import { useState, createContext, useContext } from "react"

// 1.创建context对象
const MyContext = createContext({ name: "Luci", age: 17 })

function App() {
  const [userInfo] = useState({ name: "Jessica", age: 18 })
  return (
    {/* 2.通过context对象的Provider组件向下层组件传递数据 */}
    <MyContext.Provider value={userInfo}>
      <A></A>
    </MyContext.Provider>
  )
}

function A() {
  return <B></B>
}

function B() {
  // 3.通过useConext()传入之前生成的context，返回值就是传递过来的数据
  const { name } = useContext(MyContext)
  return <div>{name}</div>
}

export default App
```

---

本文仅列举常用的Hooks，更多的内置Hooks请查阅 [官网](https://zh-hans.reactjs.org/docs/hooks-reference.html)。

<Vssue />