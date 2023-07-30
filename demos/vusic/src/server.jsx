import React from 'react';
import ReactDom from 'react-dom/server';
import App from './app/App';
import './index.scss';
import { createStore } from 'redux';
import reducers from './reducers/reducer';
import { Provider } from 'react-redux';
import { ServerStyleSheets } from '@material-ui/core/styles';

// This is the server-side entry point.
export default async function renderApp(req) {
    const store = createStore(reducers, {});
    const sheets = new ServerStyleSheets();
    const html = ReactDom.renderToString(
        sheets.collect(
            <Provider store={store}>
                <App location={req.originalUrl} />
            </Provider>
        )
    );
    const css = sheets.toString();
    const preloadedState = store.getState();
    return { html, preloadedState, css };
}
