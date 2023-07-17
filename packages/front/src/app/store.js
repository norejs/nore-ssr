import { createStore } from '../mini-redux/index.js';
export const actions = {
    increment: 'increment',
    decrement: 'decrement',
};
const store = createStore(
    function (state, action) {
        console.log('action', action, 'state', state);
        switch (action.type) {
            case actions.increment:
                return { value: state.value + 1 };
            case actions.decrement:
                return { value: state.value - 1 };
            default:
                return state;
        }
    },
    { value: 0 }
);
export default store;
