# Git

## Git介绍
Git是分布式代码管理系统，每个人每台机器都是一个独立的代码仓库，并且可以通过局域网传输文件。
Git连接分为两种方式：http连接和ssh连接。

## Git下载
[官网](https://git-scm.com/)下载git，下载安装完毕后，Windows系统下右键打开 `Git Bush Here` 选项栏，将在Windows下运行Linux操作系统

### 设置账户
Git采用分布式管理，每台设备都是一个独立的代码仓库，所以每台设备要设置一个用户名跟邮箱来标识自己才能使用Git。

```shell
git config --list # 查看git配置
git config user.name # 查看git用户名
git config user.email # 查看git邮箱
git config --global user.name "nameVal" # 全局配置用户名
git config --global user.email "email@qq.com" # 全局配置邮箱
```
:::tip 注意
Git安装完毕后，在我们本地 `C:\Users\用户名` 就有了一个 `.gitconfig` 文件，里面保存了Git的全局配置，如果你之前安装过Git，那么里面的用户名，默认是以前的，可以手动去修改。
:::

### 通过HTTP连接
通过http连接Git，要求Git所管理的项目必须是**Public**公开状态，**Private**和**Internal**私有模式下不能使用http方式进行连接。
```shell
git clone http://xxx.xxx.xx.xx/xxx/xxx.git
```

### 通过SSH连接

#### 生成账户秘钥
初次使用Git SSH管理，需要生成公钥
```shell
ssh-keygen -t rsa -C "xxx@xxx.com"
```

Git会检查你的目录下是否有 `id_rsa` 和 `id_rsa.pub` 两个文件，如果没有则生成公钥，Git会弹出：
```shell
Generating public/private rsa key pair.
Enter file in which to save the key (/c/Users/you/.ssh/id_rsa):
```

表示要你输入一个文件，用于保存秘钥，这个可选，Git会使用默认文件名，也就是`id_rsa`和`id_rsa.pub`，直接回车（推荐）

接着又会提示你输入两次密码（该密码是你push文件的时候要输入的密码）

当然，你也可以不输入密码，直接按回车。那么push的时候就不需要输入密码，直接提交到远程Git上了
```shell
Enter passphrase (empty for no passphrase): 
Enter same passphrase again:
```

此时Git会弹出以下信息，表示秘钥生成成功
```shell
Your identification has been saved in /c/Users/you/.ssh/id_rsa.
Your public key has been saved in /c/Users/you/.ssh/id_rsa.pub.
The key fingerprint is:
xxxxxxxxxx your_email@example.com
```

运行指令，剪切秘钥，保存下来。
```shell
clip < ~/.ssh/id_rsa.pub
```

#### Github配置秘钥

点击头像 > Setting > SSH and GPG keys > NEW SSH Key

title自定义，key为秘钥，把刚刚生成的秘钥粘贴进去保存即可。

![Github-SSH](../.vuepress/public/assets/img/git-ssh.png)

这样一来你的本地账户就跟你的Github远程账户所关联了起来，将来使用本地账户git clone远程Github账户上的项目就可以使用SSH的方式了。
```shell
git clone git@github.com:xxx/xxx.git
```

## Git常用指令
```shell
git init                                # 初始化一个git项目（在本地初始化，无法远程推送，后面需配置远程URL）
git remote                              # 查看远程仓库
git remote rename <old name> <new name> # 远程仓库重命名（原名称默认为origin）
git remote add <name> <URL>             # 初始化远程仓库URL
git remote set-url <name> <URL>         # 设置远程仓库URL
git clone xxx                           # 下载项目
git status                              # 查看项目目录的完整信息
git add .                               # 上传到git的本地缓存区（.表示所有改动的文件，可以自行选择文件名，以空格隔开）
git commit -m "任意描述信息"             # 从本地的缓存区上传到本地分支
git push                                # 把缓存区的代码推送到线上仓库，默认推送到origin
git pull                                # 从远程仓库下拉最新代码
git reflog                              # git提交记录（可以获取版本号HEAD）
git reset --hard <HEAD>                 # git版本回退
```

## Git忽略文件
有时候开发中，有些特殊的配置文件，我们不想推送到仓库，可以在项目根目录新建一个`.gitignore`文件，文件里标明的文件或目录不会被Git推送到仓库，示例：
```js
// 忽略以下文件夹中的文件
node_modules/
dist/
unpackage/
​
// 忽略以下指定文件
manifest.json
project.config.json
```

:::warning
修改`.gitignore`不起作用？是因为`.gitignore`只忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改`.gitignore`是无效的。

解决：删除缓存，重新提交一遍。
```shell
git rm -r --cached .
git add .
git commit -m '更新 .gitignore'
```
:::

## Git分支
分支可以理解为项目开发中，某个阶段的代码。

主分支，也叫**master**分支，就是我们的项目总体代码，是Git初始化项目默认生成的分支。

在实际开发中，每当我们在项目中开发一个新的功能，建议不要直接在**master**中开发。而是预先创建一个Git分支，在分支上进行开发，当分支开发完成，并且测试没有问题了，才会上传到主分支中合并。

本地创建一个新的分支，并切换到这个分支内进行开发
```shell
git branch home-Swiper # 创建一个home-Swiper分支
git checkout home-Swiper # 切换到home-Swiper分支内开发
​
git checkout -b home-Swiper # 两句指令结合简写
```

### 查看分支
```shell
git branch # 查看所有分支，包含本地与远程，当前使用的分支前面有一个*号
git branch -r # 查看远程分支
```

### 删除分支
```shell
git branch -d home-Swiper # 删除本地分支
git push origin -d home-Swiper # 删除远程分支
```

### 分支重命名
```shell
git branch -m oldName newName # oldName是旧分支名, newName是新分支名
```

### 分支切换时未提交
本地代码未提交时切换分支的话，可以先将本地代码给 隐藏 `"stash"` 起来。然后切换别的分支，当开发完毕时，再切换回来恢复隐藏的代码。
```shell
git stash # 将当前改动的代码隐藏
git stash list # 查看隐藏的代码列表
​
git stash apply # 恢复隐藏，但是隐藏列表中并不会清除
​
git stash pop # 恢复隐藏，并从隐藏列表中清除
```

### 分支推送
当分支上的功能开发完毕之后，就可以提交分支了。需要先保存到本地缓存区，提交才能推送到远程分支。

```shell
git add .
git commit -m "更新描述"
git push origin home-Swiper # 推送到origin仓库下的home-Swiper分支
```

### 分支合并
我们的分支功能开发完毕了，需要将它合并到主分支上去。`merge`指令相当于合并了两条分支，并新生成一个新的`commit`记录。
```shell
# 如果要合并新分支到主分支上，要先切换到主分支
git checkout master
git merge home-Swiper
```

### 合并指定commit
当在分支b上开发完毕，提交了几次`commit`。分支a需要合并分支b提交的某一条`commit`，此时可以用`cherry-pick`指令来完成。
```shell
git checkout master # 先切换到分支a
​
git cherry-pick 034001a # 然后合并，034001a就是分支b提交commit的ID
```

### Git版本回滚
顾名思义，将git代码恢复到历史的某一个版本：

```shell
# 查看提交记录，前面字(例如:034001a)就是当时提交时候的ID，也就是当时的版本号
git reflog
​
034001a (HEAD -> master) HEAD@{0}: checkout: moving from recommend-BetterScroll to master
42dbfd2 (origin/recommend-BetterScroll, origin/recommend, origin/master, recommend-BetterScroll, recommend) HEAD@{1}: checkout: moving from master to recommend-BetterScroll
034001a (HEAD -> master) HEAD@{2}: commit: BetterScroll踩坑日记之高度计算
42dbfd2 (origin/recommend-BetterScroll, origin/recommend, origin/master, recommend-BetterScroll, recommend) HEAD@{3}: merge recommend: Fast-forward
fe83edc (origin/base-header, base-header) HEAD@{4}: checkout: moving from recommend to master
42dbfd2 (origin/recommend-BetterScroll, origin/recommend, origin/master, recommend-BetterScroll, recommend) HEAD@{5}: commit: 抓取QQ音乐数据
fe83edc (origin/base-header, base-header) HEAD@{6}: checkout: moving from master to recommend
fe83edc (origin/base-header, base-header) HEAD@{7}: merge base-header: Fast-forward
e7cd497 HEAD@{8}: checkout: moving from base-header to master
fe83edc (origin/base-header, base-header) HEAD@{9}: Branch: renamed refs/heads/home-header to refs/heads/base-header
fe83edc (origin/base-header, base-header) HEAD@{11}: commit: 基本骨架与公共头部区域
e7cd497 HEAD@{12}: checkout: moving from master to home-header
e7cd497 HEAD@{13}: commit (initial): init
```

找到当时提交的版本后，就可以回滚了
```shell
git reset --hard  版本号
git reset --hard 034001a # 回退到提交034001a的时候
```

当线上的仓库代码需要回滚时，需要加多一句强制推送：
```shell
git push origin master --force # 强制推送，可以同步更新回滚线上Git，并清除commit记录
```

## Github托管项目
Github为开源项目免费提供Git存储，也就是我们所说的远程仓库，当你用Github生成一个项目，它默认帮你进行了Git初始化，也就是`git init`。

### 新建一个项目

打开 **Respositories** 选项，意为仓库，New一个 **Respositories**，新建仓库，选项：
* **`Owner`**：仓库所有者 [默认自己]
* **`Repository name`**：仓库名称
* **`Description`**：仓库描述 [可选]
  * Public 公开仓库
  * Private 私有仓库
* **`Initialize this repository with a README`**：生成README项目说明文件 [可选]
* **`Add .gitignore`**：添加git上传时忽略的文件 [默认不添加]
* **`Add a license`**：添加选择开源许可证 [默认不添加]

执行完以上步骤，再到 **Respositories** 下，就看到一个初始化项目了，点击项目右边的 Clone or download [克隆或下载]。
```shell
git clone git@github.com:xxx/xxx.git
```

在项目内进行Git 暂存/提交/推送 三部曲，即可在Github仓库上看到自己提交的文件。
```shell
git add .
git commit -m "任意描述信息"
git push
```

## VsCode操作Git
在实际工作中一般都是借助工具去操作Git，因为工具有着更好的可视化界面查看修改的代码。

在Vscode中引进代码文件夹，Vscode会自动检测该项目根目录下是否含有Git本地存储库（.git目录），如果有，会自动在Vscode中生成Git操作管理工具。

每当我们在该项目下修代码，该工具都会自动帮我们记录下修改的内容。当我们修改完毕要提交时，可以去该工具下可视化查看修改的代码，然后将这些代码：
1. 暂存到本地存储库（`git add .`），如果有些需要还原的，选择放弃更改。
2. 提交代码（`git commit`）
3. 推送代码（`git push`），可选分支，不选默认推送到当前分支
