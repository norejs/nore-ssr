import React, { useEffect } from 'react';

import store from '../../app/store';
const { dispatch } = store;
export function Counter() {
    const [count, setCount] = React.useState(store.getState().value);
    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            console.log('store.getState()', store.getState());
            setCount(store.getState().value);
        });
        return unsubscribe;
    });
    return (
        <div>
            <div>
                <button
                    aria-label="Increment value"
                    onClick={() => dispatch({ type: 'increment' })}
                >
                    Increment
                </button>
                <span>{count}</span>
                <button
                    aria-label="Decrement value"
                    onClick={() => dispatch({ type: 'decrement' })}
                >
                    Decrement
                </button>
            </div>
        </div>
    );
}
