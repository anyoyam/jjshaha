**RequireJS**鼓励代码模块化，使用`module ID`代替URL地址，动态加载js；

# 使用方法

> 相对于`baseUrl`地址来加载所有代码
> 顶层`<script/>`标签含有一个`data-main`属性可以用来首次引入requireJS时读取`data-main`对应的脚本，达到配置初始化的目的

>`baseUrl`可以通过config手动配置。如果没有指定，则`baseUrl`默认为包含requireJS的那个html页面所在的目录。

默认所有依赖资源都是js脚本，因此无需再moduleID后加.js后缀；
可以通过设置`paths config`设置一组脚本，减少使用时码字的数量；

避开`baseUrl + paths`的解析
 - 以**.js**结尾
 - 以**/**开始
 - 包含协议，如http，https

最好使用baseUrl + path 去设置 moduleID；

```
- www/
    - index.html
    - js/
        - app/
            - index.js
        - lib/
            - jquery.js
            - main.js
        - app.js
        - require.js
```

在使用第三方库时尽量不要在文件名中包含版本号，保持配置最小化，例如 jquery-1.10.5.min.js，最好保存为jquery.js；

index.html

```html
<script data-main="js/app.js" src="js/require.js"></script>
```

app.js

```javascript
requrie.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});
require(['jquery', 'main', 'app/index'], 
function($, main, index) {
    $(document).ready(function() {
        //main...
        //index....
    });
});
```

> 注意：`paths` 的路径相对于 `baseUrl`的；

## data-main 入口点

**require.js**在加载时会检查`data-main`属性，会在第一时间运行`data-main`对应的脚本；`data-main`中的脚本为异步加载，所以确保页面没有其他js依赖`data-main`中异步加载的脚本；因为异步所以不能保证在运行其他js时已加载了依赖库；

## 定义模块

模块好处：
 - 避免全局命名空间污染
 - 显式列出依赖关系，已参数形式依赖注入，无需引入全局变量

### 简单的键值对

模块仅含键值对，没有任何依赖；

```javascript
define({a :"123", "b": new Date()});
```

### 函数式定义

模块没有任何依赖，需要做初始化工作；

```javascritp
define(function() {
    //do someting for init...
    var d = new Date();
    return {a :"123", "b": d};
});
```

### 存在依赖的函数式定义

定义时第一个参数为依赖库的**moduleID数组**；第二个参数为**函数**，用来定义模块；依赖加载完毕，第二个参数对应的函数会被调用，并以参数形式注入依赖库，参数顺序与依赖库数组意义对应，该函数必须返回一个定义本模块的**Object**；

目录结构：

```
    - cart.html
    - js
        - action
            - cart.js
            - order.js
        - item
            - shirt.js
        jquery.js
```

shirt.js

```javascript
define(['../jquery', '../action/cart', '../action/order'], function($, ct, od) {
    // do something for init...
    return {
        color: "red",
        size: "M",
        addToCart: function() {
            ct.add(this);
        },
        buyNow: function() {
            od.newFromItem(this).pay();
        }
    };
});
```

例子定义了一个衬衫（shirt）模块，包含添加到购物车和立即购买方法，依赖注入3个库（jquery库，购物车库，订单库），3个库都在不同的目录存储，在定义衬衫模块时依赖库的moduleID是相对于衬衫模块的位置引入的；**注：在定义模块时依赖的模块路径是相对于定义的模块的js文件所在的目录**

### 将模块定义为一个函数

模块没有强制返回值必须为Object，任何函数的返回值都允许

```
    - js
        - compon
            - test.js
        - action
            - cart.js
            - index.js
```

test.js

```javascript
define(['action/cart', 'action/index'], function(ct, idx) {
    return function(a) {
        return a ? "has" : "no";
    }
});
```

**test.js**文件不在action目录中，使用action去加载依赖库，需要在paths中对app进行映射对应目录，如果没有映射目录，默认是相对于test所在的目录及 `/js/compon/action/cart.js` 和 `/js/compon/action/index.js`；

### 定义一个带命名的模块 （一般不用，工具生成）

一般这种是通过工具自动生成的，显式指定了模块的名称，但这种方式不具备移植性，一旦移动到其他目录下，就得手动重新命名了；这种一般交给工具自动处理，工具会将多个模块打包一个加快浏览器载入速度。

```javascript
define("compon/test", ['action/cart', 'action/index'], function(ct, idx) {
    return {
        //ss.......
    };
});
```

## 其他说明

**一个文件一个模块** 由于requireJS是基于*模块名 - 到 - 文件路径+文件*查找的机制，所以一般每个js文件仅定义一个模块；自动化工具会自己组织优化并自动带命名的模块；

**define()中引入require** 为了在define定义模块的内部使用`require("action/order")`引用需要的库，请将`require`本身作为依赖注入到模块中；

```javascript
define(['require', 'action/some'], function(req, som) {
    var som2 = req('action/some2');
});
```

或者使用短语法

```javascript
define(function(require) {
    var som2 = require('action/some2');
});
```

这种方法对于在某个目录下创建一些模块后，在模块之间可以互相访问，无需知道目录名称，方便共享给其他人或者项目使用；

**生成相对于模块的url地址**

```javascript
    define(["require"], function(require) {
        var curl = require.toUrl("./curl.js");
    });
```

**直接调用模块方法**

对于已经通过`require(["module/name"], function(){})`加载过的模块，可以直接使用模块名作为`require`的字符串参数来直接获取调用；

```javascript
    require(["app/index"], function(index) {
        return {
            "sum": function(a, b) {
                return a+b;
            }
        };
    });
    //.............
    require("app/index").sum(1, 2);
```

> 注：这种形式只能在`module/name`已经异步形式的`require(["module/name"], function() {})`加载后才能有效；在define内部只能使用类似`./module/name`的相对路径形式

##循环依赖

如果定义两个模块A and B，它们互相依赖着，A依赖B，而B又依赖A，那么当B模块函数被调用时，它将会得到一个`undefined`的A；B可以在模块中使用`require`方法再获取A；

```javascript
    //A.js
    define(['require', 'B'], function(require, b) {
        //.....
        var v = require("B").callSomeFunction();
        return {};
    });
    //B.js
    define(['require', 'A'], function(require, a) {
        //....
        var v = require("A").callSomeFunction();
        return {};
    });
```

##JSONP依赖

在requireJS中使用JSON服务，需要将callback参数指定为`define`；

```javascript
require(["http://example.com/api/getjson?callback=define"], function(data) {
    console.log(data);
});
```

**callback**为define就是让api将JSON数据包包裹到一个define中，定义一个模块；

> 仅支持返回值类型为JSON Object的JSONP服务，返回数组，字符串，数字等其他类型都不支持。

#机制

requireJS是使用`head.appendChild()`来将每个依赖加载为一个script标签；
requireJS等待所有的依赖加载完毕后，计算出模块定义函数正确的调用顺序，然后依次调用函数；

#配置说明

```javascript
require.config({
    baseUrl: "asset/js",
    paths: {
        "comp": "components/v0.1",
        "tool": "tookit/v0.1",
    },
    waitSeconds: 15
});

require(["comp/tabs", "jquery.js"], function(tabs) {

});
```

**baseUrl**所有模块的查找根路径；上例中`comp/tabs`所对应的js文件路径为`asset/js/components/v0.1/tabs.js`；以**.js结尾**，**/开头**或者**包含协议**，将不会使用baseUrl；因此jquery.js将在html页面同目录下加载；

如果没有显式设置baseUrl，默认值为引入require.js的html文件所处的位置；如果用了`data-main`，则该路径就变为baseUrl；

baseUrl可以跟require.js页面在不同域下，requireJS脚本加载可以跨域；唯一限制是使用`text!plugins`加载文本内容，文本内容路径应该与页面同域；

**paths**用来映射那些不直接放置在baseUrl下的模块，方便码字数量；设置的path是相对于baseUrl的，除非path**以/开头**或者**包含协议**；上例中`comp/tabs`；

**shim**用来为没有使用define来定义之间依赖关系、设置为浏览器全局变量的脚本做依赖和导出配置；

```javascript
require.config({
    shim: {
        'backbone': {
            deps: ["underscore", 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'foo': {
            deps: ['bar'],
            //requireJS 2.0.*
            //exports: function(bar) {
            //    return this.Foo.noConflict();
            //} 
            //requireJS 2.1.0+
            exports: 'Foo',
            init: function(bar) {
                return this.Foo.noConflict();
            }
        }
    }
});
```

>  1.shim 配置的都是不遵循AMD规范的普通脚本，并且这些脚本没有被define执行，如果脚本符合AMD规范，shim将失效，exports和init的配置不会被触发，deps配置在这些情况下也会比较混乱；
>  2.依赖脚本必须先加载完毕然后在加载主脚本；
>  3.一次加载完毕后，就可以使用全局变脸来作为模块的值了，如上例中的Backbone
>  4.在foo例子中，exports对应的是一个函数，在函数中的`this`是全局对象，依赖会通过函数的参数传入函数体；
>  5.使用函数允许在函数中调用例如noConflict之类的类库支持的方法；但无论如何，要注意这些类库仍然是全局对象；

在requireJS2.0.*中，exports属性可以用一个函数代替字符串，这种情况下，和上面例子中的init属性有相同的作用；init这种形式被用在requireJS2.1.0+的版本，这样exports对应的字符串值可以被用作[enforeceDefine](#enforceDefine)，但同时允许函数允许一次，让类库得到加载；

**<a name="enForeceDefine">enforceDefine</a>**