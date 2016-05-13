#ECMAScript 6 运行环境

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

# let & const

let 用来定义变量
const 定义常量

## 特性

- 不存在变量提升
- 暂时性死区
- 不允许重复声明

```javascript
//变量提升
console.log(foo);  //undefined
console.log(bar); // ReferenceError

var foo = 2;
let bar = 2;

//暂时性死区
var tmp = 123;
if (true) {
    tmp = '123'; // ReferenceError
    let tmp;
}

//不允许重复声明
function f(arg) {
    let a = 10;  // has already declared
    var a = 1;   // has already declared
    let arg;     // has already declared
}

function f(arg) {
    let a = 10;
    {
        let arg; //不报错
        let a;   //不报错
    }
}
```

## 块级作用域

```javascript
function f() {
    let n = 5;
    if (true) {
        let n = 10;
    }
    console.log(n); //5
}

{{{
    {let ins = 'something...';}
    console.log(ins);  // not defined
}}}

function f() {console.log('out');}
(function() {
    if (flase) {
        function f(){console.log('in');}
    }
    f();
}());
```

上面代码在ES5中运行，会得到“I am inside!”，但是在ES6中运行，会得到“I am outside!”。这是因为ES5存在函数提升，不管会不会进入 `if`代码块，函数声明都会提升到当前作用域的顶部，得到执行；而ES6支持块级作用域，不管会不会进入if代码块，其内部声明的函数皆不会影响到作用域的外部。

```javascript
{
  let a = 'secret';
  function f() {
    return a;
  }
}
f() // 报错
```

上面代码中，块级作用域外部，无法调用块级作用域内部定义的函数。如果确实需要调用，就要像下面这样处理。

```javascript
let f;
{
  let a = 'secret';
  f = function () {
    return a;
  }
}
f() // "secret"
```

ES5的严格模式规定，函数只能在顶层作用域和函数内声明，其他情况（比如`if`代码块、循环代码块）的声明都会报错。

```javascript
// ES5
'use strict';
if (true) {
  function f() {} // 报错
}
```

ES6由于引入了块级作用域，这种情况可以理解成函数在块级作用域内声明，因此不报错，但是构成区块的大括号不能少，否则还是会报错。

```javascript
// 不报错
'use strict';
if (true) {
  function f() {}
}

// 报错
'use strict';
if (true)
  function f() {}
```

另外，这样声明的函数，在区块外是不可用的。

```javascript
'use strict';
if (true) {
  function f() {}
}
f() // ReferenceError: f is not defined
```

上面代码中，函数`f`是在块级作用域内部声明的，外部是不可用的。

## 跨模块常量

export 导出
import 导入

## 全局对象属性 (window)

> tip: A **read-eval-print loop** (REPL), also known as an **interactive toplevel** or **language shell**, is a simple, interactive computer programming environment. [wiki](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop "维基百科")

`var`和`function`定义的全局变量依旧是全局对象的属性，`let`，`const`和`class`声明的全局变量不属于全局对象

```javascript
var a = 123;
window.a; //123
this.a; //123
global.a; //REPL环境 123

let b = 456;
window.b; //undefined
```

# 变量的解构赋值

## 数组解构赋值

```javascript
var [a, b, c] = [1, 2, 3];
console.log(a); //1
console.log(b); //2
console.log(c); //3

let [e, [[f], g]] = [1, [[2], 3]];
console.log(e); //1
console.log(f); //2
console.log(g); //3

let [ , , third] = ["1", "2", "3"];
console.log(third); // '3'

let [x, , y] = [1, 2, 3];
console.log(x); //1
console.log(y); //3

let [x, ...y] = [1, 2, 3, 4, 5, 6];
console.log(x);  //1
console.log(y ); //[2, 3, 4, 5, 6]

let [x, y, ...z] = ['a'];
x // 'a'
y // undefined
z // []

let [x, y] = [1, 2, 3];
x //1
y //2

let [a, [b], d] = [1, [2, 3], 4];
a //1
b //2
d //4

// Error
// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};

//默认值

let [foo = true] = [];
foo //true

var [x, y = 'b'] = ['a'];
x //'a'
y //'b'
var [x, y = 'b'] = ['a', undefined];
x //'a'
y //'b'
var [x, y = 'b'] = ['a', null];
x //'a'
y //null    undefined !== null 严格相等运算
```

## 对象解构赋值

```javascript
var {foo, bar} = {foo: "aa", bar: "bb"};
foo // 'aa'
bar // 'bb'

var {baz} = {foo: "aa", bar: "bb"};
baz // undefined

//foo 为匹配模式 baz才是变量
var {foo: baz} = {foo: "aa", bar: "bb"};
baz // 'aa'
let obj = {fir: "hello", sec: "world"};
let {fir: f, sec: s} = obj;
f // 'hello'
s // 'world'
var { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined

//不能重复定义
let foo;
let {foo} = {foo: 1}; // SyntaxError: Duplicate declaration "foo"
let baz;
let {bar: baz} = {bar: 1}; // SyntaxError: Duplicate declaration "baz"
//----
let foo;
({foo} = {foo: 1}); // 成功
let baz;
({bar: baz} = {bar: 1}); // 成功

//可以嵌套  p是模式不是变量
var obj = {
  p: [
    "Hello",
    { y: "World" }
  ]
};
var { p: [x, { y }] } = obj;
x // "Hello"
y // "World"

//嵌套赋值
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
obj // {prop:123}
arr // [true]

//对象解构默认值
var {x = 3} = {};
x // 3
var {x, y = 5} = {x: 1};
x // 1
y // 5
var { message: msg = "Something went wrong" } = {};
msg // "Something went wrong"

// 错误的写法
var x;
{x} = {x: 1};
// SyntaxError: syntax error
// 正确的写法
({x} = {x: 1});

//函数解构
let { floor,ceil } = Math;
floor(1.4); // 1

//字符串解构
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

//函数参数解构默认值  上一个是给每个参数默认值，下一个是参数整体默认值
function move({x = 0, y = 0} = {}) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]

```

### 用途

- 交换变量值 `[x, y] = [y, x]`
- 从函数返回多个值
```javascript
function f() {
    return [1, 2, 3];
}
var [a, b, c] = f();
a //1
b //2
c //3
```
- 函数参数定义
- 提取JSON数据
- 函数参数默认值
```javascript
var f = function(url, {
    id = 1,
    page = 1,
    cache = true
}){
    //...
}
```
- 遍历Map结构
```javascript
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
for (let [key, value] of map) {
  console.log(key + " is " + value);
}
// first is hello
// second is world
```
- 输入模块的指定方法 `const {add, by} = require("calc");`

# 字符串的扩展

- `.codePointAt()` 正确处理4个字节(超过0xffff)的储存的字符
- `String.formCodePoint()`
- 字符串的遍历器接口
```javascript
for (let o of 'foo') {
    console.log(o);
}
// 'f'
// 'o'
// 'o'
```
- `.charAt()` 不能识别大于**oxffff**的字符，提供`.at()`；这个方法是通过[垫片库](https://github.com/es-shims/String.prototype.at)实现的
- `.normalize()`
- `.includes()`，`.startsWith()`，`.endsWith()` 
- `.repeat()` 
- `.padStart()`, `.padEnd()` 
- 11