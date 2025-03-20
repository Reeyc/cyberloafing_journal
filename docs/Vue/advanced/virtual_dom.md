# 虚拟DOM

## Real DOM

真实DOM（Real DOM）是浏览器中实际存在的DOM树，它表示了页面上所有的 HTML 元素。每次你对真实 DOM 进行操作（比如增加、删除或更新元素），浏览器都需要重新计算样式、重新渲染页面以及更新布局。这个过程是直接操作 DOM，性能开销比较大，特别是在大量更新的情况下，容易导致页面响应变慢。

## Virtual DOM

虚拟DOM（Virtual DOM）是一种抽象层，Vue会在内存中维护一棵虚拟的DOM树，该树由各个虚拟节点（VNode）所组成。每次组件的状态发生变化时，Vue会通过对比新旧虚拟DOM，找出最小的差异，然后只更新那些实际改变的部分到真实DOM。

### VNode

虚拟节点（VNode）本质上是一个JS对象，描述了一个DOM结构，包括标签名、属性、子节点等信息，Vue在内部会使用`h()`或`createVNode()`来创建这个对象。


**创建一个虚拟节点：**
```js
import { h } from 'vue'
const vnode = h(
  'div', 
  { 
    id: 'app', 
    class: 'container', 
    style: { color: 'red', fontSize: '20px' }, 
    onClick: () => console.log('Clicked!')
  }, 
  [
    h('h1', { class: 'title' }, 'Hello Virtual DOM'),
    h('p', { class: 'description' }, 'This is a virtual DOM example.')
  ]
)
```

**实际上的VNode对象：**
```js
{
  type: 'div',
  props: {
    id: 'app',
    class: 'container',
    style: { color: 'red', fontSize: '20px' },
    onClick: () => console.log('Clicked!')
  },
  children: [
    {
      type: 'h1',
      props: { class: 'title' },
      children: 'Hello Virtual DOM'
    },
    {
      type: 'p',
      props: { class: 'description' },
      children: 'This is a virtual DOM example.'
    }
  ]
}
```

## 组件更新

### 更新流程

在Vue中，当响应式数据发生改变时，会执行以下流程：

1. **依赖收集**： 当组件渲染时，响应式数据的`getter`会被触发，进而调用`Dep.depend`收集依赖，将Watcher添加到依赖列表中。
2. **通知订阅**： 当响应式数据发生改变时，其`setter`会被触发，进而调用`Dep.notify`通知所有订阅者。
3. `Dep.notify`会调用订阅者的`update`方法，并调用`queueWatcher`将其加入异步更新队列。
4. `queueWatcher`会将订阅者的`run`推入`nextTick`任务队列，确保在同一个事件循环内合并多个更新。
5. `run`执行后，会触发`patch`过程，开始虚拟DOM比对。

---

### 虚拟DOM比对
1. 执行`isSameVnode`判断标签类型：  
    如果是不同标签，直接替换。  
    如果是相同标签，执行`patchVnode`进行详细比对。
2. `patchVnode`比对：   
    `props`：对比新旧`props`，并执行更新（新增/删除）。   
    `listeners`：对比新旧事件监听器，并执行更新（新增/删除）。    
    `text`：替换文本节点的内容。    
    `children`：分为几种情况：
    - 新节点有子节点，旧节点没有子节点，则添加新的子节点。
    - 新节点没有子节点，旧节点有子节点，则删除旧的子节点。
    - 新旧都有子节点，则调用`updateChildren`进行比对。 
3. `updateChildren`比对：   
    使用[双端比较法（同级对比）](/vue/advanced/diff.md#双端diff)最快找出新旧子节点的差异，并高效的更新节点位置。
:::tip 组件节点
对于组件节点，`patchVnode`会触发相关生命周期钩子：
- `beforeUpdate`：在更新之前触发。    
- `updated`：在更新完成之后触发。
:::  
    

## Key

在Vue中，`key`属性至关重要，每个Vnode节点都有一个`key`，相当于自身的唯一标识。Vue根据这个标识来找到对应的Vnode并进行一系列对比和Diff算法。

### key的作用

- **判断是否为相同节点**：上文中的`isSameVnode`和`updateChildren`中都用到了`key`作为对比的条件。
```js {3}
export function isSameVnode (a, b) {
  return (
    a.key === b.key && ( // 这里比较 key
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      )
    )
  )
}
```
---
- **元素和组件的复用**：下面例子中，每个`<li>`元素都有一个唯一的`key`。当我们调用`toggle()`方法向列表中添加一个新项时，Vue会基于`key`来判断哪些`<li>`元素可以复用，避免重新渲染整个列表。
```vue
<template>
  <div>
    <button @click="toggle">Toggle</button>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
        { id: 3, name: 'Orange' }
      ]
    }
  },
  methods: {
    toggle() {
      this.items.push({ id: 4, name: 'Grapes' })
    }
  }
}
</script>
```
---

- **强制组件重新渲染**：下面情况，`<Detail>`组件的更新依赖于`<Tabs>`的变化，此时也可以使用`key`来更新`<Detail>`。
```vue
<template>
  <div>
    <Tabs @click="detailKey = Math.random()">
      <Tab value="x" label="x"></Tab>
      <Tab value="y" label="y"></Tab>
    </Tabs>
    <Detail :key="detailKey"></Detail>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailKey: Math.random()
    }
  }
}
</script>
```
---

- **双端Diff算法比对**：Vue在对比同级子节点时，使用了双端Diff算法，其中`key`是重要的对比条件，具体内容可以参考[这篇文章](/vue/advanced/diff.md#双端diff)。

---

### 索引Key

Vue通过`key`标识列表中的每个元素，并基于`key`进行高效的 **最小化DOM** 变化。在Vue中，不推荐使用索引`index`作为`key`，因为它可能导致不必要的DOM操作，影响性能和组件状态的正确性。

#### 元素和组件的错误复用

如果使用索引作为`key`，当列表发生变更（新增/删除/重新排序）时，Vue可能会错误地复用组件，导致状态错乱。

```vue
<template>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      <input v-model="item.text">
    </li>
  </ul>
</template>
```
上面例子中，如果列表中某项被删除，所有后续项的索引都会前移，Vue可能会错误地复用不匹配的`input`，导致输入框的内容错乱。

#### Diff算法影响

如果从列表删除（或插入）其中一个元素，那么其他元素的索引全变了，`key`发生变化，Vue进行虚拟DOM对比时，会删除并重新创建DOM节点，而不是复用已有的节点。

下面是一组列表数据，通过`v-for`遍历渲染，并绑定`index`作为列表`key`值：
```js
data() {
  return {
    items: [
      { id: 'a1', text: '苹果' },
      { id: 'b2', text: '香蕉' },
      { id: 'c3', text: '橙子' }
    ]
  };
}
```
此时Vue生成的 vdom 大概长这样：
```json
[
  { key: 0, text: '苹果' },
  { key: 1, text: '香蕉' },
  { key: 2, text: '橙子' }
]
```
如果删除 苹果：
```js
this.items.splice(0, 1)
```
新的 vdom：
```json
[
  { key: 0, text: '香蕉' },  // 之前是 key=1
  { key: 1, text: '橙子' }   // 之前是 key=2
]
```
可以看出，操作完后，香蕉 和 橙子 的`key`值变了，Vue会将他们识别为新元素，从而进行创建，而非复用。

---

#### 唯一ID

为了避免`索引key`的问题，正确的做法是使用`唯一id`，即使列表元素再怎么变化（新增/删除/重新排序），唯一的id都是跟元素绑定的，这样一来，Vue就能识别对应的元素，从而正确的进行 **vdom diff** 和 **元素复用**。

```vue
<template>
  <ul>
    <!-- 使用item.id跟元素绑定 -->
    <li v-for="item in items" :key="item.id">
      <input v-model="item.text">
    </li>
  </ul>
</template>
```

<Vssue />