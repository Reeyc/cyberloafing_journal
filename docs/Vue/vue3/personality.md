# API风格

## Options API（选项式）
vue2中只提供了**options API**的方式来开发，即每个组件中都是由一个个**option**来组成的，例如当中的`data`、`computed`、`methods`都是option。
```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>
```

## Composition API（组合式）
vue3中推出了**composition API**的方式，使用导入的API函数来开发，并且通过`<script setup>`语法糖的形式，可以大量减少composition API中的样板代码。
```vue
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>
```
:::tip
vue3是向下兼容vue2的，这意味着在vue3中，你可以使用**options API**的方式也可以使用**composition API**的方式来开发。
:::

## 区别 & 如何选择

### 区别
Options API方式所带来的缺陷是：**`处理相同逻辑关注点的代码被强制拆分在了不同的选项中，位于文件的不同部分`**。在一个几百行的大组件中，要读懂代码中的一个逻辑关注点，只能在文件中反复上下滚动。

![Options API](/assets/img/optionsAPI.png)

Composition API可以 **`将同一个逻辑关注点相关的代码归为一组`**，将来无需为了一个逻辑关注点在不同的选项块间来回滚动切换。

由于相同逻辑的代码归为一组，将来我们 **`把相同逻辑的代码移动到一个外部文件中变得非常方便`**，大大降低了重构成本。

![Composition API](/assets/img/compositionAPI.png)

### 如何选择
官方推荐，只在低复杂度的场景中使用Vue，可以采用**选项式API**。当你需要构建更大更完整的Vue应用时，推荐使用**组合式API**。其实这两种风格的核心概念是通用的。一旦你熟悉了其中一种，另一种也无师自通。

<Vssue />