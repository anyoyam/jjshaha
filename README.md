# Git emoji syntax

|emoji|code|feature|emoji|code|feature|
|---:|:---:|---:|---:|:---:|---:|
|:art:|art|重构或代码格式化|:zap:|zap|性能优化|
|:fire:|fire|删除代码或文件|:bug:|bug|修复一个bug|
|:ambulance:|ambulance|紧急修复补丁hotfix|:sparkles:|sparkles|新功能介绍|
|:memo:|memo|文档编写|:rocket:|rocket|发布部署|
|:lipstick:|lipstick|更新界面或样式文件|:tada:|tada|初始化提交|
|:white_check_mark:|white_check_mark|添加测试|:lock:|lock|修复安全问题|
|:apple:|apple|修复MacOS下的问题|:penguin:|penguin|修复Linux下的问题|
|:checkered_flag:|checkered_flag|修复Windows下的问题|:bookmark:|bookmark|发布/版本标签|
|:rotating_light:|rotating_light|Removing linter warnings.|:construction:|construction|工作进行中|
|:green_heart:|green_heart|Fixing CI Build|:arrow_down:|arrow_down|依赖降级|
|:arrow_up:|arrow_up|升级依赖|:construction_worker:|construction_worker|Adding CI build system|
|:chart_with_upwards_trend:|chart_with_upwards_trend|添加分析或追踪代码|:hammer:|hammer|重构Heavy refactoring|
|:heavy_minus_sign:|heavy_minus_sign|删除一个依赖|:whale:|whale|Docker相关工作|
|:heavy_plus_sign:|heavy_plus_sign|添加一个依赖|:wrench:|wrench|修改配置文件|
|:globe_with_meridians:|globe_with_meridians|国际化和区域化|:pencil2:|pencil2|修复编码错误 fixing typos|
| | | | | |2016年12月20日|
|:hankey:|hankey|写了需要改良的烂代码|:rewind:|rewind|撤销改变|
|:twisted_rightwards_arrows:|twisted_rightwards_arrows|合并分支|:package:|package|更新已编译文件或包裹|
|:alien:|alien|由于外部api修改更新代码|:truck:|truck|删除或重命名文件|
|:page_facing_up:|page_facing_up|添加或更新license| | | |
| | | | | |2017年3月24日|
|:boom:|boom|介绍重大更新|:bento:|bento|添加/更新assets|
|:ok_hand:|ok_hand|由于codereview的改变更新代码|:wheelchair:|wheelchair|提高便捷性|
|:bulb:|bulb|文档注释| | | |

# links

- [seamless-immutable源码学习](https://github.com/rtfeldman/seamless-immutable/blob/master/seamless-immutable.development.js)
- [Immutable 详解及 React 中实践](https://zhuanlan.zhihu.com/p/20295971)
- [浅谈 JS 对象之扩展、密封及冻结三大特性](https://segmentfault.com/a/1190000003894119)

+ [Redux中文](http://cn.redux.js.org/index.html)
+ [Action](https://github.com/acdlite/flux-standard-action)
+ [Action](http://redux.js.org/docs/basics/Actions.html)
+ [React Doc](http://reactjs.cn/react/docs/tutorial.html)
+ [Webpack Doc](https://webpack.github.io/docs/stylesheets.html)

# Libray
- [lodash Doc](https://lodash.com/docs/4.16.0)

# 说明
一些工作中开发的通用组件；
资料整理；
& so on...

### vi :)
- 语法着色 syntax on
- 显示行数 set number

### 修改vi中tab键为4个空格
在.vimrc中添加以下代码后，重启vim即可实现按TAB产生4个空格：
- set ts=4  (注：ts是tabstop的缩写，设TAB宽4个空格)
- set expandtab
- set nowrap                      " Do not wrap long lines
- set autoindent                  " Indent at the same level
- set shiftwidth=4                " Use indents of 4 spaces
- set expandtab                   " Tabs are spaces, not tabs
- set tabstop=4                   " An indentation every four columns
- set softtabstop=4               " Let backspace delete indent
