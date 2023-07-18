// 启动express 服务器
const renderApp = require('../Vusic/build/ssr/main.js').default;
const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const server = http.createServer(app);

const csrUrl = 'http://localhost:3000';
const proxy = httpProxy.createProxyServer({ target: csrUrl, ws: true });

async function getCSRHtml() {
    let html = await fetchFile(csrUrl);
    const manifestJson = require('../vusic/build/ssr/asset-manifest.json');
    try {
        if (manifestJson?.files['main.css']) {
            html = html.replace(
                '</head>',
                `<link  rel="stylesheet" href="${manifestJson?.files['main.css']}"></link></head>`
            );
        }
    } catch (error) {
        console.log('error', error);
    }

    return html;
}
const fileCache = {};
function fetchFile(fileUrl) {
    return new Promise((resolve, reject) => {
        if (fileCache[fileUrl]) {
            return resolve(fileCache[fileUrl]);
        }
        require('http').get(fileUrl, (res) => {
            let fileContent = '';
            res.on('data', (chunk) => {
                fileContent += chunk;
            });
            res.on('end', () => {
                fileCache[fileUrl] = fileContent;
                resolve(fileContent);
            });
        });
    });
}

function runInMockWindow(fun, ...args) {
    const global = new Proxy(
        { globalThis },
        {
            get(target, key) {
                console.log('key', key);
                if (key === 'window') {
                    return target;
                }
                return target[key];
            },
        }
    );
    let res;
    with (global) {
        res = fun(...args);
    }
    return res;
}

app.get('/*', async (req, res, next) => {
    // 有后缀名或者是静态资源不处理
    if (
        req.originalUrl.indexOf('.') > -1 ||
        req.originalUrl.startsWith('/static')
    ) {
        return next();
    }
    const { preloadedState, html, css } = await renderApp(req);
    const appString = html;
    if (!appString) {
        return next();
    }
    // 通过csrUrl 获取csr的html
    const csrHtml = await getCSRHtml();
    const initialState = preloadedState;
    const data = csrHtml
        .replace('</head>', `<style>${css}</style></head>`)
        .replace(
            '<div id="root">',
            `<div id="root"><script>window._INIT_STORE_STATE=${JSON.stringify(
                initialState
            )}</script>${appString}`
        );
    return res.send(data);
});
app.use(express.static(path.resolve('../vusic/build/ssr/')));
app.use('/*', createProxyMiddleware({ target: csrUrl, changeOrigin: true }));

server.on('upgrade', function (req, socket, head) {
    console.log('proxying upgrade request', req.url);
    proxy.ws(req, socket, head);
});

server.listen(3001, () => {
    console.log('server start at 3001', 'http://localhost:3001');
});
