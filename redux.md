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
>
>**payload** 一个可以是任何数据类型的可选属性。用来描述action的有效装载。可以是任何不是`type`或者action状态的数据。
>根据约定，如果`error`属性被设置为`true`，那么`payload`必须是一个error对象，这个与用一个error拒绝一个Promise执行相似。
>**error** 一个可选属性，用一个action描述一个错误。
>
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

### <a name="/tag/designing_the_state_shape">定义State模型</a>

在Redux里，所有的应用状态都保存在一个单一的对象中。这是一个好想法在写代码前考虑整体形态。什么样的一个对象是你应用状态的最小表达式？

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
> `Object.assign()`是ES6的语法，现在还没有被大多数浏览器实现。你需要要么使用polyfill，一个Babel的插件，或者其他工具类库像`_.assign()`。

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

因为我们要更新一个特定的项目而不凭借转变，我们不得不创建一个包含相同元素的数组除了指定索引的项目。如果你经常有这样的操作，使用一个工具类比如[react-addons-update](https://facebook.github.io/react/docs/update.html)、[updeep](https://github.com/substantial/updeep)，或者像[Immutable](http://facebook.github.io/immutable-js/)这样原生支持深度更新的类库。仅仅需要记住的一点永远不要分派任何东西到`state`中，除非你事先有克隆。

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

非常重要的一点是一个Rudex应用只能有一个store，当你想分割数据处理业务逻辑时，你可以用[reducer composition](#/tag/reducer_composition)来代替多个store。

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

### 发送Actions Dispathing Actioin

现在我们已经创建了一个Store，来一起验证下程序的工作吧。即使没有界面，我们也可以测试更新逻辑了。

```javascript
import {addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters} from './actions';

// 记录初始state
console.log(store.getState());

// 每次state变化时，记录日志
// 注意 `subscribe()` 会返回一个正在注销的监听器的方法
let unsubscribe = store.subscribe(() => {
    console.log(store.getState());
});

// 发送一些actions
store.dispath(addTodo('Learn about actions'));
store.dispath(addTodo('Learn about reducers'));
store.dispath(addTodo('Learn about store'));
store.dispath(toggleTodo(0));
store.dispath(toggleTodo(1));
store.dispath(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED));

//停止监听state的更新
unsubscribe();
```

### Source Code

**`index.js`**

```javascript
import {createStore} from 'redux';
import todoApp from './reducers';

let store = createStore(todoApp);
```

## Data Flow

Redux的构造围绕着**单向数据流**

这意味着程序中所有的数据将遵循同一个生态圈模态，可以使应用的逻辑可被预测并且更容易理解。非常鼓励数据的规范化，这样就不会以几个完全独立不会在意另一个相同数据的备份结束了。*（即规范化可以避免出现多个单一互不干扰完全独立的重复的数据）*

任意一个Redux应用的数据生命周期都有以下4步：

1. **You call `store.dispatch(action)` 触发一个action**
  一个action是一个对象用来描述将要发生的，举例：
  ```javascript
  {type: 'LIKE_ARTICLE', articleId: 42}
  {type: 'FETCH_USER_SUCCESS', response: {id: 3, name: 'Mary'}}
  {type: 'ADD_TODO', text: 'Read the Redux docs.'}
  ```
  一个action就像新闻的小段概要。“Mary liked article 42.” or “‘Read the Redux docs.' was added to the list of todos.”
  你可以在你的应用的任何地方调用`store.dispatch(action)`，包括组件，异步回调，甚至在计划的定时器中。

2. **Redux的store调用你定义的reducer函数**
  `store`会传递两个参数给`reducer`：当前的state数和一个action。举例，在todo应用中，root reducer可能会接受到像这样的一些数据：
  ```javascript
  // 当前应用的状态
  let previousState = {
    visibilityState: 'SHOW_ALL',
    todos: [{text: 'read the docs.', completed: false}]
  };

  // 要执行的action 添加一个todo
  let action = {type: 'ADD_TODO', text: 'Understand the flow.'};

  // reducer会返回下一个应用状态
  let nextState = todoApp(previousState, action);
  ```
  要注意reducer是一个纯函数。它只是用来*计算*出下一个state。它应该是完全可以预测的：用相同的条件调用它会产生相同的结果。它不应该像调用API或者路由转换一样产生任何副作用。这些都应该在触发一个action之前发生。

3. **root reducer应该会合并多个reducer的输出到一个单一的state树中。**
  如何定义root reducer完全取决于你自己。Redux中包含了一个辅助函数`combineReducers()`，对于“分离”root reducer成为只管理自己在state树中分支的独立函数很有用。
  下面是`combineReducers()`如何工作的。假如你有两个reducer，一个给todo的列表，一个给当前选择的过滤设置：
  ```javascript
  function todos(state = [], action) {
  // somehow calculate it..
  return nextState;
  }
  function visibilityFilter(state = 'SHOW_ALL', action) {
  // somehow calculate it...
  return nextState;
  }
  let todoApp = combineReducers({todos, visibilityFilter});
  ```
  当你要触发一个action时，`combineReducers`的返回`todoApp`会调用这两个reducer：
  ```javascript
  let nextTodos = todos(state.todos, action);
  let nextVisibilityFilter = visibilityFilter(state.visibiltyFilter, action);
  ```
  接着它会将两个结果集合合并成一个单一的state树：
  ```javascript
  return {
    todos: nextTodos,
    visibilityFilter: nextVisibilityFilter
  }
  ```
  当然`combineReducers()`是一个方便的辅助工具，你也可以不使用它，可以自己写一个root reducer。

4. **Redux的store将会保存root reducer最终返回的state树。**
  现在新的状态树就是你应用的下一个状态了。所有通过`store.subscribe(listener)`注册的监听器将会被执行；在监听器中可以通过调用`store.getState()`来获取当前state。
  现在UI就可以更新了用来反映新的state。如果你使用了封装类比如`React Redux`，现在就是执行`component.setState(newState)`的时候了。

## Usage with React

在最开始时，我们着重学习了没有与React关联的Redux。你可以使用React，Angular，Ember，jQuery或者vanilla Javascript完成一个Redux应用。

这就是说，Redux可以非常好的与React或者Deku这类的框架一起工作，因为它们可以用一个状态的函数描述一个UI，然后Redux触发状态更新action的响应。

### 安装React Redux

```javascript
npm install --save react-redux
```

### 表象组件 和 容器组件 (Presentational and Container Components)

React的Redux封装库使用了分离表象组件和容器组件的概念，如果你对这些概念不熟悉，请先阅读下面的内容。[article from](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

> ### 表象组件和容器组件
> 当你在编写React应用时会发现一个非常有用的简单模式。如果你已经用过React一段时间了，你也许已经注意到它了。[这篇文章也很好的说明了](https://medium.com/@learnreact/container-components-c0e67432e005)，但我还是想补充几点。
> 如果你决定将组件分成两个分类你会发现你的组件会非常容易的重复使用。我称它们为*容器组件和表象组件*，也听说过其他称呼如胖组件和瘦组件Fat and Skinny，聪明组件和哑巴组件Smart and Dumb，有状态组件和纯组件Statefull and Pure，视图和组件Screens and Components等等。它们其实不完全相同，但核心的思想是一样的。

> **我理解的表象组件**

> 1. 与一个东西的样式有关
> 2. 可能内部会包含其他表象组件或者容器组件，往往会有DOM标记和自身的样式
> 3. 通常允许通过`this.props.children`进行控制
> 4. 与应用其余的部分没有依赖，比如Flux的actions或者stores
> 5. 没有具体说明数据是如何加载或变化的
> 6. 仅仅通过props来接收数据和回调
> 7. 自身包含极少的state（就算有，也是UI的状态而不是数据）
> 8. 除非它们需要state，生命周期的钩子函数或者性能的优化，否则都当做[方法组件](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components)来写
> 9. 一些例子：Page页面，Sidebar侧边栏，Story历史，UserInfo用户信息，List列表。

> **我理解的容器组件**

> 1. 与一个东西如何工作有关
> 2. 可能内部会包含其他表象组件或容器组件，通常没有它自己的DOM标记，除了一些包裹用的div，并且不会有任何样式
> 3. 调用Flux的action，并将这些作为表象组件的回调
> 4. 往往是有状态的，往往做为一个数据源来提供服务
> 5. 通常是被一个[高阶组件](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)生成，比如React Redux的`connect()`，Relay的`createContainer()`或者是Flux Utils的`Container.create()`，不会手工去编写。
> 6. 举例：UserPage用户页，FollowersSidebar追随者侧边，StoryContainer历史容器，FollowedUserList追随者列表
将它们分别放到不同的目录明确区分开来。

> > **高阶组件**
> > 就是一个方法，通过传入一个存在的组件然后返回一个包裹着传入组件的新组件。
>
> **这种用法的好处**

> - 更好的有重点区分。可以在用这种方式编写组件时更好的了解你的应用和界面UI。
> - 更好的重用性。可使用不同的数据源到相同的组件上，将这些放到分离的容器组件中可以更好的重用。
> - 表象组件本质上只是你应用的“调色板”。可以将它们放到一个独立的页面上，可以让设计师无需程序的逻辑对它们进行微调。可以在这个页面上进行截图回归测试（screenshot regression tests）
> - 这种方式迫使你提取出“布局组件”，例如SideBar，Page，ContextMenu，然后使用`this.props.children`代替在一些容器组件中重复使用相同的标记和布局。

> ***要记住，组件不会触发DOM。它们只需要提供UI之间有关联的结构边界。***

> 使用它的长处。

> **何时引入容器Containers**
>
> 我建议在最开始搭建你的应用时先全部只使用表象组件。接着你会发现你传递太多的props到中间组件中。当你注意到一些组件没有用到它们接受到的props，只是将它们继续往下传递，而你在很多时候子节点或子组件需要更多数据时不得不将这些中间组件穿到一起时，这时候就可以引入一些容器组件了。这种方式你可以获取数据和行为props到子叶组件，不用负担在树中间的互相没有关联的组件。
> 这是一个重构中进行中的处理。所以不要试着在第一次用它。当你在用这种模式尝试时，你会产生一种直觉是时候分离出一些容器了，就像你明白什么时候需要分离一些函数是一样的。

> **其他两分法**
>
> 你需要理解表象组件和容器组件之间的区别不只是一种技术，当然，区别在于他们的核心宗旨。
> 为了区别，这里列出一些关联的（但是是不同的）技术上的区分：

> - **Statefull and Stateless 有状态和无状态**。一些组件会使用React的`setState()`而一些不使用。容器组件趋于有状态，而表象组件趋于无状态，这不是硬性规定，表象组件也可以有状态而容器组件也可以无状态。
> - **Classes and Functions 类组件和函数组件**。从React0.14开始，组件可以被定义为一个类也可以通过一个函数生成一个组件。函数组件只是简单的定义它缺乏一些类组件所独有的一些特性。这些约束中的一些将来也许会不存在，但是他们现在还是有这些约束的。因为函数组件可以更简单的理解，我建议当你不需要使用state，生命周期的函数或者性能最优化，这些只有在类组件中有的功能时可以使用函数组件。
> - **Prue and Impure纯组件和非纯组件**。人们通过传入相同的state和props然后会保证是相同结果来定义它就是一个纯组件。纯组件可以是类组件也可以是函数组件。另外一个重要的特性是纯组件有的，当props或者state有深度变化时纯组件不会响应，所以它在通过它们自身的`shouldComponentUpdate()`函数进行浅度比较时渲染的性能是最佳的。目前只有类组件可以定义`shouldComponentUpdate()`函数，将来也许会有所改变。

> 表象组件和容器组件都可以被归纳为这些定义的组件中。在我的经验中，表象组件趋于无状态的纯函数组件，而容器组件趋于有状态的纯类组件。无论如何这些都不是规定仅仅是一种经验，我也见过完全对立的例子在一些特殊情况下也讲得通。
> 不要讲表象组件和容器组件的分离当做一个教条。有时是不是很难画一条线都没有关系。如果你不确定已个特定的组件是属于表象组件还是容器组件，也许还是太早去做决定了。不要在意它。

阅读完上面的文字后，我们来重新数下它们的区别：

|   | 表象组件 | 容器组件 |
|-----|-----|-----|
| 核心宗旨 | 如何展示（标记和样式）| 如何工作（获取数据，更新状态） |
| 知道Redux | No | Yes |
| 获取数据 | 从Props中获取 | 订阅Redux状态 |
| 改变数据 | 执行Props中的回调 | 触发Redux的action |
| 被编写 | 手工编写 | 通常被React Redux生成 |

大多数组件都属于表象组件，我们也需要生成一些容器组件用来和Redux Store进行连接。
从技术上来说你需要使用`store.subscribe()`自己手动编写自检容器。我们不建议你这样做因为React Redux做了很多性能优化的处理这些都很难通过手动出完成。正是因为这个原因，可以使用React Redux提供的`connect()`来生成容器组件。

### 设计组件层次结构

还记得[如何设计根state对象的结构](#/tag/designing_the_state_shape)吗？现在就可以设计UI的层次结构来匹配它了。这个不是一个专门给Redux的任务。[Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)是一个很好的手册解释了这种处理方式。

我们的设计概要很简单，需要一个列表用来显示todo的项目。点击时todo的项目会被划掉表示完成了。我们需要一个表单用来添加新的todo项目。在底部我们需要显示一个触发器用来切换显示全部，仅显示完成的，或者只显示激活的todo项目。

#### 表象组件

可以从下面的概要中看到要用到的表象组件和它们暴露出来的props：

- `TodoList` 是一个显示可见todo项目的列表
    + `todos: Array` 是一个保存todo条目的数组，用`{id, text, completed}`这种结构
    + `onTodoClick(id: number)` 是当todo条目被点击后执行的回调函数。
- `Todo` 是一个单一todo条目
    + `text: string` 要显示的文本
    + `completed: boolean` todo条目是否显示划掉
    + `onClick()` todo条目被点击后执行的回调函数
- `Link` 带有回调函数的链接
    + `onClick()` 当链接被点击时执行的回调函数
- `Footer` 用来定义让用户切换当前显示todo列表条目的组件
- `App` 根组件用来渲染其他的任何东西

它们定义了表象但不知道数据从哪里来，也不知道如何去改变它。它们仅仅是渲染出我们给它们的。如果你从Redux转移到其他，这部分组件可以完全的保留下来。它们与Redux没有任何关联。

#### 容器组件

我们需要一些容器组件来将表象组件与Redux进行关联。举个例子，表象组件`TodoList`需要一个容器组件像`VisibleTodoList`能够订阅到Redux store，知道如何应用当前的显示过滤器。当改变显示过滤器时，我们提供一个`FilterLink`容器组件用来渲染一个`Link`用来在点击事件时触发一个恰当的action：

- `VisibleTodoList` 根据当前显示过滤器过滤todo条目并渲染出一个`TodoList`
- `FilterLink` 获取当前显示过滤器并渲染出一个`Link`
    + `filter: string` 是它所表示的显示过滤器

#### 其他组件

有时很难定义一个组件是属于表象组件还是容器组件。比如说，表单和函数确实是绑定在一起的，就像这个小组件：

- `AddTodo` 是一个input输入框和一个"Add"按钮。

从技术上来说我们需要将它分离成两个组件，但是对于现在这个平台有些太早了。将表象和逻辑组合成一个很小的组件挺好的。当它壮大以后，如何分离它将会比较明显一些，我们将会撇开混合的。

### 实现组件

开始编写组件！从变相组件开始因为不需要考虑如何与Redux绑定。

#### 表象组件

都是一些很普通的的React组件，不需要太细致的研究。只需要编写功能性无状态组件除非需要本地state或者生命周期函数。这不是说表象组件就只是一个函数 —— 只是这种定义方式比较简单。如果当我们需要添加本地state，生命周期函数或者性能优化是，我们再将它们转换成类。

**`components/Todo.js`**

```javascript
import React, {PropTypes} from 'react';

const Todo = ({onClick, completed, text}) => (
    <li
        onClick={onClick}
        style={{textDecoration: completed ? 'line-through' : 'none'}}
    >
        {text}
    <\/li>
);

Todo.propTypes = {
    onClick: PropTypes.func.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
};

export default Todo;
```

**`components/TodoList.js`**

```javascript
import React, {PropTypes} from 'react';
import Todo from './Todo';

const TodoList = ({todos, onTodoClick}) => (
    <ul>
        {todos.map((todo) => (
            <Todo
                key={todo.id}
                {...todo}
                onClick={()=>onTodoClick(todo.id)}
            \/>
        ))}
    <\/ul>
);

TodoList.propTypes = {
    todos: PropTypes.arrayOf(
        PropTypes.shape(
            id: PropTypes.number.isRequired,
            completed: PropTypes.bool.isRequired,
            text: PropTypes.string.isRequired
        ).isRequired
    ).isRequired,
    onTodoClick: PropTypes.func.isRequired
};

export default TodoList;
```

**`components/Link.js`**

```javascript
import React, {PropTypes} from 'react';

const Link = ({active, children, onClick}) => {
    if (active) {
        return <span>{children}<\/span>
    }
    return (
        <a href="#"
            onClick={e=>{
                e.preventDefault();
                onClick()
            }}
        >
        {children}
        <\/a>
    );
};

Link.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Link;
```

**`components/Footer.js`**

```javascript
import React, {PropTypes} from 'react';
import FilterLink from '../containers/FilterLink';

const Footer = () => {
    <p>
    Show:
    {" "}
    <FilterLink filter="SHOW_ALL">
    ALL
    <\/FilterLink>
    {", "}
    <FilterLink filter="SHOW_ACTIVE">
    Active
    <\/FilterLink>
    {", "}
    <FilterLink filter="SHOW_COMPLETED">
    Completed
    <\/FilterLink>
    <\/p>
};

export default Footer;
```

**`components/App.js`**

```javascript
import React, {PropTypes} from 'react';
import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

const App = () => (
    <div>
        <AddTodo \/>
        <VisibleTodoList \/>
        <Footer \/>
    <\/div>
);

export default App;
```

#### 容器组件

现在是时候创建一些容器组件来连接这些表象组件和Redux了。从技术上来说，一个容器组件只是一个React组件使用`store.subscribe()`读取Redux状态树的部分数据然后提供props给渲染用的表象组件。你可以手动编写一个容器组件，但是我们建议使用React Redux类库的`connect()`方法来生成一个容器组件，它提供了有用的优化点预防不必要的重复渲染。（这样处理的一个结果是你不需要担心自己去实现`shouldComponentUpdate()`所产生的[React性能建议](https://facebook.github.io/react/docs/advanced-performance.html)问题）

使用`connect()`，你需要定义一个叫做`mapStateToProps`的特殊方法，它说明了如何转换当前的Redux store成为要传入一个你包装用的表象组件的props属性。举个例子，`VisibleTodoList`需要计算出`todos`传递给`TodoList`，所以我们需要定义一个方法用来根据`state.visibilityFilter`来过滤`state.todos`，然后在它自己的`mapStateToProps`中使用。

```javascript
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
    }
};

const mapStateToProps = (state) => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter);
    };
};
```

除了(In addition to)读取state，容器组件还能触发action。用同样的方式，你可以定义一个叫做`mapDispatchToProps()`的方法用来接收`dispatch()`方法，然后返回一个要注入到表象组件的回到函数props。举个例子，我们要让`VisibleTodoList`注入一个叫做`onTodoClick`的prop到`TodoList`组件中去，然后让`onTodoClick`去执行一个`TOGGLE_TODO`的action。

```javascript
const mapDispatchToProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
        }
    };
};
```

最后，我们创建一个`VisibleTodoList`用来执行`connect()`并把两个function传进去：

```javascript
import {connect} from 'react-redux';

const VisibleTodoList = connect(
        mapStateToProps,
        mapDispatchToProps
    )(TodoList);

export default VisibleTodoList;
```

这些都是React Redux API的基础部分，有一些便捷的并且功能强大的选项，我们鼓励你去阅读它的详细[官方文档](https://github.com/reactjs/react-redux)。如果（In case）你担心`mapStateToProps`太频繁的创建新对象，你可以去学习如何使用[reset](https://github.com/reactjs/reselect)来计算派生数据。

下面定义了容器组件的剩余(rest)部分：

**`containers/FilterLink.js`**

```javascript
import {connect} from 'react-redux';
import {setVisibilityFilter} from '../actions';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter));
    }
  };
}

const FilterLink = connect(mapStateToProps, mapDispatchToProps)(Link);

export default FilterLink;
```

**`containers/VisibleTodoList.js`**

```javascript
import {connect} from 'react-redux';
import {toggleTodo} from '../actions';
import TodoList from '../components/TodoList';

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: getVisibileTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;
```

其他组件

**`containers/AddTodo.js`**

```javascript
import React from 'react';
import {connect} from 'react-redux';
import {addTodo} from '../actions';

let AddTodo = ({dispatch}) => {
  let input;
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return !1;
        }
        dispatch(addTodo(input.value))
        input.value = '';
        }}>
        <input ref={node => {
          input = node;
          }} />
        <button type="submit">Add Todo<\/button>
      <\/form>
    <\/div>
  );
};
AddTodo = connect()(AddTodo);
export default AddTodo;
```

所有的容器组件需要访问Redux的store以便订阅它。有一个选项需要作为props传递给每一个容器组件。然而这样会很冗长乏味，你不得不连接`store`甚至穿过表象组件只是因为组件树的深处需要渲染一个容器。

我们推荐的做法是使用一个特殊的React Redux组件`Provider`，神奇的使store在应用中所有的容器组件中被访问而不需要显式传递它。你只需要在渲染root组件时使用一次就可以了。

**`index.js`**

```javascript
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import todoApp from './reducers';

let store = createStore(todoApp);

render (
  <Provider store={store}>
    <App />
  <\/Provider>,
  document.getElementById('root')
);
```

