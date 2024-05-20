/* eslint-disable no-console */

const chalk = require('chalk');
const { CredentialManager } = require('../../credentials');
const saveCredential = require('./save-credential.command');

/**
 *
 * @param {Object} options
 * @param {password|key} options.type - The type of credentials to generate, defaults to password
 * @param {String=} options.save - If true will save credentials to the config file
 * @returns {void}
 */
module.exports = async function generateCredentials(options = { type: 'password' }) {
    if (options.type === 'password') {
        const credentials = CredentialManager.generatePassword();
        console.log(chalk.green('Generated password:'), chalk.red(credentials.password));
        await saveCredential(credentials, options.save, options.type);
    } else {
        const credentials = CredentialManager.generateKeyAndIv();
        console.log(chalk.green('Generated key:'), chalk.red(credentials.key));
        console.log(chalk.green('Generated iv:'), chalk.red(credentials.iv));
        await saveCredential(credentials, options.save, options.type);
    }
};
