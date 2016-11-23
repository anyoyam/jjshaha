# GIT 学习

<!-- MarkdownTOC depth=3 -->

- 基础与起步
    - 什么是Git？
    - Git与其他版本控制系统的区别
    - Git使用方式
    - 第一次运行Git前的配置
    - 学会使用Git帮助
- Git基本命令学习
    - 创建/获取仓库
    - Git核心工作流程和命令
- Git分支
- Git工具

<!-- /MarkdownTOC -->

## 基础与起步

### 什么是Git？

### Git与其他版本控制系统的区别

- 直接记录快照而非差异比较

  其他大部分的版本控制系统以文件变更列表的形式存储信息，将它们保存的信息看做是一组基本文件和每个文件随时间逐步累积的**差异**。
  ![存储每个文件与初始版本的差异](./files/deltas.png)

  Git更像是把数据看做是对小型文件系统的一组快照。提交时会对当时全部文件作一个快照并保存这个快照的索引；为保持高效，Git不会重新存储没有修改的文件而只保留一个连接指向之前存储的文件；
  ![存储项目随时间改变的快照](./files/snapshots.png)

- 几乎所有操作都是本地执行

  多大多数操作都是访问本地文件和资源，一般不需要网络上的其他信息；

- Git保证完整性

  Git中所有数据在存储前都计算校验和，然后以校验和来进行引用。计算校验和的机制叫做SHA-1散列（hash，哈希），由**40个十六进制字符**组成的字符串，是基于**文件内容**或者**目录结构**计算出来的。

- Git一般只添加数据

  执行的git操作，几乎只往git数据库中增加数据。很难让git执行任何不可逆操作或者用任何方式清楚数据。一旦你提交快照到git中，就难以丢失数据。

- **三种状态**

  Git有三种状态，你的文件可能是其中之一
  + 已提交(commited) 数据已安全保存在本地数据库中
  + 已修改(modified) 修改了文件，还没有保存到数据库中
  + 已暂存(staged) 已将修改的文件做了标记，将它包含到下次提交的快照中

  Git的三个工作区概念：Git仓库(Repository)，工作目录(Working Directory)，暂存区(Staging Area)
  ![gitwork](./files/areas.png)

  **Git仓库**用来保存项目的[元数据(Metadata)](http://baike.baidu.com/item/%E5%85%83%E6%95%B0%E6%8D%AE)和对象数据库的地方。

  **暂存区域**是一个文件，保存下次提交文件列表信息，保存在Git仓库目录中。有时也叫“索引(Index)”

  **工作目录**是对项目某个版本独立拉取出来的内容。从Git仓库的压数据库中提取出来的文件，放在磁盘中供使用或编辑。

### Git使用方式

1. 命令行

  ![git-terminal](./files/git-terminal.gif)

  Terminal, git-bash, 控制台, PowerShell, msys, SublimeText Plugin等

2. GUI软件

  ![sourcetree](./files/sourcetree.gif)

  [GitHub Desktop](https://desktop.github.com), [SourceTree](https://www.sourcetreeapp.com), [TortoiseGit](https://tortoisegit.org/), Git Extensions等

  + [下载GitHub Desktop](./files/zip/GitHubSetup.rar)
  + [下载SourceTree](./files/zip/SourceTreeSetup_1.9.6.1.rar)

### 第一次运行Git前的配置

Git的全局配置文件位于家目录(Windows下的`%USERPROFILE%`目录，Mac/Linux下的`$HOME`目录)下的`.gitconfig`文件

首次在使用时请配置正确的用户信息，这些信息将会写入每次提交中，不可更改：

```shell
$ git config --global user.name "YOUR NAME"
$ git config --global user.email "YOUR EMAIL"
```

其中`--global`选项用来标识将配置写入全局配置文件中。当我们配置时不加这个选项则这个配置将**只适用于当前**所在的git仓库；

可以通过命令`git config <section>:<key>`来查看某一配置项

```shell
$ git config user.name
Fen
```

### 学会使用Git帮助

对于在windows平台下安装适用git-bash的同学可以在shell中直接输入下面命令查看命令的帮助：

```shell
$ git help <verb>
// 或者
$ git <verb> --help
```

这两个命令会自动打开浏览器可以查看友好的web帮助文档。

而在Mac或者Linux平台下的同学可以直接使用man命令查看帮助。

```shell
$ man git <verb>
// 或者
$ git <verb> --help
```

其中`<verb>`表示具体的命令，比如我们要查看`git config`的帮助文档，直接输入`git config --help` 或者 `git help config` 就可以查看了。

## Git基本命令学习

### 创建/获取仓库

1. 在现有目录中初始化一个仓库

    ```shell
    $ git init
    ```

    在一个目录下运行了该命令后，目录下会新增一个`.git`子目录，这个目录包含了Git仓库所有必要的文件。

2. 克隆现有的仓库

    ```shell
    $ git clone [url]
    ```

    > 使用clone来克隆一个项目时，后面的`url`参数支持一下几种协议：
    >  - 本地协议 `git clone file://path/any.git`
    >  - HTTP协议 `git clone https://somedomain/any.git`
    >  - SSH协议 `git clone ssh://git@somedomain/any.git`
    >
    > 优缺点可以参看[链接](https://git-scm.com/book/zh/v2/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E5%8D%8F%E8%AE%AE)

### Git核心工作流程和命令

工作目录下的每一个文件不外乎两种状态：已跟踪和未跟踪。

Git文件变化周期如下：

![文件生命周期](./files/lifecycle.png)

- 检查当前文件状态

    查看文件都处于什么状态，可以使用**`git status`**命令。

    加上`-s | --short`选项可以输出一个更紧凑的格式

    > - ?? 表示新添加的文件还没有加入跟踪
    > - A  表示新添加到暂存区域的文件
    > - M  表示修改过的文件
    >   + M  出现在左边表示被修改并加入暂存区
    >   +  M 出现在右边表示被修改还没有加入暂存区
    >   + MM 表示文件被修改后已加入暂存区后又在工作区被修改了

- 将新文件加入跟踪 / 将修改的文件暂存

    使用命令**`git add [files]`**可以将文件加入跟踪进行版本控制

    该命令还被用来将已修改的文件添加入暂存区域

## Git分支

## Git工具
