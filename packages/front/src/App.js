import React from 'react';
import { StaticRouter as Router } from 'react-router-dom';
import createRouter from './router';
export { routes } from './router';
export default function App({ location }) {
    return (
        <React.StrictMode>
            <Router location={location}>{createRouter()}</Router>
        </React.StrictMode>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals