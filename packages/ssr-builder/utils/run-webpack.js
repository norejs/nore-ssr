const { requireNpmFromCwd } = require('@norejs/ssr-utils');
const webpack = requireNpmFromCwd('webpack');
const chalk = require('react-dev-utils/chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');

// TODO:展示进度条
// TODO: 展示结果
module.exports = function runWebpack(config, webpackEnv = 'development', cb) {
    const isDev = webpackEnv === 'development';
    isDev ? start(config, cb) : build(config, cb);
};
function start(config) {
    const compiler = webpack(config);
    compiler.watch({}, (err, stats) => {
        if (err) {
            return printBuildError(err);
        }
        const messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true })
        );
        if (messages.errors.length) {
            return printBuildError(new Error(messages.errors.join('\n\n')));
        }
        if (messages.warnings.length) {
            console.log(chalk.yellow(messages.warnings.join('\n\n')));
        }
        console.log(chalk.green('SSR Compiled successfully.'));
    });
}

function build(config) {
    const compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let messages;
            if (err) {
                if (!err.message) {
                    return reject(err);
                }
                let errMessage = err.message;
                messages = formatWebpackMessages({
                    errors: [errMessage],
                    warnings: [],
                });
            } else {
                messages = formatWebpackMessages(
                    stats.toJson({
                        all: false,
                        warnings: true,
                        errors: true,
                    })
                );
            }
            if (messages.errors.length) {
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }
            const resolveArgs = {
                stats,
                previousFileSizes: 0,
                warnings: messages.warnings,
            };
            return resolve(resolveArgs);
        });
    })
        .then(
            ({ warnings }) => {
                if (warnings.length) {
                    console.log(chalk.yellow('Compiled with warnings.\n'));
                    console.log(warnings.join('\n\n'));
                } else {
                    console.log(chalk.green('Compiled successfully.\n'));
                }
            },
            (err) => {
                const tscCompileOnError =
                    process.env.TSC_COMPILE_ON_ERROR === 'true';
                if (tscCompileOnError) {
                    console.log(
                        chalk.yellow(
                            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
                        )
                    );
                    printBuildError(err);
                } else {
                    console.log(chalk.red('Failed to compile.\n'));
                    printBuildError(err);
                    process.exit(1);
                }
            }
        )
        .catch((err) => {
            if (err && err.message) {
                console.log(err.message);
            }
            process.exit(1);
        });
}
