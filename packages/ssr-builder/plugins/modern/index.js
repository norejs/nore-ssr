const { createBuilder } = require('@modern-js/builder');
const {
    builderWebpackProvider,
} = require('@modern-js/builder-webpack-provider');
// const nodeExternals = require('webpack-node-externals');
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
            output: {
                distPath: {
                    root: ssrConfig.dist,
                },
            },
            tools: {
                webpack: (config, { env }) => {
                    console.log('webpack config', config);
                    config.output.libraryTarget = 'commonjs';
                    // config.externals = [nodeExternals()];
                },
            },
            // some configs
        },
    });
    const builder = await createBuilder(provider, {
        cwd: process.cwd(),
        entry: { main: path.resolve(projectRoot, ssrConfig.entry) },
        target: 'node',
    });

    await builder.build({
        mode: webpackEnv,
        watch: webpackEnv === 'development',
    });
};
