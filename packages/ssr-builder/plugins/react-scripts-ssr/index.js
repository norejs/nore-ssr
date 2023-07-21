const fs = require('fs-extra');
const { getNpmPathFromCwd, getFilePathFromCwd } = require('@norejs/ssr-utils');

const runWebpack = require('../../utils/run-webpack');

module.exports = function start(
    options,
    ssrConfig,
    webpackEnv = 'development'
) {
    process.env.NODE_ENV = webpackEnv;
    process.env.BABEL_ENV = webpackEnv;
    const isDev = webpackEnv === 'development';
    // 获取react-scripts 的配置
    const projectWebpackConfigPath =
        getWebpackFile('webpack.config.js') ||
        getWebpackFile('webpack.config.' + (isDev ? 'dev' : 'prod') + '.js');
    console.log('projectWebpackConfigPath', projectWebpackConfigPath);
    let baseWebpackConfig = require(projectWebpackConfigPath);
    if (typeof baseWebpackConfig === 'function') {
        baseWebpackConfig = baseWebpackConfig(webpackEnv);
    }
    const ssrWebpackConfigFactory = getSSRWebpackConfig();
    if (typeof ssrWebpackConfigFactory !== 'function') {
        throw new Error('webpack.ssr.config.js should export a function');
    }
    const webpackConfig = ssrWebpackConfigFactory(
        baseWebpackConfig,
        ssrConfig,
        webpackEnv
    );
    return runWebpack(webpackConfig, webpackEnv);
};
/**
 * 获取ssr的webpack配置
 * @returns
 */
function getSSRWebpackConfig() {
    const webpackConfigPath = getFilePathFromCwd(
        'config/webpack.ssr.config.js'
    );
    if (fs.existsSync(webpackConfigPath)) {
        return require(webpackConfigPath);
    }

    return require('./config/webpack.ssr.config');
}

/**
 * 获取项目中的webpack配置
 * */
function getWebpackFile(webpackFileName) {
    const projectWebpackConfigPath = getFilePathFromCwd(
        'config/' + webpackFileName
    );
    if (fs.existsSync(projectWebpackConfigPath)) {
        return projectWebpackConfigPath;
    }
    const webpackConfigPath = getNpmPathFromCwd(
        'react-scripts/config/' + webpackFileName
    );
    if (!fs.existsSync(webpackConfigPath)) {
        return null;
    }
    return webpackConfigPath;
}
