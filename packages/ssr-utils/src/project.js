const path = require('path');
const fs = require('fs-extra');
const deepAssign = require('./deep-assign');
const defaultConfig = require('./config');
/**
 * 获取项目中的npm包路径
 * @param {*} npmPkgName
 * @param {*} filePath
 * @returns
 */
function getNpmPathFromCwd(npmPkgName, projectRoot = process.cwd()) {
    const nodeModules = path.resolve(projectRoot, 'node_modules');
    const npmPkgPath = path.resolve(nodeModules, npmPkgName);
    if (fs.existsSync(npmPkgPath)) {
        return npmPkgPath;
    }
    const parentPath = path.resolve(projectRoot, '../');
    if (parentPath === projectRoot) {
        return '';
    }
    return getNpmPathFromCwd(npmPkgName, parentPath);
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

/**
 * 获取项目中的bin路径
 * @param {*} name
 * @param {*} start
 * @returns
 */
function getBinPath(name, start = process.cwd()) {
    const binPath = path.resolve(start, './node_modules/.bin', name);
    if (fs.existsSync(binPath)) {
        return binPath;
    }
    if (start === '/') {
        return '';
    }
    return getBinPath(name, path.resolve(start, '../'));
}

module.exports = {
    getNpmPathFromCwd,
    requireNpmFromCwd,
    getFilePathFromCwd,
    requireFromCwd,
    getProjectConfig,
    getBinPath,
};
