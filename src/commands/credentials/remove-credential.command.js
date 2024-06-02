/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const Utils = require('../../utils');

module.exports = async function removeCredential(name) {
    const exists = CredentialManager.exists(name);
    if (!exists) {
        console.log(chalk.red(`No credentials found for ${name}`));
        return;
    }

    const ui = Utils.createInterface();

    const confirmed = await ui.question(`Are you sure you want to remove credentials for ${name}? (y/n)\n: `);
    ui.close();

    if (Utils.isYes(confirmed)) {
        CredentialManager.removeCredential(name);
        console.log(chalk.green(`Successfully removed credentials for ${name}`));
        return;
    }

    console.log(chalk.yellowBright('Operation cancelled'));
};
