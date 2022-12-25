# Hooks

Hooks是React在16.8.0版本推出的新特性/新语法，Hooks可以让你在函数式组件能使用`state`以及其他的React特性。

---

Hook是一些`use`作为开头的，提供了React **state**及**生命周期**等特性的函数。

* Hook只能在函数式组件中使用，不能在class组件中使用。
* Hook只能在函数式组件的顶层使用，不能在循环、条件或嵌套函数中调用Hook。

## useState

给组件添加`state`（状态）管理。传入的参数就是当前`state`的初始值。

`useState`会返回一对值：**当前状态**和一个让你**更新它的函数**，你可以在事件处理函数中或其他一些地方调用这个函数。

```jsx {6}
import { useState } from "react"

function Counter() {
  // count => 当前状态
  // setCount => 更新状态的函数
  const [count, setCount] = useState(0) // 0 => 初始值
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>click</button>
    </>
  )
}

export default Counter
```

当组件内的`state`发生变化，整个函数组件都会重新渲染。函数在重复渲染时都会获取到该`state`的最新值。如上面例子中，每次更新`count`后，函数内总能获取到最新的`count`值。

### setXxx的第二种写法

setXxx支持传入函数，接收原本的状态值，返回新的状态值，新的状态值将会覆盖掉原来的状态值。
```jsx {4-7}
function Counter() {
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
### 惰性初始state

state的初始值可以设定为一个函数的返回值，该函数仅会在初始渲染时被调用，**惰性初始state**可以用作的初始值计算的复杂场景：

```jsx {4}
function Counter(props) {
  const [count, setCount] = useState(function () {
    // 函数的返回值就是state的初始值
    return props.num * Math.round(Math.random() * 10)
  })
  // ...
}
```

## useEffect

`useEffect`可以让你在函数式组件中执行副作用操作（模拟class组件中的生命周期钩子）。

生命周期是SPA应用一个至关重要的特性，有了生命周期，我们才可以更好的做以下这些事情：
- 发送ajax请求数据
- 启动/注销定时器
- 操作真实DOM
- ...

`useEffect`相当于class组件中的下面三个生命周期钩子函数的结合：

* `componentDidMount`
* `componentDidUpdate`
* `componentWillUnmount`

`useEffect`接收一个函数，这个函数会在DOM挂载完毕（`componentDidMount`）、state更新（`componentDidUpdate`）时执行

```jsx {6-8}
import { useState, useEffect } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("componentDidMount 或 componentDidUpdate 时触发")
  })
  return (
    <div id="counter">
      <h1>{count}</h1>
      {/* 更新state */}
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  )
}

export default Counter
```

`useEffect`回调函数内有个可选的返回值函数，如果返回了函数，这个返回的函数会在组件注销时执行（`componentWillUnmount`）。

```jsx {5-7}
import root from "../../index"

function Counter() {
  useEffect(() => {
    return () => {
      console.log("componentWillUnmount 时触发")
    }
  })
  // 注销组件
  function unmount() {
    root.unmount(document.getElementById("counter"))
  }
  return (
    <div id="counter">
      <button onClick={unmount}>Unmount</button>
    </div>
  )
}
```

:::warning
需要注意的是，`state`一更新，整个组件会被重新渲染，也就相当于走了一遍注销创建的流程，此时`useEffect`回调里面的返回值函数（`componentWillUnmount`）也会被执行一次。
:::

### 优化依赖项

`useEffect`默认会监听组件内所有的`state`，一旦有`state`发生变化，它都会执行回调。而`useEffect`的第二个参数接收一个可选的数组类型，数组内的每一项元素就是需要监听的`state`，我们可以手动指定需要监听的`state`。
```jsx {7}
function Counter() {
  const [count, setCount] = useState(0)
  const [age, setAge] = useState(20)

  useEffect(() => {
    console.log("componentDidMount 或 componentDidUpdate 时触发")
  }, [age]) // 只有age这个state变化的时候才触发函数

  return (
    <div id="counter">
      <h1>count：{count}</h1>
      <h2>age：{age}</h2>
      <button onClick={() => setCount(count + 1)}>changeCount</button>
      <button onClick={() => setAge(age + 1)}>changeAge</button>
    </div>
  )
}
```
如果指定的是一个空数组，那就相当于不监听组件内的任何`state`变化，实际上就相当于抹除了`componentDidUpdate`的效果，仅保留`componentDidMount`。
```jsx {12}
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("只有componentDidMount时触发")
    let timer = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, []) // 任何state发生变化都不会触发函数

  return (
    <div id="counter">
      <h1>count：{count}</h1>
    </div>
  )
}
```

## useRef

用于管理组件内所标识的DOM元素。用法跟`React.createRef()`很像，`useRef()`返回一个ref对象，将该ref对象通过`ref`属性绑定到元素上，就可以通过该对象的`current`属性获取到绑定的DOM元素。

传入的参数为初始化数据，通常传入`null`或者省略参数。

```jsx {5,13}
import { useState, useRef } from "react"

function Counter() {
  const [count, setCount] = useState(0)
  const inputRef = useRef(null)

  function getCount() {
    setCount(inputRef.current.value)
  }
  return (
    <div id="counter">
      <h1>count：{count}</h1>
      <input ref={inputRef} type="text" />
      <button onClick={getCount}>Click</button>
    </div>
  )
}

export default Counter
```

## useContext

函数式组件通过`props`本身也能实现**父子组件通信**和**兄弟组件通信**。而如果需要做到**跨级组件通信**，就需要用到`useContext`。

### React.createContext

`React.createContext`用于生成一个context（上下文）对象。context对象的`<Provider>`组件包裹在需要接收数据的组件上，并通过`value`属性提供数据

```jsx {4,10}
import { useState, createContext } from "react"

// 1.创建context对象
const MyContext = createContext({ name: "Luci", age: 17 })

function Parent() {
  const [userInfo] = useState({ name: "Jessica", age: 18 })
  return (
    {/* 2.通过context对象的Provider组件向下层组件传递数据 */}
    <MyContext.Provider value={userInfo}>
      <A></A>
    </MyContext.Provider>
  )
}

export default Parent
```

在接收数据的组件内，通过调用`useConext()`传入前面生成的context对象，返回值就是传递过来的数据。

```jsx {9}
import { useContext } from "react"

function A() {
  return <B></B>
}

function B() {
  // 3.通过useConext()传入之前生成的context，返回值就是传递过来的数据
  const { name } = useContext(MyContext)
  return <div>{name}</div>
}

export default A
```

## useReducer

`useReducer`是一个`useState`的代替方案，它可以让你更方便的操控Redux。在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state逻辑较复杂或包含多个state子值时。

`useReducer`接收一个`reducer`纯函数，和一个初始值作为参数。返回一个`state`值和更派发更新的`dispatch`函数。

```jsx {15-19}
const userReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_GENDER":
      state.gender = action.gender
      return { ...state }
    case "CHANGE_AGE":
      state.age = action.age
      return { ...state }
    default:
      return state
  }
}

export default function Example() {
  const [userState, dispatch] = useReducer(userReducer, {
    name: "tom",
    gender: "man",
    age: 20
  })
  return (
    <div>
      <p>性别：{userState.gender}</p>
      <p>年龄：{userState.age}</p>
      <button onClick={() => dispatch({ type: "CHANGE_GENDER", gender: "women" })}>
        Change Gender
      </button>
      &nbsp;
      <button onClick={() => dispatch({ type: "CHANGE_AGE", age: 18 })}>
        Change Age
      </button>
    </div>
  )
}
```

`useReducer`也可以像`useState`一样，接收一个惰性的初始state。`useReducer`的第三个参数是一个函数，函数的参数就是`useReducer`第二参数的初始state，函数的返回值就是惰性求值后的state。

```jsx {7-10}
// ...
const [userState, dispatch] = useReducer(userReducer, {
  name: "tom",
  gender: "man",
  age: 20
}, function(state) {
  return { // 返回惰性求值后的state
    ...state,
    salary: state.age * 1000
  }
})
// ...
```

---

### useContext + useReducer

结合使用`useContext`和`useReducer`达到 React-Redux 的效果：

* 将状态state提升到公共的容器组件。
* 使用`useReducer`生成`state`与`dispatch`。
* 使用`createContext`的上下文对象将`state`与`dispatch`向下传递到子组件。
  ```jsx {24-28,32}
  // Parent.jsx
  import { createContext, useReducer } from "react"

  import ChildA from "./pages/ChildA"
  import ChildB from "./pages/ChildB"

  export const UserContext = createContext()

  const userReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_GENDER":
        state.gender = action.gender
        return { ...state }
      case "CHANGE_AGE":
        state.age = action.age
        return { ...state }
      default:
        return state
    }
  }

  function Parent() {
    // 生成 state 和 dispatch
    const [userState, dispatch] = useReducer(userReducer, {
      name: "tom",
      gender: "man",
      age: 20
    })
    return (
      <div>
        {/* 向下传递 state 和 dispatch */}
        <UserContext.Provider value={{ userState, dispatch }}>
          <ChildA />
          <ChildB />
        </UserContext.Provider>
      </div>
    )
  }

  export default Parent
  ```

* 使用`useContext`获取`state`和`dispatch`。
  ```jsx {7}
  // ChildA.jsx
  import { useContext } from "react"
  import { UserContext } from "../../Parent"

  export default function ChildA() {
    // 获取state
    const { userState } = useContext(UserContext)
    return (
      <div>
        <p>性别：{userState.gender}</p>
        <p>年龄：{userState.age}</p>
      </div>
    )
  }
  ```
  ```jsx {7}
  // ChildB.jsx
  import { useContext } from "react"
  import { UserContext } from "../../Parent"

  export default function ChildB() {
    // 获取dispatch
    const { dispatch } = useContext(UserContext)
    return (
      <div>
        <button onClick={() => dispatch({ type: "CHANGE_GENDER", gender: "women" })}>
          Change Gender
        </button>
        <button onClick={() => dispatch({ type: "CHANGE_AGE", age: 18 })}>
          Change Age
        </button>
      </div>
    )
  }
  ```

---

:::tip useMemo 和 useCallback 作为性能优化的手段
在React中，当父组件重新渲染时，它下面的后代组件也会重新渲染，在class组件中，可以通过`shouldComponentUpdate`或`React.PureComponent`来优化这个问题。而当使用了 React Hooks 之后，可以通过`React.useMemo`或`React.useCallback`来优化这个问题。
:::

## useMemo

`useMemo`通常作为优化性能的手段被使用。类似于Vue中的`computed`，`useMemo`可以用来**缓存变量**，以避免两次渲染间的重复计算。

`useMemo`用法和`useEffect`类似，接收一个函数和一个依赖项数组，函数会在初始化时执行一次，并且会在依赖项发生改变时，重新执行。

* 默认**省略依赖项**，则组件每次渲染都会执行函数，`useMemo`也就失去了意义。
  ```jsx {5-7}
  import { useState, useMemo } from "react"

  function Counter() {
    const [count, setCount] = useState(0)
    useMemo(() => {
      console.log("load") // state每次变化都会执行该函数
    })
    return (
      <>
        <h2>count：{count}</h2>
        <button onClick={() => setCount(count + 1)}>Click</button>
      </>
    )
  }
  ```
* 若指定**空数组依赖项**，则任何的变化都不会重新执行函数。
  ```jsx {5}
  function Counter() {
    const [count, setCount] = useState(0)
    useMemo(() => {
      console.log("load")
    }, []) // 任何state变化都不会执行该函数
    return (
      <>
        <h2>count：{count}</h2>
        <button onClick={() => setCount(count + 1)}>Click</button>
      </>
    )
  }
  ```

可以将高开销的计算写在 `useMemo` 的参数函数中，并指定对应的依赖项。

下面例子中，`computedSum`的值被缓存起来，`useMemo`指定了当`visible`变化时，才会重新计算`computedSum`的值，而`count`变化时不会执行计算：
```jsx
function Counter() {
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(0)
  return (
    <>
      <Child visible={visible}></Child>
      <button onClick={() => setVisible(!visible)}>Change Visible</button>
      <button onClick={() => setCount(count + 1)}>Change Count</button>
    </>
  )
}
```
```jsx {9}
function Child({ visible }) {
  // 缓存computedSum的值
  const computedSum = useMemo(() => {
    let sum = 0
    for (let i = 0; i < Math.round(Math.random() * 1000); i++) {
      sum += i
    }
    return sum
  }, [visible]) // 当visible变化时，重新计算computedSum

  return <div> {computedSum} </div>
}
```

## useCallback

`useMemo`缓存的是函数返回的结果。而`useCallback`缓存的是函数本身。

* 当**省略依赖项**时，`useCallback`总会返回一个新的函数。
  ```jsx {6-8}
  let cacheFn = null
  function Counter() {
    const [count, setCount] = useState(0)

    // 不指定依赖项，组件每次rerender，handleClick都是一个新的函数上下文
    const handleClick = useCallback(() => {
      setCount(count + 1)
    })

    console.log(cacheFn === handleClick) // false、false、false...
    cacheFn = handleClick

    return (
      <div>
        <p>{count}</p>
        <button onClick={handleClick}>Click</button>
      </div>
    )
  }
  ```
* 当指定**空依赖项**，或者**依赖项没有发生变化**，`useCallback`返回被缓存的函数，否则会返回一个新的函数。
  ```jsx {9}
  let cacheFn = null
  function Counter() {
    const [count, setCount] = useState(0)

    // 指定依赖空项，handleClick被缓存
    // 组件每次rerender，handleClick都会返回旧的函数上下文
    const handleClick = useCallback(() => {
      setCount(count + 1)
    }, [])

    console.log(cacheFn === handleClick) // false、true、true
    cacheFn = handleClick

    return (
      <div>
        <p>{count}</p>
        <button onClick={handleClick}>Click</button>
      </div>
    )
  }
  ```

:::warning
上面这种指定空依赖项的写法存在隐患，由于`handleClick`被缓存，每次rerender每次执行的都是旧的`handleClick`，因此内部的`count`也是旧的值，这种写法也会被内置的eslint插件`react-hooks/exhaustive-deps`发出警告：
> <i style="color: red">React Hook useCallback has a missing dependency: 'count'. Either include it or remove the dependency array. You can also do a functional update 'setCount(c => ...)' if you only need 'count' in the 'setCount' call.eslintreact-hooks/exhaustive-deps</i>

意思是建议你将函数内部使用到的依赖尽可能在第二个参数写全：
```jsx {8}
let cacheFn = null
function Counter() {
  const [count, setCount] = useState(0)

  // 指定依赖count，当count变化时，useCallback都会返回新的函数上下文
  const handleClick = useCallback(() => {
    setCount(count + 1)
  }, [count])

  console.log(cacheFn === handleClick) // false、false...
  cacheFn = handleClick

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}
```
或者使用setXxx的回调形式语法，来获取最新的`count`：
```jsx {3}
const handleClick = useCallback(() => {
  // 获取最新的count
  setCount(count => count + 1)
}, [])
```
:::

### React.memo

`React.memo`接收一个函数组件作为参数，该组件如果`props`没有发生变化的话（浅比较），则不会重新渲染。类似于class组件中的`React.PureComponent`。

```jsx
import { useState } from "react"

function Parent() {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Child count={count} />
      <button onClick={() => { setCount(count + 1) }}>Click Count</button>
      &nbsp;
      <button onClick={() => { setVisible(!visible) }}>Click Visible</button>
    </div>
  )
}

const Child = ({ count }) => {
  return <h2>{count}</h2>
}
```

上面例子中，不论父组件点击`setCount`还是`setVisible`，子组件都会rerender，因为父组件本身已经rerender了。

而子组件内部只用到了`count`这个`props`，当`visible`变化时，子组件的rerender是无意义的。这时候可以使用`React.mome`来包裹子组件，避免子组件无必要的重新渲染。

```jsx {3-5}
import { memo } from "react"

const Child = memo(({ count }) => {
  return <h2>{count}</h2>
})
```

:::tip 区分 React.memo 与 React.useMemo
`React.memo`的缓存对象是整个组件，不满足条件的组件不会rerender。而`useMemo`是将组件的局部逻辑进行缓存，组件本身依旧是会rerender，两者作用不同，`React.memo`通常和`useCallback`搭配使用。
:::

---

### useCallback + memo

对于需要传递函数给子组件的场合，可以配合使用`useCallback`与`React.memo`，防止每次函数上下文更新，从而导致子组件无意义的rerender。

```jsx {5-7,13,18-22}
function Parent() {
  const [count, setCount] = useState(0)

  // 指定依赖空项，组件每次rerender，handleClick都会返回旧的函数上下文
  const handleClick = useCallback(() => {
    setCount(count => count + 1)
  }, [])

  return (
    <div>
      <p>{count}</p>
      {/* 将函数传递给子组件 */}
      <Child handleClick={handleClick}></Child>
    </div>
  )
}

const Child = memo(({ handleClick }) => {
  // handleClick上下文没有变化，Child组件不会rerender
  console.log("Child Rerender")
  return <button onClick={handleClick}>Click!</button>
})
```
单独使用`useCallback`而不使用`React.memo`也是没用的，因为父组件虽然缓存了函数，但是state发生了变化，父组件一旦rerender，子组件也是会rerender的。

:::warning 忠告
不是所有的函数都需要`useCallbacck`来包裹，如果没有显著的性能提升，不建议使用`useCallback`，因为错误的使用反而会适得其反：
1. 对依赖的判断也会产成额外的性能消耗。
2. 依赖没写全，导致函数不更新，无法获取到最新的数据。
:::

---

:::tip 总结 React.useMemo 与 React.useCallback
* `useMemo`可以优化当前组件也可以优化子组件，主要是将一些复杂的计算逻辑进行缓存。
* `useCallback`是用来优化子组件的，配合`React.memo`来防止子组件的重复渲染。
:::

## 自定义Hook

自定义Hook就是一些以`use`开头的自定义函数，内部使用了React的其他Hooks特性来 **将组件逻辑封装到可重用的函数中**。

自定义 Hook 也要遵循以下固定规则：

* 只在组件最**顶层**使用 hook。
* 只在React**函数组件**、**自定义hook组件**中调用 hook。
* 以`use`开头，可触发React检查 hook 规则。
* 在**多个组件**中使用相同的 hook **不会共享state**。
* **多次调用**相同的 hook，都会获取到**独立的state**。

:::tip
自定义 Hook 是一种重用状态逻辑的机制(例如设置为订阅并存储当前值)，所以每次使用自定义 Hook 时，其中的所有 state 和副作用都是完全隔离的。
:::

下面是一个封装Axios请求的自定义 hook：

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

function useAxios(url) {
  const [ loading, setLoading ] = useState(false)
  const [ data, setData ] = useState()
  const [ error, setError ] = useState()

  useEffect(() => {
    setLoading(true)
    axios.get(url)
        .then(res => setData(res))
        .catch(error => setError(error))
        .finally(() => {setLoading(false)})
  }, [url])  // url改变时触发请求

  // 返回独立的state
  return [loading, data, error]
}

export default useAxios
```

使用 hook：
```jsx
import React, { useState, useEffect } from 'react'
import useAxios from './UseAxios'

const url = 'http://localhost:3000/'
export default () => {
  const [ loading, data, error ] = useAxios(url) 

  if (loading) {
    return (<div>loading...</div>)
  }
  return error
    ? <div>{JSON.stringify(error)}</div>
    : <div>{JSON.stringify(data)}</div>
}
```

---

本文仅列举常用的Hooks，更多的内置Hooks请查阅 [官网](https://zh-hans.reactjs.org/docs/hooks-reference.html)。

<Vssue />