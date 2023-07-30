import React from 'react';
import ReactDom from 'react-dom';
import App from './app/App';
import './index.scss';
import { createStore } from 'redux';
import reducers from './reducers/reducer';
import { Provider } from 'react-redux';

const store = createStore(
    reducers,
    window._INIT_STORE_STATE ||
        (window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__())
);

ReactDom.hydrate(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
