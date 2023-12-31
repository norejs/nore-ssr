// 读取项目中的配置，监测当前项目是否react-scripts 项目
const { getProjectConfig } = require('@norejs/ssr-utils');

module.exports = function start(options, webpackEnv = 'development') {
    const config = getProjectConfig();
    if (config.ssr) {
        const builderName = config.ssr.builder || 'modern';
        const builder = require(`../plugins/${builderName}`);
        return builder(options, config.ssr, webpackEnv);
    }
};
