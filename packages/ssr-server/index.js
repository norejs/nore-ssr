// 导出一个函数，用于启动express 服务器
// 需要的参数：环境变量，CSR服务器地址，SSR端口号，CSR入口文件地址
// 启动express 服务器
const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs-extra');
module.exports = function SSRServer(config, envName, cb) {
    function getPathFromSSRDsit(...args) {
        return path.resolve(process.cwd(), config.ssr.dist, ...args);
    }
    function getPathFromCSRDist(...args) {
        return path.resolve(process.cwd(), config.csr.dist, ...args);
    }
    const ssrEntry = getPathFromSSRDsit('server.js');
    const ssrManifest = getPathFromSSRDsit('asset-manifest.json');
    const ssrPort = config.ssr.port || 8080;
    const renderApp = require(ssrEntry).default;
    const app = express();
    const server = http.createServer(app);
    const csrUrl = config.csrUrl;
    if (csrUrl) {
        const proxy = httpProxy.createProxyServer({ target: csrUrl, ws: true });
        server.on('upgrade', function (req, socket, head) {
            console.log('proxying upgrade request', req.url);
            proxy.ws(req, socket, head);
        });
    }

    async function getCSRHtml() {
        let html = '';
        if (csrUrl) {
            html = await fetchFile(csrUrl);
        } else {
            html = await fs.readFile(getPathFromCSRDist('index.html'), 'utf-8');
        }

        try {
            const manifestJson = require(ssrManifest);
            if (manifestJson?.files['main.css']) {
                html = html.replace(
                    '</head>',
                    `<script>
                        window.addEventListener('load', function () {
                            var link = document.getElementById('ssr-main');
                            link.parentNode.removeChild(link);
                        })
                    </script><link id="ssr-main" rel="stylesheet" href="${manifestJson?.files['main.css']}"></link></head>`
                );
            }
        } catch (error) {
            // console.log('error', error);
        }

        return html;
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
                `<script>window._INIT_STORE_STATE=${JSON.stringify(
                    initialState
                )}</script><div id="root">${appString}`
            );
        return res.send(data);
    });
    app.use(express.static(getPathFromSSRDsit()));
    if (csrUrl) {
        app.use(
            '/*',
            createProxyMiddleware({ target: csrUrl, changeOrigin: true })
        );
    } else if (config.csr.dist) {
        app.use(express.static(getPathFromCSRDist()));
    }

    server.listen(ssrPort, () => {
        console.log(`ssr server start: http://localhost:${ssrPort}`);
        cb && cb({ port: ssrPort });
    });
};

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
