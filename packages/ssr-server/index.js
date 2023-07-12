// 启动express 服务器
const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const app = express();
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
console.log(createProxyMiddleware);
const server = http.createServer(app);

const { renderToString } = require('../front/node_modules/react-dom/server');
const React = require('../front/node_modules/react');

const csrUrl = 'http://localhost:3000';
const renderEntry = '../front/build/ssr/main.js';
const proxy = httpProxy.createProxyServer({ target: csrUrl, ws: true });
const App = require(renderEntry).default;
const routes = require(renderEntry).routes;
console.log('routes', routes);
app.use('/*', async (req, res, next) => {
    const appString = renderToString(
        React.createElement(App, {
            location: req.originalUrl,
        })
    );
    if (!appString) {
        return next();
    }
    // 通过csrUrl 获取csr的html
    const csrHtml = await new Promise((resolve, reject) => {
        require('http').get(csrUrl, (res) => {
            let html = '';
            res.on('data', (chunk) => {
                html += chunk;
            });
            res.on('end', () => {
                resolve(html);
            });
        });
    });

    const data = csrHtml
        // .replace('<head>', `<head><base href="${csrUrl}"/>`)
        .replace('<div id="root">', `<div id="root">${appString}`);
    return res.send(data);
});

app.use('/*', createProxyMiddleware({ target: csrUrl, changeOrigin: true }));

server.on('upgrade', function (req, socket, head) {
    console.log('proxying upgrade request', req.url);
    proxy.ws(req, socket, head);
});

server.listen(3001, () => {
    console.log('server start at 3001', 'http://localhost:3001');
});
