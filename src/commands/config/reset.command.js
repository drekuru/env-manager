/* eslint-disable no-console */

const chalk = require('chalk');
const { PathManager } = require('../../config');
const Utils = require('../../utils');

module.exports = async function reset() {
    const ui = Utils.createInterface();

    const confirmed = await ui.question('Are you sure you want to reset the env manager? (y/n)\n: ');
    ui.close();

    if (Utils.isYes(confirmed)) {
        PathManager.teardown();
        console.log(chalk.red('Env manager has been reset'));
    } else {
        console.log(chalk.yellow('Reset operation cancelled'));
    }
};
