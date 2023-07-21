const { getProjectConfig } = require('@norejs/ssr-utils');
const { createBuilder } = require('@modern-js/builder');
const { builderWebpackProvider } = require('@modern-js/builder-webpack-provider');
const path = require('path');
const projectRoot = process.cwd();

module.exports = async function start(
    options,
    ssrConfig,
    webpackEnv = 'development'
) {
    // 使用modern builder 构建项目
    const provider = builderWebpackProvider({
        builderConfig: {
            // some configs
        },
    });
    const builder = await createBuilder(provider, {
        cwd: process.cwd(),
        entry: { main: path.resolve(projectRoot, ssrConfig.entry) },
        target: 'node',
        output: {
            path: ssrConfig.dist,
            filename: 'server.js',
            path: path.resolve(projectRoot, ssrConfig.dist),
            libraryTarget: 'commonjs',
        },
    });
    
    await builder.build();
};
