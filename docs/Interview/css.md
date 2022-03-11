# CSS
## CSS垂直居中
```html
<div class="box">
  <div class="small">small</div>
</div>
```
* 使用**子绝父相**，定位垂直`50%`，然后使用`margin`或者`calc`减去高度的一半。
```css
.box {
  position: relative;
  width: 300px;
  height: 300px;
  background-color: red;
}
.small {
  position: absolute;
  /* 
   * top: 50%;
   * margin-top: -50px; 
  */
  top: calc(50% - 50px);
  width: 100px;
  height: 100px;
  background-color: yellow;
}
```
如果未知高度，可以使用`transform`
```css
.box {
  position: relative;
  width: 300px;
  height: 300px;
  background-color: red;
}
.small {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  height: 100px;
  background-color: yellow;
}
```
* 使用`flex`。
```css
.box {
  display: flex;
  align-items: center;
  width: 300px;
  height: 300px;
  background-color: red;
}
.small {
  width: 100px;
  height: 100px;
  background-color: yellow;
}
```
---

## CSS三角形
宽高定位0，给边框宽度、颜色。
 * 给三角形对角一边的**宽度**设为`0`。
 * 给三角形对角一边的**颜色**和两侧的颜色设为透明`transparent`。
```html
<style>
  .border {
    width: 0;
    height: 0;
    border-style:solid;
    border-width: 0 50px 50px;
    border-color: transparent transparent #d9534f;
  }
</style>
<div class="border"></div>
```
---

## 两栏布局
```html
<div class="box">
  <div class="left">左边</div>
  <div class="right">右边</div>
</div>
```
### 左边固定，右侧自适应
* 左侧`float`或者`position`脱离文档流，右侧使用`margin-left`隔开距离。
```css
.box {
  overflow: hidden; /* 添加BFC，形成独立块级作用域，不收外部元素影响 */
}
.left {
  float: left;
  width: 200px;
  height: 400px;
  background-color: gray;
}
.right {
  margin-left: 210px;
  height: 200px;
  background-color: lightgray;
}
```
* 全部浮动，右侧使用`calc`动态计算。
```css
.box {
  overflow: hidden;
}
.left {
  float: left;
  width: 200px;
  height: 400px;
  background-color: gray;
}
.right {
  float: left;
  width: calc(100% - 200px);
  height: 200px;
  background-color: lightgray;
}
```
* 使用`flex`布局，自适应的一侧`flex:1`填满剩余。
```css
.box {
  display: flex;
  align-items: flex-start; /* 去除stretch等高效果 */
}
.left {
  width: 200px;
  height: 400px;
  background-color: gray;
}
.right {
  flex: 1; /* 填满剩余 */
  height: 200px;
  background-color: lightgray;
}
```
---
## 三栏布局
```html
<div class="container">
  <div class="left">left</div>
  <div class="center">center</div>
  <div class="right">right</div>
</div>
```
### 两边固定，中间自适应
* 左右使用`position`定位上去，中间的使用`margin`隔开
```css
.container {
  position: relative;
}
.left, .right {
  position: absolute;
  top: 0;
  width: 400px;
  height: 200px;
  background-color: green;
}
.left {
  left: 0;
}
.right {
  right: 0;
}
.center {
  height: 200px;
  margin: 0 400px;
  background-color: yellow;
}
```
* 全部浮动，中间使用`calc`计算
```css
.container {
  overflow: hidden;
}
.left, .right, .center {
  float: left;
}
.left, .right {
  width: 200px;
  background-color: red;
}
.center {
  width: calc(100% - 400px);
  background-color: yellow;
}
```
* `flex`布局，中间使用`flex:1`填满。
```css
.container {
  display: flex;
  align-items: flex-start;
}
.left,
.right {
  width: 200px;
  height: 200px;
  background-color: red;
}
.center {
  flex: 1;
  background-color: yellow;
}
```

### 中间固定，左右自适应
* 全部浮动，左右使用`calc`计算
```css
.container {
  overflow: hidden;
}
.left, .right, .center {
  float: left;
}
.left, .right {
  width: calc((100% - 100px) / 2);
  background-color: red;
}
.center {
  width: 200px;
  background-color: yellow;
}
```
* `flex`布局，左右`flex:1`填满。
```css
.container {
  display: flex;
  align-items: flex-start;
}
.left,
.right {
  flex: 1;
  background-color: red;
}
.center {
  width: 200px;
  height: 400px;
  background-color: yellow;
}
```
---