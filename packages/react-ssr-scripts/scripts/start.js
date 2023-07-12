const fs = require('fs-extra');
const {
    getProjectNodeModules,
    getProjectRelativePath,
} = require('../utils/project');
const runWebpack = require('../utils/runWebpack');

module.exports = function start(options, webpackEnv = 'development') {
    process.env.NODE_ENV = webpackEnv;
    process.env.BABEL_ENV = webpackEnv;
    // 获取react-scripts 的配置
    const webpackConfigPath = getWebpackFile('webpack.config.js');
    const baseWebpackConfig = require(webpackConfigPath)('production');
    const webpackConfigFactory = getSSRWebpackConfig();
    const webpackConfig = webpackConfigFactory(baseWebpackConfig, webpackEnv);
    return runWebpack(webpackConfig);
};
/**
 * 获取ssr的webpack配置
 * @returns
 */
function getSSRWebpackConfig() {
    const webpackConfigPath = getProjectRelativePath(
        'config/webpack.ssr.config.js'
    );
    if (fs.existsSync(webpackConfigPath)) {
        return require(webpackConfigPath);
    }

    return require('../config/webpack.ssr.config');
}

/**
 * 获取项目中的webpack配置
 * */
function getWebpackFile(webpackFileName) {
    const projectWebpackConfigPath = getProjectRelativePath(
        'config/' + webpackFileName
    );
    if (fs.existsSync(projectWebpackConfigPath)) {
        return projectWebpackConfigPath;
    }
    const webpackConfigPath = getProjectNodeModules(
        'react-scripts',
        '/config/' + webpackFileName
    );
    return webpackConfigPath;
}
