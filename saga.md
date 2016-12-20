<!-- MarkdownTOC -->

- 基础概念（Basic Concepts）
    - call函数
    - put函数
    - select函数
    - takeEvery函数
    - takeLatest函数
- 高级概念（Advanced Concepts）
    - 拉取未来Action \[监听actions\] take函数
    - 非阻塞的call （Non-blocking calls）fork函数 cancel函数 cancelled函数
    - 任务并行运行 Running Tasks in Parallel
    - 多任务的比赛 Staring a race between multiple Effects
    - 使用`yield*`来对Sagas排序 Sequencing Sagas via `yield*`
    - 组合Sagas Composing Sagas
    - 取消任务 Task cancellation
    - Redux Saga 派生模型 redux-saga's fork model
    - 通用并发模型 Common Concurrency Patterns
    - Saga连接外部输入输出 Connecting Sagas to external Input/Output
    - 使用频道 Using Channels

<!-- /MarkdownTOC -->


# 基础概念（Basic Concepts）

## call函数

**`call(fn, ...args)`**

创建一个Effect描述用来指示中间件调用函数`fn`，并将`args`作为参数。

    - `fn: Function` 一个Generator函数，或者是一个返回一个Promise的普通函数，或其他任意类型
    - `args: Array<any>` 一个值的数组，将会被传入`fn`作为参数

> `fn`可以是一个普通或者Generator函数。
> 中间件会请求这个函数并判断它的返回值。
> - 如果返回值是一个迭代对象，中间件将会运行那个Generator函数，就像它对启动Generator（在启动时传递给中间件的）做的一样。
> - 如果返回值是一个Promise，中间件会在Promise被resolve前挂起这个Generator，Generator将会带着resolve的结果继续运行，或者Generator抛出一个内部异常。
> - 如果返回值既不是一个迭代对象也不是一个Promise，中间件将立即将这个值返回给sago，这样它就可以继续它的同步地执行。
>
> 当Generator内部抛出一个异常。如果当前的`yield`指令被`try/catch`块包裹，控制将被传递到`catch`块中。否则，Generator将会被这个异常终止掉，如果这个Generator是被另外一个Genreator调用，这个异常将会传递给调用的Generator。

**`call([context, fn], ...args)`** 指定`fn`运行的上下文

## put函数

**`put(action)`**

创建一个Effect描述用来指示中间件派发一个action到store中。这个effect是非阻塞的，任何下游抛出的异常将会冒泡回到saga

    - `action: Object` 普通的Redux Action对象 {type: "SOME_TYPE", payload: {name: "test"}}

## select函数

**`select(selector, ...args)`**

创建一个Effect用来指示中间件在当前Store的state上执行提供的选择器函数。（例如：返回`selector(getState(), ...args)`的结果）

    - `selector: Function` 一个格式为`(state, ...args) => args`的函数。获取当前的state和一些可选的参数，然后返回当前Store中state的部分集合
    - `args: Array<any>` 可选参数，将会传递给selector，追加给`getState`

如果`select`被无参的情况下调用(`yield select()`)，这个Effect将会返回整个state（和调用`getState()`一样的结果）。

> 注：需要注意当一个action分发给store时，中间件首先会转向去处理action，然后再通知Saga，这意味着当你查询Store的state时，你获取的state是action应用后的state。当然，这个行为在你所有的次生中间件**同步**调用`next(action)`时是可以确保的；如果次生中间件**异步**调用`next(action)`（不常用但有可能），这时，sage将会在action被应用前获取到state。因此建议检查每一个次生中间件的源，确保它是同步调用`next(action)`，或者确保redux-saga是调用链中最后一个中间件。

## takeEvery函数
## takeLatest函数

# 高级概念（Advanced Concepts）

## 拉取未来Action [监听actions] take函数

```javascript
import {takeEvery} from 'redux-saga';
import {put, select} from 'redux-saga/effects';

function* watchSomething() {
    yield takeEvery('*', function* fun(action) {
        const state = yield select();
        console.log('action', action);
        console.log('state after', state);
    });
}
```

```javascript
import {take, select} from 'redux-saga/effects';

function* watchSomething() {
    while(true) {
        const action = yield take('*');
        const state = yield select();
        console.log('action', action);
        console.log('state after', state);
    }
}
```

`take`就像是`call`和`put`函数一样。会创建一个命令对象告诉中间件等待指定的action。`call`的结束行为同样也是中间件暂停Generator直到Promise被resolve。`take`函数也会挂起一个Generator直到有一个匹配的Action被触发；

注：我们运行了一个无限循环`while(true)`。注意这是一个没有结束行为的Generator函数，这个Generator会阻塞每一次循环等待action的触发。

使用`take`在我们如何写代码时会有一些细微的影响。在`takeEvery`的例子中，被请求的任务在它们被调用时无法进行控制。它们只会一遍又一遍的在匹配Action时被执行。同样也没有控制停止观察。

在使用`take`例子中控制是反过来的。代替将action推给(***pushed***)处理的句柄任务，Saga自己抓取(***pulling***)这些action，看起来就像是Saga执行一个普通的函数调用`action = getNextAction()`，这个函数会在action被触发时resolve。

这种反向控制就允许我们来实现 使用传统`push`方法来做的非常规 的流程控制了。

举例：

```javascript
import {take, put} from 'redux-saga/effects';

function* watchFirstThreeTodosCreation() {
    for (let i = 0; i < 3; i++) {
        const action = yield take('TODO_CREATED');
    }
    yield put({type: 'SHOW_CONGRATULATION'});
}
```

```javascript
function* loginFlow() {
    while(true) {
        yield take('LOGIN');
        //...login logic
        yield take('LOGOUT');
        //...logout logic
    }
}
```

## 非阻塞的call （Non-blocking calls）fork函数 cancel函数 cancelled函数

`fork`函数会派生一个子任务，`call`是同步执行，而`fork`是异步执行的；
`cancel`函数用来终止一个`fork`出来的子任务

```javascript
const a = yield fork(func, arg1, arg2);
yield cancel(a);
```

当一个子任务在被终止时可以通过`cancelled`函数来判断，执行一个撤销逻辑，防止由于撤销任务导致的状态不一致；

```javascript
function* task(arg1, arg2) {
    try {
        const a = yield call(fn, arg1, arg2);
    } catch(error) {

    } finally {
        if (yield cacelled()) {
            // cleanup...
        }
    }
}
```

**CALL**

```javascript
import {take, call, put} from 'redux-saga/effects';
import Api from '....';

function* authorize(user, password) {
    try {
        const token = yield call(Api.authorize, user, password);
        yield put({type: 'LOGIN_SUCCESS', token});
        return token;
    } catch(error) {
        yield put({type: 'LOGIN_ERROR', error});
    }
}

function* loginFlow() {
    while(true) {
        const {user, passwd} = yield take('LOGIN_REQUEST');
        const token = yield call(authorize, user, passwd);
        if (token) {
            yield call(Api.storeItem, {token});
            yield take('LOGOUT');
            yield call(Api.cleanItem, 'token');
        }
    }
}

```

**FORK**

```javascript
import {take, put, call, fork, cancel, cancelled} from 'redux-saga/effects';
import Api from '....';

function* authorize(user, password) {
    try {
        const token = yield call(Api.authorize, user, password);
        yield put({type: 'LOGIN_SUCCESS', token});
        yield call(Api.storeItem, {token});
        return token;
    } catch(error) {
        yield put({type: 'LOGIN_ERROR', error});
    } finally {
        if (yield cancelled()) {
            // cleanup
            // .....statement·
        }
    }
}

function* loginFlow() {
    while(true) {
        const {user, passwd} = yield take('LOGIN_REQUEST');
        // fork会返回一个任务对象
        const task = yield fork(authorize, user, passwd);
        const action = yield take(['LOGOUT', 'LOGIN_ERROR']);
        if (action.type == 'LOGOUT') {
            yield cancel(task);
        }
        yield call(Api.clearItem, 'token');
    }
}
```
> 并发不是那么简单的，处理时需要谨慎考虑各个逻辑点；

## 任务并行运行 Running Tasks in Parallel

`yield`语法很好的用一种简单线性的方式描述了异步的控制流，但有时我们需要平行做一些事，我们不能简单的这样写：

```javascript
const users = yield call(fetch, '/users'),
      repos = yield call(fetch, '/repos');
```

因为第二个Effect在第一个call没有被resolve前是不会执行的，但是可以这样写：

```javascript
import {call} from 'redux-saga/effects';

const [users, repos] = yield [
    call(fetch, '/users'),
    call(fetch, '/repos')
];
```

当我们yield一个effect数组时，generator会在**所有effect**都被resolve或者**其中一个**被reject之前阻塞。

## 多任务的比赛 Staring a race between multiple Effects

有时我们要开启一个并行的多任务，但是我们不想等待它们全部，我们只需要最快的那个（Winner），第一个被resolve或者被reject。`race`函数提供了一种多个Effects之间的比赛。

下面的例子展示了一个任务会触发一个远程数据抓取请求，而约束条件是1秒后就超时。

```javascript
import {race, take, put} from 'redux-saga/effects';
import {delay} from 'redux-saga';

function* fetchPostsWithTimeout() {
    const {posts, timeout} = yield race({
        posts: call(fetchApi, '/posts'),
        timeout: call(delay, 1000)
    });

    if (posts) {
        put({type: 'POST_RECEIVED', posts});
    } else {
        put({type: 'TIMEOUT_ERROR'});
    }
}

```

另外一个非常有用的功能是`race`会自动取消失败的那个Effect，假设有两个button

+ 第一个在后台开启一个任务，跑一个无限循环（例如每几秒钟从服务器抓取数据）
+ 当后台任务启动后，我们启用第二个button，用来取消后台任务的运行

```javascript
import {race, take, put} from 'redux-saga/effects';

function* backgroundTask() {
    while(true) {
        // .....
    }
}

function* watchStartBackgroundTask() {
    while(true) {
        yield take('START_BACKGROUND_TASK');
        yield race({
            task: call(backgroundTask),
            cancel: take('CANCEL_TASK')
        });
    }
}
```

当一个`CANCEL_TASK` action被发出后，`race`会自动取消`backgroundTask`的运行，同过在它里面抛一个取消错误；

## 使用`yield*`来对Sagas排序 Sequencing Sagas via `yield*`

你可以使用內建的`yield*`操作符通过排序的方式组合多个Saga。这样可以用一种简单的编程风格对宏观的任务进行排序了。

```javascript
function* playLevelOne() {
    //...statement
}
function* playLevelTwo() {
    //...statement
}
function* playLevelThree() {
    //...statement
}

function* game() {
    const score1 = yield* playLevelOne()
    yield put(showScore(score1));

    const score2 = yield* playLevelTwo();
    yield put(showScore(score2));

    const score3 = yield* playLevelThree();
    yield put(showScore(score3));
}
```
注：使用`yield*`会让Javascript运行时蔓延到整个序列。结果的迭代器（从`game()`来）会产出所有嵌套迭代器的结果值。更强大的解决方案是使用普通的中间件组合机制；

## 组合Sagas Composing Sagas

使用`yield*`提供的一个符合语言习惯的组合Saga，这种处理有一些限制：

- 有可能对独立的嵌套generator进行测试。这会导致多重测试代码同时也会产生重复的执行开销。我们不会执行内嵌的generator，但是要确保调用它使传入正确的参数。
- 更重要的是，`yield*`只允许连续的任务组合，所以你只能在同一时间`yield*`一个generator。

你可以简单的使用`yield`来开启一个或多个平行的子任务。当yield一个call到一个generator时，Saga会在继续处理前等待generator运行完毕，然后带上返回值接着运行（或者抛出子任务中的异常）。

```javascript
function* fetchPosts() {
    yield put(actions.requestPosts());
    const products = yield call(fetchApi, '/products');
    yield put(actions.receivePosts(products));
}

function* watchFetch() {
    while (yield take(FETCH_POSTS)) {
        yield call(fetchPosts);
    }
}
```

yield一个内嵌generator数组会以并行方式启动所有的子generator，等待它们全部结束，然后带着所有结果继续

```javascript
function* mainSaga(getState) {
    const results = yield [call(task1), call(task2), ...];
    yield put(showResults(results));
}
```

事实上，yield Saga与yield其他effect（未来action，运行超时，等等）没有区别。这意味着你可以使用effect合并器将这些Saga与其他类型进行合并。

举例，你也许希望用户在一段有限的时间内结束游戏：

```javascript
function* game(getState) {
    let finished;
    while (!finished) {
        const {score, timeout} = yield race({
            score: call(play, getState),
            timeout: call(delay, 60000)
        });
    }

    if (!timeout) {
        finished = true;
        yield put(showScore(score));
    }
}
```

## 取消任务 Task cancellation

## Redux Saga 派生模型 redux-saga's fork model

## 通用并发模型 Common Concurrency Patterns

    - takeEvery
    - takeLatest

## Saga连接外部输入输出 Connecting Sagas to external Input/Output

## 使用频道 Using Channels

- 如何使用`yield actionChannel` Effect来缓存从Store来的指定actions
- 如何使用`eventChannel`工厂函数来连接`take` Effect与外部的事件源
- 如何使用普通的`channel`工厂函数创建一个频道并且如何使用它在`take`/`put` Effect中关联两个Saga

