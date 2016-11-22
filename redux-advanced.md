> sync [sɪŋk]  async [ə'zɪŋk]
> synchronous /'sɪŋkrənəs/ asynchronous /eɪ'sɪŋkrənəs/

## 异步Action (Async Action)

在基础部分，我们创建了一个简单的todo应用。全是同步的，每一次分配一个action，state都会立刻更新。

接下来我们将建立一个不同的，异步的应用。将会用到Reddit API来展示当前选中的subreddit主标题，如何将异步加入Redux的工作流中呢？

### Action

当你触发一个异步API时，会同一时产生两个重要时间点：一个是你开始调用时，一个是当你接受到回复（或者超时）时。

这两个时间点往往会触发应用state的改变；为了做到这点，你需要分派一个会被同步reducer处理的普通action。通常对于任何一个API请求需要分派至少**3**中不同的action。

- 一个告知reducer请求开始了的action
  reducer会处理一个触发state树中`isFething`属性的action。这样UI就知道是时候显示一个loading了。

- 一个告知reducer请求成功完成的action
  reducer会处理一个用来合并新的数据到state中并将`isFething`重置的action。然后UI将loading隐藏掉并显示抓取到的数据。

- 一个告知reducer请求失败的action
  reducer会处理一个重置`isFething`的action，同时一些reducer也许会存储错误信息然后UI显示出来。

你在action中会`status`字段。

```javascript
{type: 'FETCH_POSTS'}
{type: 'FETCH_POSTS', status: 'error', error: 'Oops....'}
{type: 'FETCH_POSTS', status: 'success', response: {...}}
```

或者给它们定义些不同标记的type来区分。

```javascript
{type: 'FETCH_POSTS_REQUEST'}
{type: 'FETCH_POSTS_FAILURE', error: 'Oops....'}
{type: 'FETCH_POSTS_SUCCESS', response: {...}}
```

选择使用同样的type带上标记，或者是多个不同类型的action，你自己决定(is up to you.)。是一个你需要和团队决定的约定。多种不同type不容易出错，如果你使用如[redux-actions](https://github.com/acdlite/redux-actions)这样的工具类来生成action和redux，这将不是一个问题。

无论选择了那种约定，请使用它贯穿整个项目。

在这个手册中我们将使用分离type。

### 同步Action生成器 Synchronous Action Creators

开始定义一些例子中需要的**同步**action和action生成器。这里，用户可以选择一个子reddit来展示：

**`actions.js`**

```javascript
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';

export function selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

```

也可以通过点“刷新”按钮来更新它：

```javascript
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';

export function invalidateSubreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}
```

这些都是由用户交互来控制的action，我们也可以有另外一种action，通过网络请求来控制。后面我们展示如何分发它们，现在只需要定义好就可以了。

当需要发送一些获取子reddit的post请求时，我们需要分发一个`REQUEST_POSTS`action：

```javascript
export const REQUEST_POSTS = 'REQUEST_POSTS';

export function requestPosts(subreddit) {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
}
```

分离`SELECT_SUBREDDIT`和`INVALIDATE_SUBREDDIT`是很重要。当然也许它们一个接着另一个被触发，因为应用变得更复杂，有时需要独立于用户action来抓取一些数据（如：预先抓取流行的subreddit，或者过一会儿刷新下旧的数据）。有时也需要抓取路由改变后的响应信息，在早期将一些特别的UI事件的抓取数据绑定在一起是不明智的。

最后，当网络请求进来时，需要分发一个`RECEIVE_POSTS`:

```javascript
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}
```

以上是我们现在需要了解的。稍后我们再讨论在网络请求中分发这些action的特殊机制。

> 错误处理的说明
> 在真实的应用中，你需要在请求失败时分发一个action。在这个手册中没有实现错误句柄，但是在[real world example](http://redux.js.org/docs/introduction/Examples.html#real-world)中应用了一种实现。

### 设计State模型 (Designing the State Shape)

与在基本手册中的一样，在实现之前你需要[设计你应用的state模型](http://redux.js.org/docs/basics/Reducers.html#designing-the-state-shape)。在异步代码中，有更多的state需要管理，我们需要认真思考下。

这部分往往初学者比较困惑，因为没有明确清晰的说明在一个异步应用中有什么描述状态信息，并且如何将它们组织到一个单一的状态树中。

我们已最常用的例子开始：列表页。Web应用通常会用列表展现一些数据。举些例子，帖子的列表，好友的列表。你需要列出你应用中需要哪些列表。将它们分离存储到state中，这样你可以缓存它们在需要时只需要重新抓取下数据。

下面是我们的“Reddit headlines”应用的state模型：

```javascript
{
    selectedSubreddit: 'frontend',
    postsBySubreddit: {
        frontend: {
            isFetching: true,
            didInvalidate: false,
            items: []
        },
        reactjs: {
            isFetching: false,
            didInvalidate: false,
            lastUpdated: 143947885562545,
            items: [
                {
                    id: 42,
                    title: 'Confusion about Flux and Relay'
                },
                {
                    id: 500,
                    title: 'Creating a Simple Application Using React JS and Flux Architecture'
                }
            ]
        }
    },
}
```

有几点需要注意下：

- 我们将每一个subreddit的数据存储起来，这样可以缓存所有的subreddit。当用户在它们之间切换时，更新将在一瞬间完成，而且我们不需要重新拉取数据除非我们需要。不要为这些数据存储到内存担心：除非你处理的数据有成千上万条，并且你的用户极少的关闭tab页，否则你不要做任何清理。

- 在这些列表的条目中，我们保存一个`isFething`属性用来显示一个loading，`didInvalidate`属性用来当数据是旧的数据时可以触发它，`lastUpdated`属性保存最后一次拉取的时间，和一个`items`列表本身。在真实的应用中，你也许会存储分页状态像`fetchedPageCount`和`nextPageUrl`。

> 在嵌套对象中需要注意的点
>
> 在本例中我们将接收到的条目与分页信息一起存储。然而这种处理在相互引用的嵌套对象中或者条目是可以编辑时工作不好。想象下用户要编辑拉取到的帖子，但是这个帖子在状态树中存在相同的副本。这样实现起来相当痛苦。
>
> 假如你存在嵌套对象，或者你需要用户编辑接收到的条目，你需要将它们独立保存在状态树中就像它是一个数据库一样(as if...就像...一样)。在分页信息中，你需要做的仅仅是通过它们的ID来引用它们。这样你可以保证它们任何时候都是最新的。[real world example](http://redux.js.org/docs/introduction/Examples.html#real-world)中展示了这种实现，并使用了[normalizr](https://github.com/gaearon/normalizr)常规化了嵌套API响应的数据。使用这种实现，你的`state`将会像这样：
> ```javascript
> {
>   selectedSubreddit: 'frontend',
>   entities: {
>     users: {
        2: {
            id: 2,
            name: 'Andrew'
        }
      },
      posts: {
        42: {
            id: 42,
            title: 'Confusion about Flux and Relay',
            author: 2
        },
        100: {
            id: 100,
            title: 'Creating a Simple Application Using React JS and Flux Architecure',
            author: 2
        }
      }
>   },
    postsBySubreddit: {
        frontend: {
            isFetching: true,
            didInvalidate: false,
            items: []
        },
        reactjs: {
            isFetching: false,
            didInvalidate: false,
            lastUpdated: 143947885545,
            items: [42, 100]
        }
    }
> }
> ```
> 在这里我们不会使用常规化实体，这些是创建一个更动态应用需要考虑的事情。

### 处理Action (Handling Actions)

在进入配合网络请求分发action的具体操作之前，我们先为我们上面定义的action编写对应的reducer。

> 合成Reducer的说明
> 这里我们假定我们理解使用`combineReducers()`来合成reducer，在基础部分的分割reducer部分有详细的描述说明，如果你不清楚，请先返回到哪里去阅读先

**`reducers.js`**

```javascript
import {combineReducers} from 'redux';
import {
    SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
    REQUEST_POSTS, RECEIVE_POSTS
} FROM '../actions';

function selectedSubreddit(state = 'reactjs', action) {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit;
        default:
            return state;
    }
}

function posts(state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
            return Object.assign({}, state, {
                didInvalidate: true
            });

    }
}
```

## 异步流 (Async Flow)
## 中间件 (Middleware)
## 配合React Router使用
