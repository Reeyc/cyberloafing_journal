# React-Router-V6

React-Router在2021年底发布了 v6 版本，并将该版本作为React-Router的默认版本。新版本对比 v5 版本变化较大，新版本是完全基于 [React Hooks](/react/hooks.md) 重新实现的。这意味着 v6 代码将比 v5 代码更加紧凑和优雅。

:::tip
本文仅列举 React-Router-v6 较 v5 版本发生的变化，未列举的组件及特性则说明新版本没有变化，v5 版本以及其他的React-Router特性请查看 [React Router](/react/router.md)。
:::

## Routes

`<Switch />`组件换为`<Routes />`组件，并且`<Route />`必须搭配`<Routes />`使用，换言之，v6版本的路由不再具有匹配穿透性。

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/music" element={<Music />}></Route>
        <Route path="/movie" element={<Movie />}></Route>
        <Route path="/" element={<Default />}></Route>
      </Routes>
    </Router>
  )
}
```

## Route

* **`element`**：`component`属性名换为`element`，取值为对应的路由组件调用。
* **`caseSensitive`**：`sensitive`属性更名为`caseSensitive`，用于区分路径匹配是否严格区分大小写。
* **`exact`**：被废弃，默认精确匹配路由。
* **`strict`**：被废弃，默认匹配尾部斜杠。

```jsx
function App() {
  /**
   * /music 匹配成功 => exact
   * /music/ 匹配成功 => strict
   * /music/aa 匹配不成功
   */
  return (
    <Router>
      <Routes>
        <Route path="/music" element={<Music />}></Route>
      </Routes>
    </Router>
  )
}
```

## Navigate

`<Navigate />`组件只要渲染就会修改路径，切换视图，接收一个`to`属性指向路由路径，`replace`属性定义跳转模式为`replace`。

```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/music" element={<Music />}></Route>
        <Route path="/movie" element={<Movie />}></Route>
        <Route path="/" element={<Navigate to="/music" />}></Route>
      </Routes>
    </Router>
  )
}
```

## Redirect

`<Redirect />`组件被废弃，重定向可以使用`<Navigate />`组件实现。
```jsx
<Route path="/" element={<Navigate to="/music" />}></Route>
```

## NavLink

* **`className`**：`activeClassName`属性废弃，新增`className`属性，取值为**字符串**或者**函数**，函数包含布尔值`isActive`参数，代表当前路由是否匹配成功。
* **`end`**：新增`end`属性，当子级路由匹配，则自己本身失去高亮。

```jsx
function App() {
  function computedClassName({ isActive }) {
    return isActive ? "navlink-item navlink-active" : "navlink-item"
  }

  return (
    <Router>
      <NavLink to="/music" className={computedClassName}>音乐</NavLink>
      <NavLink to="/movie" className={computedClassName}>电影</NavLink>
      <NavLink to="/" className={computedClassName}>默认</NavLink>
      
      <Routes>
        <Route path="/music" element={<Music />}></Route>
        <Route path="/movie" element={<Movie />}></Route>
        <Route path="/" element={<Default />}></Route>
      </Routes>
    </Router>
  )
}
```

## Outlet
当路由产生**嵌套**，用于指定子路由组件的出口。类似于vue中的`<router-view />`。

```jsx
import Music from "../pages/Music"
import MusicChild from "../pages/MusicChild"
import Movie from "../pages/Movie"
import Default from "../pages/Default"

export default [
  {
    path: "/music",
    element: <Music />,
    children: [
      // 注册子路由
      { path: "child", element: <MusicChild /> }
    ]
  },
  { path: "/movie", element: <Movie /> },
  { path: "/", element: <Default /> }
]
```
```jsx
// @/pages/Music/index.jsx
import React, { Component } from "react"
import { Outlet } from "react-router-dom"

class Music extends Component {
  render() {
    return (
      <>
        <div>音乐</div>
        <Outlet></Outlet> {/* 子路由出口 */}
      </>
    )
  }
}

export default Music
```

## Hooks

React-Router-v6是完全使用 [React Hooks](/react/hooks.md) 重新实现的。这意味着在 v6 版本中将会频繁使用Hooks来实现新的路由特性（注册路由、路由传参、编程式导航等等...），并且组件的声明方式也推荐使用**函数式组件**，因为Hooks特性只被允许在函数式组件中使用。

### useRoutes

`useRoutes`接收一个route对象数组，用于注册路由表。里面对象的结构和`<Route />`组件基本一致：

* **`path`**
* **`element`**
* **`children`**
* **`caseSensitive`**
* ...

```js
// @/routes/index.js
import Music from "../pages/Music"
import Movie from "../pages/Movie"
import Default from "../pages/Default"

export default [
  { path: "/music", element: <Music /> },
  { path: "/movie", element: <Movie /> },
  { path: "/", element: <Default /> }
]
```

返回的路由表对象，直接放在原本的`<Routes />`位置处加载即可。
```jsx
import routes from "./routes"

function App() {
  const element = useRoutes(routes)
  return (
    <>
      <NavLink to="/music">音乐</NavLink>
      <NavLink to="/movie">电影</NavLink>
      <NavLink to="/">默认</NavLink>
      {/* 加载路由表 */}
      {element}
    </>
  )
}
```

### useParams

在`path`路径后面，以 **冒号:** 拼接一个自定义key值来声明**params参数**。传递参数也是手动拼接到路径后面即可。

```jsx
// @/routes/index.js
export default [
  // ...
  {
    path: "/movie/:id", // 声明params参数
    element: <Movie />
  },
  // ...
]
```
```jsx
// @/App.jsx
import routes from "./routes"

function App() {
  const element = useRoutes(routes)
  return (
    <>
      <NavLink to="/music">音乐</NavLink>
      {/* 传递params参数 */}
      <NavLink to="/movie/123">电影</NavLink>
      <NavLink to="/">默认</NavLink>

      {element}
    </>
  )
}
```

在组件内接收参数需要通过`useParams`这个Hook来接收，返回值就是**params参数**对象。
```jsx
// @/pages/Movie/index.jsx
import { useParams } from "react-router-dom"

function Movie() {
  // 接收params参数
  const { id } = useParams()
  return <div>电影： {id}</div>
}

export default Movie
```

### useSearchParams

传递**search参数**需在路径中手动将参数拼接成`urlencoded`的形式。
```jsx
// @/App.jsx
import routes from "./routes"

function App() {
  const element = useRoutes(routes)
  return (
    <>
      <NavLink to="/music">音乐</NavLink>
      {/* 传递search参数 */}
      <NavLink to="/movie?id=123">电影</NavLink>
      <NavLink to="/">默认</NavLink>

      {element}
    </>
  )
}
```
在组件内接收参数是通过`useSearchParams`这个Hook来接收，返回一个**search参数**对象和更新**search参数**对象的方法。

注意，返回的**search参数**不是普通对象，而是一个 [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) 对象。

```jsx
import { useSearchParams } from "react-router-dom"

function Movie() {
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get("id")
  return <div>电影： {id}</div>
}

export default Movie
```

更新**search参数**时，也是需要手动将参数拼接成`urlencoded`的形式。
```jsx
function Movie() {
  const [searchParams, setSearchParams] = useSearchParams()
  const id = searchParams.get("id")
  return (
    <div
      onClick={() => {
        setSearchParams("id=456")
      }}
    >
      电影： {id}
    </div>
  )
}
```

### useLocation

在 v5 版本中，传递路由**state参数**，是由`state`属性绑定一个对象传递过去。接收的时候通过`location`对象的`state`属性来接收。
```jsx
// @/App.jsx
import routes from "./routes"

function App() {
  const element = useRoutes(routes)
  return (
    <>
      <NavLink to="/music">音乐</NavLink>
      {/* 传递state参数 */}
      <NavLink to="/movie" state={{ id: "123" }}>电影</NavLink>
      <NavLink to="/">默认</NavLink>

      {element}
    </>
  )
}
```
在 v6 版本也是一样的，只不过`location`对象不再通过`props`获取，而是通过`useLocation`这个Hook来获取。

```jsx
import { useLocation } from "react-router-dom"

function Movie() {
  const { state: { id } } = useLocation()
  return <div>电影： {id}</div>
}

export default Movie
```

### useNavigate

`useNavigate`返回一个函数，可以通过该函数实现编程式路由导航。

函数的参数为路由的`to`属性值，传递的**params参数**和**search参数**，都需要自己手动在这里拼接。
```jsx
function Music() {
  const navigate = useNavigate()
  return (
    <>
      <div>音乐</div>
      <button
        onClick={() => {
          navigate({ pathname: "/movie/123" })
        }}
      >
        前往电影路由
      </button>
    </>
  )
}
```

第二个参数是一个可选的配置对象：
* **`replace`** 属性，用于决定是否是replace跳转，默认`false`。
* **`state`** 属性，用于传递路由**state参数**。
```jsx
function Music() {
  const navigate = useNavigate()
  return (
    <>
      <div>音乐</div>
      <button
        onClick={() => {
          navigate("/movie", {
            replace: true,
            state: { id: "123" }
          })
        }}
      >
        前往电影路由
      </button>
    </>
  )
}
```

也可以直接传递一个数值，用于实现路由的前进或后退，类似于`history.go()`方法。
```jsx
function Music() {
  const navigate = useNavigate()
  return (
    <>
      <div>音乐</div>
      <button
        onClick={() => {
          navigate(-1)
        }}
      >
        后退一步
      </button>
    </>
  )
}
```
### useOutlet

当路由发生嵌套时，`useOutlet`用于在父路由组件中 获取当前呈现的子路由组件。

```js
// @/routes/index.js
export default [
  {
    path: "/music",
    element: <Music />,
    children: [
      {
        path: "child",
        element: <MusicChild />
      }
    ]
  },
  // ...
]
```
```jsx
// @/pages/Music/index.jsx
import { Outlet, useOutlet } from "react-router-dom"

function Music() {
  // 当路由路径为 '/music/child' 时
  const curComponent = useOutlet()
  console.log(curComponent) // 获取到MusicChild实例
  return (
    <>
      <div>音乐</div>
      <Outlet></Outlet>
    </>
  )
}

export default Music
```

### useNavigationType

用于获取当前的导航类型，也就是以何种方式来到该路由的，返回值：`'POP'`、`'PUSH'`、`'REPLACE'`。

注：`'POP'`代表在浏览器中直接打开了该路由。

```jsx
import { useNavigationType } from "react-router-dom"

function Movie() {
  const navigateType = useNavigationType()
  return <div>电影：进来该路由的方式为 {navigateType} </div>
}

export default Movie
```

### useResolvedPath

给定一个URL值，解析其中的`path`、`search`、`hash`值。

```jsx
import { useResolvedPath } from "react-router-dom"

function Movie() {
  const { pathname, search, hash } = useResolvedPath("/movie?id=123#456")
  console.log(pathname) // '/movie'
  console.log(search) // '?id=123'
  console.log(hash) // '#456'
  return <div> 电影 </div>
}

export default Movie
```

### useInRouterContext

用于判断当前是否处于`<Router />`上下文环境中，也就是组件外面是否有`<Router />`组件包裹。返回`true`代表是，`false`反之。

```jsx
import Movie from "./pages/Movie"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    {/* Movie 不在 Router 上下文内 */}
    <Movie />
    <Router>
      <App />
    </Router>
  </Provider>
)

export default root
```

---

本文仅列举部分常用的 react-router-v6 组件和Hooks，更多相关资料信息，建议查阅 [官网](https://reactrouter.com/en/main)。

<Vssue />