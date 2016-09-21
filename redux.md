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

#### `action.js`

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

## Store

## Data Flow

## Usage with React
