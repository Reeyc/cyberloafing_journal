# 入口函数

## jQuery入口函数

jQuery和原生JS如果写了入口函数，那么他们都会等到DOM加载完毕才会执行。

但jQuery和原生JS入口函数还是有区别的：

原生JS入口函数会等到DOM元素加载完毕，并且图片也加载完毕才会执行。而jQuery入口函数会等到DOM元素加载完毕，但不会等待图片加载完毕就执行（提升网页速度）。
```js
//原生JS
window.onload = function () {
  var img = document.getElementsByTagName("img")[0];
  var imgWidth = getComputedStyle(img, null).width;
  console.log(imgWidth); // 190px
};

//jQuery
$(document).ready(function () {
  var $img = $("img");
  var $width = $img.width();
  console.log($width); // 0
});
```

原生JS如果写了多个入口函数，那么后写的会覆盖先写的，先写的不会执行。而jQuery如果写了多个入口函数，后写的不会覆盖先写的，都会执行。
```js
//原生JS
window.onload = function () {
  console.log("Hello1111111~"); //不会执行
};
window.onload = function () {
  console.log("Hello2222222~"); //执行
};

//jQuery
$(document).ready(function () {
  console.log("jQuery11111111111~~"); //会执行
});
$(document).ready(function () {
  console.log("jQuery22222222222~~"); //会执行
});
```

### jQuery入口函数的四种写法
第一种写法：
```js
jQuery(document).ready(function () {
  console.log("第一种写法~~");
});
```

第二种写法：
```js
$(document).ready(function () {
  console.log("第二种写法~~");
});
```

第三种写法：
```js
jQuery(function () {
  console.log("第三种写法~~");
});
```

第四种写法： <Badge text="推荐"/> 
```js
$(function () {
  console.log("第四种写法~~");
});
```
推荐使用第四种写法，遵循jQuery的设计宗旨：**`write Less，Do More`**（写的更少，做的更多）。

## jQuery冲突问题

**`$`** 符号是jQuery的访问符号，将来在开发中，如果使用了多个框架/库，别的框架里也有 **`$`** 符号。
那么后写的框架会覆盖先写的框架，先写的 **`$`** 就会失效了！

---

此时就需要解决访问符号 **`$`** 的冲突问题：
1. 释放 **`$`** 的使用权

   在编写jQuery代码之前写一句`jQuery.noConflict()`。使用了`jQuery.noConflict()`之后，就不能再用 **`$`** 符号访问，必须要换成jQuery来访问。
```js
jQuery.noConflict();

// $(document).ready(function(){
//   console.log("a");//无法访问,$符号的使用权已释放
// });

jQuery(document).ready(function () {
  console.log("b"); //可以访问
});
```

2. 自定义访问符

   利用`jQuery.noConflict()`的方式，赋值给一个变量，然后访问时用这个变量访问就可以了。
```js
var cc = jQuery.noConflict(); //自定义访问符

cc(document).ready(function () {
  console.log("b"); //可以访问
});
```

<Vssue />