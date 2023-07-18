const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { merge } = require('webpack-merge');
const {
    requireFromProjectRoot,
    requireFromProject,
} = require('../utils/project');
const { type } = require('os');
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
const MiniCssExtractPlugin = requireFromProject('mini-css-extract-plugin');
module.exports = function (baseConfig, webpackEnv = 'development') {
    // 去掉多余的插件
    baseConfig.plugins = baseConfig.plugins.filter((plugin) => {
        return !ssrDisablePlugins.includes(plugin.constructor.name);
    });
    baseConfig.plugins.push(
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        })
    );
    const projectRoot = process.cwd();
    // 替换style-loader
    const rules = baseConfig.module.rules[1].oneOf;
    rules.forEach((rule) => {
        if (rule.test?.toString().includes('css')) {
            rule.use.forEach((use, index) => {
                console.log('use', use);
                if (typeof use === 'string' && use.includes('style-loader')) {
                    rule.use[index] = {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    };
                } else if (use.loader?.includes('style-loader')) {
                    rule.use[index] = {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    };
                }
            });
        }
        return rule;
    });

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
        module: {
            rules: [
                {
                    test: /\.css$/,
                },
            ],
        },
        target: 'node',
        externals: [nodeExternals()],
    });
};
