> <...> 为必填选项
> [...] 为可选择选项
> <short-name> 表示远程仓库在本地的别名

# 初始化

`git init`

# 初始化一个Git远程仓库

`git init --bare`

# 配置

`git config --list` 查看所有配置项

`git config --global user.name <name>` 设置作者（全局）

`git config --global user.email <email>` 设置电邮（全局）

`git config --global merge.ff false` 设置合并时不使用fast-forward，创建一个提交

`git config --global merge.tool kdiff3` 设置合并工具为kdiff3

`git config --global mergetool.kdiff3.path /c/path/kdiff3.exe` 设置kdiff3的路径

`git config --global core.autocrlf true` 开启window平台下unix平台下换行符自动转换

`git config <key> <value>` 设置本地仓库配置

`git config --unset <key>` 删除配置项

# 基本操作

`git add <file>` 将文件添加到暂存区（索引区）

`git diff` 查看工作区与暂存区的差异

`git diff --staged` 查看暂存区与HEAD的差异

`git commit -m <comment>` 提交并注释

`git commit --amend` 撤销最后一次提交，重新提交

# 储藏区

`git stash list` 查看储藏区列表

`git stash save` 将工作区的编辑储藏到储藏区，保持工作区干净

`git stash apply stash@{n}` 应用指定的储藏记录（可在储藏列表中查看）

`git stash pop` 应用最近一条储藏记录并移除掉

`git stash drop stash@{n}` 移除指定的储藏记录

# 分支

`git branch` 查看本地分支

`git branch -v` 查看本地分支与其最后一个提交注释

`git branch -vv` 查看本地及**远程分支**与其最后一个提交注释

`git branch -d <branch-name>` 删除一个本地分支

`git branch -D <branch-name>` 强制删除一个本地分支

`git branch --set-upstream-to=<remote/branch>` 给本地分支绑定/修改一个上游分支

`git branch <branch-name>` 创建一个本地分支

`git checkout -b <branch-name>` 创建一个本地分支并切换到新创建的分支

`git checkout -b <branch-name> <remote/branch>` 同上，同时绑定一个上游分支

`git checkout --track <remote/branch>` 同上，并且本地分支与远程分支同名

`git checkout <branch-name>` 切换分支

# 合并

`git merge <branchA>` 将branchA与当前分支进行合并

`git merge --abort` 撤销合并

`git checkout --theirs <file>` 保留对方的版本

`git checkout --ours <file>` 保留我们的版本

`git diff <--ours|--theirs|--base> <file>` 查看合并冲突中的三方差异

`git mergetool` 启动配置的合并工具进行合并

# 远程仓库

`git remote add <short-name> <url>` 给当前本地仓库添加一个远程仓库

`git remote rm <short-name>` 删除一个远程仓库

`git fetch` 获取远程仓库所有新数据

`git pull` 拉取新数据并将新数据合并（必须有上游分支）

`git remote show <short-name>` 查看远程分支详细信息

# 远程分支

`git push <short-name> <local-branch>:<remote-branch>` 将本地分支推送到远程仓库

`git push <short-name> --delete <remote-branch>` 删除远程分支

`git push <short-name> :<remote-branch>` 同上

`git branch -r` 查看远程分支

# 移动分支指向

`git checkout <branch>` 只移动HEAD的指向，也就是切换分支

`git reset --soft <commit>` 移动HEAD以及HEAD对应分支的指向

`git reset [--mixed] <commit>` 移动HEAD及HEAD对应分支指向，并修改暂存区文件为HEAD指向的版本文件

`git reset --hard <commit>` 移动HEAD及HEAD对应分支指向，修改暂存区文件为HEAD指向的版本文件，并修改工作区的文件为HEAD指向的版本文件

# checkout 与 reset 指定路径

`git checkout [commit] -- <file>` 检出指定版本的文件

`git reset [commit] -- <file>` 将指定版本文件恢复到暂存区
    
# 查看两次提交共同祖先

`get merge-base <commit1> <commit2>`
    

`git grep` 从提交历史或工作目录查找一个字符串或正则表达式  
  
    `-n`      用来显示git找到的匹配行行号  
    `--count` 用来显示git输出概述信息，仅显示那些文件包含匹配以及每个文件包含多少个匹配  
    `-p`      显示匹配字符串属于哪个方法或函数  
  
`git log -S <keyword>` 显示日志中新增或删除该字符串的提交
`git log -G <regex>` 用正则表达式来查找
`git log -L :<keyword>:<file>` 展示代码中一行或者一个函数的历史git会尝试找到这个函数的范围，然后查找历史记录，并显示从函数创建之后一系列变更对应的补丁

> 如果使用`-L`参数时，git无法匹配代码中的函数，可以提供一个正则表达式。`git log -L '<regx1>','<regx2>':<file>`
> e.g. git log -L :getBound:zlib.c 等同于 git log -L '/function getBound/','/^}/':zlib.c


