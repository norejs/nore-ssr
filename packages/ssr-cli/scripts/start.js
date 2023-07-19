// 读取项目中的配置，监测当前项目是否react-scripts 项目
const {
    getProjectConfig,
    isReactScriptsInstalled,
} = require('../utils/project');
const { default: runSh } = require('../utils/runsh');

module.exports = function start(options, webpackEnv = 'development') {
    const config = getProjectConfig();
    // 运行客户端
    if (isReactScriptsInstalled) {
        runSh(
            'react-scripts ' + webpackEnv ? 'start' : 'build',
            {},
            function (data) {
                console.log(data);
            }
        );
    }
    if (config.ssr) {
        runSh(
            'nore-ssr-builder ' + webpackEnv ? 'start' : 'build',
            {},
            function (code, data) {
                console.log(data);
            }
        );
        if (webpackEnv === 'development') {
            const SSRServer = require('@norejs/ssr-server');
            // 传入客户端的端口号
            const server = new SSRServer(config, webpackEnv);
        }
    }
    // 运行服务端
};
