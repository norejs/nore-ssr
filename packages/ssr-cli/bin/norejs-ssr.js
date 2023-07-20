#!/usr/bin/env node
'use strict';
const program = require('commander');

program.command('start').action((options, command) => {
    require('../scripts/start')(options, 'development');
});

program.command('build').action((options, command) => {
    require('../scripts/start')(options, 'production');
});

program.command('serve').action((options, command) => {
    require('../scripts/serve')(options, 'production');
});

program.parse(process.argv);
