# 基础概念（Basic Concepts）

### call函数
### put函数
### select函数

### takeEvery函数
### takeLatest函数

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
yield cacel(a);
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
