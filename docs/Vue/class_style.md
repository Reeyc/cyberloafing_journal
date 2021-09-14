# class & style绑定

## 绑定class
* **传递字符串**
```vue
<div :class='"myString"'></div>
```
class不可以取值为数值类型，但是可以取值为字符串类型的数字
```vue
<div :class='100'></div>   <!--Bad -->
<div :class='"100"'></div> <!--Good -->
```
---

* **传递数组**

class跟其他普通属性一样，可以传递一个数组，数组中的元素默认会被绑定到属性上。\
如果元素是`data`对象的`key`值，则会取`key`值对应的`value`值
```vue
<template>
  <div>
    <div :class="['100','200',a,b]"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      a: "aaa",
      b: "bbb"
    };
  }
};
</script>
```
---

* **传递对象**

传递对象只有`class`和`style`属性允许，其他普通的属性不允许。对象内的每个`value`会转化为布尔值。
* 当布尔值为`true`，将`key`当做绑定的值绑定上去。
* 当布尔值为`false`，不绑定该属性。
```vue
<div :class='{ a: true, b: 100, c: false, d: null }'></div> <!--Good -->
<div :prop='{ a: true, b: 100, c: false, d: null }'></div>  <!--Bad -->
```
该对象不一定要写在模板上，这样不利于模板的清晰结构。可以写在`data`数据里，也是一样的效果
```vue
<template>
  <div>
    <div :class="classObject"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classObject: {
        a: true,
        b: 100,
        c: false,
        d: undefined,
        e: null
      }
    };
  }
};
</script>
```
:::tip
无论通过什么样的方式绑定class，元素上已有的class不会被覆盖，相当于class添加进去
:::

---

组件标签上绑定class会被绑定到组件的根元素上，也就是`template`模板的根闭合标签，其他注意点和普通元素绑定class一样。
```vue
<template>
  <div>
    <my-component :class='["a", "b", "c"]'></my-component>
  </div>
</template>

<script>
export default {
  components: {
    "my-component": {
      template: `<div> <p> content </p> </div>` //组件的根元素=>div
    }
  }
};
</script>
```

## 绑定style
* **传递对象**

对象的`key`就是css的属性，属性用原生JS的驼峰命名法。\
对象的`value`就是css的属性值，属性值可以手写，也可以用`data`对象的`key`值表示，取值为对应的`value`值。
```vue
<div :style='{ fontSize: 30 + "px", backgroundColor: "red" }'></div>
```
当然，对象写在模板中不利于模板的结构清晰，也可以跟绑定class一样，将对象写在`data`中
```vue
<template>
  <div>
    <div :style="styleObject"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      styleObject: {
        fontSize: 30 + "px",
        backgroundColor: "red"
      }
    };
  }
};
</script>
```

* **传递数组**

传递数组也是基于对象的前提下：数组里的每个元素都是一个对象，因此传递数组相当于将多个样式对象整合到同一个元素上。\
可以在同一个样式对象中写多个属性，这样可以取代数组的功能。
```vue
<template>
  <div>
    <div :style="[styleObject, styleObject2]"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      styleObject: { //样式对象1
        fontSize: 30 + "px",
        backgroundColor: "red"
      },
      styleObject2: { //样式对象2
        paddingLeft: 10 + "px",
        marginBottom: 20 + "px"
      }
    };
  }
};
</script>
```