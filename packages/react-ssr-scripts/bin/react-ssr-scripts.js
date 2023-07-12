#!/usr/bin/env node
'use strict';
const program = require('commander');

program
    .command('start')
    .option('--version <version>', 'start version')
    .action((options, command) => {
        require('../scripts/start')(options);
    });

program.parse(process.argv);
