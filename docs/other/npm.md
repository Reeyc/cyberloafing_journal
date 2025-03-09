# Npm

## npm介绍
npm是一个命令行工具，全称 **node package manager**（node包管理工具），简单点说就是通过nodejs帮我们管理各种各样的包的（插件、库、框架...等等）。

npm在你安装 **node** 的时候就已经安装了。
```shell
node -v
npm -v
```

npm安装包的指令：
```shell
npm install jQuery # 安装jQuery
npm install jquery bootstrap animate.css # 安装多个包，包与包之间用空格隔开
```
包安装成功后，会在当前文件夹下生成一个 **node_modules** 文件夹，所有安装成功的包都会在这个文件夹下面。

npm安装某个包的时候，会把这个包的依赖包也全部下载下来（如果包a依赖包b才能运行，当你下载包a的时候，npm会自动的帮你把包b也下载下来）。

npm默认会下载最新版本的包，如需安装指定版本，需要在包后面加一个 `@版本号`，例如：
```shell
npm install jquery@1.12.4 # 安装12.4版本的jQuery
```
:::warning 注意
重复安装相同的包会覆盖之前的包
:::

npm安装包的时候，可以省略后缀，例如`.js`。

## npm常用指令

#### 安装
```shell
npm install # 安装dependencies下的所有包
npm install [package] # 安装指定包
npm install [package] --save # 安装指定包，并将描述保存到dependencies下
```

#### 卸载
```shell
npm uninstall [package] # 删除包，保留依赖包
npm uninstall [package] --save # 删除包，并删除依赖包
```

:::tip 注意
在 **npm@5** 版本之前，`--save` 会增加或者删除`dependencies`下的包信息。而在 **npm@5** 版本之后不需要再加`--save`，安装或删除包都会自动同步到`dependencies`下。
:::

#### 更新
更新依赖包有两种方式，一种是通过 `install` 指令加上 `@版本号` 安装指令版本的依赖包。
```shell
npm install jquery@1.12.4 # 安装12.4版本的jQuery
npm install jquery@latest # 直接安装jQuery最后一个新版本
```
另一种方式是通过 `update` 指令：
```shell
npm update jquery@1.12.4 # 更新到指定版本号的jQuery
npm update jquery # 更新最新版本的jQuery
```

#### 查询
```shell
npm list # 查看项目内已安装的依赖包（全部）
npm list --depth 0 # 查看项目内已安装的依赖包（只看第一级）

npm list -g # 查看全局已安装的依赖包（全部）
npm list -g --depth 0 # 查看全局已安装的依赖包（只看第一级）
```

#### 帮助
```shell
npm help # 查询npm命令
npm [命令] --help # 查询指定命令的帮助
npm install --help # 查看install命令
```

#### 配置
```shell
npm config list # 查看当前npm的配置信息
npm config set [key] [value] # 修改npm的配置

# 修改registry为https://registry.npm.taobao.org
npm config set registry https://registry.npm.taobao.org 
```

## npm指令简写
为了方便我们使用，一些常用的 **npm** 的指令支持简写。
| 指令 | 简写 |
| - | - |
| install | i |
| uninstall | un |
| list | ls |
| --save | -S |
| --save-dev | -D |
| --global | -g |

## package.json
package.json是包描述文件，当你的项目中使用了 **npm** 来管理你的依赖包，**npm** 就会自动在你的项目根目录生成package.json文件。这是一个json文件，里面中的每一个对象都记录了当前项目需要依赖的哪一些包。

#### 构建npm项目
```shell
npm init # 以向导的方式创建项目
```

* **`package name`**：包名
* **`version`**：包版本号
* **`description`**：包描述
* **`entry point`**：包入口文件
* **`test command`**：包测试命令
* **`git repository`**：包存放到github上的地址
* **`keywords`**：别人要下载你的包的关键字
* **`author`**：作者
* **`license: (ISC)`**：包开源许可证

---

以上信息都是可选的，有的有默认值，没有默认值的会为空。按回车，出现：`About to write to xxx\package.json`，表示将在 xxx 目录中创建一个package.json文件，文件里面就是包的描述内容了。输入yes，创建 **npm** 项目成功。

### dependencies选项
当我们通过 **npm** 安装一些包的时候，如果在包的后面（或前面）加上一句 `--save` 会将该包的名称和版本以 key: value 的形式保存到package.json文件下的`dependencies`选项中，表示项目是依赖于该包来运行的。
:::tip
**npm@5** 之后不需要加`--save`，都默认自动加进`dependencies`里面去了
:::

```shell
npm i jquery --save # 把依赖包描述加进dependencies中
```
如果不小心删了`node_modules`文件夹 也没关系，当再次执行 **npm** 安装别的包的时候，会自动读取`dependencies`选项对应的包，并把这些对应的包都给下载回来。或者直接执行`npm install`指令，会把现在`dependencies`选项对应的包全都安装回来。

---

### devDependencies选项
当我们安装包的时候，在包的前面或后面加上一句 `--save-dev` 会将该包的名称和版本保存到package.json文件下的`devDependencies`选项，表示项目是依赖于该包来开发运行的。

```shell
npm i eslint --save-dev # 把依赖包描述加进devDependencies中
```

跟`dependencies`的区别是：
* `dependencies`是包的**完全**依赖，包括生产环境也需要这些包，所以`dependencies`下的包也会参与打包。
* `devDependencies`是包的**开发环境**依赖，例如各种`loader`，`babel全家桶`及各种`webpack的插件`等等，这些包并不会参与打包。

---

### package.lock.json
`package.lock.json`是 **npm@5** 之后引入的，主要用于解决早期 **npm** 诟病已久的版本锁定问题。

每当我们 **npm** 安装包的时候，都会自动生成或者更新这个`package.lock.json`文件。`pack.lock.json`用来记录所有包的信息（版本、下载地址等等...）。它的作用是：
* **提升速度**：当我们把包给删了，执行`npm install`重新下载包的速度会明显提升，因为`pack.lock.json`记录了包的下载地址，不用再去解析。

* **版本锁定**：当我们把包给删了，执行`npm install`重新下载回来，默认会下载最新版本的包。有时我们更希望包是原来那个版本的，否则项目中可能会引发兼容性问题，此时如有果`pack.lock.json`文件，**npm** 会直接从这里寻找版本号，从而防止下载到最新版本的包。

## npm发布

1. npm官网创建账户：[https://www.npmjs.com/](https://www.npmjs.com/)
2. 本地项目内初始化npm
:::warning 注意
- npm镜像源要切为官方的：`npm config set registry https://registry.npmjs.org/`
- npm名称不可重复，可以在npm官网search
:::    
3. 项目内登录`npm login`
4. 项目内发布`npm publish`
5. 建立git远程仓库，并上传代码 <Badge text="可选"/>
6. 后续有改动：
    - 发布npm
      - 补丁修复(补丁版本) `npm version patch`
      - 增加功能(次版本) `npm version minor`
      - 不兼容的更改(主版本) `npm version major`
    - 上传代码 <Badge text="可选"/>

推荐：虽然上传到npm后代码也可以被其他人使用，但将代码托管到GitHub等平台是推荐的做法。

## rimraf
由于 **npm** 会把依赖包中的各种依赖关系包都给下载下来（例如：a包依赖b包，b包又依赖c包等等...），所以`node_modules`目录会变得非常庞大，如果因为某些原因需要删除这个目录并重新安装依赖包，直接右键删除会非常慢，这时可以通过`rimraf`插件来协助快速删除`node_modules`目录。
```shell
npm install rimraf -g # 全局安装rimraf插件
```

在项目目录内，执行一下指令，快速删除`node_modules`目录：
```shell
rimraf node_modules
```

## cnpm
**cnpm** 就是淘宝镜像版的 **npm**，由于 **npm** 的文件服务器在国外，我们有时候下载包的时候可能会很慢（被墙），因此，淘宝的开发团队就把国外的 **npm** 文件进行了拷贝。

所以，为了解决下载速度的问题，我们可以从淘宝镜像下载，而不是从 **npm** 国外服务器

:::tip
淘宝的镜像会每10分钟跟国外的 **npm** 进行一次同步，所以不必担心包的差异问题。
:::

使用淘宝镜像有两种方法：

1. 全局安装淘宝镜像 **cnpm**，将来使用 **cnpm** 指令替换 **npm** 指令就行了。
```shell
npm install --global cnpm # 全局安装淘宝镜像cnpm

cnpm install jquery --save # 将来使用cnpm替换npm管理包
```

:::warning
需要注意的是，通过cnpm指令安装的依赖包，如果不加`--save`后缀是无法记录到`dependencies`里面的。
:::

2. 配置 **npm** 的默认下载链接为 **cnpm**，也就是淘宝的镜像链接，这种方式不必安装 **cnpm**。
```shell
npm config set registry https://registry.npm.taobao.org
```

将来还是使用 **npm** 指令安装，但是下载安装的地址是从淘宝镜像下载安装，所以不用担心被墙。
```shell
npm install jquery --save
```

## npx

**npx** 是 **npm@5.2** 版本新增的一个命令，它的出现主要带来了两大好处：

* **提升包内提供的命令行的使用体验**。

通过 **npx** 指令就可以直接使用这个包内提供的指令，例如在vue项目中，想运行本地的 `vue-cli-service serve` 如果直接在命令行运行会报错：找不到命令。所以我们通常这样，`package.json`中：
```json
// ...其它配置
"scripts": {
    "dev": "vue-cli-service serve",
 },
 // ...其它配置
```

然后再运行：
```shell
npm run dev
```

现在通过 **npx** 可以一步到位：
```shell
npx cli-service serve
```

* **无需全局安装依赖包**。

例如`create-react-app`，以往我们需要安装全局的包。但是使用一次后面几乎就不怎么使用了，非常浪费磁盘空间。现在我们可以用 **npx** 指令来执行，**npx** 会下载`create-react-app`放在临时文件中，过一段时间会自动清除，节省磁盘空间。
```shell
npx create-react-app xxx
```

## yarn

**yarn** 也是一个包管理器，它和 **npm** 其实没有本质区别，都是管理和安装包的。只是它解决了早期 **npm** 的一些问题比如：不支持离线模式、树形结构的依赖、依赖包版本问题等。

**yarn** 的使用：
```shell
yarn add [package] # 安装依赖包
yarn remove [package] # 移除依赖包
```

## pnpm

**pnpm** 也是一个包管理器，它的所有指令和使用方式与 **npm** 是一样的。
```shell
npm i pnpm -g # 全局安装pnpm

pnpm i jquery # 安装jquery
```
**pnpm** 的特点是利用硬链接和符号链接来避免复制所有本地缓存源文件。换言之，多个项目相同的依赖只会在某处安装一次，连接过来直接使用，节省了安装时间和磁盘空间。

另外，**pnpm** 继承了 **yarn** 和新版 **npm** 的所有优点，其中包括离线模式和版本锁定。运行速度也超过了 **yarn** 和新版 **npm**。


## 总结

1. **`npm`**：一个包管理器，方便开发者分享和下载开源包。经历了许多重大版本的更新，各方面已经和 **yarn** 在同一水平。
2. **`npx`**：**npm@5.2** 的产物，方便运行本地命令。
3. **`cnpm`**：方便国内开发者下载依赖包而诞生的下载器。
4. **`yarn`**：解决了 **npm@5** 之前的一些让人诟病的问题，同时拥有一些其它的优点。例如离线安装、失败自动重试安装和并行下载等。
5. **`pnpm`**：通过连接的方式，让多个项目的依赖公用同一个包，大大节省了磁盘空间，比 **yarn** 和 **npm** 下载速度快得多，但是也有连接带来的各种兼容问题。

---

> 从个人角度来说，使用 **npm**、**yarn**、**pnpm** 都是可以的，但如果是团队规范，最好都使用同一个管理器。

<Vssue />