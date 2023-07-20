// 读取项目中的配置，监测当前项目是否react-scripts 项目

const {
    getProjectConfig,
    isReactScriptsInstalled,
} = require('../utils/project');
const runSh = require('../utils/runsh');
const chalk = require('chalk');
const path = require('path');
module.exports = function start(options, webpackEnv = 'development') {
    const config = getProjectConfig();
    // 运行客户端
    let loaded = 0;
    const childProcess = [];
    if (isReactScriptsInstalled) {
        childProcess.push(
            runSh(
                'react-scripts ' +
                    (webpackEnv === 'development' ? 'start' : 'build'),
                {
                    print: false,
                },
                function (code, data = '') {
                    if (data && typeof data === 'string') {
                        if (data.indexOf('localhost:') > -1) {
                            // 匹配端口号
                            const port = data.match(/localhost:(\d+)/)[1];
                            config.csrUrl = `http://localhost:${port}`;
                            startServer();
                        } else {
                            console.log('CLIENT:', data);
                        }
                        if (
                            webpackEnv === 'production' &&
                            data.indexOf('Compiled successfully') > -1
                        ) {
                            startServer();
                        }
                    }
                }
            )
        );
    }
    if (config.ssr) {
        childProcess.push(
            runSh(
                path.resolve(
                    __dirname,
                    '../node_modules/.bin/norejs-ssr-builder'
                ) +
                    ' ' +
                    (webpackEnv === 'development' ? 'start' : 'build'),
                {},
                function (code, data = '') {
                    if (data && typeof data === 'string') {
                        console.log('SERVER:', data);
                        if (data.indexOf('Compiled successfully') > -1) {
                            startServer();
                        }
                    }
                }
            )
        );
    }
    let server;
    function startServer() {
        loaded++;
        console.log('loaded', loaded);
        if (!server && loaded === 2) {
            console.log(chalk.green('Starting SSR server...'));
            const SSRServer = require('@norejs/ssr-server');
            server = new SSRServer(config, webpackEnv, function ({ port }) {
                console.log(
                    chalk.green(
                        'Starting SSR server at http://localhost:' + port
                    )
                );
            });
        }
    }
    process.on('unhandledRejection', (err) => {
        console.log('unhandledRejection', err);
        childProcess.forEach((item) => {
            item.kill();
        });
        process.exit(1);
    });
    // 运行服务端
};
