# Vue

## v-if & v-show
* 相同点：都是控制元素的显示和隐藏，值都是`boolean`类型。
* 不同点：`v-show`控制的元素css的`display`属性，`v-if`控制html元素的插入和移除，如果控制的目标是组件实例，那么组件会经历创建/销毁，同理新创建的组件，生命周期也会重新走一遍。

## 生命周期

### 父子生命周期顺序

**初始化**
1. 父`beforeCreate`
2. 父`created`
3. 父`beforeMount`
4. 子`beforeCreate`
5. 子`created`
6. 子`beforeMount`
7. 子`mounted`
8. 父`mounted`

---

**子组件更新**
1. 父`beforeUpdate`
2. 子`beforeUpdate`
3. 子`updated`
4. 父`updated`

**父组件更新**
1. 父`beforeUpdate`
2. 父`updated`

---

**父组件销毁**
1. 父`beforeDestroy`
2. 子`beforeDestroy`
3. 子`destroyed`
4. 父`destroyed`

### activited & deactivated

被`keep-alive`组件包裹的组件，在激活和缓存的时候调用。
* 被激活时调用`activited`。
* 被缓存时调用`deactivated`。

### 什么阶段发起ajax请求
在`data`初始化完成后就可以获取数据并`改变状态`，即在`created`钩子函数之后的生命周期之后都可以。

建议在`created`阶段发起请求，因为：
* `created`执行时机比`mounted`快。
* `created`执行时，数据已初始化完毕，可以修改数据状态了。
* `beforeMount`和`mounted`等钩子在服务端渲染时不会触发。

:::warning
如果在发起ajax请求后，要操作DOM，为了保险起见可以在`mounted`中发起请求，因为`mounted`执行时代表DOM已经挂载完毕。当然也可以在`created`中使用`nextTick`回调来执行。
:::

## 计算属性

### 计算属性 vs 方法
* 计算属性依赖于缓存，当里面的一个或多个属性值发生变化，才会重新计算当前属性的值。
* 方法每次调用都会执行函数。

---

* `需要缓存`的时候使用计算属性。
* `不需要缓存`的时候使用方法。

---

什么时候需要缓存？

假设有一个性能开销比较大的计算属性A，A的`getter`里面需要遍历一个巨大的数组并做大量计算，当有别的计算属性依赖于A时，没有缓存的话，每次读取这个计算属性，Vue都将不可避免的执行A的`getter`。

### 计算属性 vs 侦听器
计算属性和侦听器能监听数据变化作出响应，区别如下：
* computed依赖于`缓存`，watch不支持缓存，会直接触发函数。
* computed不支持`异步`，当computed内有异步操作时无效，无法监听数据的变化。watch支持异步。

---

* computed擅长处理的场景：`一个数据受多个数据影响`。
* watch擅长处理的场景：`一个数据影响多个数据`。

## 数据响应式

**为什么给data新增的属性无法响应？**

Vue通过`defineProperty`来劫持`data`的属性进行响应式处理，如果给对象设置的`key`原先没有定义，就无法劫持到，自然就无法做到自动更新界面。

**如何解决？**
* Vue提供了`Vue.set`或者`this.$set`方法来给对象新增属性值，让这个属性也带有响应式功能。
* 使用`this.$forceUpdate()`强制更新。
* 使用`Object.assign()`或者`扩展运算符`赋予新的值。