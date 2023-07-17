// 一个简单的全局数据管理
export function createStore(reducer, initState) {
    let state = initState;
    let listeners = [];
    function subscribe(listener) {
        listeners.push(listener);
        return function () {
            listeners = listeners.filter((item) => item !== listener);
        };
    }
    function dispatch(action) {
        state = reducer(state, action);
        console.log('state', state);
        for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
        }
    }
    function getState() {
        return state;
    }
    return {
        subscribe,
        dispatch,
        getState,
    };
}
