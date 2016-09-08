#Javascript中的设计模式

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

##Basic Constructors 基本构造函数

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
Car.prototype.toString = function(0 {
    return this.model + " has done " + this.miles + " miles";
});

var civic = new Car( "Honda Civic", 2009, 20000 );
var mondeo = new Car( "Ford Mondeo", 2010, 5000 );
 
console.log( civic.toString() );
console.log( mondeo.toString() );
```

# The Module Pattern 模块模式

在Javascript中有以下几种方式来实现模块；
- 模块设计模式
- Object literal notation 对象的字面量
- AMD模块
- CommonJS模块
- ECMAScript Harmony 未来模式

## 对象字面量模式

在这种模式下，对象被一组包含在{}中的键值对来描述；对象中的key冒号后面可以是字符串也可以是一个标识符。最后一对键值对后面不应该有逗号，这样有可能导致错误；

```javascript
var newObject = {
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

#The Module Pattern 模块模式

模块模式最初是传统软件开发中一种对类进行私有和共有定义的封装方式；

What this results in is a reduction in the likelihood of our function names conflicting with other functions defined in additional scripts on the page.
这种结果减少当前页面上附加的脚本中定义的方法名冲突的可能性

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