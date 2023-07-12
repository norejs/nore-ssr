import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import createRouter from './router';

export default function App() {
    return (
        <React.StrictMode>
            <Router>{createRouter()}</Router>
        </React.StrictMode>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
