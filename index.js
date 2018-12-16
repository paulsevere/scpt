#!/usr/bin/env node

const findRoot = require('find-root');
const path = require('path');
const fs = require('fs');
const { red, blue } = require('chalk');

const updateScripts = ({ name, script }, { f }) => {
  const pkgJSON = path.resolve(findRoot(process.cwd()), 'package.json');
  if (fs.existsSync(pkgJSON)) {
    const pkgObj = fs.readJSONSync(pkgJSON);
    if (!pkgObj.scripts) {
      pkgObj.scripts = {};
    }
    if (pkgObj.scripts[name] && !f) {
      console.log(`${blue(name)} ${red('already exists! Choose another name or rerun command with -f!')}`);
    }
    pkgObj.scripts[name] = script.includes('.js') ? `node ${script}` : script;
    fs.writeFileSync(pkgJSON, JSON.stringify(pkgObj, null, 2) + '\n');
  }
};

const prog = require('caporal');
prog
  .version('1.3.0')
  .command('add', 'Add an npm script from the command line')
  .argument('<name>', 'Name of the script (eg. npm run <name>')
  .argument('<script>', 'A literal shell command or a path to an executable file')
  .option('-f', 'Overwrite existing scripts')

  .action(function(args, options, logger) {
    updateScripts(args, options);
  });

prog.parse(process.argv);
