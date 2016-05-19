# ECMAScript 6 运行环境

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
//
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
- `.charAt()` 不能识别大于`0xffff`的字符，提供`.at()`；这个方法是通过[垫片库](https://github.com/es-shims/String.prototype.at)实现的
- `.normalize()` 用来将字符的不同表示方法统一为同样的形式，称之为Unicode正规化
- `.includes()`，`.startsWith()`，`.endsWith()` 
    - `.includes()` 是否找到参数字符串 boolean
    - `startsWith()` 参数字符串是否在源字符串的头部 boolean
    - `endsWith()` 参数字符串是否在源字符串的尾部 boolean
    - 这三个方法都支持第二个参数，表示开始搜索的位置。

    ```javascript
    var s = 'Hello World';
    s.startsWith("Hello");  //true
    s.endsWith("!"); //true
    s.includes("o"); //true

    s.startsWith('world', 6); //true
    s.endsWith('Hello', 5); //true 在endsWith方法中第二个个参数相当于将字符串截取的个数，然后在截取的字符串的结尾找参数字符串；
    s.includes('Hello', 6); //false
    ```

- `.repeat()` 返回一个将源字符串重复n次的新字符串
- `.padStart()`, `.padEnd()` ES7推出字符串补全长度方法。
    - 接受两个参数，第一个用来指定字符串的最小长度，第二个是用来补全的字符串。
    - 如果源字符串的长度，等于或大于指定的最小长度，则返回源字符串；
    - 如果省略第二个参数，会用空格补全长度
- **模板字符串** 增强版的字符串，用反引号 `` ` ``标识。可作普通字符串，也可以定义多行字符串或者嵌入变量。
    - 在模板字符串中如需要使用反引号 `` ` ``则需要在前面加反斜杠转义。
    - 所有空格和缩进都会被保留输出。
    - 嵌入变量需要将变量名写在`${}`之中。
    - `${}`的大括号中可以放入任意的Javascript表达式，可以进行运算，也可以引入对象属性，还可以调用函数，如果里面的值不是字符串，则按照一般规则转为字符串，例如是一个对象，将默认调用对象的`toString`方法
    ```javascript
    let x = 1, y = 2;
    `${x} + ${y} = ${x + y}`  // 1 + 2 = 3
    `${x} + ${y * 2} = ${x + y * 2}`  // 1 + 4 = 5

    var obj = {x: 1, y: 2};
    `${obj.x + obj.y}`  // 3

    function fn() {
        return "Hello world!";
    }
    `foo ${fn()} bar` // foo Hello world bar
    `Hello ${'world'}`  //里面是一个字符串，则直接输出字符串

    let a = (name) => `Hello, ${name}`;
    a("Yam");
    ```
- **标签模板** 将模板作为函数的参数，调用函数 `` say`Hello, ${user.name}.` `` 相当于 `say(['Hello, ', '.'], user.name)` 
    + 第一个参数是不包含变量的字符串数组
    + 其他参数是模板字符串中的变量
    + 第一个参数中有一个`raw`属性，是一个数组，元素和第一个参数完全一致，唯一的区别是raw中的字符串是被转义了的，比如 `["line 1 \n line 2"]`，而raw中将会是 `["line 1 \\n line 2"]`
    + ☺
    ```javascript
        let user = {name: 'Yam', age: 13};
        function say(a, ...b) {  //采用rest参数写法
            let out = '';
            for (var i = 0; i < b.length ; i++) {
                out += a[i] + b[i];
            }
            out += a[i]
            return out;
        }
        let msg = say`Hello, ${user.name}'s age is ${user.age}.`;
        //相当于调用方法 say(["Hello, ", "'s age is ", "."], user.name, user.age);
        console.log(msg); // Hello, Yam's age is 13.
    ```
- `String.raw()` 用来充当模板字符串的处理函数，返回一个斜杠都被转义的字符串，对应于替换变量后的模板字符串。
    + 如果源字符串的斜杠已经转义，那么`String.raw()`不会做任何处理
    + 可以作为处理模板字符串的基本方法
    + 也可以作为正常函数使用，*注：它第一个参数应该是一个具有`raw`属性的对象，raw属性的值是一个**数组***
    ```javascript
    String.raw`Hi\n${2+3}`; //Hi\\n5!
    String.raw`Hi\u000A!`; //Hi\\u000A!

    String.raw`Hi\\n123`; //Hi\\n123

    String.raw({raw: 'test'}, 0, 1, 2); //t0e1s2t
    // ==
    String.raw({raw: ['t', 'e', 's', 't'], 0, 1, 2}); //t0e1s2t
    ```

# 正则表达式扩展

- RegExp构造函数
    + ES5中构造函数有两种情况
        * `var regex = new RegExp('xyz', 'i');` 第一个参数是字符串，第二个是正则表达式修饰符，等价于 `var regex = /xyz/i;`
        * `var regex = new RegExp(/xyz/i);` 参数是一个正则表达式，返回原有正则表达式的拷贝
        **此时ES5中不允许使用第二个参数，不能添加修饰符，会报错**
    + 在**ES6**中，如果RegExp构造函数第一个参数是一个正则表达式，那么可以使用第二个参数指定修饰符，用来重写修饰符
        * `var regex = new RegExp(/xyz/ig, 'i').flag; // "i"` 修饰符`ig`，会被第二个参数`i`覆盖；
- 字符串的正则方法
    + 字符串对象可以使用正则方法：`match()`，`replace()`，`search()`，`split()`，在ES6中将这4个方法在语言内部全部调用RegExp的实例方法，做到与正则相关方法，全部定义在RegExp对象上。
- `u` 修饰符 
ES6添加u修饰符表示Unicode模式，用来处理大于`0xffff`的Unicode字符。
```javascript
//'\uD83D\uDC2A' 是一个四字节的UTF-16编码，代表一个字符
/^\uD83D/u.test('\uD83D\uDC2A');  //false 加上u修饰符，ES6会识别其为一个字符
/^\uD83D/.test('\uD83D\uDC2A');  //true ES5 不支持四字节，会将其识别为2个字符
```

    + 点字符 
    表示任意单字符，对于大于`0xffff`的Unicode字符，必须加上`u`修饰符；
    ```javascript
    var s = '𠮷';
    /^.$/.test(s) // false
    /^.$/u.test(s) // true
    ```
    + Unicode字符表示法 
    ES6增加使用`{}`来表示Unicode字符，这种正则表达式必须加上`u`修饰符
    ```javascript
    /\u{61}/.test('a') // false 不加u无法识别\u{61}这种表示方法，会匹配连续61个u
    /\u{61}/u.test('a') // true
    /\u{20BB7}/u.test('𠮷') // true
    ```
    + 量词
    使用`u`修饰符后，所有量词都会正确识别大于`0xffff`的Unicode字符。
    ```javascript
    /a{2}/.test('aa') // true
    /a{2}/u.test('aa') // true
    /𠮷{2}/.test('𠮷𠮷') // false
    /𠮷{2}/u.test('𠮷𠮷') // true
    ```
    + 预定义模式
    u修饰符也会影响预定义模式，会正确识别大于`0xffff`的Unicode字符。
    ```javascript
    /^\S$/.test('𠮷') // false
    /^\S$/u.test('𠮷') // true
    ```
    `\S` 会匹配所有不是空格的字符，加了`u`修饰符就能匹配四字节的unicode字符；
    + `i` 修饰符
- `y` 修饰符
    + “粘连”修饰符，`y`修饰符作用与`g`修饰符类似，也是全局匹配；后一次匹配都从上一次匹配成功的下一个位置开始。不同之处在于`g`修饰符只要剩余位置中存在匹配就可，而`y`修饰符要确保匹配必须从剩余的第一个位置开始；
    + 也就是说`y`修饰符隐含头部匹配标志`^` 
    ```javascript
    let s = 'aaa_aa_a';
    var r1 = /a+/g;
    var r2 = /a+/y;

    r1.exec(s) // ["aaa"]
    r2.exec(s) // ["aaa"]

    r1.exec(s) // ["aa"]
    r2.exec(s) // null     //相当于要在 _aa_a 中匹配 /^a+/
    ```
- **sticky** 属性
    与`y` 修饰符相匹配，ES6的正则对象多了一个`sticky`属性，表示是否设置了`y`修饰符
- **flags** 属性 返回正则表达式的修饰符。
- `RegExp.escape()`
- 后行断言

# 数值的扩展
- 二进制和八进制表示法
    + ES6二进制和八进制新写法，分别加前缀`0b`（或`0B`）和`0o`（或0o）表示
    + 将包含`0b`和`0x`前缀的字符串转换为十进制，可以使用`Number`方法
    ```javascript
    0b111110111 ==- 503 //true
    0o767 === 503 //true

    Number('0b111'); //7
    Number('0o10'); //8
    ```
- Number.isFinite(), Number.isNaN()
`Number.isFinite()`判断一个数值是否非无穷（infinite）
```javascript
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false
```
`Number.isNaN()`判断一个值是否为NaN
```javascript
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true'/0) // true
Number.isNaN('true'/'true') // true
```
ES5这样部署：
```javascript
//ES5中扩充Number.isFinite方法
(function(global) {
    var g_isFinite = global.isFinite();
    Object.defineProperty(Number, 'isFinite', {
        value: function(value) {
            return typeof value === 'number' && global_isFinite(value);
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
})(this);
//ES5中扩充Number.isNaN方法
(function(g) {
    var g_isNaN = g.isNaN();
    Object.defineProperty(Number, 'isNaN', {
        value: function(value) {
            return typeof value === 'number' && g_isNaN(value);
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
})(this);
```
**它们与传统的全局方法区别在于，传统方法先调用Number()将非数值转为数值，再判断，而这两个方法只对数值有效，非数值一律返回`false`**
- Number.parseInt(), Number.parseFloat()
ES6将全局方法`parseInt()`和`parseFloat()`移植到Number对象上，行为保持不变，目的是减少全局性方法，使语言模块化
- Number.isInteger()
用来判断一个值是否为整数，在javascript内部，整数和浮点数是同样的存储方法，所以**3**和**3.0**被视为同一个值
```javascript
Number.isInteger(20); //true
Number.isInteger(20.0); //true
Number.isInteger(20.1); //false
Number.isInteger('20'); //false
Number.isInteger(true); //false

//在ES5中这样部署
(function(g) {
    var floor = Math.floor,
        isFinite = g.isFinite;
    Object.defineProperty(Number, 'isInteger', {
        value: function(value) {
            return typeof value === 'number' && isFinite(value) &&
                value > -9007199254740992 && value < 9007199254740992 &&
                floor(value) === value;
        },
        configurable: true,
        enumerable: false,
        writable: true
    });
})(this);
```
- Number.EPSILON
- 安全整数和Number.isSafeInteger()
- Math对象的扩展
    + Math.trunc()
    用于去除一个数的小数部分，返回整数
    对于非数值，内部先使用`Number`方法转换为数值。
    对于空值和无法截取整数的值，直接返回NaN
    ```javascript
    Math.trunc(4.1) // 4
    Math.trunc(4.9) // 4
    Math.trunc(-4.1) // -4
    Math.trunc(-4.9) // -4
    Math.trunc(-0.1234) // -0
    ```
    + Math.sign()
    判断一个数到底是正数，负数还是零
        * 参数为正数，返回+1
        * 参数为负数，返回-1
        * 参数为零，返回0
        * 参数为-0，返回-0
        * 其他值，返回NaN
    + Math.cbrt() 计算一个数的立方根。
    + Math.clz32() 
    **“count leading zero bits in 32-bit binary representations of a number”**
    Javascript的整数使用32位二进制形式表示，该方法返回一个数的32位无符号正数形式有多少个前导0
        * 对于小数，`Math.clz32`只考虑整数部分
        * 对于空值或其他类型值，先会转为数值，然后计算
    ```javascript
    Math.clz32(0) // 32
    Math.clz32(1) // 31
    Math.clz32(1000) // 22
    Math.clz32(0b01000000000000000000000000000000) // 1
    Math.clz32(0b00100000000000000000000000000000) // 2
    Math.clz32(1 << 1) // 30
    Math.clz32(1 << 2) // 29
    Math.clz32(1 << 29) // 2

    Math.clz32(3.2) // 30

    Math.clz32() // 32
    Math.clz32(NaN) // 32
    Math.clz32(Infinity) // 32
    Math.clz32(null) // 32
    ```
    + Math.imul()
    返回两个数以32位带符号整数形式想成的结果，结果也是一个32位带符号的整数
    + Math.fround()
    返回一个数的单精度浮点数形式
    + Math.hypot()
    返回所有参数的平方和的平方根
    ```javascript
    //3的平方加上4的平方，等于5的平方
    Math.hypot(3, 4); // 5
    ```
    + 对数方法
        * Math.expm1()
        * Math.log1p()
        * Math.log10()
        * Math.log2()
    + 三角函数方法
        * Math.sinh(x)
        * Math.cosh(x)
        * Math.tanh(x)
        * Math.asinh(x)
        * Math.acosh(x)
        * Math.atanh(x)
- 指数运算符
ES7新增一个指数运算符`**`
```javascript
2 ** 2 //4   = 2 * 2
2 ** 3 //8   = 2 * 2 * 2

let a = 2, b = 3;
a **= 2; //4  a = a * a;
b **= 3; //27 b = b * b * b
```

# 数组的扩展
- Array.form()
用于将两类对象转换为真正的数组：类似数组的对象(array-like-object)和可遍历(iterable)的对象（包括ES6新增的数据结构Set和Map）
```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
//ES5的写法
var arr1 = [].slice.call(arrayLike);  // ['a', 'b', 'c']
//ES6的写法
let arr2 = Array.from(arrayLike);  // ['a', 'b', 'c']
```
实际中，常见类似数组的对象时DOM操作返回的**NodeList集合**，还有函数内部的**`arguments`**对象。`Array.from()`都可以讲它们转为真正的数组。只有真正的数组才可以使用`forEach()`方法
```javascript
//NodeList 对象
let divs = document.querySelectorAll('div');
Array.from(divs).forEach(function(div) {
    console.log(div);
});

//arguments 对象
function foo() {
    var args = Array.from(arguments);
    // ...
}
```
字符串和Set结构都具有Iterator接口，因此可以被`Array.from()`转为真正的数组。
```javascript
Array.from("hello"); //['h', 'e', 'l', 'l', '0']
let nemeSet = new Set(['a', 'b']);
Array.from(nameSet);  //['a', 'b']
//参数是一个真正的数组，Array.from会返回一个一模一样的新数组。
Array.from([1, 2, 3]); //[1, 2, 3]
```
扩展运算符（`...`）也可以将某些数据结构转为数组
```javascript
function foo() {
    var args = [...arguments];
}
// NodeList对象
[...document.querySelectorAll('div')];
```
**扩展运算符**背后调用的时遍历器接口（Symbol.iterator），如果对象没有这个接口就无法转换；`Array.from()`还支持类似数组的对象，及必须有`length`属性的对象，都可以转换为数组，而此时扩展运算符就无法转换。
```javascript
Array.from({length: 3}); // [undefined, undefined, undefined]
```
对于不支持该方法的浏览器，可以用`Array.prototype.slice`方法代替。
```javascript
const toArray = (() => 
    Array.from ? Array.from : ((obj) => [].slice.call(obj))
)();
```
`Array.from()`还支持第二个参数，作用类似数组的`map`方法，用来对每个元素处理，然后把处理后的值放回数组中。
```javascript
Array.from(arrayLike, x => x * x);
//等同于
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], (x) => x * x); // [1, 4, 9]

//获取span中的内容数组
let spans = doucment.querySeletorAll("span");
//map()
let name1 = Array.prototype.map.call(spans, s => s.textContent);
//Array.from()
let name2 = Array.from(spans, s => s.textContent);
```
将数组中布尔值为`false`的成员转为`0`
```javascript
Array.from([1, , 2, , 3], (n) => n || 0); //[1, 0, 2, 0, 3]
```
返回各种数据的类型。
```javascript
Array.from([null, [], NaN], value => typeof value); //['object', 'object', 'number']
```
如果`map`函数中用到了`this`关键字，还可以传入`Array.from`的第三个参数，用来绑定`this`关键字。
- Array.of()
该方法用于将一组值，转换为数组。
```javascript
Array.of(3, 11, 8); // [3, 11, 8]
Array.of(3); //[3]
```
这个方法用来弥补数组构造函数`Array()`的不足，因为参数不同会导致结果有差异。
```javascript
Array(); // []
Array(3); // [ , , ]
Array(3, 11, 8); // [3, 11, 8]
```
上面代码，`Array()`没有参数，一个参数，三个参数时返回结果都不一样。只有当参数个数不小于2时，`Array()`才会返回由参数组成的新数组。参数个数只有一个时，实际上是指定数组的长度。
`Array.of`方法可以用一下代码模拟
```javascript
function Arrayof() {
    return [].slice.call(arguments);
}
```
- 数组实例的copyWithin(target, [start, end])
从一个位置开始读取数据到另一个位置结束，将读取的数据复制到其他位置（会覆盖原有成员）
    + target(必填)，从该位置开始替换数据
    + start(选填)，从该位置开始读取，默认0，负数表示倒数
    + end(选填)，到该位置停止读取，默认为数组长度，负数表示倒数。
```javascript
[1, 2, 3, 4, 5].copyWithin(0, 3); //[4, 5, 3, 4, 5]
//表示从下标3开始读取直到数组尾部，将读取的数据写到下标0的位置
[1, 2, 3, 4, 5].copyWithin(0, 3, 4); //[4, 2, 3, 4, 5]
// -2 相当于3的位置，-1 相当于4的位置
[1, 2, 3, 4, 5].copyWithin(0, -2, -1); // [4, 2, 3, 4, 5]
```
- 数组实例的find()和findIndex()
数组实例的`find`的方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有成员一次执行该回调函数，知道找出第一个返回为`true`的成员，然后返回该成员。如果没有符合条件的成员，则返回`undefined`。
```javascript
[1, 4, -5, 10].find((n) => n < 0);  // -5
[1, 4, -5, 10].find(function(value, index, arr) {
    return value > 9;
}); // 10
```
上面代码中，`find`方法的毁掉函数有3个参数，依次为当前值，当前位置和原数组。
`.findIndex()`方法和`find`方法类似，返回第一个符合条件的成员的位置，如果找不到，返回`-1`；
```javascript
[1, 5, 10, 15].findIndex((n) => value > 9); // 2
```
另外这两个方法都可以发现`NaN`，弥补了数组的`indexOf`方法的不足；
```javascript
[NaN].indexOf(NaN); // -1
//可以记住Object.is 方法做到
[NaN].findIndex((y) => Object.is(NaN, y)); // 0
```
这两个方法可以接受第二个参数，用来绑定回调函数的`this`对象。
- 数组实例的fill()
使用给定值，填充一个数组。
```javascript
['a', 'b', 'c'].fill(7); // [7, 7, 7]
new Array(3).fill(7);
```
`.fill()`用于数组的初始化非常方便；数组中已有的元素会被全部抹去。
`.fill()`还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。
```javascritp
['a', 'b', 'c'].fill(7, 1, 2); // ['a', 7 ,'c']
```
- 数组实例的entries(), keys()和values()
这三个方法用于遍历数组，它们都返回一个遍历器对象（见Iterator[ɪtə'reɪtə]），可以用`for...of`循环遍历，`keys()`返回键名遍历器，`values()`返回键值遍历器，`entries()`返回键值对遍历器；
```javascript
let lst = ['a', 'b'];
for (let index of lst.keys()) {
    console.log(index);
} // 0, 1
for (let value of lst.values()) {
    console.log(value);
} //a, b
for (let [key, value] of lst.entries()) {
    console.log(key, value);
} // 0 'a', 1 'b'
```
不使用`for...of`循环，可以手动调用遍历器对象的`next`方法进行遍历。
- 数组实例的includes()
该方法属于ES7，返回一个布尔值，表示数组是否包含给定的值。和字符串的`includes()`方法类似。
```javascript
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, NaN].includes(NaN); // true
```
该参数的第二个参数表示搜索的其实位置，默认为0，如果为负数则表示倒数的位置。
```javascript
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```
`indexOf`方法有两个缺点，一不够语义化，二内部使用严格相等运算符（===），会导致对`NaN`的误判；
```javascript
[NaN].indexOf(NaN); // -1
[NaN].includes(NaN); // true
```
- 数组的空位
数组的空位指的是数组的某个位置没有任何值，注意空位不是`undefined`，空位是没有任何值。

# 函数的扩展
- 函数参数的默认值
ES6 允许在定义函数时给参数指定默认值。
    + 基本用法
    ```javascript
    function add(x, y = 2) {
        return x + y;
    }
    add(1, 12); // 13
    add(1); // 3
    ```
    + 与解构赋值默认值结合使用
    ```javascript
    function foo({x, y = 5}) {
        console.log(x, y);
    }
    foo({}); // undefined, 5
    foo({x: 1}); // 1, 5
    foo({x: 1, y: 2}) // 1, 2
    foo(); //TypeError
    ```
- rest参数
ES6引入rest参数（形式为`...变量名`），用于获取函数多余参数，这样就不需要使用`arguments`对象。
```javascript
function add(...val) {
    let sum = 0;
    for (var v of val) {
        sum += v;
    }
    return sum;
}
add(2, 5, 3); // 10
```
rest参数中的变量代表一个数组，所有数组的方法都可以用于该变量；
**注意：rest参数之后不能再有其他参数，否则会报错**
- 扩展运算符
扩展运算法是三个点`...`，它好比rest参数的逆运算，将一个数组转为用逗号分隔的**参数序列**。
```javascript
console.log(...[1, 2, 3]);  // 1 2 3
//相当于
console.log(1, 2, 3); // 1 2 3
[...document.querySeletorAll('div')] // [<div>, <div>, <div>]
```
该运算主要用于函数调用
```javascript
function add(x, y) {
    return x + y;
}
add(...[4, 38]);  // 42
// 相当于
add(4, 38); //42
```
上面`add(...[4, 38])`都是函数的调用，都是用了扩展运算符。该运算符将一个数组，变成参数序列。
----
代替数组的apply方法
由于扩展运算符可以展开数组，所有不在需要`apply`方法，将数组转换为函数的参数了。
```javascript
function f(x, y, z) {
    // ...
}
var args = [0, 1, 2];
//ES5
f.apply(null, args);
//ES6
f(...args);
```
- name属性
- 箭头函数
- 函数绑定
- 尾调用优化
- 函数参数的尾逗号

# 对象的扩展
- 属性的简洁表示法
- 属性名表达式
- 方法的name属性
- Object.is()
- Object.assign()
- 属性的可枚举性
- 属性的遍历
- \_\_proto\_\_属性，Object.setPrototypeOf()，Object.getPrototypeOf()
- 对象的扩展运算符
- Object.getOwnPropertyDescriptors()
