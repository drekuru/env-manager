/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const { ConfigManager } = require('../../config');

/**
 * @description - Sets the active credential
 * @param {Object} options - The options object
 * @param {Boolean} options.verbose - Whether to print the active credential values
 */
module.exports = async function getActiveCredential(options) {
    const config = ConfigManager.config;

    if (!config.activeCredential) {
        console.error(chalk.red('No active credential set'));
        return;
    }

    console.log(chalk.magentaBright(`Active credential: ${config.activeCredential}`));

    if (options.verbose === true) {
        console.table(CredentialManager.getActiveCredentials());
    }
};
