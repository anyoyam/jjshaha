import {createStore, combineReducers} from "redux";

class testActions {
  static addItem(text) {
    return {
      type: "ADD_ITEM_A",
      text
    };
  }
  static delItemA(index) {
    return {
      type: "REMOVE_ITEM_A",
      index
    }
  }
  static delItem(index) {
    return {
      type: "REMOVE_ITEM",
      index
    }
  }
}


function add(stat = [], action) {
  if (action.type === "ADD_ITEM_A") {
    return [...stat, action.text]
  } else if (action.type === "REMOVE_ITEM_A") {
    let tmp = [...stat];
    tmp.splice(action.index, 1);
    return tmp;
  }
  return stat;
}
function del(stat = [], action) {
  if (action.type === "REMOVE_ITEM") {
    let tmp = [...stat];
    tmp.splice(action.index, 1);
    return tmp;
  }
  return stat;
}


let main = combineReducers({add, del});
let store = createStore(main, {add: [1,2,4,5,6,7], del: ['a', 'b', 'c']});

console.log(store.getState());

let unsubscrite = store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));
store.dispatch(testActions.addItem(Date.now()));


store.dispatch(testActions.delItemA(1));
store.dispatch(testActions.delItemA(3));
store.dispatch(testActions.delItemA(5));
store.dispatch(testActions.delItemA(2));
store.dispatch(testActions.delItemA(4));

store.dispatch(testActions.delItem(1));

unsubscrite();
