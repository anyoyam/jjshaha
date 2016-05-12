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
    "preset": ["es2015", "react", "stage-3"],
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

