# hook的概念
hook直译是：钩子。通常指系统运行到某一时期时，会调用被注册到该时机的回调函数。

比较常见的钩子有：vue中数据初始化完毕时执行的`created`钩子、DOM挂载完毕时执行的`mounted`钩子。

但是在特定领域的特定话题下，hook这个词被赋予了一些特殊的含义。比如在vue **compositionAPI**中，hook代表以`“use”`作为开头的，一系列提供了**组件复用**、**状态管理**等开发能力的**函数**。

## 自定义hook
自定义hook类似于`mixin`技术，但是相较于`mixin`，**<u>自定义hook更容易追溯复用代码的属性来源</u>**。

下面是一个自定义封装ajax请求的hook：
```ts
import axios from "axios"

import { ref } from "vue"

export default function <T>(url: string) {
  const res = ref<T | null>(null)
  const loading = ref(true)
  const errMsg = ref("success")
  axios
    .get(url)
    .then(result => {
      res.value = result.data
      loading.value = false
    })
    .catch(err => {
      errMsg.value = err.message || "未知错误"
      loading.value = false
    })

  return { res, loading, errMsg }
}
```
使用该hook：
```vue
<script lang="ts" setup>
import useRequest from "@/hook/useRequest"
import { watch } from "vue"

interface Address {
  id: number
  address: string
}

interface Product {
  id: number
  title: string
  price: string
}

// const { res, loading, errMsg } = useRequest<Address>("/data/address.json")
const { res, loading, errMsg } = useRequest<Product[]>("/data/products.json")

watch(res, () => {
  console.log(res.value, loading.value, errMsg.value)
})
</script>
```