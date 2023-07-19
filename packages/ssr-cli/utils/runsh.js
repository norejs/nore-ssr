const { spawn } = require('child_process');
/**
 * 运行command 在控制台输出，支持彩色，没有长度限制
 * @param execStr {String} 命令
 * @param options {Object} 配置
 * @param options.print {Boolean} 是否打印
 * @param callback {(code,data)=>{}} 回调函数
 *  */
const noop = (...props) => {};
module.exports = function runSh(execStr, options = {}, callback = noop) {
    const hasCallback = callback !== noop;
    const defaultOptions = { print: true };
    const args = execStr.split(' ');
    const command = args.shift();
    const { print = true } = defaultOptions;
    options = Object.assign(defaultOptions, options || {}, {
        stdio: print && !hasCallback ? 'inherit' : 'pipe',
    });
    const childProcess = spawn(command, args, options);
    if ((hasCallback || print) && childProcess.stdout) {
        const runCallback = (code, steam) => {
            try {
                const data =
                    steam instanceof Buffer ? steam.toString('utf8') : steam;
                callback(code, data);
            } catch (error) {
                callback('error', error);
            }
        };

        childProcess.stdout.on('data', (steam) => {
            runCallback('data', steam);
        });

        childProcess.stderr.on('data', (steam) => {
            runCallback('error', steam);
        });

        childProcess.stderr.on('close', (steam) => {
            runCallback('close', steam);
        });
    }
    return childProcess;
};
