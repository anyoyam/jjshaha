# 概述

## Redux 要点

- 应用的所有状态全部存储在一个单一`store`的对象树中；
- 改变状态树的唯一方法是触发`action`（描述要发生什么的对象）；
- 指明`action`如何改变状态树，需要一个纯`reducers`；

## reducer

reducer一个带有`(state, action) => state`特征的纯函数。
描述了一个`action`如果从一个state变为另一个state；

`state`的形态有你决定（is up to you）：可以是一个主数据类型(primitive)
，一个数组，一个对象或者是一个 Immutable.js（该类库会产生一个冻结对象） 数据结构。唯一要重要的部分是你不能改变状态对象，但是可以当对象改变时返回一个新对象。

下面的例子中，使用了`switch`语句和字符串，你也可以使用一个helper，根据不同的约定（比如方法映射）来判断，只要使用你的项目(makes sense for说得通)。

```javascript
function counter(state = 0, action) {
    switch (action.type) {
        case 'INC':
            return state + 1;
        case 'DEC':
            return state - 1;
        default:
            return state;
    }
}
```

## Store

创建一个Redux store控制应用的状态
它包含了一下的接口 `subscribe`，`dispatch`，`getState`

```javascript
let store = createStore(counter);
```

`subscribe()` 用来在state改变时更新UI响应state的变化。
通常使用视图绑定类库(比如 react redux)好过直接使用`subscribe()`。
而且还很方便打将当前state持久化到`localStorage`

```javascript
store.subscribe(() => {
    console.log(store.getState());
});
```

唯一可以改变内部state是dispatch(调度)一个action。
action可以被序列号，日志记录，存储并重复调用。

```javascript
store.dispatch({type: 'INC'}); // 1
store.dispatch({type: 'INC'}); // 2
store.dispatch({type: 'DEC'}); // 1
```

代替直接改变state，你明确了你想要发生的变化通过一个叫做action的普通对象。然后写一个特殊的叫做reducer的方法来决定每个action如何改变程序的整个state。

# 基本用法

## Action

**Actions**是从应用发送到store的信息的有效装载。它们是给store信息的唯一来源。可以通过使用`store.dispatch()`来将他们发送到store。

```javascript
const ADD_TODO = 'ADD_TODO';
{
    type: ADD_TODO,
    text: 'Build my first redux app'
}
```

Action是一个普通的Javascript对象。Action必须有一个`type`属性，用来标识要执行动作的类型。Type往往被定义成一个不变的字符串。当应用很大时，可以将它们写到一个独立的模块中。

```javascript
import {ADD_TODO, REMOVE_TODO} from './actionTypes';
```

>[FSA (Flux Standard Action)](https://github.com/acdlite/flux-standard-action)
>```javascript
>{
> type: 'ADD_TODO',
> payload: {
>   text: 'Do something.'
> }
>}
>```
>Action 必须有type属性，error，payload，meta是可选属性。`{type: ..., [error: ...,][payload: ...][meta: ...]}`
>**type** 一个action的type定义了用户要发生动作的本质。两个相同`type`的action必须要能全等（===），`type`通常是一个不变的字符串或一个Symbol。
>**payload** 一个可以是任何数据类型的可选属性。用来描述action的有效装载。可以是任何不是`type`或者action状态的数据。
>根据约定，如果`error`属性被设置为`true`，那么`payload`必须是一个error对象，这个与用一个error拒绝一个Promise执行相似。
>     **error** 一个可选属性，用一个action描述一个错误。
>**meta** 一个可选属性，用来存放不属于`payload`的扩展信息。
>以上是对一个Flux标准动作的定义。

### Action创造器

```javascript
function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}
```

传统的Flux action创建器往往会在执行时触发dispatch，像这样：

```javascript
function addTodoWithDispatch(text) {
    const action = {
        type: ADD_TODO,
        text
    }
    dispatch(action);
}
```

在Redux中，实际上是将结果直接传递到`dispath()`方法中来触发。

```javascript
dispatch(addTodo(text));
```

另外，可以创建*bound action creator*用来自动执行dispatch：

```javascript
const boundAddTodo = (text) => dispatch(addTodo(text));
```

然后可以直接调用

```javascript
boundAddTodo(text);
```

`dispatch()`方法可以直接通过调用store的`store.dispatch()`方法来执行，大多数可以使用像*react-redux*的`connect()`方法来访问。你可以使用`bindActionCreators()`来将任意个action creator自动绑定到`dispatch()`方法。

Action creator同时可以异步并会产生副作用。

完整的source code

#### `actions.js`

```javascript
// action type
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

// other constants 其他常量
export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
};

// action creators
export function addTodo(text) {
    return {type: ADD_TODO, text};
}
export function toggleTodo(index) {
    return {type: TOGGLE_TODO, index};
}
export function setVisibilityFilter(filter) {
    return {type: SET_VISIBILITY_FILTER, filter};
}
```

## Reducers

Action只是描述了要发生的情形，但没有说明应用状态在响应中如何变化。这就是reducer的工作。

### 定义State模型

在Redux里，所有的应用状态都保存在一个单一的对象中。这是一个在写代码前考虑整体形态的好主意。什么样的一个对象是你应用状态的最小表达式？

对于示例中的todo应用，我们要保存两种数据：

- 当前选中的显示状态过滤器
- 当前的todo数据列表

你可能发现你还需要存储一些数据，比如UI的状态，到状态树中。没关系，但请试着将这些数据与UI的状态分离开来。

```javascript
{
    visibilityFilter: 'SHOW_ALL',
    todos: [
        {text: 'Consider using Redux', completed: true},
        {text: 'Keep all state in a single tree', completed: false}
    ]
}
```

> **关联的注意点**
> 在一个复杂的应用中，我们常常需要在不同的实体中互相引用。我们建议保持你的state尽可能的[常规化](https://github.com/paularmstrong/normalizr)，不带任何的嵌套(nesting)。将所有的实体带上ID主键保存在同一个对象中，然后使用id来在不同的实体键引用。想象应用的状态是一个数据库。举个例子，保存`todosById: {id -> todo}`和`todos: array<id>`到state中在真实的应用中是一个好想法。

#### 处理Actions

我们已经定义好了state对象，现在需要为它编写reducer。reducer是一个接收之前状态和action的纯函数，然后返回下一个状态。

`(previousState, action) => nextState`

之所以被叫做reducer是因为它是要传递到[`Array.prototype.reduce(reducer[, initalValue])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)的方法。保持它是纯函数很重要。以下的都不能在reducer中做：

- 改变它的参数
- 执行有副作用的比如API调用或者路由转换
- 调用非纯函数，比如`Date.now()`，`Math.random()`

**传入相同的参数，它只需要计算出下一个状态并返回。没有惊喜，没有副作用，没有API调用，没有变异。仅仅只是一个计算**

用这种不同的方式，开始编写reducer逐步解释之前定义的action。

首先定义初始state。Redux首先会接收一个`undefined`的state来调用reducer，这是返回我们应用的初始state的时机。

```javascript
import {VisibilityFilters} from './actions';
const initialState = {
    visibilityFilter: VisibilityFilters.SHOW_ALL,
    todos: []
};

function todoApp(state, action) {
    if ("undefined" === typeof state) {
        return initalState;
    }
    //先不处理action，原样返回state
    return state;
}
```

可以用ES6的语法简单的完成一样的功能

```javascript
function todoApp(state = initialState, action) {
    return state;
}
```

接下来处理`SET_VISIBILITY_FILTER`，要做的事情仅仅是改变state中的`visibilityFilter`。

```javascript
function todoApp(state = initialState, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTERS:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            });
        default:
            return state;
    }
}
```

注意：

1. **我们没有改变`state`**。这里用到了`Object.assign()`来复制了一个对象。这样使用`Object.assgin(state, {visibilityFilter: action.filter})`也是错的：它会改变第一个参数。必须提供一个空对象作为第一个参数。也可以用ES7的对象解构来代替这种写法`{...state, ...newState}`。
2. **我们在`default`段返回了之前的`state`**。这很重要对于任何未知的action要返回原先的`state`。

> **使用 `Object.assign()`需要注意**
> `Object.assign()`是ES6的语法，现在还没有被大多数浏览器实现。你需要要么使用一个polyfill，一个Babel的插件，或者其他工具类库像`_.assign()`。

> **使用`switch`和例子需要注意**
> `swtich`语句不是真正的样本例子。真正Flux的样本是概念性的：需要发出一个更新，需要用Dispatcher注册一个Store，还需要Store是一个对象（当你构建一个应用时会非常困难）。Redux解决这些问题通过用纯reducers代替事件发送器。
> 很不幸的是现在很多人在挑选框架时会基于文档中是否用了`switch`语句。如果你不喜欢`switch`，你可以使用一个自定义`createReducer`函数来接收一个处理函数列表。

#### 处理其他Actions

```javascript
function todoApp(state = initialState, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTERS:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            });
        case ADD_TODO:
            return Object.assign({}, state, {
                todos: [...state.todos, {text: action.text, completed: false}]
            });
        default:
            return state;
    }
}
```

与之前一样，永远不要直接写入`state`或者它的元素，要用一个新对象来代替。新的`todos`集合和旧的`todos`集合追加一个新的项目到尾部是相等的。新的todo由从action中传来的数据创建。

最后，`TOGGLE_TODO`的实现就没什么惊喜了。

```javascript
case TOGGLE_TODO:
    return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
            if (index === action.index) {
                return Object.assign({}, todo, {
                    completed: !todo.completed
                });
            }
            return todo;
        });
    });
```

因为我们要更新一个特定的项目而不凭借转变，我们不得不创建一个包含相同元素的数组除了制定索引的项目。如果你经常有这样的操作，使用一个工具类比如[react-addons-update](https://facebook.github.io/react/docs/update.html)、[updeep](https://github.com/substantial/updeep)，或者像[Immutable](http://facebook.github.io/immutable-js/)这样原生支持深度更新的类库。仅仅需要记住的一点永远不要分派任何东西到`state`中，除非你事先有克隆。

#### 分离Reducers

```javascript
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [...state, {text: action.text, completed: false}];
        case TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    });
                }
                return todo;
            });
        default:
            return state;
    }
}
function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
}
function todoApp(state = {}, action) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
    }
}
```

重写了主reducer作用是调用了管理部分状态的其他reducer，然后将它们组合成一个单一对象。同时也不需要知道完整的初始`state`了，当最开始给一个`undefined`时，子的reducer返回它们初始`state`就足够了。这种方式称为<a name="/tag/reducer_composition">`reducer composition`</a>，是创建一个Redux应用的基本模式。

每个分离出来的reducer仅仅只是处理全局state中它自己的那部分。对于每个reducer来说`state`参数都是不一样的，它管理的只是与它相关的全局`state`的部分。

现在看起来好多了！当一个应用很庞大，我们可以分离reducer到单独的文件保证它们完全的独立，处理不同的数据范围；

最后，Redux提供一个工具叫做`combineReducers()`，做和上面`todoApp`相同的逻辑，我们使用它可以这样重新`todoApp`：

```javascript
import {combineReducers} from 'redux';
const todoApp = combineReducers({
    visibilityFilter,
    todos
});
export default todoApp;

// 和下面的代码完全等价

export default function todoApp(state = {}, action) {
    return {
        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
        todos: todos(state.todos, action)
    };
}
```

你也可以指定不同的主键，或者调用不同的方法。这两种方法写的合并reducer是完全等价的：

```javascript
const redcuer = combineReducers({
    a: doSomethingWithA,
    b: processB,
    c: c
});

function reducer(state = {}, action) {
    return {
        a: doSomethingWithA(state.a, action),
        b: processB(state.b, action),
    }
}
```

`combineReducers()`做的全部事情是生成一个方法，这个方法会调用你定义的reducer**带上根据它们主键选择的部分state**，然后再一次将它们的结果组合成一个单一的对象。

> 给懂得ES6语法的用户
> 因为`combineReducers()`期望的是一个对象，我们可以将所有顶层的reducer放到一个单独的文件中，`export`所有的reducer方法，然后使用`import * as reducers`来获取一个以它们名称作为主键的对象。
> ```javascript
> import {combineReducers} from 'redux';
> import * as reducers from './reducers';
> const todoApp = combineReducers(reducers);
> ```

#### Source Code

**`reducers.js`**

```javascript
import {combineReducers} from 'redux';
import {ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters} from './actions';
const {SHOW_ALL} = VisibilityFilters;

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state;
    }
}
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [...state, {text: action.text, completed: false}];
        case TOGGLE_TODO:
            return state.map((todo, index) => {
                if (index === action.index) {
                    return Object.assign({}, todo, {
                        completed: !todo.completed
                    });
                }
                return todo;
            });
        default:
            return state;
    }
}

const todoApp = combineReducers({
    visibilityFilter,
    todos
});
export default todoApp;
```

## Store

前面的章节，我们定义了actions用来描述发生了什么，还定义了reducers来根据`action`更新`state`。

**`Store`**是一个将它们融合到一起的对象。store有以下的几点功能。

- 控制应用的state
- 允许通过`getState()`方法访问state
- 允许通过`dispatch(action)`方法来更新state
- 通过`subscribe(listener)`来注册监听器
- 通过`subscrite(listener)`方法的返回值来控制正在注销的监听器

非常重要的一点是一个Rudex应用智能有一个store，当你想分割数据处理业务逻辑时，你可以用[reducer composition](#/tag/reducer_composition)来代替多个store。

如果你已经有一个reducer了那么创建store是很简单的。在上一节，我们使用`combineReductors()`方法将一系列reducer合并成了一个。现在只需要导入它，并把它传入`createStore()`。

```javascript
import {createStore} from 'redux';
import todoApp from './reducers';
let store = createStore(todoApp);
```

你可以将初始`state`作为第一个参数传入`createStore()`。这对于混合客户端的状态去匹配服务器端运行的Redux应用的状态很有用。

> createStore() 的第二个参数是可选的, 用于设置 state 初始状态。这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。

```javascript
let store = createStore(todoApp, window.STATE_FORM_SERVER);
```

## Data Flow

## Usage with React
