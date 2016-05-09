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
requriejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});
requirejs(['jquery', 'main', 'app/index'], 
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

### 注意事项

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
