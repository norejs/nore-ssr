// 启动express 服务器
const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
console.log(createProxyMiddleware);
const server = http.createServer(app);

const { renderToString } = require('../front/node_modules/react-dom/server');
const React = require('../front/node_modules/react');

const csrUrl = 'http://localhost:3000';
const renderEntry = '../front/build/ssr/main.js';
const proxy = httpProxy.createProxyServer({ target: csrUrl, ws: true });
const App = require(renderEntry).default;

let CSRHtml = '';
function getCSRHtml() {
    if (CSRHtml) {
        return Promise.resolve(CSRHtml);
    }
    return new Promise((resolve, reject) => {
        require('http').get(csrUrl, (res) => {
            let html = '';
            res.on('data', (chunk) => {
                html += chunk;
            });
            res.on('end', () => {
                CSRHtml = html;
                resolve(html);
            });
        });
    });
}

app.get('/*', async (req, res, next) => {
    // 有后缀名或者是静态资源不处理
    if (
        req.originalUrl.indexOf('.') > -1 ||
        req.originalUrl.startsWith('/static')
    ) {
        return next();
    }
    const appString = renderToString(
        React.createElement(App, {
            location: req.originalUrl,
        })
    );
    if (!appString) {
        return next();
    }
    // 通过csrUrl 获取csr的html
    const csrHtml = await getCSRHtml();

    const data = csrHtml.replace(
        '<div id="root">',
        `<div id="root">${appString}`
    );
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
