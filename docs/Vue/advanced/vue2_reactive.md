# Vue2响应式原理

Vue通过`Object.defineProperty()`对象的 **属性劫持** + **依赖收集** + **触发更新** 实现的数据响应式。主要实现3个模块：
* **`observe`**：劫持数据，发布通知。
* **`compile`**：编译模板，绑定更新函数。
* **`watcher`**：接收通知，执行更新函数。

首先，**observe**使用`Object.defineProperty`劫持data对象的属性，当属性被调用时触发`getter`，当属性被修改时触发`setter`。`new Compile()`调用数据初始化模板，`Compile`里面`new Watch()`生成订阅者，订阅者一生成，就相当于接通了**observe**和**Compile**的桥梁。**observe**时刻监听着数据的变化，一旦改变就会触发`setter`，`setter`促使**watcher**执行`updata()`函数。

```js
//监听器 (监听数据, 发布通知)
function observe(data) {
  if (!data || typeof data !== "object") return
  Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  //属性劫持
  function defineReactive(data, key, val) {
    var dep = new Dep()
    observe(val) //递归深度劫持
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get() {
        Dep.target && dep.addSub(Dep.target) //当Dep.target标识存在, 添加订阅者
        return val
      },
      set(newVal) {
        val = newVal
        dep.notify() //通知订阅者
      }
    })
  }
}

//订阅器 (管理订阅者)
function Dep() {
  this.subs = []
}
Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub)
  },
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

//订阅者
function Watcher(vm, key, callBack) {
  this.vm = vm
  this.key = key
  this.callBack = callBack
  this.value = this.get() //为了触发属性劫持的getter, 并保存值
}
Watcher.prototype = {
  get() {
    Dep.target = this //添加标识, 将当前订阅者指向自己
    var value = this.vm.data[this.key] //调用属性, 触发getter (将自己添加进订阅器)
    Dep.target = null //添加完毕，销毁标识
    return value
  },
  run() {
    var value = this.vm.data[this.key] //新值
    var oldVal = this.value //旧值
    if (value === oldVal) return
    this.value = value
    this.callBack.call(this.vm, value, oldVal) //执行Compile中绑定的回调, 更新视图
  },
  update() {
    this.run() //收到通知
  }
}

//解析器
function Compile(node, vm) {
  if (!node) return
  this.node = node.nodeType == 1 ? node : document.querySelector(node)
  this.vm = vm
  this.fragment = null
  this.init()
}
Compile.prototype = {
  //初始化
  init() {
    if (!this.node) return
    this.fragment = this.nodeToFragment(this.node) //转文档碎片
    this.compileElement(this.fragment) //编译
    this.node.appendChild(this.fragment) //编译完毕, 插入真实DOM
  },
  //元素节点转文档碎片操作 (提升效率)
  nodeToFragment(node) {
    var fragment = document.createDocumentFragment()
    var child = node.firstChild
    while (child) {
      fragment.appendChild(child)
      child = node.firstChild
    }
    return fragment
  },
  //编译元素节点
  compileElement(el) {
    var childNodes = el.childNodes //子节点
    //伪数组=>数组遍历
    ;[].slice.call(childNodes).forEach(node => {
      var text = node.textContent //节点内容
      var reg = /\{\{(.*)\}\}/ //正则匹配Vue的插值语法 => {{}}
      if (node.nodeType == 1) {
        //元素节点, 编译指令
        this.compile(node)
      } else if (node.nodeType == 3 && reg.test(text)) {
        //文本节点, 编译文本节点
        this.compileText(node, reg.exec(text)[1].trim())
      }
      if (node.childNodes && node.childNodes.length) {
        //递归遍历所有子节点
        this.compileElement(node)
      }
    })
  },
  //编译文本节点
  compileText(node, key) {
    this.updateText(node, this.vm[key]) //初始化视图
    new Watcher(this.vm, key, value => this.updateText(node, value)) //生成订阅器并绑定更新函数
  },
  //编译指令
  compile(node) {
    var nodeAttrs = node.attributes //所有属性
    ;[].slice.call(nodeAttrs).forEach(attr => {
      if (attr.name.indexOf("v-") !== 0) throw new Error("something went wrong")
      var exp = attr.value
      var dir = attr.name.substring(2)
      if (dir.indexOf("on:") === 0) {
        //事件指令
        this.compileEvent(node, this.vm, exp, dir)
      } else {
        //v-model 指令
        this.compileModel(node, this.vm, exp, dir)
      }
      node.removeAttribute(attr.name)
    })
  },
  //处理事件指令
  compileEvent(node, vm, exp, dir) {
    var eventType = dir.split(":")[1] //事件类型
    var callback = vm.methods && vm.methods[exp] //methods是否存在响应函数
    if (eventType && callback) {
      node.addEventListener(eventType, callback.bind(vm), false)
      //Vue事件内的this都指向Vue实例
    }
  },
  //处理v-model指令
  compileModel(node, vm, exp, dir) {
    var val = this.vm[exp]
    node.value = typeof val == "undefined" ? "" : val
    new Watcher(this.vm, exp, value => (node.value = typeof value == "undefined" ? "" : value))
    node.addEventListener("input", e => {
      var newValue = e.target.value
      if (val === newValue) return
      this.vm[exp] = newValue
      val = newValue
    })
  },
  //更新视图
  updateText(node, value) {
    node.textContent = typeof value == "undefined" ? "" : value
  }
}

//MVVM
function MVVM(options) {
  this.data = options.data
  this.methods = options.methods
  this.init(options)
}

MVVM.prototype = {
  init(options) {
    Object.keys(this.data).forEach(key => this._proxy(key)) //代理
    observe(this.data) //监听
    new Compile(options.el, this) //编译
  },
  //vm.key 代理 vm.data.key
  _proxy(key) {
    var _this = this
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: false,
      get() {
        return _this.data[key]
      },
      set(newVal) {
        _this.data[key] = newVal
      }
    })
  }
}
```

<Vssue />