import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StaticRouter } from 'react-router-dom/server';

export default function renderApp(req) {
    const html = ReactDOM.renderToString(
        <App isSSR={true} location={req.originalUrl} SSRRouter={StaticRouter} />
    );
    return { html };
}
