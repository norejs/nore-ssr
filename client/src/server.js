// index.js
import express from 'express';
import { renderToString } from 'react-dom/server';
import Home from './Home';
import React from 'react';
import Text from './Text';

const app = express();

const content = renderToString(<Home />);
const text = renderToString(<Text text={'hello world!'} />);

app.get('/', function (req, res) {
    res.send(` 
        <html lang=""> 
            <head> 
                <title>ssr</title> 
            </head> 
            <body> 
                <div id="root">${content} ${text}</div> 
            </body> 
        </html> `);
});
