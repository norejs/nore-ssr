// 启动服务器
const chalk = require('chalk');
const SSRServer = require('@norejs/ssr-server');
const { getProjectConfig } = require('@norejs/ssr-utils');
module.exports = function start(options, webpackEnv = 'development') {
    const config = getProjectConfig();
    Object.assign(config, options || {});
    new SSRServer(config, webpackEnv, function ({ port }) {
        console.log(
            chalk.green('Starting SSR server at http://localhost:' + port)
        );
    });
};

