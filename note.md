#学习笔记

## Babel 转码器

Babel是一个ES6转码器，将ES6代码转换为ES5代码；

### .babelrc 配置文件

该配置文件在项目根目录下，用来设置转码规范和插件，格式如下

```json
{
    "presets": [],
    "plugins": []
}
```

`presets`用来设置转码规范，官方有以下规则，根据需求添加使用：

```shell
#es2015转码规范
$ npm install --save-dev babel-preset-es2015
#react转码规范
$ npm install --save-dev babel-preset-react
#es7不同阶段转码规范（0-3 4种），选装一种
$ npm install --save-dev babel-preset-stage-0
```

`--save-dev`仅将模块添加到开发中

将这些规则加入.babelrc。

```json
{
    "presets": ["es2015", "react", "stage-3"],
    "plugins": []
}
```

----

###命令行转码 babel-cli

Babel提供命令行工具用来转码

```shell
$ npm install --global babel-cli
```

`--global` 将工具添加到全局中，这样就直接可以允许命令了

```shell
#单文件转码
#--out-file -o 指定输出文件
$ babel example.js
$ babel example.js --out-file compiled.js
$ babel example.js -o compiled.js
#指定目录转码，
#--out-dir or -d 指定输出目录
$ babel src --out-dir lib
$ babel src -d lib
```

上面是将babel安装在全局环境下，意味着如果要允许项目全局环境必须有`Babel`，这样项目对环境有了依赖，而且这样做无法支持不同项目不同版本的Babel。

解决方法是将babel安装到项目中。

```shell
$ npm install --save-dev babel-cli
```

### babel-node

babel-node 是一个直接可以允许ES6代码的命令；

```shell
$ babel-node
> (x => x * 2)(15);
> 30
```

也可以直接运行ES6脚本

```shell
$ babel-node src/test.js
30
```


### babel-register

`babel-register`模块会给`require`命令加一个钩子，当使用`require`加载**.js, .jsx, .es, .es6**后缀的文件时，先会进行Babel转码。

```shell
$ npm install --save-dev babel-register
```

使用时先加载`babel-register`

```javascript
require("babel-register");
require("./index.js");
```

**注: babel-register只会对`require`命令加载的文件进行转码, 不会对当前文件转码. 而且它是实时转码, 只适合开发环境使用**

### babel-core

某些代码需要调用Babel的API进行转码, 就需要babel-core模块了; 

```shell
$ npm install babel-core --save
```

`--save`会将模块添加到项目依赖中.

然后在项目中就可以使用`babal-core`了。

```javascript
var es6Code = 'let x = n => n + 1';
var es5Code = require('babel-core')
  .transform(es6Code, {
    presets: ['es2015']
  })
  .code;
// '"use strict";\n\nvar x = function x(n) {\n  return n + 1;\n};'
```

###babel-polyfill

babel只会转换新的javascript句法，不会转换新的api，比如Iterator，Generator，Set，Maps，Proxy，Reflect，Symbol，Promise等全局对象，以及定义在全局对象上的方法，都不会转码；

使用babel-polyfill为当前环境提供一个垫片，达到模拟这些新API的目的；

```shell
$ npm install --save babel-polyfill
```

使用

```javascript
import 'babel-polyfill';
// or
require('babel-polyfill');
```

