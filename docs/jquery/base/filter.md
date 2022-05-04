# 筛选相关API

## index

**`Element.index(element|selector)`**：获取指定元素在jQuery对象中的索引。

| 参数 | 描述 |
| - | - |
| element | 可以是DOM对象，也可以是jQuery对象，也可以是CSS选择器，如果不传递则是获取当前第一个元素在同级元素中的索引 |
| **返回值** | 索引 |

```html
<div>
  <h3></h3>
  <p></p>
  <span class="span1"></span>
  <span class="span2"></span>
  <span class="span3"></span>
</div>

<script>
  $(function () {
    // 获取当前元素（如果多个，取第一个）在同级元素中的索引
    console.log($("head").index()); // 0
    console.log($("body").index()); // 1
    console.log($("p").index()); // 1
    console.log($("span").index()); // 2

    // 获取指定元素（如有多个，取第一个）在当前元素（如有多个，取第一个）中的索引
    console.log($('span').index($('.span2'))) // 1
  })
</script>
```

## eq & get

jQuery对象是一个伪数组对象，可以单独取出里面的某个元素使用。

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.eq(index)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取jQuery对象中的元素，并以jQuery对象包裹返回。
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>index</td>
      <td>索引，负值则会从后往前查找</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回指定的元素，以jQuery对象包裹</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.get(index)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取jQuery对象中的元素。
      </td>
    </tr>
    <tr>
      <td>
        <strong>参数</strong>
      </td>
      <td>描述</td>
    </tr>
    <tr>
      <td>index</td>
      <td>索引</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回指定的元素。</td>
    </tr>
  </table>
</div>

两者的区别是：`eq`返回的是jQuery对象，可以继续调用jQuery提供的方法。而`get`返回的是里面原始的元素，其实`get(index)`跟 `jQuery对象[index]` 的操作是一样的。
```html
<div>
  <span class="span1"></span>
  <span class="span2"></span>
  <span class="span3"></span>
</div>

<script>
  $(function () {
    // jQuery对象可以调用addClass方法
    $('span').eq(0).addClass('active')

    // 原生JS DOM对象
    $('span').get(0).classList.add('active2')

    console.log($('span').get(0) === $('span')[0]) // true
  })
</script>
```

## children & find

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.children(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取指定的子元素集合
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
      <td>CSS选择器，不传则获取所有子元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>获取匹配的子元素，以jQuery对象包裹返回</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.find(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取指定的后代元素集合
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
      <td>获取匹配的后代元素，以jQuery对象包裹返回</td>
    </tr>
  </table>
</div>

```html
<div id="container">
  <div id="parent">
    <span class="span1"></span>
    <span class="span2"></span>
    <span class="span3"></span>
  </div>
</div>

<script>
  $(function () {
    // 获取到所有的span
    $('#parent').children().addClass('index')

    // 获取到 span2
    $('#parent').children('.span2').removeClass('index')

    // 获取到 span3
    $('#container').find('.span3').addClass('p')
  })
</script>
```

## parent & parents

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.parent(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取指定的父元素集合
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
      <td>CSS选择器，不传则获取所有父元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>获取匹配的父元素，以jQuery对象包裹返回</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.parents(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取指定的祖先元素集合
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
      <td>CSS选择器，不传则获取所有祖先元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>获取匹配的祖先元素，以jQuery对象包裹返回</td>
    </tr>
  </table>
</div>

```html
<div id="container">
  <div id="parent">
    <span class="span1"></span>
    <span class="span2"></span>
    <span class="span3"></span>
  </div>
  <div id="parent2">
    <span></span>
  </div>
</div>

<script>
  $(function () {
    // 获取到 parent、 parent2 和 container
    $('span, #parent').parent().addClass('p')

    // 获取到 parent
    $('span').parent('#parent').removeClass('p')

    // 获取到 parent、 parent2 和 container
    $('span').parents().addClass('p+')

    // 获取到 container
    $('span').parents('#container').removeClass('p+')
  })
</script>
```

`parent`只能查找父元素，`parents`可以查找祖先元素（包含父元素）。
```js
// 获取不到
$('span').parent('#container').removeClass('p+')

// 可以获取
$('span').parents('#container').removeClass('p+')
```


## next & prev

<div class="flex table-scroll">
  <table style="overflow: unset; margin-right: 30px">
    <tr>
      <th colspan="2">
        <code>Element.next(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取指定元素中最后一个元素的下个指定紧邻元素集合
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
      <td>CSS选择器，不传则获取指定元素中最后一个元素的所有下个紧邻元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回下个紧邻元素集合，以jQuery对象包裹返回</td>
    </tr>
  </table>
  <table style="overflow: unset;">
    <tr>
      <th colspan="2">
        <code>Element.prev(selector)</code>
      </th>
    </tr>
    <tr>
      <td colspan="2">
        获取指定元素中第一个元素的上个指定紧邻元素集合
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
      <td>CSS选择器，不传则获取指定元素中第一个元素的所有上个紧邻元素</td>
    </tr>
    <tr>
      <td>
        <strong>返回值</strong>
      </td>
      <td>返回上个紧邻元素集合，以jQuery对象包裹返回</td>
    </tr>
  </table>
</div>

```html
<div id="container">
  <p>parent的上一个</p>
  <div id="parent">
    <p class="p">span的上一个</p>
    <span class="span1"></span>
    <span class="span2"></span>
    <span class="span3"></span>
    <p class="p">span的下一个</p>
  </div>
  <p>parent的下一个</p>
</div>

<script>
  $(function () {
    // 获取<span>中最后一个<span>的下个紧邻元素，#parent同理
    $('span, #parent').next().text() // 'parent的下一个 span的下一个'

    // 获取<span>中第一个<span>的上个紧邻元素，#parent同理
    $('span, #parent').prev().text() // 'parent的上一个 span的上一个'

    // 在紧邻元素中取指定的元素
    $('span, #parent').next('.p').text() // 'span的下一个'
    $('span, #parent').prev('.p').text() // 'span的上一个'
  })
</script>
```

## siblings

**`Element.siblings(selector)`**：获取同级列表中非当前元素的所有元素集合。

| 参数 | 描述 |
| - | - |
| selector | CSS选择器，不传则获取所有同级元素 |
| **返回值** | 同级列表中非当前元素的所有元素集合 |

下面是一个利用`siblings()`排他思想实现的一个Tab切换的例子：

```html
<style>
  .parent {
    overflow: hidden;
  }

  span, p {
    float: left;
    font-size: 18px;
    padding: 20px;
    margin: 10px;
    border: 3px solid #000;
  }

  span.active, p.active {
    border-color: #f00;
  }
</style>

<div class="parent">
  <span>span</span>
  <span>span</span>
  <span>span</span>
</div>
<br>
<div class="parent">
  <p>p</p>
  <p>p</p>
  <p>p</p>
</div>

<script>
  $(function () {
    $('span, p').on('click', function () {
      $(this).addClass('active').siblings().removeClass('active')
    })
  })
</script>
```