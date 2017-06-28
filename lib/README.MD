有使用中的问题或者发现bug欢迎反馈 :-p

QQ：[![反馈反馈..](http://wpa.qq.com/pa?p=2:2521428188:51)](http://wpa.qq.com/msgrd?v=3&uin=2521428188&site=qq&menu=yes)

# CHANGELOG

**2016-7-16**
- @add: 在运行`run()`方法时可以传入参数给第一跳函数可用作初始化操；见[.run()](#tc-asyncfun/function/run)

**2016-7-13**
- @add: 在运行下一跳方法时传入上一跳的返回值；见[.then()](#tc-asyncfun/function/then)部分

# INSTALL

`npm install tc-asyncfun --save`

# CHAINING

- `.level([log|throw]|fn)` 遇到异常时的处理方式
- `.then(fn)` 用来添加next step方法
- `.fork(ob)` 用来添加分叉next step方法 - **new**
- `.run([args])` 用来开始运行队列方法

## FUNCTION

### `new asyncFun(fn, [context])` 

> 运行构造函数创建对象时，可以传入第一跳的方法，并可以指定运行的上下文`context`

#### Sample

```javascript
var a = new asyncFun(function(next, err) {
    console.log(this); // jquery对象
}, jQuery);
a.run();
```

----

### `.level('log'|'throw'|fn)` 

> 可以传递字符串`log`或者`throw`作为参数；默认为throw模式

- log模式将调用`console.error`方法，不支持`console`对象的直接`alert`
- throw模式在遇到错误时会终止后续执行代码，抛出异常；

> 方法的参数也可以是一个方法，用来自定义异常处理方法

#### Sample

```javascript
var a = new asyncFun(function(next, err) {
    //.....
    err(1);
    next();
});
a.level(function(s) {
    if (s == 1) {
        //...
    } else if (s == 2) {
        //....
    }
}).then(function(n, e) {}).run();
```

----

### ~~`.then(fn)`~~
### <a name="tc-asyncfun/function/then">`.then(fn, ctxt)`<a/>

> 用来添加下一跳的方法，方法有三个参数 next, err, retn

> 2016-7-13更新：添加第三个参数retn用来给下一跳传递上一跳的返回值；之前只能通过asyncFun的实例参数获取上一跳的返回值；现在可以直接在方法中接受这个返回值了（第三个参数）

> 2017-5-10更新：支持在`then`时就指定运行上下文，上下文符合就近原则，上一个方法调用`next(data, ctxt)` > `then(fn, ctxt)` > `asyncFun构造函数`传入的ctxt


#### Sample

```javascript
function someFn (next, err) {
    $.ajax({url: '/somedata.json', 'success': function(data) {
        next(data);
    }, 'error': function(err) {
        err("获取somedata异常..");
        next();
    }})
}
function someFn2(next, err, retn) {
    console.log(retn); //{....}
}
var a = new asyncFun(someFn);
a.level('log')
.then(someFn2)
.then(function(n, e) {}, someObj)
.run();
```

**注** 在上面的例子中当请求异常时，会调用`err(...)`方法，如果`.level()`是 *log* 模式，则会在控制台输出异常信息后，继续执行下一跳`next()`方法；如果是 *throw* 模式怎会抛出异常并停止运行下面的方法；

### ~~`.fork(object)` **new**~~
### <a name="tc-asyncfun/function/fork">`.fork(object, ctxt)`</a> **new**

> 用来添加分叉下一跳

> 2017-5-10更新：指定上下文，参看`then(fn, ctxt)`部分的说明

#### Sample

```javascript
var a = new asyncFun(false, this);
a.then(function(n, e, d) {
    console.log('balabala...');
    if (d.type == 1) {
        next({flag: 'check', data: d.data})
    } else {
        next({flag: 'find', data: d.data});
    }
});
a.fork({
    check: function(n, e, d) {
        console.log(111); n();
    },
    find: function(n, e, d) {
        console.log(222); n();
    }
}).fork({
    a: function(n, e, d) {},
    b: function(n, e, d) {}    
}, someObj);
a.run();
```

### <a name="tc-asyncfun/function/run">`.run([args])`</a>

>开始运行方法队列；enjoy~

2016-7-16更新：可以给`run()`传入参数，这些参数将传入第一跳的方法中，第一个参数和第二个参数还是`next`, `err`，后面的参数为`run()`传入的参数

#### Sample

```javascript
function firstFn(next, err, arg1, arg2, arg3) {
    console.log(arg1, arg2, arg3);  // 1, 2, 3
    //dosomething...
    next();
}
var a = new asyncFun(fistFn);
a.run(1, 2, 3);
```

----

所有需要运行的下一跳方法运行时都会传递两个方法参数，`next` 和 `err`；

### `next(retn, context)`

> 该方法有两个参数，在运行方法中可通过`retn`将参数传递到下一跳的方法中<del>，在下一跳方法中通过实体的`.retn`属性获取</del>；`context`为指定下一跳方法的运行上下文；

> 2016年7月13日更新：也可以直接通过方法的第三个参数来获取返回值；参见[.then(fn)](#then)部分

> 2017-6-28更新：next函数支持指定指令，目前支持`_cacheset(key, value)`，`_cacheget(key, default)`，`_cacherm(key)`，`_cacheclean()`，用于缓存数据；也可以通过asyncFun实例的cache对象来操作缓存`.cache[.(set|get|rm|clean)(key, value)]`...

#### Sample

```javascript
import 'asyncFun';
var a = new asyncFun(function(next, err) {
    console.log(this);  //jquery对象
    next({top: 100, left: 100}); // <- 这里给下一跳传递参数
}, jQuery);  // <- 这里有给第一跳指定上下文
a.then(function(next, err) {
    console.log(a.retn); //{top: 100, left: 100}
    console.log(this); //jquery对象, 如果上一跳未指定上下文，则使用之前指定的上下文
    next();  // <- 这里没有给返回值
}).then(function(next, err) {
    console.log(a.retn); // null
    console.log(this); //jquery对象
	next("_cacheset", "data", {a: 123}); // 缓存数据 data
    next(123, {a: function(m){console.log(m)}});  //<-这里改变上下文
}).then(function(next, err) {
    console.log(a.retn); // 123
    console.log(this); // {a:....}  上一跳改变了上下文
	var data = next("_cacheget", "data", {}); // 获取缓存数据 data 如果没有值则为 {}
    this.a('hahahah....'); // hahahah...
}).run();
```

### `err('msg')`

> 错误或异常处理。

# USAGE

```javascript
import afun from 'asyncFun';
var a = new afun(function(next, err){
    //do something....
    /*if (hasErr === true) {
        err("Error message...");
    }*/
    next();
});
a.then(function(next, err) {
    //do something...
    next();
}).then(function(next, err) {
    //do something...
    next();
}).run();
```

### `.cache.[set|get|rm|clean]`

> 运行中缓存临时数据

`.cache.set(key, value)` 缓存一个key值

`.cache.get(key, [default])` 获取key值，没有则返回default值

`.cache.rm(key)` 删除一个key值

`.cache.clean()` 清空缓存

```javascript
import afun from 'asyncFun';
var a = new afun(function(next, err){
    a.cache.set("data", {a: 123});
    // equal
    // next("_cacheset", "data", {a: 123});
    next();
});
a.then(function(next, err) {
    //do something...
    next();
}).then(function(next, err) {
    var data = a.cache.get("data", []);
    //equal
    // var data = next("_cacheget", "data", []);
    //do something...
    next();
}).run();
```
