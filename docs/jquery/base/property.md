# 属性相关API

## 特性和属性

**HTML特性**（attributes）指的是在HTML标签中定义的属性。

**DOM属性**（properties）指的是JS中DOM对象的属性。

当浏览器加载页面时，浏览器会解析HTML并从中生成DOM对象。如果元素节点中包含标准的 HTML特性（attributes），例如：`id`，`type`，`alt`，`name`等等，则会自动写入DOM对象的属性（properties）。具体的标准 HTML attribute 文档可以参考 [MDN - HTML attribute reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)。

下面代码中，id 属于标准的 HTML 特性（attributes），所以可以从DOM对象中访问到它。而对于非标准的 HTML 特性则不会被写入DOM对象。
```html
<body>
  <div id="test"></div>
  <div something="non-standard"></div>
  <script>
    const demo = document.querySelector("#test")
    const demo2 = document.querySelector("div[something]")

    console.log(demo.id) // 'test'
    console.log(demo2.something) //undefined
  </script>
</body>
```

所有的特性可以通过以下一系列API来操作：
```js
const test = document.querySelector('#test')

test.hasAttribute('id') // 检查是否存在某个特性。
test.getAttribute('id') // 获取某个特性值。
test.setAttribute('id', 'test2') // 设置某个特性值。
test.removeAttribute('id') // 移除某个特性。
test.attributes // 获取所有的特性
```

属性可以直接通过 对象.xxx 的方式来操作：
```js
const test = document.querySelector("#test")

console.log(test.id) //test
test.id = "test2"
```

:::warning 注意
* 某些元素的标准特性名称与其DOM元素的属性名称可能不是相同的，例如`class`在DOM元素对象上就会变为`className`。
```html
<div id="test" class="test"></div>
<script>
  const demo = document.querySelector("#test")

  console.log(demo.class) // undefined
  console.log(demo.className) // 'test'
</script>
```
* 某些元素的标准特性对于另一个元素可能是未知的。例如`type`是`<input>`的一个的标准特性，但对于`<body>`来说则不是。
```html
<body id="body" type="test">
  <input id="input" type="text">
  <script>
    const input = document.querySelector("#input")

    console.log(input.type) // text
    console.log(document.body.type) // undefined 非body标准特性不会被写入DOM对象
  </script>
</body>
```
:::

---

### data-*
非 HTML 标准定义的属性，皆是非标准特性。如果有业务需求，需要自定义 HTML 特性来管理状态，可以采用`data-*`来定义。

HTML5标准规定，所有以`data-`开头的特性均被保留，供开发者使用。这些属性可以在`dataset`中被访问到。

下面是一个根据`data-*`特性来管理订单状态的例子：
```html
<style>
  .order {
    color: #fff;
  }

  .order[data-order-state="new"] {
    background-color: green;
  }

  .order[data-order-state="pending"] {
    background-color: blue;
  }

  .order[data-order-state="canceled"] {
    background-color: red;
  }
</style>

<div class="order" data-order-state="new">A new order.</div>

<script>
  const statusList = ["new", 'pending', 'canceled']
  let index = 0

  const order = document.querySelector('div[data-order-state]')

  setInterval(changeOrderStatus, 1000)

  function changeOrderStatus() {
    order.dataset.orderState = statusList[index]
    console.log(order.dataset.orderState)

    index = index >= statusList.length - 1 ? 0 : ++index
  }
</script>
```


### 特性和属性的区别
简略的对比：
| | 特性 | 属性 |
| - | - | - |
| 描述 | 在HTML标签中定义的属性 | JS中DOM对象的属性 |
| 名称 | 特性对大小写不敏感 | 属性对大小写敏感 |
| 值 | 特性的值均是字符串 | 属性的值有多种类型 |

以下是求证区别的例子：
```html
<input type="checkbox" name="star" />
<script>
  const demo = document.querySelector("input[name=star]")

  /* 名称 */
  console.log(demo.getAttribute('Type')) // 'checkbox'
  console.log(demo.Type) // undefined

  /* 值 */
  demo.setAttribute('checked', true)

  console.log(demo.getAttribute('checked')) // 'true'
  console.log(demo.checked) // true
</script>
```

---

### 特性和属性的同步
当一个标准特性的值被改变，对应的属性值也会自动更新，（除了几个特例）反之亦然。在下面这个示例中，id 特性被修改，我们可以看到对应的属性也发生了变化。然后反过来也是同样的效果：
```html
<input id="input" />

<script>
  const input = document.querySelector('#input');

  // 特性 => 属性
  input.setAttribute('id', 'id')
  console.log(input.id) // id

  // 属性 => 特性
  input.id = 'newId'
  console.log(input.getAttribute('id')) // newId
</script>
```
但这里也有一些例外，例如一些表单特性值只能从特性值同步到属性值，反之不行。
```html
<input type="text" />

<script>
  const input = document.querySelector('[type="text"]');

  // 特性 => 属性
  input.setAttribute('value', 1)
  console.log(input.value) // 1

  // 属性 => 特性
  input.value = 2
  console.log(input.getAttribute('value')) // 1
</script>
```
---

言归正传，在jQuery中操作元素特性、主要分为两类API：`attr()`、`prop()`。

## attr

`attr(attributeName, value)`：操作标准和非标准特性（attributes），即在HTML标签中定义的所有属性。

| 参数 | 描述 |
| - | - |
| attributeName | 特性名称 |
| value | 设置的值，可同时设置多个调用者。如省略该参数，则是获取匹配上的第一个元素的值。 |
| **返回值** | 如果是获取，返回值。如果是设置，则返回的是调用者，方便链式调用。 |

```html
<div something="non-standard"></div>
<div something="non-standard"></div>
```
```js
$(function () {
  console.log($("div").attr("something")) // 'non-standard' 返回首个div的something值
  console.log($("div").attr("index", 3)) // 新增一个index特性，并将值设置为3，返回调用者

  console.log($("div")[0].index) // undefined DOM对象没有
  console.log($("div").attr("index")) // 存在attributes中
})
```

---

## removeAttr

`removeAttr(attributeName)`：删除HTML特性，即在HTML标签中定义的所有属性。

| 参数 | 描述 |
| - | - |
| attributeName | 特性名称 |
| **返回值** | 调用者。 |

```js
$(function () {
  console.log($("div").removeAttr("index")) // 删除所有div的index特性，返回调用者
})
```

## prop

`prop(propertyName, value)`：操作DOM对象上的属性（properties）。

| 参数 | 描述 |
| - | - |
| propertyName | 属性名称 |
| value | 设置的值，可同时设置多个调用者。如省略该参数，则是获取匹配上的第一个元素的值。 |
| **返回值** | 如果是获取，返回值。如果是设置，则返回的是调用者，方便链式调用。 |

`attr`操作的是特性，而`prop`直接操作DOM对象的属性：
```js
$(function () {
  $("div").attr("index", 3)

  console.log($("div")[0].index) // 不存在DOM对象中
  console.log($("div").attr("index")) // 要去 attributes 里取

  $("div").prop("index2", 4)

  console.log($("div")[0].index2) // 直接存进DOM对象中
})
```

`attr`用于操作HTML标签上的属性，而对于DOM对象上存在的属性，例如：`tagName`, `nodeName`, `nodeType`等等，应该用`prop`来操作。

但如果该属性在DOM对象上和HTML标签上都存在，建议以`attr()`优先，例如：`id`、`src`、`href`等等，因为标准特性的更新总是会同步到DOM对象中。

```js
$(function () {
  console.log($("img").attr("tagName")) // undefined HTML标签上不存在tagName属性
  console.log($("img").prop("tagName")) // IMG

  // 推荐
  console.log($("img").attr(
    "src", 
    "https://www.jquery123.com/assets/images/jquery-logo-md.png"
  ))
  
  console.log($("img").prop(
    "src", 
    "https://www.jquery123.com/assets/images/jquery-logo-md.png"
  ))
})
```

另外，对于某些特殊的元素，他们的特性（attribute）值，例如：`checked`、`selected`、`disabled`不会因为元素的状态而改变，而属性（property）值会因为元素的状态而改变。对于这种属性，应当使用`prop`来操作。
```html
<input type="checkbox" />

<select>
  <option id="o1">1111</option>
  <option id="o2">2222</option>
</select>

<script>
  $('[type="checkbox"]').prop('checked', true) // 给复选框默认选中
  $('#o2').prop('selected', true) // 给下拉框默认选中第二项

  $('[type="checkbox"]').on('change', function () {
    console.log($(this).attr('checked')) // 不会更新，永远是undefined
    console.log($(this).prop('checked')) // 会更新
  })
</script>
```

## removeProp

`removeProp(propertyName)`：删除DOM对象的属性。

| 参数 | 描述 |
| - | - |
| propertyName | 属性名称 |
| **返回值** | 调用者。 |

`removeProp`只能删除自定义的DOM属性，无法删除由标准特性写入的DOM属性。

```js
$(function () {
  $("img").prop("myProp", "hello world")

  console.log($("img").prop("myProp")) // hello world

  $("img").removeProp("myProp") // 删除自定义的DOM属性
  $("img").removeProp("id") // 删除由标准特性写入的DOM属性
  $("img").removeProp("src") // 删除由标准特性写入的DOM属性

  console.log($("img").prop("myProp")) // undefined
  console.log($("img").prop("id")) // test
  console.log($("img").prop("src")) // 'https://www.jquery123.com/assets/images/jquery-logo-md.png'
})
```
可以使用来`removeAttr`删除标准特性，[标准特性被删除了，就会自动更新到DOM对象上](/jquery/base/property.html#特性和属性的同步)。
```js
$("img").removeAttr("id")
$("img").removeAttr("src")

console.log($("img").prop("id")) // ''
console.log($("img").prop("src")) // ''
```

## data

`data(key, value)`：操作本地缓存的数据（内存）。

| 参数 | 描述 |
| - | - |
| key | 属性名称 |
| value | 设置的值，可同时设置多个调用者。如省略该参数，则是获取匹配上的第一个元素的值。 |
| **返回值** | 本地缓存的对象，存于内存中。如果是设置，则返回的是调用者，方便链式调用。 |

`data()`有点类似于原生JS中的`data-*`机制，都用于本地缓存数据。不同在于，`data()`是将数据存在内存中，而H5的`data-*`是显式的存在DOM上的。

```html
<div id="d1"></div>
<div id="d2" data-item="100"></div>

<script>
  $(function () {
    const d2 = document.querySelector('#d2')

    console.log(d2.dataset.item) // '100'
    console.log($('div').data('item')) // undefined

    $('div').data('item2', [100, 200, 300])
    console.log(d2.dataset.item2) // undefined
    console.log($('div').data('item2')) // [100, 200, 300]
  })
</script>
```

---

## removeData

`removeData(name)`：移除通过`data`储存的数据。

| 参数 | 描述 |
| - | - |
| name | 属性名称 |
| **返回值** | 调用者。 |

接上面的代码：
```js
/**
 * ...
*/

$('div').removeData('item2')
console.log($('div').data('item2')) // undefined
```

<Vssue />