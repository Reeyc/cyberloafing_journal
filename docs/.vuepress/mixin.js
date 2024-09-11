export default {
  data() {
    return {
      wx: "Hooks__",
      wechat: require("./public/assets/img/wechat.png")
    }
  },
  mounted() {
    document.title = "Cyberloafing Journal - 个人日志文章记录"
    setTimeout(() => {
      const hasWechat = document.querySelector("._wechat")

      if (!hasWechat) {
        const wechat = document.createElement("div")
        wechat.className = "_wechat"
        wechat.innerHTML = `
            <span class="icon iconfont icon-weixin"></span>
            <span>Wechat: ${this.wx}</span>
            <span class="icon iconfont icon-copy"></span>
            <div class="_wechat-img">
              <img src="${this.wechat}" />
            </div>
        `

        const target = document.querySelector(".home-link")
        this.insertAfter(wechat, target)

        const wechatCopy = document.querySelector(".icon.icon-copy")
        const wechatImg = document.querySelector("._wechat ._wechat-img")

        wechat.onclick = this.showWechat
        wechatCopy.onclick = this.copyText

        document.onclick = function () {
          wechatImg.style.display = "none"
        }
      }
    }, 500)
  },
  methods: {
    insertAfter(newElement, targetElement) {
      const parent = targetElement.parentNode
      if (parent.lastChild == targetElement) {
        parent.appendChild(newElement)
      } else {
        parent.insertBefore(newElement, targetElement.nextSibling)
      }
    },
    copyText() {
      const input = document.createElement("input")
      input.setAttribute("value", this.wx)
      document.body.appendChild(input)
      input.select()
      document.execCommand("Copy")
      document.body.removeChild(input)
    },
    showWechat(event) {
      event.stopPropagation && event.stopPropagation()
      event.cancelBubble = true

      const wechatImg = document.querySelector("._wechat ._wechat-img")
      if (wechatImg.offsetParent === null) {
        wechatImg.style.display = "flex"
      } else {
        wechatImg.style.display = "none"
      }
    }
  }
}
