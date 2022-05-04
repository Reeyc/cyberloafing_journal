# 元素相关API

回顾一下在原生js中操作元素节点：

创建元素节点：
```js
document.createElement(tagName)
<Element>.innerHTML = ""；
<Element>.cloneNode(deep)； //克隆
```

添加元素节点：
```js
<parentNode>.appendChild(child)；
<parentNode>.insertBefore(newChild, oldChild)；//插入
```

---

替换元素节点：
```js
<parentNode>.replaceChild(newChild, oldChild)
```

---

删除元素节点：
```js
<parentNode>.removeChild(child)
```

---

下面是jQuery系列：

## 创建元素节点
```js
const p = $("<p>你好</p>") //返回值是一个jQuery元素
```

---

## 添加元素节点
### 添加到元素内最后面

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>parentNode.append(content)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>子元素HTML代码片段，或者jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>childNode.appendTo(selector)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>父元素CSS选择器，或者jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
</div>

```js
$(function () {
  $("body").append("<p>text</p>") // 子元素HTML代码片段
  $("body").append($("<p>text2</p>")) // 传递jQuery元素

  $("<p>text3</p>").appendTo("body") // 传递选择器
  $("<p>text4</p>").appendTo($("body")) // 传递jQuery元素
})
```

---

### 添加到元素内最前面

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>parentNode.prepend(content)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>子元素HTML代码片段，或者jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>childNode.prependTo(selector)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>父元素CSS选择器，或者jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
</div>

```js
$(function () {
  $("body").prepend("<p>text</p>")
  $("body").prepend($("<p>text2</p>"))

  $("<p>text3</p>").prependTo("body")
  $("<p>text4</p>").prependTo($("body"))
})
```
---

### 添加到元素外紧跟元素的后面

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.after(content)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>元素HTML代码片段，或jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.insertAfter(selector)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>元素CSS选择器，或jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
</div>

```js
$(function () {
  // 创建一个元素，用来演示
  $("body").append(`<div class="demo">text</div>`)

  $(".demo").after(`<div>text2</div>`) //传递元素代码片段
  $(".demo").after($(`<div>text3</div>`)) //传递jQuery元素

  $(`<div>text4</div>`).insertAfter(".demo") //传递CSS选择器
  $(`<div>text5</div>`).insertAfter($(".demo")) //传递jQuery元素
})
```

---

### 添加到元素外紧跟元素的前面

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.before(content)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>元素HTML代码片段，或jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.insertBefore(selector)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>content</td>
      <td>元素CSS选择器，或jQuery元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
</div>

```js
$(function () {
  // 创建一个元素，用来演示
  $("body").append(`<div class="demo">text</div>`)

  $(".demo").before(`<div>text2</div>`) //传递元素代码片段
  $(".demo").before($(`<div>text3</div>`)) //传递jQuery元素

  $(`<div>text4</div>`).insertBefore(".demo") //传递CSS选择器
  $(`<div>text5</div>`).insertBefore($(".demo")) //传递jQuery元素
})
```

## 替换元素节点

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.replaceWith(NewElement)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>NewElement</td>
      <td>元素HTML代码片段或jQuery对象，用于替换调用者元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>NewElement.replaceAll(selector)</code>
      </th>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>selector</td>
      <td>CSS选择器或jQuery对象，作为被替换的元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
</div>

```js
$(function () {
  $("body").append(`<div class="demo"> 1 </div>`)

  $(".demo").replaceWith(`<div class="demo2"> 2 </div>`) // 传递HTML代码片段
  $(".demo2").replaceWith($(`<div class="demo3"> 3 </div>`)) // 传递jQuery对象

  $(`<div class="demo4"> 4 </div>`).replaceAll(".demo3") // 传递CSS选择器
  $(`<div class="demo5"> 5 </div>`).replaceAll($(".demo4")) // 传递jQuery对象
})
```

## 删除元素节点

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.remove(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        删除元素本身，如果有参数，则删除元素中与CSS选择器参数匹配上的元素
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>selector</td>
      <td>CSS选择器</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.detach(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        删除元素本身，如果有参数，则删除元素中与CSS选择器参数匹配上的元素
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>selector</td>
      <td>CSS选择器</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>调用者</td>
    </tr>
  </table>
</div>

两者虽然都把元素删除了，但实际上还保存在返回值中，将来还可以进行`append`等操作。

`remove`和`detach`的区别：
* `remove`会把元素上所绑定事件清空，返回值仅保留元素本身。
* `detach`不会删除元素上所绑定事件，事件还保存在返回值中。

```js
$(function () {
  $("body").append(`<div index="1" class="t1">text</div>`)
  $("body").append(`<div index="2" class="t2">text2</div>`)

  $(".t1, .t2").click(function () {
    console.log(this)
  })

  const t1 = $(".t1").remove()
  const t2 = $(".t2").detach()

  $("body").append(t1)
  $("body").append(t2)
})
```
上述代码中，t1元素和t2元素都被删除，且重新加入DOM中，此时t1的点击事件已被清空，而t2点击还能正常响应。

### 清空元素内容

**`Element.empty()`**：元素内所有内容跟子元素都删除，不删除元素本身。

| 参数 | 描述 |
| - | - |
| 无参数 |  |
| **返回值** | 被清空的元素本身 |

```js
$(function () {
  $("body").append(`<div class="demo">text <span>children</span> </div>`)
  $(".demo").empty()
})
```

## 克隆元素节点

**`Element.clone(boolean)`**：克隆一个元素，包含其内容和子元素等。

| 参数 | 描述 |
| - | - |
| boolean | 传递`true`会把元素事件也复制，默认不复制事件 |
| **返回值** | 克隆出来的新元素 |

```js
$(function () {
  $("body").append(`<div class="demo">text <span>children</span> </div>`)

  $(".demo").click(function () {
    console.log(this)
  })

  $("body").append($(".demo").clone(true))
})
```

<Vssue />
