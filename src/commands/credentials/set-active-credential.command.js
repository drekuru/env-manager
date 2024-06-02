/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const { ConfigManager } = require('../../config');

/**
 * @description - Sets the active credential
 * @param {Object} options - The options object
 * @param {String} options.name - The name of the credential
 */
module.exports = async function setActiveCredential(name) {
    const exists = CredentialManager.getCredential(name);

    if (!exists) {
        console.error(chalk.red(`Credential ${name} does not exist`));
        return;
    }

    const config = ConfigManager.config;

    config.activeCredential = name;

    ConfigManager.updateConfig(config);

    console.log(chalk.green(`Active credential set to ${name}`));
};
