# 动画相关API

## show系列

show系列API，主要操作元素的显示隐藏。

**`Element.show(speed[,easing[,fn]])`**：显示动画。

**`Element.hide(speed[,easing[,fn]])`**：隐藏动画。

**`Element.toggle(speed[,easing[,fn]])`**：显示和隐藏动画的切换（显示则隐藏，隐藏则显示）。

| 参数 | 描述 |
| - | - |
| speed | 执行动画的时长，单位ms |
| easing | 执行动画的速度，取值为swing（缓速）、linear（均速），默认swing |
| fn | 动画执行完毕之后的回调函数 |
| **返回值** | 调用者 |

```html
<style>
  #box {
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>

<div id="box"></div>
<button>show</button>
<button>hide</button>
<button>toggle</button>

<script>
  $(function () {
    $("button").eq(0).click(function () {
      $("#box").show(1000, function () {
        alert("显示完毕~~")
      })
    })

    $("button").eq(1).click(function () {
      $("#box").hide(1000, function () {
        alert("隐藏完毕~~")
      })
    })

    $("button").eq(2).click(function () {
      $("#box").toggle(1000, function () {
        alert("切换完毕~~")
      })
    })
  })
</script>
```

---

## slide系列

slide系列API，主要操作元素的展开收起。

**`Element.slideDown(speed[,easing[,fn]])`**：展开动画。

**`Element.slideUp(speed[,easing[,fn]])`**：收起动画。

**`Element.slideToggle(speed[,easing[,fn]])`**：展开和收起动画的切换（展开则收起，收起则展开）。

| 参数 | 描述 |
| - | - |
| speed | 执行动画的时长，单位ms |
| easing | 执行动画的速度，取值为swing（缓速）、linear（均速），默认swing |
| fn | 动画执行完毕之后的回调函数 |
| **返回值** | 调用者 |

还是上面的代码：
```js
$(function () {
  $("button").eq(0).click(function () {
    $("#box").slideDown(1000, function () {
      alert("展开完毕~~")
    })
  })

  $("button").eq(1).click(function () {
    $("#box").slideUp(1000, function () {
      alert("收起完毕~~")
    })
  })

  $("button").eq(2).click(function () {
    $("#box").slideToggle(1000, function () {
      alert("切换完毕~~")
    })
  })
})
```

## fade系列

fade系列API，主要操作元素的淡入淡出。

**`Element.fadeIn(speed[,easing[,fn]])`**：淡入动画。

**`Element.fadeOut(speed[,easing[,fn]])`**：淡出动画。

**`Element.fadeToggle(speed[,easing[,fn]])`**：淡入和淡出动画的切换（淡入则淡出，淡出则淡入）。

**`Element.fadeTo(speed[,opacity[,easing[,fn]]])`**：淡入或淡出到某个模糊度的动画。

| 参数 | 描述 |
| - | - |
| speed | 执行动画的时长，单位ms |
| opacity | 模糊度，取值为0~1之间 |
| easing | 执行动画的速度，取值为swing（缓速）、linear（均速），默认swing |
| fn | 动画执行完毕之后的回调函数 |
| **返回值** | 调用者 |

还是上面的代码，加了一个`<button>`：
```js
$(function () {
  $("button").eq(0).click(function () {
    $("#box").fadeIn(1000, function () {
      alert("淡入完毕~~")
    })
  })

  $("button").eq(1).click(function () {
    $("#box").fadeOut(1000, function () {
      alert("淡出完毕~~")
    })
  })

  $("button").eq(2).click(function () {
    $("#box").fadeToggle(1000, function () {
      alert("切换完毕~~")
    })
  })

  $("button").eq(3).click(function () {
    $("#box").fadeTo(1000, 0.8, function () {
      alert("淡到模糊度0.8完毕~~")
    })
  })
})
```

## animate

**`Element.animate(params, speed[,easing[,fn]])`**：自定义动画。

| 参数 | 描述 |
| - | - |
| params | 一组包含作为动画 **属性** 和 **终值** 的样式属性和及其值的集合 |
| speed | 执行动画的时长，单位ms |
| easing | 执行动画的速度，取值为swing（缓速）、linear（均速），默认swing |
| fn | 动画执行完毕之后的回调函数 |
| **返回值** | 调用者 |

跟前面的三种动画相比，只多了一个参数一对象，用来让我们自定义执行动画的属性。

```html
<style>
  #box {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>

<div id="box"></div>

<script>
  $(function () {
    $("#box").click(function () {
      $(this).animate({
        // 1.对象
        "left": 500,
        "top": 200,
        "opacity": 0.5,
        "zIndex": 100
      }, 1000, "linear", function () {
        // 2.时长 3.速度 4.回调函数
        alert("自定义动画执行完毕~~")
      })
    })
  })
</script>
```

### 属性累加

`animate()` 每次执行都会把属性值赋值给属性名为止。如果想不改变原先的基础，在原先的样式基础上作动画，那么定义属性值时：用字符串的 `"+= 值"` 就可以了。
```html
<style>
  #box {
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>

<div id="box"></div>

<script>
  $(function () {
    $("#box").click(function () {
      $(this).animate({
        // 原本宽度是100，执行之后宽度是100+100，再次执行之后是100+100+100
        "width": "+=100"
      }, 1000, "linear", function () {
        alert("宽度累加完毕~~")
      })
    })
  })
</script>
```

### 取值关键字

`animate()` 参数一的对象里的属性不仅可以取值为具体的数值，还可以是某些关键字，例如：

* `show`：显示样式
* `hide`：隐藏样式
* `toggle`：样式显示则隐藏，隐藏则显示

```html
<style>
  #box {
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>

<div id="box"></div>
<button>toggle</button>

<script>
  $(function () {
    $("button").click(function () {
      $("#box").animate({
        "width": "toggle" //切换宽度的显示隐藏
      }, 1000, "linear")
    })
  })
</script>
```
## delay

jQuery中可以用链式调用来执行多段动画。

**`Element.delay(duration)`**：延迟下一段动画的执行。

| 参数 | 描述 |
| - | - |
| duration | 延迟的时间，单位ms |
| **返回值** | 调用者 |

```html
<style>
  #box {
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>

<div id="box"></div>
<button>animate</button>

<script>
  $(function () {
    $("button").click(function () {
      $("#box")
        .animate({ "width": 500 })
        .delay(2000) // 将宽度变为500，延迟2秒后，将高度变为500
        .animate({ "height": 500 })
    })
  })
</script>
```

## stop

**`Element.stop([,clearQueue] [,jumpToEnd])`**：停止动画。

| 参数 | 描述 |
| - | - |
| clearQueue | 是否清空动画队列，默认false |
| jumpToEnd | 是否立即完成当前动画，省略参数或者参数为false，则立即停止 |
| **返回值** | 调用者 |

```html
<style>
  #box {
    position: relative;
    width: 100px;
    height: 100px;
    background-color: skyblue;
  }
</style>

<div id="box"></div>
<button>animate</button>
<button>stop</button>

<script>
  $(function () {
    $("button").eq(0).click(function () {
      $("#box")
        .animate({ "width": 500 }, 2000)
        .animate({ "height": 500 }, 2000)
        .animate({ "left": 100 }, 2000)
    })

    $("button").eq(1).click(function () {
      // 不清空队列，立即停止当前的
      $("#box").stop()

      // 不清空队列，立即停止当前的
      // $("#box").stop(false)

      // 不清空队列，立即停止当前的
      // $("#box").stop(false, false)

      // 不清空队列，立即完成当前的
      // $("#box").stop(false, true)

      // 清空队列，立即完成当前的
      // $("#box").stop(true, true)

      // 清空队列，立即停止当前的
      // $("#box").stop(true)

      // 清空队列，立即停止当前的
      // $("#box").stop(true, false)
    });
  })
</script>
```

<Vssue />