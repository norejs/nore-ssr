const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const {
    requireFromProjectRoot,
    requireFromProject,
} = require('../utils/project');
// 去掉HTMLWebpackPlugin
const ssrDisablePlugins = [
    'HtmlWebpackPlugin',
    'InlineChunkHtmlPlugin',
    'HotModuleReplacementPlugin',
    'ManifestPlugin',
    'ReactRefreshWebpackPlugin',
];
const getClientEnv =
    requireFromProjectRoot('config/env') ||
    requireFromProject('react-scripts/config/env');
const env = getClientEnv()?.raw || {};
module.exports = function (baseConfig, webpackEnv = 'development') {
    // 去掉多余的插件
    baseConfig.plugins = baseConfig.plugins.filter((plugin) => {
        return !ssrDisablePlugins.includes(plugin.constructor.name);
    });
    const projectRoot = process.cwd();

    // 读取env文件，或者自定义
    return merge(baseConfig, {
        entry: { main: '/' + env.REACT_APP_SSR_ENTRY ?? 'src/App.js' },
        output: {
            filename: '[name].js',
            path: path.resolve(
                projectRoot,
                env.REACT_APP_SSR_DIST ?? 'build/ssr'
            ),
            libraryTarget: 'commonjs',
        },
        optimization: {
            minimize: false,
            splitChunks: false,
            runtimeChunk: false,
        },
        target: 'node',
        externals: [nodeExternals()],
    });
};
