const deepAssign = require('./deep-assign');
const project = require('./project');
const runSh = require('./runsh');
module.exports = { deepAssign, ...project, runSh };
