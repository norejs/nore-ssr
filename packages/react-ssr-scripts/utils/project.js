const path = require('path');
const fs = require('fs-extra');

function getProjectNodeModules(npmPkgName, filePath = '') {
    const projectRoot = process.cwd();
    const nodeModules = path.resolve(projectRoot, 'node_modules');
    const npmPkgPath = path.resolve(nodeModules, npmPkgName);
    return npmPkgPath + filePath;
}

function getProjectRelativePath(filePath) {
    const projectRoot = process.cwd();
    return path.resolve(projectRoot, filePath);
}

async function isEjected(projectRoot) {
    const configPath = path.resolve(projectRoot, 'config');
    const scriptsPath = path.resolve(projectRoot, 'scripts');
    return (await fs.exists(configPath)) && (await fs.exists(scriptsPath));
}
function requireFromProject(npmPkgName) {
    const nodeModules = getProjectNodeModules(npmPkgName);
    try {
        return require(nodeModules);
    } catch (error) {
        return undefined;
    }
}

function requireFromProjectRoot(filename) {
    const nodeModules = getProjectRelativePath(filename);
    try {
        return require(nodeModules);
    } catch (error) {
        return undefined;
    }
}

module.exports = {
    getProjectNodeModules,
    isEjected,
    requireFromProject,
    getProjectRelativePath,
    requireFromProjectRoot,
};
