[Learning Javascript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)

# 什么是模式

模式一个可再次使用的解决方案，可以应用到软件设计中通常遇到的问题，比如我们的例子 - 编写Javascript web应用。另外一个角度看模式像是一个如何解决问题的模板 - 一种可以用于很多不同情境下。

那么，为什么理解并精通模式很重要？设计模式有三大优势：

- **模式已被证明的解决方案**：它们提供无缝隙的手段去解决软件开发中问题，使用已证明的技术，这些技术反映出为了帮助定义它们而被带入模式中的开发者的经验和洞察力。
- **模式可以很容易的重复使用**：一种模式通常体现为超出我们自己需求的解决方式。这种特性使得它相当强壮。
- **模式可以被描述**：当我们看一个模式时，通常对当前的解决方案会有一组数据结构和词汇表，来帮助优雅地表达一些大的解决方案。

模式**不是**一个准确的解决方案。理解模式仅仅是提供我们一个解决方案体系的角色是很重要的。模式没有解决所有的设计问题，也没有代替好的软件设计者，仅仅只是支持他们。接下来在看一些模式带来的优势优点。

- **可重复利用的模式帮助避免在软件开发进程中会引起重大问题的细小issues**。怎么理解？当我们的编码建立在一个被证实的模式上，我们只需花更少的时间来担心我们代码的构造，花更多时间关注于整个解决方案的品质。这是因为模式支持我们在一个高组织化，高结构化的方式中编码，避免在未来为了整洁而重构代码。
- **模式提供全面化的解决方案，以一种不需要绑定在特定问题上的方式**。这种全面性的探讨意味着不需要太关注我们工作用的应用（大多数是编程语言），设计模式可以被应用于提升我们代码的结构。
- **准确的模式事实上会通过避免代码重复减少整个文件大小占用空间**。鼓励开发人员更关注于解决方案，立即减少重复区域，例如将一些执行相似流程的方法合并为一个全面的函数，代码的大小将被减小，同时也会使得我们代码更加*DRY*
- **模式加入开发者的词汇表中，使得沟通更加快捷**
- **频繁使用的模式，通过利用集体的经验来改良，其他的开发者使用这些模式然后回馈给设计模式社区**。在一些情形下会产生新的设计模式，同时在其他情形下会产生特定的模式如何最好的使用改良指导。这样可以确保基于设计模式的解决方案也许比那些专门的解决方案能够继续变得更加强壮。

经常使用的模式可以通过利用其他开发人员使用这些模式对设计模式社区作出贡献的集体体验随着时间的推移而改善。 在某些情况下，这将导致创建全新的设计模式，而在其他情况下，它可以导致为如何最好地使用特定模式提供改进的指导。 这可以确保基于模式的解决方案继续变得比特定解决方案更强大。

## 我们每天都能使用到模式

为了理解模式是多么的有用，来一起看一个非常简单的元素选择问题，使用jQuery库来解决。

假设我们有一段脚本在页面中找到每个带有`foo`类样式的DOM元素，想增加一个计数器。最有效的方式去查询这样一个元素的集合是什么？好吧，有以下几种方式来解决：

1. 筛选页面上所有的元素并保存它们的引用。接着，使用正则表达式过滤这个集合仅保存带有`foo`类样式的元素。
2. 使用现代原生浏览器的特性函数，如`querySelectorAll()`来筛选带有`foo`类样式的元素。
3. 使用原生特性函数，如`getElementsByClassName()`类似的返回期望的集合。

So，这些选项中那个是最快的？通过8-10次比较反感显然是选项3。在现实应用，方案3不能再低于IE9下工作，于是在方案2和方案3都不支持时就需要使用方案1。

然而，开发者在使用jQuery时就不需要担心这个问题了，使用虚包模式（Facade Pattern）对我们来说是抽象的方式。我们后面再看更多细节，这种模式提供一组抽象接口（例如：`$el.css()`，`$el.animate()`）给若干更加复杂但基础的代码，正如我们看到的，这意味着更少的时间去考虑实现层面的细节。

场景的背后，类库简单的操作给出最优的处理方式来选择元素，基于我们当前浏览器支持什么，我们只需要考虑抽象层。

我们大概所有人已推同样精通使用jQuery的`$("selector")`。这很显然非常容易来完成选择页面上要选择的HTML元素，相比较手动判断选择该使用`getElementById()`，`getElementsByClassName()`，`getElementByTagName`或者其他要简单容易太多。

尽管我们知道`querySelectorAll()`在视图解决这个问题，比对使用jQuery虚包模式和我们自己来选择最优的选择方式所需的工作量，就没有可比性！这就是使用模式抽象提供给真实世界的价值。

# “模式”性测试，原型模式 以及三个规则

记住不是所有的计算步骤，最好的技术或者解决方法的描述就能被认为是一个完整的模式。可能有一些关键的组成部分是确实的，模式社区通常对一些主张成为一种模式都非常谨慎，除非它已经通过重大的审查。即使是一些呈现给我们满足一个模式的标准，它也不会被考虑是一种模式，直到它经理过合适的审查阶段并且被其他测试过。

再回看上面Alexander的工作，他主张一种模式应该是一个过程并且是一个“事物”。这个定义意图上不够锐利，因此后面他接着说模式是一个可以创造“事物”的过程。这就是为什么模式通常关注于处理一个视觉上可确认的结构，比如我们应该能从视觉上描述（或者画出）一张将模式放入实践中产生结果的结构的描述图。

在学习设计模式中，遇到术语“proto-pattern”不是没有规律的。这是什么呢？一种模式在还没有被知道通过“模式”性测试，通常被称为原型模式（proto-pattern）。
尚未知道通过“模式”性测试的模式通常被称为原型模式

# Javascript中的设计模式

- Constructor Pattern 构造模式
- Module Pattern 模块模式
- Revealing Pattern 揭秘模块模式
- Singleton Pattern 单例模式
- Observer Pattern 观察员模式
- Mediator Pattern 中介者模式
- Prototype Pattern 原型模式
- Command Pattern 命令模式
- Facade Pattern 外观模式
- Factory Pattern 工厂模式
- Mixin Pattern 混合模式
- Decorator Pattern 装饰模式
- Flyweight Pattern 享元模式（羽量级模式）

# Constructor Pattern 构造函数模式

创建对象

```javascript
//以下三种方式都可以创建一个新的对象
var newObject = {};
//or
var newObject = Object.create(Object.prototype);
//or
var newObject = new Object();
```

- 在上面的例子中 Object.create() 可用作对象的继承
- Object的构造函数如果传入对象，新对象将包含传入的对象，如果不传值，那么将创建并返回一个空对象；

Where the "Object" constructor in the final example creates an object wrapper for a specific value, or where no value is passed, it will create an empty object and return it.
在最后一个例子的Object的构造函数会创建一个特定值的对象包装，只不过这里没有传值，所以创建一个空对象并返回；

有以下四种方式为对象添加键值对属性

```javascript
//ECMAScript 3 兼容
//1.点语法
newObject.someKey = 'Hello World';
var value = newObject.somekey;
//2.方括号语法
newObject['someKey'] = 'Hello World';
var value = newObject['someKey'];
//仅ECMAScript5 兼容 参见1
//3. Object.defineProperty
Object.defineProperty(newObject, "someKey", {
    value: "Hello World",
    writeable: true,
    enumerable: true,
    configurable: true
});
//4. Object.defineProperties
Object.defineProperties(newObject, {
    "someKey": {
        value: "Hello World",
        writeable: true
    },
    "anotherKey": {
        value: "shot",
        writeable: false
    }
});
```

[参见1](http://kangax.github.com/es5-compat-table/)

就像本文后面会看到的，这些方法甚至可以被继承，如下：

```javascript
var defineProp = function(obj, key, value) {
    var config = {
        value: value,
        writeable: true,
        enumerable: true,
        configurable: true
    };
    Object.defineProperty(obj, key, config);
}
//person对象
var person = Object.create(Object.prototype);
defineProp(person, "car", "BMW");
defineProp(person, "birthDay", "160511");
defineProp(person, "hasBeard", false);

//创建一个继承person的赛车手对象
var driver = Object.create(person);
defineProp(driver, "topSpeed", "100mph");
console.log(driver.birthDay); //160511
console.log(driver.topSpeed); //100mph
```

## Basic Constructors 基本构造函数

**Javascript**不支持类的概念，但支持在对象工作时指定构造函数；通过在调用构造方法前加一个简单的前缀`new`，告诉Javascript这个方法有构造方法的行为，并且创建一个包含其本身定义的成员对象的实例；

在构造方法内，关键字`this`引用的时新创建对象本身。回到对象创建，一个简单的构造方法如下：

```javascript
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
    this.toString = function() {
        return this.model + " has done " + this.miles + " miles";
    }
}

var civic = new Car("Honda Civic", 2009, 20000);
var mondeo = new Car("Ford Mondeo", 2010, 5000);

console.log(civic.toString());
console.log(mondeo.toString());
```

上面是构造函数模式的简单应用，但是它会引起一些问题，一是它会让继承比较难，在一个是在使用Car的构造函数构造每一个新对象时会重新定义如toString这样的函数，对于功能最好应该是Car类型所有的实例之间都共享，这不是最好的方式；

## Constructors With Prototype 带原型的构造方法

像大多数Javascript对象，都包含一个`prototype`对象，当我们调用一个构造函数创建对象时，构造函数的原型包含的所有属性都在新的对象中可以访问，这种特性，创建多个Car对象可以访问相同的原型；

```javascript
function Car(model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
}
//这里使用Object.prototype.newMethod，而不是Object.prototype是为了防止prototype对象被重新定义
Car.prototype.toString = function () {
    return this.model + " has done " + this.miles + " miles";
};
var civic = new Car("Honda Civic", 2009, 20000);
var mondeo = new Car("Ford Mondeo", 2010, 5000);
console.log(civic.toString());
console.log(mondeo.toString());
```

# The Module Pattern 模块模式

## 模块

模块是在任意强壮的应用中的一个完整的块，在一个项目中帮助保持代码单元干净无论是分离或者组织。

在Javascript中有以下几种方式来实现模块；

- 模块设计模式
- Object literal notation 对象的字面量
- AMD模块
- CommonJS模块
- ECMAScript Harmony 未来模式

我们会在本书的 现代模块化js设计模式 中探索后面三个。

模块模式基于一个对象字面量

## 对象字面量模式

在这种模式下，对象被一组包含在{}中的键值对来描述；对象中的key冒号后面可以是字符串也可以是一个标识符。最后一对键值对后面不应该有逗号，这样有可能导致错误；

```javascript
var myObjectLiteral = {
    variableKey: variableValue,
    functionKey: function() {

    }
};
```

对象字面量不需要使用new操作符进行实例化，但是不能用在一个结构体的开始使用，因为以`{`开头说明是一块结构的开始。在对象的外面，新的成员可以使用这样的语法结构来添加`myModule.property = "someValue";`。

一个完整的对象字面量模块实例：

```javascript
var myModule = {
    //对象字面量可以包含属性和方法
    //例如我们可以定义一个对象作为模块的配置
    myConfig: {
        useCaching: true,
        language: "en"
    },
    //简单的方法
    saySomething: function() {
        console.log("balabalabala...");
    },
    //输出当前配置的一个值
    reportMyConfig: function() {
        console.log("Caching state: " + this.myConfig.useCaching);
    },
    //重写当前配置
    updateMyConfig: function(newConfig) {
        if (typeof newConfig === "object") {
            this.myConfig = newConfig;
        }
    }
};

//usage:
myModule.saySomething();
myModule.reportMyConfig();
myModule.updateMyConfig({language: "zh", useCaching: false});
```

使用对象字面量模式可以帮助组织和封装你的代码；

## The Module Pattern 模块模式

模块模式最初是传统软件开发中一种对类进行私有和共有定义的封装方式；

在Javascript中，模块模式是用来进一步模拟类的概念，已一种方式使我们可以包含公有/是有方法和变量在一个单一的对象中，从全局的范围中保护特定的部分。
What this results in is a reduction in the likelihood of our function names conflicting with other functions defined in additional scripts on the page.
这种结果减少当前页面上附加的脚本中定义的方法名冲突的可能性。

### Privacy 隐私

模块模式通过使用闭包来封装“隐私”，状态和组织。它提供一种方式用来包装混合公有和私有的方法和变量，防止泄露到全局范围或者意外地于其他开发者接口冲突。使用这种模式，只有一个公共API被返回，保持闭包内部的其他为私有的。

这样就提供我们一个干净的解决方案屏蔽复杂的业务逻辑，同时只暴露一个接口我们想让我们程序其他部分要调用。这种模式很像立即执行函数表达式（详见[命名空间模式](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)），除了返回的是一个对象而不是一个函数。

需要注意的是在javascript中没有真正意义上的“隐私”，因为不像其他传统的语言，它没有访问修饰符（access modifiers）。变量无法技术上定义为公有或私有，我们使用函数作用域来模拟这种语法。在模块模式内，变量或者方法定义为只有从模块自己内部可以访问。变量和方法定义在返回对象内，对于任何都是可以访问的。

通过自包含来创建模块

```javascript
var testModule = (function() {
    var counter = 0;
    return {
        //incerment 增量
        incermentCounter: function() {
            return counter++;
        },
        resetCounter: function() {
            counter = 0;
        }
    };
})();
//Usage:
testModule.incermentCounter();
testModule.resetCounter();
```

其他部分的代码是不可以直接读取incermentCounter或resetCounter的值；变量counter完全从全局变量中分离出来，仅作为一个私有变量 - 它的生命周期仅存在模块的闭包中，所以只有定义的两个方法可以访问它；方法也存在有效的命名空间在代码的测试区域，我们需要在访问前面添加模块的名称来访问方法；

使用模块模式，我们发现在开始定义一个简单的模板是很有用的，它包括命名空间，公有和私有变量：

```javascript
var myNameSpace = (function() {
    var myPrivateVar, myPrivateMethod;
    //一个私有计数器变量
    myPrivateVar = 0;
    //一个输出任何参数的私有方法
    myPrivateMethod = function(foo) {
        console.log(foo);
    }

    return {
        //公有变量
        myPublicVar: "foo",
        //调用私有元素的公有方法
        myPublicFunction: function(bar) {
            //私有变量自增
            myPrivateVar++;
            //调用私有方法
            myPrivateMethod(bar);
        }
    };
})();
```

下面的例子是使用模块模式实现一个购物篮，模块本身通过一个自包含返回到一个全局变量`basketModule`，模块中的数组`basket`保持私有而且应用其他的部分也不能直接读取它，它只存在于当前模块的闭包中，所以可以访问的的方法都是和它在同一个作用域范围。（例如：`addItem()`，`getItemCount`等）

```javascript
var basketModule = (function() {
    var basket = [];
    function doSomethingPrivate() {

    }
    function doSomethingElsePrivate() {

    }
    //返回一个暴露的(exposed)共有对象
    return {
        //添加商品到篮子
        addItem: function(values) {
            basket.push(values);
        },
        //获取篮子中商品数量
        getItemCount: function() {
            return basket.length;
        },
        //执行私有方法 私有方法的公有别名
        doSomething: doSomethingPrivate,
        //获取篮子中商品总价
        getTotal: function() {
            var q = this.getItemCount(), p = 0;
            while(q--) {
                p += basket[q].price;
            }
            return p;
        }
    }
});
```

在模块内部，我们注意到返回了一个对象，它自动分配(assign)给了`basketModule`，所以我们可以如下操作(interact 互动，相互作用)；

```javascript
basketModule.addItem({item: "bread", price: 0.5});
basketModule.addItem({item: "butter", price: 0.3});

console.log(basketModule.getItemCount());
console.log(basketModule.getTotal());
//undefined
//因为basket本身没有暴露(expose)到公有API的部分
console.log(basketModule.basket);
//undefined
//同样不能工作，因为basket本身仅存在于我们定义的baseModule闭包(closure)中，不在返回的公有对象中
console.log(basket);
```

上面的方法的有效命名空间都在 `basketModule` 内。

Notice how the scoping function in the above basket module is wrapped around all of our functions, which we then call and immediately store the return value of.
注意，上面购物篮模块中域函数时如何封装我们所有的方法，然后我们如何调用，并且立即存储返回值的；这里有以下几个特点包括：

- 很灵活的去定义只有我们的方法可以调用的私有方法和私有成员。因为他们没有暴露给页面的其他部分（只有我们导出的API是），它们是真的私有成员；
- 给出的方法是被正常定义的并且命名的，这样很容易在调试时看到访问堆栈，可以发现是哪个方法抛出异常
- 就像T.J Crowder之前指出，这样可使我们依赖环境返回不同的方法。在以前，我发现一些开发者使用这个方法进行UA测试，目的是提供一个代码路径在他们指定给IE的模块中，但是我们现在能便捷的选取特征检测达到一个相同的目标。(As T.J Crowder has pointed out in the past, it also enables us to return different functions depending on the environment. In the past, I've seen developers use this to perform UA testing in order to provide a code-path in their module specific to IE, but we can easily opt for feature detection these days to achieve a similar goal.)

### 模块模式变种

#### 导入混合

这种模式变种演示了如何全局变量（例如jQuery, Underscore）被作为一个参数传入我们模块的匿名方法。有效的允许我们导入它们并且按照我们意愿使用本地的别名。

```javascript
var myModule = (function (jQ, _) {
    function privateMethod1() {
        jQ(".container").html("test");
    }
    function privateMethod2() {
        console.log(_.min([10, 5, 100, 2, 1000]));
    }
    return {
        publicMethod: function() {
            privateMethod1();
        }
    };
})(jQuery, _);

myModule.publicMethod();
```

#### 导出

这种变化允许我们定义全局变量而不销毁它们，同时类似的支持最后一个例子中看到的全局导入的想法。

```javascript
var myModule = (function() {
    var module = {},
        privateVariable = "Hello World";    
    function privateMethod() {
        // ....
    }
    module.publicProperty = "Foobar";
    module.publicMethod = function() {
        console.log(privateVariable);
    };
    return module;
});
```

### 优点

我们了解了为什么构造器模式很有用，但是为什么模块模式是一个好的选择？对于新手来说，模块模式对于有面相对象开发背景的开发者比真实封装的想法更清晰，至少是从Javascript的观点来看。

其次，它支持私有数据 - 在模块模式中，我们代码的公共部分可以接触到私有的部分，然而，外面的世界是无法接触到类的私有部分的。

### 缺点

模块模式的缺点是当我们访问公有和私有成员是不同时，我们想要改变可视度，我们通常不得不改变每一个使用该成员的地方。

**我们同样不能在一个后面某个时间点加入到对象的方法中访问私有的成员。**就是说，在大多数情况下当使用得当时模块模式还是相当有用的，当然有提升我们应用结构的潜力。

其他的缺点包括无法给私有成员创建自动单元测试，当bug需要热修复是增加了复杂度。给私有的打补丁是不可能的。必须重载所有与有问题的私有成员有关联的公共方法。开发者同样不能简单的扩展私有成员，所以需要记住私有成员不像他们出现时那么的可扩展有柔韧性。

## The Revealing Module Pattern 泄露模块模式

现在我们对模块模式有一定了解了，接下来看一个小小的改进版本 - Christian Heilmann的泄露模块模式。

泄露模块模式是因为Heilmann在发现一些事实后很失望从而产生出来的，当我们想要从其他地方访问公共方法或者公共变量时，不得不重复主对象的名称。同时他也不喜欢模块模式的必备物，为了要公共一些变量或函数不得不切换到对象的字面量表示法。

他想尝试的结果是一种更新模式，我们只要简单的在私有的范围定义好我们所有的函数和变量，然后返回一个匿名对象包含一些我们想要公共出去的私有功能的指向。

栗子：

```javascript
var myRevealingModule = (function() {
    var privateVar = "Ben Cherry",
        publicVar = "Hey there!";
    function privateFunction() {
        console.log("Name: " + privateVar);
    }
    function publicSetName(strName) {
        privateVar = strName;
    }
    function pulbicGetName() {
        privateFunction();
    }
    // 泄露私有函数和属性的公共指向
    return {
        setName: publicSetName,
        greeting: publicVar,
        getName: publicGetName
    }
})();

myRevealingModule.setName("Paul Kinlan");
```

这种模式也支持为你想要泄露出去的私有方法或属性起以你你想要的名称：

```javascript
var myRevealingModule = (function() {
    var privateCounter = 0;
    function privateFunction() {
        privateCounter++;
    }
    function publicFunction() {
        publicIncerment();
    }
    function publicIncrement() {
        pirvateFunction();
    }
    function publicGetCount() {
        return privateCounter;
    }
    // 泄露私有函数或属性的公有指向
    return {
        start: publicFunction,
        incerment: publicIncerement,
        count: publicGetCount
    }
})();

myRevealingModule.start();
```

### 优点：

这种模式使得我们脚本的语法更加协调。同时它更加清晰，我们可以在模块的最后看到模块有那些公有函数和属性可以被访问，更有可读性。

### 缺点：

一个缺点是，如果一个私有函数引用一个共有函数，那么如果需要一个补丁时，这个公有函数将不能被取代。因为私有函数会继续指向私有实现的方法，而这种模式不会应用到公有的函数成员。

引用了私有变量的公有的对象成员同样受上面的不能使用补丁规则的影响。

因为这个原因，使用泄密模式创建的模块可能比那些使用原始的模块模式创建的模块更加脆弱，所以再使用时请注意。

# 单例模式 The Singleton Pattern

单例模式因为会限制一个只能实现一个单一对象而被熟知。传统的，单利模式这样实现，创建一个类，含有一个当不存在时创建一个该类新实例的函数，当实例存在时，只是简单的返回这个实例的引用即可。

单例与静态类（或对象）不同，我们可以延迟它们的初始化，一般来说在初始化阶段，它们需要的一些信息是不可访问的。它们不提供一种方式给代码，无法察觉到之前它们的引用并很容易找回它们。这是因为它不是被单例返回的对象或者“类”，它只是一个结构。思考下为什么闭合变量不是真正意义上的闭合 - 函数作用域提供的闭包才是闭包。

在Javascript中，单例服务作为一个共享资源命名空间，从公共命名空间分离实现代码，提供函数访问的一个单一的点。

栗子：

```javascript
    var mySingleton = (function() {
        // 实例存储一个指向单例的引用
        var instance;
        function init() {
            // 单例
            // 私有方法和变量
            function privateMethod() {
                console.log("I am private");
            }
            var privateVariable = "I'm also private";
            var privateRandomNumber = Math.random();
            return {
                // 公有方法和变量
                publicMethod: function() {
                    console.log("The public can see me!");    
                },
                publicProperty: "I'm also public",
                getRandomNumber: function() {
                    return privateRandomNumber;
                }
            };
        };
        
        return {
            // 获取单例实例如果不存在则创建一个
            getInstance: function() {
                if (!instance) {
                    instance = init();
                }
                return instance;
            }
        }
    })();
```
