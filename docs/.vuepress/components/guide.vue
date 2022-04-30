<template>
  <div class="guide-page">
    <div v-for="(item, index) of classifyList" :key="index" class="guide-item" @click="$router.push(item.link)">
      <img :src="item.img" alt="" />
      <div class="guide-info">
        <div class="title">{{ item.title }}</div>
        <v-clamp :max-lines="2" class="desc">
          {{ item.desc }}
          <template #after="{ toggle, expanded, clamped }">
            <span v-show="expanded || clamped" class="toggle iconfont" :class="expanded ? 'icon-close' : 'icon-open'" @click.stop="toggle">
            </span>
          </template>
        </v-clamp>
      </div>
    </div>
  </div>
</template>

<script>
import VClamp from "vue-clamp"
export default {
  components: { VClamp },
  data() {
    return {
      classifyList: [
        {
          title: "JavaScript",
          desc: "一种具有函数优先的轻量级，解释型或即时编译型的高级编程语言。常作为开发Web页面的脚本语言。",
          img: require("../public/assets/icon/js.png"),
          link: "/js/"
        },
        {
          title: "jQuery",
          desc: "一个高效、精简并且功能丰富的 JavaScript 工具库",
          img: require("../public/assets/icon/jquery.png"),
          link: "/jquery/"
        },
        {
          title: "ES6",
          desc: "全称 ECMAScript 6.0 ，是 JavaScript 的下一个版本标准。",
          img: require("../public/assets/icon/es6.png"),
          link: "/es6/"
        },
        {
          title: "Vue",
          desc: "Vue.js 是一款轻量级的、以数据驱动构建web界面的前端JS框架，它能让你通过简单而灵活的 API 创建由数据驱动的 UI 组件。",
          img: require("../public/assets/icon/vue.png"),
          link: "/vue/"
        },
        {
          title: "React",
          desc: "React 是Facrbook内部的一个JavaScript类库并开源，可用于创建Web用户交互界面。",
          img: require("../public/assets/icon/react.png"),
          link: "/react/"
        },
        {
          title: "Typescript",
          desc:
            "TypeScript 是微软开发的一个开源的编程语言，通过在JavaScript的基础上添加静态类型定义构建而成。TypeScript通过TypeScript编译器或Babel转译为JavaScript代码，可运行在任何浏览器，任何操作系统。",
          img: require("../public/assets/icon/ts.png"),
          link: "/ts/"
        },
        {
          title: "Node",
          desc:
            "Node.js 是一个基于Chrome V8引擎的JavaScript运行环境，使用了事件驱动、非阻塞式I/O模型， 让JavaScript 可以运行在服务端的开发平台。",
          img: require("../public/assets/icon/node.png")
        },
        {
          title: "Webpack",
          desc: "webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具。",
          img: require("../public/assets/icon/webpack.png")
        },
        {
          title: "Vite",
          desc: "一种面向现代浏览器的一个更轻、更快的前端构建工具，能够显著提升前端的开发体验。",
          img: require("../public/assets/icon/vite.png")
        }
      ]
    }
  }
}
</script>

<style scoped lang="stylus">
.guide-page
  .guide-item
    display: flex;
    align-items: center;
    min-height: 120px;
    margin-bottom: 15px;
    border-radius: 4px;
    padding: 10px 20px;
    box-shadow: 1px 0px 10px #ebe7e7;
    cursor pointer
    img
      width 80px
      height 80px
    .guide-info
      align-self: flex-start
      flex: 1
      margin-left 20px
      .title
        font-size 20px
        font-weight bold
        padding-bottom 3px
        border-bottom 1px solid #dedede
        color: #2c3e50
      .desc
        position relative
        z-index 5
        font-size 14px
        padding-top 5px
        color: #999
        .toggle
          position relative
          font-size: 14px
          vertical-align: middle
          padding-left 10px
          &::after
            content: ""
            position absolute
            left -30px
            right -30px
            top -30px
            bottom -30px
</style>

<!--hover边框效果-->
<style scoped lang="stylus">
.guide-item
  position: relative;
  box-sizing: border-box;

  &::before,
  &::after
    box-sizing: inherit;
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border: 2.5px solid transparent;

  &::after
    bottom: 0;
    right: 0;

  &::before
    top: 0;
    left: 0;

  &:hover::before,
  &:hover::after
    width: 100%;
    height: 100%;

  &:hover::before
    border-top-color: #0285e3;
    border-right-color: #0285e3;
    border-radius: 4px;
    transition: width .2s ease-out, height .2s ease-out .2s;

  &:hover::after
    border-bottom-color: #0285e3;
    border-left-color: #0285e3;
    border-radius: 4px;
    transition: border-color 0s ease-out .4s, width .2s ease-out .4s, height .2s ease-out .6s;
</style>
