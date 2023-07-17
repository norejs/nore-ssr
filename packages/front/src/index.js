import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './AppClient';
import reportWebVitals from './reportWebVitals';
import store from './app/store';
// import { Provider } from 'react-redux';

if (process.env.NODE_ENV === 'development') {
    const { worker } = require('./mock/browser');
    worker.start();
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
