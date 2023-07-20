const path = require('path');
const fs = require('fs-extra');
const defaultConfig = {
    ssr: {
        entry: 'src/server.js',
        dist: 'build-ssr',
        builder: 'react-scripts-ssr',
    },
    csr: {
        dist: 'build',
    },
};
/**
 * 获取项目中的npm包路径
 * @param {*} npmPkgName
 * @param {*} filePath
 * @returns
 */
function getNpmPathFromCwd(npmPkgName) {
    const projectRoot = process.cwd();
    const nodeModules = path.resolve(projectRoot, 'node_modules');
    const npmPkgPath = path.resolve(nodeModules, npmPkgName);
    return npmPkgPath;
}

/**
 *
 * @param {*} filePath
 * @returns
 */
function getFilePathFromCwd(filePath) {
    const projectRoot = process.cwd();
    return path.resolve(projectRoot, filePath);
}

async function isReactScriptsInstalled() {
    const reactScriptsPath = getNpmPathFromCwd('react-scripts');
    return await fs.exists(reactScriptsPath);
}
function getProjectConfig() {
    const projectConfigPath = getFilePathFromCwd('nore.config.js');
    let customConfig = {};
    if (fs.existsSync(projectConfigPath)) {
        customConfig = require(projectConfigPath) || {};
    }
    // 深度合并
    // 深度合并

    return deepAssign({}, defaultConfig, customConfig);
}

function isPlainObject(obj) {
    return (
        typeof obj === 'object' &&
        Object.prototype.toString.call(obj) === '[object Object]'
    );
}
function deepAssign() {
    let len = arguments.length,
        target = arguments[0];
    if (!isPlainObject(target)) {
        target = {};
    }
    for (let i = 1; i < len; i++) {
        let source = arguments[i];
        if (isPlainObject(source)) {
            for (let s in source) {
                if (s === '__proto__' || target === source[s]) {
                    continue;
                }
                if (isPlainObject(source[s])) {
                    target[s] = deepAssign(target[s], source[s]);
                } else {
                    target[s] = source[s];
                }
            }
        }
    }
    return target;
}

/**
 * 当前项目是否运行过eject
 * @param {*} projectRoot
 * @returns
 */
async function isEjected(projectRoot) {
    const configPath = path.resolve(projectRoot, 'config');
    const scriptsPath = path.resolve(projectRoot, 'scripts');
    return (await fs.exists(configPath)) && (await fs.exists(scriptsPath));
}
/**
 * 从项目中加载npm包
 * @param {*} npmPkgName
 * @returns
 */
function requireNpmFromCwd(npmPkgName) {
    const nodeModules = getNpmPathFromCwd(npmPkgName);
    try {
        return require(nodeModules);
    } catch (error) {
        return undefined;
    }
}

/**
 * 从项目中加载某个文件
 * @param {*} filename
 * @returns
 */
function requireFromCwd(filename) {
    const nodeModules = getFilePathFromCwd(filename);
    try {
        return require(nodeModules);
    } catch (error) {
        return undefined;
    }
}

module.exports = {
    getNpmPathFromCwd,
    isEjected,
    requireNpmFromCwd,
    getFilePathFromCwd,
    requireFromCwd,
    getProjectConfig,
    isReactScriptsInstalled,
};
