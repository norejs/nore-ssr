const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


// 去掉HTMLWebpackPlugin
const ssrDisablePlugins = [
    'HtmlWebpackPlugin',
    'ReactRefreshPlugin',
    'InlineChunkHtmlPlugin',
    'HotModuleReplacementPlugin',
    'ManifestPlugin',
    'ReactRefreshWebpackPlugin',
];



module.exports = function (baseConfig, ssrConfig, webpackEnv = 'development') {
    // 去掉多余的插件
    baseConfig.plugins = baseConfig.plugins.filter((plugin) => {
        return !ssrDisablePlugins.includes(plugin.constructor.name);
    });
    if (
        !baseConfig.plugins.find(
            (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
        )
    ) {
        baseConfig.plugins.push(
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            })
        );
    }

    const projectRoot = process.cwd();
    // 替换style-loader
    const rules = baseConfig.module.rules[1].oneOf;
    rules.forEach((rule) => {
        if (rule.test?.toString().includes('css')) {
            rule.use.forEach((use, index) => {
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
    const ssrWebpackConfig = merge(baseConfig, {
        entry: { main: path.resolve(projectRoot, ssrConfig.entry) },
        output: {
            filename: 'server.js',
            path: path.resolve(projectRoot, ssrConfig.dist),
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
    console.log('ssrWebpackConfig', ssrWebpackConfig);
    return ssrWebpackConfig;
};
