## NAME
 git revert - 将一些指定的提交还原
 
## SYNOPSIS 提要
#### /sɪ'nɑpsɪs/

 > git revert [--[no-]edit] [-n] [-m parent-number] [-s] [-S[&lt;keyid&gt;]] &lt;commit&gt;...
 > git revert --continue
 > git revert --quit
 > git revert --abort

##DESCRIPTION

指定一个或多次存在的提交，恢复有关补丁引起的改变，记录些新提交来记录它们。这需要确保你的工作树是干净的（与HEAD提交）

Note: *git revert* 是用来记录一些新提交来恢复早期提交所带的影响（通常是一个有故障的提交）。如果你想丢掉所有工作目录中未提交的修改，你应该看看[*git reset[1]*](https://git-scm.com/docs/git-reset)，特别是`--hard`选项。如果你想提取在另一次提交中的文件，你应该看看[*git checkout[1]*](https://git-scm.com/docs/git-checkout)，特别是`git checkout <commit> -- <filename>`语法。小心使用这些解决方案，因为它们都会废弃你工作目录中未提交的改变。

##OPTIONS

###<commit>...
需要恢复的提交s。需要更多拼写提交名称方式的完整列表，请查看[*gitrevisions[7]*](https://git-scm.com/docs/gitrevisions)。指定一组提交也是可以的但是默认是不会遍历的，请查看[*git-rev-list[1]*](https://git-scm.com/docs/git-rev-list)还有它的`--no-walk`选项。

**-e**
**--edit**
使用这个选项，`git reverit`会在你提交恢复之前让你编辑提交信息。如果你是在终端运行命令的这也是默认选项。

**-m parent-number**
**-mainline parent-number**
通常是你无法还原一次合并，因为你不知道合并的那一边需要考虑主线。这个选项指定主线的父编号（从1开始），而且允许恢复反转相对于指定父的改变。
恢复一个合并提交声明你将不在需要合并带入的树改变。因此，后面的合并将仅引入不是以前还原合并的祖先提交引起的树改变。这也许是也许不是你想要的。

**--no-edit**
使用这个选项，*git revert*将不会启动提交信息编辑器。

**-n**
**--no-commit**
通常命令自动回创建一些提交并带上提交日志信息陈述那些提交被恢复了。这个标志应用必要的改变来还原指定提交到你的工作目录和索引，但是不会创建提交。此外(in addition)，当使用这个选项，你的索引将不在必要与HEAD提交相匹配。恢复是针对您的索引的开始状态完成的。(还原后和你的索引开始的状态相冲突。the revert is done against the beginning state of your index.)
当你要在一行还原很多提交的影响时会很有用。

