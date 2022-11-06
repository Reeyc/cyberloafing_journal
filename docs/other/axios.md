# Axios

axios的主要功能用于向服务端发送请求，接收响应。axios和ajax在底层都是用`XMLHttpRequest`对象来实现的。
```shell
npm i axios -S
```

axios本身是一个函数，返回值是一个Promise对象，因此可以用`then`异步接收它请求的数据，用`catch`捕获请求发生的错误：

**`axios(url[, config])`**：发起网络请求，返回一个Promise对象。

| 参数 | 描述 |
| - | - |
| url | 请求的地址 |
| config | 请求的配置对象 |
| **返回值** | Promise对象 |

```js
import axios from 'axios'

axios()
  .then(r => console.log(r))
  .catch(e => console.log(e));
```

**配置对象**的常见属性：

| 属性 | 描述 |
| - | - |
| url | 请求的地址，若忽略实参一的url，则该项必传 |
| method | 请求的方式，默认get |
| params | params参数，用于get请求 |
| data | body参数，常用于post请求 |
| timeout | 请求超时的毫秒数 |
| responseType | 响应的数据类型，默认为JSON |

下面是使用axios分别发起get请求和post请求的例子：
```js
axios({
  url: "./data.json",
  method: "get",
  params: { x: 1 }
}).then(res => {
  console.log(res)
})

axios({
  url: "./data.json",
  method: "post",
  params: { y: 2 }
}).then(res => {
  console.log(res)
})
```

## 请求方法别名

为方便发起请求，axios为所有支持的请求方法提供了别名：
```js
axios.get(url[, config]) // GET
axios.delete(url[, config])
axios.head(url[, config])
axios.post(url[, data[, config]]) // POST
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```
本文介绍GET&POST请求

### axios.get

**`axios.get(url[, config])`**：发送get请求。

| 参数 | 描述 |
| - | - |
| url | 请求的地址 |
| config | 可选的配置对象，同`axios()`的配置对象 |
| 返回值 | Promise对象 |

使用`axios.get()`传递请求参数有2种方式

1. **写在配置对象的`params`属性中** <Badge text="推荐"/>：
```js
axios.get("./data.json", {
  params: { x: 1 }
}).then(res => {
  console.log(res)
})
```

2. **手动拼接在url地址后面**：
```js
axios.get("./data.json?x=1").then(res => {
  console.log(res)
})
```

---

### axios.post

**`axios.post(url[, data[, config]])`**：发送post请求。

| 参数 | 描述 |
| - | - |
| url | 请求的地址 |
| data | 请求的参数，可选的键值对对象，或者可选的字符串，以url参数的格式传递参数 |
| config | 可选的配置对象，同`axios()`的配置对象 |
| 返回值 | Promise对象 |

* **使用`axios.post()`传递JSON参数**，直接通过第二实参来传递**对象**即可：
```js
axios.post("./data.json", {
  y: 2
}).then(res => {
  console.log(res)
})
```

* **使用`axios.post()`传递FormData参数**，通过第二实参来传递**x-www-form-urlencoded格式的数据**：
```js
axios.post("./data.json", "y=2&z=3").then(res => {
  console.log(res)
})
```
JS的`FormData`实例对象也会被识别，当成**FormData参数**传递过去：
```js
const formData = new FormData()
formData.append("y", 2)
formData.append("z", 3)

axios.post("./data.json", formData).then(res => {
  console.log(res)
})
```
:::tip
传递二进制文件，不可通过**JSON参数**的形式传递，只能通过**FormData参数**来传递。
:::

:::tip 知识点
POST 请求可以同时携带`params`参数和`body`参数，因为POST拥有请求体。
```js
axios.post("./data.json?x=1", { 
  y: 2, 
  z: 3 
}).then(res => {
  console.log(res)
})
```
而Axios不支持GET请求携带`body`参数，因为带有请求体的GET请求信息存在未定义的语义，发送带有`body`的GET请求将会导致某些现有实现拒绝该请求。换言之，在GET请求里带`body`存在风险，就算服务器不会忽略GET请求的`body`，各种代理和缓存可能也会过滤`body`。
:::

### axios.all

**`axios.all(iterable)`**：发送并发请求。

| 参数 | 描述 |
| - | - |
| iterable | 请求数组 |
| 返回值 | Promise对象 |

同时发送多个请求，底层根据`Promise.all`来实现：当数组里面的所有Promise对象状态为`fulfilled`时，返回的这个Promise状态才为`fulfilled`，换言之，此时才会继续执行`then()`，一旦有一个请求失败，返回的Promise状态将为`rejected`，此时会执行`catch()`。

```js
axios.all([
  axios.get("./data.json?x=1"),
  axios.get("./data.json?x=1"),
  axios.get("./data.json?x=1")
]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

`then()`回调函数的参数是一个数组，数组依次保存了每一个请求返回的数据。


### axios.spread

**`axios.spread(callback)`**：处理并发请求。

| 参数 | 描述 |
| - | - |
| callback | 回调函数 |

`axios.spread`用于处理并发请求响应的数据，该方法只能在`axios.all`的`then()`里调用，它的参数是一个回调函数，回调函数的每一个参数就是`axios.all`的每一个响应结果，所以该方法一般和`axios.all`搭配使用。
```js
axios.all([
  axios.get("./data.json?x=1"), 
  axios.get("./data.json?x=1"), 
  axios.get("./data.json?x=1")
]).then(
  axios.spread((res1, res2, res3) => {
    console.log(res1)
    console.log(res2)
    console.log(res3)
  })
)
```

### axios.create

**`axios.create([config])`**：创建一个axios实例。

| 参数 | 描述 |
| - | - |
| config | 可选的配置对象，同`axios()`的配置对象 |
| 返回值 | axios实例 |

`axios.create()`通常用于对axios的二次封装使用，因为返回的axios实例也支持通过实例方法发起请求，并且每个请求的配置都采用`axios.create`传入的配置对象。

```js
const instace = axios.create({
  baseURL: "http://www.example.com/", // 公共URL
  timeout: 3000 // 超时时间
})

// http://www.example.com/data.json
instace.get("data.json").then(res => {
  console.log(res)
})

// http://www.example.com/data.json
instace.post("data.json").then(res => {
  console.log(res)
})
```

## 响应对象

axios将服务端返回的信息包装成了一个响应信息对象，对象内包含了一系列响应的信息：
* **`data`**：响应的内容。
* **`status`**：响应的http状态码。
* **`statusText`**：响应的状态信息（如：200返回`OK`，304返回`Not Modified`，404返回`Not Found`）。
* **`headers`**：响应头信息。
* **`config`**：请求的配置对象。
* **`request`**：请求的`XMLHttpRequest`对象。

## 请求配置

配置对象里，除了前面所讲的`url`、`method`、`params`、`data`、`responseType`之外，还有许多的配置属性：

* **`baseURL`**：将会自动加在url前面，用的比较少，通常是用[全局URL](/other/axios.md#全局url) 。
```js
// 请求 http://www.example.com/add
axios("add", {
  baseURL: "http://www.example.com/"
})
```

* **`headers`**：设置请求头信息。
```js
axios({
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})
```
* **`timeout`**：设置请求超时的信息，单位是毫秒，如果在这段时间内还没有收到服务端的响应数据，将中断本次请求。
```js
axios({
  timeout: 1000 * 60 * 5 // 5min超时
})
```
* **`withCredentials`**：跨域请求时，是否携带cookie信息。
```js
axios({
  withCredentials: true // 跨域时，携带cookie信息
})
```
* **`transformRequest`**：一个数组，数组里有一个函数，在向服务端发起请求之前执行该函数，函数内的参数就是发送请求的参数，可以在发送请求之前，在该函数内对参数数据进行加工改造。

1. 该参数只能在 PUT，POST 和 PATCH 的请求方式内才生效，GET 方式无效。
2. 函数内对数据加工完毕后，必须以**字符串**的形式`return`将数据返回。
```js
axios({
  data: { x: 1 },
  transformRequest: [
    function (data) {
      data.y = 2
      return data
    }
  ]
})
```
:::warning 注意
因为`transformRequest`返回的是字符串形式的参数，如果使用了`transformRequest`修改了post的参数对象，那么请求的对象参数会变成`[object Object]`，此时需要引入`Qs`这个库，将其转为正常参数。
```js
axios({
  url: "./data.json",
  method: "post",
  data: { x: 1 },
  transformRequest: [
    function (data) {
      data.y = 2
      return Qs.stringify(data)
    }
  ]
})
```
`Qs`库在安装axios时，就已安装。
:::


* **`transformResponse`**：一个数组，数组里有一个函数，在服务端响应数据到`then`之前执行该函数，函数内的参数就是服务端响应的参数，可以在`then`接收响应之前，在该函数内对响应的数据进行加工改造。

1. 它不像`transformRequest`一样只对 POST 请求生效，在 GET 方式下也行。
2. 数据加工完毕后，一样的必须将数据返回。
```js
axios({
  url: "./data.json",
  params: { x: 1 },
  transformResponse: [
    function (data) {
      return data
    }
  ]
})
```
:::warning
这种方式最早获取响应的数据，但是axios还未将JSON数据转化为对象，所以在这里面获取到的数据不是对象，而是普通的字符串。
```js
axios({
  url: "./data.json",
  params: { x: 1 },
  transformResponse: [
    function (data) {
      console.log(JSON.parse(data))
      return JSON.parse(data) // 手动反序列化
    }
  ]
})
```
:::

* **`onUploadProgress`**：处理上传进度的回调函数，函数内的形参包含了上传进度的一系列信息。

* **`onDownloadProgress`**：处理下载进度的回调函数，函数内的形参包含了下载进度的一系列信息。

* **`cancelToken`**：指定该请求的cancel Token，可用于[取消请求](/other/axios.md#取消请求)。

## 全局URL

在实际开发中，请求的接口地址大多指向同一个域名，只是接口的路径文件不同，例如：
```txt
http://www.example.com/user/list
http://www.example.com/user/add
http://www.example.com/user/update
http://www.example.com/user/delete
```
这时候可以给axios配置一个全局的默认路径：
```js
axios.defaults.baseURL = 'http://www.example.com/'
```

将来再通过axios发送请求，就可以省略url了，会默认使用这个全局的路径
```js
axios.defaults.baseURL = "http://www.example.com/"

// 下面三个调用都会请求 http://www.example.com/
axios()
axios.get()
axios.post()
```

请求不同的接口，只需要拼接上接口的路径即可：
```js
axios.defaults.baseURL = "http://www.example.com/"

axios("user/list") // http://www.example.com/user/list
axios.get("user/detail") // http://www.example.com/user/detail
axios.post("user/add") // http://www.example.com/user/add
```

:::warning 注意
如果url传的是绝对路径，那么这条请求就会覆盖默认的路径：
```js
axios.defaults.baseURL = "http://www.example.com/"

// http://www.example2.com/user/list
axios("http://www.example2.com/user/list")

// http://www.example.com/user/list
axios("user/list")
```
:::

全局的url也可以指定为某个接口，
```js
axios.defaults.baseURL = "http://www.example.com/user/list"

// http://www.example.com/user/list
axios()

// http://www.example.com/user/list/add
axios("add")
```

如果将来某个请求想替换这个接口，需要在拼接的接口前面加上`../`表示要覆盖全局的接口。
```js
axios.defaults.baseURL = "http://www.example.com/user/list"

// http://www.example.com/user/add
axios("../add")
```

### URL的优先级
如果配置了 全局url、实参url、配置对象url，此时优先级是 **实参url** > **配置对象url** > **全局url**。

其实，`实参url`就是`配置对象url`，配置对象设置了`url`属性，实参再指定url，就相当于是把配置对象的`url`的给覆盖了：
```js
axios.defaults.baseURL = "http://www.example.com/user/list"

// http://www.example.com/user/add
axios("../add", {
  url: "../update"
})

// http://www.example.com/user/update
axios({
  url: "../update"
})
```


## 取消请求

axios跟ajax一样用于发送http请求，ajax采用的是`xhr.abort()`方法来取消请求。axios底层也是采用`abort()`来取消，只不过axios将它给封装了一下。

1. 首先需要生成一个`source`对象，并通过`source`对象来生成`cancelToken`，用于标识当前请求。
```js
const CancelToken = axios.CancelToken
const source = CancelToken.source() // 生成source对象
```

2. 将这个`cancelToken`挂载到当前请求的配置对象上。
```js
axios({
  url: "./data.json",
  cancelToken: source.token // 将cancelToken挂载到配置对象上
})
```

3. 调用`source`对象的`cancel()`方法用于取消请求。`source()`方法有一个可选参数，参数接收一个描述字符串，当请求被取消时，在`catch()`回调中，可以通过`回调参数.message`来获取该段描述。
```js
source && source.cancel("请求被取消") // 取消请求
```

---

下面是一个利用`cancelToken`实现**取消上传**文件功能，并且具有**暂停上传**和**继续上传**的Demo：

```vue
<template>
  <div>
    上传进度：{{ progress.rate }}%
    <br />
    选择文件：
    <input type="file" name="file" @change="changeHandler" />
    <button @click="sendAjax">上传文件</button>
    <button @click="cancel">暂停上传</button>
    <button @click="resume">继续上传</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      file: null,
      source: null,
      progress: {
        rate: 0, // 比例
        currentLoaded: 0, // 当前进度
        totalLoaded: 0, // 总进度
      },
    };
  },
  methods: {
    // 选择文件
    changeHandler(e) {
      this.file = e.target.files[0];
    },
    // 上传文件
    sendAjax() {
      this.uploadRequest(this.file);
    },
    // 继续上传
    resume() {
      // 获取剩余数据
      var fileData = this.file.slice(
        this.progress.currentLoaded,
        this.file.size
      );
      this.uploadRequest(fileData);
    },
    // 取消上传
    cancel() {
      this.source.cancel("请求被取消");
    },
    // 上传请求
    uploadRequest(file) {
      var CancelToken = axios.CancelToken;
      this.source = CancelToken.source(); // 获取source对象

      var fd = new FormData();
      fd.append("file", file); // 初始化表单对象

      var oldValue = 0;
      var difValue = 0;

      axios
        .post("/upload", fd, {
          onUploadProgress: (newValue) => {
            // 处理进度
            difValue = newValue.loaded - oldValue; // 差值
            this.progress.currentLoaded += difValue; // 当前进度
            this.progress.totalLoaded = this.file.size; // 总进度
            // 百分比
            var progress =
              (this.progress.currentLoaded / this.progress.totalLoaded) * 100;
            this.progress.rate =
              Math.ceil(progress) > 100 ? 100 : Math.ceil(progress);
            oldValue = newValue.loaded; // 更新旧值
          },
          cancelToken: this.source.token, // 携带标识
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }
};
</script>

```

## 拦截器

axios的拦截器可以在请求发起之前，对请求的配置对象进行加工处理，以及数据响应之前，对响应的数据进行处理。

**`axios.interceptors.request.use(requestSuccess, requestFailed)`**：请求拦截器，在请求发起之前，执行`requestSuccess`回调函数，若请求失败，则执行`requestFailed`回调函数。

* `requestSuccess`的参数就是当前请求的配置对象，且必须将该配置对象返回。
* `requestFailed`的参数包含了请求失败的信息。

---

**`axios.interceptors.request.use(responseSuccess, responseFailed)`**：响应拦截器，当接口正常响应时，执行`responseSuccess`，响应异常则会执行`responseFailed`回调函数。

* `responseSuccess`的参数就是axios响应对象，可以在这里进行数据处理。同样的，`responseSuccess`必须将该响应对象返回。
* `responseFailed`的参数包含了响应失败的信息。

:::warning
拦截器通常用于拦截整个配置对象或者响应对象本身，例如请求头、响应状态码等等。而`transformRequest`、`transformResponse`可以用来处理请求的参数或者响应对象的数据。
:::

使用拦截器实现一个cookie通信机制：
```js
// 添加请求拦截器 (获取cookie发送)
axios.interceptors.request.use(
  config => {
    var token = localStorage.getItem("token")
    if (token) config.headers["token"] = token
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器 (接收cookie保存)
axios.interceptors.response.use(
  response => {
    localStorage.setItem("token", response.data.token)
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios("./data.json")
```

<Vssue />