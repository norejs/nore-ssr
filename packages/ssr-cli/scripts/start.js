// 读取项目中的配置，监测当前项目是否react-scripts 项目
const { runSh, getProjectConfig } = require('@norejs/ssr-utils');
const chalk = require('chalk');
const path = require('path');
const concurrently = require('concurrently');
// const ssrBuilder = require('@norejs/ssr-builder');

module.exports = function start(options, webpackEnv = 'development') {
    const command = webpackEnv === 'development' ? 'start' : 'build';
    const config = getProjectConfig();
    // 如何兼容CSR 命令
    const { result } = concurrently([
        {
            command: getBinPath('react-scripts') + ' ' + command,
            name: 'client',
        },
        {
            command:
                getBinPath(
                    'norejs-ssr-builder',
                    path.resolve(__dirname, '../')
                ) +
                ' ' +
                command,
            name: 'server',
        },
    ]);
    result.then((res) => {});
    let loaded = 0;
    setTimeout(() => {
        loaded++;
        loaded++;
        // startServer();
    }, 5000);
    let server;
    function startServer() {
        
        if (!server && loaded === 2 && webpackEnv === 'development') {
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

    function getBinPath(name, start = process.cwd()) {
        const fs = require('fs');
        const binPath = path.resolve(start, './node_modules/.bin', name);
        if (fs.existsSync(binPath)) {
            return binPath;
        }
        if (start === '/') {
            return '';
        }
        return getBinPath(name, path.resolve(start, '../'));
    }
    // 运行服务端
};
