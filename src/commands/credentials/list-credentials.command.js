/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');

module.exports = function listCredentials(options = { unsafe: false, verbose: false }) {
    const credentials = CredentialManager.listCredentials();

    if (credentials.length === 0) {
        console.log(chalk.redBright('No credentials saved. Use `emg creds generate` to generate new credentials.'));
        return;
    }

    for (const c of credentials) {
        if (!options.verbose) {
            console.log(chalk.yellow.bold(`• ${c.name}`));
        } else if (options.unsafe !== true) {
            delete c.password || delete c.key;
            console.table(c);
        } else {
            console.table(c);
        }
    }
};
